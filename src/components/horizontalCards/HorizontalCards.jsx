import React from "react";
import "./horizontalCards.scss";
// Assets
import mensAndWomans from "../../assets/mensAndWomansCategory.svg";
import mensSubCategory from "../../assets/mensSubCategory.svg";
import womansSubCategory from "../../assets/womensSubCategory.svg";
import kidsSubCategory from "../../assets/kidsSubCategory.svg";
import outWearSubCategory from "../../assets/outWearSubCategory.svg";
import sleepWearSubCategory from "../../assets/sleepWearSubCategory.svg";
const exampleSubCategories = [
  {
    logo: mensAndWomans,
    name: "Men & Women",
  },
  {
    logo: mensSubCategory,
    name: "Men's",
  },
  {
    logo: womansSubCategory,
    name: "Women’s",
  },
  {
    logo: kidsSubCategory,
    name: "Kids",
  },
  {
    logo: outWearSubCategory,
    name: "Outerwear & Jackets",
  },
  {
    logo: womansSubCategory,
    name: "Women’s",
  },
  {
    logo: kidsSubCategory,
    name: "Kids",
  },
  {
    logo: outWearSubCategory,
    name: "Outerwear & Jackets",
  },
  {
    logo: sleepWearSubCategory,
    name: "Lingerie & Sleepwear",
  },
  {
    logo: kidsSubCategory,
    name: "Kids",
  },
  {
    logo: outWearSubCategory,
    name: "Outerwear & Jackets",
  },
  {
    logo: sleepWearSubCategory,
    name: "Lingerie & Sleepwear",
  },
  {
    logo: sleepWearSubCategory,
    name: "Lingerie & Sleepwear",
  },
  {
    logo: kidsSubCategory,
    name: "Kids",
  },
  {
    logo: outWearSubCategory,
    name: "Outerwear & Jackets",
  },
  {
    logo: sleepWearSubCategory,
    name: "Lingerie & Sleepwear",
  },
];

const HorizontalCards = () => {
  return (
    <div className="horizontal-cards">
      <h3>Categories</h3>
      <div className="card-container">
        {exampleSubCategories.map((item, index) => {
          return (
            <div key={index} className="single-card">
              <div>
                <img src={item.logo} />
              </div>
              <p>{item.name}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default HorizontalCards;
