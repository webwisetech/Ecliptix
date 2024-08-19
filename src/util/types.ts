import { Library } from "../lib";
import { StringValue, NullValue, NumberValue, ArrayValue, Runtime, ObjectValue } from "../runtime/val";

export interface LibraryOptions {
    makeStr: (str: string) => StringValue;
    makeNull: () => NullValue;
    makeNum: (num: number) => NumberValue;
    makeArr: (arr: any[]) => ArrayValue;
    makeObj: (obj: Record<string, Runtime>) => ObjectValue;
    library: Library;
  }