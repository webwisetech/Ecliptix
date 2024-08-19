import Environment from "../../runtime/env.js";
import { evaluate } from "../../runtime/index.js";
import { Runtime, ObjectValue } from "../../runtime/val.js";
import { ObjectLiteral } from "../../syntax/ast.js";

export function ObjectExpression(
	obj: ObjectLiteral,
	env: Environment
): Runtime {
	const object = { type: "object", properties: new Map() } as ObjectValue;
	for (const { key, value } of obj.properties) {
		const Runtime =
			value == undefined ? env.lookupVar(key) : evaluate(value, env);

		object.properties.set(key, Runtime);
	}

	return object;
}