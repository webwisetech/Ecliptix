import { evaluate } from "../../runtime/index.js";
import Environment from "../../runtime/env.js";
import { Runtime, makeNull } from "../../runtime/val.js";
import { DSNotation, Program } from "../../syntax/ast.js";
import { execSync } from "node:child_process";
import { ShellCommand } from '../../runtime/val';

export function ShellCMD(thing: DSNotation, env: Environment): Runtime {
	const string = execSync(`${thing.shellCmd.value}`, { encoding: "utf-8" });
	return {
		type: "shell",
		value: string
	} as ShellCommand
}