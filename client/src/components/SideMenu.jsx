import { Link, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Search from "./Search";

const SideMenu = () => {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();

  const handleFilterChange = (e) => {
    if (searchParams.get("sort") !== e.target.value) {
      setSearchParams({
        ...Object.fromEntries(searchParams.entries()),
        sort: e.target.value,
      });
    }
  };

  const handleCategoryChange = (category) => {
    if (searchParams.get("cat") !== category) {
      setSearchParams({
        ...Object.fromEntries(searchParams.entries()),
        cat: category,
      });
    }
  };

  return (
    <div className="px-4 h-max sticky top-8">
      <h1 className="mb-4 text-sm font-medium">{t("search.title")}</h1>
      <Search />
      <h1 className="mt-8 mb-4 text-sm font-medium">{t("filter.title")}</h1>
      <div className="flex flex-col gap-2 text-sm">
        <label htmlFor="" className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            name="sort"
            onChange={handleFilterChange}
            value="newest"
            className="appearance-none w-4 h-4 border-[1.5px] border-blue-800 cursor-pointer rounded-sm bg-white checked:bg-blue-800"
          />
          {t("filter.newest")}
        </label>

        <label htmlFor="" className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            name="sort"
            onChange={handleFilterChange}
            value="popular"
            className="appearance-none w-4 h-4 border-[1.5px] border-blue-800 cursor-pointer rounded-sm bg-white checked:bg-blue-800"
          />
          {t("filter.popular")}
        </label>

        <label htmlFor="" className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            name="sort"
            onChange={handleFilterChange}
            value="trending"
            className="appearance-none w-4 h-4 border-[1.5px] border-blue-800 cursor-pointer rounded-sm bg-white checked:bg-blue-800"
          />
          {t("filter.trending")}
        </label>

        <label htmlFor="" className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            name="sort"
            onChange={handleFilterChange}
            value="oldest"
            className="appearance-none w-4 h-4 border-[1.5px] border-blue-800 cursor-pointer rounded-sm bg-white checked:bg-blue-800"
          />
          {t("filter.oldest")}
        </label>
      </div>
      <h1 className="mt-8 mb-4 text-sm font-medium">{t("categories.title")}</h1>
      <div className="flex flex-col gap-2 text-sm">
        <span
          className="underline cursor-pointer"
          onClick={() => handleCategoryChange("application")}
        >
          {t("categories.all")}
        </span>
        <span
          className="underline cursor-pointer"
          onClick={() => handleCategoryChange("application")}
        >
          {t("categories.application")}
        </span>
        <span
          className="underline cursor-pointer"
          onClick={() => handleCategoryChange("service")}
        >
          {t("categories.service")}
        </span>
        <span
          className="underline cursor-pointer"
          onClick={() => handleCategoryChange("products")}
        >
          {t("categories.products")}
        </span>
        <span
          className="underline cursor-pointer"
          onClick={() => handleCategoryChange("distributors")}
        >
          {t("categories.distributors")}
        </span>
        <span
          className="underline cursor-pointer"
          onClick={() => handleCategoryChange("news")}
        >
          {t("categories.news")}
        </span>
      </div>
    </div>
  );
};

export default SideMenu;
