import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import PostList from "../components/PostList";
import SideMenu from "../components/SideMenu";
import SEO from "../components/SEO";

const PostListPage = () => {
  const [open, setOpen] = useState(false);
  const [searchParams] = useSearchParams();

  // Extract category from URL params
  const category = searchParams.get("cat");
  const sort = searchParams.get("sort");
  const searchQuery = searchParams.get("search");

  // Generate dynamic title based on filters
  let pageTitle = "All Posts";
  if (category) {
    pageTitle = `${category.charAt(0).toUpperCase() + category.slice(1)} Posts`;
  } else if (searchQuery) {
    pageTitle = `Search Results for "${searchQuery}"`;
  } else if (sort) {
    pageTitle = `${sort === "newest" ? "Latest" : sort === "oldest" ? "Oldest" : "Popular"} Posts`;
  }

  // Generate dynamic description
  let pageDescription = "Browse all articles on nextblog";
  if (category) {
    pageDescription = `Browse ${category} articles on nextblog`;
  } else if (searchQuery) {
    pageDescription = `Search results for "${searchQuery}" on nextblog`;
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
        title={pageTitle}
        description={pageDescription}
        url={currentUrl}
        type="website"
        keywords={keywords}
      />
      <h1 className="mb-8 text-2xl">Negative Positive Systems</h1>
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="bg-blue-800 text-sm text-white px-4 py-2 rounded-2xl mb-4 md:hidden"
      >
        {open ? "close" : "Filter or Search"}
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
