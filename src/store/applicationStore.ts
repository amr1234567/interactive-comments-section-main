import { configureStore } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import userContext from "../contexts/userContext";
import commentContext from "../contexts/commentContext";

const ApplicationStore = configureStore({
   reducer: {
      user: userContext,
      comments: commentContext
   }
});

export type RootState = ReturnType<typeof ApplicationStore.getState>;
export type AppStore = typeof ApplicationStore;
export type AppDispatch = typeof ApplicationStore.dispatch;

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();

export default ApplicationStore;