// SPDX-FileCopyrightText: 2026 Miguel Euraque
// SPDX-License-Identifier: MIT

import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'

import { contrast } from './helpers/contrast.mjs'

// ---------------------------------------------------------------------------
// Minimal YAML reader (no external dependencies: the package is `private` and
// carries no `dependencies`). The skins are flat YAML — top-level scalars,
// one-level nested maps, and `|` block scalars — which is all this parses.
// Anything more exotic should be treated as a schema failure, not parsed here.
// ---------------------------------------------------------------------------
const parseSkinYaml = text => {
  const root = {}
  let section = null // nested map currently being filled
  let block = null // { key, indent, lines } while consuming a `|` block scalar

  const scalar = value => {
    const trimmed = value.trim()
    if (trimmed.length >= 2 && ((trimmed[0] === '"' && trimmed.at(-1) === '"') || (trimmed[0] === "'" && trimmed.at(-1) === "'"))) {
      return trimmed.slice(1, -1)
    }
    return trimmed
  }

  for (const line of text.split('\n')) {
    if (block) {
      if (line.trim() === '') {
        block = null // blank line ends a block scalar in these files
        continue
      }
      if (block.indent === null) {
        block.indent = line.match(/^ */)[0].length
      }
      if (line.startsWith(' '.repeat(block.indent))) {
        block.lines.push(line.slice(block.indent))
        continue
      }
      block = null // dedented line ends the block; fall through and parse it normally
    }

    const blockMatch = line.match(/^([A-Za-z_][\w]*): \|$/)
    if (blockMatch) {
      block = { key: blockMatch[1], indent: null, lines: [] }
      root[blockMatch[1]] = block.lines
      continue
    }

    if (line.startsWith('#') || line.trim() === '') continue // comment or blank

    const sectionMatch = line.match(/^([A-Za-z_][\w]*):$/)
    if (sectionMatch) {
      section = sectionMatch[1]
      root[section] = {}
      continue
    }

    const entryMatch = line.match(/^ {2}([A-Za-z_][\w]*): (.*)$/)
    if (entryMatch && section) {
      root[section][entryMatch[1]] = scalar(entryMatch[2])
      continue
    }

    const scalarMatch = line.match(/^([A-Za-z_][\w]*): (.*)$/)
    if (scalarMatch) {
      root[scalarMatch[1]] = scalar(scalarMatch[2])
      continue
    }

    assert.fail(`unparsed YAML line: ${JSON.stringify(line)}`)
  }
  return root
}

const skinFiles = ['nous-girl-light', 'nous-girl-dark']
const skins = Object.fromEntries(
  await Promise.all(skinFiles.map(async name => [
    name,
    parseSkinYaml(await readFile(new URL(`../skins/${name}.yaml`, import.meta.url), 'utf8'))
  ]))
)

// The colour key set a skin must define. Taken from hermes_cli/skin_engine.py:
// the CLI surface keys of the built-in `default` skin.
const EXPECTED_COLOR_KEYS = [
  'background', 'banner_accent', 'banner_border', 'banner_dim', 'banner_text',
  'banner_title', 'completion_menu_bg', 'completion_menu_current_bg', 'diff_added',
  'diff_removed', 'input_rule', 'prompt', 'response_border', 'selection_bg',
  'session_border', 'session_label', 'status_bar_bad', 'status_bar_bg',
  'status_bar_critical', 'status_bar_dim', 'status_bar_good', 'status_bar_strong',
  'status_bar_text', 'status_bar_warn', 'syntax_comment', 'syntax_keyword',
  'syntax_number', 'syntax_string', 'ui_accent', 'ui_border', 'ui_error', 'ui_label',
  'ui_ok', 'ui_text', 'ui_thinking', 'ui_tool', 'ui_warn', 'voice_status_bg'
]
assert.equal(EXPECTED_COLOR_KEYS.length, 38)

// Built-in skin names from _BUILTIN_SKINS in hermes_cli/skin_engine.py.
const BUILTIN_SKIN_NAMES = [
  'default', 'ares', 'mono', 'slate', 'daylight',
  'warm-lightmode', 'poseidon', 'sisyphus', 'charizard'
]

