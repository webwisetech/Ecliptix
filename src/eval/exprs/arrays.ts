import Environment from "../../runtime/env.js";
import { evaluate } from "../../runtime/index.js";
import { Runtime, ArrayValue } from "../../runtime/val.js";
import { ArrayLiteral } from "../../syntax/ast.js";

export function Arrays(
	arr: ArrayLiteral,
	env: Environment
): Runtime[] {
	const array = { type: "array", elements: [] as Runtime[] } as ArrayValue;

	for(const { value } of arr.elements){
		const Runtime =
			value == undefined ? env.lookupVar(value) : evaluate(value, env);
		if(Runtime.value !== undefined)
			array.elements.push(Runtime.value);
		else
			array.elements.push(Runtime);
	}

	return array.elements
}