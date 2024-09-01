// deno-lint-ignore-file no-explicit-any prefer-const
import { memory } from "../db/memory.js";
import { EcliptixErr } from "../util/error.js";
import { translate } from "../util/translate.js";
import colors from 'colors';
import { EcliptixWarn } from "../util/warn.js";
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
WhenDeclaration,
WhileStatement,
DSNotation,
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
			new EcliptixErr("Parser Error:\n"+ err +" " +JSON.stringify(prev) + "\n - Expecting: "+ type);
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
			case typeOfToken.Slash:
				return this.parseComments();
			case typeOfToken.Set:
			case typeOfToken.Lock:
				return this.parseVariables();
			case typeOfToken.Fun:
				return this.parseFunctions();
			case typeOfToken.If:
				return this.parseIf();
			case typeOfToken.When:
				return this.parseWhen();
			case typeOfToken.While:
				return this.parseWhile();
			case typeOfToken.DollarSign:
				return this.parseDSNotation();
			default:
				return this.parseExpression();
		}
	}

	private parseWhen(): Statement {
		const token = this.ensureToken(typeOfToken.When, 'Expected "when" keyword.');
        const conditional = this.parseExpression();
        const consequent: Statement[] = [];
        let right: Expression = {} as Expression;
        let operator: typeOfToken =typeOfToken.BinaryEquals;

        this.ensureToken(typeOfToken.OpenBrace, 'Expected opening brace for consequent block.');

        while (this.currentToken().type !== typeOfToken.EOF && this.currentToken().type !== typeOfToken.CloseBrace) {
            consequent.push(this.parse_Statement());
        }
      
        this.ensureToken(typeOfToken.CloseBrace, 'Expected closing brace for consequent block.');

        return {
          kind: 'WhenDeclaration',
          conditional,
          operator,
          right,
          consequent,
		  line: token.line!
        } as WhenDeclaration;
	}

	private parseWhile(): Statement {
		const token = this.ensureToken(typeOfToken.While, 'Expected "while" keyword.');
        const conditional = this.parseExpression();
        const consequent: Statement[] = [];
        let right: Expression = {} as Expression;
        let operator: typeOfToken =typeOfToken.BinaryEquals;

        this.ensureToken(typeOfToken.OpenBrace, 'Expected opening brace for consequent block.');

        while (this.currentToken().type !== typeOfToken.EOF && this.currentToken().type !== typeOfToken.CloseBrace) {
            consequent.push(this.parse_Statement());
        }
      
        this.ensureToken(typeOfToken.CloseBrace, 'Expected closing brace for consequent block.');

        return {
          kind: 'WhileStatement',
          conditional,
          operator,
          right,
          body: consequent,
		  line: token.line!
        } as WhileStatement;
	}

	private parseComments(): Statement {
		this.nextToken()
		while(this.nextToken().type != typeOfToken.Slash && this.isNotEOF()){
			continue;
		}
		return this.parsePrimary();
	}

	private parseIf(): IfStatement {
        const token = this.ensureToken(typeOfToken.If, 'Expected "if" keyword.');
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
		  line: token.line!
        } as IfStatement
      }

	private parseFunctions(): Statement {
		const token = this.nextToken(); 
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
			line: token.line!
		} as FunctionDeclaration;

		return fn;
	}

	private parseVariables(): Statement {
		const token = this.nextToken()
		const isConstant = token.type == typeOfToken.Lock;
		const identifier = this.ensureToken(
			typeOfToken.Identifier,
			"Expected identifier name following set/lock keywords."
		).value;
		let type = "";

		const thing = this.nextToken();
		
		type = this.ensureToken(typeOfToken.Identifier, "No type given.").value;

		if (this.currentToken().type == typeOfToken.Semicolon) {
			this.nextToken(); 
			if (isConstant) {
				throw "Must assign a value to constant Expression. No value provided.";
			}

			return {
				kind: "VarDeclaration",
				identifier,
				constant: false,
				type,
				line: token.line!
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
				type,
				line: token.line!
			} as VarDeclaration;
		
		return declaration;
	}

	
	private parseExpression(): Expression {
		return this.parseAssignment();
	}

	private parseAssignment(): Expression {
		const left = this.parseArrays();

		if (this.currentToken().type == typeOfToken.Equals) {
			const token = this.nextToken(); 
			const value = this.parseAssignment();
			return { value, assigne: left, kind: "AssignmentExpression", line: token.line! } as AssignmentExpression;
		}

		return left;
	}

	private parseArrays(): Expression {
		const nex = this.currentToken();
		if(nex.type !== typeOfToken.OpenBracket){
			return this.parseDSNotation();
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
		return { kind: "ArrayLiteral", elements: arr as ArrayElement[], line: nex.line! } as ArrayLiteral;
	}

	private parseDSNotation(): Statement {
		const t = this.nextToken();
		if(t.type !== typeOfToken.DollarSign){
			this.tokens.unshift(t);
			return this.parseObjects();
		}
		const token = this.ensureToken(typeOfToken.String, "Expected a string after the $ Notation");

		return {
			kind: "DollarSignNotation",
			line: t.line!,
			shellCmd: { kind: "StringLiteral", value: token.value } as StringLiteral
		} as DSNotation;
	}

	private parseObjects(): Expression {
		
		if (this.currentToken().type !== typeOfToken.OpenBrace) {
			return this.parseAddition();
		}

		const token = this.nextToken(); 
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
		return { kind: "ObjectLiteral", properties, line: token.line! } as ObjectLiteral;
	}

	
	private parseAddition(): Expression {
		let left = this.parseMultiplication();
		while (this.currentToken().value == "+" || this.currentToken().value == "-" && this.isNotEOF()) {
			const token = this.nextToken();
			const operator = token.value;

			const right = this.parseMultiplication();
			left = {
				kind: "BinaryExpression",
				left,
				right,
				operator,
			  	line: token.line!
			} as BinaryExpression;
		}

		return left;
	}

	private parseMultiplication(): Expression {
		let left = this.parseMemberCalls();
		while ( ["/", "*", "%"].includes(this.currentToken().value) ){
			const token = this.nextToken();
			const operator = token.value;
		
			const right = this.parseMemberCalls();
			left = {
				kind: "BinaryExpression",
				left,
				right,
				operator,
				line: token.line!
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
				throw new EcliptixErr(`Unknown Token found while parsing.\n- Line: ${colors.yellow(`${this.currentToken().line!}`)}\n- Character: ${colors.green(`'${this.currentToken().value}'`)}`);
		}
	}
}