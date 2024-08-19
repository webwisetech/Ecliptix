// deno-lint-ignore-file no-explicit-any prefer-const
import { memory } from "../db/memory.js";
import { SkyScriptErr } from "../util/error.js";
import { translate } from "../util/translate.js";
import { SkyScriptWarn } from "../util/warn.js";
import {
	AssignmentExpression,
	BinaryExpression,
	CallExpression,
	Expression,
	Identifier,
	MemberExpression,
	NumericLiteral,
	ObjectLiteral,
	Program,
	Property,
	Statement,
	VarDeclaration,
	FunctionDeclaration,
StringLiteral,
IfStatement,
EqualityExpression,
ArrayLiteral,
ArrayElement,
} from "./ast.js";

import { Token, typeOfToken } from "./lexer.js";

export default class Parser {
	private tokens: Token[] = [];

	private isNotEOF(): boolean {
		return this.tokens[0].type != typeOfToken.EOF;
	}

	private currentToken() {
		return this.tokens[0] as Token;
	}

	private nextToken() {
		const prev = this.tokens.shift() as Token;
		return prev;
	}

	private ensureToken(type: typeOfToken, err: any) {
		const prev = this.tokens.shift() as Token;
		if (!prev || prev.type != type) {
			new SkyScriptErr("Parser Error:\n"+ err +" " +prev + "\n - Expecting: "+ type);
		}

		return prev;
	}

	public createAST(tokens: Token[]): Program {
		this.tokens = tokens
		const program: Program = {
			kind: "Program",
			body: [],
		};

		
		while (this.isNotEOF()) {
			program.body.push(this.parse_Statement());
		}
		return program;
	}

	
	private parse_Statement(): Statement {
		
		switch (this.currentToken().type) {
			case typeOfToken.Using:
				return this.parseModules();
			case typeOfToken.Slash:
				return this.parseComments();
			case typeOfToken.Set:
			case typeOfToken.Lock:
				return this.parseVariables();
			case typeOfToken.Fun:
				return this.parseFunctions();
			case typeOfToken.If:
				return this.parseIf();
			default:
				return this.parseExpression();
		}
	}

	private addModule(module: string): void{
		if(module === "discord.ss"){
			memory["modules"]!["discord.ss"] = true;
		} else if(module === "colors") {
			memory["modules"]!["colors"] = true;
		}else if(module === "nostrict"){
			memory["modules"]!["nostrict"] = true;
		} else {
			new SkyScriptWarn("No module found with name \""+module+"\"");
		}
	}

	private parseModules(): Statement{
		this.nextToken()
		const a = this.ensureToken(typeOfToken.String, "No module found after the using keyword");
		this.addModule(a.value);
		return { kind: "NumericLiteral", value: 0 } as NumericLiteral;
	}
	private parseComments(): Statement {
		this.nextToken()
		while(this.nextToken().type != typeOfToken.Slash && this.isNotEOF()){
			continue;
		}
		return { kind: 'NumericLiteral', value: 0 } as NumericLiteral;
	}

	private parseIf(): IfStatement {
        this.ensureToken(typeOfToken.If, 'Expected "if" keyword.');
        const conditional = this.parseExpression();
        const consequent: Statement[] = [];
        let right: Expression = {} as Expression;
        let operator: typeOfToken =typeOfToken.BinaryEquals;

        this.ensureToken(typeOfToken.OpenBrace, 'Expected opening brace for consequent block.');

        while (this.currentToken().type !== typeOfToken.EOF && this.currentToken().type !== typeOfToken.CloseBrace) {
            consequent.push(this.parse_Statement());
        }
      
        this.ensureToken(typeOfToken.CloseBrace, 'Expected closing brace for consequent block.');
      
        let alternate: Statement[] | undefined = undefined;
      
        if (this.currentToken().type === typeOfToken.Else) {
          this.nextToken();
      
          if (this.currentToken().type === typeOfToken.If) {
            alternate = [this.parseIf()];
          } else {
            alternate = [];
      
            this.ensureToken(typeOfToken.OpenBrace, 'Expected opening brace for alternate block.');
      
            while (this.currentToken().type !== typeOfToken.EOF && this.currentToken().type !== typeOfToken.CloseBrace) {
              alternate.push(this.parse_Statement())
            }
      
            this.ensureToken(typeOfToken.CloseBrace, 'Expected closing brace for alternate block.');
          }
        }
        return {
          kind: 'IfStatement',
          conditional,
          operator,
          right,
          consequent,
          alternate,
        } as IfStatement
      }

