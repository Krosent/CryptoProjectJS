const {
    Observable,
    Subject,
    ReplaySubject,
    from,
    of,
    range,
    fromEvent,
} = rxjs;
const {
    map,
    filter,
    switchMap,
    scan,
    groupBy
} = rxjs.operators;

const { webSocket } = rxjs.webSocket;
// Bitmex WS Endpoint
var subject = null;

function subscribeOnUpdates() {
    subject = webSocket("wss://www.bitmex.com/realtime?subscribe=tradeBin1m");
    // Here we subscribe on updates from above mentioned WS. 
    subject.subscribe(
        msg => {
            console.log('message received: ' + JSON.stringify(msg.data));
            refreshTable(getTable('currencyTableNum1'), msg.data);
        }, // Called whenever there is a message from the server.
        err => console.log(err), // Called if at any point WebSocket API signals some kind of error.
        () => console.log('complete') // Called when connection is closed (for whatever reason).
    );
}

function unsubscribeOnUpdates() {
    subject.unsubscribe();
}

function getTable(tableName) {
    return document.getElementById(tableName);
}

function getTableBody(tableInstance) {
    return tableInstance.getElementsByTagName('tbody');
}

function cleanTableBody(tableBodyInstance) {
    tableBodyInstance[0].innerHTML = '';
}

function refreshTable(table, data) {
    var tableBodyInstance = getTableBody(table);

    if (typeof data !== 'undefined') {
        // Data represented as a list of currency with corresponding changes. 
        data.forEach(elem => {
            const open = elem.open;
            const close = elem.close;
            const high = elem.high;
            const low = elem.low;
            const timestamp = elem.timestamp;
            const currency = elem.symbol;

            var tableRows = Array.from(getTableBody(table)[0].rows);


            /* Check option element on the frontend. 
            *  If 'All' option is selected then display every currency
            *  If another option is selected then display corresponding currency. 
            *  We need to filter out table to get results
            */
            const optionElement = document.getElementById('currencySelector');
            const optionElementValue = optionElement.options[optionElement.selectedIndex].text;
            if (optionElementValue != 'All Currencies') {
                tableRows = tableRows.filter(row => row.cells[0].innerHTML == optionElementValue);
                //alert("Implement this!");
            }
            // Iterate through table rows in the table.        
            // Fetch rows which are already exist. 
            const filteredRows = tableRows.filter(row => row.cells[0].innerHTML == currency);
            if (filteredRows.length > 0) {
                // If such row is already exist proceed here. 
                filteredRows[0].cells[1].innerHTML = high;
                filteredRows[0].cells[2].innerHTML = low;
                filteredRows[0].cells[3].innerHTML = open;
                filteredRows[0].cells[4].innerHTML.innerHTML = close;
                //alert("Such row in table already exist. Implement it here!");
            } else {
                // If such row does not exist yet proceed here. 
                var tableBody = getTableBody(table)[0];
                var newRow = tableBody.insertRow();
                var cell0 = newRow.insertCell(0);
                var cell1 = newRow.insertCell(1);
                var cell2 = newRow.insertCell(2);
                var cell3 = newRow.insertCell(3);
                var cell4 = newRow.insertCell(4);

                cell0.innerHTML = currency;
                cell1.innerHTML = high;
                cell2.innerHTML = low;
                cell3.innerHTML = open;
                cell4.innerHTML = close;
            }
        });
    };
}