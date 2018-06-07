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
                document.getElementById('errormessage').innerHTML = '';
                resetFields();
            }
            if (res[0] === 1) {
                let errstring = ''; // iterate through multiple errors
                for (let i = 0; i < res[1].length; i++) {
                    errstring = errstring + `<p>${res[1][i]}</p>`
                }
                document.getElementById('errormessage').innerHTML = errstring;
                document.getElementById('message').innerHTML = '';
                resetFields();
            }
        },
        error(err) {
            console.log(err);
            document.getElementById('errormessage').innerHTML = '<p>There was an error with the request.</p>';
            resetFields();
        }
    });
}

function resetFields() {
    document.getElementById('changePassForm').reset();
}

document.getElementById('changePassButton').addEventListener('click', changePass);
document.getElementById('changePassForm').addEventListener('keydown', (event) => {
    if (event.keyCode === 13) {
        event.preventDefault();
        document.getElementById('changePassButton').click();
    }
});