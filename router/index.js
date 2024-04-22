const { readdirSync, lstatSync } = require('fs')
const { router: { prefix } } = require('../config/settings')
const path = require('path');

module.exports = {
    use: (app) => {
        const basePath = path.join(__dirname)
        const modules = readdirSync(basePath).filter(item => lstatSync(path.join(basePath, item)).isDirectory())
        modules.forEach(model => {
            app.use(`${prefix}/${model}`, require(`./${model}`))
        })
    }
}