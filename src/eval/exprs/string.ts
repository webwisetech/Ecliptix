import { StringValue } from "../../runtime/val.js";
import { EcliptixErr } from "../../util/error.js";

export function StringBinaryExpression(
    leftHandSide: StringValue, 
    rightHandSide: StringValue, 
    operator: string
): StringValue {
    let result: string
	let lhs = leftHandSide.value;
	let rhs = rightHandSide.value;

	if(leftHandSide.value === undefined)
		lhs = (leftHandSide as unknown) as string;
	if(rightHandSide.value === undefined)
		rhs = (rightHandSide as unknown) as string;

    if (operator == '+') result = `${lhs.replace("\\n", "\n")}` + `${rhs.replace("\\n", "\n")}`
    else {
        throw new EcliptixErr(`Cannot use operator "${operator}" in string Expression.`);
    }

    return { value: result, type: 'string' } as StringValue;
}