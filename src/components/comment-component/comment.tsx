import { useState } from "react";
import {
  deleteIcon,
  editIcon,
  minusIcon,
  plusIcon,
  replayIcon,
} from "../../constants/imageImports";
import { deleteComment, editComment } from "../../contexts/commentContext";
import { CommentType } from "../../models/comment";
import { useAppDispatch, useAppSelector } from "../../store/applicationStore";
import InputComponent from "../replay-and-update-comment-input-component/inputComment";
import ReplaysContainer from "../replays-container-component/replaysContainer";
import styles from "./comment.module.css";

function Comment({ comment }: Readonly<{ comment: CommentType }>) {
  const [operationsState, setOperationsState] = useState({
    editing: false,
    deleting: false,
    replying: false,
  });
  const { username } = useAppSelector((user) => user.user);
  const dispatch = useAppDispatch();

  const onSubmitReply = ({ commentText }: { commentText: string }) => {
    const newComment: CommentType = { ...comment, content: commentText };
    dispatch(editComment(newComment));
  };

  const onClearReply = () => {
    console.log("onClearReply");
    setOperationsState({ ...operationsState, replying: false });
  };

  return (
    <>
      {operationsState.deleting && (
        <>
          <div className={styles["overlay"]}></div>
          <div className={styles["delete-container-message"]}>
            <h2>Delete Comment</h2>
            <p></p>
            <div className={styles["buttons-container"]}>
              <button
                className={styles["cancel-delete-button"]}
                onClick={() =>
                  setOperationsState({ ...operationsState, deleting: false })
                }
              >
                No Cancel
              </button>
              <button
                className={styles["delete-button"]}
                onClick={() => dispatch(deleteComment(comment.id))}
              >
                Delete
              </button>
            </div>
          </div>
        </>
      )}
      <div className={styles.container}>
        <div className={styles["comment-card"]}>
          <div className={styles["score-container"]}>
            <button
              className={styles.increment}
              onClick={() =>
                dispatch(editComment({ ...comment, score: comment.score + 1 }))
              }
            >
              <img src={plusIcon} alt="" />
            </button>
            <p className={styles.score}>{comment.score}</p>
            <button
              className={styles.decrement}
              onClick={() =>
                dispatch(
                  editComment({
                    ...comment,
                    score: comment.score - 1 < 0 ? 0 : comment.score - 1,
                  })
                )
              }
            >
              <img src={minusIcon} alt="" />
            </button>
          </div>
          <div className={styles["comment-cart-info"]}>
            <header className={styles["comment-header"]}>
              <div className={styles["cart-header-left-side"]}>
                <div className={styles["user-image"]}>
                  <img src={comment.user.image.png} alt="" />
                </div>
                <p className={styles.username}>{comment.user.username}</p>
                <p className={styles["created-at"]}>{comment.createdAt}</p>
              </div>
              <div className={styles["cart-header-right-side"]}>
                {comment.user.username === username ? (
                  <div className={styles["delete-and-edit-container"]}>
                    <button
                      className={styles["delete-button-container"]}
                      onClick={() =>
                        setOperationsState({
                          ...operationsState,
                          deleting: true,
                        })
                      }
                    >
                      <img src={deleteIcon} alt="" />
                      <span>delete</span>
                    </button>
                    <button
                      className={styles["edit-button-container"]}
                      onClick={() =>
                        setOperationsState({
                          ...operationsState,
                          editing: true,
                        })
                      }
                    >
                      <img src={editIcon} alt="" />
                      <span>edit</span>
                    </button>
                  </div>
                ) : (
                  <button
                    className={styles["replay-button-container"]}
                    onClick={() =>
                      setOperationsState({ ...operationsState, replying: true })
                    }
                  >
                    <img src={replayIcon} alt="" />
                    <span>Reply</span>
                  </button>
                )}
              </div>
            </header>
            <main className={styles.content}>{comment.content}</main>
          </div>
        </div>{" "}
        {operationsState.replying ? (
          <InputComponent
            buttonText="Reply"
            onSubmit={onSubmitReply}
            onClear={onClearReply}
          />
        ) : (
          ""
        )}
        <div className={styles["comment-replays-container"]}>
          <ReplaysContainer replays={comment.replies} />
        </div>
      </div>
    </>
  );
}

export default Comment;
