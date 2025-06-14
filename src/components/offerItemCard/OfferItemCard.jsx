import React, { useState, useEffect, useRef, useCallback } from "react";
import "./offerItemCard.scss";
import rightArrow from "../../assets/forwardIcon.svg";
import OfferCategoryItem from "../offerCategoryItem/OfferCategoryItem";
import { useGetDiscountsQuery } from "../../apis&state/apis/discounts";
import { useSelector } from "react-redux";

const OfferItemCard = ({ categoryList, subcategory, discountItem }) => {
  const { globalFilter } = useSelector((state) => state.globalState);
  const [page, setPage] = useState(1);
  const [items, setItems] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [containerWidth, setContainerWidth] = useState(0);
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);

  const containerRef = useRef(null);
  const scrollTimeoutRef = useRef(null);
  const loadingRef = useRef(null);
  const observerRef = useRef(null);

  // Load location from session storage
  useEffect(() => {
    try {
      const storedLocation = sessionStorage.getItem('userLocation');
      if (storedLocation) {
        const userLocation = JSON.parse(storedLocation);
        setLatitude(userLocation?.coordinates?.latitude);
        setLongitude(userLocation?.coordinates?.longitude);
      }
    } catch (error) {
      console.error("Failed to parse userLocation from sessionStorage", error);
    }
  }, []);

  // Fetch discounts data
  const { data, isFetching } = useGetDiscountsQuery(
    {
      ...globalFilter,
      latitude,
      longitude,
      category: categoryList,
      subCategory: subcategory || "",
      page,
    },
    {
      skip: !latitude || !longitude,
    }
  );

  // Reset state when category/subcategory changes
  useEffect(() => {
    setPage(1);
    setItems([]);
    setHasMore(true);
    setIsLoadingMore(false);
  }, [categoryList, subcategory]);

  // Update items when data changes
  useEffect(() => {
    if (data?.data?.items) {
      if (page === 1) {
        setItems(data.data.items);
      } else {
        // Filter out duplicates before adding new items
        const existingIds = new Set(items.map(item => item._id));
        const uniqueNewItems = data.data.items.filter(item => !existingIds.has(item._id));
        setItems(prev => [...prev, ...uniqueNewItems]);
      }
      setHasMore(data.data.items.length >= (data.data.itemsPerPage || 10));
      setIsLoadingMore(false);
    }
  }, [data, page]);

  // Handle container resize
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.clientWidth);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Setup IntersectionObserver for infinite scroll
  useEffect(() => {
    if (!loadingRef.current || !hasMore) return;

    const options = {
      root: containerRef.current,
      rootMargin: "0px",
      threshold: 0.1,
    };

    observerRef.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !isFetching && hasMore && !isLoadingMore) {
        setIsLoadingMore(true);
        setPage(prev => prev + 1);
      }
    }, options);

    observerRef.current.observe(loadingRef.current);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [isFetching, hasMore, isLoadingMore, items]);

  // Fallback scroll handler
  const handleScroll = useCallback(() => {
    if (!containerRef.current || isFetching || !hasMore || isLoadingMore) return;

    const container = containerRef.current;
    const { scrollLeft, scrollWidth, clientWidth } = container;
    
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }

    scrollTimeoutRef.current = setTimeout(() => {
      const loadThreshold = containerWidth > 768 ? 0.75 : 0.85;
      
      if (scrollLeft + clientWidth >= scrollWidth * loadThreshold) {
        setIsLoadingMore(true);
        setPage(prev => prev + 1);
      }
    }, 300);
  }, [isFetching, hasMore, containerWidth, isLoadingMore]);

  // Add scroll event listener
  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      return () => {
        container.removeEventListener('scroll', handleScroll);
        if (scrollTimeoutRef.current) {
          clearTimeout(scrollTimeoutRef.current);
        }
      };
    }
  }, [handleScroll]);

  if (discountItem) {
    return (
      <div className="offer-item-card-div">
        <OfferCategoryItem discountItem={discountItem} />
      </div>
    );
  }

  return (
    <div className="offer-item-card-div">
      {items.length > 0 && (
        <div className="offer-item-div">
          <div className="category-name">
            <h3>{subcategory ? subcategory : categoryList}</h3>
            <img src={rightArrow} alt="right arrow" />
          </div>
          <div 
            className="category-discount-cards"
            ref={containerRef}
          >
            {items.map((item) => (
              <div 
                key={`${item._id}-${page}-${Math.random().toString(36).substr(2, 9)}`} 
                className="discount-item-wrapper"
              >
                <OfferCategoryItem discountItem={item} />
              </div>
            ))}
            
            <div 
              ref={loadingRef} 
              className={`loading-more ${(!hasMore || !items.length) ? 'hidden' : ''}`}
            >
              {(isFetching || isLoadingMore) && hasMore && (
                Array(3).fill().map((_, i) => (
                  <div key={`loading-${i}`} className="loading-card" />
                ))
              )}
            </div>
            
            {!hasMore && items.length > 0 && (
              <div className="no-more-items">
                <span>No more items</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default OfferItemCard;