import BottomNavbar from "../../components/bottomNavbar/BottomNavbar";
import Navbar from "../../components/navbar/Navbar";
import Search from "../../components/search/Search";
import SingleProduct from "../../components/singleProduct/SingleProduct";
import { allProducts } from "../../utils/sampleData";
import Categories from "../home/categories/Categories";
import "./subCategories.scss";

const SubCategories = () => {
  return (
    <>
      <Navbar />
      <div className="sub-categories">
        <Search />
        <div className="sub-categories-list">
          <Categories title="Sub Categories" />
        </div>
        <div className="sub-category-products grid-card">
          {allProducts.map((item, index) => {
            return <SingleProduct product={item} key={index} />;
          })}
        </div>
      </div>
      <BottomNavbar />
    </>
  );
};

export default SubCategories;
