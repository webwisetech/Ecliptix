import { RuntimeValue } from "../runtime/val.js";

export const memory: Record<string, any> = {};

class Memory {
	private dataStorage: Map<string, RuntimeValue>;
	private modules: Set<string>;
	constructor(){
		this.dataStorage = new Map();
		this.modules = new Set();
	}

	addModule(module: string){
		this.modules.add(module);
	}
	removeModule(module:string){
		this.modules.delete(module);
	}

	setDatabaseEntry(entry: string, value: RuntimeValue){
		this.dataStorage.set(entry, value);
	}
	deleteDatabaseEntry(entry: string){
		this.dataStorage.delete(entry);
	}
	getDatabaseEntries(){
		return this.dataStorage;
	}
}