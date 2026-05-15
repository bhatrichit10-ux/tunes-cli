    import { Command } from "commander";
    import { play } from "./player/engine.js";

    const program = new Command();

    program
    .name("tunes")
    .description("A simple CLI-based music player")
    .version("1.0.0");

    program
    .command("play <file>")
        .description("Play a music file")
        .action(async (file) => {
        try {
            await play(file);
        } catch (error) {
            console.error(chalk.red(`[-] Error playing ${file}: ${error.message}`));    
        }
        }
    )

    program.parse(process.argv);