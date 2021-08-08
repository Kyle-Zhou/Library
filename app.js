var table = document.querySelector("#tableBody");
var submitButton = document.querySelector("#submitButton");
const stockArray = [];
var slots = document.querySelector("#TVslots");


  // Set the configuration for your app
  // TODO: Replace with your project's config object
  var firebaseConfig = {
    apiKey: "AIzaSyAGBRWlsZsQmYjeHSphyRD7C_afl9NNjcg",
    authDomain: "watchlist-82dc5.firebaseapp.com",
    databaseURL: "https://watchlist-82dc5-default-rtdb.firebaseio.com",
    storageBucket: "watchlist-82dc5.appspot.com",
  };
firebase.initializeApp(firebaseConfig);

// Get a reference to the database service
var database = firebase.database();
var uid;
firebase.auth().onAuthStateChanged((user) => {
    if (user) {
        uid = user.uid;
        readDataBase();

    } else {
    }
});


//constructor
class Stock {
    constructor(ticker, entry, exit, tracking){
        this.ticker = ticker;
        this.entry = entry;
        this.exit = exit;
        this.tracking = tracking;
    }
}

submitButton.onclick = function(){
    var ticker = document.querySelector("#TickerInput").value;

    for (let i = 0; i < stockArray.length; i++) {
        if (ticker === stockArray[i].ticker){
            window.alert("No duplicates allowed");
            return;
        }
    }

    var entry = document.querySelector("#EntryInput").value;
    var exit = document.querySelector("#ExitInput").value;
    var tracking = document.querySelector("#TrackingInput").value;

    var stock = new Stock(ticker, entry, exit, tracking);
    stockArray.push(stock);
    writeUserData(uid, stock);
    refreshItems(stock)
};


function refreshItems(stock){

    table.innerHTML='';
    for (let i = 0; i < stockArray.length; i++) {
        stockArray[i].index = i;
        table.insertAdjacentHTML("beforeend", tableItemTemplate(stockArray[i]));
        //slots.insertAdjacentHTML("beforeend", tradingViewWidget(stockArray[i]));
    }

}


table.addEventListener("click", (e) => {
    if (e.target.innerHTML === "delete") {
        var name = e.target.parentNode.parentNode.childNodes[1].innerHTML;
        for (let i = 0; i < stockArray.length; i++) {
            if (stockArray[i].ticker === name) {
                deleteStock(stockArray[i], i);
            }
        }
    }

    if (e.target.innerHTML === "Yes") {
        var name = e.target.parentNode.parentNode.childNodes[1].innerHTML;
        for (let i = 0; i < stockArray.length; i++) {
            if (stockArray[i].ticker === name) {
                stockArray[i].tracking = "No";
                e.target.innerHTML = "No";
                writeUserData(uid, stockArray[i]);
            }
        }
    } else if (e.target.innerHTML === "No") {
        var name = e.target.parentNode.parentNode.childNodes[1].innerHTML;
        for (let i = 0; i < stockArray.length; i++) {
            if (stockArray[i].ticker === name) {
                stockArray[i].tracking = "Yes";
                e.target.innerHTML = "Yes";
                writeUserData(uid, stockArray[i]);

            }
        }
    }

});


function tableItemTemplate(stock){
    var html = `
    <tr id=tr>
        <td>${stock.ticker}</td>
        <td><input class="u-full-width" type="number" placeholder="00.00" id="entry" value = 0></td>
        <td><input class="u-full-width" type="number" placeholder="00.00" id="exit" value = 0></td>
        <td> <button type="button">${stock.tracking}</button> </td>
        <td> <button type="button">delete</button> </td>
        
    </tr>
    `
    return html;
}


// function tradingViewWidget(stock){
//     var html = `

//     `

//     return html;


// }


function refreshStockArray(){

}


function deleteStock(stock, index){
    dbRef.child("users").child(uid).get().then((snapshot) => {
        if (snapshot.exists()) {
            var userInfo = (snapshot.val());
            items = (Object.values(userInfo));
            console.log(items);
            for (let i = 0; i < items.length; i++) {
                if (items[i].ticker === stock.ticker){
                    var key = "ticker " + items[i].ticker;
                    dbRef.child("users").child(uid).child(key).remove();
                }
            }
        } else {
            console.log("No data available");
        }
        }).catch((error) => {
        console.error(error);
    });

    table.innerHTML = '';
    slots.innerHTML = '';
    stockArray.splice(index, 1);
    for (let i = 0; i < stockArray.length; i++) {
        table.insertAdjacentHTML("beforeend", tableItemTemplate(stockArray[i]));
        //slots.insertAdjacentHTML("beforeend", tradingViewWidget(stockArray[i]));
    }


}

//--------------database---------------------
const dbRef = firebase.database().ref();
function readDataBase(){
    dbRef.child("users").child(uid).get().then((snapshot) => {
    if (snapshot.exists()) {
        var userInfo = (snapshot.val());
        console.log(userInfo);

        items = (Object.values(userInfo));
        //console.log(items);
        
        for (let i = 0; i < items.length; i++) {
            table.insertAdjacentHTML("beforeend", tableItemTemplate(items[i]));
            //slots.insertAdjacentHTML("beforeend", tradingViewWidget(items[i]));
            stockArray.push(items[i]);
        }
    } else {
        console.log("No data available");
    }
    }).catch((error) => {
    console.error(error);
    });
}

function writeUserData(userId, stock) {
    firebase.database().ref('users/' + userId + '/ticker ' + stock.ticker).set({
      ticker: stock.ticker,
      tracking: stock.tracking,
  });
}

