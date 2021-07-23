var table = document.querySelector("#tableBody");
var submitButton = document.querySelector("#submitButton");

const stockArray = [];
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
    refreshItems(stock)
};

//if innertext of the html element == stock.ticker then it's good to delete from the array and then refresh the whole thing
function refreshItems(stock){

    table.innerHTML='';
    for (let i = 0; i < stockArray.length; i++) {
        stockArray[i].index = i;
        table.insertAdjacentHTML("beforeend", tableItemTemplate(stockArray[i]));
    }
}


table.addEventListener("click", (e) => {
    console.log(e.target.innerHTML);
    if (e.target.innerHTML === "delete") {
        var name = e.target.parentNode.parentNode.childNodes[1].innerHTML;
        console.log(name);
        for (let i = 0; i < stockArray.length; i++) {
            if (stockArray[i].ticker === name) {
                console.log(name + "2");
                deleteStock(stockArray[i], i);
            }
        }
    }
});


function tableItemTemplate(stock){
    var html = `
    <tr id=tr>
        <td>${stock.ticker}</td>
        <td><input class="u-full-width" type="number" placeholder="00.00" id="entry" value = "${stock.entry}"></td>
        <td><input class="u-full-width" type="number" placeholder="00.00" id="exit" value = ${stock.exit}></td>
        <td> <button class="status-button"> ${stock.tracking}</button> </td>
        <td> <button type="button">delete</button> </td>

    </tr>
    `
    return html;
}

//        <td><input class="button" id ="deleteButton" type="button" value="delete"></td>

function deleteStock(stock, index){
    console.log("delete");
    table.innerHTML = '';
    stockArray.splice(index, 1);

    for (let i = 0; i < stockArray.length; i++) {
        table.insertAdjacentHTML("beforeend", tableItemTemplate(stockArray[i]));
    }
}
