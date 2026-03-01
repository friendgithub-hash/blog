import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Search from "./Search";

const MainCategories = () => {
  const { t } = useTranslation();

  return (
    <div className="hidden md:flex bg-white rounded-2xl xl:rounded-3xl p-4 shadow-lg items-center justify-center gap-8">
      {/* links */}
      <div className="flex-1 flex items-center justify-between flex-wrap">
        <Link
          to="/posts"
          className="bg-blue-800 text-white rounded-full px-4 py-2"
        >
          {t("postList.allPosts")}
        </Link>
        <Link
          to="/posts?cat=application"
          className="hover:bg-blue-50 rounded-full px-4 py-2"
        >
          {t("categories.application")}
        </Link>
        <Link
          to="/posts?cat=service"
          className="hover:bg-blue-50 rounded-full px-4 py-2"
        >
          {t("categories.service")}
        </Link>
        <Link
          to="/posts?cat=products"
          className="hover:bg-blue-50 rounded-full px-4 py-2"
        >
          {t("categories.products")}
        </Link>
        <Link
          to="/posts?cat=distributors"
          className="hover:bg-blue-50 rounded-full px-4 py-2"
        >
          {t("categories.distributors")}
        </Link>
        <Link
          to="/posts?cat=news"
          className="hover:bg-blue-50 rounded-full px-4 py-2"
        >
          {t("categories.news")}
        </Link>
      </div>
      <span className="text-xl font-medium">|</span>
      {/* search */}
      <Search />
    </div>
  );
};

export default MainCategories;
