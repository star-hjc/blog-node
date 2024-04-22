const dayjs = require('dayjs')

const isDate = (date) => {
    /** 验证 【(年-月-日) | (年/月/日)】格式 */
    const isDate = /^\d{1,4}(-|\/)(\d|[0][1-9]|10|11|12)(-|\/)([1-9]|[0-2][1-9]|30|31)$/
    /** 验证 【(年-月-日 时:分:秒) | (年/月/日 时:分:秒) 】格式 */
    const isDateTime = /^\d{1,4}(-|\/)(\d|[0][1-9]|10|11|12)(-|\/)([1-9]|[0-2][1-9]|30|31) (00|\d{1}|1\d|2[0-3]):(00|[0-5]\d):(00|[0-5]\d)$/
    return [isDate.test(date), isDateTime.test(date)].includes(true)
}

/**
 * 
 * @param {String} date 
 * @returns 
 */
const dateToArray = (date) => {
    if (!isDate) return ['0000', '00', '00']
    return dayjs(date).format('YYYY/MM/DD').split('/')
}

module.exports = { isDate, dateToArray }