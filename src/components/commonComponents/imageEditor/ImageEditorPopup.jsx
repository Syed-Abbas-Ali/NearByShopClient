import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  RotateCw,
  Crop,
  Sun,
  Contrast,
  Palette,
  RefreshCw,
  ZoomIn,
  ZoomOut,
  Undo,
  Redo,
  Filter,
  Scissors,
  Check,
  X,
  Maximize2,
  Image as ImageIcon
} from 'lucide-react';
import './ImageEditorPopup.scss';

const defaultSettings = {
  brightness: 100,
  contrast: 100,
  saturation: 100,
  hue: 0,
  blur: 0,
  rotation: 0,
  flipX: false,
  flipY: false,
  filter: 'none'
};

const filters = [
  { name: 'None', value: 'none', icon: <ImageIcon size={16} /> },
  { name: 'Grayscale', value: 'grayscale(100%)', icon: <Filter size={16} /> },
  { name: 'Sepia', value: 'sepia(100%)', icon: <Filter size={16} /> },
  { name: 'Invert', value: 'invert(100%)', icon: <Filter size={16} /> },
  { name: 'Vintage', value: 'sepia(50%) contrast(1.2) brightness(1.1)', icon: <Filter size={16} /> },
  { name: 'Cool', value: 'hue-rotate(180deg) saturate(1.2)', icon: <Filter size={16} /> },
  { name: 'Warm', value: 'hue-rotate(25deg) saturate(1.1)', icon: <Filter size={16} /> }
];

const aspectRatios = [
  { name: "Free", value: null, icon: <Crop size={16} /> },
  { name: "Square", value: 1, icon: <Crop size={16} /> },
  { name: "16:9", value: 16/9, icon: <Crop size={16} /> },
  { name: "4:3", value: 4/3, icon: <Crop size={16} /> },
  { name: "3:2", value: 3/2, icon: <Crop size={16} /> },
];

