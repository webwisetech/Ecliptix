import { NumberValue } from "../../runtime/val.js";

export function NumericBinaryExpression(
	lhs: NumberValue,
	rhs: NumberValue,
	operator: string
): NumberValue {
	let result: number;
	if (operator == "+") {
		result = lhs.value + rhs.value;
	} else if (operator == "-") {
		result = lhs.value - rhs.value;
	} else if (operator == "*") {
		result = lhs.value * rhs.value;
	} else if (operator == "/") {
		
		result = lhs.value / rhs.value
	} else {
		result = lhs.value % rhs.value;
	}

	return { value: result, type: "number" };
}