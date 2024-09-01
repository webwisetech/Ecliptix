import { 
    NumberValue, 
    StringValue, 
    BooleanValue, 
    NullValue,
    FunctionValue,
    Runtime,
    ArrayValue,
    ObjectValue,
    makeObj,
	ShellCommand
} from "../runtime/val.js";
import util from 'node:util';
import { question } from 'readline-sync';
import { execSync } from "node:child_process";
import Environment from "../runtime/env.js";
import { evaluate } from "../runtime/index.js";
import { Library } from "./index.js";
import { EcliptixErr } from "../util/error.js";
import { Statement } from '../syntax/ast';
import { LibraryOptions } from "../util/types.js";
export default ({ makeStr, library, makeNull }: LibraryOptions) => {
    const consoll = {
        out: library.createFunction("out", (args: Runtime[], _scope: Environment) => {
            const log: any[] = []
        
            for (const arg of args) {
                switch (arg.type) {
                    case 'number':
                        log.push(((arg as NumberValue).value))
                    continue
                    case 'string':
                        log.push((arg as StringValue).value)
                    continue
                    case 'boolean':
                        log.push(((arg as BooleanValue).value))
                    continue
                    case 'null':
                        log.push(((arg as NullValue).value))
                    continue
					case 'shell':
						log.push((arg as ShellCommand).value)
					continue
                    default:
                        log.push(arg)
                }
            }
                const be42log = util.format.apply(this, log);
                console.log(be42log)
        
            return makeStr(be42log);
        }),
        ask: library.createFunction("ask", (args: Runtime[], _scope: Environment) => {
            const log: any[] = []
        
            for (const arg of args) {
                switch (arg.type) {
                    case 'string':
                        log.push((arg as StringValue).value)
                    continue
                    default:
                        log.push(arg)
                }
            }
    
            return makeStr(question(util.format.apply(this, log) || "> "));
        }),
        loop: library.createFunction("loop", function(args: Runtime[], scope: Environment){
            const amt: number = (args[0] as NumberValue).value;
            if(!(args[1] as FunctionValue).body) throw "no function found in call";
            if(amt < -1) throw new EcliptixErr("Loops cannot be under -1");
                const env = new Environment(scope);
    
                let result: Runtime = makeNull();
                if(amt > 0){
                    for(let i = 0; i < (args[0] as NumberValue).value; i++){
                        for (const Statement of (args[1] as FunctionValue).body) {
                        result = evaluate(Statement, env);
                    }
                }
                } else {
                    while(true){
                        for (const Statement of (args[1] as FunctionValue).body){
                            result = evaluate(Statement, env);
                            if(result.type === "break"){
                                break;
                            }
                        }
                    }
                }
            return result;
        })
    };

    library.createVariable("console", makeObj(consoll), true);
    
}