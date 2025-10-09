import puppeteer, { Browser, Page } from 'puppeteer'
import { WebsiteAnalysis, ColorInfo, FontInfo, LogoInfo, SiteMetadata } from '@/types'

export class WebsiteAnalyzer {
  private browser: Browser | null = null

  async initialize(): Promise<void> {
    if (!this.browser) {
      this.browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      })
    }
  }

  async close(): Promise<void> {
    if (this.browser) {
      await this.browser.close()
      this.browser = null
    }
  }

  async analyzeWebsite(url: string): Promise<WebsiteAnalysis> {
    await this.initialize()

    if (!this.browser) {
      throw new Error('Browser not initialized')
    }

    const page = await this.browser.newPage()

    try {
      console.log(`Analyzing website: ${url}`)

      // Set viewport for consistent analysis
      await page.setViewport({ width: 1920, height: 1080 })

      // Navigate to the website
      await page.goto(url, {
        waitUntil: 'networkidle0',
        timeout: 30000
      })

      // Extract metadata
      const metadata = await this.extractMetadata(page, url)

      // Extract colors
      const colors = await this.extractColors(page)

      // Extract fonts
      const fonts = await this.extractFonts(page)

      // Extract logos
      const logos = await this.extractLogos(page)

      // Take screenshot
      const screenshot = await page.screenshot({ encoding: 'base64' })

      return {
        url,
        brandName: metadata.title || 'Unknown Brand',
        colors,
        fonts,
        logos,
        screenshots: [`data:image/png;base64,${screenshot}`],
        metadata
      }

    } catch (error) {
      console.error('Error analyzing website:', error)
      throw new Error(`Failed to analyze website: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      await page.close()
    }
  }

  private async extractMetadata(page: Page, url: string): Promise<SiteMetadata> {
    const metadata = await page.evaluate(() => {
      const getMetaContent = (name: string) => {
        const meta = document.querySelector(`meta[name="${name}"], meta[property="${name}"]`)
        return meta?.getAttribute('content') || undefined
      }

      const title = document.title ||
                   getMetaContent('og:title') ||
                   getMetaContent('twitter:title') ||
                   'Unknown Title'

      const description = getMetaContent('description') ||
                         getMetaContent('og:description') ||
                         getMetaContent('twitter:description') ||
                         ''

      const ogImage = getMetaContent('og:image') || getMetaContent('twitter:image')
      const favicon = document.querySelector('link[rel="icon"]')?.getAttribute('href') ||
                     document.querySelector('link[rel="shortcut icon"]')?.getAttribute('href')

      return {
        title,
        description,
        ogImage,
        favicon
      }
    })

    const domain = new URL(url).hostname

    return {
      ...metadata,
      favicon: metadata.favicon || undefined,
      domain
    }
  }

  private async extractColors(page: Page): Promise<ColorInfo[]> {
    const colors = await page.evaluate(() => {
      const colorMap = new Map<string, number>()

      // Helper functions defined inside evaluate
      const hexToRgb = (hex: string): string => {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
        if (!result) return hex

        const r = parseInt(result[1], 16)
        const g = parseInt(result[2], 16)
        const b = parseInt(result[3], 16)

        return `rgb(${r}, ${g}, ${b})`
      }

      const hexToHsl = (hex: string): string => {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
        if (!result) return hex

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

        return `hsl(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`
      }

      // Function to extract color from CSS value
      const extractColor = (cssColor: string) => {
        if (!cssColor || cssColor === 'transparent' || cssColor === 'none') return

        // Handle rgb/rgba
        const rgbMatch = cssColor.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*[\d.]+)?\)/)
        if (rgbMatch) {
          const r = parseInt(rgbMatch[1])
          const g = parseInt(rgbMatch[2])
          const b = parseInt(rgbMatch[3])
          const hex = `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`
          colorMap.set(hex, (colorMap.get(hex) || 0) + 1)
          return
        }

        // Handle hex colors
        const hexMatch = cssColor.match(/#([a-fA-F0-9]{3,8})/)
        if (hexMatch) {
          let hex = hexMatch[1]
          if (hex.length === 3) hex = hex.split('').map(c => c + c).join('')
          if (hex.length === 6 || hex.length === 8) {
            colorMap.set(`#${hex.substring(0, 6)}`, (colorMap.get(`#${hex.substring(0, 6)}`) || 0) + 1)
          }
        }
      }

      // Get all elements and their computed styles
      const elements = document.querySelectorAll('*')
      elements.forEach(element => {
        const styles = window.getComputedStyle(element)

        // Extract colors from various properties
        extractColor(styles.color)
        extractColor(styles.backgroundColor)
        extractColor(styles.borderColor)
        extractColor(styles.borderTopColor)
        extractColor(styles.borderRightColor)
        extractColor(styles.borderBottomColor)
        extractColor(styles.borderLeftColor)
      })

      // Convert to array and sort by frequency
      return Array.from(colorMap.entries())
        .map(([hex, usage]) => ({
          hex,
          rgb: hexToRgb(hex),
          hsl: hexToHsl(hex),
          usage
        }))
        .sort((a, b) => b.usage - a.usage)
        .slice(0, 10) // Top 10 colors
    })

    return colors
  }

  private async extractFonts(page: Page): Promise<FontInfo[]> {
    const fonts = await page.evaluate(() => {
      const fontMap = new Map<string, { weight: string, source: string }>()

      const elements = document.querySelectorAll('*')
      elements.forEach(element => {
        const styles = window.getComputedStyle(element)
        const fontFamily = styles.fontFamily
        const fontWeight = styles.fontWeight

        if (fontFamily && fontFamily !== 'inherit') {
          // Split font stack and take first font
          const primaryFont = fontFamily.split(',')[0].trim().replace(/['"]/g, '')

          if (!fontMap.has(primaryFont)) {
            // Determine font source
            let source: 'google' | 'local' | 'system' = 'system'
            if (document.querySelector(`link[href*="fonts.googleapis.com"]`)) {
              source = 'google'
            } else if (primaryFont.includes(' ') || primaryFont.length > 20) {
              source = 'local'
            }

            fontMap.set(primaryFont, {
              weight: fontWeight,
              source
            })
          }
        }
      })

      return Array.from(fontMap.entries()).map(([family, info]) => ({
        family,
        weight: info.weight,
        source: info.source as 'google' | 'local' | 'system'
      }))
    })

    return fonts
  }

  private async extractLogos(page: Page): Promise<LogoInfo[]> {
    const logos = await page.evaluate(() => {
      const logoCandidates: LogoInfo[] = []

      // Look for common logo selectors
      const selectors = [
        'img[alt*="logo" i]',
        'img[src*="logo" i]',
        'img[class*="logo" i]',
        'img[id*="logo" i]',
        '.logo img',
        '#logo img',
        'header img',
        'nav img'
      ]

      selectors.forEach(selector => {
        const images = document.querySelectorAll(selector)
        images.forEach(img => {
          const src = (img as HTMLImageElement).src
          const alt = (img as HTMLImageElement).alt || ''

          if (src && !src.includes('data:') && !logoCandidates.find(l => l.url === src)) {
            // Determine position
            let position: 'header' | 'footer' | 'other' = 'other'
            if (img.closest('header, nav')) position = 'header'
            else if (img.closest('footer')) position = 'footer'

            logoCandidates.push({
              url: src,
              type: src.includes('.svg') ? 'svg' : 'image',
              position,
              confidence: alt.toLowerCase().includes('logo') ? 0.9 : 0.7
            })
          }
        })
      })

      // Sort by confidence and return top candidates
      return logoCandidates
        .sort((a, b) => b.confidence - a.confidence)
        .slice(0, 3)
    })

    return logos
  }
}
