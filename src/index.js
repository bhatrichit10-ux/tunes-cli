
//     program
//     .name("tunes")
//     .description("A simple CLI-based music player")
//     .version("1.0.0");

//     program
//     .command("play <file>")
//         .description("Play a music file")
//         .action(async (file) => {
//         try {
//             await play(file);
//         } catch (error) {
//             console.error(chalk.red(`[-] Error playing ${file}: ${error.message}`));    
//         }
//         }
//     )
// process.stdin.setRawMode(true);
// process.stdin.resume();
// process.stdin.setEncoding("utf8");

// process.stdin.on("data", (key) => {
  
// if (key === "\u001bq") { // Alt Q
//     process.exit();
//   }
// if (key === "\u001bp") {
//   pause();
// }
// if (key === "\u001bs") {
//   stop();
// }
// });
// program.parse(process.argv);


import { Command } from "commander";

import './ui/screen.js';

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
.command("play <file>")
    .description("Play a music file")
    .action(async (file) => {
    play(file);
    } );

program.parse(process.argv);

process.stdin.setRawMode(true);
process.stdin.resume(); 
process.stdin.setEncoding("utf8");

process.stdin.on('data', (key) => {
  if (key === '\u001bq') { // Alt Q
    process.exit(0);
  } else if (key === '\u001bp') { // Alt P
    pause();
  } else if (key === '\u001bs') { // Alt S
    stop();
  }
})