import { Link } from "react-router-dom";
import MainCategories from "../components/MainCategories";
import FeaturedPosts from "../components/FeaturedPosts";
import PostList from "../components/PostList";

const Homepage = () => {
  return (
    <div className="mt-4 flex flex-col gap-4">
      {/* Breadcrumbs */}
      <div className="flex gap-4">
        <Link to="/">Home</Link>
        <span>·</span>
      </div>
      {/* Introduction */}
      <div className="flex items-center justify-between">
        {/* title */}
        <div className="">
          <h1 className="text-gray-800 text-2xl md:text-5xl lg:text-6xl font-bold">
            Advanced Negative Pressure Ink Supply Systems
          </h1>
          <p className="mt-8 text-md md:text-xl">
            Negative pressure systems are critical components in UV printing,
            designed to stabilize ink delivery by creating a vacuum that
            balances gravitational forces. This technology ensures a stable ink
            meniscus at the nozzle, preventing dripping and enabling high-speed,
            continuous production across various orientations.
          </p>
        </div>
      </div>
      {/* Categories*/}
      <MainCategories />
      {/* Featured Posts */}
      <FeaturedPosts />
      {/* Post list */}
      <div className="">
        <h1 className="my-8 text-2xl text-gray-600">Recent Posts</h1>
        <PostList />
      </div>
    </div>
  );
};

export default Homepage;
