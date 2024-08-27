import { useEffect } from "react";
import AddCommentInput from "../components/add-comment-input-component/AddCommentInput";
import CommentsList from "../components/comment-list-component/commentsList";
import Overlay from "../components/overlay-component/overlay";
import { cancelDeleting, confirmDeleting } from "../contexts/commentContext";
import { useAppDispatch, useAppSelector } from "../store/applicationStore";
import styles from "./App.module.css";
import { fetchCurrentUser } from "../contexts/userContext";

function App() {
  const { isDeleting } = useAppSelector((state) => state.comments);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchCurrentUser());
  }, [dispatch]);

  const handleDelete = () => {
    dispatch(confirmDeleting());
  };

  const handleCloseOverlay = () => {
    dispatch(cancelDeleting());
  };
  return (
    <>
      {isDeleting && (
        <Overlay
          message="Are you sure you want to delete this item?"
          onClose={handleCloseOverlay}
          onDelete={handleDelete}
        />
      )}
      <div className={styles.main}>
        <div>
          <CommentsList />
        </div>
        <AddCommentInput />
      </div>
    </>
  );
}

export default App;
