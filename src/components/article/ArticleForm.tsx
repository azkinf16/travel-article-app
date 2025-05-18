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
import { ArrowLeft, Upload, Image as ImageIcon } from "lucide-react";

const articleSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  cover_image_url: z.string().optional(),
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
    refetchOnWindowFocus: false,
  });
  const categories: Category[] = categoriesResponse?.data || [];
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string>(
    initialData?.cover_image_url || ""
  );

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
        typeof initialData.category === "object" &&
        initialData.category !== null &&
        "id" in initialData.category
          ? (initialData.category as { id: number }).id
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
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-blue-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="hover:bg-gray-100"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back
          </Button>
          <div className="flex items-center my-8">
            <h2 className="text-3xl font-bold text-gray-800">
              {initialData ? "Edit Article" : "Create New Article"}
            </h2>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Image Upload Section */}
            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700">
                Cover Image
              </label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-xl hover:border-blue-500 transition-colors">
                <div className="space-y-2 text-center">
                  {previewUrl ? (
                    <div className="relative">
                      <img
                        src={previewUrl}
                        alt="Preview"
                        className="mx-auto h-48 w-full object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setPreviewUrl("");
                          setSelectedFile(null);
                          setValue("cover_image_url", "");
                        }}
                        className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </div>
                  ) : (
                    <>
                      <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                      <div className="flex text-sm text-gray-600">
                        <label className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none">
                          <span>Upload a file</span>
                          <input
                            type="file"
                            className="sr-only"
                            accept="image/*"
                            onChange={handleImageUpload}
                            disabled={mutation.isPending}
                          />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-gray-500">
                        PNG, JPG, GIF up to 10MB
                      </p>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Title Input */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Title
              </label>
              <Input
                placeholder="Enter article title..."
                {...register("title")}
                className={`w-full px-4 py-3 rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.title ? "border-red-500" : ""
                }`}
              />
              {errors.title && (
                <p className="text-red-500 text-sm">{errors.title.message}</p>
              )}
            </div>

            {/* Description Input */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <Textarea
                placeholder="Write your article content here..."
                {...register("description")}
                className={`w-full px-4 py-3 rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[200px] ${
                  errors.description ? "border-red-500" : ""
                }`}
              />
              {errors.description && (
                <p className="text-red-500 text-sm">
                  {errors.description.message}
                </p>
              )}
            </div>

            {/* Category Select */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Category
              </label>
              <select
                className={`border w-full px-4 py-3 rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.category ? "border-red-500" : ""
                }`}
                value={selectedCategory}
                onChange={(e) => handleCategoryChange(e.target.value)}
              >
                <option value="">Select a category</option>
                {categories &&
                  categories.length > 0 &&
                  categories.map((category: Category) => (
                    <option key={category.id} value={category.id.toString()}>
                      {category.name}
                    </option>
                  ))}
              </select>
              {errors.category && (
                <p className="text-red-500 text-sm">
                  {errors.category.message}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <div className="flex flex-col items-end space-y-2">
              <Button
                type="submit"
                disabled={isSubmitting || mutation.isPending}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center space-x-2"
              >
                {isSubmitting || mutation.isPending ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Upload className="w-5 h-5" />
                    <span>
                      {initialData ? "Update Article" : "Create Article"}
                    </span>
                  </>
                )}
              </Button>
              {mutation.isError && (
                <p className="text-red-500 text-sm mt-2 text-right">
                  {mutation.error instanceof Error
                    ? mutation.error.message
                    : "Failed to submit article. Please try again."}
                </p>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
