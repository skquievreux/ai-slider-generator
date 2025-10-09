import { NextRequest, NextResponse } from 'next/server'
import { WebsiteAnalyzer } from '@/lib/website-analyzer'
import { BrandingExtractor } from '@/lib/branding-extractor'
import { TemplateManager } from '@/lib/template-manager'
import { createUserGoogleServices } from '@/lib/user-auth'
import { ExtractedBranding } from '@/types'

const analyzer = new WebsiteAnalyzer()

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { url, templateName } = body

    if (!url) {
      return NextResponse.json(
        { error: 'URL is required' },
        { status: 400 }
      )
    }

    console.log(`Generating template from: ${url}`)

    // Step 1: Analyze website
    console.log('Step 1: Analyzing website...')
    const analysis = await analyzer.analyzeWebsite(url)

    // Step 2: Extract branding
    console.log('Step 2: Extracting branding...')
    let branding: ExtractedBranding

    // Special handling for unlock-your-song.de
    if (url.includes('unlock-your-song.de')) {
      branding = BrandingExtractor.extractUnlockYourSongBranding(analysis)
    } else {
      branding = BrandingExtractor.extractBranding(analysis)
    }

    console.log('Extracted branding:', branding)

    // Step 3: Create Google Slides template
    console.log('Step 3: Creating Google Slides template...')
    const templateId = await createGoogleSlidesTemplate(branding, templateName || `${branding.brandName} Template`)

    // Step 4: Save template configuration
    console.log('Step 4: Saving template configuration...')
    const template = {
      id: `website-${Date.now()}`,
      name: templateName || `${branding.brandName} Template`,
      description: `Auto-generated template from ${url}`,
      version: '1.0.0',
      branding: {
        colors: {
          primary: branding.primaryColor,
          secondary: branding.secondaryColor,
          accent: branding.accentColor,
          background: branding.backgroundColor,
          backgroundAlt: '#F5F5F5',
          text: branding.textColor,
          textLight: '#6B7280',
          success: '#10B981',
          warning: '#F59E0B'
        },
        fonts: {
          heading: branding.fontFamily,
          headingWeight: '700',
          body: branding.fontFamily,
          bodyWeight: '400',
          mono: 'Roboto Mono'
        },
        logos: {
          main: branding.logoUrl || '',
          icon: branding.logoUrl || '',
          footer: branding.logoUrl || ''
        },
        assets: {
          iconStyle: 'rounded',
          borderRadius: '12px',
          shadowStyle: 'subtle'
        }
      },
      layouts: {} // Will be populated with default layouts
    }

    TemplateManager.addTemplate(template)

    console.log(`Template created successfully: ${templateId}`)

    return NextResponse.json({
      success: true,
      template: {
        id: template.id,
        name: template.name,
        googleSlidesId: templateId,
        googleSlidesUrl: `https://docs.google.com/presentation/d/${templateId}/edit`,
        branding
      }
    })

  } catch (error) {
    console.error('Template generation error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Template generation failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

async function createGoogleSlidesTemplate(branding: ExtractedBranding, title: string): Promise<string> {
  const { slides } = await createUserGoogleServices()

  // Create new presentation
  const presentation = await slides.presentations.create({
    requestBody: {
      title
    }
  })

  const presentationId = presentation.data.presentationId!
  console.log(`Created presentation: ${presentationId}`)

  // Create title slide
  await createTitleSlide(slides, presentationId, branding)

  // Create content slides
  await createContentSlides(slides, presentationId, branding)

  // Apply theme colors
  await applyTheme(slides, presentationId, branding)

  return presentationId
}

async function createTitleSlide(slides: any, presentationId: string, branding: ExtractedBranding) {
  // Create title slide with branding
  const requests = [
    {
      createSlide: {
        slideLayoutReference: {
          predefinedLayout: 'TITLE_AND_TWO_COLUMNS'
        }
      }
    }
  ]

  const response = await slides.presentations.batchUpdate({
    presentationId,
    requestBody: { requests }
  })

  const slideId = response.data.replies![0].createSlide!.objectId!

  // Add title content
  const contentRequests = [
    {
      insertText: {
        objectId: slideId,
        text: branding.brandName,
        insertionIndex: 0
      }
    },
    {
      updateTextStyle: {
        objectId: slideId,
        style: {
          fontSize: {
            magnitude: 54,
            unit: 'PT'
          },
          foregroundColor: {
            opaqueColor: {
              rgbColor: hexToRgb(branding.textColor)
            }
          },
          fontFamily: branding.fontFamily
        },
        fields: 'fontSize,foregroundColor,fontFamily'
      }
    }
  ]

  await slides.presentations.batchUpdate({
    presentationId,
    requestBody: { requests: contentRequests }
  })
}

async function createContentSlides(slides: any, presentationId: string, branding: ExtractedBranding) {
  // Create sample content slides
  const layouts = ['TITLE_AND_BODY', 'TITLE_AND_TWO_COLUMNS', 'BIG_NUMBER']

  for (const layout of layouts) {
    const requests = [
      {
        createSlide: {
          slideLayoutReference: {
            predefinedLayout: layout
          }
        }
      }
    ]

    await slides.presentations.batchUpdate({
      presentationId,
      requestBody: { requests }
    })
  }
}

async function applyTheme(slides: any, presentationId: string, branding: ExtractedBranding) {
  // Apply custom theme colors
  const requests = [
    {
      updatePageProperties: {
        objectId: presentationId,
        pageProperties: {
          pageBackgroundFill: {
            solidFill: {
              color: {
                rgbColor: hexToRgb(branding.backgroundColor)
              }
            }
          }
        },
        fields: 'pageBackgroundFill'
      }
    }
  ]

  await slides.presentations.batchUpdate({
    presentationId,
    requestBody: { requests }
  })
}

function hexToRgb(hex: string) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  if (!result) return { red: 1, green: 1, blue: 1 }

  return {
    red: parseInt(result[1], 16) / 255,
    green: parseInt(result[2], 16) / 255,
    blue: parseInt(result[3], 16) / 255
  }
}