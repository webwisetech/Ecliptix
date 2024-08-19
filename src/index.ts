#! /usr/bin/env node

// includes/imports
import Parser from './syntax/parser.js'; // parser class
import { evaluate } from './runtime/index.js'; // actual code running
import _colors from 'colors'; // im not gay i swear
import { Library } from './lib/index.js'; // a library with no books
import yml from 'yaml' // yeah am lazy
import { Lexer } from './syntax/lexer.js'; // nobody likes to learn a new language if its confusing
import { question as prompt } from 'readline-sync';
import { readFile } from './util/fs.js'; // file system stuff

export async function run(path: string ,debug?: boolean){
    const lexer = new Lexer();
    const parser = new Parser();
    const json = yml.parse(readFile("ss.yml"));
    const lib = new Library(json.packages);
    const env = lib.env;
    await lib.registerPacks().then(() => {
        const input = lexer.Tokenize(readFile(path));
        const program = parser.createAST(input);
        const result = evaluate(program, env);
        if(debug)
            console.log(result)
    })
}

export async function repl(){
    const rn = Date.now();
    console.log("Starting Ecliptix repl...")
    const lexer = new Lexer();
    console.log("Lexer: loaded")
    const parser = new Parser();
    console.log("Parser: loaded")
    const lib = new Library(["io", "math", "colors", "process", "time"]);
    const env = lib.env;
    console.log("Environment: loaded")
    await lib.registerPacks().then(() => {
        console.log("Library: loaded")
    })
    let DebugMode = false;
    console.log("Ecliptix", "REPL v0.0.4-a");
    console.log("Took", Date.now()-rn+"ms", "to start the REPL");
    while(true){
        const input = prompt(_colors.green("> "));

        if(!input){
            continue
        }else if(input == "/exit"){
            console.log(_colors.red("exiting"));
            process.exit(1);
        } else if(input == "/debug"){
            DebugMode = !DebugMode;
            console.log(_colors.yellow("Toggled Debug mode!"));
        } else if(input == "/help"){
            console.log("All commands: \n- /exit: exit the repl\n- /debug: enable debug mode\n- /help: shows this menu")
        }else{
            const program = parser.createAST(lexer.Tokenize(input));
            const result =evaluate(program, env);

        if(DebugMode){
            console.log(program);
            console.log(result)
        }
        }
    }
}