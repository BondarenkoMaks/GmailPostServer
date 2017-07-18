let socket = io.connect('http://localhost:3200');
let apiFront = {
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

app = angular.module("Post", []);
app.controller("mainCtrl", function ($scope) {

    $scope.emails = [];

    $scope.getAllEmails = function () {
        apiFront.GetAllEmails()
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
        apiFront.deleteEmails(deleteEmails).
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

        apiFront.addEmail(Email)
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