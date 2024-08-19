import Environment from "./env.js";
import { Statement } from "../syntax/ast.js";
export type ValueType =
	| "null"
	| "number"
	| "boolean"
	| "string"
	| "array"
	| "object"
	| "native-fn"
	| "function"
	| "while"
	| "component"
	| "break";

// deno-lint-ignore no-empty-interface
export interface RuntimeValue {}

export interface Runtime extends RuntimeValue {
	type: ValueType;
}

export interface NullValue extends Runtime {
	type: "null";
	value: null;
}

export interface BooleanValue extends Runtime {
	type: "boolean";
	value: boolean;
}

export interface NumberValue extends Runtime {
	type: "number";
	value: number;
}

export interface ObjectValue extends Runtime {
	type: "object";
	properties: Map<string, Runtime>;
}

export interface StringValue extends Runtime {
    type: 'string'
    value: string
}

export type FunctionCall = (args: Runtime[], env: Environment) => Runtime | StringValue;

export interface NativeFnValue extends Runtime {
	type: "native-fn";
	call: FunctionCall;
}

export interface FunctionValue extends Runtime {
	type: "function";
	name: string;
	parameters: string[];
	declarationEnv: Environment;
	body: Statement[];
}

export interface ArrayValue extends Runtime {
	type: "array";
	elements: Runtime[];
}

// helper functions

export function makeNativeFn(call: FunctionCall) {
	return { type: "native-fn", call } as NativeFnValue;
}

export function makeStr(str: string){
	return { type: "string", value: str } as StringValue;
}

export function makeNum(n = 0) {
	return { type: "number", value: n } as NumberValue;
}

export function makeBool(b = true) {
	return { type: "boolean", value: b } as BooleanValue;
}

export function makeNull() {
	return { type: "null", value: null } as NullValue;
}

export function makeObj(obj: Record<string, Runtime>) {
	const map = new Map<string, Runtime>();
	Object.keys(obj).forEach(key => {
	  map.set(key, obj[key]);
	});
	return { type: "object", properties: map } as ObjectValue;
}

export function makeArr(arr: any[]){
	return { type: "array", elements: arr } as ArrayValue;
}