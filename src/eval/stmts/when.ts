import { evaluate } from "../../runtime/index.js";
import Environment from "../../runtime/env.js";
import { Runtime, BooleanValue, makeNull } from "../../runtime/val.js";
import { IfStatement, WhenDeclaration } from "../../syntax/ast.js";
import { memory } from "../../db/memory.js";
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

export function WhenStmt(statement: WhenDeclaration, env: Environment): Runtime {
	memory.eventEmitter.on("varUpdate", (environ) => {
		env = environ;
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
        	}
	    }
	})
	return makeNull();
}