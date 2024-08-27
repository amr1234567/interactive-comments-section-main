/* eslint-disable @typescript-eslint/no-explicit-any */
import { useForm } from "react-hook-form";
import styles from "./AddCommentInput.module.css";
import { useAppDispatch, useAppSelector } from "../../store/applicationStore";
import { useEffect } from "react";
import { fetchCurrentUser } from "../../contexts/userContext";
import { addComment } from "../../contexts/commentContext";

function AddCommentInput() {
  const user = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchCurrentUser());
  }, [dispatch]);
  const {
    register,
    handleSubmit,
    setValue,
    formState: { isDirty, isValid, isSubmitting },
  } = useForm<{ comment: string }>({});

  const onSubmit = (data: { comment: string }) => {
    // Handle form submission
    console.log(data.comment);
    dispatch(addComment({ text: data.comment, user }));
    setValue("comment", "");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
      <div className={styles["profile-photo"]}>
        <img src={user?.image.png} alt="" />
      </div>
      <textarea
        className={styles.input}
        {...register("comment", {
          required: {
            message: "Please enter a valid comment",
            value: true,
          },
        })}
      />
      {isSubmitting ? (
        <p>Submitting...</p>
      ) : (
        <button
          disabled={!isValid || !isDirty}
          type="submit"
          className={styles["submit-button"]}
        >
          Send
        </button>
      )}
    </form>
  );
}

export default AddCommentInput;
