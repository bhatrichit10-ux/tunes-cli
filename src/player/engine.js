import player from "play-sound";

const audio = player();

export function play(file) {
  audio.play(file, function (err) {
    if (err) {
        console.error(chalk.red(`[-] Error playing ${file}: ${err.message}`));
    }
    else console.log(chalk.brightGreen(`[+] Playing ${file}`));
  });
}
