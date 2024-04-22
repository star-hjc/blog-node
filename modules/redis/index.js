const Redis = require('ioredis')
const { redis } = require('../../config/settings')

module.exports = (def = 0) => new Redis(redis[def])