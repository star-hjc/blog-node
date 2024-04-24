const { PrismaClient } = require('@prisma/blog')
const { role } = require('../../config/db')

const blogDB = new PrismaClient({
    log: ['info', 'query', 'warn', 'error']
})

const cache = {}

const initDataBaseData = async () => {
    /** 创建初始角色 */
    if (await blogDB.role.count() === 0) {
        const roles = await blogDB.role.createMany({
            data: role
        })
    }
    cache.role = await blogDB.role.findFirst({
        where: { code: role[0].code }
    })
    return { role }
}

initDataBaseData()


module.exports = { blogDB, cache }
