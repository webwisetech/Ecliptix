import Environment from "../../runtime/env.js"
import { evaluate } from "../../runtime/index.js"
import { Runtime, ObjectValue } from "../../runtime/val.js"
import { MemberExpression, Identifier } from "../../syntax/ast.js"
import { EcliptixErr } from "../../util/error.js"

export function MemberExpr(Expression: MemberExpression, env: Environment): Runtime {
    const object = evaluate(Expression.object, env)
    const property = (Expression.property as Identifier).symbol
  
    if (object.type === 'object') {
        const objValue = object as ObjectValue
        const propertyValue = objValue.properties.get(property)
        
        if (propertyValue !== undefined) {
            return propertyValue
        } else {
            throw `Property "${property}" does not exist on object.`;
      }
    } else {
        throw new EcliptixErr('Cannot access property on non-object value.');
    }
}