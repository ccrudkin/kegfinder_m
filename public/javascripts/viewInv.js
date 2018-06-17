function searchOrAll(sort) {
    let searchTerm = document.getElementById('searchTerm').value;

    if (searchTerm === '') {
        allCatalog(sort);
    } else {
        printQuery(sort);
    }
}

function printQuery(sort) {
    let searchBy = document.getElementById('searchBy').value;
    let searchTerm = document.getElementById('searchTerm').value.toUpperCase();

    $.ajax({
        url: `/viewInventory/${searchBy}/${searchTerm}/${sort}`,
        type: 'GET',
        success(res) {
            let resphtml = [];
            res.forEach((row) => {
                resphtml.push("<div class='resultContainer'>");
                    resphtml.push("<div id='sortByCont' class='rowContainer'>");
                        resphtml.push("<div class='cardLabel'></div>");
                        resphtml.push("<div id='sortBy'></div>");
                    resphtml.push("</div>");
                    resphtml.push("<div id='kegIDCont' class='rowContainer'>");
                        resphtml.push("<div class='cardLabel'>Keg ID:</div>");
                        resphtml.push(`<div id='kegID'>${row.kegid}</div>`);
                    resphtml.push("</div>");
                    resphtml.push("<div id='kegTypeCont' class='rowContainer'>");
                        resphtml.push("<div class='cardLabel'>Type:</div>");
                        resphtml.push(`<div id='kegType'>${row.type}</div>`);
                    resphtml.push("</div>");
                    resphtml.push("<div id='kegStatusCont' class='rowContainer'>");
                        resphtml.push("<div class='cardLabel'>Status:</div>");
                        resphtml.push(`<div id='kegStatus'>${row.condition}</div>`);
                    resphtml.push("</div>");
                    resphtml.push("<div id='kegStyleCont' class='rowContainer'>");
                        resphtml.push("<div class='cardLabel'>Style:</div>");
                        resphtml.push(`<div id='kegStyle'>${row.style}</div>`);
                    resphtml.push("</div>");
                    resphtml.push("<div id='kegBatchIDCont' class='rowContainer'>");
                        resphtml.push("<div class='cardLabel'>Batch:</div>");
                        resphtml.push(`<div id='kegBatchID'>${row.batchid}</div>`);
                    resphtml.push("</div>");
                    resphtml.push("<div id='kegLocationCont' class='rowContainer'>");
                        resphtml.push("<div class='cardLabel'>Location:</div>");
                        resphtml.push(`<div id='kegLocation'>${row.location}</div>`);
                    resphtml.push("</div>");
                    resphtml.push("<div id='kegLastChangeCont' class='rowContainer'>");
                        resphtml.push("<div class='cardLabel'>Last Change:</div>");
                        resphtml.push(`<div id='kegLastChange'>${row.movedate}</div>`);
                    resphtml.push("</div>");
                    resphtml.push("<div id='kegNotesCont' class='rowContainer'>");
                        resphtml.push("<div class='cardLabel'>Notes:</div>");
                        resphtml.push(`<div id='kegNotes'>${row.notes}</div>`);
                    resphtml.push("</div>");                        
                resphtml.push("</div>");
            });

            document.getElementById('tabResults').innerHTML = resphtml.join('');
            document.getElementById('searchTermWarning').innerHTML = '';
        }, error(jqXHR, status, errorThrown) {
            console.log(status + ' ' + errorThrown);
        }
    })
}

// TODO: Limit to # results per page
function allCatalog(sort) {
    let searchBy = document.getElementById('searchBy').value;
    let searchTerm = 'getAll';

    console.log('Search by: ' + searchBy);

    if (searchBy != 'kegid') {
        document.getElementById('searchTermWarning').innerHTML = '&nbspEnter a valid search ' + 
        'term or "Reset" to show all.';
        $('#searchTermWarning').show();
        return;
    }

    $.ajax({
        url: `/viewInventory/${searchBy}/${searchTerm}/${sort}`,
        type: 'GET',
        success(res) {
            let resphtml = [];
            res.forEach((row) => {
                resphtml.push("<div class='resultContainer'>");
                    resphtml.push("<div id='sortByCont' class='rowContainer'>");
                        resphtml.push("<div class='cardLabel'></div>");
                        resphtml.push("<div id='sortBy'></div>");
                    resphtml.push("</div>");
                    resphtml.push("<div id='kegIDCont' class='rowContainer'>");
                        resphtml.push("<div class='cardLabel'>Keg ID:</div>");
                        resphtml.push(`<div id='kegID'>${row.kegid}</div>`);
                    resphtml.push("</div>");
                    resphtml.push("<div id='kegTypeCont' class='rowContainer'>");
                        resphtml.push("<div class='cardLabel'>Type:</div>");
                        resphtml.push(`<div id='kegType'>${row.type}</div>`);
                    resphtml.push("</div>");
                    resphtml.push("<div id='kegStatusCont' class='rowContainer'>");
                        resphtml.push("<div class='cardLabel'>Status:</div>");
                        resphtml.push(`<div id='kegStatus'>${row.condition}</div>`);
                    resphtml.push("</div>");
                    resphtml.push("<div id='kegStyleCont' class='rowContainer'>");
                        resphtml.push("<div class='cardLabel'>Style:</div>");
                        resphtml.push(`<div id='kegStyle'>${row.style}</div>`);
                    resphtml.push("</div>");
                    resphtml.push("<div id='kegBatchIDCont' class='rowContainer'>");
                        resphtml.push("<div class='cardLabel'>Batch:</div>");
                        resphtml.push(`<div id='kegBatchID'>${row.batchid}</div>`);
                    resphtml.push("</div>");
                    resphtml.push("<div id='kegLocationCont' class='rowContainer'>");
                        resphtml.push("<div class='cardLabel'>Location:</div>");
                        resphtml.push(`<div id='kegLocation'>${row.location}</div>`);
                    resphtml.push("</div>");
                    resphtml.push("<div id='kegLastChangeCont' class='rowContainer'>");
                        resphtml.push("<div class='cardLabel'>Last Change:</div>");
                        resphtml.push(`<div id='kegLastChange'>${row.movedate}</div>`);
                    resphtml.push("</div>");
                    resphtml.push("<div id='kegNotesCont' class='rowContainer'>");
                        resphtml.push("<div class='cardLabel'>Notes:</div>");
                        resphtml.push(`<div id='kegNotes'>${row.notes}</div>`);
                    resphtml.push("</div>");                        
                resphtml.push("</div>");
            });

            document.getElementById('tabResults').innerHTML = resphtml.join('');
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

// setup for doing sorting 
document.getElementById('kegIDCont').addEventListener('click', function () { searchOrAll('kegid'); } );
document.getElementById('kegTypeCont').addEventListener('click', function () { searchOrAll('type'); } );
document.getElementById('kegStatusCont').addEventListener('click', function () { searchOrAll('condition'); } );
document.getElementById('kegStyleCont').addEventListener('click', function () { searchOrAll('style'); } );
document.getElementById('kegBatchIDCont').addEventListener('click', function () { searchOrAll('batchid'); } );
document.getElementById('kegLocationCont').addEventListener('click', function () { searchOrAll('location'); } );
document.getElementById('kegLastChangeCont').addEventListener('click', function () { searchOrAll('movedate'); } );

// target 'enter' key for search
document.getElementById('viewInvForm').addEventListener('keydown', (event) => {
    if (event.keyCode === 13) {
        event.preventDefault();
        document.getElementById('searchButton').click();
    }
});