	private parseFunctions(): Statement {
		this.nextToken(); 
		const name = this.ensureToken(
			typeOfToken.Identifier,
			"Expected function name following fn keyword"
		).value;

		const args = this.parse_args();
		const params: string[] = [];
		for (const arg of args) {
			if (arg.kind !== "Identifier") {
				console.log(arg);
				throw "Inside function declaration expected parameters to be of type string.";
			}

			params.push((arg as Identifier).symbol);
		}

		this.ensureToken(
			typeOfToken.OpenBrace,
			"Expected function body following declaration"
		);
		const body: Statement[] = [];

		while (
			this.currentToken().type !== typeOfToken.EOF &&
			this.currentToken().type !== typeOfToken.CloseBrace
		) {
			body.push(this.parse_Statement());
		}

		this.ensureToken(
			typeOfToken.CloseBrace,
			"Closing brace expected inside function declaration"
		);

		const fn = {
			body,
			name,
			parameters: params,
			kind: "FunctionDeclaration",
		} as FunctionDeclaration;

		return fn;
	}

	private parseVariables(): Statement {
		const isConstant = this.nextToken().type == typeOfToken.Lock;
		const identifier = this.ensureToken(
			typeOfToken.Identifier,
			"Expected identifier name following set/lock keywords."
		).value;
		let type = "";

		this.nextToken();
		type = this.ensureToken(typeOfToken.Type, "No type given.").value;

		if (this.currentToken().type == typeOfToken.Semicolon) {
			this.nextToken(); 
			if (isConstant) {
				throw "Must assign a value to constant Expression. No value provided.";
			}

			return {
				kind: "VarDeclaration",
				identifier,
				constant: false,
				type
			} as VarDeclaration;
		}
		this.ensureToken(
			typeOfToken.Equals,
			"Expected equals token following identifier in var declaration."
		);
		const value = this.parseExpression();
			const declaration = {
				kind: "VarDeclaration",
				value,
				identifier, 
				constant: isConstant,
				type
			} as VarDeclaration;
		
		return declaration;
	}

	
	private parseExpression(): Expression {
		return this.parseAssignment();
	}

	private parseAssignment(): Expression {
		const left = this.parseArrays();

		if (this.currentToken().type == typeOfToken.Equals) {
			this.nextToken(); 
			const value = this.parseAssignment();
			return { value, assigne: left, kind: "AssignmentExpression" } as AssignmentExpression;
		}

		return left;
	}

	private parseArrays(): Expression {
		const nex = this.currentToken();
		if(nex.type !== typeOfToken.OpenBracket){
			return this.parseObjects();
		}
		this.nextToken();
		let num = -1;
		const arr = [] as Expression[];
		
		while(this.isNotEOF() && this.currentToken().type != typeOfToken.CloseBracket){
			const key = this.parseExpression();
			num++;			
			if (this.currentToken().type == typeOfToken.Comma) {
				this.nextToken(); 
				arr.push({ value: key, index: num, kind: "Element" } as ArrayElement);
				continue;
			} 
			else if (this.currentToken().type === typeOfToken.CloseBracket) {
				arr.push({ value: key, index: num, kind: "Element" } as ArrayElement);
				continue;
			}

			if (this.currentToken().type != typeOfToken.CloseBracket) {
				this.ensureToken(
					typeOfToken.Comma,
					"Expected comma or closing bracket following element"
				);
			}
		}
		this.ensureToken(
			typeOfToken.CloseBracket,
			"Expected Closing bracket"
		)
		return { kind: "ArrayLiteral", elements: arr as ArrayElement[] } as ArrayLiteral;
	}

	private parseObjects(): Expression {
		
		if (this.currentToken().type !== typeOfToken.OpenBrace) {
			return this.parseAddition();
		}

		this.nextToken(); 
		const properties = new Array<Property>();

		while (this.isNotEOF() && this.currentToken().type != typeOfToken.CloseBrace) {
			const key = this.ensureToken(
				typeOfToken.Identifier,
				"Object literal key expected"
			).value;

			
			if (this.currentToken().type == typeOfToken.Comma) {
				this.nextToken(); 
				properties.push({ key, kind: "Property" } as Property);
				continue;
			} 
			else if (this.currentToken().type == typeOfToken.CloseBrace) {
				properties.push({ key, kind: "Property" });
				continue;
			}

			
			this.ensureToken(
				typeOfToken.Colon,
				"Missing colon following identifier in ObjectExpression"
			);
			const value = this.parseExpression();

			properties.push({ kind: "Property", value, key });
			if (this.currentToken().type != typeOfToken.CloseBrace) {
				this.ensureToken(
					typeOfToken.Comma,
					"Expected comma or closing bracket following property"
				);
			}
		}

		this.ensureToken(typeOfToken.CloseBrace, "Object literal missing closing brace.");
		return { kind: "ObjectLiteral", properties } as ObjectLiteral;
	}

	
	private parseAddition(): Expression {
		let left = this.parseMultiplication();
		while (this.currentToken().value == "+" || this.currentToken().value == "-" && this.isNotEOF()) {
			const operator = this.nextToken().value;

			const right = this.parseMultiplication();
			left = {
				kind: "BinaryExpression",
				left,
				right,
				operator,
			} as BinaryExpression;
		}

		return left;
	}

