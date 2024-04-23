const { blogDB } = require('./')
const { objectSplit } = require('../../utils/object')
/**
 * 
 * @param { { email: String, password: String } } options 
 * @returns 
 */
const createUser = async (options = {}) => {
    const [, data] = objectSplit(options, ['email', 'password'])
    const { _max } = await blogDB.user.aggregate({ _max: { code: true } })
    const code = _max.code ? _max.code + 1n : void 0
    return await blogDB.user.create({
        data: { code, ...data }
    })
}

/**
 * 
 * @param { { id: String, code: Number, name: String, avatar: String, email: String, QQ: String, WeChat: String } } options 
 * @returns 
 */
const editUser = async (options = {}) => {
    const { id, code } = options
    const [, data] = objectSplit(options, ['name', 'avatar', 'email', 'QQ', 'WeChat'])
    for (const [key, value] of Object.entries({ id, code })) {
        if (value === void 0) continue
        return await blogDB.user.update({
            where: { [key]: value },
            data
        })
    }
}

/**
 * 
 * @param {String | Number} user email | code | phone
 * @returns 
 */
const getUserByInfo = async (user) => {
    console.log(user);
    return await blogDB.user.findMany({
        where: {
            OR: [{ email: user }, { phone: user }, { code: isNaN(Number(user)) ? 0 : Number(user) }]
        }
    })
    return []
}

/**
 * 
 * @param { { id: String, code: Number } } options 
 * @returns 
 */
const searchUser = async (options = {}) => {
    const { id, code } = options
    for (const [key, value] of Object.entries({ id, code })) {
        if (value === void 0) continue
        return await blogDB.user.findUnique({
            where: { [key]: value }
        })
    }
}

module.exports = { createUser, searchUser, editUser, getUserByInfo }