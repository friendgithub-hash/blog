import { useAuth, useUser } from "@clerk/clerk-react";
import "react-quill-new/dist/quill.snow.css";
import ReactQuill from "react-quill-new";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import Upload from "../components/upload";

const Write = () => {
  const { isLoaded, isSignedIn } = useUser();
  const [value, setValue] = useState("");
  const [cover, setCover] = useState("");
  const [img, setImg] = useState("");
  const [video, setVideo] = useState("");
  const [progress, setProgress] = useState(0);

  // Edit mode detection
  const [searchParams] = useSearchParams();
  const editMode = searchParams.get("edit");
  const postId = editMode;

  const navigate = useNavigate();
  const { getToken } = useAuth();

  // Fetch existing post for edit mode
  const {
    data: existingPost,
    isLoading: isLoadingPost,
    error: postError,
  } = useQuery({
    queryKey: ["post", postId],
    queryFn: async () => {
      if (!postId) return null;
      const token = await getToken();
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/posts/id/${postId}`,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      return res.data;
    },
    enabled: !!postId,
  });

  // Pre-fill form when existing post loads
  useEffect(() => {
    if (existingPost && editMode) {
      setValue(existingPost.content);
      setCover({ filePath: existingPost.img });
    }
  }, [existingPost, editMode]);

  useEffect(() => {
    img && setValue((prev) => prev + `<p><img src="${img.url}"/></p>`);
  }, [img]);

  useEffect(() => {
    video &&
      setValue(
        (prev) =>
          prev + `<p><iframe class="ql-video" src="${video.url}" /></p>`,
      );
  }, [video]);

  // Create mutation
  const mutation = useMutation({
    mutationFn: async (newPost) => {
      const token = await getToken();
      return axios.post(`${import.meta.env.VITE_API_URL}/posts`, newPost, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    },
    onError: (error) => {
      const serverData = error.response?.data;
      const message =
        serverData && typeof serverData === "object"
          ? JSON.stringify(serverData)
          : serverData || error.message;

      console.error("Failed to create post:", message);
      toast.error("Could not create post: " + message);
    },
    onSuccess: (data) => {
      toast.success("Post created successfully!");
      navigate(`/post/${data.data.slug}`);
    },
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: async (updatedPost) => {
      const token = await getToken();
      return axios.put(
        `${import.meta.env.VITE_API_URL}/posts/${postId}`,
        updatedPost,
        { headers: { Authorization: `Bearer ${token}` } },
      );
    },
    onSuccess: (data) => {
      toast.success("Post updated successfully!");
      navigate(`/post/${data.data.slug}`);
    },
    onError: (error) => {
      const message = error.response?.data || error.message;
      toast.error(`Failed to update post: ${message}`);
    },
  });

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  if (isLoaded && !isSignedIn) {
    return <div>Please sign in</div>;
  }

  if (isLoadingPost) {
    return <div>Loading post data...</div>;
  }

  if (postError) {
    return <div>Failed to load post data</div>;
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    const data = {
      img: cover.filePath || "",
      title: formData.get("title"),
      desc: formData.get("desc"),
      content: value,
      category: formData.get("category"),
    };

    if (editMode) {
      updateMutation.mutate(data);
    } else {
      mutation.mutate(data);
    }
  };

  return (
    <div className="h-[calc(100vh-64px)] md:h-[calc(100vh-80px)] flex flex-col gap-6">
      <h1 className="text-xl font-light mb-4">
        {editMode ? "Edit Post" : "Create a new post"}
      </h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-6 flex-1 mb-6">
        <Upload type="image" setProgress={setProgress} setData={setCover}>
          <button
            type="button"
            className="w-max p-2 shadow-md rounded-xl text-sm bg-white text-gray-500"
          >
            Add a cover image
          </button>
        </Upload>
        <input
          className="text-3xl font-semibold bg-transparent outline-none"
          type="text"
          placeholder="Title"
          name="title"
          defaultValue={editMode ? existingPost?.title : ""}
        />
        <div className="flex items-center gap-4">
          <label htmlFor="" className="text-sm">
            Choose a category
          </label>
          <select
            name="category"
            id=""
            className="p-2 rounded-xl bg-white shadow-md"
            defaultValue={editMode ? existingPost?.category : ""}
          >
            <option value="general">General</option>
            <option value="web-design">Web Design</option>
            <option value="databases">Databases</option>
            <option value="seo">Search Engines</option>
            <option value="marketing">Marketing</option>
          </select>
        </div>
        <textarea
          className="p-4 rounded-xl bg-white shadow-md"
          name="desc"
          placeholder="A short description"
          defaultValue={editMode ? existingPost?.desc : ""}
        ></textarea>
        <div className="flex flex-1">
          <div className="flex flex-col gap-2 mr-2">
            <Upload type="image" setProgress={setProgress} setData={setImg}>
              <div className="cursor-pointer">🎨</div>
            </Upload>
            <Upload type="video" setProgress={setProgress} setData={setVideo}>
              <div className="cursor-pointer">🎞</div>
            </Upload>
          </div>
          <ReactQuill
            theme="snow"
            className="flex-1 rounded-xl bg-white shadow-md"
            value={value}
            onChange={setValue}
            readOnly={0 < progress && progress < 100}
          />
        </div>
        <button
          disabled={
            mutation.isPending ||
            updateMutation.isPending ||
            (0 < progress && progress < 100)
          }
          className="bg-blue-800 text-white font-medium rounded-xl mt-4 p-2 w-36 disabled:bg-blue-400 disabled:cursor-not-allowed"
          type="submit"
        >
          {mutation.isPending || updateMutation.isPending
            ? "Loading..."
            : editMode
              ? "Update"
              : "Publish"}
        </button>
        {"Progress: " + progress + "% uploaded"}
      </form>
    </div>
  );
};

export default Write;