	private parseMultiplication(): Expression {
		let left = this.parseMemberCalls();
		while ( ["/", "*", "%"].includes(this.currentToken().value) ){
			const operator = this.nextToken().value;
		
			const right = this.parseMemberCalls();
			left = {
				kind: "BinaryExpression",
				left,
				right,
				operator,
			} as BinaryExpression;
		}

		return left;
	}

	private parseMemberCalls(): Expression {
		const member = this.parseMember();
		if (this.currentToken().type == typeOfToken.OpenParen) {
			return this.parseCalls(member);
		}

		return member;
	}

	private parseCalls(caller: Expression): Expression {
		if(caller.kind === "NumericLiteral")
			return this.parsePrimary();
		let call_Expression: Expression = {
			kind: "CallExpression",
			caller,
			args: this.parse_args(),
		} as CallExpression;

		if (this.currentToken().type == typeOfToken.OpenParen) {
			call_Expression = this.parseCalls(call_Expression);
		}

		return call_Expression;
	}

	private parse_args(): Expression[] {
		this.ensureToken(typeOfToken.OpenParen, "Expected open parenthesis");
		const args =
			this.currentToken().type == typeOfToken.CloseParen ? [] : this.parse_arguments_list();

		this.ensureToken(
			typeOfToken.CloseParen,
			"Missing closing parenthesis inside arguments list"
		);
		return args;
	}

	private parse_arguments_list(): Expression[] {
		const args = [this.parseAssignment()];

		while (this.currentToken().type == typeOfToken.Comma && this.nextToken()) {
			args.push(this.parseAssignment());
		}

		return args;
	}

	private parseMember(): Expression {
		let object = this.parsePrimary();

		while (
			this.currentToken().type == typeOfToken.Dot ||
			this.currentToken().type == typeOfToken.OpenBracket
		) {
			const operator = this.nextToken();
			let property: Expression;
			let computed: boolean;

			if (operator.type == typeOfToken.Dot) {
				computed = false;
				property = this.parsePrimary();
				if (property.kind != "Identifier") {
					throw `Cannonot use dot operator without right hand side being a identifier`;
				}
			} else {
				computed = true;
				property = this.parseExpression();
				this.ensureToken(
					typeOfToken.CloseBracket,
					"Missing closing bracket in computed value."
				);
			}

			object = {
				kind: "MemberExpression",
				object,
				property,
				computed,
			} as MemberExpression;
		}

		return object;
	}

	private parsePrimary(): Expression {
		const tk = this.currentToken().type;

		switch (tk) {
			case typeOfToken.Slash:
				return { kind: "NumericLiteral", value: 0 } as NumericLiteral;
			case typeOfToken.Identifier:
				return { kind: "Identifier", symbol: this.nextToken().value } as Identifier;

			case typeOfToken.Number:
				return {
					kind: "NumericLiteral",
					value: parseFloat(this.nextToken().value),
				} as NumericLiteral;
			case typeOfToken.String:
				return { kind: 'StringLiteral', value: this.nextToken().value } as StringLiteral;
			case typeOfToken.OpenParen: {
				this.nextToken(); 
				const left = this.parseExpression();
				let right: Expression;
				let value: Expression;
				let operator: typeOfToken;
				if (this.currentToken().type == typeOfToken.DoubleEquals || this.currentToken().type == typeOfToken.NotEquals) {
                    operator = this.nextToken().type
                    right = this.parseExpression()
                    value = { kind: 'EqualityExpression', left, operator, right } as EqualityExpression
                } else {
                    value = left
                }
				this.ensureToken(
					typeOfToken.CloseParen,
					"Unexpected token found inside parenthesised Expression."
				); 
				return value;
			}

			default:
				throw new SkyScriptErr("Unknown Token found while parsing." + JSON.stringify(this.currentToken()));
		}
	}
}