function newInv() {
    let num = document.getElementById('newInvSize').value;
    let type = document.getElementById('kegType').value;
    let nameScheme = document.getElementById('nameScheme').value;
    let add = document.getElementById('addToInvCheck');

    $.ajax({
        url: '/newinventory=create/' + num + '/' + type + '/' + nameScheme, // + '/' + add.checked,
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

function removeInv() {
    let kegIDs = document.getElementById('removeKegs').value;

    console.log(kegIDs);

    if (kegIDs === '') {
        document.getElementById('rerrorDialog').innerHTML = 'Please enter at least one keg ID.';
        return
    } else {
        if (confirm('Are you sure you want to permanently remove these kegs? This cannot be undone.')) {
            document.getElementById('rerrorDialog').innerHTML = '';
            kegIDs = kegIDs.replace(/\s+/g, '');
            kegIDs = kegIDs.split(',');
            $.ajax({
                url: `/newinventory=remove/${kegIDs}`,
                type: 'GET',
                success (response) {
                    if (response === 'Success.') {
                        document.getElementById('rsuccessDialog').innerHTML = 'Removed successfully.' +
                        "&nbsp&nbsp<a href='/viewInventory'>View inventory</a>";
                    } else {
                        document.getElementById('rerrorDialog').innerHTML = response;
                    }
                },
                error(jqXHR, status, errorThrown) {
                    console.log('Error: ' + status);
                    document.getElementById('rerrorDialog').innerHTML = status +
                        'There was an error. Please check inventory and try again.';
                }
            });
        } else {
            return;
        }
    }
}

function resetFields() {
    document.getElementById('newInvForm').reset();
    document.getElementById('errorDialog').innerHTML = '';
}


document.getElementById('createNewInv').addEventListener('click', newInv);
document.getElementById('createNewInv').addEventListener('click', resetFields);
document.getElementById('newInvForm').addEventListener('keydown', (event) => {
    if (event.keyCode === 13) {
        event.preventDefault();
        document.getElementById('createNewInv').click();
    }
});
document.getElementById('removeInv').addEventListener('click', removeInv);
