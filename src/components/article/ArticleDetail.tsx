import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getArticleById } from "@/lib/api";
import type { Article } from "@/types";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Share2, ArrowLeft } from "lucide-react";
import { Loader2 } from "lucide-react";

export default function ArticleDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(false);
  const { data, isLoading, isError, error } = useQuery<{ data: Article }>({
    queryKey: ["article", id],
    queryFn: () => getArticleById(id!),
  });

  const article = data?.data;
  const maxLength = 500;

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: article?.title,
        text: article?.description.slice(0, 100),
        url: window.location.href,
      });
    } else {
      alert("Share feature not supported in this browser.");
    }
  };

  if (isLoading)
    return (
      <div className="text-center p-4">
        <Loader2 className="w-6 h-6 animate-spin mx-auto" />
      </div>
    );
  if (isError)
    return <p className="text-red-500 text-center p-4">{error.message}</p>;
  if (!article) return <p className="text-center p-4">Article not found.</p>;

  return (
    <div className="container mx-auto p-4 max-w-3xl">
      <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4">
        <ArrowLeft className="w-4 h-4 mr-2" /> Back
      </Button>
      <h1 className="text-3xl font-bold mb-4">{article.title}</h1>
      <img
        src={article.cover_image_url}
        alt={article.title}
        className="w-full h-64 object-cover mb-4"
      />
      <p className="text-sm text-gray-600 mb-4">{article.category?.name}</p>
      <p className="text-sm text-gray-600 mb-4">By: {article.user?.username}</p>
      <p className="mb-4">
        {isExpanded
          ? article.description
          : article.description.slice(0, maxLength)}
        {article.description.length > maxLength && !isExpanded && (
          <Button variant="link" onClick={() => setIsExpanded(true)}>
            Load More
          </Button>
        )}
      </p>
      <Button onClick={handleShare}>
        <Share2 className="w-4 h-4 mr-2" /> Share
      </Button>
    </div>
  );
}
