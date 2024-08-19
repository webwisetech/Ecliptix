import { NumberValue, StringValue, BooleanValue, NullValue } from "../runtime/val.js";
import util from 'node:util';
import { question } from 'readline-sync';
import { run } from "../index.js";
import { execSync } from "node:child_process";

export default ({ library, makeNull }) => {
    library.createFunction("exit", (args, _scope) => {
        let exitCode: number;

        switch(args[0].type){
            case 'number':
                exitCode = (args[0] as NumberValue).value
            default:
                exitCode = args[0]
        }

        process.exit(exitCode);
    });

    library.createFunction("run", (args, _scope) => {
        let file = "error";

        const log: string[] = []
    
        for (const arg of args) {
            switch (arg.type) {
                case 'string':
                    log.push((arg as StringValue).value)
                continue
                default:
                    log.push(arg)
            }
        }

        run(file);
    });

    library.createFunction("shell", function(args, _scope){
        const value = (args[0] as StringValue).value || args[0];
        execSync(`${value}`, {});
        return makeNull();
    })
}