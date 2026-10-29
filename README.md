# Nous Girl Theme for Hermes

Nous Girl is a monochrome theme for Hermes. Ink on paper in light mode, paper on ink in dark mode, with a single warm accent: the gold of the Nous Girl herself, which appears only in the CLI banner.

The package uses Hermes' native Desktop Plugin SDK. It registers one `DesktopTheme` in `THEMES_AREA` with a light palette, a real dark palette and a matching ANSI terminal pair for each mode. It does not modify Hermes core, inject a stylesheet, ship fonts, or touch the DOM.

## Features

- One theme, **Nous Girl**, with genuine light and dark palettes in Hermes' native theme picker.
- CLI/TUI skins `nous-girl-light` and `nous-girl-dark` for the Hermes Agent terminal, each carrying the character as braille banner art.
- Target contrast of at least 4.5:1 for normal text and 3:1 for controls, icons, and focus states, verified in the test suite.
- Terminal palettes derived from the same values as the interface, so the embedded terminal never drifts from the theme.

The theme is colours only. The Desktop palettes carry no art and no typography override: the host keeps its own fonts, and the character belongs to the terminal banner.

## Compatibility

Nous Girl requires Hermes Desktop and Hermes Agent `>=0.21.3`. It is a unified package: `plugin.yaml` describes the package, `__init__.py` is an inert compatibility entry point for the Agent loader, and `desktop/plugin.js` registers the Desktop theme. The same package ships two CLI/TUI skins for the Agent terminal (see **CLI and TUI skins** below). The Agent entry point registers no tools and changes no configuration.

Install only code that you have reviewed. Plugins run in the Desktop process, so retain access to the repository in case you need to remove the package.

## Install from GitHub

Install the published repository with Hermes' plugin CLI, then enable the package:

```bash
hermes plugins install mykeura/nous-girl-theme-for-hermes --no-enable
hermes plugins enable nous-girl-theme
```

Hermes installs the package at `$HERMES_HOME/plugins/nous-girl-theme`; no manual copying of `desktop/plugin.js` is required. Reopen Hermes Desktop and select **Nous Girl** in the native theme picker. If the theme is missing or still shows an older description after an update, use **⌘K → Reload desktop plugins**.

To revert, select another Desktop theme. To disable or remove the package, run `hermes plugins disable nous-girl-theme` or `hermes plugins remove nous-girl-theme`. Do not edit or delete Hermes core files.

## CLI and TUI skins

The package ships two skins for the Hermes Agent CLI and TUI: `nous-girl-light` and `nous-girl-dark`. Both carry the character as a 15-row braille hero alongside the full colour palette.

Hermes only reads skins from `~/.hermes/skins/`, so the skins that travel inside the plugin are not picked up automatically. Copy them once after installing, and again after every plugin update:

```bash
mkdir -p ~/.hermes/skins
cp ~/.hermes/plugins/nous-girl-theme/skins/*.yaml ~/.hermes/skins/
```

The path uses the plugin's manifest name, `nous-girl-theme` — not the repository directory name.

Then list the available skins and activate one:

```bash
hermes skin list
hermes skin use nous-girl-dark
```

Inside a running session, `/skin nous-girl-dark` switches skins without leaving the TUI.

The copy inherits whatever version is installed: check `hermes plugins list` and confirm it shows the version you expect **before** copying. If the installed plugin is older than the release you followed, the commands above still succeed and silently overwrite your skins with stale colours — there is no error or warning.

`nous-girl-light` is designed for light terminals. On a black background its dark ink is not legible; use `nous-girl-dark` there.

Picking a CLI skin also moves the Desktop appearance, because `display.skin` is shared per profile. The Desktop theme is `nous-girl`, so it keeps both palettes: the light or dark half is chosen by the app's appearance setting, not by which skin the terminal is using.

## Palette design

| Role | Light | Dark |
| --- | --- | --- |
| Surface | `#E6E1D3` paper | `#141412` ink |
| Text | `#161512` ink | `#F2EEE3` bone |
| Focus / rules | `#161512` | `#F2EEE3` |
| Hairline border | `#55524B` | `#6E6B64` |
| Destructive | `#9E2F22` | `#BC4A3D` |

The interface is deliberately achromatic: hierarchy comes from value, not hue, so the palette stays calm next to code, diffs and terminal output. The one colour in the package is the character's gold ramp, and it lives in the skins' `banner_hero` only. The light skin uses a darker brass ramp of the same hues, because `#FFD700` on paper measures 1.07:1 and would be invisible.

## Development and verification

The Desktop SDK loads `desktop/plugin.js` directly, without a build step, and the skins are maintained by hand. Run the following checks before a release:

```bash
npm run check
npm test
hermes plugins validate .
hermes plugins doctor . --ci
```

`npm test` includes the contrast gate for both modes and a cross-check that keeps every value shared between the skins and `desktop/plugin.js` identical. Static checks do not replace a visual check in a compatible Hermes Desktop session.

## A small way to support the project

If you are considering the Nous Portal **Plus** plan, you can use [my Nous Portal referral link](https://portal.nousresearch.com/r/mykeura). Your first month costs **$5 instead of $20**, and I receive a $10 referral credit that helps cover the API usage behind my ongoing work on Nous Girl and related Hermes plugins. It is entirely optional, but it is a simple way for both of us to benefit.

The offer is for new customers starting a new Plus subscription. It applies to the first invoice, and each payment card can be used for only one referral. If the card has already backed another referral, the discount is reversed and no referral reward is paid.

If you would rather support my work directly, you can also [sponsor me on GitHub](https://github.com/sponsors/mykeura). Every bit helps me keep building and maintaining these open-source plugins. Thank you!

## License

This project is licensed under the [MIT License](LICENSE).
