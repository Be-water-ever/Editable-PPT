import React, { useRef, useState, useEffect } from 'react';
import { SlideContent, LayoutType, Position, Size } from '../types';
import { Edit3, Upload, Image as ImageIcon, Move, GripVertical, X } from 'lucide-react';

interface SlideViewProps {
  slide: SlideContent;
  onUpdate: (id: number, field: keyof SlideContent, value: any) => void;
  onDeleteElement?: (elementId: string) => void;
}

interface DraggableWrapperProps {
  elementId: string;
  positions?: Record<string, Position>;
  sizes?: Record<string, Size>;
  onUpdate: (id: string, pos: Position) => void;
  onSizeUpdate: (id: string, size: Size) => void;
  children?: React.ReactNode;
  className?: string;
}

const DraggableWrapper: React.FC<DraggableWrapperProps> = ({ 
  elementId, 
  positions, 
  sizes,
  onUpdate, 
  onSizeUpdate,
  children, 
  className = "" 
}) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [resizeHandle, setResizeHandle] = useState<string | null>(null);
  const [currentPos, setCurrentPos] = useState(positions?.[elementId] || { x: 0, y: 0 });
  const [currentSize, setCurrentSize] = useState<Size | null>(sizes?.[elementId] || null);
  const dragStartRef = useRef<{ x: number, y: number } | null>(null);
  const initialPosRef = useRef<{ x: number, y: number } | null>(null);
  const resizeStartRef = useRef<{ x: number, y: number, width: number, height: number } | null>(null);

  // Get initial size from element or use default
  useEffect(() => {
    if (wrapperRef.current && !currentSize) {
      const rect = wrapperRef.current.getBoundingClientRect();
      setCurrentSize({ width: rect.width, height: rect.height });
    }
  }, []);

  // Sync state with props if they change externally (e.g. slide change)
  useEffect(() => {
    setCurrentPos(positions?.[elementId] || { x: 0, y: 0 });
  }, [positions, elementId, slideChangeTrigger(positions)]); 

  useEffect(() => {
    if (sizes?.[elementId]) {
      setCurrentSize(sizes[elementId]);
    }
  }, [sizes, elementId]);

  function slideChangeTrigger(p: any) { return p ? Object.keys(p).length : 0; }

  // Global event handlers for drag and resize
  useEffect(() => {
    const handleGlobalPointerMove = (e: PointerEvent) => {
      if (isResizing && resizeStartRef.current && resizeHandle) {
        e.preventDefault();
        const dx = e.clientX - resizeStartRef.current.x;
        const dy = e.clientY - resizeStartRef.current.y;
        
        let newWidth = resizeStartRef.current.width;
        let newHeight = resizeStartRef.current.height;
        
        // Calculate new size based on handle position
        if (resizeHandle.includes('e')) { // right
          newWidth = Math.max(50, resizeStartRef.current.width + dx);
        }
        if (resizeHandle.includes('w')) { // left
          newWidth = Math.max(50, resizeStartRef.current.width - dx);
        }
        if (resizeHandle.includes('s')) { // bottom
          newHeight = Math.max(50, resizeStartRef.current.height + dy);
        }
        if (resizeHandle.includes('n')) { // top
          newHeight = Math.max(50, resizeStartRef.current.height - dy);
        }

        // Maintain aspect ratio if Shift is pressed
        if (e.shiftKey && resizeStartRef.current.width > 0 && resizeStartRef.current.height > 0) {
          const aspectRatio = resizeStartRef.current.width / resizeStartRef.current.height;
          if (resizeHandle.includes('e') || resizeHandle.includes('w')) {
            newHeight = newWidth / aspectRatio;
          } else {
            newWidth = newHeight * aspectRatio;
          }
        }

        setCurrentSize({ width: newWidth, height: newHeight });
      } else if (isDragging && dragStartRef.current && initialPosRef.current) {
        const dx = e.clientX - dragStartRef.current.x;
        const dy = e.clientY - dragStartRef.current.y;
        
        setCurrentPos({
          x: initialPosRef.current.x + dx,
          y: initialPosRef.current.y + dy
        });
      }
    };

    const handleGlobalPointerUp = (e: PointerEvent) => {
      if (isResizing) {
        setIsResizing(false);
        if (currentSize) {
          onSizeUpdate(elementId, currentSize);
        }
        setResizeHandle(null);
        resizeStartRef.current = null;
      } else if (isDragging) {
        setIsDragging(false);
        onUpdate(elementId, currentPos);
      }
    };

    if (isDragging || isResizing) {
      window.addEventListener('pointermove', handleGlobalPointerMove);
      window.addEventListener('pointerup', handleGlobalPointerUp);
      return () => {
        window.removeEventListener('pointermove', handleGlobalPointerMove);
        window.removeEventListener('pointerup', handleGlobalPointerUp);
      };
    }
  }, [isDragging, isResizing, resizeHandle, currentSize, currentPos, elementId, onUpdate, onSizeUpdate]);

  const handlePointerDown = (e: React.PointerEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
    dragStartRef.current = { x: e.clientX, y: e.clientY };
    initialPosRef.current = currentPos;
    (e.target as Element).setPointerCapture(e.pointerId);
  };

  const handleResizeStart = (e: React.PointerEvent, handle: string) => {
    e.preventDefault();
    e.stopPropagation();
    setIsResizing(true);
    setResizeHandle(handle);
    if (wrapperRef.current) {
      const rect = wrapperRef.current.getBoundingClientRect();
      resizeStartRef.current = {
        x: e.clientX,
        y: e.clientY,
        width: currentSize?.width || rect.width,
        height: currentSize?.height || rect.height
      };
    }
    (e.target as Element).setPointerCapture(e.pointerId);
  };

  const getCursorStyle = (handle: string) => {
    const cursors: Record<string, string> = {
      'nw': 'nw-resize',
      'ne': 'ne-resize',
      'sw': 'sw-resize',
      'se': 'se-resize'
    };
    return cursors[handle] || 'default';
  };

  const sizeStyle = currentSize ? {
    width: `${currentSize.width}px`,
    height: `${currentSize.height}px`,
    minWidth: '50px',
    minHeight: '50px'
  } : {};

  // Determine positioning class: if className contains 'absolute', don't add 'relative'
  const positionClass = className.includes('absolute') ? '' : 'relative';
  
  return (
    <div 
      ref={wrapperRef}
      className={`${positionClass} group/drag ${className}`}
      style={{ 
        transform: `translate(${currentPos.x}px, ${currentPos.y}px)`,
        ...sizeStyle,
        // Disable transition during drag/resize for responsiveness
        transition: (isDragging || isResizing) ? 'none' : 'transform 0.1s ease-out, width 0.1s ease-out, height 0.1s ease-out'
      }}
    >
      {/* Drag Handle */}
      <div 
        onPointerDown={handlePointerDown}
        className="absolute -top-3 -left-3 p-1.5 bg-cyan-500 text-black rounded-full cursor-move opacity-0 group-hover/drag:opacity-100 transition-opacity z-50 shadow-md hover:scale-110 active:scale-95"
        title="拖拽移动"
      >
        <Move size={12} />
      </div>
      
      {/* Resize Handles */}
      {['nw', 'ne', 'sw', 'se'].map((handle) => (
        <div
          key={handle}
          onPointerDown={(e) => handleResizeStart(e, handle)}
          className={`absolute opacity-0 group-hover/drag:opacity-100 transition-opacity z-50 bg-cyan-500 text-black rounded-full p-1 shadow-md hover:scale-110 active:scale-95 ${
            handle === 'nw' ? '-top-2 -left-2 cursor-nw-resize' :
            handle === 'ne' ? '-top-2 -right-2 cursor-ne-resize' :
            handle === 'sw' ? '-bottom-2 -left-2 cursor-sw-resize' :
            '-bottom-2 -right-2 cursor-se-resize'
          }`}
          title="调整大小 (Shift保持比例)"
        >
          <GripVertical size={10} />
        </div>
      ))}
      
      {children}
    </div>
  );
};

