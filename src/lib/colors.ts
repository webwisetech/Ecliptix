import { StringValue } from "../runtime/val.js";
import colors from 'colors';

export default ({ library, makeStr: makeString }) => {
	library.createFunction("blue", (args, _scope) => {
		if((args[0] as StringValue).value !== null || (args[0] as StringValue).value !== undefined){
			const b = colors.blue((args[0] as StringValue).value);
			return { type: "string", value: b } as StringValue;
		}
		const a = colors.blue((args[0] as unknown) as string)
		return makeString(a);
	})

	library.createFunction("cyan", (args, _scope) => {
		if((args[0] as StringValue).value !== null || (args[0] as StringValue).value !== undefined){
			const b = colors.cyan((args[0] as StringValue).value);
			return { type: "string", value: b } as StringValue;
		}
		const a = colors.cyan((args[0] as unknown) as string)
		return makeString(a);
	});

	library.createFunction("green", (args, _scope) => {
		if((args[0] as StringValue).value !== null || (args[0] as StringValue).value !== undefined){
			const b = colors.green((args[0] as StringValue).value);
			return { type: "string", value: b } as StringValue;
		}
		const a = colors.green((args[0] as unknown) as string)
		return { type: "string", value: a } as StringValue;
	})

	library.createFunction("magenta", (args, _scope) => {
		if((args[0] as StringValue).value !== null || (args[0] as StringValue).value !== undefined){
			const b = colors.magenta((args[0] as StringValue).value);
			return { type: "string", value: b } as StringValue;
		}
		const a = colors.magenta((args[0] as unknown) as string)
		return { type: "string", value: a } as StringValue;
	})

	library.createFunction("red", (args, _scope) => {
		if((args[0] as StringValue).value !== null || (args[0] as StringValue).value !== undefined){
			const b = colors.red((args[0] as StringValue).value);
			return { type: "string", value: b } as StringValue;
		}
		const a = colors.red((args[0] as unknown) as string)
		return { type: "string", value: a } as StringValue;
	})

	library.createFunction("yellow", (args, _scope) => {
		if((args[0] as StringValue).value !== null || (args[0] as StringValue).value !== undefined){
			const b = colors.yellow((args[0] as StringValue).value);
			return { type: "string", value: b } as StringValue;
		}
		const a = colors.yellow((args[0] as unknown) as string)
		return { type: "string", value: a } as StringValue;
	})
}