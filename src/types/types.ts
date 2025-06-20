export interface Post {
  id: string;
  name: string;
  text: string;
  avatar?: string;
  likeCount: number;
  commentCount: number;
  isLiked?: boolean;
  comments?: string[];
  audioUrl?: string;
  imageUrl?: string;
}