const SlideView: React.FC<SlideViewProps> = ({ slide, onUpdate, onDeleteElement }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Generic change handler for contentEditable elements
  const handleBlur = (field: keyof SlideContent) => (e: React.FocusEvent<HTMLElement>) => {
    if (e.currentTarget.innerHTML !== slide[field]) {
      onUpdate(slide.id, field, e.currentTarget.innerHTML);
    }
  };

  // Helper for updating custom elements
  const handleCustomElementUpdate = (elementId: string, newContent: string) => {
    const newElements = (slide.customElements || []).map(el => 
      el.id === elementId ? { ...el, content: newContent } : el
    );
    onUpdate(slide.id, 'customElements', newElements);
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          onUpdate(slide.id, 'imageUrl', event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handlePosUpdate = (elementId: string, newPos: Position) => {
    const newPositions = { ...(slide.elementPositions || {}), [elementId]: newPos };
    onUpdate(slide.id, 'elementPositions', newPositions);
  };

  const handleSizeUpdate = (elementId: string, newSize: Size) => {
    const newSizes = { ...(slide.elementSizes || {}), [elementId]: newSize };
    onUpdate(slide.id, 'elementSizes', newSizes);
  };

  const EditableText = ({ 
    field, 
    value,
    onSave,
    className, 
    tagName: Tag = 'div' 
  }: { 
    field?: keyof SlideContent; 
    value?: string;
    onSave?: (val: string) => void;
    className?: string; 
    tagName?: React.ElementType 
  }) => {
    const handleBlurInternal = (e: React.FocusEvent<HTMLElement>) => {
       const newVal = e.currentTarget.innerHTML;
       if (onSave) {
          if (newVal !== value) onSave(newVal);
       } else if (field) {
          if (newVal !== slide[field]) onUpdate(slide.id, field, newVal);
       }
    };

    return (
      <Tag
        contentEditable
        suppressContentEditableWarning
        className={`hover:bg-cyan-500/10 transition-colors cursor-text outline-none ${className}`}
        onBlur={handleBlurInternal}
        dangerouslySetInnerHTML={{ __html: value || (field ? slide[field] : '') || '' }}
      />
    );
  };

  // Tech / Dark Theme Styles
  const slideStyle = "w-full h-full bg-gradient-to-br from-[#0B1120] to-[#172554] text-white p-12 shadow-2xl relative overflow-hidden flex flex-col font-sans";
  const decorationGrid = "absolute inset-0 opacity-10 pointer-events-none bg-[linear-gradient(rgba(0,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,255,0.1)_1px,transparent_1px)] bg-[size:40px_40px]";
  const decorationGlow = "absolute -top-40 -right-40 w-96 h-96 bg-blue-500 rounded-full blur-[128px] opacity-20 pointer-events-none";
  const decorationGlow2 = "absolute -bottom-40 -left-40 w-96 h-96 bg-cyan-500 rounded-full blur-[128px] opacity-10 pointer-events-none";

  const renderImageOrPlaceholder = (heightClass = "h-48") => (
    <div 
       onClick={handleImageClick}
       className={`${heightClass} w-full bg-slate-800/50 backdrop-blur rounded border border-slate-600 flex items-center justify-center text-slate-400 relative overflow-hidden cursor-pointer group hover:border-cyan-400 transition-all`}
    >
      {slide.imageUrl ? (
        <img src={slide.imageUrl} alt="Slide visual" className="w-full h-full object-cover" />
      ) : (
        <>
         {/* Placeholder pattern */}
         <div className="absolute inset-0 opacity-5 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white to-transparent" />
         <div className="flex flex-col items-center">
             <ImageIcon size={32} className="mb-2 opacity-50" />
             <span className="bg-slate-900/80 px-3 py-1 rounded text-xs border border-slate-700">配图: {slide.imageDesc}</span>
         </div>
        </>
      )}
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 flex items-center justify-center transition-colors">
         <div className="opacity-0 group-hover:opacity-100 bg-slate-900/90 border border-cyan-500 text-cyan-400 px-4 py-2 rounded-full shadow-lg text-sm font-bold flex items-center gap-2 transform translate-y-2 group-hover:translate-y-0 transition-all">
             <Upload size={16} /> 上传图片
         </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (slide.layout) {
      case LayoutType.TITLE_ONLY:
        return (
          <div className="flex flex-col items-start justify-center h-full text-left pl-12 relative z-10">
            <DraggableWrapper elementId="title" positions={slide.elementPositions} sizes={slide.elementSizes} onUpdate={handlePosUpdate} onSizeUpdate={handleSizeUpdate} className="w-2/3">
              <EditableText field="title" tagName="h1" className="text-6xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-100 to-blue-200 mb-6 leading-tight drop-shadow-[0_0_15px_rgba(6,182,212,0.5)]" />
            </DraggableWrapper>
            
            <DraggableWrapper elementId="subtitle" positions={slide.elementPositions} sizes={slide.elementSizes} onUpdate={handlePosUpdate} onSizeUpdate={handleSizeUpdate} className="w-3/4">
              <EditableText field="subtitle" tagName="h2" className="text-2xl font-light text-cyan-100/80 mb-12 border-l-4 border-cyan-500 pl-4" />
            </DraggableWrapper>
            
            <DraggableWrapper elementId="body" positions={slide.elementPositions} sizes={slide.elementSizes} onUpdate={handlePosUpdate} onSizeUpdate={handleSizeUpdate} className="mt-auto">
               <EditableText field="body" tagName="div" className="text-slate-400 text-lg" />
            </DraggableWrapper>
          </div>
        );

      case LayoutType.TWO_COLUMN:
        return (
          <>
            <DraggableWrapper elementId="title" positions={slide.elementPositions} sizes={slide.elementSizes} onUpdate={handlePosUpdate} onSizeUpdate={handleSizeUpdate} className="mb-2">
               <EditableText field="title" tagName="h2" className="text-4xl font-bold text-white drop-shadow-md" />
            </DraggableWrapper>
            <DraggableWrapper elementId="subtitle" positions={slide.elementPositions} sizes={slide.elementSizes} onUpdate={handlePosUpdate} onSizeUpdate={handleSizeUpdate} className="mb-8">
               <EditableText field="subtitle" tagName="h3" className="text-xl text-cyan-200/80" />
            </DraggableWrapper>
            
            <div className="flex-grow flex gap-8 min-h-0">
              <div className="w-1/2 flex flex-col h-full">
                 {/* Image often goes on left or right, flexible here based on content */}
                 {(slide.imageDesc || slide.imageUrl) && (
                   <DraggableWrapper elementId="image" positions={slide.elementPositions} sizes={slide.elementSizes} onUpdate={handlePosUpdate} onSizeUpdate={handleSizeUpdate} className="h-full mb-4">
                     {renderImageOrPlaceholder("h-full")}
                   </DraggableWrapper>
                 )}
              </div>
              <div className="w-1/2 flex flex-col h-full overflow-y-auto">
                 <DraggableWrapper elementId="rightColumn" positions={slide.elementPositions} sizes={slide.elementSizes} onUpdate={handlePosUpdate} onSizeUpdate={handleSizeUpdate} className="h-full">
                    <div className="bg-slate-800/30 p-6 rounded-lg border border-slate-700/50 backdrop-blur-sm h-full">
                        <EditableText field="rightColumn" className="text-lg leading-relaxed h-full" />
                    </div>
                 </DraggableWrapper>
              </div>
            </div>
          </>
        );

      case LayoutType.THREE_COLUMN:
         return (
            <>
              <div className="mb-8 text-center">
                <DraggableWrapper elementId="title" positions={slide.elementPositions} sizes={slide.elementSizes} onUpdate={handlePosUpdate} onSizeUpdate={handleSizeUpdate} className="mb-2">
                   <EditableText field="title" tagName="h2" className="text-4xl font-bold text-white drop-shadow-[0_2px_10px_rgba(56,189,248,0.5)]" />
                </DraggableWrapper>
                <DraggableWrapper elementId="subtitle" positions={slide.elementPositions} sizes={slide.elementSizes} onUpdate={handlePosUpdate} onSizeUpdate={handleSizeUpdate}>
                   <EditableText field="subtitle" tagName="h3" className="text-xl text-cyan-200/70" />
                </DraggableWrapper>
              </div>

              <div className="flex-grow grid grid-cols-3 gap-6">
                 <DraggableWrapper elementId="leftColumn" positions={slide.elementPositions} sizes={slide.elementSizes} onUpdate={handlePosUpdate} onSizeUpdate={handleSizeUpdate}>
                    <div className="bg-gradient-to-b from-slate-800/50 to-slate-900/50 p-5 rounded-xl border border-blue-500/20 hover:border-cyan-400/50 transition-colors h-full shadow-lg">
                       <EditableText field="leftColumn" className="h-full" />
                    </div>
                 </DraggableWrapper>
                 
                 <DraggableWrapper elementId="middleColumn" positions={slide.elementPositions} sizes={slide.elementSizes} onUpdate={handlePosUpdate} onSizeUpdate={handleSizeUpdate}>
                    {/* If middle column is image dominant, we can check imageDesc but typically text in this layout */}
                    <div className="bg-gradient-to-b from-slate-800/50 to-slate-900/50 p-5 rounded-xl border border-blue-500/20 hover:border-cyan-400/50 transition-colors h-full shadow-lg">
                        {/* Special case: if middle column has an image placeholder intent in constants */}
                       {(slide.imageDesc && slide.middleColumn?.includes('img')) ? (
                           <div className="h-full flex flex-col">
                             <div className="flex-grow relative">{renderImageOrPlaceholder("h-full")}</div>
                             <EditableText field="middleColumn" className="mt-2" />
                           </div>
                       ) : (
                          <EditableText field="middleColumn" className="h-full" />
                       )}
                    </div>
                 </DraggableWrapper>

                 <DraggableWrapper elementId="rightColumn" positions={slide.elementPositions} sizes={slide.elementSizes} onUpdate={handlePosUpdate} onSizeUpdate={handleSizeUpdate}>
                    <div className="bg-gradient-to-b from-slate-800/50 to-slate-900/50 p-5 rounded-xl border border-blue-500/20 hover:border-cyan-400/50 transition-colors h-full shadow-lg">
                       <EditableText field="rightColumn" className="h-full" />
                    </div>
                 </DraggableWrapper>
              </div>
              
              {slide.bottomSection && (
                 <DraggableWrapper elementId="bottomSection" positions={slide.elementPositions} sizes={slide.elementSizes} onUpdate={handlePosUpdate} onSizeUpdate={handleSizeUpdate} className="mt-6">
                    <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4 text-center">
                        <EditableText field="bottomSection" className="text-lg font-semibold text-cyan-100" />
                    </div>
                 </DraggableWrapper>
              )}
            </>
         );

      case LayoutType.SPLIT_WITH_BOTTOM:
         return (
            <>
               <div className="mb-6 text-center">
                  <DraggableWrapper elementId="title" positions={slide.elementPositions} sizes={slide.elementSizes} onUpdate={handlePosUpdate} onSizeUpdate={handleSizeUpdate} className="mb-1">
                     <EditableText field="title" tagName="h2" className="text-4xl font-bold text-white drop-shadow-md" />
                  </DraggableWrapper>
                  <DraggableWrapper elementId="subtitle" positions={slide.elementPositions} sizes={slide.elementSizes} onUpdate={handlePosUpdate} onSizeUpdate={handleSizeUpdate}>
                     <EditableText field="subtitle" tagName="h3" className="text-xl text-cyan-200/70" />
                  </DraggableWrapper>
               </div>

               <div className="flex-grow flex gap-6 mb-6 min-h-0">
                  <div className="w-3/5">
                     <DraggableWrapper elementId="leftColumn" positions={slide.elementPositions} sizes={slide.elementSizes} onUpdate={handlePosUpdate} onSizeUpdate={handleSizeUpdate} className="h-full">
                        {/* Usually video/image placeholder here */}
                        {renderImageOrPlaceholder("h-full")}
                     </DraggableWrapper>
                  </div>
                  <div className="w-2/5">
                     <DraggableWrapper elementId="rightColumn" positions={slide.elementPositions} sizes={slide.elementSizes} onUpdate={handlePosUpdate} onSizeUpdate={handleSizeUpdate} className="h-full">
                        <div className="h-full flex flex-col justify-center">
                           <EditableText field="rightColumn" className="h-full" />
                        </div>
                     </DraggableWrapper>
                  </div>
               </div>

               <DraggableWrapper elementId="bottomSection" positions={slide.elementPositions} sizes={slide.elementSizes} onUpdate={handlePosUpdate} onSizeUpdate={handleSizeUpdate} className="h-1/4">
                  <div className="bg-slate-800/60 rounded-xl border border-slate-600/50 p-4 h-full flex flex-col justify-center">
                      <EditableText field="bottomSection" className="w-full text-center" />
                  </div>
               </DraggableWrapper>
            </>
         );

      default: // Fallback to basic
        return (
           <div className="flex flex-col h-full">
             <DraggableWrapper elementId="title" positions={slide.elementPositions} sizes={slide.elementSizes} onUpdate={handlePosUpdate} onSizeUpdate={handleSizeUpdate}>
                <EditableText field="title" tagName="h2" className="text-4xl font-bold mb-4" />
             </DraggableWrapper>
             <DraggableWrapper elementId="body" positions={slide.elementPositions} sizes={slide.elementSizes} onUpdate={handlePosUpdate} onSizeUpdate={handleSizeUpdate} className="flex-grow">
                <EditableText field="body" className="text-xl" />
             </DraggableWrapper>
           </div>
        );
    }
  };

  return (
    <div className="w-full h-full flex items-center justify-center p-4 md:p-8 bg-slate-900">
      {/* Hidden File Input */}
      <input 
        type="file" 
        ref={fileInputRef} 
        className="hidden" 
        accept="image/*" 
        onChange={handleFileChange} 
      />
      
      <div className={`aspect-video w-full max-w-6xl ${slideStyle} rounded-xl border border-slate-700`}>
        {/* Background Decorations */}
        <div className={decorationGrid} />
        <div className={decorationGlow} />
        <div className={decorationGlow2} />
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-50" />
        
        <div className="absolute top-4 right-4 opacity-40 flex gap-2 items-center text-xs text-cyan-200">
           <Edit3 size={14} /> 可编辑模式
        </div>
        
        <div className="relative z-10 flex flex-col h-full">
            {renderContent()}
            
            {/* Custom Elements Layer */}
            {slide.customElements?.map(el => (
              <DraggableWrapper 
                key={el.id} 
                elementId={el.id} 
                positions={slide.elementPositions} 
                sizes={slide.elementSizes}
                onUpdate={handlePosUpdate} 
                onSizeUpdate={handleSizeUpdate}
                className="absolute z-20 group/element" // Free floating, above content
              >
                {/* Delete Button */}
                {onDeleteElement && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteElement(el.id);
                    }}
                    className="absolute -top-3 -right-3 p-1.5 bg-red-500 text-white rounded-full cursor-pointer opacity-0 group-hover/element:opacity-100 transition-opacity z-50 shadow-md hover:scale-110 active:scale-95 hover:bg-red-600"
                    title="删除组件"
                  >
                    <X size={12} />
                  </button>
                )}
                
                {el.type === 'text' ? (
                   <div className="min-w-[100px] min-h-[50px] bg-slate-800/90 backdrop-blur-sm border border-cyan-500/50 rounded p-2">
                      <EditableText 
                        value={el.content} 
                        onSave={(val) => handleCustomElementUpdate(el.id, val)}
                        className="w-full h-full"
                      />
                   </div>
                ) : (
                   <div className="w-full h-full border-2 border-cyan-500/50 rounded overflow-hidden bg-slate-900">
                      <img src={el.content} alt="Custom" className="w-full h-full object-contain pointer-events-none" />
                   </div>
                )}
              </DraggableWrapper>
            ))}
        </div>

        <div className="absolute bottom-4 right-6 text-xs text-slate-500 font-mono tracking-widest">
          SLIDE_ID: {String(slide.id).padStart(2, '0')} // AI_FILM_PROD
        </div>
      </div>
    </div>
  );
};

export default SlideView;