// SPDX-FileCopyrightText: 2026 Miguel Euraque
// SPDX-License-Identifier: MIT

import { THEMES_AREA } from '@hermes/plugin-sdk'

// Nous Girl is a surface-and-colour theme: ink and paper in light, paper and
// ink in dark, and no type system of its own (the host fonts stay). Desktop
// carries no art, so the picker stays monochrome; the skins paint the banner
// from these same values.
export const nousGirlTheme = {
  name: 'nous-girl',
  label: 'Nous Girl',
  description: 'Monochrome ink and paper surfaces, with the Nous Girl in the banner',
  colors: {
    background: '#E6E1D3',
    foreground: '#161512',
    card: '#EDE9DD',
    cardForeground: '#161512',
    muted: '#D8D2C1',
    mutedForeground: '#5F5B52',
    popover: '#EDE9DD',
    popoverForeground: '#161512',
    primary: '#2B2924',
    primaryForeground: '#F5F2E9',
    secondary: '#D8D2C1',
    secondaryForeground: '#161512',
    accent: '#CFC9B8',
    accentForeground: '#161512',
    border: '#55524B',
    input: '#55524B',
    ring: '#161512',
    midground: '#2B2924',
    midgroundForeground: '#F5F2E9',
    composerRing: '#161512',
    destructive: '#9E2F22',
    destructiveForeground: '#FFFFFF',
    sidebarBackground: '#DFDACA',
    sidebarBorder: '#55524B',
    userBubble: '#CFC9B8',
    userBubbleBorder: '#55524B'
  },
  darkColors: {
    background: '#141412',
    foreground: '#F2EEE3',
    card: '#1C1B18',
    cardForeground: '#F2EEE3',
    muted: '#2E2C28',
    mutedForeground: '#A8A396',
    popover: '#1A1917',
    popoverForeground: '#F2EEE3',
    primary: '#E4DFD2',
    primaryForeground: '#141412',
    secondary: '#3A3833',
    secondaryForeground: '#E4DFD2',
    accent: '#2E2C28',
    accentForeground: '#F2EEE3',
    border: '#6E6B64',
    input: '#6E6B64',
    ring: '#F2EEE3',
    midground: '#D8D2C2',
    midgroundForeground: '#141412',
    composerRing: '#F2EEE3',
    destructive: '#BC4A3D',
    destructiveForeground: '#FFFFFF',
    sidebarBackground: '#1A1917',
    sidebarBorder: '#6E6B64',
    userBubble: '#2E2C28',
    userBubbleBorder: '#6E6B64'
  },
  terminal: {
    foreground: '#1F1E1A',
    cursor: '#55524B',
    selectionBackground: '#CFC9B8',
    black: '#161512',
    red: '#9E2F22',
    green: '#3B5B3E',
    yellow: '#7A5718',
    blue: '#2E4A6B',
    magenta: '#5B3F57',
    cyan: '#2F5657',
    white: '#6B6860',
    brightBlack: '#55524B',
    brightRed: '#8C2A1E',
    brightGreen: '#325032',
    brightYellow: '#6E4E15',
    brightBlue: '#274060',
    brightMagenta: '#50374C',
    brightCyan: '#294C4D',
    brightWhite: '#4A4842'
  },
  darkTerminal: {
    foreground: '#E4DFD2',
    cursor: '#F2EEE3',
    selectionBackground: '#3A3833',
    black: '#A8A396',
    red: '#EF7777',
    green: '#A5CBA4',
    yellow: '#DCC17F',
    blue: '#93B7E0',
    magenta: '#C9A6CE',
    cyan: '#9BCEC7',
    white: '#E4DFD2',
    brightBlack: '#8C877B',
    brightRed: '#FF9696',
    brightGreen: '#BFE0BE',
    brightYellow: '#F2DCA6',
    brightBlue: '#B3D0F0',
    brightMagenta: '#DCC0E0',
    brightCyan: '#B6E0DA',
    brightWhite: '#FFFFFF'
  }
}

export default {
  id: 'nous-girl-theme',
  name: 'Nous Girl Theme',
  description: 'A monochrome ink-and-paper theme for Hermes Desktop.',
  register(ctx) {
    ctx.register({ id: 'nous-girl', area: THEMES_AREA, data: nousGirlTheme })
  }
}
