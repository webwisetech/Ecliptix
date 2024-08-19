import { evaluate } from "../../runtime/index.js";
import Environment from "../../runtime/env.js";
import { Runtime } from "../../runtime/val.js";
import { EqualityExpression } from "../../syntax/ast.js";
import { isTruthy } from "./truthy.js";

export function EqualityExpr(Expression: EqualityExpression, env: Environment): Runtime {
    const left = evaluate(Expression.left, env)
    const right = evaluate(Expression.right, env)
    const operator = Expression.operator

    if (isTruthy(left, operator, right)) {

        return { type: 'boolean', value: true } as Runtime
    } else {
        return { type: 'boolean', value: false } as Runtime
    }
}