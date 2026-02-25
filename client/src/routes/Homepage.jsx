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
            Lorem ipsum dolor sit amet consectetur adipisicing elit
          </h1>
          <p className="mt-8 text-md md:text-xl">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatem
            voluptas veritatis repellendus, ad voluptatibus eius accusantium,
            ullam quidem qui nobis nisi repellat quos in vero exercitationem
            quod! Nam, maxime? Repellendus.
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
