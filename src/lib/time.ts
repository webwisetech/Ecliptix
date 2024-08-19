import { execSync } from "child_process";
import Environment from "../runtime/env.js";
import { NumberValue, Runtime, makeNull, makeNum } from "../runtime/val.js";

export default ({ library }) => {
	library.createFunction("now", function(_args: Runtime[], _env: Environment) {
		return makeNum(Date.now());
	});
	library.createFunction("wait", function(args, _scope){
        const value = (args[0] as NumberValue).value;
        execSync(`sleep ${value}`, {});
        return makeNull();
    })
}