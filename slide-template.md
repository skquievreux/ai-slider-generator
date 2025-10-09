{
"templateConfig": {
"id": "techeroes-modern-2025",
"name": "Techeroes Modern",
"description": "Playful, tech-focused presentation template for Techeroes MINT education programs",
"version": "1.0.0",
"branding": {
"colors": {
"primary": "#00D9D9",
"secondary": "#FF6B35",
"accent": "#7C3AED",
"background": "#FFFFFF",
"backgroundAlt": "#F5F5F5",
"text": "#2D2D2D",
"textLight": "#6B7280",
"success": "#10B981",
"warning": "#F59E0B"
},
"fonts": {
"heading": "Poppins",
"headingWeight": "700",
"body": "Inter",
"bodyWeight": "400",
"mono": "Roboto Mono"
},
"logos": {
"main": "https://www.techeroes.de/logo-main.svg",
"icon": "https://www.techeroes.de/fox-icon.svg",
"footer": "https://www.techeroes.de/logo-horizontal.svg"
},
"assets": {
"iconStyle": "rounded",
"borderRadius": "12px",
"shadowStyle": "subtle"
}
},
"layouts": {
"title": {
"id": "TITLE_SLIDE",
"name": "Title Slide",
"description": "Opening slide with large title, subtitle, and brand elements",
"elements": [
{
"type": "shape",
"name": "background_gradient",
"position": "full",
"style": "gradient",
"colors": ["primary", "accent"]
},
{
"type": "image",
"name": "logo",
"position": "top-right",
"size": "medium"
},
{
"type": "text",
"name": "title",
"position": "center",
"fontSize": 54,
"fontWeight": "700",
"color": "white",
"alignment": "center"
},
{
"type": "text",
"name": "subtitle",
"position": "center-bottom",
"fontSize": 24,
"fontWeight": "400",
"color": "white",
"alignment": "center"
},
{
"type": "shape",
"name": "decorative_circles",
"position": "background",
"style": "geometric"
}
]
},
"section_header": {
"id": "SECTION_HEADER",
"name": "Section Header",
"description": "Divider slide between sections",
"elements": [
{
"type": "shape",
"name": "background",
"color": "primary",
"opacity": 0.1
},
{
"type": "text",
"name": "section_title",
"position": "center",
"fontSize": 48,
"fontWeight": "700",
"color": "primary"
},
{
"type": "shape",
"name": "accent_line",
"position": "bottom",
"color": "secondary",
"height": "8px"
}
]
},
"content_basic": {
"id": "TITLE_AND_BODY",
"name": "Content - Basic",
"description": "Standard content slide with title and bullet points",
"elements": [
{
"type": "text",
"name": "title",
"position": "top",
"fontSize": 36,
"fontWeight": "700",
"color": "text",
"marginTop": "40px",
"marginLeft": "60px"
},
{
"type": "text",
"name": "body",
"position": "main",
"fontSize": 18,
"fontWeight": "400",
"color": "text",
"lineHeight": "1.6",
"marginLeft": "60px",
"marginRight": "60px",
"bulletStyle": "custom",
"bulletColor": "primary"
},
{
"type": "image",
"name": "logo_footer",
"position": "bottom-right",
"size": "small",
"opacity": 0.4
}
]
},
"content_two_column": {
"id": "TITLE_AND_TWO_COLUMNS",
"name": "Content - Two Columns",
"description": "Two column layout for comparisons or parallel content",
"elements": [
{
"type": "text",
"name": "title",
"position": "top",
"fontSize": 36,
"fontWeight": "700",
"color": "text"
},
{
"type": "container",
"name": "left_column",
"position": "left",
"width": "45%",
"elements": [
{
"type": "text",
"name": "left_content",
"fontSize": 16
}
]
},
{
"type": "container",
"name": "right_column",
"position": "right",
"width": "45%",
"elements": [
{
"type": "text",
"name": "right_content",
"fontSize": 16
}
]
},
{
"type": "shape",
"name": "divider",
"position": "center-vertical",
"width": "2px",
"color": "primary",
"opacity": 0.3
}
]
},
"content_image": {
"id": "TITLE_BODY_AND_IMAGE",
"name": "Content with Image",
"description": "Text content with supporting image on the right",
"elements": [
{
"type": "text",
"name": "title",
"position": "top",
"fontSize": 36,
"fontWeight": "700",
"color": "text"
},
{
"type": "text",
"name": "body",
"position": "left",
"width": "50%",
"fontSize": 18
},
{
"type": "image",
"name": "main_image",
"position": "right",
"width": "45%",
"borderRadius": "12px",
"shadow": true
}
]
},
"big_number": {
"id": "BIG_NUMBER",
"name": "Big Number / Stat",
"description": "Highlight key metrics or statistics",
"elements": [
{
"type": "shape",
"name": "background_circle",
"position": "center",
"shape": "circle",
"color": "primary",
"opacity": 0.1,
"size": "large"
},
{
"type": "text",
"name": "number",
"position": "center-top",
"fontSize": 96,
"fontWeight": "800",
"color": "primary"
},
{
"type": "text",
"name": "label",
"position": "center-bottom",
"fontSize": 28,
"fontWeight": "600",
"color": "text"
},
{
"type": "text",
"name": "description",
"position": "bottom",
"fontSize": 16,
"fontWeight": "400",
"color": "textLight"
}
]
},
"quote": {
"id": "QUOTE_SLIDE",
"name": "Quote / Testimonial",
"description": "Highlight quotes or testimonials",
"elements": [
{
"type": "shape",
"name": "quote_mark",
"position": "top-left",
"icon": "quote",
"color": "primary",
"size": "80px",
"opacity": 0.2
},
{
"type": "text",
"name": "quote_text",
"position": "center",
"fontSize": 32,
"fontWeight": "500",
"color": "text",
"fontStyle": "italic",
"alignment": "center",
"maxWidth": "80%"
},
{
"type": "text",
"name": "author",
"position": "bottom-center",
"fontSize": 18,
"fontWeight": "600",
"color": "primary"
},
{
"type": "text",
"name": "author_title",
"position": "bottom-center",
"fontSize": 14,
"fontWeight": "400",
"color": "textLight"
}
]
},
"timeline": {
"id": "TIMELINE",
"name": "Timeline / Process",
"description": "Show sequential steps or timeline",
"elements": [
{
"type": "text",
"name": "title",
"position": "top",
"fontSize": 36,
"fontWeight": "700",
"color": "text"
},
{
"type": "shape",
"name": "timeline_line",
"position": "horizontal-center",
"width": "80%",
"height": "4px",
"color": "primary"
},
{
"type": "repeater",
"name": "timeline_items",
"count": 4,
"elements": [
{
"type": "shape",
"name": "step_circle",
"shape": "circle",
"color": "primary",
"size": "40px"
},
{
"type": "text",
"name": "step_title",
"fontSize": 18,
"fontWeight": "600"
},
{
"type": "text",
"name": "step_description",
"fontSize": 14
}
]
}
]
},
"comparison": {
"id": "COMPARISON",
"name": "Comparison / Pros & Cons",
"description": "Compare two options side by side",
"elements": [
{
"type": "text",
"name": "title",
"position": "top",
"fontSize": 36,
"fontWeight": "700",
"color": "text"
},
{
"type": "container",
"name": "left_side",
"position": "left",
"width": "48%",
"backgroundColor": "success",
"opacity": 0.1,
"borderRadius": "12px",
"padding": "24px"
},
{
"type": "container",
"name": "right_side",
"position": "right",
"width": "48%",
"backgroundColor": "warning",
"opacity": 0.1,
"borderRadius": "12px",
"padding": "24px"
}
]
},
"team": {
"id": "TEAM_SLIDE",
"name": "Team / People",
"description": "Showcase team members or speakers",
"elements": [
{
"type": "text",
"name": "title",
"position": "top",
"fontSize": 36,
"fontWeight": "700",
"color": "text"
},
{
"type": "grid",
"name": "team_grid",
"columns": 3,
"gap": "24px",
"elements": [
{
"type": "image",
"name": "photo",
"shape": "circle",
"size": "150px"
},
{
"type": "text",
"name": "name",
"fontSize": 18,
"fontWeight": "600",
"alignment": "center"
},
{
"type": "text",
"name": "role",
"fontSize": 14,
"color": "textLight",
"alignment": "center"
}
]
}
]
},
"cta": {
"id": "CALL_TO_ACTION",
"name": "Call to Action / Contact",
"description": "Final slide with contact info and CTA",
"elements": [
{
"type": "shape",
"name": "background_gradient",
"style": "gradient",
"colors": ["primary", "accent"]
},
{
"type": "image",
"name": "logo_large",
"position": "center-top",
"size": "large"
},
{
"type": "text",
"name": "cta_text",
"position": "center",
"fontSize": 42,
"fontWeight": "700",
"color": "white",
"alignment": "center"
},
{
"type": "text",
"name": "contact_info",
"position": "bottom",
"fontSize": 18,
"color": "white",
"alignment": "center"
},
{
"type": "shape",
"name": "cta_button",
"shape": "rounded-rect",
"backgroundColor": "secondary",
"padding": "16px 48px",
"text": "Jetzt anmelden!",
"textColor": "white"
}
]
}
},
"defaults": {
"fontSize": {
"h1": 48,
"h2": 36,
"h3": 28,
"body": 18,
"caption": 14,
"small": 12
},
"spacing": {
"slideMargin": "60px",
"elementGap": "24px",
"sectionGap": "48px"
},
"transitions": {
"default": "none",
"sectionBreak": "fade"
}
},
"brandGuidelines": {
"voiceAndTone": "Playful, encouraging, tech-savvy, inclusive",
"targetAudience": "Children (6-16), Parents, Educators",
"keyMessages": [
"MINT-Bildung für alle",
"Spielerisch die Zukunft gestalten",
"Von Kindern für die Zukunft"
],
"doNotUse": [
"Zu technische Sprache ohne Erklärung",
"Geschlechtsstereotype",
"Komplizierte Fachbegriffe ohne Kontext"
]
}
},
"exampleSlides": [
{
"slideNumber": 1,
"layout": "title",
"content": {
"title": "Programmieren lernen wie ein Superheld!",
"subtitle": "Techeroes FlexKurs • Scratch für Kids 8-12 Jahre"
}
},
{
"slideNumber": 2,
"layout": "section_header",
"content": {
"section_title": "Was ist Techeroes?"
}
},
{
"slideNumber": 3,
"layout": "content_image",
"content": {
"title": "Unsere Mission",
"body": [
"Kinder & Jugendliche für MINT begeistern",
"Spielerisch digitale Kompetenzen aufbauen",
"Kreativität und logisches Denken fördern",
"Superhelden der Zukunft ausbilden"
],
"image": "mission-image.jpg"
}
},
{
"slideNumber": 4,
"layout": "big_number",
"content": {
"number": "350€",
"label": "SmartCity Camp",
"description": "5 Tage vollgepackt mit Robotics, Coding & KI"
}
},
{
"slideNumber": 5,
"layout": "content_two_column",
"content": {
"title": "Unsere Programme",
"left_column": [
"🤖 Robotics & Coding",
"🎮 Game Development",
"🧠 KI verstehen & gestalten",
"🎨 3D-Design & Druck"
],
"right_column": [
"👧 Tech4Girls Workshops",
"🏕️ Feriencamps",
"📚 FlexKurse",
"🎂 Tech-Kindergeburtstage"
]
}
},
{
"slideNumber": 6,
"layout": "timeline",
"content": {
"title": "Ein typischer Camp-Tag",
"steps": [
{
"time": "09:00",
"title": "Mission starten",
"description": "Tägliche Challenge kennenlernen"
},
{
"time": "10:30",
"title": "Bauen & Coden",
"description": "Mit Robotern experimentieren"
},
{
"time": "12:30",
"title": "Mittagspause",
"description": "Gemeinsam essen & spielen"
},
{
"time": "14:00",
"title": "Präsentation",
"description": "Ergebnisse stolz zeigen"
}
]
}
},
{
"slideNumber": 7,
"layout": "quote",
"content": {
"quote": "Mein Kind konnte gar nicht aufhören, von den Robotern zu erzählen. Endlich mal sinnvolle Bildschirmzeit!",
"author": "Sandra M.",
"title": "Mutter von Leon (9 Jahre)"
}
},
{
"slideNumber": 8,
"layout": "cta",
"content": {
"cta_text": "Werde ein Techhero!",
"contact": "www.techeroes.de • [email protected]",
"button_text": "Jetzt anmelden!"
}
}
]
}
