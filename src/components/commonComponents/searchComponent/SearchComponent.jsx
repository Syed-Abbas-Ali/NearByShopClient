import "./searchComponent.scss";
import searchIcon from "../../../assets/searchNew1.svg";
import sendIcon from "../../../assets/searchSendIcon.svg";
import cancelIcon from "../../../assets/cancelNewIcon.svg";

const defaultSearchList = [
  "Wireless Bluetooth Headphones",
  "4K Ultra HD Smart TV",
  "Stainless Steel Water Bottle",
  "Men's Running Shoes",
  "Electric Standing Desk",
  "Gaming Laptop",
  "Smartphone",
  "Kitchen Blender",
  "Noise Cancelling Earbuds",
  "Office Chair",
];

const SearchComponent = ({ handleSearchShow }) => {
  return (
    <div className="search-component">
      <img
        src={cancelIcon}
        className="cancel-icon"
        onClick={() => handleSearchShow("CANCEL")}
      />
      <div className="search-input-card">
        <button className="search-icon">
          <img src={searchIcon} alt="" />
        </button>
        <input type="text" placeholder="Search products..." />
        <button className="search-send-icon">
          <img src={sendIcon} alt="" />
        </button>
      </div>
      <div className="search-results-text">
        <ul>
          {defaultSearchList.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default SearchComponent;
