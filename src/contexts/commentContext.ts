/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CommentType } from "../models/comment";
import { CommentsServices } from "../services/commentsServices";
import { User } from "../models/user";
import { ReplayType } from "../models/replay";

const commentServices = new CommentsServices();

const getAllComments = createAsyncThunk("comments/getAllComments", async () => {
   const comments = await commentServices.getCommentsFromDb();
   return comments;
});

const editComment = createAsyncThunk("comments/editComment", async (comment: CommentType) => {
   const savedComment = await commentServices.editComment(comment);
   return savedComment;
});

const deleteComment = createAsyncThunk("comments/deleteComment", async (commentId: number) => {
   const id = await commentServices.deleteComment(commentId);
   return id;
});


const addComment = createAsyncThunk(
   "comments/addComment",
   async ({ text, user }: { text: string; user: User }, thunkAPI) => {
      try {
         const comments = await commentServices.getCommentsFromDb();
         const sortedComments = comments.sort((a, b) => b.id - a.id);
         const newComment: CommentType = {
            content: text,
            createdAt: "one minute ago",
            replies: [],
            score: 0,
            user: user,
            id: comments.length > 0 ? sortedComments[0].id + 1 : 1,
         };
         const comment = await commentServices.addComment(newComment);
         return comment;
      } catch (error: any) {
         return thunkAPI.rejectWithValue({ error: error.message });
      }
   }
);

const addReplay = createAsyncThunk(
   "comments/addReplay",
   async ({ text, user, commentId }: { text: string; user: User, commentId: number }, thunkAPI) => {
      try {
         const comment: CommentType = await commentServices.getCommentFromDb(commentId);
         const sortedReplays = comment.replies.sort((a, b) => b.id - a.id);
         const newReplay: ReplayType = {
            content: text,
            commentId: commentId,
            createdAt: "one minute ago",
            score: 0,
            user: user,
            id: comment.replies.length > 0 ? sortedReplays[0].id + 1 : 1,
         };
         const savedComment = await commentServices.addReplayOnComment(commentId, newReplay);
         return savedComment;
      } catch (error: any) {
         return thunkAPI.rejectWithValue({ error: error.message });
      }
   }
);
const editReplay = createAsyncThunk("comments/editReplay", async (comment: ReplayType) => {
   const savedComment = await commentServices.editReplay(comment.commentId, comment);
   return savedComment;
});
const deleteReplay = createAsyncThunk("comments/deleteReplay", async ({ commentId, replayId }: { commentId: number, replayId: number }) => {
   const id = await commentServices.deleteReplay(commentId, replayId);
   return id;
});
type CommentStateType = {
   comments: CommentType[];
   isDeleting: boolean;
   confirmDeleting: boolean;
   IdForDeleting: number | undefined;
   type: "comment" | "replay"
}

const initialState: CommentStateType = {
   comments: [],
   confirmDeleting: false,
   isDeleting: false,
   IdForDeleting: undefined,
   type: "comment",
}

const commentContext = createSlice({
   name: "comment",
   initialState: initialState,
   reducers: {
      startDeleting: (state, action) => {
         return { ...state, isDeleting: true, confirmDeleting: false, IdForDeleting: action.payload.id, type: action.payload.type };
      },
      confirmDeleting: (state) => {
         return { ...state, confirmDeleting: true, isDeleting: false };
      },
      cancelDeleting: (state) => {
         return { ...state, confirmDeleting: false, isDeleting: false, commentIdForDeleting: undefined };
      }
   },
   extraReducers: (builder) => {
      builder.addCase(getAllComments.fulfilled, (_state, action) => {
         return { ..._state, comments: action.payload };
      });
      builder.addCase(addComment.fulfilled, (state, action) => {
         return { ...state, comments: [...state.comments, action.payload] };
      });
      builder.addCase(editComment.fulfilled, (state, action) => {
         return {
            ...state, comments: state.comments.map(comment => {
               if (comment.id === action.payload.id)
                  return action.payload;
               return comment;
            })
         }
      });
      builder.addCase(deleteComment.fulfilled, (state, action) => {
         return { ...state, confirmDeleting: false, isDeleting: false, comments: state.comments.filter(comment => comment.id != action.payload) };
      });
      builder.addCase(addReplay.fulfilled, (state, action) => {
         return {
            ...state, comments: state.comments.map(comment => {
               if (comment.id === action.payload.id)
                  return action.payload;
               return comment;
            })
         }
      });
      builder.addCase(editReplay.fulfilled, (state, action) => {
         return {
            ...state, comments: state.comments.map(comment => {
               if (comment.id === action.payload.id)
                  return action.payload;
               return comment;
            })
         }
      });
      builder.addCase(deleteReplay.fulfilled, (state, action) => {
         return {
            ...state, comments: state.comments.map(comment => {
               if (comment.id === action.payload.id)
                  return action.payload;
               return comment;
            }),
            confirmDeleting: false,
            IdForDeleting: undefined,
            isDeleting: false,
         }
      });
   },
})

export { getAllComments, addComment, addReplay, deleteReplay, editReplay, editComment, deleteComment };
export const { startDeleting, confirmDeleting, cancelDeleting } = commentContext.actions;
export default commentContext.reducer;
