import React, { useState, useRef } from "react";
import "./imagesPreviewSwiper.scss";

const ImagesPreviewSwiper = ({ previewImagesList: images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const touchStartX = useRef(null);
  const touchEndX = useRef(null);

  // Handle touch start
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  // Handle touch move
  const handleTouchMove = (e) => {
    touchEndX.current = e.touches[0].clientX;
  };

  // Handle touch end (determine swipe direction)
  const handleTouchEnd = () => {
    if (touchStartX.current === null || touchEndX.current === null) return;

    const deltaX = touchStartX.current - touchEndX.current;

    if (deltaX > 50) {
      // Swipe left (next image)
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    } else if (deltaX < -50) {
      // Swipe right (previous image)
      setCurrentIndex((prevIndex) =>
        prevIndex === 0 ? images.length - 1 : prevIndex - 1
      );
    }

    touchStartX.current = null;
    touchEndX.current = null;
  };

  return (
    <div
      className="swiper-container"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Image Container */}
      <div
        className="swiper-wrapper"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {images.map((src, index) => (
          <img key={index} src={src} alt={`Slide ${index + 1}`} />
        ))}
      </div>

      {/* Dots Indicator */}
      <div className="dots">
        {images.map((_, index) => (
          <span key={index} className={`dot ${index === currentIndex ? "active" : ""}`}></span>
        ))}
      </div>
    </div>
  );
};

export default ImagesPreviewSwiper;
