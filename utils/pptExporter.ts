import pptxgen from "pptxgenjs";
import { SlideContent, LayoutType } from "../types";

// Helper to strip HTML and get text (simplified for this demo)
const stripHtml = (html: string) => {
  const tmp = document.createElement("DIV");
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || "";
};

// Helper to parse HTML string into PPTX text objects
// This is a basic parser that handles paragraphs, line breaks, and simple lists
const parseHtmlToPptText = (html: string, options: any = {}) => {
  if (!html) return [];
  
  const div = document.createElement('div');
  div.innerHTML = html;
  
  const textItems: any[] = [];
  
  // Recursively process nodes
  const processNode = (node: Node, currentOptions: any) => {
    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent?.trim();
      if (text) {
        textItems.push({ text: text, options: { ...currentOptions } });
      }
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      const el = node as HTMLElement;
      let newOptions = { ...currentOptions };
      
      // Handle basic styles
      if (el.tagName === 'B' || el.tagName === 'STRONG' || el.classList.contains('font-bold')) {
        newOptions.bold = true;
      }
      if (el.tagName === 'I' || el.tagName === 'EM') {
        newOptions.italic = true;
      }
      if (el.tagName === 'U') {
        newOptions.underline = true;
      }
      
      // Handle colors (simplified mapping for demo classes)
      if (el.classList.contains('text-cyan-400') || el.classList.contains('text-cyan-300')) newOptions.color = '22d3ee';
      if (el.classList.contains('text-blue-400') || el.classList.contains('text-blue-500')) newOptions.color = '3b82f6';
      if (el.classList.contains('text-purple-400')) newOptions.color = 'a855f7';
      if (el.classList.contains('text-orange-400')) newOptions.color = 'fb923c';
      if (el.classList.contains('text-slate-400')) newOptions.color = '94a3b8';
      
      // Handle block elements
      if (el.tagName === 'P' || el.tagName === 'DIV' || el.tagName === 'LI' || el.tagName === 'H1' || el.tagName === 'H2' || el.tagName === 'H3') {
        newOptions.breakLine = true;
      }
      
      if (el.tagName === 'LI') {
        newOptions.bullet = true;
        newOptions.indentLevel = 0; // Simple flat list
      }
      
      el.childNodes.forEach(child => processNode(child, newOptions));
      
      // Add a line break after block elements if not already handled
      if ((el.tagName === 'P' || el.tagName === 'DIV') && textItems.length > 0 && !textItems[textItems.length-1].options.breakLine) {
         textItems.push({ text: "", options: { breakLine: true } });
      }
    }
  };
  
  div.childNodes.forEach(child => processNode(child, options));
  
  return textItems.length > 0 ? textItems : [{ text: stripHtml(html), options }];
};

