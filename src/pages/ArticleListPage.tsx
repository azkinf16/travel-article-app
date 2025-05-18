import ArticleList from "@/components/article/ArticleList";

export default function ArticleListPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Travel Articles
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover amazing travel stories and experiences from around the
            world
          </p>
        </div>
        <ArticleList />
      </div>
    </div>
  );
}
