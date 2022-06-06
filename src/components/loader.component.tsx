/** @jsx h */
import { h } from "preact";
import * as styles from './loader.module.less'

export const LoaderComponent = () => {
  return (
    <div>
		<div className={styles["loader"]}></div>
	</div>
  );
};
