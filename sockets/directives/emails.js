const models = require('db');
const emailModel = models.Email;
const config = require('config');
const credentials = {user: config.get('gmail:user'), password: config.get('gmail:password')};
const emailService = require('lib/sendEmail')(credentials);

module.exports.emailsSocketAPI =  (socket) =>{

    socket.on('addEmail', (email, callback) =>{
        let userEmail = socket.user.email;
        let newEmail = JSON.parse(email);
        newEmail.emailFrom = userEmail;
        console.dir('new email : ' + newEmail);
        debugger;
        if (!(/[A-Z0-9._%+-]+@[A-Z0-9.-]+.[A-Z]{2,4}/igm.test(newEmail.emailTo) && newEmail.subject &&  newEmail.message)){
            return callback(new Error("Incorrectly filled letter!"));
        }

        emailService.send(newEmail.emailTo, newEmail.subject, newEmail.message)
            .then(() => {
                emailModel.create(newEmail, function (err, doc) {
                    if (err) {
                        callback(err);
                        throw new Error('Error operation addEmail');
                    }
                    callback(doc);
                });
            })
            .catch((err)=>{
                callback(err);
            });

    });


    socket.on('deleteEmail', (emailsId, callback) => {
        emailModel.remove({_id: {$in: emailsId}}, function (err) {
            if (err) {
                callback(false);
                throw new Error('Error operation delete');

            } else {
                callback(true);
            }
        });
    });

    socket.on('GetAllEmails', (user, callback) => {

        let userEmail = socket.user.email;
        emailModel.find({emailFrom: userEmail}, function (err, docs) {
            debugger;
            if (err) {
                callback(err);
                throw new Error('Error operation delete');
            }
            callback(docs);
        });
    });
};

