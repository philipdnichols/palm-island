import React, { ReactElement } from "react";
import cx from "classnames";
import { useSelector } from "react-redux";
import { CombinedState } from "redux";
import moment from "moment-timezone";
import { logsSelector } from "../selectors/gameLogSelectors";
import { GameLog as iGameLog } from "../actions/gameLogActions";
import { PalmIslandState } from "../reducers/palmIslandReducer";
import { GameLogState } from "../reducers/gameLogReducer";
import styles from "./GameLog.module.scss";

export interface GameLogProps {
  className: string;
}

export const GameLog = (props: GameLogProps): ReactElement | null => {
  const { className } = props;

  const logs: iGameLog[] = useSelector<
    CombinedState<{ palmIslandReducer: PalmIslandState; gameLogReducer: GameLogState }>,
    iGameLog[]
  >(logsSelector);

  function render(): ReactElement | null {
    return (
      <div className={cx(className)}>
        <div className={cx(styles.wrapper)}>
          {logs.map((log: iGameLog) => (
            <div key={log.id} className={cx(styles.log)}>
              <span>
                {moment.unix(log.timestamp).tz(moment.tz.guess()).format("hh:mm A")}: {log.log}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return render();
};
