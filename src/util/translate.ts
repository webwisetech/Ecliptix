// type translation
export function translate(text:string){
	if(text === "number")
		return "NumericLiteral"
	if(text === "string")
		return "StringLiteral"
	if(text === "NumericLiteral")
		return 'number'
	if(text === "StringLiteral")
		return 'string'
	return text;
}