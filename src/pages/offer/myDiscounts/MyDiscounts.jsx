import React, { useRef, useEffect, useState } from "react";
import OfferCategoryItem from "../../../components/offerCategoryItem/OfferCategoryItem";
import "./myDiscounts.scss";
import rightArrow from "../../../assets/forwardIcon.svg";

const MyDiscounts = ({ 
  handleExistingDiscounts, 
  allDiscounts,
  fetchMoreDiscounts,
  hasMore,
  isLoading 
}) => {
  const containerRef = useRef(null);
  const [isFetching, setIsFetching] = useState(false);

  const handleScroll = () => {
    if (!containerRef.current || isFetching || !hasMore) return;

    const container = containerRef.current;
    const scrollLeft = container.scrollLeft;
    const scrollWidth = container.scrollWidth;
    const clientWidth = container.clientWidth;

    if (scrollLeft + clientWidth >= scrollWidth * 0.8) {
      setIsFetching(true);
      fetchMoreDiscounts()
        .finally(() => setIsFetching(false));
    }
  };

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, [isFetching, hasMore]);

  return (
    <>
      {allDiscounts && allDiscounts.length > 0 ? (
        <div className="my-discounts-container">
          <div className="my-discounts-header">
            <h3>My Discounts</h3>
            <img src={rightArrow} alt="View all" onClick={handleExistingDiscounts} />
          </div>
          <div 
            className="my-discounts-list-div"
            ref={containerRef}
          >
            {allDiscounts.map((item, index) => (
              <div className="discount-item-wrapper" key={index}>
                <OfferCategoryItem
                  discountItem={item}
                  isSeller={true}
                />
              </div>
            ))}
            {(isLoading || isFetching) && (
              <div className="loading-more">Loading more discounts...</div>
            )}
            {!hasMore && allDiscounts.length > 10 && (
              <div className="no-more-items">No more discounts to show</div>
            )}
          </div>
        </div>
      ) : (
        <p className="No-discount-added">No discount added</p>
      )}
    </>
  );
};

export default MyDiscounts;