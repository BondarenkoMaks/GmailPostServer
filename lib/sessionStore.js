let connection = require('db').connection;
let session = require('express-session');
let MongoStore = require('connect-mongo')(session);
//save session in mongoDb
let sessionStore = new MongoStore({mongooseConnection: connection});

module.exports = sessionStore;