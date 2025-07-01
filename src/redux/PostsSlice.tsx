import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Post, Comment, Reply } from '../types/types';
import { v4 as uuidv4 } from 'uuid';

interface PostsState {
  posts: Post[];
}

const initialState: PostsState = {
  posts: JSON.parse(localStorage.getItem('posts') || '[]'),
};

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    // --- POST ACTIONS ---
    addPost: (state, action: PayloadAction<Omit<Post, 'id' | 'comments' | 'isLiked' | 'likeCount' | 'commentCount'>>) => {
      const newPost: Post = { id: uuidv4(), ...action.payload, comments: [], isLiked: false, likeCount: 0, commentCount: 0, };
      state.posts.unshift(newPost);
      localStorage.setItem('posts', JSON.stringify(state.posts));
    },
    deletePost: (state, action: PayloadAction<string>) => {
      state.posts = state.posts.filter(post => post.id !== action.payload);
      localStorage.setItem('posts', JSON.stringify(state.posts));
    },
    togglePostLike: (state, action: PayloadAction<string>) => {
      const post = state.posts.find(p => p.id === action.payload);
      if (post) {
        post.isLiked = !post.isLiked;
        post.likeCount = post.isLiked ? (post.likeCount || 0) + 1 : (post.likeCount || 1) - 1;
        localStorage.setItem('posts', JSON.stringify(state.posts));
      }
    },

    // --- COMMENT ACTIONS ---
    addComment: (state, action: PayloadAction<{ postId: string; comment: Omit<Comment, 'id' | 'replies' | 'isLiked' | 'likeCount'> }>) => {
      const post = state.posts.find(p => p.id === action.payload.postId);
      if (post) {
        const newComment: Comment = { id: uuidv4(), ...action.payload.comment, replies: [], isLiked: false, likeCount: 0, };
        post.comments.push(newComment);
        post.commentCount = (post.commentCount || 0) + 1;
        localStorage.setItem('posts', JSON.stringify(state.posts));
      }
    },
    deleteComment: (state, action: PayloadAction<{ postId: string; commentId: string }>) => {
        const post = state.posts.find(p => p.id === action.payload.postId);
        if (post) {
            const commentToDelete = post.comments.find(c => c.id === action.payload.commentId);
            const countChange = 1 + (commentToDelete?.replies?.length || 0);
            post.comments = post.comments.filter(c => c.id !== action.payload.commentId);
            post.commentCount -= countChange;
            localStorage.setItem('posts', JSON.stringify(state.posts));
        }
    },
    toggleCommentLike: (state, action: PayloadAction<{ postId: string; commentId: string }>) => {
        const post = state.posts.find(p => p.id === action.payload.postId);
        if (post) {
            const comment = post.comments.find(c => c.id === action.payload.commentId);
            if (comment) {
                comment.isLiked = !comment.isLiked;
                comment.likeCount = comment.isLiked ? (comment.likeCount || 0) + 1 : (comment.likeCount || 1) - 1;
                localStorage.setItem('posts', JSON.stringify(state.posts));
            }
        }
    },

    // --- REPLY ACTIONS ---
    addReply: (state, action: PayloadAction<{ postId: string; parentCommentId: string; reply: Omit<Reply, 'id' | 'isLiked' | 'likeCount'> }>) => {
        const post = state.posts.find(p => p.id === action.payload.postId);
        if (post) {
            const parentComment = post.comments.find(c => c.id === action.payload.parentCommentId);
            if (parentComment) {
                const newReply: Reply = { id: uuidv4(), ...action.payload.reply, isLiked: false, likeCount: 0 };
                parentComment.replies = [...(parentComment.replies || []), newReply];
                post.commentCount = (post.commentCount || 0) + 1;
                localStorage.setItem('posts', JSON.stringify(state.posts));
            }
        }
    },
    deleteReply: (state, action: PayloadAction<{ postId: string; commentId: string; replyId: string }>) => {
        const post = state.posts.find(p => p.id === action.payload.postId);
        if (post) {
            const parentComment = post.comments.find(c => c.id === action.payload.commentId);
            if (parentComment) {
                parentComment.replies = (parentComment.replies || []).filter(r => r.id !== action.payload.replyId);
                post.commentCount -= 1;
                localStorage.setItem('posts', JSON.stringify(state.posts));
            }
        }
    },
    toggleReplyLike: (state, action: PayloadAction<{ postId: string; commentId: string; replyId: string }>) => {
        const post = state.posts.find(p => p.id === action.payload.postId);
        if (post) {
            const parentComment = post.comments.find(c => c.id === action.payload.commentId);
            if (parentComment && parentComment.replies) {
                const reply = parentComment.replies.find(r => r.id === action.payload.replyId);
                if (reply) {
                    reply.isLiked = !reply.isLiked;
                    reply.likeCount = reply.isLiked ? (reply.likeCount || 0) + 1 : (reply.likeCount || 1) - 1;
                    localStorage.setItem('posts', JSON.stringify(state.posts));
                }
            }
        }
    },
     updateUserNames: (state, action: PayloadAction<{ userId: string; newName: string }>) => {
      const { userId, newName } = action.payload;
      
      state.posts.forEach(post => {
        if (post.userId === userId) {
          post.name = newName;
        }
        post.comments.forEach(comment => {
          if (comment.userId === userId) {
            comment.name = newName;
          }
          (comment.replies || []).forEach(reply => {
            if (reply.userId === userId) {
              reply.name = newName;
            }
          });
        });
      });
      
      localStorage.setItem('posts', JSON.stringify(state.posts));
    },
  },
});

export const { 
    addPost, deletePost, togglePostLike, 
    addComment, deleteComment, toggleCommentLike,
    addReply, deleteReply, toggleReplyLike,updateUserNames
} = postsSlice.actions;

export default postsSlice.reducer;
