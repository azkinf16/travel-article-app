import { useQuery } from "@tanstack/react-query";
import { getArticleById } from "@/lib/api";
import type { ArticleForm } from "@/types";
import { useParams } from "react-router-dom";
import ArticleFormComponent from "@/components/article/ArticleForm";
import { Loader2 } from "lucide-react";

export default function ArticleEditPage() {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading } = useQuery<{
    data: ArticleForm & { documentId: string };
  }>({
    queryKey: ["article", id],
    queryFn: () => getArticleById(id!),
  });

  if (isLoading)
    return (
      <div className="text-center p-4">
        <Loader2 className="w-6 h-6 animate-spin mx-auto" />
      </div>
    );

  return <ArticleFormComponent initialData={data?.data} />;
}
