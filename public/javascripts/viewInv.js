$(document).ready(() => { // ugly way to handle this -- find better solution
    $('#searchTermWarning').hide();
});

function searchOrAll(sort) {
    let searchTerm = document.getElementById('searchTerm').value;

    if (searchTerm === '') {
        allCatalog(sort);
    } else {
        printQuery(sort);
    }
}

function printQuery(sort) {
    let user = document.getElementById('userid').innerHTML;
    let searchBy = document.getElementById('searchBy').value;
    let searchTerm = document.getElementById('searchTerm').value;

    if (searchTerm === '') {
        document.getElementById('searchTermWarning').innerHTML = '&nbspEnter a valid search term or use "Show all".';
        $('#searchTermWarning').show();
    }

    $.ajax({
        url: `/viewInventory/${user}/${searchBy}/${searchTerm}/${sort}`,
        type: 'GET',
        success(res) {
            let html = [];
            res.forEach((row) => {
                html.push('<tr>');
                html.push('<td></td>');
                html.push('<td>' + row.kegid + '</td>');
                html.push('<td>' + row.type + '</td>');
                html.push('<td>' + row.condition + '</td>');
                html.push('<td>' + row.style + '</td>');
                html.push('<td>' + row.batchid + '</td>');
                html.push('<td>' + row.location + '</td>');
                html.push('<td>' + row.movedate + '</td>');
                html.push('<td>' + row.notes + '</td>');
                html.push('</tr>');
            });
            // html.push('</tbody></table>');
            document.getElementById('invSearchBody').innerHTML = html.join('');
            document.getElementById('searchTermWarning').innerHTML = '';
        }, error(jqXHR, status, errorThrown) {
            console.log(status + ' ' + errorThrown);
        }
    })
}

// TODO: Limit to # results per page
function allCatalog(sort) {
    let user = document.getElementById('userid').innerHTML;
    let searchBy = document.getElementById('searchBy').value;
    let searchTerm = 'getAll';

    console.log(sort);

    $.ajax({
        url: `/viewInventory/${user}/${searchBy}/${searchTerm}/${sort}`,
        type: 'GET',
        success(res) {
            let html = [];
            res.forEach((row) => {
                html.push('<tr>');
                html.push('<td></td>');
                html.push('<td>' + row.kegid + '</td>');
                html.push('<td>' + row.type + '</td>');
                html.push('<td>' + row.condition + '</td>');
                html.push('<td>' + row.style + '</td>');
                html.push('<td>' + row.batchid + '</td>');
                html.push('<td>' + row.location + '</td>');
                html.push('<td>' + row.movedate + '</td>');
                html.push('<td>' + row.notes + '</td>');
                html.push('</tr>');
            });
            // html.push('</tbody></table>');
            document.getElementById('invSearchBody').innerHTML = html.join('');
            document.getElementById('searchTermWarning').innerHTML = '';
        }, error(jqXHR, status, errorThrown) {
            console.log(status + ' ' + errorThrown);
        }
    })
}

function resetFields() {
    document.getElementById('viewInvForm').reset();
    document.getElementById('searchTermWarning').innerHTML = '';
    $('#searchTermWarning').hide();
}

function resetCatalog() {
    allCatalog('kegid');
}

allCatalog('kegid');

// TODO: display errors if fields left blank, etc.
document.getElementById('searchButton').addEventListener('click', function () { searchOrAll('kegid'); } );
document.getElementById('resetButton').addEventListener('click', resetFields);
document.getElementById('resetButton').addEventListener('click', resetCatalog);
// setup below for doing sorting later on. But how to sort queries vs. whole catalog?

document.getElementById('kegID').addEventListener('click', function () { searchOrAll('kegid'); } );
document.getElementById('kegType').addEventListener('click', function () { searchOrAll('type'); } );
document.getElementById('kegStatus').addEventListener('click', function () { searchOrAll('condition'); } );
document.getElementById('kegStyle').addEventListener('click', function () { searchOrAll('style'); } );
document.getElementById('kegbatchID').addEventListener('click', function () { searchOrAll('batchid'); } );
document.getElementById('kegLocation').addEventListener('click', function () { searchOrAll('location'); } );
document.getElementById('kegLastChange').addEventListener('click', function () { searchOrAll('movedate'); } );




