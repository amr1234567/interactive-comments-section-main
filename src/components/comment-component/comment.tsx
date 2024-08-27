import { useEffect, useState } from "react";
import {
  deleteIcon,
  editIcon,
  minusIcon,
  plusIcon,
  replayIcon,
} from "../../constants/imageImports";
import {
  addReplay,
  deleteComment,
  editComment,
  startDeleting,
} from "../../contexts/commentContext";
import { CommentType } from "../../models/comment";
import { useAppDispatch, useAppSelector } from "../../store/applicationStore";
import InputComponent from "../replay-and-update-comment-input-component/inputComment";
import ReplaysContainer from "../replays-container-component/replaysContainer";
import styles from "./comment.module.css";

function Comment({ comment }: Readonly<{ comment: CommentType }>) {
  const [operationsState, setOperationsState] = useState({
    editing: false,
    replying: false,
  });
  const user = useAppSelector((user) => user.user);
  const { confirmDeleting, IdForDeleting, type } = useAppSelector(
    (state) => state.comments
  );
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (confirmDeleting && IdForDeleting === comment.id && type === "comment") {
      dispatch(deleteComment(comment.id));
    }
  }, [confirmDeleting]);

  const onSubmitReply = ({ commentText }: { commentText: string }) => {
    dispatch(
      addReplay({
        commentId: comment.id,
        text: commentText,
        user: user,
      })
    );
    setOperationsState({ ...operationsState, replying: false });
  };
  const onClearReply = () => {
    console.log("onClearReply");
    setOperationsState({ ...operationsState, replying: false });
  };

  const OnClearEdit = () => {
    setOperationsState({ ...operationsState, editing: false });
  };

  const OnSubmitEdit = ({ commentText }: { commentText: string }) => {
    dispatch(editComment({ ...comment, content: commentText }));
    OnClearEdit();
  };

  return (
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
              {comment.user.username === user.username ? (
                <div className={styles["delete-and-edit-container"]}>
                  <button
                    className={styles["delete-button-container"]}
                    onClick={() =>
                      dispatch(
                        startDeleting({
                          id: comment.id,
                          type: "comment",
                        })
                      )
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
          {!operationsState.editing ? (
            <main className={styles.content}>{comment.content}</main>
          ) : (
            <InputComponent
              buttonText="Edit"
              value={comment.content}
              onClear={OnClearEdit}
              onSubmit={OnSubmitEdit}
              showImage={true}
            />
          )}
        </div>
      </div>{" "}
      {operationsState.replying && (
        <InputComponent
          buttonText="Reply"
          value=""
          onSubmit={onSubmitReply}
          onClear={onClearReply}
          showImage={true}
        />
      )}
      <div className={styles["comment-replays-container"]}>
        <ReplaysContainer replays={comment.replies} />
      </div>
    </div>
  );
}

export default Comment;
