

function mergeNestedObjects(data) {
    let mergedObject = {};
    for (const key in data) {
        mergedObject = Object.assign(mergedObject, data[key]);
    }
    return mergedObject;
}

export default {
    mergeNestedObjects,
};