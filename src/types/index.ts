export interface User {
  id: string;
  username: string;
  email: string;
}

export interface AuthResponse {
  jwt: string;
  user: User;
}

export interface RegisterForm {
  email: string;
  username: string;
  password: string;
}

export interface LoginForm {
  identifier: string;
  password: string;
}

export interface Category {
  id: number;
  documentId: string;
  name: string;
  description: string;
}

export interface Article {
  id: number;
  documentId: string;
  title: string;
  description: string;
  cover_image_url: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  user: User;
  category: Category;
  comments: Array<{ id: number; content: string }>;
}

export interface ArticleResponse {
  data: Article[];
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

export interface ArticleForm {
  title: string;
  description: string;
  cover_image_url: string;
  category: number;
}

export interface UploadResponse {
  url: string;
}
