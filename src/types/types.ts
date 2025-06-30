// Kullanıcı listesi modal'ında kullanılacak kullanıcı tipi
export interface User {
  id: number;
  name: string;
  username: string;
  avatar: string;
}

// Bir yanıta ait tip tanımı
export interface Reply {
  id: string;
  userId: string;
  name: string;
  text: string;
  createdAt: string;
  isLiked?: boolean;
  likeCount?: number;
}

// Ana bir yoruma ait tip tanımı
export interface Comment {
  id: string;
  userId: string;
  name: string;
  text: string;
  createdAt: string;
  replies?: Reply[];
  isLiked?: boolean;
  likeCount?: number;
}

// Bir gönderiye ait ana tip tanımı
export interface Post {
  id: string;
  userId: string;
  name: string;
  text: string;
  likeCount: number;
  commentCount: number;
  isLiked?: boolean;
  comments: Comment[];
  audioUrl?: string;
  imageUrl?: string;
  createdAt: string;
}
