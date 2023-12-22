import {isArray, isNil, isNumber, isObject, isString} from "lodash";

const someFieldIsDefined = o => Object.values(o).some(item => item !== undefined);

export const showByType = (type: string, data: unknown) => {
    if (isNil(data)) return false;
    switch(type.toLowerCase()) {
        case 'number': return isNumber(data);
        case 'first:number': return isNumber(data[0]);
        case 'string':case 'uri':case 'date': return isString(data);
        case 'translation':case 'object': return isObject(data) && someFieldIsDefined(data);
        case 'array':case 'links': return isArray(data) && data.length > 0;
        case 'objects': {
            return isArray(data) && data.every(item => isObject(item)) && data.some(item => someFieldIsDefined(item));
        }
        default:
            console.warn("Unknown type " + type + " for value " + data);
            return false;
    }
};
