import { NumericBinaryExpression } from "../index.js";
import { evaluate } from "../../runtime/index.js";
import Environment from "../../runtime/env.js";
import { Runtime, NumberValue, StringValue, makeNull } from "../../runtime/val.js";
import { BinaryExpression } from "../../syntax/ast.js";
import { StringBinaryExpression } from "./string.js";

export function BinaryExpression(
	binop: BinaryExpression,
	env: Environment
): Runtime {
	const lhs = evaluate(binop.left, env);
	const rhs = evaluate(binop.right, env);

	
	if((lhs.type !== null && lhs.type !== undefined) && (rhs.type !== null && rhs.type !== undefined)){
	if (lhs.type == "number" && rhs.type == "number") {
		return NumericBinaryExpression(
			lhs as NumberValue,
			rhs as NumberValue,
			binop.operator
		);
	}
	if(lhs.type == "string" && rhs.type == "string"){
		return StringBinaryExpression(
			lhs as StringValue,
			rhs as StringValue,
			binop.operator
		)
	}
} else {
	return StringBinaryExpression(
		lhs,
		rhs,
		binop.operator
	)
}

	
	return makeNull();
}