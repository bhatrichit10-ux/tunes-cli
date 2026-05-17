import { Command } from "commander";
import { state } from "./player/state.js";
import "./ui/screen.js";
import process from "process";
import fs from "fs/promises";
import path from "path";

import {
  play,
  pause,
  stop
} from "./player/engine.js";

const program = new Command();

program
  .name("tunes")
  .description("A simple CLI-based music player")
  .version("1.0.0");

program
  .command("play <target>")
  .description("Play a music file or folder")
  .action(async (target) => {
    try {
      const stat = await fs.stat(target);

      if (stat.isFile()) {
        state.queue.push(target);
      } else if (stat.isDirectory()) {
        const files = await fs.readdir(target);

        for (const file of files) {
          const filePath = path.join(target, file);
          const fileStat = await fs.stat(filePath);

          if (fileStat.isFile()) {
            state.queue.push(filePath);
          }
        }
      }

      if (state.queue.length > 0) {
        await play(state.queue[0]);
        const current = state.queue.shift();
      }
    } catch {}
  });

program.parse(process.argv);

if (process.stdin.isTTY) {
  process.stdin.setRawMode(true);
}

process.stdin.resume();
process.stdin.setEncoding("utf8");

process.stdin.on("data", async (key) => {
  if (key === "\u0003" || key === "\u001bq") {
    process.exit(0);
  }

  if (key === "\u001bp") {
    await pause();
  }

  if (key === "\u001bs") {
    await stop();
  }
});

process.on("exit", async () => {
  await stop();
});