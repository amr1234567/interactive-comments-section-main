/* eslint-disable @typescript-eslint/no-explicit-any */
import { CommentType } from "../models/comment";
import { ReplayType } from "../models/replay";
import { ImageObject, User } from "../models/user";

export function FromJsonToComments(json: any): CommentType[] {
   return json.map((comment: any): CommentType => {
      return {
         id: comment.id,
         user: comment.user,
         content: comment.content,
         score: comment.score,
         createdAt: comment.createdAt,
         replies: comment.replies.map((reply: any) => ({
            id: reply.id,
            content: reply.content,
            createdAt: reply.createdAt,
            score: reply.score,
            user: {
               username: reply.user.username,
               image: {
                  png: reply.user.image.png,
                  webp: reply.user.image.webp,
               } as ImageObject,
            } as User,
            commentId: reply.commentId,
         } as ReplayType))
      } as CommentType;
   });
}

export function FromJsonToUser(json: any): User {
   return {
      image: {
         png: json.image.png,
         webp: json.image.webp,
      } as ImageObject,
      username: json.username,
   } as User;
}