const jwt = require('jsonwebtoken')

const { jwt: { expressjwtOptions: { secret, signOptions } } } = require('../../config/settings')

/**
 *  获取token
 * @param {Object} obj 
 * @returns token
 */
module.exports = (obj, options) => {
    return jwt.sign({ ...obj }, secret, { ...signOptions, ...options })
}