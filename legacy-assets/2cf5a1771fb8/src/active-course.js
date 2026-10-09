import {LINUX_MODE} from './course-mode.js';
import {UNIT_NAMES as ROS_NAMES,unit as rosUnit} from './units.js';
import {unitChecks as rosChecks} from './units/checks.js';
import {LINUX_NAMES,linuxUnit,linuxChecks} from './linux-course.js';
export const UNIT_NAMES=LINUX_MODE?LINUX_NAMES:ROS_NAMES;
export const unit=LINUX_MODE?linuxUnit:rosUnit;
export const unitChecks=LINUX_MODE?linuxChecks:rosChecks;
