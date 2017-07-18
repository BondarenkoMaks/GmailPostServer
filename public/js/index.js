let socket = io.connect('http://localhost:3200');
//create object for work with socket API
let socketApi = {
    addEmail: function (email) {
        return new Promise((resolve, reject) => {
            socket.emit('addEmail', JSON.stringify(email),  (answer)=> {

                if (answer instanceof Error || answer.responseCode == 535 )
                   // console.log("addition was not succsful: "+ answer.message);
                    reject(answer);
                else
                    resolve(answer);

            });
        });
    },
    deleteEmails: function (emails) {
        return new Promise((resolve, reject) => {
            let emailsId = emails.map(function (el) {
                return el._id;
            });
            socket.emit('deleteEmail', emailsId, (answer) => {

                if (answer instanceof Error)
                    reject(answer);
                else
                    resolve();

            });
        });
    },
    GetAllEmails: function () {
        return new Promise((resolve, reject) => {
            socket.emit('GetAllEmails', true,  (answer)=> {
                if (answer instanceof Error)
                    reject(answer);

                else
                    resolve(answer);
            });
        });
    }
};

//////////////////////////////////////////////////
app = angular.module("Post", []);// initialization  angular app
app.controller("mainCtrl", function ($scope) {

    $scope.emails = [];

    $scope.getAllEmails = function () {
        socketApi.GetAllEmails()
            .then(
            (arr) => {
                $scope.emails = arr;
                $scope.$digest();
            },
            (err) => {
                alert("Error: " + err.message);
            });
    };
    $scope.deleteEmails = function () {
        let deleteEmails = $scope.emails.filter((el) => {
            return el.delete;
        });
        socketApi.deleteEmails(deleteEmails).
            then(() => {
            $scope.emails = $scope.emails.filter((el) => {
                return !el.delete;
            });
            $scope.$digest();
        });

    };

    $scope.isNewLetter = false;
    $scope.creatLetter = function () {
        $scope.isNewLetter = true;
    };
    $scope.cancelLetter = function () {
        $scope.isNewLetter = false;
    };

});
app.controller("formCtrl", function ($scope) {
    $scope.addNewEmail = function (NewEmail) {

        if (NewEmail.emailTo =="" || NewEmail.subject=="" || NewEmail.emailTo =="")
            return;
        let Email = {
            emailTo: NewEmail.emailTo,
            subject: NewEmail.subject,
            message: NewEmail.message
        };
        $scope.NewEmail = {
            emailTo: "",
            subject: "",
            message: ""
        };

        socketApi.addEmail(Email)
            .then((newEmail) => {
                    $scope.$apply(function () {
                        $scope.emails.push(newEmail);
                    });
                },
                (err) => {
                    alert("Error: server can not send email!");
                });

        $scope.cancelLetter();
    };
    $scope.NewEmail = {
        emailTo: "",
        subject: "",
        message: ""
    };

});