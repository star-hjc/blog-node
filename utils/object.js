/**
 *  分割对象
 * @param {Object} data 分割对象
 * @param {Array} keys 分割属性(key)
 * @returns [剩余的对象,分割的对象]
 */
const objectSplit = (data, keys) => {
    if (data?.constructor !== Object || keys?.constructor !== Array) {
        console.error('类型错误...')
        return
    }
    /** 分割属性为空 */
    if (!keys.length) {
        return [data, {}]
    }
    const newDate = { ...data }
    const splitIsObj = {}
    for (const key of keys) {
        if (newDate[key] === void 0) continue
        splitIsObj[key] = newDate[key]
        delete newDate[key]
    }
    return [newDate, splitIsObj]
}

module.exports = { objectSplit }