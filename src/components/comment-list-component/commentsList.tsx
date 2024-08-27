import styles from "./commentsList.module.css";
import Comment from "../comment-component/comment";
import { useAppDispatch, useAppSelector } from "../../store/applicationStore";
import { useEffect, useRef } from "react";
import { getAllComments } from "../../contexts/commentContext";

function CommentsList() {
  const comments = useAppSelector((state) => state.comments);
  const dispatch = useAppDispatch();
  const commentsEndRef = useRef<HTMLDivElement | null>(null); // Ref to the bottom of the comments list

  useEffect(() => {
    dispatch(getAllComments());
  }, [dispatch]);

  useEffect(() => {
    // This effect will run every time comments are updated
    const scrollToBottom = () => {
      if (commentsEndRef.current) {
        commentsEndRef.current.scrollIntoView({ behavior: "smooth" });
      }
    };

    setTimeout(scrollToBottom, 0); // Wait for DOM updates
  }, [comments.length]);

  return (
    <div className={styles.container}>
      {comments.map((comment) => (
        <Comment comment={comment} key={comment.id} />
      ))}
      {/* This div will serve as the reference point for scrolling */}
      <div ref={commentsEndRef}></div>
    </div>
  );
}

export default CommentsList;
