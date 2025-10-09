import { WebsiteAnalysis, ExtractedBranding, ColorInfo, FontInfo } from '@/types'

export class BrandingExtractor {
  static extractBranding(analysis: WebsiteAnalysis): ExtractedBranding {
    const colors = this.selectBrandColors(analysis.colors)
    const font = this.selectPrimaryFont(analysis.fonts)
    const logoUrl = this.selectLogo(analysis.logos)

    return {
      primaryColor: colors.primary,
      secondaryColor: colors.secondary,
      accentColor: colors.accent,
      backgroundColor: colors.background,
      textColor: colors.text,
      fontFamily: font,
      logoUrl,
      brandName: analysis.brandName
    }
  }

  private static selectBrandColors(colors: ColorInfo[]): {
    primary: string
    secondary: string
    accent: string
    background: string
    text: string
  } {
    if (colors.length === 0) {
      // Fallback colors
      return {
        primary: '#7C3AED',
        secondary: '#FF6B35',
        accent: '#00D9D9',
        background: '#FFFFFF',
        text: '#2D2D2D'
      }
    }

    // Sort by usage frequency
    const sortedColors = colors.sort((a, b) => b.usage - a.usage)

    // For unlock-your-song.de, we detected #f6cd6f (golden yellow) as most used
    // This seems to be their primary brand color
    const primary = sortedColors[0]?.hex || '#7C3AED'

    // Find contrasting colors for secondary
    const secondary = this.findContrastingColor(primary, sortedColors)

    // Use a vibrant color for accent
    const accent = this.findAccentColor(sortedColors)

    return {
      primary,
      secondary,
      accent,
      background: '#FFFFFF', // Always white background
      text: '#2D2D2D' // Always dark text
    }
  }

  private static findContrastingColor(primary: string, colors: ColorInfo[]): string {
    // Look for colors that contrast well with primary
    // For golden yellow (#f6cd6f), a purple or blue would work well
    const preferredContrasts = ['#7C3AED', '#3B82F6', '#6366F1']

    for (const contrast of preferredContrasts) {
      if (colors.find(c => c.hex.toLowerCase() === contrast.toLowerCase())) {
        return contrast
      }
    }

    // Fallback to second most used color or a default
    return colors[1]?.hex || '#FF6B35'
  }

  private static findAccentColor(colors: ColorInfo[]): string {
    // Look for bright, vibrant colors
    const vibrantColors = colors.filter(c => this.isVibrantColor(c.hex))

    if (vibrantColors.length > 0) {
      return vibrantColors[0].hex
    }

    // Default accent color
    return '#00D9D9'
  }

  private static isVibrantColor(hex: string): boolean {
    // Convert hex to HSL and check saturation and lightness
    const hsl = this.hexToHsl(hex)
    const [h, s, l] = hsl

    // High saturation and medium lightness = vibrant
    return s > 50 && l > 30 && l < 80
  }

  private static hexToHsl(hex: string): [number, number, number] {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    if (!result) return [0, 0, 0]

    let r = parseInt(result[1], 16) / 255
    let g = parseInt(result[2], 16) / 255
    let b = parseInt(result[3], 16) / 255

    const max = Math.max(r, g, b)
    const min = Math.min(r, g, b)
    let h = 0
    let s = 0
    const l = (max + min) / 2

    if (max !== min) {
      const d = max - min
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min)

      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break
        case g: h = (b - r) / d + 2; break
        case b: h = (r - g) / d + 4; break
      }
      h /= 6
    }

    return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)]
  }

  private static selectPrimaryFont(fonts: FontInfo[]): string {
    if (fonts.length === 0) {
      return 'Inter' // Default modern font
    }

    // Prefer Google Fonts over system fonts
    const googleFonts = fonts.filter(f => f.source === 'google')
    if (googleFonts.length > 0) {
      return googleFonts[0].family
    }

    // Prefer Inter if available (modern, clean)
    const interFont = fonts.find(f => f.family.toLowerCase().includes('inter'))
    if (interFont) {
      return interFont.family
    }

    // Return most common font
    return fonts[0].family
  }

  private static selectLogo(logos: any[]): string | undefined {
    if (logos.length === 0) return undefined

    // Return logo with highest confidence
    const bestLogo = logos.sort((a, b) => b.confidence - a.confidence)[0]
    return bestLogo.url
  }

  // Specific branding for unlock-your-song.de
  static extractUnlockYourSongBranding(analysis: WebsiteAnalysis): ExtractedBranding {
    return {
      primaryColor: '#f6cd6f', // Golden yellow from analysis
      secondaryColor: '#7C3AED', // Purple for contrast
      accentColor: '#00D9D9', // Teal accent
      backgroundColor: '#FFFFFF',
      textColor: '#2D2D2D',
      fontFamily: 'Inter', // Detected in analysis
      logoUrl: analysis.logos[0]?.url,
      brandName: 'Unlock Your Song'
    }
  }
}