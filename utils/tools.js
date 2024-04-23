const Joi = require('joi')

function cerateValidcode(length = 6) {
    let code = ''
    for (let i = 0; i < length; i++) {
        code += Math.round(Math.random() * 9)
    }
    return code
}

function rand(max = 14, min = 0) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function joi(){

}


module.exports = { cerateValidcode, rand }