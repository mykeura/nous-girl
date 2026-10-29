# Contributing to Nous Girl

Design decisions, package layout and the checks that gate a release. User-facing documentation lives in [README.md](README.md).

## What the package is

Nous Girl uses Hermes' native Desktop Plugin SDK. It registers one `DesktopTheme` in `THEMES_AREA` with a light palette, a real dark palette and a matching ANSI terminal pair for each mode. It does not modify Hermes core, inject a stylesheet, ship fonts, or touch the DOM.

The package is unified:

| Path | Role |
| --- | --- |
| `plugin.yaml` | Manifest: name `nous-girl-theme`, version, requirements. |
| `desktop/plugin.js` | Registers the Desktop theme. Loaded directly by the SDK, no build step. |
| `skins/*.yaml` | CLI/TUI skins `nous-girl-light` and `nous-girl-dark`, maintained by hand. |
| `__init__.py` | Inert compatibility entry point for the Agent loader. Registers no tools and changes no configuration. |
| `tests/` | Contrast gate, registration check and a cross-check between skins and `desktop/plugin.js`. |

## Palette

| Role | Light | Dark |
| --- | --- | --- |
| Surface | `#E6E1D3` paper | `#141412` ink |
| Text | `#161512` ink | `#F2EEE3` bone |
| Focus / rules | `#161512` | `#F2EEE3` |
| Hairline border | `#55524B` | `#6E6B64` |
| Destructive | `#9E2F22` | `#BC4A3D` |

The interface is deliberately achromatic: hierarchy comes from value, not hue, so the palette stays calm next to code, diffs and terminal output. The Desktop palettes carry no art and no typography override — the host keeps its own fonts, and the character belongs to the terminal banner.

## Banner art

Both skins ship `banner_hero` and `banner_logo`, and every ramp stop is a value from that skin's palette: the dark skin climbs from `#6E6B64` to `#F2EEE3` at the centre of the figure, the light skin from `#5F5B52` to `#161512`.

Shipping both keys is not cosmetic. When a skin omits `banner_logo`, the CLI falls back to `HERMES_AGENT_LOGO`, whose colours are hardcoded to the built-in gold and ignore the active skin — which is why an unthemed wordmark keeps appearing next to themed art.

## Verification

The test suite is development-only and is not published with the plugin: it lives in `tests/` on the author's working copy and is excluded by `.gitignore`. A clone of this repository ships the manifest, the Desktop theme and the two skins — nothing else.

Run before every release:

```bash
npm run check
npm test
hermes plugins validate .
hermes plugins doctor . --ci
```

`npm test` includes the contrast gate for both modes and a cross-check that keeps every value shared between the skins and `desktop/plugin.js` identical. Static checks do not replace a visual check in a compatible Hermes Desktop session.

## Release checklist

1. Bump the version in both `package.json` and `plugin.yaml` — they must match.
2. Update `CHANGELOG.md`.
3. Run the verification commands above.
4. Commit, tag the release, and push the tag.
5. Users must re-run the skin copy step after updating: the plugin ships the skins, but Hermes only reads `~/.hermes/skins/`.
