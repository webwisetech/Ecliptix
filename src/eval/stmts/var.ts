import { evaluate } from "../../runtime/index.js";
import Environment from "../../runtime/env.js";
import { Runtime, makeNull } from "../../runtime/val.js";
import { VarDeclaration } from "../../syntax/ast.js";
import { SkyScriptErr } from "../../util/error.js";

export function VariableDeclaration(
	declaration: VarDeclaration,
	env: Environment
): Runtime {
	const value: Runtime = declaration.value
		? evaluate(declaration.value, env)
		: makeNull();

	if(declaration.type === value.type)
		return env.declareVar(declaration.identifier, value, declaration.constant);
	else
		new SkyScriptErr("Expected the variable '"+ declaration.identifier+ "' to have a type of '"+ declaration.type + "' but found '"+ value.type+"' instead.")
	return makeNull();
}