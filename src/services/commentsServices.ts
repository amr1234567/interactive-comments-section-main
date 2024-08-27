import { IDBPDatabase, openDB } from "idb";
import { FromJsonToComments } from "../helpers/convertors";
import { CommentType } from "../models/comment";
import { ReplayType } from "../models/replay";

export class CommentsServices {
   private _db: Promise<IDBPDatabase<CommentType>>;

   constructor() {
      this._db = openDB("comments", 1, {
         upgrade(db) {
            if (!db.objectStoreNames.contains("comments")) {
               db.createObjectStore("comments", { keyPath: "id", autoIncrement: true });
               fetch("/data.json").then((res) => res.json()).then((res) => {
                  console.log("comments from json file", res);
                  const comments = FromJsonToComments(res.comments);
                  const tx = db.transaction("comments", "readwrite");
                  comments.forEach((comment) => tx.store.add(comment));
                  tx.done.then().catch();
               })
            }
         },
      })
   }

   async getCommentsFromDb() {
      const allComments = await (await this._db).getAll("comments");
      console.log("all comments from db", allComments);
      return FromJsonToComments(allComments);
   }

   async getCommentFromDb(id: number) {
      const comment = await (await this._db).get("comments", id);
      return comment;
   }

   async addReplayOnComment(commentId: number, replay: ReplayType) {
      const tx = (await this._db).transaction("comments", "readwrite");
      const comment = await tx.store.get(commentId);
      if (comment) {
         comment.replies.push(replay);
         await tx.store.put(comment);
      } else {
         throw new Error("Comment not found");
      }
      return await tx.done;
   }

   async deleteReplay(commentId: number, replayId: number) {
      const tx = (await this._db).transaction("comments", "readwrite");
      const comment = await tx.store.get(commentId);
      if (comment) {
         comment.replies = comment.replies.filter((reply: ReplayType) => reply.id !== replayId);
         await tx.store.put(comment);
      } else {
         throw new Error("Comment not found");
      }
      return await tx.done;
   }

   async editReplay(commentId: number, replay: ReplayType) {
      const tx = (await this._db).transaction("comments", "readwrite");
      const comment = await tx.store.get(commentId);
      if (comment) {
         const replayIndex = comment.replies.findIndex((reply: ReplayType) => reply.id === replay.id);
         if (replayIndex !== -1) {
            comment.replies[replayIndex] = replay;
            await tx.store.put(comment);
         } else {
            throw new Error("Replay not found");
         }
      } else {
         throw new Error("Comment not found");
      }
      return await tx.done;
   }

   async addComment(comment: CommentType) {
      const tx = (await this._db).transaction("comments", "readwrite");
      await tx.store.put(comment);
      await tx.done;
      return comment;
   }

   async deleteComment(commentId: number) {
      const tx = (await this._db).transaction("comments", "readwrite");
      await tx.store.delete(commentId);
      await tx.done;
      return commentId;
   }

   async editComment(comment: CommentType) {
      const tx = (await this._db).transaction("comments", "readwrite");
      await tx.store.put(comment);
      await tx.done;
      return comment;
   }
}