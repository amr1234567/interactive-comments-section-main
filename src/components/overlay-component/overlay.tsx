import React from "react";
import styles from "./overlay.module.css";

interface OverlayProps {
  message: string;
  onClose: () => void;
  onDelete: () => void;
}

const Overlay: React.FC<OverlayProps> = ({ message, onClose, onDelete }) => {
  return (
    <div className={styles.overlay}>
      <div className={styles.alertBox}>
        <h2>Delete Element</h2>
        <p>{message}</p>
        <div className={styles.buttonContainer}>
          <button className={styles.cancelButton} onClick={onClose}>
            Cancel
          </button>
          <button className={styles.deleteButton} onClick={onDelete}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default Overlay;
