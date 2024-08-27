import { ReplayType } from "./replay";
import { User } from "./user";

/* eslint-disable @typescript-eslint/no-explicit-any */
export type CommentType = {
   id: number;
   content: string;
   createdAt: string;
   score: number;
   user: User;
   replies: ReplayType[]
}

