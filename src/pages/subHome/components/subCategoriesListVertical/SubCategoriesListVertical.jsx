import React from "react";
import "./subCategoriesListVertical.scss";

// Assets
import mensAndWomans from "../../../../assets/mensAndWomansCategory.svg";
import mensSubCategory from "../../../../assets/mensSubCategory.svg";
import womansSubCategory from "../../../../assets/womensSubCategory.svg";
import kidsSubCategory from "../../../../assets/kidsSubCategory.svg";
import outWearSubCategory from "../../../../assets/outWearSubCategory.svg";
import sleepWearSubCategory from "../../../../assets/sleepWearSubCategory.svg";

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

const SubCategoriesListVertical = () => {
  return (
    <div className="sub-categories-list">
      {exampleSubCategories.map((item, index) => (
        <div
          key={index}
          className={`sub-category-icon-card ${
            index !==1  ? "active-sub-category" : "inactive-sub-category"
          }`}
        >
          <img src={item.logo} />
          <p>{item.name}</p>
        </div>
      ))}
    </div>
  );
};

export default SubCategoriesListVertical;
