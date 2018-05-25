
function getForm() {
    let kegIDs = document.getElementById('updateKegs').value;
    if (kegIDs === '') {
        document.getElementById('errormessage').innerHTML = 'Please enter at least one keg ID.';
        return
    } else {
        kegIDs = kegIDs.replace(/\s+/g, '');
        kegIDs = kegIDs.split(',');
    }
    
    let condition = document.getElementById('condition').value.toUpperCase();
    let contents = document.getElementById('contents').value.toUpperCase();
    let batchid = document.getElementById('batchid').value.toUpperCase();
    let location = document.getElementById('location').value.toUpperCase();
    let notes = encodeURIComponent(document.getElementById('notes').value);

    // fix this heinous duplication later with refactored code
    if (condition === '') { 
        condition = '--';
    }
    if (contents === '') {
        contents = '--';
    }
    if (batchid === '') {
        batchid = '--';
    }
    if (location === '') {
        location = '--';
    }
    if (notes === '') {
        notes = '--';
    }

    $.ajax({
        url: `/modInventory/${condition}/${contents}/${batchid}/${location}/${notes}/${kegIDs}`,
        type: 'GET',
        success(res) {
            console.log(res);
            resetFields();
            document.getElementById('message').innerHTML = 'Inventory updated.' + 
                "&nbsp&nbsp<a href='/viewInventory'>View inventory</a>";
        }, 
        error(err) {
            console.log(err);
        }
    });
}

function resetFields() {
    document.getElementById('updateInvForm').reset();
    document.getElementById('message').innerHTML = '';
    document.getElementById('errormessage').innerHTML = '';
}

document.getElementById('updateButton').addEventListener('click', getForm);
document.getElementById('resetButton').addEventListener('click', resetFields);
document.getElementById('updateInvForm').addEventListener('keydown', (event) => {
    if (event.keyCode === 13) {
        event.preventDefault();
        document.getElementById('updateButton').click();
    }
});

