import React, { useState, useCallback, useEffect, useRef } from 'react';
import { INITIAL_SLIDES } from './constants';
import { SlideContent, CustomElement } from './types';
import SlideView from './components/SlideView';
import { ChevronLeft, ChevronRight, BookOpen, Grid, Undo, Redo, Type, Image as ImageIcon, Plus } from 'lucide-react';

const App: React.FC = () => {
  const [slides, setSlides] = useState<SlideContent[]>(INITIAL_SLIDES);
  const [past, setPast] = useState<SlideContent[][]>([]);
  const [future, setFuture] = useState<SlideContent[][]>([]);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isOverview, setIsOverview] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  
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
    
    setPast(prev => [...prev, slides]);
    setFuture([]);
    
    setSlides(prev => prev.map((slide, idx) => {
       if (idx !== currentSlideIndex) return slide;
       return {
         ...slide,
         customElements: [...(slide.customElements || []), newElement],
         elementPositions: { ...(slide.elementPositions || {}), [id]: initialPos }
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
           const id = `img-${Date.now()}`;
           const newElement: CustomElement = {
             id,
             type: 'image',
             content: event.target.result as string
           };
           // Initial position and size centered roughly
           const initialPos = { x: 200, y: 100 };
           const initialSize = { width: 400, height: 300 };

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
                   title="Add Text Box"
                >
                   <Type size={16} /> <span className="text-xs font-bold">TEXT</span>
                </button>
                <div className="w-px h-4 bg-slate-700 mx-1"></div>
                <button 
                   onClick={triggerAddImage} 
                   className="p-1.5 text-slate-400 hover:text-white transition-colors flex items-center gap-1 px-2"
                   title="Add Image"
                >
                   <ImageIcon size={16} /> <span className="text-xs font-bold">IMG</span>
                </button>
             </div>

             {/* Undo/Redo Controls */}
             <div className="flex items-center bg-slate-800 rounded-lg p-1 mr-2 border border-slate-700">
             <button 
                onClick={undo} 
                disabled={past.length === 0}
                className="p-1.5 text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                title="Undo (Ctrl+Z)"
             >
               <Undo size={18} />
             </button>
             <div className="w-px h-4 bg-slate-700 mx-1"></div>
             <button 
                onClick={redo} 
                disabled={future.length === 0}
                className="p-1.5 text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                title="Redo (Ctrl+Y)"
             >
               <Redo size={18} />
             </button>
          </div>

          <span className="text-slate-400 text-sm">
            {currentSlideIndex + 1} / {slides.length}
          </span>
          <button 
            onClick={() => setIsOverview(!isOverview)}
            className={`p-2 rounded hover:bg-slate-800 transition-colors ${isOverview ? 'bg-slate-800 text-cyan-400' : 'text-slate-300'}`}
            title="Slide Overview"
          >
            <Grid size={20} />
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-grow relative overflow-hidden flex bg-slate-900">
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
             <div className="flex-grow">
               <SlideView slide={currentSlide} onUpdate={handleUpdateSlide} onDeleteElement={handleDeleteElement} />
             </div>
             
             {/* Navigation Controls (Bottom Overlay) */}
             <div className="h-16 flex items-center justify-center gap-8 pb-4 pointer-events-none absolute bottom-0 w-full">
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