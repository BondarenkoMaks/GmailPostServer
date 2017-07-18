const nodemailer = require('nodemailer');

module.exports = function (credentials) {

    let mailTransport = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
            user: credentials.user,
            pass: credentials.password,
        }
    });

    let from = '<info@gmail.com>';

    return {
        send: function (to, subj, body) {

            return new Promise((resolve, reject) => {
                mailTransport.sendMail({
                    from: from,
                    to: to,
                    subject: subj,
                    html: body

                }, function (err, data) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve();
                    }
                });
            });
        }
    };
};
