import Environment from "../../runtime/env.js";
import { Runtime } from "../../runtime/val.js";
import { Identifier } from "../../syntax/ast.js";

export function EIdentifier(
	ident: Identifier,
	env: Environment
): Runtime {
	const val = env.lookupVar(ident.symbol);
	return val;
}