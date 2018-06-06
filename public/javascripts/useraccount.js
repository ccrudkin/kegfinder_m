function changePass() {
    let oldPass = document.getElementById('oldPass').value;
    let newPass = document.getElementById('newPass').value;
    let newPass2 = document.getElementById('newPass2').value;

    $.ajax({
        url: '/useraccount/change',
        type: 'POST',
        data: {
            oldPass: oldPass,
            newPass: newPass,
            newPass2: newPass2
        },
        success(res) {
            console.log(res);
            if (res[0] === 0) {
                document.getElementById('message').innerHTML = res[1];
            }
            if (res[0] === 1) {
                document.getElementById('errormessage').innerHTML = res[1];
            }
        },
        error(err) {
            console.log(err);
            document.getElementById('errormessage').innerHTML = 'There was an error with the request.';
        }
    });
}



document.getElementById('changePassButton').addEventListener('click', changePass);