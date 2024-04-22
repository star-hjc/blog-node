const { PrismaClient } = require('@prisma/blog')

const blogDB = new PrismaClient({
    log: ['info', 'query', 'warn', 'error']
})



module.exports = { blogDB }
