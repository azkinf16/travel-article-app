import { useState } from "react";
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { getArticles, deleteArticle } from "@/lib/api";
import type { Article } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import { Loader2, Trash2, Edit } from "lucide-react";

export default function ArticleList() {
  const { user } = useAuthStore();
  const [titleFilter, setTitleFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const queryClient = useQueryClient();

  const { data, fetchNextPage, hasNextPage, isFetching, isError, error } =
    useInfiniteQuery({
      queryKey: ["articles", titleFilter, categoryFilter],
      queryFn: ({ pageParam = 1 }) =>
        getArticles({
          page: pageParam,
          pageSize: 10,
          //   title: titleFilter,
          //   category: categoryFilter,
        }),
      getNextPageParam: (lastPage) => {
        const { page, pageCount } = lastPage.meta.pagination;
        return page < pageCount ? page + 1 : undefined;
      },
      initialPageParam: 1,
    });

  const deleteMutation = useMutation({
    mutationFn: deleteArticle,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["articles"] });
    },
  });

  const handleDelete = (documentId: string) => {
    if (window.confirm("Are you sure you want to delete this article?")) {
      deleteMutation.mutate(documentId);
    }
  };

  const articles = data?.pages.flatMap((page) => page.data) || [];

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Travel Articles</h2>
      <div className="mb-4 flex space-x-4">
        <Input
          placeholder="Filter by title"
          value={titleFilter}
          onChange={(e) => setTitleFilter(e.target.value)}
        />
        <Input
          placeholder="Filter by category"
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
        />
        {user && (
          <Link to="/articles/new">
            <Button>Create Article</Button>
          </Link>
        )}
      </div>
      {isError && <p className="text-red-500">{error.message}</p>}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {articles.map((article: Article) => (
          <Card key={article.documentId}>
            <CardHeader>
              <CardTitle>{article.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <img
                src={article.cover_image_url}
                alt={article.title}
                className="w-full h-48 object-cover mb-2"
              />
              <p className="text-sm text-gray-600">{article.category?.name}</p>
              <p className="text-sm truncate">{article.description}</p>
              <div className="mt-2 flex space-x-2">
                <Link to={`/articles/${article.documentId}`}>
                  <Button variant="outline">View Details</Button>
                </Link>
                <>
                  <Link to={`/articles/edit/${article.documentId}`}>
                    <Button variant="outline">
                      <Edit className="w-4 h-4" />
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    onClick={() => handleDelete(article.documentId)}
                    disabled={deleteMutation.isPending}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      {isFetching && (
        <div className="text-center mt-4">
          <Loader2 className="w-6 h-6 animate-spin mx-auto" />
        </div>
      )}
      {hasNextPage && (
        <div className="text-center mt-4">
          <Button onClick={() => fetchNextPage()} disabled={isFetching}>
            Load More
          </Button>
        </div>
      )}
    </div>
  );
}
