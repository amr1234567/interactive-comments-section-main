import AddCommentInput from "../components/add-comment-input-component/AddCommentInput";
import CommentsList from "../components/comment-list-component/commentsList";
import styles from "./App.module.css";

function App() {
  return (
    <div className={styles.main}>
      <div>
        <CommentsList />
      </div>
      <AddCommentInput />
    </div>
  );
}

export default App;
