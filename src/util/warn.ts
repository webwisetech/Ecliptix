import colors from 'colors';

export class EcliptixWarn {
	constructor(message: string){
		console.log(colors.cyan("Warning: ")+colors.yellow(message));
	}
}