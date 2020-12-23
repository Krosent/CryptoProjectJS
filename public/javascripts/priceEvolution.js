// Chart instance variable.
var chart;

// WS Endpoint
var subject = null;
var sellObservable$ = null;
var buyObservable$ = null;

// Default settings for chart element. 
function initChart() {
    var ctx = document.getElementById('currencyChart').getContext('2d');
    chart = new Chart(ctx, {
        // The type of chart we want to create
        type: 'line',

        // The data for our dataset
        data: {
            labels: [],
            datasets: [{
                label: '',
                backgroundColor: 'rgb(255, 99, 132)',
                borderColor: 'rgb(255, 99, 132)',
                data: []
            }]
        },
        // Configuration options go here
        options: {}
    });
}

function startAbstractSubscription(currencyValue) {
    // First of all we clean table contents.
    cleanChart();

    // if buy or sell is already was subscribed - unsubscirbe and proceed. 
    if (sellObservable$ !== null && !sellObservable$.closed) {
        subject.unsubscribe();
        sellObservable$.unsubscribe();
    }
    if (buyObservable$ !== null && !buyObservable$.closed) {
        subject.unsubscribe();
        buyObservable$.unsubscribe();
    }

    // Reset instance of subject, since if the instance is disconnected - it cannot be connected again...  
    stopSubscription();
    subject = webSocket("wss://ws-feed.pro.coinbase.com");

    // check radio button options
    // if BUY radio button is selected
    if (document.getElementById('buyOptionID').checked) {
        // We set background color of chart at this line. 
        changeChartBackgroundColor('rgb(30,144,255)');
        
        // Filter out everything, but BUY values.
        buyObservable$ = subject.pipe(rxjs.operators.filter(elem => elem.side === 'buy'));

        // Subscribe on changes. 
        buyObservable$.subscribe(
            msg => {
                console.log('message received: ' + JSON.stringify(msg));
                
                pushValueToGraphChart(msg.price, msg.time, currencyValue);
                
            }, // Called whenever there is a message from the server.
            err => console.log(err), // Called if at any point WebSocket API signals some kind of error.
            () => console.log('complete') // Called when connection is closed (for whatever reason).
        );
    }

    // if SELL radio button is selected
    if (document.getElementById('sellOptionID').checked) {

        // We set background color of chart at this line. 
        changeChartBackgroundColor('rgb(0,128,0)');
        
        // Filter out everything, but sell values. 
        sellObservable$ = subject.pipe(rxjs.operators.filter(elem => elem.side === 'sell'));

        // Subscribe on changes. 
        sellObservable$.subscribe(
            msg => {
                console.log('message received: ' + JSON.stringify(msg));
                pushValueToGraphChart(msg.price, msg.time, currencyValue);
                //refreshTable(getTable('currencyTableNum1'), msg.data);
            }, // Called whenever there is a message from the server.
            err => console.log(err), // Called if at any point WebSocket API signals some kind of error.
            () => console.log('complete') // Called when connection is closed (for whatever reason).
        );

    }

    // We need to send message to WS server to subscribe on exact data retrieval.
    subject.next({
        "type": "subscribe",
        "product_ids": [
            `${currencyValue}-USD`
        ],
        "channels": [
            {
                "name": "ticker",
                "product_ids": [
                    `${currencyValue}-USD`
                ]
            }
        ]
    });
}

function startBTCSubscription() {
    startAbstractSubscription('BTC');
}

function startETHSubscription() {
    startAbstractSubscription('ETH');
}

function stopSubscription() {
    subject = null;
}

// This function pushes new data to the chart. 
function pushValueToGraphChart(valueY, valueX, currencyName) {
    chart.data.datasets[0].label = currencyName;
    chart.data.labels.push(valueX);
    chart.data.datasets.forEach((dataset) => {
        dataset.data.push(valueY);
    });
    chart.update();
}

// Erase all data and label values. 
function cleanChart() {
    chart.data.datasets.forEach((dataset) => {
        dataset.data.length = 0;
        chart.data.labels.length = 0;
    });
}

// backgroundColor: 'rgb(255, 99, 132)'
// Represent color in string 'rgb(r,g,b)'
function changeChartBackgroundColor(color) {
    chart.data.datasets.forEach((dataset) => {
        dataset.backgroundColor = color;
        dataset.borderColor = color;
    });
}