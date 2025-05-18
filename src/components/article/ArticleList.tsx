import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import { getArticles, getCategories } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import type { ArticleResponse, Article, Category } from "@/types";
import { Loader2 } from "lucide-react";

// Skeleton Card Component
const ArticleSkeletonCard = () => (
  <div className="bg-white rounded-xl shadow-lg overflow-hidden h-full flex flex-col animate-pulse">
    <div className="h-48 bg-gray-200"></div>
    <div className="p-6 flex flex-col flex-grow">
      <div className="flex items-center justify-between mb-3">
        <div className="h-6 w-24 bg-gray-200 rounded-full"></div>
        <div className="h-4 w-24 bg-gray-200 rounded-full"></div>
      </div>
      <div className="h-6 w-3/4 bg-gray-200 rounded mb-2"></div>
      <div className="space-y-2 flex-grow">
        <div className="h-4 w-full bg-gray-200 rounded"></div>
        <div className="h-4 w-5/6 bg-gray-200 rounded"></div>
        <div className="h-4 w-4/6 bg-gray-200 rounded"></div>
      </div>
      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
          <div className="h-4 w-20 bg-gray-200 rounded-full"></div>
        </div>
        <div className="h-4 w-24 bg-gray-200 rounded-full"></div>
      </div>
    </div>
  </div>
);

export default function ArticleList() {
  const { user } = useAuthStore();
  const [searchInput, setSearchInput] = useState("");
  const [titleFilter, setTitleFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [page, setPage] = useState(1);
  const [allArticles, setAllArticles] = useState<Article[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const pageSize = 6;

  // Fetch categories for the dropdown
  const { data: categoriesResponse, isLoading: isLoadingCategories } = useQuery(
    {
      queryKey: ["categories"],
      queryFn: getCategories,
      refetchOnWindowFocus: false,
    }
  );
  const categories: Category[] = categoriesResponse?.data || [];

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
    setIsSearching(true);
  };

  // Debounce update titleFilter from searchInput
  useEffect(() => {
    const handler = setTimeout(() => {
      setTitleFilter(searchInput);
      setIsSearching(false);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchInput]);

  // Handle category change
  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCategoryFilter(e.target.value);
  };

  const {
    data: response,
    isLoading,
    isError,
    error,
    isFetching,
  } = useQuery<ArticleResponse>({
    queryKey: ["articles", page, titleFilter, categoryFilter],
    queryFn: () =>
      getArticles({
        page,
        pageSize,
        title: titleFilter || undefined,
        category: categoryFilter || undefined,
      }),
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (response?.data) {
      if (page === 1) {
        setAllArticles(response.data);
      } else {
        setAllArticles((prev) => [...prev, ...response.data]);
      }
    }
  }, [response?.data, page]);

  const handleLoadMore = () => {
    setPage((prev) => prev + 1);
  };

  if (isError) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-600 text-center">
        {error.message}
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:justify-center">
            <div className="w-full sm:w-64 relative">
              <Input
                placeholder="Search by title..."
                value={searchInput}
                onChange={handleSearchChange}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {isSearching && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
                </div>
              )}
            </div>
            <div className="w-full sm:w-64 relative">
              <select
                value={categoryFilter}
                onChange={handleCategoryChange}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={isLoadingCategories}
              >
                <option value="">All Categories</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.name}>
                    {category.name}
                  </option>
                ))}
              </select>
              {isLoadingCategories && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
                </div>
              )}
            </div>
          </div>
        </div>
        {user && (
          <div className="w-full sm:w-auto flex justify-end lg:mt-0 mt-6">
            <Link to="/articles/new">
              <Button className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-2 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center space-x-2">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                <span>Create Article</span>
              </Button>
            </Link>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 min-h-[200px]">
        {isLoading && page === 1 ? (
          <>
            {[...Array(6)].map((_, index) => (
              <ArticleSkeletonCard key={index} />
            ))}
          </>
        ) : allArticles.length === 0 ? (
          <div className="col-span-full flex flex-col items-center py-12 mt-8">
            <div className="bg-white rounded-full shadow-lg p-6 mb-6">
              <svg
                className="w-16 h-16 text-blue-400"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-semibold text-gray-700 mb-2">
              No Articles Found
            </h2>
            <p className="text-gray-500 text-base">
              We couldn't find any articles matching your filters.
            </p>
          </div>
        ) : (
          <>
            {allArticles.map((article: Article) => (
              <Link
                key={article.id}
                to={`/articles/${article.documentId}`}
                className="group h-full"
              >
                <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden transform hover:-translate-y-1 h-full flex flex-col">
                  {article.cover_image_url && (
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={article.cover_image_url}
                        alt={article.title}
                        className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                    </div>
                  )}
                  <div className="p-6 flex flex-col flex-grow">
                    <div className="flex items-center justify-between mb-3">
                      <span className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-sm font-medium">
                        {article.category?.name}
                      </span>
                      <span className="text-sm text-gray-500">
                        {new Date(article.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors">
                      {article.title}
                    </h3>
                    <p className="text-gray-600 line-clamp-3 flex-grow">
                      {article.description}
                    </p>
                    <div className="mt-4 flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                          {article.user?.username.charAt(0).toUpperCase()}
                        </div>
                        <span className="text-sm text-gray-600">
                          {article.user?.username}
                        </span>
                      </div>
                      <span className="text-blue-600 font-medium group-hover:translate-x-1 transition-transform">
                        Read more →
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
            {isFetching && (
              <>
                {[...Array(3)].map((_, index) => (
                  <ArticleSkeletonCard key={`skeleton-${index}`} />
                ))}
              </>
            )}
          </>
        )}
      </div>

      {allArticles.length > 0 &&
        (response?.meta?.pagination?.pageCount ?? 0) > page && (
          <div className="mt-8 flex justify-center">
            <Button
              onClick={handleLoadMore}
              disabled={isFetching}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
            >
              {isFetching ? "Loading..." : "Load More"}
            </Button>
          </div>
        )}
    </div>
  );
}
