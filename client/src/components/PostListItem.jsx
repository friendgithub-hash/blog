import { Link } from "react-router-dom";
import Image from "./Image";
import { format } from "timeago.js";

const PostListItem = ({ post }) => {
  const date = new Date(post.createdAt).toLocaleDateString();

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
          {post.title}
        </Link>
        <div className="flex items-center gap-2 text-gray-400 text-sm">
          <span>Written by</span>
          <Link
            className="text-blue-800"
            to={`/posts?author=${post.user?.username || "unknown"}`}
          >
            {/* FIXED: Use optional chaining and fallback for undefined user */}
            {post.user?.username || "Unknown"}
          </Link>
          <span>on</span>
          <Link className="text-blue-800">{post.category}</Link>
          <span>{format(post.createdAt)}</span>
        </div>
        <p>{post.desc}</p>
        <Link
          to={`/post/${post.slug}`}
          className="underline text-blue-800 text-sm"
        >
          Read More
        </Link>
      </div>
    </div>
  );
};

export default PostListItem;