const stripBannerMarkup = row => row.replace(/\[#[0-9a-fA-F]{6}\]|\[\/\]/g, '')

for (const [name, skin] of Object.entries(skins)) {
  test(`${name}: declares a nous-girl-prefixed name and a non-empty description`, () => {
    assert.match(skin.name, /^nous-girl-/)
    assert.equal(skin.name, name)
    assert.ok(skin.description.trim().length > 0)
  })

  test(`${name}: defines all 38 colour keys as six-digit hex`, () => {
    assert.deepEqual(Object.keys(skin.colors).sort(), EXPECTED_COLOR_KEYS)
    for (const key of EXPECTED_COLOR_KEYS) {
      assert.match(skin.colors[key], /^#[0-9a-fA-F]{6}$/, `${key} must be a six-digit hex colour, got ${skin.colors[key]}`)
    }
  })

  test(`${name}: hero banner is 15 rows of at most 30 cells, each closed`, () => {
    assert.equal(skin.banner_hero.length, 15)
    for (const [index, row] of skin.banner_hero.entries()) {
      const cells = stripBannerMarkup(row).length
      assert.ok(cells <= 30, `hero row ${index + 1} is ${cells} cells (max 30): ${row}`)
      assert.ok(row.endsWith('[/]'), `hero row ${index + 1} must close its colour span`)
      assert.equal((row.match(/\[#[0-9a-fA-F]{6}\]/g) ?? []).length, 1, `hero row ${index + 1} must open exactly one colour span`)
    }
  })

  // The wordmark must be shipped, not inherited: without `banner_logo` the CLI
  // falls back to HERMES_AGENT_LOGO, whose colours are hardcoded to the built-in
  // gold and ignore the active skin entirely.
  test(`${name}: ships a 6-row wordmark in the theme's own colours`, () => {
    assert.equal(skin.banner_logo.length, 6)
    assert.ok(skin.banner_logo[0].startsWith('[bold #'), `first logo row must open with "[bold #", got ${skin.banner_logo[0].slice(0, 20)}`)
    for (const [index, row] of skin.banner_logo.entries()) {
      assert.ok(row.endsWith('[/]'), `logo row ${index + 1} must close its colour span`)
      assert.equal((row.match(/\[(?:bold )?#[0-9a-fA-F]{6}\]/g) ?? []).length, 1, `logo row ${index + 1} must open exactly one colour span`)
    }
  })

  // Art must resolve against the skin, not against the terminal's default
  // foreground: the ramp ends and its peak are palette values, and the rows
  // between them climb and fall monotonically so the mark still reads as one
  // gradient.
  const rowColours = rows => rows.map(row => row.match(/\[(?:bold )?(#[0-9a-fA-F]{6})\]/)[1].toLowerCase())

  test(`${name}: hero ramp starts, peaks and ends on palette colours`, () => {
    const palette = new Set(Object.values(skin.colors).map(value => value.toLowerCase()))
    const colours = rowColours(skin.banner_hero)
    const peak = (colours.length - 1) / 2
    for (const [index, colour] of colours.entries()) {
      if (index !== 0 && index !== peak && index !== colours.length - 1) continue
      assert.ok(palette.has(colour), `${name}: hero row ${index + 1} (${colour}) is not a skin palette colour`)
    }
    // Neighbouring rows may differ by at most 24 levels per channel: enough for
    // a 15-row ramp between palette endpoints, tight enough to catch a stop
    // that belongs to another theme.
    const step = (colour, reference) => Math.max(...[1, 3, 5].map(offset => Math.abs(
      Number.parseInt(colour.slice(offset, offset + 2), 16) - Number.parseInt(reference.slice(offset, offset + 2), 16))))
    const inner = colours.slice(0, Math.ceil(peak))
    for (let index = 1; index < inner.length; index += 1) {
      assert.ok(
        step(inner[index], inner[index - 1]) <= 24,
        `${name}: hero row ${index + 1} jumps away from the ramp (${inner[index - 1]} -> ${inner[index]})`
      )
    }
  })

  test(`${name}: every wordmark row uses a palette colour`, () => {
    const palette = new Set(Object.values(skin.colors).map(value => value.toLowerCase()))
    for (const [index, colour] of rowColours(skin.banner_logo).entries()) {
      assert.ok(palette.has(colour), `${name}: wordmark row ${index + 1} (${colour}) is not a skin palette colour`)
    }
  })

  test(`${name}: body text and status text stay readable on the background`, () => {
    const background = skin.colors.background
    const textRatio = contrast(skin.colors.ui_text, background)
    assert.ok(textRatio >= 4.5, `ui_text on background is ${textRatio.toFixed(3)}:1 (needs 4.5:1)`)
    for (const key of ['ui_warn', 'ui_error']) {
      const ratio = contrast(skin.colors[key], background)
      assert.ok(ratio >= 3, `${key} on background is ${ratio.toFixed(3)}:1 (needs 3:1)`)
    }
  })
}

test('skin names never collide with built-in or sibling-pack skins', () => {
  for (const name of Object.keys(skins)) {
    assert.ok(!BUILTIN_SKIN_NAMES.includes(name), `${name} collides with a built-in skin`)
    assert.ok(!name.startsWith('minimalist-'), `${name} collides with the minimalist-* family`)
    assert.ok(!name.startsWith('glass-'), `${name} collides with the glass-* family`)
  }
})

// ---------------------------------------------------------------------------
// Skins and Desktop theme are two vocabularies over one palette. These pairs
// are the values that exist in both layers; if a palette edit lands in
// plugin.js without the matching skin edit, the layers silently drift apart.
// ---------------------------------------------------------------------------
const source = await readFile(new URL('../desktop/plugin.js', import.meta.url), 'utf8')
const moduleSource = source.replace(
  "import { THEMES_AREA } from '@hermes/plugin-sdk'",
  "const THEMES_AREA = 'themes'"
)
const { nousGirlTheme } = await import(`data:text/javascript,${encodeURIComponent(moduleSource)}`)

const SHARED_PAIRS = [
  ['background', 'colors', 'background'],
  ['ui_text', 'colors', 'foreground'],
  ['banner_text', 'colors', 'foreground'],
  ['prompt', 'colors', 'foreground'],
  ['ui_accent', 'colors', 'primary'],
  ['banner_accent', 'colors', 'primary'],
  ['banner_title', 'colors', 'ring'],
  ['ui_label', 'colors', 'mutedForeground'],
  ['banner_dim', 'colors', 'mutedForeground'],
  ['syntax_comment', 'colors', 'mutedForeground'],
  ['ui_border', 'colors', 'border'],
  ['banner_border', 'colors', 'border'],
  ['input_rule', 'colors', 'input'],
  ['ui_tool', 'colors', 'midground'],
  ['completion_menu_bg', 'colors', 'card'],
  ['completion_menu_current_bg', 'colors', 'muted'],
  ['selection_bg', 'colors', 'accent'],
  ['ui_ok', 'terminal', 'green'],
  ['diff_added', 'terminal', 'green'],
  ['syntax_string', 'terminal', 'green'],
  ['ui_warn', 'terminal', 'yellow'],
  ['status_bar_warn', 'terminal', 'yellow'],
  ['ui_error', 'terminal', 'red'],
  ['diff_removed', 'terminal', 'red']
]

const modes = [
  ['nous-girl-light', nousGirlTheme.colors, nousGirlTheme.terminal],
  ['nous-girl-dark', nousGirlTheme.darkColors, nousGirlTheme.darkTerminal]
]

for (const [name, themeColors, themeTerminal] of modes) {
  test(`${name}: every shared value still matches the Desktop theme`, () => {
    const skin = skins[name]
    const blocks = { colors: themeColors, terminal: themeTerminal }
    for (const [skinKey, block, themeKey] of SHARED_PAIRS) {
      assert.equal(
        skin.colors[skinKey].toLowerCase(),
        blocks[block][themeKey].toLowerCase(),
        `${name}: ${skinKey} (${skin.colors[skinKey]}) drifted from the theme's ${block}.${themeKey} (${blocks[block][themeKey]})`
      )
    }
  })
}
