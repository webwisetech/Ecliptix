import { ValueType } from "../runtime/val.js";
import { typeOfToken } from "./lexer.js";

export type NodeType =
	| "Program"
	| "VarDeclaration"
	| "Property"
	| "Element"
	| "IfStatement"
	| "WhileStatement"
	| "Identifier"
	| "FunctionDeclaration"
	| "EqualityExpression"
	| "BinaryExpression"
	| "AssignmentExpression"
	| "MemberExpression"
	| "CallExpression"
	| "ObjectLiteral"
	| "ArrayLiteral"
	| "NumericLiteral"
	| "StringLiteral"
	| "WhenDeclaration";

export interface Statement {
	kind: NodeType;
}

export interface Program extends Statement {
	kind: "Program";
	body: Statement[];
}

export interface VarDeclaration extends Statement {
	kind: "VarDeclaration";
	constant: boolean;
	identifier: string;
	value?: Expression;
	type: ValueType;
}

export interface FunctionDeclaration extends Statement {
	kind: "FunctionDeclaration";
	parameters: string[];
	name: string;
	body: Statement[];
}

export interface WhenDeclaration extends Statement {
	kind: "WhenDeclaration";
	conditional: Expression;
    operator: typeOfToken;
    consequent: Statement[];
}

export interface IfStatement extends Statement {
    kind: 'IfStatement';
    conditional: Expression;
    operator: typeOfToken;
    consequent: Statement[];
    alternate?: Statement[];
}

export interface WhileStatement extends Statement {
	kind: "WhileStatement";
	conditional: Expression;
    operator: typeOfToken;
	body: Statement[];
}

export interface Expression extends Statement {}

export interface AssignmentExpression extends Expression {
	kind: "AssignmentExpression";
	assigne: Expression;
	value: Expression;
}

export interface BinaryExpression extends Expression {
	kind: "BinaryExpression";
	left: Expression;
	right: Expression;
	operator: string;
}

export interface CallExpression extends Expression {
	kind: "CallExpression";
	args: Expression[];
	caller: Expression;
}

export interface MemberExpression extends Expression {
	kind: "MemberExpression";
	object: Expression;
	property: Expression;
	computed: boolean;
}

export interface Identifier extends Expression {
	kind: "Identifier";
	symbol: string;
}

export interface NumericLiteral extends Expression {
	kind: "NumericLiteral";
	value: number;
}

export interface Property extends Expression {
	kind: "Property";
	key: string;
	value?: Expression;
}

export interface ObjectLiteral extends Expression {
	kind: "ObjectLiteral";
	properties: Property[];
}

export interface ArrayLiteral extends Expression {
	kind: "ArrayLiteral";
	elements: ArrayElement[];
}

export interface ArrayElement extends Expression {
	kind: "Element";
	index: number;
	value: Expression;
}

export interface StringLiteral extends Expression {
    kind: 'StringLiteral';
    value: string;
}

export interface EqualityExpression extends Expression {
    kind: 'EqualityExpression';
    left: Expression;
    right: Expression;
    operator: typeOfToken;
}