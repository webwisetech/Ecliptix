import Environment from "../runtime/env.js";
import path from 'path';
import { 
	FunctionCall,
	Runtime, 
	RuntimeValue, 
	makeNull, 
	makeNum, 
	makeStr,
  makeBool,
  makeArr,
  makeObj,
  makeNativeFn,
  StringValue,
  NullValue,
  NumberValue,
  ArrayValue,
  ObjectValue
} from "../runtime/val.js";
import { SkyScriptWarn } from "../util/warn.js";

import colors from './colors.js';
import math from './math.js';
import time from './time.js';
import io from './io.js';
import process from "./process.js";
import { runModule } from "../util/modules.js";
type FunctionCallback = (args: Runtime[], env: Environment) => RuntimeValue;

export class Library {
        env: Environment;
        packs: string[];
    
    constructor(
        packages: string[]
    ){
        this.env = new Environment();

        this.env.declareVar("true", makeBool(true), true);
      	this.env.declareVar("false", makeBool(false), true);
      	this.env.declareVar("null", makeNull(), true);

        this.env.declareVar("webwise", makeObj({
          owners: makeArr(["Amine M.", "Julian D.", "Dean B."]),
          description: makeStr("Webwise is a start-up organisation that develops software, and teaches programming languages."),
          website: makeStr("https://webwisetech.org")
        }), true);

        this.packs = packages;
    }

    public async registerPacks(){
      const opts = this;

      const options = {
        makeStr,
        makeNull,
        makeNum,
        makeArr,
        makeObj,

        library: opts
      };
      for(const pack of opts.packs){
        switch(pack){
          case "io":
            io(options);
          break;
          case "process":
            process(options);
          break;
          case "math":
            math(options);
          break;
          case "colors":
            colors(options);
          break;
          case "time":
            time(options)
          break;
          default:
            await runModule("./ss_mods", pack+".js", options);
        }
      }
    }

    public createFunction(this: Library, name: string, callBack: FunctionCallback){
        if(this.env.devLookup(name) === undefined){
          this.env.declareVar(
		          name, 
        		  makeNativeFn(callBack as FunctionCall), 
        		  true
      	  )
        } else
            new SkyScriptWarn(`Can't create custom function with name '${name}'` +` cause it already exists`);
        return this.env.lookupVar(name);
    }
    public createVariable(this: Library, name: string, value: any, constant: boolean){
        this.env.devLookup(name) === undefined 
          ? this.env.declareVar(name, value, constant)
          : new SkyScriptWarn(
		  `Can't create custom variable with name '${name}'`
		  	+` cause it already exists`);
    }
}
