import Environment from "../runtime/env.js";
import { makeObj, NumberValue, Runtime, StringValue } from "../runtime/val.js";
import { LibraryOptions } from "../util/types.js";

export default function({ library, makeNum: makeNumber, makeNull }: LibraryOptions) {
	const math = {
		add: library.createFunction("add", function(args: Runtime[], _scope: Environment){
			if(args[0] === undefined) throw "The add() Function requires input"
			let val = 0;
			for(let i = 0; i < args.length; i++){
				val += (args[i] as NumberValue).value;
			}
			 if(Number.isNaN(val)){
				return makeNull();
			 } else {
				return makeNumber(val);
			 }
		}),
		round: library.createFunction("round", function(args, _scope){
			if(args[0] == undefined) throw "The round() Function requires input"
			const val = Math.round((args[0] as NumberValue).value)
			 if(Number.isNaN(val)){
				return makeNull();
			 } else {
				return makeNumber(val);
			 }
		}),
		sub: library.createFunction("sub", function(args: Runtime[], _scope: Environment){
			if(args[0] === undefined) throw "The sub() Function requires input"
			let val = 0;
			for(let i = 0; i < args.length; i++){
				val -= (args[i] as NumberValue).value;
			}
			 if(Number.isNaN(val)){
				return makeNull();
			 } else {
				return makeNumber(val);
			 }
		})
	}
	library.createVariable("math", makeObj(math), true)
};