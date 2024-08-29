// type translation
export function translate(text:string){
	if(text === "number")
		return "NumericLiteral"
	if(text === "string")
		return "StringLiteral"
	if(text === "object")
		return "ObjectLiteral"
	if(text === "array")
		return "ArrayLiteral"
	if(text === "NumericLiteral")
		return 'number'
	if(text === "StringLiteral")
		return 'string'
	if(text === "ObjectLiteral")
		return 'object'
	if(text === "ArrayLiteral")
		return 'array'

	return text;
}