# Changelog

All notable changes to this project are documented in this file. The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.1] - 2026-10-28

### Fixed

- The CLI banner now takes its colours from the theme instead of the built-in gold. Both skins ship `banner_logo`, so the Hermes wordmark no longer falls back to `HERMES_AGENT_LOGO`, whose colours are hardcoded and ignore the active skin.
- The hero art of the Nous Girl is painted with a value ladder taken from the skin's own palette (smoke to bone in dark, ash to ink in light) instead of the logo's source gold, which was indistinguishable from the default banner on a monochrome theme.

### Changed

- The theme description reads "Monochrome ink and paper surfaces, with the Nous Girl in the banner".
- The test suite now gates the wordmark (six rows, one colour span per row, palette values only) and the hero ramp endpoints, and covers 24 assertions.

## [0.1.0] - 2026-10-28

### Added

- **Nous Girl** Desktop theme with a genuine light palette (ink on paper) and a genuine dark palette (paper on ink), plus an ANSI terminal pair for each mode.
- CLI/TUI skins `nous-girl-light` and `nous-girl-dark`, both carrying the character as a 15-row braille hero in a gold ramp, tuned per polarity: the vivid gold for dark terminals, a darker brass of the same hues for light ones.
- Inert Agent entry point (`__init__.py`) so the plugin loads under Hermes Agent without registering tools, hooks or settings.
- Test suite covering registration, the 26-key palette in both modes, the 38-key skin schema, banner geometry, WCAG contrast for interface and terminal, and a cross-check that keeps the values shared by the skins and `desktop/plugin.js` identical.

[0.1.0]: https://github.com/mykeura/nous-girl/releases/tag/v0.1.0
[0.1.1]: https://github.com/mykeura/nous-girl/releases/tag/v0.1.1
