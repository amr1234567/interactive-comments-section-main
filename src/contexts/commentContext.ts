/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { CommentType } from "../models/comment";
import { CommentsServices } from "../services/commentsServices";
import { User } from "../models/user";

const commentServices = new CommentsServices();

const getAllComments = createAsyncThunk("comments/getAllComments", async () => {
   const comments = await commentServices.getCommentsFromDb();
   return comments;
});

const getComment = createAsyncThunk("comments/getComment", async (commentId: number) => {
   const comment = await commentServices.getCommentFromDb(commentId);
   return comment;
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


const initialState: CommentType[] = []

const commentContext = createSlice({
   name: "comment",
   initialState: initialState,
   reducers: {

   },
   extraReducers: (builder) => {
      builder.addCase(getAllComments.fulfilled, (_state, action) => {
         return action.payload;
      });
      builder.addCase(getComment.fulfilled, (_state, action) => {
         return action.payload;
      });
      builder.addCase(addComment.fulfilled, (state, action) => {
         return [...state, action.payload];
      });
      builder.addCase(editComment.fulfilled, (state, action) => {
         return state.map(comment => {
            if (comment.id === action.payload.id)
               return action.payload;
            return comment;
         })
      });
      builder.addCase(deleteComment.fulfilled, (state, action) => {
         return state.filter(comment => comment.id != action.payload);
      });
   },
})

export { getAllComments, addComment, getComment, editComment, deleteComment };
// export const { setEditCommentState, setDeleteCommentState, setReplyCommentState } = commentContext.actions;
export default commentContext.reducer;
