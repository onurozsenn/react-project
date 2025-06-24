export interface Reply {
  avatar: string;
  id: string;
  text: string;
  name: string;
  createdAt: string;
}

export interface Comment {
  avatar: string;
  id: string;
  text: string;
  name: string;
  createdAt: string;
  replies: Reply[];
}

export interface Post {
  id: string;
  name: string;
  text: string;
  commentCount: number;
  likeCount: number;
  isLiked: boolean;
  comments: Comment[];
  audioUrl?: string;
  imageUrl?: string;
  createdAt: string;
}