export const exportToPPT = async (slides: SlideContent[]) => {
  const pres = new pptxgen();

  // Set Presentation Metadata
  pres.title = "AI x 影视生产范式";
  pres.subject = "Psychological Types Presentation";
  
  // Set Layout (16:9)
  pres.layout = "LAYOUT_16x9";
  
  // Define Master Slide with Dark Theme Background
  pres.defineSlideMaster({
    title: "MASTER_SLIDE",
    background: { color: "0B1120" }, // Dark blue/slate background
    objects: [
      // Decorative elements (simplified)
      { rect: { x: 0, y: 0, w: "100%", h: "0.1", fill: { color: "06B6D4", transparency: 50 } } } // Top border
    ]
  });

  // Process each slide
  for (const slide of slides) {
    const pptSlide = pres.addSlide({ masterName: "MASTER_SLIDE" });
    
    // 1. Handle Background Image if present
    if (slide.imageUrl) {
        // If it's a data URL or http URL, pptxgenjs handles it
        // We put it in the background or as a large image
        // For this design, let's put it as a covered background if no other content, 
        // or as a specific image element if layout dictates.
        // But the layout logic below might place it specifically.
        // If the user uploaded a custom background image via the UI logic (which maps to slide.imageUrl currently),
        // we might want to respect that.
        // However, in current SlideView, imageUrl renders inside a placeholder box in specific layouts.
        // So we will handle it in the layout logic.
    }

    // 2. Handle Text & Layout Content
    // Common text styles
    const titleStyle = { color: "FFFFFF", bold: true, fontSize: 32, fontFace: "Arial" };
    const subtitleStyle = { color: "A5F3FC", fontSize: 18, fontFace: "Arial" };
    const bodyStyle = { color: "CBD5E1", fontSize: 14, fontFace: "Arial" };
    
    // --- Layout Specific Logic ---
    switch (slide.layout) {
      case LayoutType.TITLE_ONLY:
        // Title centered/left
        pptSlide.addText(parseHtmlToPptText(slide.title, titleStyle), { x: "5%", y: "20%", w: "60%", h: "20%" });
        if (slide.subtitle) {
             pptSlide.addText(parseHtmlToPptText(slide.subtitle, subtitleStyle), { x: "5%", y: "45%", w: "70%", h: "15%" });
        }
        if (slide.body) {
             pptSlide.addText(parseHtmlToPptText(slide.body, bodyStyle), { x: "5%", y: "65%", w: "80%", h: "20%" });
        }
        break;

      case LayoutType.TWO_COLUMN:
        // Title & Subtitle at top
        pptSlide.addText(parseHtmlToPptText(slide.title, { ...titleStyle, fontSize: 28 }), { x: "5%", y: "5%", w: "90%", h: "10%" });
        if (slide.subtitle) {
            pptSlide.addText(parseHtmlToPptText(slide.subtitle, subtitleStyle), { x: "5%", y: "15%", w: "90%", h: "8%" });
        }
        
        // Left Column (Image or Text)
        if (slide.imageUrl) {
            pptSlide.addImage({ path: slide.imageUrl, x: "5%", y: "25%", w: "42%", h: "60%", sizing: { type: "contain", w: "42%", h: "60%" } });
        } else if (slide.imageDesc) {
            // Placeholder text box
            pptSlide.addText(`[IMAGE PLACEHOLDER: ${slide.imageDesc}]`, { x: "5%", y: "25%", w: "42%", h: "60%", fill: "1e293b", color: "94a3b8", align: "center" });
        } else if (slide.leftColumn) {
             pptSlide.addText(parseHtmlToPptText(slide.leftColumn, bodyStyle), { x: "5%", y: "25%", w: "42%", h: "65%" });
        }
        
        // Right Column
        if (slide.rightColumn) {
            pptSlide.addText(parseHtmlToPptText(slide.rightColumn, bodyStyle), { x: "53%", y: "25%", w: "42%", h: "65%" });
        }
        break;

      case LayoutType.THREE_COLUMN:
        // Title Header
        pptSlide.addText(parseHtmlToPptText(slide.title, { ...titleStyle, fontSize: 24, align: "center" }), { x: "5%", y: "5%", w: "90%", h: "10%" });
        if (slide.subtitle) {
            pptSlide.addText(parseHtmlToPptText(slide.subtitle, { ...subtitleStyle, align: "center" }), { x: "5%", y: "15%", w: "90%", h: "8%" });
        }

        const colY = "25%";
        const colH = "55%";
        const colW = "28%";
        
        // Col 1
        if (slide.leftColumn) pptSlide.addText(parseHtmlToPptText(slide.leftColumn, bodyStyle), { x: "5%", y: colY, w: colW, h: colH, fill: "1e293b" });
        
        // Col 2
        if (slide.middleColumn) {
             // Special check for Infinity Loop slide (id: 7)
             if (slide.id === 7) {
                 pptSlide.addText("∞", { x: "36%", y: colY, w: colW, h: colH, fontSize: 72, color: "22d3ee", align: "center" });
             } else {
                 pptSlide.addText(parseHtmlToPptText(slide.middleColumn, bodyStyle), { x: "36%", y: colY, w: colW, h: colH, fill: "1e293b" });
             }
        }
        
        // Col 3
        if (slide.rightColumn) pptSlide.addText(parseHtmlToPptText(slide.rightColumn, bodyStyle), { x: "67%", y: colY, w: colW, h: colH, fill: "1e293b" });
        
        // Bottom Section
        if (slide.bottomSection) {
            pptSlide.addText(parseHtmlToPptText(slide.bottomSection, { ...bodyStyle, align: "center", fontSize: 12 }), { x: "10%", y: "85%", w: "80%", h: "10%", fill: "172554" });
        }
        break;

      case LayoutType.SPLIT_WITH_BOTTOM:
        // Header
        pptSlide.addText(parseHtmlToPptText(slide.title, { ...titleStyle, fontSize: 24, align: "center" }), { x: "5%", y: "5%", w: "90%", h: "10%" });
        if (slide.subtitle) {
            pptSlide.addText(parseHtmlToPptText(slide.subtitle, { ...subtitleStyle, align: "center" }), { x: "5%", y: "15%", w: "90%", h: "8%" });
        }
        
        // Left (Media) & Right (Text)
        if (slide.imageUrl) {
             pptSlide.addImage({ path: slide.imageUrl, x: "5%", y: "25%", w: "50%", h: "45%", sizing: { type: "contain" } });
        } else {
             pptSlide.addText(`[MEDIA: ${slide.imageDesc || 'Video Placeholder'}]`, { x: "5%", y: "25%", w: "50%", h: "45%", fill: "1e293b", color: "94a3b8", align: "center" });
        }
        
        if (slide.rightColumn) {
             pptSlide.addText(parseHtmlToPptText(slide.rightColumn, bodyStyle), { x: "60%", y: "25%", w: "35%", h: "45%" });
        }
        
        // Bottom
        if (slide.bottomSection) {
             pptSlide.addText(parseHtmlToPptText(slide.bottomSection, { ...bodyStyle, fontSize: 12 }), { x: "5%", y: "75%", w: "90%", h: "20%", fill: "1e293b" });
        }
        break;

      default:
        // Generic fallback
        pptSlide.addText(parseHtmlToPptText(slide.title, titleStyle), { x: "5%", y: "5%", w: "90%", h: "15%" });
        if (slide.body) {
             pptSlide.addText(parseHtmlToPptText(slide.body, bodyStyle), { x: "5%", y: "25%", w: "90%", h: "70%" });
        }
        break;
    }

    // 3. Handle Custom Elements (Overlays)
    if (slide.customElements && slide.customElements.length > 0) {
        slide.customElements.forEach(el => {
            // Get position and size (or defaults) from slide data if available
            // Note: In App.tsx, positions/sizes are stored in elementPositions/elementSizes keyed by ID.
            // We need to access those maps if we want precise positioning.
            // For now, let's look at the slide object structure again.
            // The slide object passed to this function *should* contain the latest state, 
            // including elementPositions and elementSizes maps.
            
            const pos = slide.elementPositions?.[el.id] || { x: 100, y: 100 };
            const size = slide.elementSizes?.[el.id] || { width: 200, height: 100 };
            
            // Convert pixels to percentage (assuming 1280x720 base viewport approx or just scaling)
            // Let's assume the editor viewport is roughly 1100px wide for calculation or just use pixel values directly if pptxgenjs supports custom slide size mapping?
            // pptxgenjs uses inches by default. 16x9 layout is 10 x 5.625 inches.
            // Let's map 1280px width -> 10 inches.
            const scaleX = 10 / 1280; // inches per pixel
            const scaleY = 5.625 / 720;
            
            // However, the editor might be responsive. Ideally we use percentage.
            // Let's use simple percentage based on a fixed reference like 1200x675 (16:9)
            const refW = 1000; // Arbitrary reference width for calculations if needed, or just use % string if we can.
            // pptxgenjs supports "10%" strings.
            // But we have pixel values from the React state {x: 200, y: 150}.
            // These pixel values usually are relative to the slide container in the DOM.
            // Let's assume the container in SlideView is roughly aspect-video.
            // We'll estimate based on a standard 1280px width for now.
            
            const xPct = Math.min(Math.max((pos.x / 1280) * 100, 0), 100);
            const yPct = Math.min(Math.max((pos.y / 720) * 100, 0), 100);
            const wPct = Math.min((size.width / 1280) * 100, 100);
            const hPct = Math.min((size.height / 720) * 100, 100);
            
            if (el.type === 'text') {
                // Determine background color: our custom elements have bg-slate-800/90
                pptSlide.addText(stripHtml(el.content), {
                    x: `${xPct}%`,
                    y: `${yPct}%`,
                    w: `${wPct}%`,
                    h: `${hPct}%`,
                    fill: "1e293b",
                    color: "ffffff",
                    fontSize: 12
                });
            } else if (el.type === 'image') {
                pptSlide.addImage({
                    path: el.content, // Data URL
                    x: `${xPct}%`,
                    y: `${yPct}%`,
                    w: `${wPct}%`,
                    h: `${hPct}%`
                });
            }
        });
    }
  }

  // Export
  await pres.writeFile({ fileName: "AI-Film-Paradigm-Export.pptx" });
};
