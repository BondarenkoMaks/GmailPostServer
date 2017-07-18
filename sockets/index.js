//Sockets Server module
const cookie = require('cookie');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const config = require('config');
const socketAPI = require('./directives/emails');
const sessionStore = require('lib/sessionStore');
const User = require("db").User;

module.exports.up = function (io) {
    'use strict';
    module.exports.io = io; // export socket server
    io.set('origins', 'localhost:*');
   // io.set('logger', logger);

    io.use(function(socket, next) {
        let handshake = socket.request;
        handshake.cookies = cookie.parse(handshake.headers.cookie || '');
        let sidCookie = handshake.cookies[config.get('session:key')];
        let sid = cookieParser.signedCookie(sidCookie, config.get('session:secret'));
        if (!sid) {
            return callback(new Error('Not session found'));
        }
        sessionStore.load(sid, function (err, session) {

            if (!session) {
                // no arguments => no session
                return next(new Error('Not session found'))
            } else {
                socket.session = session;
                User.getUserById(session.passport.user, function (err, user) {
                    if (err) {
                        return next(new Error('Not user found'));
                    }
                    if (user) {
                        socket.user = user;
                        next();
                    } else {
                        next(new Error('Not user found'));
                    }
                });
            }
        });
    });

    io.on('connection', socketAPI.emailsSocketAPI);

};
