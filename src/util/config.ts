import { Lexer, typeOfToken } from "../syntax/lexer.js";

export default {
    name: "Project",
    packages: [
        "io",
        "math"
    ],
    version: "1.1.0"
}

export async function parseConfig(content: string){
	const lexer = new Lexer();
	const obj = {};
	const tokenized = lexer.Tokenize(content)
	for(let i = 0; i < tokenized.length; i++){
		if(tokenized[i].type === typeOfToken.Identifier && tokenized[i].type !== typeOfToken.EOF){
			const name = tokenized[i].value;
			i++;
			const val = Number.isNaN(parseInt(tokenized[i].value)) || tokenized[i].value.includes(".") ?
				tokenized[i].value : parseInt(tokenized[i].value);
			obj[name] = val;
		}
	}
	return obj;
}