import { useAuth, useUser } from "@clerk/clerk-react";
import "react-quill-new/dist/quill.snow.css";
import ReactQuill from "react-quill-new";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import Upload from "../components/upload";
import SEO from "../components/SEO";
import Image from "../components/Image";
import { languages } from "../config/languages";

const Write = () => {
  const { isLoaded, isSignedIn } = useUser();
  const [value, setValue] = useState("");
  const [cover, setCover] = useState("");
  const [img, setImg] = useState("");
  const [video, setVideo] = useState("");
  const [progress, setProgress] = useState(0);
  const { t } = useTranslation();

  // Translation state
  const [activeTab, setActiveTab] = useState("original");
  const [translations, setTranslations] = useState({});

  // Edit mode detection
  const [searchParams] = useSearchParams();
  const editMode = searchParams.get("edit");
  const postId = editMode;

  const navigate = useNavigate();
  const { getToken } = useAuth();

  // Get available translation languages (exclude English)
  const translationLanguages = languages.filter((lang) => lang.code !== "en");

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

      // Initialize translations with original content as default
      const translationsObj = {};
      translationLanguages.forEach((lang) => {
        // If translation exists, use it; otherwise pre-fill with original content
        if (existingPost.translations?.[lang.code]) {
          translationsObj[lang.code] = {
            title: existingPost.translations[lang.code].title || "",
            desc: existingPost.translations[lang.code].desc || "",
            content: existingPost.translations[lang.code].content || "",
          };
        } else {
          // Pre-fill with original content for easier editing
          translationsObj[lang.code] = {
            title: existingPost.title || "",
            desc: existingPost.desc || "",
            content: existingPost.content || "",
          };
        }
      });
      setTranslations(translationsObj);
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
      toast.error(t("write.createPostError", { message }));
    },
    onSuccess: (data) => {
      toast.success(t("write.createPostSuccess"));
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
      toast.success(t("write.updatePostSuccess"));
      navigate(`/post/${data.data.slug}`);
    },
    onError: (error) => {
      const message = error.response?.data || error.message;
      toast.error(t("write.updatePostError", { message }));
    },
  });

  // Translation save mutation
  const saveTranslationMutation = useMutation({
    mutationFn: async ({ language, title, desc, content }) => {
      const token = await getToken();
      return axios.put(
        `${import.meta.env.VITE_API_URL}/posts/${postId}/translation`,
        { language, title, desc, content },
        { headers: { Authorization: `Bearer ${token}` } },
      );
    },
    onSuccess: () => {
      toast.success(t("write.translationSaved"));
    },
    onError: (error) => {
      const message = error.response?.data || error.message;
      toast.error(t("write.translationError", { message }));
    },
  });

  if (!isLoaded) {
    return <div>{t("write.loadingState")}</div>;
  }

  if (isLoaded && !isSignedIn) {
    return <div>{t("write.pleaseSignIn")}</div>;
  }

  if (isLoadingPost) {
    return <div>{t("write.loadingPostData")}</div>;
  }

  if (postError) {
    return <div>{t("write.failedToLoadPost")}</div>;
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

  const handleTranslationChange = (language, field, value) => {
    setTranslations((prev) => ({
      ...prev,
      [language]: {
        ...prev[language],
        [field]: value,
      },
    }));
  };

  const handleSaveTranslation = (language) => {
    const translation = translations[language];
    if (!translation?.title || !translation?.content) {
      toast.error(
        t("write.translationError", {
          message: "Title and content are required",
        }),
      );
      return;
    }

    saveTranslationMutation.mutate({
      language,
      title: translation.title,
      desc: translation.desc || "",
      content: translation.content,
    });
  };

  return (
    <>
      <SEO
        title={editMode ? t("seoWrite.editTitle") : t("seoWrite.createTitle")}
        description={
          editMode
            ? t("seoWrite.editDescription")
            : t("seoWrite.createDescription")
        }
        url="/write"
        noIndex={true}
      />
      <div className="h-[calc(100vh-64px)] md:h-[calc(100vh-80px)] flex flex-col gap-6">
        <h1 className="text-xl font-light mb-4">
          {editMode ? t("write.editPost") : t("write.createPost")}
        </h1>

        {/* Translation Tabs - Only show in edit mode */}
        {editMode && (
          <div className="flex gap-2 border-b border-gray-200">
            <button
              type="button"
              onClick={() => setActiveTab("original")}
              className={`px-4 py-2 font-medium ${
                activeTab === "original"
                  ? "border-b-2 border-blue-800 text-blue-800"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {t("write.originalContent")}
            </button>
            {translationLanguages.map((lang) => (
              <button
                key={lang.code}
                type="button"
                onClick={() => setActiveTab(lang.code)}
                className={`px-4 py-2 font-medium ${
                  activeTab === lang.code
                    ? "border-b-2 border-blue-800 text-blue-800"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {lang.flag} {lang.nativeName}
              </button>
            ))}
          </div>
        )}

        {/* Original Content Form */}
        {activeTab === "original" && (
          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-6 flex-1 mb-6"
          >
            <Upload type="image" setProgress={setProgress} setData={setCover}>
              <button
                type="button"
                className="w-max p-2 shadow-md rounded-xl text-sm bg-white text-gray-500"
              >
                {t("write.addCoverImage")}
              </button>
            </Upload>

            {/* Show current cover image if exists */}
            {editMode && (cover?.filePath || existingPost?.img) && (
              <div className="bg-blue-50 p-4 rounded-xl">
                <p className="text-sm text-gray-600 mb-2">
                  {t("write.currentCoverImage")}
                </p>
                <Image
                  src={cover?.filePath || existingPost?.img}
                  alt="Cover"
                  className="w-48 h-32 object-cover rounded-lg"
                  w="192"
                  h="128"
                />
              </div>
            )}

            <input
              className="text-3xl font-semibold bg-transparent outline-none"
              type="text"
              placeholder={t("write.titlePlaceholder")}
              name="title"
              defaultValue={editMode ? existingPost?.title : ""}
            />
            <div className="flex items-center gap-4">
              <label htmlFor="" className="text-sm">
                {t("write.chooseCategory")}
              </label>
              <select
                name="category"
                id=""
                className="p-2 rounded-xl bg-white shadow-md"
                defaultValue={editMode ? existingPost?.category : ""}
              >
                <option value="application">
                  {t("categories.application")}
                </option>
                <option value="service">{t("categories.service")}</option>
                <option value="products">{t("categories.products")}</option>
                <option value="distributors">
                  {t("categories.distributors")}
                </option>
                <option value="news">{t("categories.news")}</option>
              </select>
            </div>
            <textarea
              className="p-4 rounded-xl bg-white shadow-md"
              name="desc"
              placeholder={t("write.descriptionPlaceholder")}
              defaultValue={editMode ? existingPost?.desc : ""}
            ></textarea>
            <div className="flex flex-1">
              <div className="flex flex-col gap-2 mr-2">
                <Upload type="image" setProgress={setProgress} setData={setImg}>
                  <div className="cursor-pointer">🎨</div>
                </Upload>
                <Upload
                  type="video"
                  setProgress={setProgress}
                  setData={setVideo}
                >
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
                ? t("write.loading")
                : editMode
                  ? t("write.update")
                  : t("write.publish")}
            </button>
            {t("write.progress", { progress })}
          </form>
        )}

        {/* Translation Forms */}
        {editMode && activeTab !== "original" && (
          <div className="flex flex-col gap-6 flex-1 mb-6">
            <div className="bg-blue-50 p-4 rounded-xl">
              <p className="text-sm text-gray-600 mb-2">
                {t("write.originalContent")}:{" "}
                <strong>{existingPost?.title}</strong>
              </p>
              {existingPost?.img && (
                <div className="mt-2">
                  <Image
                    src={existingPost.img}
                    alt="Cover"
                    className="w-32 h-20 object-cover rounded-lg"
                    w="128"
                    h="80"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {t("write.coverImageNote")}
                  </p>
                </div>
              )}
            </div>

            <input
              className="text-3xl font-semibold bg-transparent outline-none border-b-2 border-gray-200 pb-2"
              type="text"
              placeholder={t("write.translationTitle", {
                language: translationLanguages.find((l) => l.code === activeTab)
                  ?.nativeName,
              })}
              value={translations[activeTab]?.title || ""}
              onChange={(e) =>
                handleTranslationChange(activeTab, "title", e.target.value)
              }
            />

            <textarea
              className="p-4 rounded-xl bg-white shadow-md min-h-[100px]"
              placeholder={t("write.translationDesc", {
                language: translationLanguages.find((l) => l.code === activeTab)
                  ?.nativeName,
              })}
              value={translations[activeTab]?.desc || ""}
              onChange={(e) =>
                handleTranslationChange(activeTab, "desc", e.target.value)
              }
            ></textarea>

            <div className="flex flex-1">
              <ReactQuill
                theme="snow"
                className="flex-1 rounded-xl bg-white shadow-md"
                value={translations[activeTab]?.content || ""}
                onChange={(content) =>
                  handleTranslationChange(activeTab, "content", content)
                }
                placeholder={t("write.translationContent", {
                  language: translationLanguages.find(
                    (l) => l.code === activeTab,
                  )?.nativeName,
                })}
              />
            </div>

            <button
              onClick={() => handleSaveTranslation(activeTab)}
              disabled={saveTranslationMutation.isPending}
              className="bg-green-600 text-white font-medium rounded-xl mt-4 p-2 w-48 disabled:bg-green-400 disabled:cursor-not-allowed"
              type="button"
            >
              {saveTranslationMutation.isPending
                ? t("write.loading")
                : t("write.saveTranslation")}
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default Write;
