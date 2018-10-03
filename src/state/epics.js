import patreonEpic from './ducks/patreon/epic';
import ormEpic from './ducks/orm/epic';

/**
 * All epics should be exported in the array below.
 * Epics in this array will be joined with combineEpics
 * when creating the store enhancer.
 */

export default [
  patreonEpic,
  ormEpic,
];
