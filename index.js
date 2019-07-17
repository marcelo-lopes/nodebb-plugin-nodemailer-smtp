
var winston = require.main.require('winston')
var Meta = require.main.require('./src/meta')
var nodemailer = require.main.require('nodemailer')
'use strict'
var settings = {}
var plugin = {}

plugin.init = function (data, callback) {
  var renderAdminPage = function (req, res) {
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
  callback();
};

plugin.send = function (data, callback) {
  var smtpConfig = {
    host: settings['nodemailer:smtp:host'],
    port: settings['nodemailer:smtp:port'],
    secure: settings['nodemailer:smtp:secure'],
    //requireTLS: settings['nodemailer:smtp:tls'],
    auth: {
      user: settings['nodemailer:smtp:username'],
      pass: settings['nodemailer:smtp:password'],
    },
  }
  var mailOptions = {
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
  var transporter = nodemailer.createTransport(smtpConfig)
  transporter.sendMail(mailOptions, function (err, result) {
    if (err) {
      winston.error(err)
      winston.warn('[nodemailer.smtp] Unable to send `' + data.template + '` email to uid ' + data.uid + '!')
      callback(err, data);
    }
    else {
      winston.info('[nodemailer.smtp] Sent `' + data.template + '` email to uid ' + data.uid)
      callback(null, data)
    }
  });
};

var admin = plugin.admin = {};
admin.menu = function (custom_header, callback) {
  custom_header.plugins.push({
    "route": '/nodemailer/smtp',
    "icon": 'fa-envelope-o',
    "name": 'Nodemailer SMTP'
  });
  callback(null, custom_header);
};

module.exports = plugin;