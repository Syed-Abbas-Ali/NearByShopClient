import React, { useRef } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./autoSlider.scss";

import { IoIosArrowForward, IoIosArrowBack } from "react-icons/io";
import banner1 from "../../assets/banner2.png";
import banner2 from "../../assets/bannerImage4.jpg";
import banner3 from "../../assets/bannerImage5.jpg";

import sample1 from "../../assets/bannerSample1.svg";
import sample2 from "../../assets/bannerSample2.svg";
import sample3 from "../../assets/bannerSmaple3.svg";

import Carousel from "react-bootstrap/Carousel";
import "bootstrap/dist/css/bootstrap.min.css";

const banners = [
  {
    asset: sample1,
    id: 0,
  },
  {
    asset: sample2,
    id: 1,
  },
  {
    asset: sample3,
    id: 2,
  },
];

// function AutoSlider() {
//   let sliderRef = useRef(null);
//   const CustomPrevArrow = ({ onClick }) => (
//     <div className="custom-arrow custom-prev" onClick={onClick}>
//       <IoIosArrowBack className="arrow-icon"/>
//     </div>
//   );

//   const CustomNextArrow = ({ onClick }) => (
//     <div className="custom-arrow custom-next" onClick={onClick}>
//       <IoIosArrowForward className="arrow-icon"/>
//     </div>
//   );
//   const settings = {
//     dots: true,
//     infinite: true,
//     slidesToShow: 1,
//     slidesToScroll: 1,
//     autoplay: true,
//     // arrows: true,
//     autoplaySpeed: 3000,
//     prevArrow: <CustomPrevArrow />,
//     nextArrow: <CustomNextArrow />,
//   };
//   return (
//     <div className="slider-card">
//       <Slider ref={(slider) => (sliderRef = slider)} {...settings}>
//         {banners.map((item) => (
//           <div className="single-banner" key={item.id}>
//             <img src={item.asset} />
//           </div>
//         ))}
//       </Slider>
//     </div>
//   );
// }
// export default AutoSlider;


const AutoSlider = () => {
  return (
    <Carousel>
      {banners.map((banner) => (
        <Carousel.Item key={banner.id}>
          <img
            src={banner.asset}
            alt={`Slide ${banner.id + 1}`}
            style={{ width: "100%", height: "200px", objectFit: "cover",borderRadius:"8px" }}
          />
        </Carousel.Item>
      ))}
    </Carousel>
  );
};

export default AutoSlider;

