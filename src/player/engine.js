import MPVPlayer from "node-mpv";
import { state } from "./state.js";
import { renderUI } from "../ui/screen.js";

let mpv = null;

export async function play(file) {
  if (mpv) {
    await stop();
  }

  mpv = new MPVPlayer({ audio_only: true, auto_restart: false });

  mpv.on("stopped", () => {
    state.status = "Stopped";
    state.progress = 0;
    renderUI();
    mpv = null;
  });

  mpv.on("timeposition", (seconds) => {
    if (state.duration > 0) {
      state.progress = Math.min(100, (seconds / state.duration) * 100);
      renderUI();
    }
  });

  mpv.on("statuschange", (status) => {
    if (status.duration) {
      state.duration = status.duration;
    }
  });

  await mpv.load(file);

  state.currentSong = file;
  state.status = "Playing";
  state.progress = 0;

  renderUI();
}

export async function pause() {
  if (!mpv) return;

  await mpv.togglePause();

  const paused = await mpv.getProperty("pause");
  state.status = paused ? "Paused" : "Playing";

  renderUI();
}

export async function stop() {
  if (!mpv) return;

  await mpv.stop();
  await mpv.quit();

  state.status = "Stopped";
  state.progress = 0;

  renderUI();

  mpv = null;
}