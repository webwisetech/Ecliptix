import { evaluate } from "../../runtime/index.js";
import Environment from "../../runtime/env.js";
import { Runtime, BooleanValue, makeNull } from "../../runtime/val.js";
import { IfStatement, WhileStatement } from "../../syntax/ast.js";
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

export function WhileStmt(statement: WhileStatement, envy: Environment): Runtime {
	let truu = true;
	while(truu){
	let env = new Environment(envy);
	const conditional: Runtime = evaluate(statement.conditional, env)
    if (conditional.type == 'boolean') {
        const result = (conditional as BooleanValue)
        const runtimeVal = result as Runtime
        if (isTruthy(runtimeVal)) {
            if (Array.isArray(statement.body)) {
                
                for (const bodyStatement of statement.body) {
                  evaluate(bodyStatement, env);
                }
            } else {
                
                return evaluate(statement.body, env);
            }
        } else {
			truu = false;
		}
    } else {
        if (isTruthy(conditional)) {
            if (Array.isArray(statement.body)) {
              
              for (const bodyStatement of statement.body) {
                evaluate(bodyStatement, env);
              }
            } else {
              
              return evaluate(statement.body, env);
            }
        }else {
			truu = false;
		}
    }}
      
    return makeNull();
}