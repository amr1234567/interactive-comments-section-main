import { useForm } from "react-hook-form";
import styles from "./InputComponent.module.css";
import { useAppDispatch, useAppSelector } from "../../store/applicationStore";
import { useEffect } from "react";
import { fetchCurrentUser } from "../../contexts/userContext";

function InputComponent({
  onSubmit,
  onClear,
  buttonText,
  showImage,
  value,
}: Readonly<{
  onSubmit: ({ commentText }: { commentText: string }) => void;
  buttonText: string;
  onClear: () => void;
  showImage: boolean | undefined;
  value: string | undefined;
}>) {
  const user = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchCurrentUser());
  }, [dispatch]);
  const {
    register,
    handleSubmit,
    formState: { isDirty, isValid, isSubmitting },
  } = useForm<{ commentText: string }>({
    defaultValues: { commentText: value ?? "" },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
      {showImage && (
        <div className={styles["profile-photo"]}>
          <img src={user?.image.png} alt="" />
        </div>
      )}
      <textarea
        className={styles.input}
        {...register("commentText", {
          required: {
            message: "Please enter a valid comment",
            value: true,
          },
        })}
      />
      {isSubmitting ? (
        <p>Submitting...</p>
      ) : (
        <>
          <button
            disabled={!isValid || !isDirty}
            type="submit"
            className={styles["submit-button"]}
          >
            {buttonText}
          </button>
          <button onClick={onClear} className={styles["clear-button"]}>
            Cancel
          </button>
        </>
      )}
    </form>
  );
}

export default InputComponent;
