import { NumberValue } from "./val.js";
import {
ArrayLiteral,
	AssignmentExpression,
	BinaryExpression,
	CallExpression,
	EqualityExpression,
	FunctionDeclaration,
	Identifier,
	IfStatement,
	MemberExpression,
	NumericLiteral,
	ObjectLiteral,
	Program,
	Statement,
	StringLiteral,
	VarDeclaration,
} from "../syntax/ast.js";
import Environment from "./env.js";
import * as evalue from "../eval/index.js";
import { SkyScriptErr } from "../util/error.js";

export function evaluate(astNode: Statement, env: Environment): any {
	switch (astNode.kind) {
		case "NumericLiteral":
			return {
				value: (astNode as NumericLiteral).value,
				type: "number",
			} as NumberValue;
		case "ArrayLiteral":
			return evalue.Arrays(astNode as ArrayLiteral, env)
		case 'StringLiteral':
			return (astNode as StringLiteral).value;
		case "Identifier":
			return evalue.EIdentifier(astNode as Identifier, env);
		case "ObjectLiteral":
			return evalue.ObjectExpression(astNode as ObjectLiteral, env);
		case "MemberExpression":
			return evalue.MemberExpr(astNode as MemberExpression, env);
		case "CallExpression":
			return evalue.CallExpr(astNode as CallExpression, env);
		case "AssignmentExpression":
			return evalue.Assignment(astNode as AssignmentExpression, env);
		case "BinaryExpression":
			return evalue.BinaryExpression(astNode as BinaryExpression, env);
		case 'EqualityExpression':
			return evalue.EqualityExpr(astNode as EqualityExpression, env);
		case 'IfStatement':
			return evalue.IfStmt(astNode as IfStatement, env)	
		case "Program":
			return evalue.SProgram(astNode as Program, env);
		
		case "VarDeclaration":
			return evalue.VariableDeclaration(astNode as VarDeclaration, env);
		case "FunctionDeclaration":
			return evalue.FunDeclaration(astNode as FunctionDeclaration, env);
		
		default:
            new SkyScriptErr("This AST Node has not yet been setup for interpretation.\n"+astNode);
	}
}