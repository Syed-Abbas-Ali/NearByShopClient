import React, { useState, useRef, useEffect, useCallback } from 'react';
import './ImageEditorPopup.scss';

const ImageEditorPopup = ({ src, onSave, onCancel }) => {
  // Core state
  const [image, setImage] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const [isCropping, setIsCropping] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [saturation, setSaturation] = useState(100);
  const [tool, setTool] = useState('rectangle'); // 'rectangle' or 'pencil'
  const [drawingPath, setDrawingPath] = useState([]);
  
  // Viewport state
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [startPanPos, setStartPanPos] = useState({ x: 0, y: 0 });
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  
  // Refs
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const previewCanvasRef = useRef(null);
  const drawingCanvasRef = useRef(null);

  // Initialize image with auto-zoom
  useEffect(() => {
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.src = src;
    img.onload = () => {
      setImage(img);
      const initialCrop = {
        x: 0,
        y: 0,
        width: img.width,
        height: img.height
      };
      setCrop(initialCrop);
      
      // Auto-zoom to fit container
      if (containerRef.current) {
        const container = containerRef.current;
        const scaleX = container.clientWidth / img.width;
        const scaleY = container.clientHeight / img.height;
        const initialScale = Math.min(scaleX, scaleY, 1);
        setScale(initialScale);
        setOffset({ x: 0, y: 0 });
      }
    };
  }, [src]);

  // Update preview thumbnail
  const updatePreview = useCallback(() => {
    if (!image || !previewCanvasRef.current) return;

    const canvas = previewCanvasRef.current;
    const ctx = canvas.getContext('2d');
    
    const previewWidth = 100;
    const previewHeight = (image.height / image.width) * previewWidth;
    
    canvas.width = previewWidth;
    canvas.height = previewHeight;
    
    ctx.filter = `
      brightness(${brightness}%)
      contrast(${contrast}%)
      saturate(${saturation}%)
    `;
    
    if (tool === 'pencil' && drawingPath.length > 0) {
      // Create a mask from the drawing path
      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = image.width;
      tempCanvas.height = image.height;
      const tempCtx = tempCanvas.getContext('2d');
      
      // Draw the path
      tempCtx.beginPath();
      tempCtx.moveTo(drawingPath[0].x, drawingPath[0].y);
      for (let i = 1; i < drawingPath.length; i++) {
        tempCtx.lineTo(drawingPath[i].x, drawingPath[i].y);
      }
      tempCtx.closePath();
      tempCtx.clip();
      
      // Draw the image through the mask
      tempCtx.filter = ctx.filter;
      tempCtx.drawImage(image, 0, 0);
      
      // Draw to preview
      ctx.drawImage(tempCanvas, 0, 0, previewWidth, previewHeight);
    } else {
      // Regular rectangular crop
      ctx.drawImage(
        image,
        crop.x, crop.y, crop.width, crop.height,
        0, 0, previewWidth, previewHeight
      );
    }
  }, [image, crop, brightness, contrast, saturation, tool, drawingPath]);

  // Draw main canvas
  const drawCanvas = useCallback(() => {
    if (!image || !canvasRef.current || !drawingCanvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const drawingCanvas = drawingCanvasRef.current;
    const drawingCtx = drawingCanvas.getContext('2d');
    
    // Set canvas to image dimensions
    canvas.width = image.width;
    canvas.height = image.height;
    drawingCanvas.width = image.width;
    drawingCanvas.height = image.height;
    
    // Clear canvases
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawingCtx.clearRect(0, 0, drawingCanvas.width, drawingCanvas.height);
    
    // Apply filters and draw image
    ctx.filter = `
      brightness(${brightness}%)
      contrast(${contrast}%)
      saturate(${saturation}%)
    `;
    ctx.drawImage(image, 0, 0);
    
    // Draw crop rectangle if in cropping mode
    if (isCropping && tool === 'rectangle') {
      ctx.strokeStyle = '#4285f4';
      ctx.lineWidth = 2 / scale;
      ctx.setLineDash([5, 5]);
      ctx.strokeRect(crop.x, crop.y, crop.width, crop.height);
      
      // Draw resize handles
      drawHandle(ctx, crop.x, crop.y, scale);
      drawHandle(ctx, crop.x + crop.width, crop.y, scale);
      drawHandle(ctx, crop.x, crop.y + crop.height, scale);
      drawHandle(ctx, crop.x + crop.width, crop.y + crop.height, scale);
    }
    
    // Draw pencil path if in drawing mode
    if (isDrawing || drawingPath.length > 0) {
      drawingCtx.strokeStyle = '#4285f4';
      drawingCtx.lineWidth = 3 / scale;
      drawingCtx.lineJoin = 'round';
      drawingCtx.lineCap = 'round';
      
      if (drawingPath.length > 0) {
        drawingCtx.beginPath();
        drawingCtx.moveTo(drawingPath[0].x, drawingPath[0].y);
        for (let i = 1; i < drawingPath.length; i++) {
          drawingCtx.lineTo(drawingPath[i].x, drawingPath[i].y);
        }
        if (isDrawing) {
          drawingCtx.stroke();
        } else {
          drawingCtx.closePath();
          drawingCtx.stroke();
        }
      }
    }
    
    updatePreview();
  }, [image, crop, isCropping, isDrawing, brightness, contrast, saturation, scale, tool, drawingPath, updatePreview]);

  // Draw handle
  const drawHandle = (ctx, x, y, scale) => {
    const handleSize = 6 / scale;
    ctx.fillStyle = '#4285f4';
    ctx.beginPath();
    ctx.arc(x, y, handleSize, 0, 2 * Math.PI);
    ctx.fill();
  };

  // Convert screen to canvas coordinates
  const screenToCanvas = useCallback((screenX, screenY) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    
    return {
      x: (screenX - rect.left - offset.x) / scale,
      y: (screenY - rect.top - offset.y) / scale
    };
  }, [offset, scale]);

  // Mouse wheel zoom
  const handleWheel = (e) => {
    e.preventDefault();
    
    const delta = -e.deltaY;
    const zoomIntensity = 0.1;
    const newScale = scale * (1 + delta * 0.001 * zoomIntensity);
    
    // Limit zoom range
    const clampedScale = Math.max(0.1, Math.min(newScale, 10));
    
    // Zoom toward mouse position
    const mouseX = e.clientX;
    const mouseY = e.clientY;
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    
    const mouseCanvasX = (mouseX - rect.left - offset.x) / scale;
    const mouseCanvasY = (mouseY - rect.top - offset.y) / scale;
    
    setOffset({
      x: mouseX - rect.left - mouseCanvasX * clampedScale,
      y: mouseY - rect.top - mouseCanvasY * clampedScale
    });
    
    setScale(clampedScale);
  };

  // Mouse down handler
  const handleMouseDown = (e) => {
    if (e.button === 2 || (e.button === 0 && e.ctrlKey)) { // Right click or Ctrl+Left
      setIsPanning(true);
      setStartPanPos({ x: e.clientX, y: e.clientY });
      return;
    }
    
    if (e.button !== 0) return; // Only left click
    
    const { x, y } = screenToCanvas(e.clientX, e.clientY);
    
    if (tool === 'rectangle') {
      setStartPos({ x, y });
      setCrop({ x, y, width: 0, height: 0 });
      setIsCropping(true);
    } else if (tool === 'pencil') {
      setDrawingPath([{ x, y }]);
      setIsDrawing(true);
    }
  };

  // Mouse move handler
  const handleMouseMove = (e) => {
    if (isPanning) {
      const dx = e.clientX - startPanPos.x;
      const dy = e.clientY - startPanPos.y;
      
      setOffset(prev => {
        // Calculate new offset with constraints
        let newX = prev.x + dx;
        let newY = prev.y + dy;
        
        // Prevent panning beyond image bounds
        if (image && containerRef.current) {
          const container = containerRef.current;
          const maxX = Math.max(0, (image.width * scale - container.clientWidth) / 2);
          const maxY = Math.max(0, (image.height * scale - container.clientHeight) / 2);
          
          newX = Math.max(-maxX, Math.min(newX, maxX));
          newY = Math.max(-maxY, Math.min(newY, maxY));
        }
        
        return { x: newX, y: newY };
      });
      
      setStartPanPos({ x: e.clientX, y: e.clientY });
    } else if (isCropping && tool === 'rectangle') {
      const { x, y } = screenToCanvas(e.clientX, e.clientY);
      
      setCrop({
        x: Math.min(startPos.x, x),
        y: Math.min(startPos.y, y),
        width: Math.abs(x - startPos.x),
        height: Math.abs(y - startPos.y)
      });
    } else if (isDrawing && tool === 'pencil') {
      const { x, y } = screenToCanvas(e.clientX, e.clientY);
      setDrawingPath(prev => [...prev, { x, y }]);
    }
  };

  // Mouse up handler
  const handleMouseUp = () => {
    if (isCropping) {
      setIsCropping(false);
      // Ensure crop has minimum dimensions
      if (crop.width < 10 || crop.height < 10) {
        setCrop({
          x: 0,
          y: 0,
          width: image.width,
          height: image.height
        });
      }
    }
    if (isDrawing) {
      setIsDrawing(false);
      // Close the path if it's a pencil tool
      if (tool === 'pencil' && drawingPath.length > 2) {
        setDrawingPath(prev => [...prev, prev[0]]); // Close the loop
      }
    }
    setIsPanning(false);
  };

  // Apply crop and filters to final image
  const applyCrop = () => {
    if (!image || !canvasRef.current) return;
    
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    if (tool === 'pencil' && drawingPath.length > 2) {
      // Freehand crop
      canvas.width = image.width;
      canvas.height = image.height;
      
      // Create clipping path
      ctx.beginPath();
      ctx.moveTo(drawingPath[0].x, drawingPath[0].y);
      for (let i = 1; i < drawingPath.length; i++) {
        ctx.lineTo(drawingPath[i].x, drawingPath[i].y);
      }
      ctx.closePath();
      ctx.clip();
      
      // Apply filters and draw image
      ctx.filter = `
        brightness(${brightness}%)
        contrast(${contrast}%)
        saturate(${saturation}%)
      `;
      ctx.drawImage(image, 0, 0);
      
      // Get the bounds of the drawing
      const bounds = getDrawingBounds();
      canvas.width = bounds.width;
      canvas.height = bounds.height;
      
      // Redraw the cropped portion
      ctx.filter = `
        brightness(${brightness}%)
        contrast(${contrast}%)
        saturate(${saturation}%)
      `;
      ctx.drawImage(
        image,
        bounds.x, bounds.y, bounds.width, bounds.height,
        0, 0, bounds.width, bounds.height
      );
    } else {
      // Regular rectangular crop
      canvas.width = crop.width;
      canvas.height = crop.height;
      
      ctx.filter = `
        brightness(${brightness}%)
        contrast(${contrast}%)
        saturate(${saturation}%)
      `;
      
      ctx.drawImage(
        image,
        crop.x, crop.y, crop.width, crop.height,
        0, 0, crop.width, crop.height
      );
    }
    
    // Convert to blob and call onSave
    canvas.toBlob(blob => {
      if (blob) {
        onSave(blob);
      } else {
        console.error('Failed to create image blob');
      }
    }, 'image/jpeg', 0.9);
  };

  // Get bounds of drawing path
  const getDrawingBounds = () => {
    if (drawingPath.length === 0 || !image) {
      return {
        x: 0,
        y: 0,
        width: image?.width || 0,
        height: image?.height || 0
      };
    }
    
    let minX = drawingPath[0].x;
    let maxX = drawingPath[0].x;
    let minY = drawingPath[0].y;
    let maxY = drawingPath[0].y;
    
    for (const point of drawingPath) {
      minX = Math.min(minX, point.x);
      maxX = Math.max(maxX, point.x);
      minY = Math.min(minY, point.y);
      maxY = Math.max(maxY, point.y);
    }
    
    // Ensure bounds are within image
    minX = Math.max(0, minX);
    maxX = Math.min(image.width, maxX);
    minY = Math.max(0, minY);
    maxY = Math.min(image.height, maxY);
    
    return {
      x: minX,
      y: minY,
      width: maxX - minX,
      height: maxY - minY
    };
  };

  // Reset all edits
  const resetEdits = () => {
    if (!image) return;
    
    setBrightness(100);
    setContrast(100);
    setSaturation(100);
    setCrop({
      x: 0,
      y: 0,
      width: image.width,
      height: image.height
    });
    setDrawingPath([]);
    setTool('rectangle');
    setScale(1);
    setOffset({ x: 0, y: 0 });
  };

  // Update canvas when dependencies change
  useEffect(() => {
    drawCanvas();
  }, [drawCanvas]);

  return (
    <div className="image-editor">
      <div className="editor-header">
        <h2>Edit Image</h2>
        <div className="header-actions">
          <button onClick={onCancel}>Cancel</button>
        </div>
      </div>
      
      <div className="editor-content">
        <div 
          className="canvas-container" 
          ref={containerRef}
          style={{
            cursor: isPanning ? 'grabbing' : 
                   isCropping || isDrawing ? 'crosshair' : 'grab'
          }}
          onWheel={handleWheel}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onContextMenu={(e) => e.preventDefault()}
        >
          <div 
            className="canvas-wrapper"
            style={{
              width: image ? `${image.width}px` : '100%',
              height: image ? `${image.height}px` : '100%',
              transform: `translate(${offset.x}px, ${offset.y}px) scale(${scale})`,
              transformOrigin: 'top left'
            }}
          >
            <canvas ref={canvasRef} className="main-canvas" />
            <canvas ref={drawingCanvasRef} className="drawing-canvas" />
          </div>
        </div>
        
        <div className="editor-controls">
          <div className="preview-section">
            <h3>Preview</h3>
            <canvas 
              ref={previewCanvasRef} 
              className="preview-canvas"
            />
            <div className="preview-info">
              {tool === 'pencil' && drawingPath.length > 0 ? 
                `${Math.round(getDrawingBounds().width)} × ${Math.round(getDrawingBounds().height)} px` :
                `${Math.round(crop.width)} × ${Math.round(crop.height)} px`}
            </div>
          </div>
          
          <div className="control-group">
            <h3>Tools</h3>
            <div className="tool-buttons">
              <button 
                onClick={() => setTool('rectangle')}
                className={tool === 'rectangle' ? 'active' : ''}
              >
                Rectangle Crop
              </button>
              <button 
                onClick={() => setTool('pencil')}
                className={tool === 'pencil' ? 'active' : ''}
              >
                Freehand Crop
              </button>
            </div>
            {tool === 'pencil' && (
              <div className="hint">
                Draw a closed shape to create a custom crop area
              </div>
            )}
            
            <div className="zoom-controls">
              <button onClick={() => setScale(prev => Math.min(prev + 0.1, 10))}>
                Zoom In
              </button>
              <button onClick={() => setScale(prev => Math.max(prev - 0.1, 0.1))}>
                Zoom Out
              </button>
              <button onClick={() => {
                // Auto-zoom to fit
                if (image && containerRef.current) {
                  const container = containerRef.current;
                  const scaleX = container.clientWidth / image.width;
                  const scaleY = container.clientHeight / image.height;
                  const initialScale = Math.min(scaleX, scaleY, 1);
                  setScale(initialScale);
                  setOffset({ x: 0, y: 0 });
                }
              }}>
                Fit to Screen
              </button>
            </div>
            <div className="hint">
              Pan: Right Click + Drag or Ctrl + Left Click + Drag
            </div>
          </div>
          
          <div className="control-group">
            <h3>Adjustments</h3>
            <label>
              Brightness: {brightness}%
              <input
                type="range"
                min="0"
                max="200"
                value={brightness}
                onChange={(e) => setBrightness(parseInt(e.target.value))}
              />
            </label>
            
            <label>
              Contrast: {contrast}%
              <input
                type="range"
                min="0"
                max="200"
                value={contrast}
                onChange={(e) => setContrast(parseInt(e.target.value))}
              />
            </label>
            
            <label>
              Saturation: {saturation}%
              <input
                type="range"
                min="0"
                max="200"
                value={saturation}
                onChange={(e) => setSaturation(parseInt(e.target.value))}
              />
            </label>
          </div>
          
          <div className="action-buttons">
            <button onClick={resetEdits}>Reset All</button>
            <button onClick={applyCrop}>Save Image</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageEditorPopup;