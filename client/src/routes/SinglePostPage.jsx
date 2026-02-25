import { Link, useParams } from "react-router-dom";
import Image from "../components/Image";
import PostMenuActions from "../components/PostMenuActions";
import Search from "../components/Search";
import Comments from "../components/Comments";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { format } from "timeago.js";

const fetchPost = async (slug) => {
  // FIXED: Changed VITE_BASE_URL to VITE_API_URL to match the env variable
  const res = await axios.get(`${import.meta.env.VITE_API_URL}/posts/${slug}`);
  return res.data;
};

const SinglePostPage = () => {
  const { slug } = useParams();

  const { isPending, error, data } = useQuery({
    queryKey: ["post", slug],
    queryFn: () => fetchPost(slug),
  });
  if (isPending) return <p>Loading...</p>;
  if (error) return <p>{error.message}</p>;
  if (!data) return <p>No post found</p>;

  return (
    <div className="flex flex-col gap-8">
      {/* Details */}
      <div className="flex gap-8">
        <div className="lg:w-3/5 flex flex-col gap-8">
          <h1 className="text-xl md:text-3xl xl:text-4xl 2xl:text-5xl font-semibold">
            {data.title}
          </h1>
          <div className="flex items-center gap-2 text-gray-400 text-sm">
            <span>Written by</span>
            <Link className="text-blue-800">
              {data.user?.username || "Unknown"}
            </Link>
            <span>on</span>
            <Link className="text-blue-800">{data.category}</Link>
            <span>{format(data.createdAt)}</span>
          </div>
          <p className="text-gray-500 font-medium">{data.desc}</p>
        </div>
        {data.img && (
          <div className="hidden lg:block w-2/5">
            <Image src={data.img} w="600" className="rounded-2xl" />
          </div>
        )}
      </div>
      {/* Cotent */}
      <div className="flex flex-col md:flex-row gap-12">
        {/* Text */}
        <div className="lg:text-lg flex flex-col gap-6 text-justify">
          <p>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Laborum
            dolore reiciendis accusamus facilis rerum, sint laudantium est ut
            quaerat, ab consequatur pariatur culpa dolorem dolores soluta velit
            a, similique perspiciatis?
          </p>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptas,
            voluptate.lorem ipsum dolor sit amet consectetur adipisicing elit.
            Voluptas, voluptate.loremdkladf ipsum dolor sit amet consectetur
            adipisicing elit. Voluptas, voluptate.
          </p>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Laborum
            dolore reiciendis accusamus facilis rerum, sint laudantium est ut
            quaerat, ab consequatur pariatur culpa dolorem dolores soluta velit
            a, similique perspiciatis?
          </p>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptas,
            voluptate.lorem ipsum dolor sit amet consectetur adipisicing elit.
            Voluptas, voluptate.loremdkladf ipsum dolor sit amet consectetur
            adipisicing elit. Voluptas, voluptate.
          </p>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Laborum
            dolore reiciendis accusamus facilis rerum, sint laudantium est ut
            quaerat, ab consequatur pariatur culpa dolorem dolores soluta velit
            a, similique perspiciatis?
          </p>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptas,
            voluptate.lorem ipsum dolor sit amet consectetur adipisicing elit.
            Voluptas, voluptate.loremdkladf ipsum dolor sit amet consectetur
            adipisicing elit. Voluptas, voluptate.
          </p>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Itaque
            consectetur, fugit eveniet illo excepturi aliquam dicta cum
            distinctio ducimus, aspernatur alias consequuntur eligendi tenetur!
            Fuga voluptate minima nemo quibusdam architecto?
          </p>
        </div>
        {/* Menu */}
        <div className="px-4 h-max sticky top-8">
          <h1 className="mb-4 text-sm font-medium">Author</h1>
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-8">
              {data.user?.img && (
                <Image
                  src={data.user?.img}
                  className="w-12 h-12 rounded-full object-cover"
                  alt={data.user?.username || "Unknown User"}
                  w="48"
                  h="48"
                />
              )}
              <Link className="text-blue-800">
                {data.user?.username || "Unknown User"}
              </Link>
            </div>
            <p className="text-sm text-gray-500">
              Lorem ipsum dolor sit amet, consectetur{" "}
            </p>
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
          <h1 className="mt-8 mb-4 text-sm font-medium">Categories</h1>
          <div className="flex flex-col gap-2 text-sm">
            <Link className="underline">All</Link>
            <Link className="underline" to="/">
              Web Design
            </Link>
            <Link className="underline" to="/">
              Development
            </Link>
            <Link className="underline" to="/">
              Databases
            </Link>
            <Link className="underline" to="/">
              Search Engines
            </Link>
            <Link className="underline" to="/">
              Marketing
            </Link>
          </div>
          <h1 className="mt-8 mb-4 text-sm font-medium">Search</h1>
          <Search />
        </div>
      </div>
      {/* Comments */}
      <Comments postId={data._id} />
    </div>
  );
};

export default SinglePostPage;
