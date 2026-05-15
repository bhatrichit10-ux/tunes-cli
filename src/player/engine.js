import { spawn } from "child_process";

import { state } from "./state.js";
import { renderUI } from "../ui/screen.js";

let currentPlayer = null;
let paused = false;

export function play(file) {
  if (currentPlayer) {
    stop();
  }

  state.currentSong = file;
  state.status = "Playing";
  state.progress = 0;

  renderUI();

  currentPlayer = spawn(
    "C:/mpv/mpv.exe",
    [
      "--no-video",
      "--quiet",
      file
    ],
    {
      stdio: ["pipe", "ignore", "ignore"]
    }
  );

  paused = false;

  currentPlayer.on("close", () => {
    state.status = "Stopped";
    state.progress = 0;

    renderUI();

    currentPlayer = null;
    paused = false;
  });

  currentPlayer.on("error", (err) => {
    console.error(err);
  });

  let progress = 0;

  const interval = setInterval(() => {
    if (!currentPlayer) {
      clearInterval(interval);
      return;
    }

    if (paused) return;

    progress += 2;

    if (progress > 100) {
      progress = 100;
    }

    state.progress = progress;

    renderUI();
  }, 1000);
}

export function pause() {
  if (!currentPlayer) return;

  currentPlayer.stdin.write(" ");

  paused = !paused;

  state.status = paused
    ? "Paused"
    : "Playing";

  renderUI();
}

export function stop() {
  if (!currentPlayer) return;

  currentPlayer.kill();

  state.status = "Stopped";
  state.progress = 0;

  renderUI();

  currentPlayer = null;
  paused = false;
}