const ImageEditorPopup = ({ src: initialSrc, onSave, onCancel }) => {
  const [src, setSrc] = useState(initialSrc);
  const [settings, setSettings] = useState(defaultSettings);
  const [history, setHistory] = useState([{...defaultSettings, src: initialSrc}]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [activeTab, setActiveTab] = useState('adjust');
  const [cropMode, setCropMode] = useState(false);
  const [cropArea, setCropArea] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [startPanPos, setStartPanPos] = useState({ x: 0, y: 0 });
  const [aspectRatio, setAspectRatio] = useState(null);
  const [showOriginal, setShowOriginal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cropAdjustMode, setCropAdjustMode] = useState(false);
const [cropAdjustSettings, setCropAdjustSettings] = useState({
  scale: 1,
  offset: { x: 0, y: 0 }
});


  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const imageRef = useRef(null);
  const imageWrapperRef = useRef(null);

  // Load image and initialize
  useEffect(() => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = initialSrc;
    
    img.onload = () => {
      setIsLoading(false);
      zoomToFit();
    };
    
    img.onerror = () => {
      setError("Failed to load image");
      setIsLoading(false);
    };
  }, [initialSrc]);

  const addToHistory = useCallback((newSettings) => {
    setHistory(prev => {
      const newHistory = prev.slice(0, historyIndex + 1);
      newHistory.push({...newSettings, src});
      return newHistory;
    });
    setHistoryIndex(prev => prev + 1);
  }, [historyIndex, src]);

  const updateSetting = useCallback((key, value) => {
    setSettings(prev => {
      const newSettings = { ...prev, [key]: value };
      addToHistory(newSettings);
      return newSettings;
    });
  }, [addToHistory]);

  const getFilterString = useCallback(() => {
    const { brightness, contrast, saturation, hue, blur, filter } = settings;
    let filterStr = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%) hue-rotate(${hue}deg) blur(${blur}px)`;
    
    if (filter !== 'none') {
      filterStr += ` ${filter}`;
    }
    
    return filterStr;
  }, [settings]);

  const getTransformString = useCallback(() => {
    const { rotation, flipX, flipY } = settings;
    return `rotate(${rotation}deg) scaleX(${flipX ? -1 : 1}) scaleY(${flipY ? -1 : 1})`;
  }, [settings]);

  const resetSettings = () => {
    setSettings(defaultSettings);
    addToHistory(defaultSettings);
  };

  const undo = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      const historyState = history[newIndex];
      setSettings(historyState);
      if (historyState.src) {
        setSrc(historyState.src);
      }
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      const historyState = history[newIndex];
      setSettings(historyState);
      if (historyState.src) {
        setSrc(historyState.src);
      }
    }
  };

const getImageBounds = useCallback(() => {
    if (!imageRef.current) return null;
    
    const img = imageRef.current;
    const container = containerRef.current;
    if (!container) return null;
    
    const containerWidth = container.clientWidth;
    const containerHeight = container.clientHeight;
    
    return {
      left: -offset.x / scale,
      top: -offset.y / scale,
      width: containerWidth / scale,
      height: containerHeight / scale
    };
  }, [scale, offset]);

  const zoomToFit = useCallback(() => {
    if (!imageRef.current || !containerRef.current) return;
    
    const container = containerRef.current;
    const img = imageRef.current;
    const scaleX = container.clientWidth / img.naturalWidth;
    const scaleY = container.clientHeight / img.naturalHeight;
    const newScale = Math.min(scaleX, scaleY, 1);
    
    setScale(newScale);
    setOffset({ x: 0, y: 0 });
  }, []);

 const handleCropStart = (e) => {
    if (!cropMode) return;
    e.preventDefault();
    
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left - offset.x) / scale;
    const y = (e.clientY - rect.top - offset.y) / scale;
    
    setDragStart({ x, y });
    setCropArea({ x, y, width: 0, height: 0 });
    setIsDragging(true);
  };

  const enterCropAdjustMode = () => {
  if (cropArea.width === 0 || cropArea.height === 0) return;
  
  setCropAdjustMode(true);
  // Calculate initial scale to fit crop area
  const img = imageRef.current;
  const targetRatio = cropArea.width / cropArea.height;
  const imgRatio = img.naturalWidth / img.naturalHeight;
  
  let initialScale = 1;
  if (targetRatio > imgRatio) {
    initialScale = cropArea.width / img.naturalWidth;
  } else {
    initialScale = cropArea.height / img.naturalHeight;
  }
  
  setCropAdjustSettings({
    scale: initialScale,
    offset: {
      x: -cropArea.x * initialScale,
      y: -cropArea.y * initialScale
    }
  });
};

const handleCropMove = (e) => {
    if (!isDragging || !cropMode) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    let x = (e.clientX - rect.left - offset.x) / scale;
    let y = (e.clientY - rect.top - offset.y) / scale;
    
    // Apply aspect ratio constraint if specified
    if (aspectRatio) {
      const width = x - dragStart.x;
      const height = y - dragStart.y;
      
      if (Math.abs(width) > Math.abs(height * aspectRatio)) {
        y = dragStart.y + (width / aspectRatio) * (height < 0 ? -1 : 1);
      } else {
        x = dragStart.x + (height * aspectRatio) * (width < 0 ? -1 : 1);
      }
    }
    
    setCropArea({
      x: Math.min(dragStart.x, x),
      y: Math.min(dragStart.y, y),
      width: Math.abs(x - dragStart.x),
      height: Math.abs(y - dragStart.y)
    });
  };

  const handleCropEnd = () => {
    setIsDragging(false);
  };

  const applyCrop = async () => {
    if (!src || !imageRef.current || !canvasRef.current || cropArea.width === 0 || cropArea.height === 0) {
      cancelCrop();
      return;
    }

    try {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = src;
      
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
      });

      // Calculate crop coordinates in image pixels
      const imgRect = imageRef.current.getBoundingClientRect();
      const scaleX = img.naturalWidth / imgRect.width;
      const scaleY = img.naturalHeight / imgRect.height;
      
      // Convert crop area to image coordinates
      const cropX = (cropArea.x * scale) * scaleX;
      const cropY = (cropArea.y * scale) * scaleY;
      const cropWidth = (cropArea.width * scale) * scaleX;
      const cropHeight = (cropArea.height * scale) * scaleY;

      // Set canvas to the exact crop dimensions
      canvas.width = cropWidth;
      canvas.height = cropHeight;

      ctx.filter = getFilterString();
      
      // Draw the cropped portion
      ctx.drawImage(
        img,
        cropX, cropY, cropWidth, cropHeight,
        0, 0, cropWidth, cropHeight
      );

      const croppedImageUrl = canvas.toDataURL('image/jpeg', 0.9);
      setSrc(croppedImageUrl);
      
      // Reset after successful crop
      setCropMode(false);
      setCropArea({ x: 0, y: 0, width: 0, height: 0 });
      setIsDragging(false);
      setAspectRatio(null);
      
      // Reset settings and history for the new image
      const newSettings = { ...defaultSettings };
      setSettings(newSettings);
      setHistory([{...newSettings, src: croppedImageUrl}]);
      setHistoryIndex(0);
      
      // Zoom to fit the new image
      setTimeout(zoomToFit, 100);
    } catch (err) {
      console.error("Failed to crop image:", err);
      cancelCrop();
    }
  };
  const cancelCrop = () => {
    setCropMode(false);
    setCropArea({ x: 0, y: 0, width: 0, height: 0 });
    setIsDragging(false);
    setAspectRatio(null);
  };

  const handleSave = async () => {
    if (cropMode && cropArea.width > 0 && cropArea.height > 0) {
      await applyCrop();
      return;
    }

    try {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx || !imageRef.current) return;

      canvas.width = imageRef.current.naturalWidth;
      canvas.height = imageRef.current.naturalHeight;

      ctx.filter = getFilterString();
      ctx.drawImage(imageRef.current, 0, 0);

      canvas.toBlob((blob) => {
        if (blob) {
          onSave(blob);
        }
      }, 'image/jpeg', 0.9);
    } catch (err) {
      console.error("Failed to save image:", err);
    }
  };

  const handleWheel = (e) => {
    e.preventDefault();
    
    const delta = -e.deltaY;
    const zoomIntensity = 0.1;
    const newScale = scale * (1 + delta * 0.001 * zoomIntensity);
    
    const clampedScale = Math.max(0.1, Math.min(newScale, 10));
    
    const mouseX = e.clientX;
    const mouseY = e.clientY;
    const container = containerRef.current;
    if (!container) return;
    
    const rect = container.getBoundingClientRect();
    const mouseCanvasX = (mouseX - rect.left - offset.x) / scale;
    const mouseCanvasY = (mouseY - rect.top - offset.y) / scale;
    
    setOffset({
      x: mouseX - rect.left - mouseCanvasX * clampedScale,
      y: mouseY - rect.top - mouseCanvasY * clampedScale
    });
    
    setScale(clampedScale);
  };

  const handleMouseDown = (e) => {
    if (e.button === 2 || (e.button === 0 && e.ctrlKey)) {
      setIsPanning(true);
      setStartPanPos({ x: e.clientX, y: e.clientY });
      return;
    }
    
    if (cropMode) {
      handleCropStart(e);
    }
  };

  const handleMouseMove = (e) => {
    if (isPanning) {
      const dx = e.clientX - startPanPos.x;
      const dy = e.clientY - startPanPos.y;
      
      setOffset(prev => {
        let newX = prev.x + dx;
        let newY = prev.y + dy;
        
        if (imageRef.current && containerRef.current) {
          const img = imageRef.current;
          const container = containerRef.current;
          const maxX = Math.max(0, (img.naturalWidth * scale - container.clientWidth) / 2);
          const maxY = Math.max(0, (img.naturalHeight * scale - container.clientHeight) / 2);
          
          newX = Math.max(-maxX, Math.min(newX, maxX));
          newY = Math.max(-maxY, Math.min(newY, maxY));
        }
        
        return { x: newX, y: newY };
      });
      
      setStartPanPos({ x: e.clientX, y: e.clientY });
    } else if (isDragging && cropMode) {
      handleCropMove(e);
    }
  };

  const handleMouseUp = () => {
    if (isPanning) {
      setIsPanning(false);
    }
    if (isDragging) {
      handleCropEnd();
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case 'z':
            if (e.shiftKey) redo();
            else undo();
            break;
          case 's':
            e.preventDefault();
            handleSave();
            break;
          case 'f':
            zoomToFit();
            break;
          case 'h':
            setShowOriginal(prev => !prev);
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo, handleSave, zoomToFit]);

  if (error) {
    return (
      <div className="image-editor-popup error-state">
        <div className="error-message">
          <p>{error}</p>
          <button onClick={onCancel} className="cancel-btn">
            Close
          </button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="image-editor-popup loading-state">
        <div className="loading-spinner"></div>
        <p>Loading image...</p>
      </div>
    );
  }

  
  return (
    <div className="image-editor-popup">
      <div className="editor-header">
        <div className="header-left">
          <h2>Image Editor</h2>
        </div>
        
        <div className="header-actions">
          <button
            onClick={undo}
            disabled={historyIndex === 0}
            className="action-btn"
            title="Undo (Ctrl+Z)"
            aria-label="Undo"
          >
            <Undo size={20} />
          </button>
          <button
            onClick={redo}
            disabled={historyIndex === history.length - 1}
            className="action-btn"
            title="Redo (Ctrl+Shift+Z)"
            aria-label="Redo"
          >
            <Redo size={20} />
          </button>
          <button 
            onClick={zoomToFit} 
            className="action-btn" 
            title="Zoom to Fit (Ctrl+F)"
            aria-label="Zoom to Fit"
          >
            <Maximize2 size={20} />
          </button>
          <button 
            onClick={() => setShowOriginal(!showOriginal)} 
            className={`action-btn ${showOriginal ? 'active' : ''}`} 
            title="Compare (Ctrl+H)"
            aria-label="Compare with original"
          >
            <Scissors size={20} />
          </button>
          <button 
            onClick={resetSettings} 
            className="action-btn" 
            title="Reset all adjustments"
            aria-label="Reset"
          >
            <RefreshCw size={20} />
          </button>
          <button onClick={onCancel} className="cancel-btn" aria-label="Cancel editing">
            Cancel
          </button>
          <button 
            onClick={handleSave} 
            className="save-btn" 
            title="Save (Ctrl+S)"
            aria-label="Save changes"
          >
            Save
          </button>
        </div>
      </div>

      <div className="editor-content">
        <div className="editor-sidebar">
          <div className="sidebar-tabs">
            <button
              className={`tab ${activeTab === 'adjust' ? 'active' : ''}`}
              onClick={() => {
                setActiveTab('adjust');
                setCropMode(false);
              }}
              aria-label="Adjustments tab"
            >
              <Sun size={18} />
              <span>Adjust</span>
            </button>
            <button
              className={`tab ${activeTab === 'filters' ? 'active' : ''}`}
              onClick={() => {
                setActiveTab('filters');
                setCropMode(false);
              }}
              aria-label="Filters tab"
            >
              <Filter size={18} />
              <span>Filters</span>
            </button>
            <button
              className={`tab ${activeTab === 'transform' ? 'active' : ''}`}
              onClick={() => {
                setActiveTab('transform');
                setCropMode(false);
              }}
              aria-label="Transform tab"
            >
              <RotateCw size={18} />
              <span>Transform</span>
            </button>
            <button
              className={`tab ${activeTab === 'crop' ? 'active' : ''}`}
              onClick={() => {
                setActiveTab('crop');
                setCropMode(true);
              }}
              aria-label="Crop tab"
            >
              <Crop size={18} />
              <span>Crop</span>
            </button>
          </div>

          <div className="sidebar-content">
            {activeTab === 'adjust' && (
              <div className="controls-group">
                <div className="control">
                  <label>
                    <Sun size={16} />
                    Brightness
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="200"
                    value={settings.brightness}
                    onChange={(e) => updateSetting('brightness', Number(e.target.value))}
                    className="slider"
                    aria-label="Brightness slider"
                  />
                  <span className="value">{settings.brightness}%</span>
                </div>

                <div className="control">
                  <label>
                    <Contrast size={16} />
                    Contrast
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="200"
                    value={settings.contrast}
                    onChange={(e) => updateSetting('contrast', Number(e.target.value))}
                    className="slider"
                    aria-label="Contrast slider"
                  />
                  <span className="value">{settings.contrast}%</span>
                </div>

                <div className="control">
                  <label>
                    <Palette size={16} />
                    Saturation
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="200"
                    value={settings.saturation}
                    onChange={(e) => updateSetting('saturation', Number(e.target.value))}
                    className="slider"
                    aria-label="Saturation slider"
                  />
                  <span className="value">{settings.saturation}%</span>
                </div>

                <div className="control">
                  <label>
                    <RotateCw size={16} />
                    Hue Shift
                  </label>
                  <input
                    type="range"
                    min="-180"
                    max="180"
                    value={settings.hue}
                    onChange={(e) => updateSetting('hue', Number(e.target.value))}
                    className="slider hue-slider"
                    aria-label="Hue rotation slider"
                  />
                  <span className="value">{settings.hue}°</span>
                </div>

                <div className="control">
                  <label>
                    <Filter size={16} />
                    Blur
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="10"
                    step="0.1"
                    value={settings.blur}
                    onChange={(e) => updateSetting('blur', Number(e.target.value))}
                    className="slider"
                    aria-label="Blur slider"
                  />
                  <span className="value">{settings.blur}px</span>
                </div>
              </div>
            )}

            {activeTab === 'filters' && (
              <div className="filters-grid">
                {filters.map((filter) => (
                  <button
                    key={filter.value}
                    className={`filter-btn ${settings.filter === filter.value ? 'active' : ''}`}
                    onClick={() => updateSetting('filter', filter.value)}
                    aria-label={`Apply ${filter.name} filter`}
                  >
                    {filter.icon}
                    {filter.name}
                  </button>
                ))}
              </div>
            )}

            {activeTab === 'transform' && (
              <div className="controls-group">
                <div className="control">
                  <label>
                    <RotateCw size={16} />
                    Rotation
                  </label>
                  <input
                    type="range"
                    min="-180"
                    max="180"
                    value={settings.rotation}
                    onChange={(e) => updateSetting('rotation', Number(e.target.value))}
                    className="slider"
                    aria-label="Rotation slider"
                  />
                  <span className="value">{settings.rotation}°</span>
                </div>

                <div className="transform-buttons">
                  <button
                    className={`transform-btn ${settings.flipX ? 'active' : ''}`}
                    onClick={() => updateSetting('flipX', !settings.flipX)}
                    aria-label="Flip horizontally"
                  >
                    Flip Horizontal
                  </button>
                  <button
                    className={`transform-btn ${settings.flipY ? 'active' : ''}`}
                    onClick={() => updateSetting('flipY', !settings.flipY)}
                    aria-label="Flip vertically"
                  >
                    Flip Vertical
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'crop' && (
              <div className="controls-group">
                <div className="aspect-ratio-presets">
                  <label>Aspect Ratio:</label>
                  <div className="ratio-buttons">
                    {aspectRatios.map((ratio) => (
                      <button
                        key={ratio.name}
                        className={`ratio-btn ${aspectRatio === ratio.value ? 'active' : ''}`}
                        onClick={() => setAspectRatio(ratio.value)}
                        aria-label={`Set ${ratio.name} aspect ratio`}
                      >
                        {ratio.icon}
                        {ratio.name}
                      </button>
                    ))}
                  </div>
                </div>
                
                <div className="crop-info">
                  <p>Click and drag on the image to select crop area</p>
                  {cropArea.width > 0 && cropArea.height > 0 && (
                    <p>Selection: {Math.round(cropArea.width)} × {Math.round(cropArea.height)}</p>
                  )}
                </div>
                
{cropMode && cropArea.width > 0 && cropArea.height > 0 && (
  <div className="crop-actions">
    {!cropAdjustMode ? (
      <>
        <button 
          onClick={enterCropAdjustMode} 
          className="crop-adjust"
          aria-label="Adjust crop area"
        >
          <Maximize2 size={16} />
          Adjust Position
        </button>
        <button 
          onClick={() => zoomToCrop()} 
          className="crop-zoom"
          aria-label="Zoom to fit crop"
        >
          <ZoomIn size={16} />
          Fill Crop Area
        </button>
        <button 
          onClick={applyCrop} 
          className="crop-apply"
          aria-label="Apply crop"
        >
          <Check size={16} />
          Apply Crop
        </button>
      </>
    ) : (
      <>
        <button 
          onClick={() => setCropAdjustMode(false)} 
          className="crop-adjust-cancel"
          aria-label="Cancel adjustment"
        >
          <X size={16} />
          Cancel Adjust
        </button>
        <button 
          onClick={applyCrop} 
          className="crop-apply"
          aria-label="Apply crop"
        >
          <Check size={16} />
          Finalize Crop
        </button>
      </>
    )}
    <button 
      onClick={cancelCrop} 
      className="crop-cancel"
      aria-label="Cancel crop"
    >
      <X size={16} />
      Cancel
    </button>
  </div>
)}
              </div>
            )}
          </div>
        </div>

        <div className="editor-canvas">
          <div
            ref={containerRef}
            className={`canvas-container ${isPanning ? 'panning' : ''}`}
            style={{
              cursor: isPanning ? 'grabbing' : cropMode ? 'crosshair' : 'grab'
            }}
            onWheel={handleWheel}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onContextMenu={(e) => e.preventDefault()}
            aria-label="Image editing canvas"
          >
            <div
              ref={imageWrapperRef}
              className={`image-wrapper ${cropMode ? 'crop-mode' : ''}`}
              style={{
                transform: `translate(${offset.x}px, ${offset.y}px) scale(${scale})`,
                transformOrigin: 'top left'
              }}
            >
              <img
                ref={imageRef}
                src={src}
                alt="Editing"
                style={{
                  filter: showOriginal ? 'none' : getFilterString(),
                  transform: showOriginal ? 'none' : getTransformString(),
                  pointerEvents: 'none',
                  opacity: showOriginal ? 0.7 : 1
                }}
                draggable={false}
                onLoad={() => zoomToFit()}
              />
              
              {showOriginal && (
                <div className="original-overlay">
                  <img
                    src={initialSrc}
                    alt="Original"
                    style={{
                      filter: 'none',
                      transform: 'none',
                      width: '100%',
                      height: '100%',
                      objectFit: 'contain'
                    }}
                  />
                </div>
              )}
              
              {cropMode && cropArea.width > 0 && cropArea.height > 0 && (
                <div
                  className="crop-overlay"
                  style={{
                    left: `${cropArea.x * scale + offset.x}px`,
                    top: `${cropArea.y * scale + offset.y}px`,
                    width: `${cropArea.width * scale}px`,
                    height: `${cropArea.height * scale}px`
                  }}
                />
              )}
            </div>
          </div>
          
          <div className="canvas-controls">
            <button 
              onClick={() => setScale(prev => Math.max(0.1, prev * 0.9))}
              className="zoom-btn"
              aria-label="Zoom out"
            >
              <ZoomOut size={20} />
            </button>
            <div className="zoom-value">
              {Math.round(scale * 100)}%
            </div>
            <button 
              onClick={() => setScale(prev => Math.min(10, prev * 1.1))}
              className="zoom-btn"
              aria-label="Zoom in"
            >
              <ZoomIn size={20} />
            </button>
          </div>
        </div>
      </div>

      <canvas ref={canvasRef} style={{ display: 'none' }} />
    </div>
  );
};

export default ImageEditorPopup;