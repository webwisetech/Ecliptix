import Environment from "../../runtime/env.js";
import { FunctionValue, Runtime } from "../../runtime/val.js";
import { FunctionDeclaration } from "../../syntax/ast.js";

export function FunDeclaration(
	declaration: FunctionDeclaration,
	env: Environment
): Runtime {
	
	const fn = {
		type: "function",
		name: declaration.name,
		parameters: declaration.parameters,
		declarationEnv: env,
		body: declaration.body,
	} as FunctionValue;

	return env.declareVar(declaration.name, fn, true);
}
