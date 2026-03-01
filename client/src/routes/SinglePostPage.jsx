import { Link, useParams } from "react-router-dom";
import Image from "../components/Image";
import PostMenuActions from "../components/PostMenuActions";
import Search from "../components/Search";
import Comments from "../components/Comments";
import SEO from "../components/SEO";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { format } from "timeago.js";
import { useUser } from "@clerk/clerk-react";
import { useTranslation } from "react-i18next";

const fetchPost = async (slug) => {
  // FIXED: Changed VITE_BASE_URL to VITE_API_URL to match the env variable
  const res = await axios.get(`${import.meta.env.VITE_API_URL}/posts/${slug}`);
  return res.data;
};

const SinglePostPage = () => {
  const { slug } = useParams();
  const { user } = useUser();
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language;

  const { isPending, error, data } = useQuery({
    queryKey: ["post", slug],
    queryFn: () => fetchPost(slug),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Get translated content or fallback to original
  const displayTitle = data?.translations?.[currentLang]?.title || data?.title;
  const displayDesc = data?.translations?.[currentLang]?.desc || data?.desc;
  const displayContent =
    data?.translations?.[currentLang]?.content || data?.content;

  // Strip HTML tags from content for fallback description
  const stripHtml = (html) => {
    const tmp = document.createElement("div");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  };

  // Generate SEO props (only used when data exists)
  const fallbackDescription =
    data?.desc ||
    (data?.content ? stripHtml(data.content).substring(0, 160) : "");
  const keywords = data?.category ? [data.category, "blog", "article"] : [];

  // Check if user can edit this post
  const canEdit =
    user &&
    data &&
    (data.user?.clerkUserId === user.id ||
      user.publicMetadata?.role === "admin");

  // Early returns after all hooks
  if (isPending) return <p>Loading...</p>;
  if (error) return <p>{error.message}</p>;
  if (!data) return <p>No post found</p>;

  return (
    <>
      <SEO
        title={displayTitle}
        description={fallbackDescription}
        image={data.img}
        url={`/posts/${data.slug}`}
        type="article"
        author={data.user?.username}
        publishedTime={data.createdAt}
        modifiedTime={data.updatedAt}
        category={data.category}
        keywords={keywords}
      />
      <div className="flex flex-col gap-8">
        {/* Details */}
        <div className="flex gap-8">
          <div className="lg:w-3/5 flex flex-col gap-8">
            <h1 className="text-xl md:text-3xl xl:text-4xl 2xl:text-5xl font-semibold">
              {displayTitle}
            </h1>
            <div className="flex items-center gap-2 text-gray-400 text-sm">
              <span>{t("post.writtenBy")}</span>
              <Link className="text-blue-800">
                {data.user?.username || "Unknown"}
              </Link>
              <span>{t("post.on")}</span>
              <Link className="text-blue-800">{data.category}</Link>
              <span>{format(data.createdAt)}</span>
            </div>
            <p className="text-gray-500 font-medium">{displayDesc}</p>
            <div className="flex gap-2">
              <Link
                to="/write"
                className="bg-green-600 text-white px-4 py-2 rounded-xl text-sm"
              >
                {t("post.newPost")}
              </Link>
              {canEdit && (
                <Link
                  to={`/write?edit=${data._id}`}
                  className="bg-blue-800 text-white px-4 py-2 rounded-xl text-sm"
                >
                  {t("post.editPost")}
                </Link>
              )}
            </div>
          </div>
          {data.img && (
            <div className="hidden lg:block w-2/5">
              <Image src={data.img} w="600" className="rounded-2xl" />
            </div>
          )}
        </div>
        {/* Content */}
        <div className="flex flex-col md:flex-row gap-12">
          {/* Text - FIXED: Use data.content instead of dummy Lorem ipsum */}
          <div
            className="lg:text-lg flex flex-col gap-6 overflow-hidden break-words max-w-full md:flex-1"
            dangerouslySetInnerHTML={{ __html: displayContent }}
          />

          {/* Menu */}
          <div className="px-4 h-max sticky top-8 md:w-80 flex-shrink-0">
            <h1 className="mb-4 text-sm font-medium">
              {t("post.authorTitle")}
            </h1>
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-8">
                {data.user?.img && (
                  <Image
                    src={data.user?.img}
                    className="w-12 h-12 rounded-full object-cover"
                    alt={data.user?.username || "Unknown User"}
                    w="28"
                    h="28"
                  />
                )}
                <Link className="text-blue-800">
                  {data.user?.username || "Unknown User"}
                </Link>
              </div>
              <p className="text-sm text-gray-500">{data.title}</p>
              <div className="flex gap-2">
                <Link>
                  <Image src="facebook.svg" />
                </Link>
                <Link>
                  <Image src="instagram.svg" />
                </Link>
              </div>
            </div>

            <PostMenuActions post={data} />
            <h1 className="mt-8 mb-4 text-sm font-medium">
              {t("categories.title")}
            </h1>
            <div className="flex flex-col gap-2 text-sm">
              <Link className="underline" to="/?cat=application">
                {t("categories.all")}
              </Link>
              <Link className="underline" to="/?cat=application">
                {t("categories.application")}
              </Link>
              <Link className="underline" to="/?cat=service">
                {t("categories.service")}
              </Link>
              <Link className="underline" to="/?cat=products">
                {t("categories.products")}
              </Link>
              <Link className="underline" to="/?cat=distributors">
                {t("categories.distributors")}
              </Link>
              <Link className="underline" to="/?cat=news">
                {t("categories.news")}
              </Link>
            </div>
            <h1 className="mt-8 mb-4 text-sm font-medium">
              {t("search.title")}
            </h1>
            <Search />
          </div>
        </div>
        {/* Comments */}
        <Comments postId={data._id} />
      </div>
    </>
  );
};

export default SinglePostPage;
