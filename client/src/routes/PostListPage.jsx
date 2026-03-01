import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import PostList from "../components/PostList";
import SideMenu from "../components/SideMenu";
import SEO from "../components/SEO";

const PostListPage = () => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [searchParams] = useSearchParams();

  // Extract category from URL params
  const category = searchParams.get("cat");
  const sort = searchParams.get("sort");
  const searchQuery = searchParams.get("search");

  // Generate dynamic title based on filters
  let pageTitle = t("postList.allPosts");
  if (category) {
    const categoryName = category.charAt(0).toUpperCase() + category.slice(1);
    pageTitle = t("postList.categoryPosts", { category: categoryName });
  } else if (searchQuery) {
    pageTitle = t("postList.searchResults", { query: searchQuery });
  } else if (sort) {
    if (sort === "newest") {
      pageTitle = t("postList.latestPosts");
    } else if (sort === "oldest") {
      pageTitle = t("postList.oldestPosts");
    } else if (sort === "popular") {
      pageTitle = t("postList.popularPosts");
    }
  }

  // Generate dynamic description
  let pageDescription = t("postList.browseAll");
  if (category) {
    pageDescription = t("postList.browseCategory", { category });
  } else if (searchQuery) {
    pageDescription = t("postList.searchDescription", { query: searchQuery });
  }

  // Generate URL with query params
  const currentUrl = `/posts${category ? `?cat=${category}` : ""}`;

  // Generate keywords
  const keywords = category
    ? [category, "blog", "articles"]
    : ["blog", "articles", "posts"];

  return (
    <div className="">
      <SEO
        titleKey="seo.posts.title"
        descriptionKey="seo.posts.description"
        url={currentUrl}
        type="website"
        keywords={keywords}
      />
      <h1 className="mb-8 text-2xl">{t("postList.pageTitle")}</h1>
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="bg-blue-800 text-sm text-white px-4 py-2 rounded-2xl mb-4 md:hidden"
      >
        {open ? t("postList.close") : t("postList.filterOrSearch")}
      </button>
      <div className="flex flex-col-reverse gap-8 md:flex-row">
        <div>
          <PostList />
        </div>
        <div className={`${open ? "block" : "hidden"} md:block`}>
          <SideMenu />
        </div>
      </div>
    </div>
  );
};

export default PostListPage;
