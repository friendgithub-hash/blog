import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Image from "./Image";
import { format } from "timeago.js";

const PostListItem = ({ post }) => {
  const { i18n, t } = useTranslation();
  const currentLang = i18n.language;
  const date = new Date(post.createdAt).toLocaleDateString();

  // Get translated content or fallback to original
  const displayTitle = post.translations?.[currentLang]?.title || post.title;
  const displayDesc = post.translations?.[currentLang]?.desc || post.desc;

  return (
    <div className="flex flex-col xl:flex-row gap-8 mb-12">
      {/* Image */}
      {post.img && (
        <div className="md:hidden xl:block xl:w-1/3">
          <Image src={post.img} className="rounded-2xl object-cover w=735" />
        </div>
      )}

      {/* Details */}
      <div className="flex flex-col gap-4">
        <Link to={`/post/${post.slug}`} className="text-4xl font-semibold">
          {displayTitle}
        </Link>
        <div className="flex items-center gap-2 text-gray-400 text-sm">
          <span>{t("post.writtenBy")}</span>
          <Link
            className="text-blue-800"
            to={`/posts?author=${post.user?.username || "unknown"}`}
          >
            {/* FIXED: Use optional chaining and fallback for undefined user */}
            {post.user?.username || "Unknown"}
          </Link>
          <span>{t("post.on")}</span>
          <Link className="text-blue-800">{post.category}</Link>
          <span>{format(post.createdAt)}</span>
        </div>
        <p>{displayDesc}</p>
        <Link
          to={`/post/${post.slug}`}
          className="underline text-blue-800 text-sm"
        >
          {t("post.readMore")}
        </Link>
      </div>
    </div>
  );
};

export default PostListItem;
