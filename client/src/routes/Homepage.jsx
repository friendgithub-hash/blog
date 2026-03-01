import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import MainCategories from "../components/MainCategories";
import FeaturedPosts from "../components/FeaturedPosts";
import PostList from "../components/PostList";
import SEO from "../components/SEO";

const Homepage = () => {
  const { t } = useTranslation();

  return (
    <>
      <SEO
        titleKey="seo.homepage.title"
        descriptionKey="seo.homepage.description"
        url="/"
        type="website"
      />
      <div className="mt-4 flex flex-col gap-4">
        {/* Breadcrumbs */}
        <div className="flex gap-4">
          <Link to="/">{t("breadcrumb.home")}</Link>
          <span>·</span>
        </div>
        {/* Introduction */}
        <div className="flex items-center justify-between">
          {/* title */}
          <div className="">
            <h1 className="text-gray-800 text-2xl md:text-5xl lg:text-6xl font-bold">
              {t("homepage.title")}
            </h1>
            <p className="mt-8 text-md md:text-xl">{t("homepage.subtitle")}</p>
          </div>
        </div>
        {/* Categories*/}
        <MainCategories />
        {/* Featured Posts */}
        <FeaturedPosts />
        {/* Post list */}
        <div className="">
          <h1 className="my-8 text-2xl text-gray-600">
            {t("homepage.recentPosts")}
          </h1>
          <PostList />
        </div>
      </div>
    </>
  );
};

export default Homepage;
