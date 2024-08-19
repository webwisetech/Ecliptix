import { Runtime, BooleanValue, StringValue } from "../../runtime/val.js";
import { typeOfToken } from "../../syntax/lexer.js";


export function isTruthy(left: Runtime, operator: typeOfToken, right: Runtime): boolean {
    switch (operator) {
        case typeOfToken.DoubleEquals:{
            if ((left as BooleanValue).value == (right as BooleanValue).value || (left as StringValue).value == (right as unknown) as string) return true
            else return false
		}
        case typeOfToken.NotEquals:
            if ((left as BooleanValue).value != (right as BooleanValue).value) return true
            else return false
		default:
			return false;
    }
}