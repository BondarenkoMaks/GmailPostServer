const config = require("config");
const mongoose = require('mongoose');
let options = {
    promiseLibrary: require('bluebird'),
    useMongoClient: true
};
mongoose.connect(config.get('mongoose:uri'), options)
    .then(function() {
        let admin = new mongoose.mongo.Admin(mongoose.connection.db);
        admin.buildInfo(function(err, info) {
            if (err) {
                console.err(`Error getting MongoDB info: ${err}`);
            } else {
                console.log(`Connection to MongoDB (version ${info.version}) opened successfully!`);
            }
        });
    })
    .catch((err) => console.error(`Error connecting to MongoDB: ${err}`));


module.exports.connection = mongoose.connection;
module.exports.mongoose = mongoose;
module.exports.User = require('./models/user');
module.exports.Email = require('./models/email');