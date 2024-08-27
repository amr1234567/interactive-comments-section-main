import { ReplayType } from "../../models/replay";
import Replay from "../replay-component/replay";
import styles from "./replaysContainer.module.css";

function ReplaysContainer({ replays }: Readonly<{ replays: ReplayType[] }>) {
  return (
    <div className={styles.container}>
      {replays.map((replay) => (
        <Replay replay={replay} key={replay.id} />
      ))}
    </div>
  );
}

export default ReplaysContainer;
