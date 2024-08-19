import { evaluate } from "../../runtime/index.js";
import Environment from "../../runtime/env.js";
import { Runtime, makeNull } from "../../runtime/val.js";
import { Program } from "../../syntax/ast.js";

export function SProgram(program: Program, env: Environment): Runtime {
	let lastEvaluated: Runtime = makeNull();
	for (const statement of program.body) {
		lastEvaluated = evaluate(statement, env);
	}
	return lastEvaluated;
}