const flattenObject = (obj) => {
    let flattenKeys = {}
    for (let i in obj) {
        if (!obj.hasOwnProperty(i)) continue
        if ((typeof obj[i]) == 'object') {
            let flatObject = flattenObject(obj[i])
            for (let j in flatObject) {
                if (!flatObject.hasOwnProperty(j)) continue
                flattenKeys[`${i}.${j}`] = flatObject[j]
            }
        } else {
            flattenKeys[i] = obj[i]
        }
    }
    return flattenKeys
}

module.exports =  flattenObject