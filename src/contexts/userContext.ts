import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { User } from "../models/user";
import { UserServices } from "../services/userServices";

const userServices = new UserServices();

// Async thunk to fetch user data
const fetchCurrentUser = createAsyncThunk("user/fetchCurrentUser", async () => {
   const user = await userServices.getCurrentUser();
   return user;
});

const userInitialState: User = {
   username: "",
   image: { png: "", webp: "" },
};

export const userContext = createSlice({
   name: "user",
   initialState: userInitialState,
   reducers: {},
   extraReducers: (builder) => {
      builder.addCase(fetchCurrentUser.fulfilled, (_state, action) => {
         return action.payload;
      });
   },
});

export default userContext.reducer;
export { fetchCurrentUser };
export const actions = userContext.actions;
