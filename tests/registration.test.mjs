// SPDX-FileCopyrightText: 2026 Miguel Euraque
// SPDX-License-Identifier: MIT

import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'

const source = await readFile(new URL('../desktop/plugin.js', import.meta.url), 'utf8')
const moduleSource = source.replace(
  "import { THEMES_AREA } from '@hermes/plugin-sdk'",
  "const THEMES_AREA = 'themes'"
)
const plugin = await import(`data:text/javascript,${encodeURIComponent(moduleSource)}`)

test('registers exactly one native Nous Girl theme contribution', () => {
  const registrations = []
  const ctx = { register: contribution => registrations.push(contribution) }

  plugin.default.register(ctx)

  assert.equal(plugin.default.id, 'nous-girl-theme')
  assert.equal(registrations.length, 1)
  assert.equal(registrations[0].area, 'themes')
  assert.equal(registrations[0].id, 'nous-girl')
  assert.equal(registrations[0].data.name, 'nous-girl')
  assert.equal(registrations[0].data.label, 'Nous Girl')
  assert.equal(registrations[0].data.description, 'Ink and paper surfaces with a single gold accent')
  assert.equal(registrations[0].data.customCSS, undefined)
  assert.ok(registrations[0].data.darkColors)
  assert.ok(registrations[0].data.terminal)
  assert.ok(registrations[0].data.darkTerminal)
})

test('declares the full 26-key palette for both modes', () => {
  const expected = [
    'accent', 'accentForeground', 'background', 'border', 'card', 'cardForeground', 'composerRing',
    'destructive', 'destructiveForeground', 'foreground', 'input', 'midground', 'midgroundForeground',
    'muted', 'mutedForeground', 'popover', 'popoverForeground', 'primary', 'primaryForeground', 'ring',
    'secondary', 'secondaryForeground', 'sidebarBackground', 'sidebarBorder', 'userBubble', 'userBubbleBorder'
  ]
  assert.deepEqual(Object.keys(plugin.nousGirlTheme.colors).sort(), expected)
  assert.deepEqual(Object.keys(plugin.nousGirlTheme.darkColors).sort(), expected)
})

test('light and dark are genuinely different palettes', () => {
  const light = plugin.nousGirlTheme.colors
  const dark = plugin.nousGirlTheme.darkColors
  assert.notEqual(light.background, dark.background)
  assert.notEqual(light.foreground, dark.foreground)
})

test('uses host-owned theme markers and does not inject or observe the DOM', () => {
  assert.doesNotMatch(source, /MutationObserver|createElement|appendChild|document\./)
})
