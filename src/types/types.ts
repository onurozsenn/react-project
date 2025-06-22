export interface Post {
  id: string;
  name: string;
  text: string;
  avatar?: string;
  likeCount: number;
  commentCount: number;
  isLiked?: boolean;
  comments: { id: string; text: string; name: string; avatar?: string }[];
  audioUrl?: string;
  imageUrl?: string;
}