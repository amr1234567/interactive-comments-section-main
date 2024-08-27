import {
  deleteIcon,
  editIcon,
  minusIcon,
  plusIcon,
  replayIcon,
} from "../../constants/imageImports";
import { ReplayType } from "../../models/replay";
import { useAppSelector } from "../../store/applicationStore";
import styles from "./replay.module.css";

function Replay({ replay }: Readonly<{ replay: ReplayType }>) {
  const { username } = useAppSelector((user) => user.user);
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
              {replay.user.username === username ? (
                <div className={styles["delete-and-edit-container"]}>
                  <button className={styles["delete-button-container"]}>
                    <img src={deleteIcon} alt="" />
                    <span>delete</span>
                  </button>
                  <button className={styles["edit-button-container"]}>
                    <img src={editIcon} alt="" />
                    <span>edit</span>
                  </button>
                </div>
              ) : (
                <button className={styles["replay-button-container"]}>
                  <img src={replayIcon} alt="" />
                  <span>Reply</span>
                </button>
              )}
            </div>
          </header>
          <main className={styles.content}>{replay.content}</main>
        </div>
      </div>
    </div>
  );
}

export default Replay;
