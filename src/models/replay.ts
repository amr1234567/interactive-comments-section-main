/* eslint-disable @typescript-eslint/no-explicit-any */

import { User } from "./user";


export type ReplayType = {
   id: number;
   content: string;
   createdAt: string;
   score: number;
   user: User;
   commentId: number;
}