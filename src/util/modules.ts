import fs from 'fs';
import { EcliptixErr } from "./error";
import yaml from "yaml";

/*

export async function runModule(folderPath = "mods", fileName = "ecliptix.js", context = {}) {
	const fullPath = path.resolve(folderPath+"/"+fileName);
  
	try {
	  const module = await import("file://"+fullPath);
	  if (typeof module.default === 'function'){
		module.default(context);
	  } else {
		console.error(`The file ${fileName} does not export a function.`);
	  }
	} catch (error) {
	  console.error(`Error loading or executing ${fileName}: ${error}`);
	}
  }*/

export async function runModule(modName: string){
	const exists = fs.existsSync('./ecmods');
	if(!exists) return new EcliptixErr("Mods folder cannot be found, aborting execution.");

	const modExists = fs.existsSync(`./ecmods/${modName}/`);
	if(!modExists) return new EcliptixErr(`Mod '${modName}' cannot be found, aborting execution.`)
		
	const packConfig = yaml.parse(fs.readFileSync(`./ecmods/${modExists}/pack.ecmod`).toString());

	if(!packConfig.mainFile) return new EcliptixErr(`No main file found for ${modName}, aborting execution.`);	
}