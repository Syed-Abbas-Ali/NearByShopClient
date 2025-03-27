import OfferCategoryItem from "../../../components/offerCategoryItem/OfferCategoryItem";
import "./myDiscounts.scss";

const MyDiscounts = ({ handleExistingDiscounts, allDiscounts }) => {
  const handleMore = () => {
    handleExistingDiscounts();
  };
  return (
    <div className="my-discounts-container">
      <div className="my-discounts-header">
        <h3>My Discounts</h3>
        <p onClick={handleMore}>See More</p>
      </div>
      <div className="my-discounts-list-div">
        {allDiscounts?.map((item, index) => {
          return <OfferCategoryItem discountItem={item} key={index} isSeller={true}/>;
        })}
      </div>
    </div>
  );
};

export default MyDiscounts;
