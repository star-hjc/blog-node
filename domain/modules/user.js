const { blogDB, cache } = require('./')
const { mysql: { MAX_RETRIES } } = require('../../config/settings')
const { objectSplit } = require('../../utils/object')
/**
 * 
 * @param { { email: String, password: String } } options 
 * @returns 
 */
const createUser = async (options = {}) => {
    let retries = 0
    while (retries < MAX_RETRIES) {
        try {
            return await blogDB.$transaction(async () => {
                const [, data] = objectSplit(options, ['email', 'password'])
                const { _max } = await blogDB.user.aggregate({ _max: { code: true } })
                const code = _max.code ? _max.code + 1n : void 0
                const user = await blogDB.user.create({
                    data: { code, ...data }
                })
                await createUserRole(user.id, cache.role.id)
                return user
            })
        } catch (error) {
            if (error.code === 'P2034') {
                retries++
                continue
            }
            throw error
        }
    }
}

/**
 * 创建用户角色
 * @param {String} userId 
 * @param {String} roleId 
 * @returns 
 */
const createUserRole = async (userId, roleId) => {
    return await blogDB.userRole.create({
        data: { userId, roleId }
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
    return await blogDB.user.findMany({
        where: {
            OR: [{ email: user }, { phone: user }, { code: isNaN(Number(user)) ? 0 : Number(user) }]
        }
    })
    return []
}

const getUserByCode = async (code) => {
    return await blogDB.user.findUnique({
        where: { code }
    })
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
            where: { [key]: value },
            include: {
                userRole: {
                    include: {
                        role: {
                            include: true
                        }
                    }
                }
            }
        })
    }
}

module.exports = { createUser, getUserByCode, searchUser, editUser, getUserByInfo }