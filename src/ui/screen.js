import blessed from "blessed";
import { state } from "../player/state.js";
function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);

  return `${mins}:${secs.toString().padStart(2, "0")}`;
}
const screen = blessed.screen({
  smartCSR: true,
  title: "Tunes CLI"
});

const header = blessed.box({
  top: 0,
  width: "100%",
  height: 3,
  content: " > Tunes CLI ",
  border: {
    type: "line"
  },
  style: {
    border: {
      fg: "green"
    }
  }
});

const nowPlaying = blessed.box({
  top: 3,
  width: "100%",
  height: 8,
  border: {
    type: "line"
  },
  style: {
    border: {
      fg: "cyan"
    }
  }
});

const queueBox = blessed.box({
  top: 11,
  width: "100%",
  height: 8,
  border: {
    type: "line"
  },
  style: {
    border: {
      fg: "yellow"
    }
  }
});

const footer = blessed.box({
  bottom: 0,
  width: "100%",
  height: 3,
  content:
" Alt+P Pause | Alt+S Stop | Alt+Q Quit ",
  border: {
    type: "line"
  },
  style: {
    border: {
      fg: "magenta"
    }
  }
});

function generateProgressBar(progress) {
  const total = 20;

  const filled = Math.floor((progress / 100) * total);

  return (
    "█".repeat(filled) +
    "░".repeat(total - filled)
  );
}

export function renderUI() {
  nowPlaying.setContent(
`Now Playing

Song: ${state.currentSong || "None"}
Duration: ${formatTime(state.currentTime)}/${formatTime(state.duration)}
Status: ${state.status}

${generateProgressBar(state.progress)}`
  );

  queueBox.setContent(
`Queue

${
  state.queue.length
    ? state.queue.map(song => `• ${song}`).join("\n")
    : "No songs in queue"
}`
  );

  screen.render();
}

screen.append(header);
screen.append(nowPlaying);
screen.append(queueBox);
screen.append(footer);

screen.key(["q", "C-c"], () => {
  process.exit(0);
});

renderUI();

export { screen };