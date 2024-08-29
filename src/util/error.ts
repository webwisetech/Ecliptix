import colors from 'colors';

export class EcliptixErr {
	constructor(message: string | undefined){
		if(message === undefined){
			console.log(colors.cyan("An unknown error happened."))
			process.exit(1);
		}
		console.log(colors.cyan("Error: ")+colors.red(message));
		process.exit(1);
	}
}