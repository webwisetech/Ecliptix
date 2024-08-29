import Environment from "../../runtime/env.js";
import { evaluate } from "../../runtime/index.js";
import { Runtime } from "../../runtime/val.js";
import { AssignmentExpression, Identifier } from "../../syntax/ast.js";
import { EcliptixErr } from "../../util/error.js";

export function Assignment(
	node: AssignmentExpression,
	env: Environment
): Runtime {
	if (node.assigne.kind !== "Identifier") {
		throw new EcliptixErr("Invalid assignment - "+node.assigne);
	}

	const varname = (node.assigne as Identifier).symbol;
	return env.assignVar(varname, evaluate(node.value, env));
}