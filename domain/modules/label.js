const { blogDB } = require('./')

/**
 * 添加标签
 * @param {[{name:String}]} array 标签数组
 */
const addLabels = async (options) => {
    const labels = await blogDB.label.findMany({
        where: {
            name: {
                in: options.map(v => v.name)
            }
        }
    })
    const data = options.filter(v => !labels.map(a => a.name).includes(v.name))
    if (!data.length) return { count: 0, exist: labels.length, all: labels.length }
    const { count } = await blogDB.label.createMany({
        data: data,
    })
    return { count, exist: labels.length, all: count + labels.length }
}

/**
 * 
 * @param { { value:string, pageNum: Number, pageSize: Number } } options 参数
 * @param options.value      搜索关键字(name:标题)
 * @param options.pageNum    页码
 * @param options.pageSize   每页多少条
 * @returns
 */
const searchLabels = async (options = {}) => {
    const { value } = options
    const where = {
        AND: [
            {
                name: {
                    contains: value
                }
            }
        ]
    }
    return await getLabelList(options, { where })
}

/**
 * 
 * @param { { value:string, pageNum: Number, pageSize: Number } } options 参数
 * @param options.pageNum    页码
 * @param options.pageSize   每页多少条
 * @returns
 */
const getLabelList = async (options = {}, findManyOptions = {}) => {
    const pageNum = options.pageNum || 1
    const pageSize = options.pageSize || 10
    return await blogDB.label.findMany({
        skip: (pageNum - 1) * pageSize,
        take: pageSize,
        select: {
            id: true,
            name: true
        },
        ...findManyOptions
    })
}

module.exports = { addLabels, getLabelList, searchLabels }