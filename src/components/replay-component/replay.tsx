import { useEffect, useState } from "react";
import {
  deleteIcon,
  editIcon,
  minusIcon,
  plusIcon,
} from "../../constants/imageImports";
import { ReplayType } from "../../models/replay";
import { useAppDispatch, useAppSelector } from "../../store/applicationStore";
import styles from "./replay.module.css";
import InputComponent from "../replay-and-update-comment-input-component/inputComment";
import {
  deleteReplay,
  editReplay,
  startDeleting,
} from "../../contexts/commentContext";

function Replay({ replay }: Readonly<{ replay: ReplayType }>) {
  const user = useAppSelector((state) => state.user);
  const [operationsState, setOperationsState] = useState({
    editing: false,
  });
  const { confirmDeleting, IdForDeleting, type } = useAppSelector(
    (state) => state.comments
  );

  const dispatch = useAppDispatch();
  useEffect(() => {
    if (confirmDeleting && IdForDeleting === replay.id && type === "replay") {
      dispatch(
        deleteReplay({
          commentId: replay.commentId,
          replayId: replay.id,
        })
      );
    }
  }, [confirmDeleting]);

  const OnClearEdit = () => {
    setOperationsState({ ...operationsState, editing: false });
  };

  const OnSubmitEdit = ({ commentText }: { commentText: string }) => {
    dispatch(editReplay({ ...replay, content: commentText }));
    OnClearEdit();
  };

  return (
    <div className={styles.container}>
      <div className={styles["comment-card"]}>
        <div className={styles["score-container"]}>
          <button className={styles.increment}>
            <img src={plusIcon} alt="" />
          </button>
          <p className={styles.score}>{replay.score}</p>
          <button className={styles.decrement}>
            <img src={minusIcon} alt="" />
          </button>
        </div>
        <div className={styles["comment-cart-info"]}>
          <header className={styles["comment-header"]}>
            <div className={styles["cart-header-left-side"]}>
              <div className={styles["user-image"]}>
                <img src={replay.user.image.png} alt="" />
              </div>
              <p className={styles.username}>{replay.user.username}</p>
              <p className={styles["created-at"]}>{replay.createdAt}</p>
            </div>
            <div className={styles["cart-header-right-side"]}>
              {replay.user.username === user.username && (
                <div className={styles["delete-and-edit-container"]}>
                  <button
                    className={styles["delete-button-container"]}
                    onClick={() =>
                      dispatch(startDeleting({ id: replay.id, type: "replay" }))
                    }
                  >
                    <img src={deleteIcon} alt="" />
                    <span>delete</span>
                  </button>
                  <button
                    className={styles["edit-button-container"]}
                    onClick={() =>
                      setOperationsState({ ...operationsState, editing: true })
                    }
                  >
                    <img src={editIcon} alt="" />
                    <span>edit</span>
                  </button>
                </div>
              )}
            </div>
          </header>
          {!operationsState.editing ? (
            <main className={styles.content}>{replay.content}</main>
          ) : (
            <InputComponent
              buttonText="Edit"
              value={replay.content}
              onClear={OnClearEdit}
              onSubmit={OnSubmitEdit}
              showImage={true}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default Replay;
