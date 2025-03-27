import "./loader.scss";
import FadeLoader from "react-spinners/FadeLoader";

const Loader = ({
  loading = true,
  color = "#2368ae",
  height = 8,
  width = 4,
  radius = 0.5,
  margin = 1,
}) => {
  return (
    <FadeLoader
      loading={loading}
      color={color}
      height={height}
      width={width}
      radius={radius}
      margin={margin}
    />
  );
};

export default Loader;
