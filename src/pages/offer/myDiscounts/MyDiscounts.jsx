import OfferCategoryItem from "../../../components/offerCategoryItem/OfferCategoryItem";
import "./myDiscounts.scss";

const MyDiscounts = ({ handleExistingDiscounts, allDiscounts }) => {
  const handleMore = () => {
    handleExistingDiscounts();
  };

  return (
    <>
      {allDiscounts && allDiscounts.length > 0 ? (
        <div className="my-discounts-container">
          <div className="my-discounts-header">
            <h3>My Discounts</h3>
            <p onClick={handleMore} style={{ cursor: "pointer", color: "blue" }}>
              See More
            </p>
          </div>
          <div className="my-discounts-list-div">
            {allDiscounts.map((item, index) => (
              <OfferCategoryItem
                discountItem={item}
                key={index}
                isSeller={true}
              />
            ))}
          </div>
        </div>
      ) : (
        <p className="No-discount-added">No discount added</p>
      )}
    </>
  );
};

export default MyDiscounts;
