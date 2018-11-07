import { instanceSelector } from '../orm/selectors';

export function item(state) {
  const { type, id } = state.playback.item;
  return instanceSelector(state, type, id);
}

export function isPlaying(state) {
  return state.playback.playing;
}

export function isPaused(state) {
  return state.playback.paused;
}

export function elapsed(state) {
  return state.playback.elapsed;
}

export function getSound(state) {
  return state.playback.sound;
}
