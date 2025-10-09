export interface PresentationFormData {
  topic: string
  slideCount: number
  style: string
  templateId: string
}

export interface Slide {
  id: string
  type: 'title' | 'content' | 'image' | 'chart' | 'big_number'
  layout: string
  content: {
    title?: string
    body?: string[]
    image?: ImageData
    chart?: ChartData
  }
}

export interface Presentation {
  title: string
  theme: string
  slides: Slide[]
}

export interface ImageData {
  url: string
  alt: string
}

export interface ChartData {
  type: 'bar' | 'line' | 'pie'
  data: any
}

export interface TemplateConfig {
  id: string
  name: string
  branding: {
    colors: Record<string, string>
    fonts: Record<string, string>
    logos: Record<string, string>
  }
  layouts: Record<string, LayoutConfig>
}

export interface LayoutConfig {
  id: string
  name: string
  description: string
  elements: ElementConfig[]
}

export interface ElementConfig {
  type: 'text' | 'image' | 'shape'
  name: string
  position: string
  style?: Record<string, any>
  [key: string]: any
}

export interface SlideLayout {
  id: string
  name: string
  description: string
  elements: ElementConfig[]
}

export interface ExportUrls {
  googleSlides?: string
  pdf?: string
  pptx?: string
}

export interface WebsiteAnalysis {
  url: string
  brandName: string
  colors: ColorInfo[]
  fonts: FontInfo[]
  logos: LogoInfo[]
  screenshots: string[]
  metadata: SiteMetadata
}

export interface ColorInfo {
  hex: string
  rgb: string
  hsl: string
  usage: number
  name?: string
}

export interface FontInfo {
  family: string
  weight: string
  source: 'google' | 'local' | 'system'
  url?: string
}

export interface LogoInfo {
  url: string
  type: 'image' | 'svg'
  position: 'header' | 'footer' | 'other'
  confidence: number
}

export interface SiteMetadata {
  title: string
  description: string
  ogImage?: string
  favicon?: string
  domain: string
}

export interface ExtractedBranding {
  primaryColor: string
  secondaryColor: string
  accentColor: string
  backgroundColor: string
  textColor: string
  fontFamily: string
  logoUrl?: string
  brandName: string
}

export interface GeneratedTemplate {
  id: string
  name: string
  sourceUrl: string
  googleSlidesId?: string
  branding: ExtractedBranding
  layouts: SlideLayout[]
  createdAt: Date
  status: 'generating' | 'ready' | 'error'
}