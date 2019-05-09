'use strict'

const winston = require.main.require('winston')
const Meta = require.main.require('./src/meta')
const nodemailer = require('nodemailer')

let settings = {}

module.exports = {
  init(data, callback) {
    function renderAdminPage(req, res) {
      res.render('admin/smtp', {})
    }

    data.router.get('/admin/nodemailer/smtp', data.middleware.admin.buildHeader, renderAdminPage)
    data.router.get('/api/admin/nodemailer/smtp', renderAdminPage)

    Meta.settings.get('nodemailer-smtp', (err, _settings) => {
      if (err) {
        return winston.error(err)
      }
      settings = _settings
    })

    callback()
  },

  async send(data, callback) {
    const smtpConfig = {
      host: settings['nodemailer:smtp:host'],
      port: settings['nodemailer:smtp:port'],
      secure: settings['nodemailer:smtp:secure'],
      requireTLS: settings['nodemailer:smtp:tls'],
      auth: {
        user: settings['nodemailer:smtp:username'],
        pass: settings['nodemailer:smtp:password'],
      },
    }
    const mailOptions = {
      from: {
        name: data.from_name,
        adddress: data.from
      },
      to: {
        name: data._raw.username,
        address: data.to
      },
      html: data.html,
      text: data.plaintext,
      subject: data.subject
    }
    const transporter = nodemailer.createTransport(smtpConfig)
    try {
      const info = await transporter.sendMail(mailOptions)
      winston.info('[nodemailer.smtp] Sent `' + data.template + '` email to uid ' + data.uid)
      callback(null, data)
    } catch (err) {
      winston.error(err)
      winston.warn('[nodemailer.smtp] Unable to send `' + data.template + '` email to uid ' + data.uid + '!')
      callback(err, data)
    }
  },

  admin: {
    menu(header, callback) {
      header.plugins.push({
        "route": '/nodemailer/smtp',
        "icon": 'fa-envelope-o',
        "name": 'Nodemailer SMTP'
      })

      callback(null, header)
    }
  }
}