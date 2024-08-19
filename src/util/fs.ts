import fs from "fs";
import { SkyScriptErr } from "./error";

export function readFile(input: string){
    if(!fs.existsSync(input))
        new SkyScriptErr("Can't open "+input);
    
    return fs.readFileSync(input).toString();
}