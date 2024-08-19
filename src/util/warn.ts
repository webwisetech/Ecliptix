import colors from 'colors';

export class SkyScriptWarn {
	constructor(message: string){
		console.log(colors.cyan("Warning: ")+colors.yellow(message));
	}
}