import React, { useState, useCallback, useEffect, useRef } from 'react';
import { INITIAL_SLIDES } from './constants';
import { SlideContent, CustomElement } from './types';
import SlideView from './components/SlideView';
import { ChevronLeft, ChevronRight, BookOpen, Grid, Undo, Redo, Type, Image as ImageIcon, Plus, Download, FileJson, FileType, Image } from 'lucide-react';
import { APP_VERSION } from './version';
import { exportToPPT } from './utils/pptExporter';
import { exportToPNG, exportToPDF } from './utils/imageExporter';

const App: React.FC = () => {
  const [slides, setSlides] = useState<SlideContent[]>(INITIAL_SLIDES);
  const [past, setPast] = useState<SlideContent[][]>([]);
  const [future, setFuture] = useState<SlideContent[][]>([]);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isOverview, setIsOverview] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [showExportMenu, setShowExportMenu] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null); // For adding new images

  const currentSlide = slides[currentSlideIndex];

  // Undo/Redo Logic
  const undo = useCallback(() => {
    if (past.length === 0) return;
    
    const previous = past[past.length - 1];
    const newPast = past.slice(0, past.length - 1);
    
    setFuture(prev => [slides, ...prev]);
    setSlides(previous);
    setPast(newPast);
  }, [past, slides]);

  const redo = useCallback(() => {
    if (future.length === 0) return;
    
    const next = future[0];
    const newFuture = future.slice(1);
    
    setPast(prev => [...prev, slides]);
    setSlides(next);
    setFuture(newFuture);
  }, [future, slides]);

  const handleUpdateSlide = useCallback((id: number, field: keyof SlideContent, value: any) => {
    // Save current state to past before updating
    setPast(prev => [...prev, slides]);
    setFuture([]); // Clear future history on new change
    
    setSlides(prev => prev.map(slide => 
      slide.id === id ? { ...slide, [field]: value } : slide
    ));
  }, [slides]);

  // Delete custom element
  const handleDeleteElement = useCallback((elementId: string) => {
    setPast(prev => [...prev, slides]);
    setFuture([]);
    
    setSlides(prev => prev.map((slide, idx) => {
      if (idx !== currentSlideIndex) return slide;
      
      // Remove element from customElements
      const newElements = (slide.customElements || []).filter(el => el.id !== elementId);
      
      // Remove from elementPositions
      const newPositions = { ...(slide.elementPositions || {}) };
      delete newPositions[elementId];
      
      // Remove from elementSizes
      const newSizes = { ...(slide.elementSizes || {}) };
      delete newSizes[elementId];
      
      return {
        ...slide,
        customElements: newElements,
        elementPositions: newPositions,
        elementSizes: newSizes
      };
    }));
  }, [slides, currentSlideIndex]);

  // Add Custom Elements
  const addTextElement = () => {
    const id = `text-${Date.now()}`;
    const newElement: CustomElement = {
      id,
      type: 'text',
      content: '<div class="text-2xl font-bold text-white">New Text</div>'
    };
    
    // Initial position centered roughly (relative to slide container)
    const initialPos = { x: 200, y: 150 };
    const initialSize = { width: 280, height: 100 };
    
    setPast(prev => [...prev, slides]);
    setFuture([]);
    
    setSlides(prev => prev.map((slide, idx) => {
       if (idx !== currentSlideIndex) return slide;
       return {
         ...slide,
         customElements: [...(slide.customElements || []), newElement],
         elementPositions: { ...(slide.elementPositions || {}), [id]: initialPos },
         elementSizes: { ...(slide.elementSizes || {}), [id]: initialSize }
       };
    }));
  };

  const triggerAddImage = () => {
    fileInputRef.current?.click();
  };

  const handleAddImageFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
           const imgUrl = event.target.result as string;
           
           // Create an image to get natural dimensions
           const img = document.createElement('img');
           img.onload = () => {
               const id = `img-${Date.now()}`;
               const newElement: CustomElement = {
                 id,
                 type: 'image',
                 content: imgUrl
               };
               
               // Calculate initial size maintaining aspect ratio
               // Max dimensions: 600x400 roughly
               const maxW = 600;
               const maxH = 400;
               let w = img.width;
               let h = img.height;
               
               // Scale down if too large
               if (w > maxW || h > maxH) {
                   const ratio = Math.min(maxW / w, maxH / h);
                   w = Math.round(w * ratio);
                   h = Math.round(h * ratio);
               }
               
               // Ensure min size
               w = Math.max(w, 100);
               h = Math.max(h, 100);

               const initialPos = { x: 200, y: 100 };
               const initialSize = { width: w, height: h };

               setPast(prev => [...prev, slides]);
               setFuture([]);
               
               setSlides(prev => prev.map((slide, idx) => {
                  if (idx !== currentSlideIndex) return slide;
                  return {
                    ...slide,
                    customElements: [...(slide.customElements || []), newElement],
                    elementPositions: { ...(slide.elementPositions || {}), [id]: initialPos },
                    elementSizes: { ...(slide.elementSizes || {}), [id]: initialSize }
                  };
               }));
           };
           img.src = imgUrl;
        }
      };
      reader.readAsDataURL(file);
    }
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Drag and Drop handlers for reordering slides
  const handleDragStart = useCallback((index: number) => {
    setDraggedIndex(index);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex !== null && draggedIndex !== index) {
      setDragOverIndex(index);
    }
  }, [draggedIndex]);

  const handleDragLeave = useCallback(() => {
    setDragOverIndex(null);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === dropIndex) {
      setDraggedIndex(null);
      setDragOverIndex(null);
      return;
    }

    // Save current state to past before reordering
    setPast(prev => [...prev, slides]);
    setFuture([]);

    // Reorder slides
    const newSlides = [...slides];
    const [draggedSlide] = newSlides.splice(draggedIndex, 1);
    newSlides.splice(dropIndex, 0, draggedSlide);
    
    setSlides(newSlides);
    
    // Update current slide index if needed
    if (currentSlideIndex === draggedIndex) {
      setCurrentSlideIndex(dropIndex);
    } else if (currentSlideIndex === dropIndex && draggedIndex < dropIndex) {
      setCurrentSlideIndex(currentSlideIndex + 1);
    } else if (currentSlideIndex > draggedIndex && currentSlideIndex <= dropIndex) {
      setCurrentSlideIndex(currentSlideIndex - 1);
    } else if (currentSlideIndex < draggedIndex && currentSlideIndex >= dropIndex) {
      setCurrentSlideIndex(currentSlideIndex + 1);
    }
    
    setDraggedIndex(null);
    setDragOverIndex(null);
  }, [draggedIndex, slides, currentSlideIndex]);

  const nextSlide = useCallback(() => {
    if (currentSlideIndex < slides.length - 1) {
      setCurrentSlideIndex(prev => prev + 1);
    }
  }, [currentSlideIndex, slides.length]);

  const prevSlide = useCallback(() => {
    if (currentSlideIndex > 0) {
      setCurrentSlideIndex(prev => prev - 1);
    }
  }, [currentSlideIndex]);

  // Keyboard navigation and shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isEditing = (document.activeElement as HTMLElement)?.isContentEditable;

      // Undo/Redo Shortcuts (Ctrl+Z, Ctrl+Shift+Z, Ctrl+Y)
      if ((e.ctrlKey || e.metaKey) && !isEditing) {
        if (e.key.toLowerCase() === 'z') {
          e.preventDefault();
          if (e.shiftKey) {
            redo();
          } else {
            undo();
          }
          return;
        }
        if (e.key.toLowerCase() === 'y') {
          e.preventDefault();
          redo();
          return;
        }
      }

      // Navigation Shortcuts
      // Don't navigate if editing text
      if (isEditing) return;

      if (e.key === 'ArrowRight' || e.key === 'Space') {
        nextSlide();
      } else if (e.key === 'ArrowLeft') {
        prevSlide();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentSlideIndex, slides.length, undo, redo, nextSlide, prevSlide]);

  return (
    <div className="h-screen w-screen flex flex-col bg-slate-900 overflow-hidden">
      {/* Toolbar */}
      <header className="h-14 bg-slate-950 text-white flex items-center justify-between px-6 shadow-md z-10 shrink-0 border-b border-blue-900/30">
        <div className="flex items-center gap-2 font-sans tracking-wider text-lg">
          <BookOpen size={20} className="text-cyan-400" />
          <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">AI x 影视生产范式</span>
        </div>
        
          <div className="flex items-center gap-4">
            {/* Hidden Input for Global Add Image */}
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*" 
              onChange={handleAddImageFile} 
            />

             {/* Add Buttons */}
             <div className="flex items-center bg-slate-800 rounded-lg p-1 mr-2 border border-slate-700">
                <button 
                   onClick={addTextElement} 
                   className="p-1.5 text-slate-400 hover:text-white transition-colors flex items-center gap-1 px-2"
                   title="添加文本框"
                >
                   <Type size={16} /> <span className="text-xs font-bold">文本</span>
                </button>
                <div className="w-px h-4 bg-slate-700 mx-1"></div>
                <button 
                   onClick={triggerAddImage} 
                   className="p-1.5 text-slate-400 hover:text-white transition-colors flex items-center gap-1 px-2"
                   title="添加图片"
                >
                   <ImageIcon size={16} /> <span className="text-xs font-bold">图片</span>
                </button>
             </div>

             {/* Undo/Redo Controls */}
             <div className="flex items-center bg-slate-800 rounded-lg p-1 mr-2 border border-slate-700">
             <button 
                onClick={undo} 
                disabled={past.length === 0}
                className="p-1.5 text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                title="撤销 (Ctrl+Z)"
             >
               <Undo size={18} />
             </button>
             <div className="w-px h-4 bg-slate-700 mx-1"></div>
             <button 
                onClick={redo} 
                disabled={future.length === 0}
                className="p-1.5 text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                title="重做 (Ctrl+Y)"
             >
               <Redo size={18} />
             </button>
          </div>

          <span className="text-slate-400 text-sm">
            {currentSlideIndex + 1} / {slides.length}
          </span>
          
          <div className="relative">
            <button 
              onClick={() => setShowExportMenu(!showExportMenu)}
              className={`p-2 rounded hover:bg-slate-800 transition-colors ${showExportMenu ? 'bg-slate-800 text-cyan-400' : 'text-slate-300 hover:text-cyan-400'}`}
              title="导出选项"
            >
              <Download size={20} />
            </button>
            
            {showExportMenu && (
              <div className="absolute top-full right-0 mt-2 w-48 bg-slate-800 border border-slate-700 rounded-lg shadow-xl z-50 overflow-hidden">
                <button 
                  onClick={() => { exportToPPT(slides); setShowExportMenu(false); }}
                  className="w-full text-left px-4 py-3 text-sm text-slate-300 hover:bg-slate-700 hover:text-white flex items-center gap-2"
                >
                  <FileJson size={16} className="text-orange-400" /> 
                  <span>导出 PPTX</span>
                </button>
                <div className="h-px bg-slate-700 mx-2"></div>
                <button 
                  onClick={() => { exportToPDF(slides, `slide-${currentSlideIndex + 1}.pdf`); setShowExportMenu(false); }}
                  className="w-full text-left px-4 py-3 text-sm text-slate-300 hover:bg-slate-700 hover:text-white flex items-center gap-2"
                >
                  <FileType size={16} className="text-red-400" /> 
                  <div className="flex flex-col">
                    <span>当前页面导出为 PDF</span>
                    <span className="text-[10px] text-slate-500">拉伸到同一尺寸 (A4)</span>
                  </div>
                </button>
                <button 
                  onClick={() => { exportToPNG('slide-viewport', `slide-${currentSlideIndex + 1}.png`); setShowExportMenu(false); }}
                  className="w-full text-left px-4 py-3 text-sm text-slate-300 hover:bg-slate-700 hover:text-white flex items-center gap-2"
                >
                  <Image size={16} className="text-blue-400" /> 
                  <div className="flex flex-col">
                    <span>当前页面导出为 PNG</span>
                    <span className="text-[10px] text-slate-500">当前浏览器可见尺寸</span>
                  </div>
                </button>
              </div>
            )}
            {/* Backdrop to close menu */}
            {showExportMenu && (
              <div className="fixed inset-0 z-40" onClick={() => setShowExportMenu(false)}></div>
            )}
          </div>

          <button 
            onClick={() => setIsOverview(!isOverview)}
            className={`p-2 rounded hover:bg-slate-800 transition-colors ${isOverview ? 'bg-slate-800 text-cyan-400' : 'text-slate-300'}`}
            title="幻灯片概览"
          >
            <Grid size={20} />
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-grow relative overflow-hidden flex bg-slate-900">
        {/* Version Number - Bottom Right Corner (Extremely Subtle) */}
        <div className="fixed bottom-0.5 right-0.5 z-[9999] pointer-events-none select-none">
          <span className="text-[8px] text-slate-500/20 font-mono opacity-20">
            {APP_VERSION}
          </span>
        </div>
        
        {isOverview ? (
          <div className="w-full h-full overflow-auto p-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {slides.map((slide, index) => (
              <div 
                key={slide.id}
                draggable
                onDragStart={() => handleDragStart(index)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, index)}
                onClick={() => {
                  setCurrentSlideIndex(index);
                  setIsOverview(false);
                }}
                className={`aspect-video bg-slate-800 rounded border border-slate-700 cursor-move hover:ring-2 ring-cyan-500 transition-all shadow-lg flex flex-col p-4 overflow-hidden relative group ${
                  index === currentSlideIndex ? 'ring-2 ring-cyan-400' : ''
                } ${
                  draggedIndex === index ? 'opacity-50 scale-95' : ''
                } ${
                  dragOverIndex === index ? 'ring-2 ring-blue-400 border-blue-400 scale-105 bg-slate-700' : ''
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="font-bold text-xs text-slate-500">#{slide.id}</div>
                  <div className="text-xs text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity">拖拽排序</div>
                </div>
                <div className="font-sans font-bold text-slate-200 text-sm line-clamp-2 mb-2" dangerouslySetInnerHTML={{__html: slide.title}} />
                <div className="text-[10px] text-slate-500 line-clamp-4" dangerouslySetInnerHTML={{__html: slide.subtitle || slide.body || slide.leftColumn || ''}} />
                <div className="absolute inset-0 bg-cyan-500/0 group-hover:bg-cyan-500/5 transition-colors" />
              </div>
            ))}
          </div>
        ) : (
          <div className="w-full h-full flex flex-col">
             <div className="flex-grow" id="slide-viewport">
               <SlideView slide={currentSlide} onUpdate={handleUpdateSlide} onDeleteElement={handleDeleteElement} />
             </div>
             
             {/* Navigation Controls (Bottom Overlay) */}
             <div className="h-16 flex items-center justify-center gap-8 pb-4 pointer-events-none absolute bottom-0 w-full no-export">
                <button 
                  onClick={prevSlide} 
                  disabled={currentSlideIndex === 0}
                  className="pointer-events-auto p-3 bg-slate-900/50 backdrop-blur-md border border-slate-600 hover:border-cyan-400 text-cyan-400 hover:text-white rounded-full disabled:opacity-30 disabled:cursor-not-allowed transition-all hover:scale-110 shadow-lg"
                >
                  <ChevronLeft size={28} />
                </button>
                <button 
                  onClick={nextSlide} 
                  disabled={currentSlideIndex === slides.length - 1}
                  className="pointer-events-auto p-3 bg-slate-900/50 backdrop-blur-md border border-slate-600 hover:border-cyan-400 text-cyan-400 hover:text-white rounded-full disabled:opacity-30 disabled:cursor-not-allowed transition-all hover:scale-110 shadow-lg"
                >
                  <ChevronRight size={28} />
                </button>
             </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;