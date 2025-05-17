import { useEffect, useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  createArticle,
  updateArticle,
  getCategories,
  uploadImage,
} from "@/lib/api";
import type { ArticleForm } from "@/types";
import type { Category } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const articleSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  cover_image_url: z.string().url("Invalid URL"),
  category: z.number().min(1, "Category is required"),
});

interface ArticleFormProps {
  initialData?: ArticleForm & { documentId?: string };
}

export default function ArticleForm({ initialData }: ArticleFormProps) {
  const navigate = useNavigate();
  const { data: categoriesResponse } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });
  const categories = categoriesResponse?.data || [];
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<ArticleForm>({
    resolver: zodResolver(articleSchema),
    defaultValues: initialData || {
      title: "",
      description: "",
      cover_image_url: "",
      category: 0,
    },
  });

  useEffect(() => {
    if (initialData?.category) {
      const catId =
        typeof initialData.category === "object"
          ? initialData.category.id
          : initialData.category;
      setSelectedCategory(catId.toString());
      setValue("category", Number(catId));
    }
  }, [initialData, setValue]);

  const handleCategoryChange = useCallback(
    (value: string) => {
      setSelectedCategory(value);
      setValue("category", Number(value));
    },
    [setValue]
  );

  const mutation = useMutation({
    mutationFn: initialData?.documentId
      ? (data: ArticleForm) =>
          updateArticle(initialData?.documentId || "", data)
      : createArticle,
    onSuccess: () => {
      window.location.href = "/articles";
    },
  });

  const onSubmit = async (data: ArticleForm) => {
    setIsSubmitting(true);
    try {
      let imageUrl = data.cover_image_url;
      if (selectedFile) {
        const uploadRes = await uploadImage(selectedFile);
        imageUrl = uploadRes[0].url;
      }
      await mutation.mutateAsync({ ...data, cover_image_url: imageUrl });
    } catch (err: unknown) {
      if (err && typeof err === "object" && "message" in err) {
        alert("Image upload failed: " + (err as { message: string }).message);
      } else {
        alert("Image upload failed");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4">
        <ArrowLeft className="w-4 h-4 mr-2" /> Back
      </Button>
      <h2 className="text-2xl font-bold mb-4">
        {initialData ? "Edit Article" : "Create Article"}
      </h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {initialData?.cover_image_url && (
          <img
            src={initialData.cover_image_url}
            alt="Cover"
            className="mb-2 w-full max-h-32 object-contain rounded"
          />
        )}
        <div>
          <Input
            placeholder="Title"
            {...register("title")}
            className={errors.title ? "border-red-500" : ""}
          />
          {errors.title && (
            <p className="text-red-500 text-sm">{errors.title.message}</p>
          )}
        </div>
        <div>
          <Textarea
            placeholder="Description"
            {...register("description")}
            className={errors.description ? "border-red-500" : ""}
          />
          {errors.description && (
            <p className="text-red-500 text-sm">{errors.description.message}</p>
          )}
        </div>
        <div>
          <Input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            disabled={mutation.isPending}
          />
          {mutation.isPending && <p className="text-sm">Saving...</p>}
          {mutation.isError && (
            <p className="text-red-500 text-sm">{mutation.error.message}</p>
          )}
        </div>
        <div>
          <select
            className="w-full border rounded px-3 py-2"
            value={selectedCategory}
            onChange={(e) => handleCategoryChange(e.target.value)}
          >
            <option value="">Select Category</option>
            {categories &&
              categories.length > 0 &&
              categories.map((category: Category) => (
                <option key={category.id} value={category.id.toString()}>
                  {category.name}
                </option>
              ))}
          </select>
          {errors.category && (
            <p className="text-red-500 text-sm">{errors.category.message}</p>
          )}
        </div>
        <Button type="submit" disabled={isSubmitting || mutation.isPending}>
          {isSubmitting || mutation.isPending
            ? "Saving..."
            : initialData
            ? "Update Article"
            : "Create Article"}
        </Button>
      </form>
    </div>
  );
}
