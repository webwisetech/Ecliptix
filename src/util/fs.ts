import fs from "fs";
import { EcliptixErr } from "./error";

export function readFile(input: string){
    if(!fs.existsSync(input))
        new EcliptixErr("Can't open "+input);
	const val = fs.readFileSync(input).toString();
    
    if(val){
		return val
	} else {
		new EcliptixErr("The file '"+input+"' is empty.")
		return "";
	} 
}