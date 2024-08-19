import Environment from "../../runtime/env.js";
import { evaluate } from "../../runtime/index.js";
import { Runtime, StringValue, NativeFnValue, FunctionValue, makeNull } from "../../runtime/val.js";
import { CallExpression } from "../../syntax/ast.js";

export function CallExpr(Expression: CallExpression, env: Environment): Runtime {
	const args = Expression.args.map((arg) => evaluate(arg, env));
	const fn = evaluate(Expression.caller, env);

	if (fn.type == "native-fn") {
		const result: StringValue | Runtime = (fn as NativeFnValue).call(args, env);
		return result;
	}

	if (fn.type == "function") {
		const func = fn as FunctionValue;
		const scope = new Environment(func.declarationEnv);

		
		for (let i = 0; i < func.parameters.length; i++) {
			
			
			const varname = func.parameters[i];
			scope.declareVar(varname, args[i], false);
		}

		let result: Runtime = makeNull();
		for (const Statement of func.body) {
			result = evaluate(Statement, scope);
		}

		return result;
	}

	throw "Cannot call value that is not a function: " + JSON.stringify(fn);
}