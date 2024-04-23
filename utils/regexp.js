const emailRegexp = /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/

const uuidRegexp = /^[a-f\d]{4}(?:[a-f\d]{4}-){4}[a-f\d]{12}$/i

module.exports = { emailRegexp, uuidRegexp }