import { evaluate } from "../../runtime/index.js";
import Environment from "../../runtime/env.js";
import { Runtime, BooleanValue, makeNull } from "../../runtime/val.js";
import { IfStatement } from "../../syntax/ast.js";
function isTruthy(conditional: Runtime) {
    if (conditional.type == 'boolean') {
        const bool = (conditional as BooleanValue).value
        if (bool) return true
        else return false
    }

    if (conditional) {
        return true
    } else {
        return false
    }
}

export function IfStmt(statement: IfStatement, env: Environment): Runtime {
    const conditional: Runtime = evaluate(statement.conditional, env)

    if (conditional.type == 'boolean') {
        const result = (conditional as BooleanValue)
        const runtimeVal = result as Runtime
        if (isTruthy(runtimeVal)) {
            if (Array.isArray(statement.consequent)) {
                
                for (const consequentStatement of statement.consequent) {
                  evaluate(consequentStatement, env);
                }
            } else {
                
                return evaluate(statement.consequent, env);
            }
        } else {
            if (statement.alternate) {
                if (Array.isArray(statement.alternate)) {
                    
                    for (const alternateStatement of statement.alternate) {
                      evaluate(alternateStatement, env);
                    }
                } else {
                    
                    return evaluate(statement.alternate, env);
                }
            }
        }
    } else {
        if (isTruthy(conditional)) {
            if (Array.isArray(statement.consequent)) {
              
              for (const consequentStatement of statement.consequent) {
                evaluate(consequentStatement, env);
              }
            } else {
              
              return evaluate(statement.consequent, env);
            }
        } else {
            if (statement.alternate) {
                if (Array.isArray(statement.alternate)) {
                    
                    for (const alternateStatement of statement.alternate) {
                      evaluate(alternateStatement, env);
                    }
                } else {
                    
                    return evaluate(statement.alternate, env);
                }
            }
        }
    }
      
    return makeNull();
}