import { Button } from "@/components/ui/button";
import { Loader2, AlertTriangle } from "lucide-react";
import { useEffect, useState } from "react";

interface DeleteArticleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isDeleting: boolean;
  articleTitle: string;
}

export default function DeleteArticleModal({
  isOpen,
  onClose,
  onConfirm,
  isDeleting,
  articleTitle,
}: DeleteArticleModalProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsMounted(true);
      // Trigger animation after mount
      setTimeout(() => setIsVisible(true), 10);
    } else {
      setIsVisible(false);
      // Unmount after animation
      setTimeout(() => setIsMounted(false), 200);
    }
  }, [isOpen]);

  if (!isMounted) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-200 ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className={`relative bg-white rounded-xl shadow-xl max-w-md w-full mx-4 p-6 space-y-4 transform transition-all duration-200 ${
          isVisible
            ? "opacity-100 translate-y-0 scale-100"
            : "opacity-0 -translate-y-4 scale-95"
        }`}
      >
        <div className="flex items-center space-x-3 text-red-600">
          <AlertTriangle className="w-6 h-6" />
          <h3 className="text-xl font-semibold">Delete Article</h3>
        </div>

        <p className="text-gray-600">
          Are you sure you want to delete the article "{articleTitle}"? This
          action cannot be undone.
        </p>

        <div className="flex justify-end space-x-3 pt-4">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isDeleting}
            className="px-4 py-2 transition-colors duration-200"
          >
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            disabled={isDeleting}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 transition-colors duration-200"
          >
            {isDeleting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Deleting...
              </>
            ) : (
              "Delete Article"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
