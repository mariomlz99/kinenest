export const LINUX_MODE=typeof document!=='undefined'&&document.body?.dataset.module==='linux';
export const MODULE_NAME=LINUX_MODE?'LINUX & TERMINAL':'ROS 2 BASICS';
export const SESSION_DATABASE=LINUX_MODE?'kinenest-linux-session':'kinenest-basics-session';
