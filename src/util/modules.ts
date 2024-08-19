import path from "path";

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
  }