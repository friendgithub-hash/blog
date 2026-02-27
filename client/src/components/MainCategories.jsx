import { Link } from "react-router-dom";
import Search from "./Search";

const MainCategories = () => {
  return (
    <div className="hidden md:flex bg-white rounded-2xl xl:rounded-3xl p-4 shadow-lg items-center justify-center gap-8">
      {/* links */}
      <div className="flex-1 flex items-center justify-between flex-wrap">
        <Link
          to="/posts"
          className="bg-blue-800 text-white rounded-full px-4 py-2"
        >
          All Posts
        </Link>
        <Link
          to="/posts?cat=application"
          className="hover:bg-blue-50 rounded-full px-4 py-2"
        >
          Application
        </Link>
        <Link
          to="/posts?cat=service"
          className="hover:bg-blue-50 rounded-full px-4 py-2"
        >
          Service
        </Link>
        <Link
          to="/posts?cat=products"
          className="hover:bg-blue-50 rounded-full px-4 py-2"
        >
          Products
        </Link>
        <Link
          to="/posts?cat=distributors"
          className="hover:bg-blue-50 rounded-full px-4 py-2"
        >
          Distributors
        </Link>
        <Link
          to="/posts?cat=news"
          className="hover:bg-blue-50 rounded-full px-4 py-2"
        >
          News
        </Link>
      </div>
      <span className="text-xl font-medium">|</span>
      {/* search */}
      <Search />
    </div>
  );
};

export default MainCategories;
