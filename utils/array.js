/**
 * 
 * @param {String} flieName 文件名称
 * @param {String} defaultName 默认文件名称
 * @param {Number} defaultSuffixLength 默认文件后缀最大长度
 */
const getFlieSuffix = (flieName, defaultName = 'txt', defaultSuffixLength = 4) => {
    const suffix = flieName.split('.')?.at(-1)
    if (suffix.length > defaultSuffixLength || !suffix) return defaultName
    return suffix
}


/**
 *
 * @param {Array} arrAll 数组
 * @param {Array} arr 被包含的数组
 * @param {Boolean} strict 开启严格模式
 * @returns arrAll包含arr[Booler]
 */
const arrIncludesArr = (arrAll, arr, strict = false) => {
    for (const item of arr) {
        if (!strict && !arrAll.join().includes(item)) return false
        if (!arrAll.includes(item)) return false
    }
    return true
}






module.exports = { arrIncludesArr,getFlieSuffix }