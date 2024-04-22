const nodemailer = require('nodemailer')
const { mali } = require('../../config/settings')

const transporter = nodemailer.createTransport(mali)

/**
 * 发送邮箱
 * @param {String} subject 邮件标题
 * @param {String} to 目标邮箱
 * @param {String} text 邮件内容
 * @returns 
 */
module.exports = async (subject, to, text) => {
  return new Promise((resolve, reject) => {
    transporter.sendMail({ from: mali.auth.user, subject, to, text }, (err) => {
      if (err) {
        console.error(err);
        return reject(false)
      }
      resolve(true)
    })
  }).catch(res => {
    return res
  })
}

