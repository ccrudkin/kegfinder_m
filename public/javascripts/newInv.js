function newInv() {
    let num = document.getElementById('newInvSize').value;
    let type = document.getElementById('kegType').value;
    let nameScheme = document.getElementById('nameScheme').value;
    let user = document.getElementById('userid').innerHTML; // from auth
    let add = document.getElementById('addToInvCheck');

    console.log(user + ' ' + num + ' ' + type + ' ' + nameScheme);

    $.ajax({
        url: '/newinventory=create/' + user + '/' + num + '/' + type + '/' + nameScheme, // + '/' + add.checked,
        type: 'GET',
        success(response) {
            if (response === 'Success.') {
                document.getElementById('successDialog').innerHTML = 'Success.' + 
                    "&nbsp&nbsp<a href='/viewInventory'>View inventory</a>";
            } else {
                document.getElementById('errorDialog').innerHTML = response;
            }
        },
        error(jqXHR, status, errorThrown) {
            console.log('Error: ' + status);
            document.getElementById('errorDialog').innerHTML = status + '<br>Please check fields and try again.';
        }
    });
}

function resetFields() {
    document.getElementById('newInvForm').reset();
    document.getElementById('errorDialog').innerHTML = '';
}


document.getElementById('createNewInv').addEventListener('click', newInv);
document.getElementById('createNewInv').addEventListener('click', resetFields);
