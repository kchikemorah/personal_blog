
 var startScreen = document.getElementById("startScreen");
var startButton = document.getElementById("startButton");
var pickup = new Audio('pickup-sound.mp3');
var drop = new Audio('drop-sound.mp3');
var ship = new Audio('ship-package-sound.mp3');
var gameMusic = new Audio('game-music.mp3');
gameMusic.loop = true;
startButton.addEventListener("click", () => {
    gameMusic.play();
    startScreen.style.display = 'none';
var wrapper = document.getElementById('wrapper');
wrapper.className = "wrapper";
var player;
var playerX = 400;
var playerY = 200;
var timerDisplay = document.getElementById('gameTimer');
 playing = true;

function gameTimer(){
    var min = 3;
    var sec = 0;
    var timer = setInterval( function countdown(){
       
        if (sec == 0){
            timerDisplay.innerHTML = '<h1>' + min + ':00 </h1>';
            sec = 59;
            min--;
        }
        else{
        if( sec < 10){
            timerDisplay.innerHTML = '<h1>' + min + ':0' + sec + '</h1>';
            sec--;
        }
        else{
        timerDisplay.innerHTML ='<h1>' + min + ':' + sec + '</h1>';
        sec--;
        }
    }
       
        if (min == -1) {
            playing = false;    
            clearInterval(timer);
            showScore();
           
        }
    }, 1000);
}

var items = [
    { element: document.createElement('img'), x: 700, y: 70, onBelt: true, inPackageId: null, type: 'type1' },
    { element: document.createElement('img'), x: 600, y: 70, onBelt: true, inPackageId: null, type: 'type2' },
    { element: document.createElement('img'), x: 200, y: 70, onBelt: true, inPackageId: null, type: 'type3' },
    { element: document.createElement('img'), x: 400, y: 70, onBelt: true, inPackageId: null, type: 'type4' }
];


items[0].element.className = 'item1';
items[0].element.id = '0';
items[1].element.className = 'item2';
items[1].element.id = '1';
items[2].element.className = 'item3';
items[2].element.id = '2';
items[3].element.className = 'item4';
items[3].element.id = '3';
items[0].element.src = "type1.svg";
items[0].element.alt = "item1";
items[1].element.src = "type2.svg";
items[1].element.alt = "item2";
items[2].element.src = "type3.svg";
items[2].element.alt = "item3";
items[3].element.src = "type4.svg";
items[3].element.alt = "item4";

items.push({ element: document.createElement('img'), x: 800, y: 80, onBelt: true, type: 'type5' });
items[4].element.id = '4';
items[4].element.src = "type5.svg";
items[4].element.alt = "item5";
items[4].element.className = 'item5';
items.push({ element: document.createElement('img'), x: 900, y: 75, onBelt: true, type: 'type6' });
items[5].element.src = "type6.svg";
items[5].element.id = '5';
items[5].element.alt = "item6";
items[5].element.className = 'item6';

function paintAllItems(items) {


    for (let i in items) {
        items[i].element.style.left = items[i].x + 'px';
        items[i].element.style.top = items[i].y + 'px';
        document.getElementById('wrapper').appendChild(items[i].element);

    }
}
function moveItemsOnBelt(items) {
    for (let i in items) {
        if (items[i].onBelt) {
            items[i].x += 10;
            if (items[i].x > viewportWidth) {
                items[i].onBelt = false;
                items[i].element.remove();
                var itemDumpX = Math.random() * 50 + 100;
                var itemDumpY = Math.random() * 50 + 500;
                // items[i].x += -itemDumpX;
                // items[i].y = itemDumpY;
            }

        }


    }
}

var playerIsCarrying = null;

document.addEventListener('keypress', (event) => {
    if (event.code == "KeyP") {
        pickUpBin(event);
    }
    if (event.code == "Enter") {
        closePackage(event);
    }
    if (event.code == "Space") {
        pickUpItem(event);
    }
});



function shiftReceiptsUp(removedReceipt){
    var receiptsToMove = receipts.filter((receipt) => {
        return receipt.x == 0 && receipt.y > removedReceipt.y;
    });
    if (receiptsToMove.length > 0){
    for (var receipt of receiptsToMove){
        receipt.y  -= 150;
    }
}
    
}

function pickUpItem(event) {
    for (let r in receipts) {
    var thisReceipt = receipts[r];
            if (isCollision(thisReceipt)) {

                pickup.play();
                playKeys["Space"] = !playKeys["Space"];
                if (playKeys["Space"] == true) {

                    playerIsCarrying = receipts[r].element;

                    if(receipts[r].x == 0){
                    setTimeout(() => shiftReceiptsUp(receipts[r]), 1000);
                    lastEmptyReceiptPosition -=150;
                    }

                }
                else {
                    playerIsCarrying = null;
                }
                return;
            }

        
    }
    for (let i in items) {
        var thisItem = items[i];
            if (isCollision(thisItem)) {
                playKeys["Space"] = !playKeys["Space"];


                if (playKeys["Space"] == true) {
                    pickup.play();
                    playerIsCarrying = thisItem; //pick up
                    items[i].onBelt = false;
                    if (items[i].inPackageId != null) {
                        containers[items[i].inPackageId].itemIdsInBin.splice(items.indexOf(i), 1); //remove item from bin it was just in
                    }

                    return;
                }
                else {

                    pickup.play();

                    playerIsCarrying = null;
                    items[i].onBelt = false;
                    if (items[i].y <= 70 && items[i].y >= 0) {

                        items[i].onBelt = true;
                        return;
                    }
                    else {

                        var posY = items[i].y;
                        var posX = items[i].x;


                        clearInterval(setIntervalCallIds[i]);
                        setIntervalCallIds[i] = setInterval(frame, 10);
                        function frame() {

                            var itemisOnScreen = posY < 878;
                            for (let bin in containers) {
                                var curBin = containers[bin];

                                var itemIsAboveBin = posY < curBin.y;
                                var itemIsInsideLeftWallOfBin = posX >= curBin.x;
                                var itemIsInsideRightWallOfBin = ((posX + items[i].element.offsetWidth) <= (curBin.x + curBin.element.offsetWidth));


                                if (!itemIsOnScreen || (!itemIsAboveBin && itemIsInsideLeftWallOfBin && itemIsInsideRightWallOfBin)) {

                                    if (itemIsOnScreen) {
                                     drop.play();

                                        posY += curBin.element.offsetHeight - items[i].element.offsetHeight - 10;

                                        items[i].element.style.top = posY + 'px';
                                        items[i].inPackageId = `${bin}`;
                                        containers[bin].itemIdsInBin.push(i);

                                    }
                                    clearInterval(setIntervalCallIds[i]);
                                }
                                else {
                                    posY++;
                                    items[i].y = posY;
                                    items[i].element.style.top = posY + 'px';
                                }
                            }

                        }
                        return;
                    }
                }
            }



        
    }
}









var setIntervalCallIds = { item1: null, item2: null, item3: null, item4: null };





var conveyorBelt = document.createElement('div');


var containers = {

    bin1: { element: document.createElement('img'), x: 100, y: 700, itemIdsInBin: [], shipped: false },
    bin2: { element: document.createElement('img'), x: 350, y: 700, itemIdsInBin: [], shipped: false },
    bin3: { element: document.createElement('img'), x: 650, y: 700, itemIdsInBin: [], shipped: false },
    bin4: { element: document.createElement('img'), x: 1000, y: 700, itemIdsInBin: [], shipped: false }

};


function paintBins() {

    for (var i in containers) {
        containers[i].element.style.left = containers[i].x;
        containers[i].element.style.top = containers[i].y;
        containers[i].element.className = `${i}`;
        containers[i].element.id = `${i}`;
        containers[i].element.src = 'darkbrownbox.svg';
        containers[i].element.alt = 'orange box';
        wrapper.appendChild(containers[i].element);


    }


}
var shippingTable = { element: document.createElement('img'), x: 1100, y: 200 };
function paintShippingArea() {
    shippingTable.element.src = 'shipping-area.svg';
    shippingTable.element.alt = 'shipping area';
    shippingTable.element.style.left = shippingTable.x + 'px';
    shippingTable.element.style.top = shippingTable.y + 'px';
    shippingTable.element.style.position = 'absolute';
    shippingTable.element.style.height = '400px';
    wrapper.appendChild(shippingTable.element);

}



var itemSrcs = { 'type1': "type1.svg", 'type2': "type2.svg", 'type3': "type3.svg", 'type4': "type4.svg", 'type5': "type5.svg", 'type6': "type6.svg" };




function paintReceipts() { 
    if(!playing){
        return;
    }
    for (let i in receipts) {

        var receipt = receipts[i];
        if (receipts[i].element.innerHTML == "") { //checks if this receipt is already being displayed
            receipts[i].element.innerHTML += `<div class='timer' > <div class='timer-timeElapsed' id='timer${i}'></div></div>`;
            receipts[i].element.innerHTML += ` Order No. ${Math.floor(Math.random() * 999999)} <br>`;

            for (var itemType in receipt.receiptContent) { //itemType is the key


                var amount = receipt.receiptContent[itemType]; //this is the value
                receipts[i].element.innerHTML += `<img src = ${itemSrcs[itemType]}> x ${amount} </img>  <br>`;

            }
            
            
            wrapper.appendChild(receipts[i].element);
            //receipts[i] = createTimer(receipts[i], i);
           
        }
        receipts[i].element.style.top = receipt.y + 'px';
        receipts[i].element.style.left = receipt.x + 'px';

        //increment timer
        var timeElapsed = document.getElementById(`timer${i}`);
        if (timeElapsed){
        if (timeElapsed.offsetWidth<= 0){

            if(receipts[i].x == 0){
            setTimeout(shiftReceiptsUp(receipts[i]), 500);
            lastEmptyReceiptPosition -=150;
            }
            receipts[i].element.remove();
            removedReceipts++;
        }
        var newWidth = timeElapsed.offsetWidth -=2;
        
        timeElapsed.style.width = newWidth +  'px';
    }
      
        
    }
    
    setTimeout(paintReceipts, 1000);

}

var removedReceipts = 0;

function paintConveyorBelt() {

       
    var conveyorBelt = document.createElement('div');
    conveyorBelt.className = 'conveyorBelt';
    conveyorBelt.id = 'conveyorBelt';
    for (var i = 0; i < 2; i++) {
        conveyorBelt.innerHTML += `
         <img  src = 'conveyorbelt-tile.svg' alt = 'conveyorTop' style='width: 60px; height: 60px; transform: rotate(90deg)'></img>
        <img  src = 'conveyorbelt-tile.svg' alt = 'conveyorTop' style='width: 60px; height: 60px; transform: rotate(90deg)'></img>
        <img  src = 'conveyorbelt-tile.svg' alt = 'conveyorTop' style='width: 60px; height: 60px; transform: rotate(90deg)'></img>
        <img  src = 'conveyorbelt-tile.svg' alt = 'conveyorTop' style='width: 60px; height: 60px; transform: rotate(90deg)'></img>
        <img  src = 'conveyorbelt-tile.svg' alt = 'conveyorTop' style='width: 60px; height: 60px; transform: rotate(90deg)'></img>
        <img  src = 'conveyorbelt-tile.svg' alt = 'conveyorTop' style='width: 60px; height: 60px; transform: rotate(90deg)'></img>
        <img  src = 'conveyorbelt-tile.svg' alt = 'conveyorTop' style='width: 60px; height: 60px; transform: rotate(90deg)'></img>
        <img  src = 'conveyorbelt-tile.svg' alt = 'conveyorTop' style='width: 60px; height: 60px; transform: rotate(90deg)'></img>
        <img  src = 'conveyorbelt-tile.svg' alt = 'conveyorTop' style='width: 60px; height: 60px; transform: rotate(90deg)'></img>
        <img  src = 'conveyorbelt-tile.svg' alt = 'conveyorTop' style='width: 60px; height: 60px; transform: rotate(90deg)'></img>
        <img  src = 'conveyorbelt-tile.svg' alt = 'conveyorTop' style='width: 60px; height: 60px; transform: rotate(90deg)'></img>
        <img  src = 'conveyorbelt-tile.svg' alt = 'conveyorTop' style='width: 60px; height: 60px; transform: rotate(90deg)'></img>
        <img  src = 'conveyorbelt-tile.svg' alt = 'conveyorTop' style='width: 60px; height: 60px; transform: rotate(90deg)'></img>
        <img  src = 'conveyorbelt-tile.svg' alt = 'conveyorTop' style='width: 60px; height: 60px; transform: rotate(90deg)'></img>
        <img  src = 'conveyorbelt-tile.svg' alt = 'conveyorTop' style='width: 60px; height: 60px; transform: rotate(90deg)'></img>
        <img  src = 'conveyorbelt-tile.svg' alt = 'conveyorTop' style='width: 60px; height: 60px; transform: rotate(90deg)'></img>
        <img  src = 'conveyorbelt-tile.svg' alt = 'conveyorTop' style='width: 60px; height: 60px; transform: rotate(90deg)'></img>
        <img  src = 'conveyorbelt-tile.svg' alt = 'conveyorTop' style='width: 60px; height: 60px; transform: rotate(90deg)'></img>
        <img  src = 'conveyorbelt-tile.svg' alt = 'conveyorTop' style='width: 60px; height: 60px; transform: rotate(90deg)'></img>
        <img  src = 'conveyorbelt-tile.svg' alt = 'conveyorTop' style='width: 60px; height: 60px; transform: rotate(90deg)'></img>
        <img  src = 'conveyorbelt-tile.svg' alt = 'conveyorTop' style='width: 60px; height: 60px; transform: rotate(90deg)'></img>
        <img  src = 'conveyorbelt-tile.svg' alt = 'conveyorTop' style='width: 60px; height: 60px; transform: rotate(90deg)'></img>
        <img  src = 'conveyorbelt-tile.svg' alt = 'conveyorTop' style='width: 60px; height: 60px; transform: rotate(90deg)'></img>
        <img  src = 'conveyorbelt-tile.svg' alt = 'conveyorTop' style='width: 60px; height: 60px; transform: rotate(90deg)'></img> <br>`;
    }

    wrapper.appendChild(conveyorBelt);



    
}
 function paintPlayer(){
    player = document.createElement('img');
    player.src = "character.svg";
    player.alt = "my character";
    player.className = 'player';
    player.style.top = playerY + 'px';
    player.style.left = playerX + 'px';
    wrapper.appendChild(player);

 }

var typesOfItems = ["type1", "type2", "type3", "type4", "type5", "type6"];


var receipts = [];
var lastEmptyReceiptPosition = 170;

var maxItemsInBox = 5;
var numberOfOrdersGenerated = 0;
function generateOrder() {

    //start with a box of max 5 items


    var receiptDiv = document.createElement('div');
    receiptDiv.style.backgroundImage = "url('receipt paper.png')";
    receiptDiv.style.position = 'absolute';
    receiptDiv.style.width = 120 + 'px';
    receiptDiv.style.height = 120 + 'px';
   
    

    var chosenItems = { x: 0, y: 0, receiptContent: {}, element: receiptDiv};

 





    for (var i = 0; i < maxItemsInBox; i++) {
        var randomItem = Math.floor(Math.random() * typesOfItems.length);
        if (typesOfItems[randomItem] in chosenItems.receiptContent) {
            chosenItems.receiptContent[typesOfItems[randomItem]]++;
        }
        else {
            chosenItems.receiptContent[typesOfItems[randomItem]] = 1;
        }
    }
    chosenItems.x = 0;

    chosenItems.y = lastEmptyReceiptPosition;
    lastEmptyReceiptPosition += 150;

    receipts.push(chosenItems);
    numberOfOrdersGenerated++;

   

    setTimeout(generateOrder, 30000);






}

function generateNewItemOnBelt() {

    var randomItem = Math.floor(Math.random() * typesOfItems.length);
    var itemType = typesOfItems[randomItem];
    var newItemElement = document.createElement('img');
    newItemElement.id = items.length;
    newItemElement.src = itemSrcs[itemType];
    newItemElement.alt = `item${items.length}`;
    newItemElement.style.position = "absolute";
    newItemElement.style.width = 40 + 'px';
    newItemElement.style.height = 40 + 'px';
    items.push({ element: newItemElement, x: 0, y: 70, onBelt: true, inPackageId: null, type: itemType });
    setTimeout(generateNewItemOnBelt, 1000);

}



var viewportWidth = window.innerWidth;
var viewportHeight = window.innerHeight;

var playKeys = {};

playKeys["Space"] = false;
playKeys["KeyP"] = false;
playKeys["Enter"] = false;

function keyBeingPressed(event) {
   
    if (event.code != "Space" && event.code != "KeyP" && event.code != "Enter") {
        playKeys[event.code] = true;

    }
}


function keyNotBeingPressed(event) {
    if (event.code != "Space" && event.code != "KeyP" && event.code != "Enter") {
        playKeys[event.code] = false;
    }
}



document.addEventListener('keydown', keyBeingPressed);
document.addEventListener('keyup', keyNotBeingPressed);
function isCollisionBelowPlayer(){
    var anObstacle =null;
        for (let r in receipts){
            if(isCollision(receipts[r])){
            if((playerY + player.offsetHeight) == receipts[r].y){
            anObstacle = receipts[r];
            }
        }
        }
        for (let bin in containers){
            if(isCollision(containers[bin])){
            if((playerY + player.offsetHeight) == containers[bin].y){
            anObstacle = containers[bin];
            }
        }
        }
        if(isCollision(shippingTable)){
         if((playerY + player.offsetHeight) == shippingTable.y){
            anObstacle = shippingTable;
         }
        }
    return anObstacle;
}
function isCollisionAbovePlayer(){
    var anObstacle =null;
    for (let r in receipts){
        if(isCollision(receipts[r])){
        if(playerY == (receipts[r].y +receipts[r].element.offsetHeight)){
        anObstacle = receipts[r];
        }
    }
    }
    for (let bin in containers){
        if(isCollision(containers[bin])){
        if(playerY == (containers[bin].y +containers[bin].element.offsetHeight)){
        anObstacle = containers[bin];
        }
    }
    }
    if(isCollision(shippingTable)){
     if(playerY == (shippingTable.y +shippingTable.element.offsetHeight)){
        anObstacle = shippingTable;
     }
    }
return anObstacle;

}
function isCollisionRightOfPlayer(){
    var anObstacle =null;
    for (let r in receipts){
        if(isCollision(receipts[r])){
        if((playerX + player.offsetWidth) == receipts[r].x){
        anObstacle = receipts[r];
        }
    }
    }
    for (let bin in containers){
        if(isCollision(containers[bin])){
        if((playerX + player.offsetWidth) == containers[bin].x){
        anObstacle = containers[bin];
        }
    }
    }
    if(isCollision(shippingTable)){
     if((playerX + player.offsetWidth) == shippingTable.x){
        anObstacle = shippingTable;
     }
    }
    return anObstacle;
}
function isCollisionLeftOfPlayer(){
    var anObstacle = null;
    for (let r in receipts){
        if(isCollision(receipts[r])){
            if(playerX == (receipts[r].x + receipts[r].element.offsetWidth)){
        anObstacle = receipts[r];
            }
        }
    }
    for (let bin in containers){
        if(isCollision(containers[bin])){
            if(playerX == (containers[bin].x + containers[bin].element.offsetWidth)){   
        anObstacle = containers[bin];
        }
    }
    }
     if(isCollision(shippingTable)){
        if(playerX == (shippingTable.x + shippingTable.element.offsetWidth)){
        anObstacle = shippingTable;
     }
    }
    return anObstacle;
    
}
function movePlayer() {
    var changeInX = 0;
    var changeInY = 0;

    if (playKeys['KeyW'] && playerY - 10 > 0 && playerY - 10 > 100 && (isCollisionAbovePlayer() == null || isCollisionAbovePlayer().element == playerIsCarrying)) {
        changeInY -= 10;

    }
    if (playKeys['KeyS'] && playerY + player.offsetHeight + 10 < viewportHeight &&  (isCollisionBelowPlayer() == null || isCollisionBelowPlayer().element == playerIsCarrying)) {
        changeInY += 10;
        }
    console.log(isCollisionLeftOfPlayer() == playerIsCarrying);
    console.log(playerIsCarrying);
    console.log(isCollisionLeftOfPlayer());
    
    if (playKeys['KeyA'] && playerX - 10 > 0 && (isCollisionLeftOfPlayer() == null || isCollisionLeftOfPlayer().element == playerIsCarrying)) {
        changeInX -= 10;
    }
    if (playKeys['KeyD'] && playerX + player.offsetWidth + 10 < viewportWidth && (isCollisionRightOfPlayer() == null || isCollisionRightOfPlayer().element == playerIsCarrying)) {
        changeInX += 10;
    }
    playerY += changeInY;
    playerX += changeInX;
    for (let i in items) {  
        if (items[i] == playerIsCarrying && playerIsCarrying != null) {
            items[i].x += changeInX;
            items[i].y += changeInY;
            items[i].element.style.left = items[i].x + 'px';
            items[i].element.style.top = items[i].y + 'px';
        }
    }
    for (let c in containers) {
        if (containers[c] == playerIsCarrying && playerIsCarrying != null) {
            containers[c].x += changeInX;
            containers[c].y += changeInY;
            containers[c].element.style.left = containers[c].x + 'px';
            containers[c].element.style.top = containers[c].y + 'px';
            for (let i of containers[c].itemIdsInBin) {
                var itemInThisBin = items[i];
                itemInThisBin.x += changeInX;
                itemInThisBin.y += changeInY;
                itemInThisBin.element.style.left = itemInThisBin.x + 'px';
                itemInThisBin.element.style.top = itemInThisBin.y + 'px';

            }

        }
    }
    for (let r in receipts) {
        if (receipts[r].element == playerIsCarrying && playerIsCarrying != null) {
            receipts[r].x += changeInX;
            receipts[r].y += changeInY;
            receipts[r].element.style.left = receipts[r].x + 'px';
            receipts[r].element.style.top = receipts[r].y + 'px';
        }
    }
    player.style.top = playerY + 'px';
    player.style.left = playerX + 'px';

}


var close = new Audio('close-box.mp3');
function closePackage(event) {
    for (let r in receipts) {
        if (playerIsCarrying == receipts[r].element) {

           
            for (let bin in containers) {

                    if (isCollision(containers[bin])) {
                        playKeys["Enter"] = !playKeys["Enter"];
                        if (playKeys["Enter"] == true) {
                            close.play();
                            containers[bin].element.src = "darkbrownboxclosed.svg";
                            containers[bin].receiptContent = receipts[r].receiptContent;
                            receipts[r].element.remove();
                            removedReceipts++;
                            receipts = receipts.filter((receipt) => receipt != receipts[r]);

                            return;
                        }
                        else {

                            containers[bin].element.src = "darkbrownbox.svg";
                            return;
                        }
                  

                    }
                
            }

        }
    }



}
var finishedPackages = [];
function getScore() {
    var totalScore = 0;
    for (let package of finishedPackages) {
        var thisPackage = containers[package];
        var thisReceipt = thisPackage.receiptContent;
        var itemsInPackage = thisPackage.itemIdsInBin;
        console.log(thisReceipt);
        for (let i of itemsInPackage) {
            for (let itemType in thisReceipt) {
                if (itemType == items[i].type) { //this item is on the assigned receipt 
                    if (thisReceipt[itemType] > 0) {
                        thisReceipt[itemType] -= 1;
                    }
                }
            }

        }
        var score = maxItemsInBox;

        if (thisReceipt) {
            for (let itemType in thisReceipt) {
                score -= thisReceipt[itemType]; //any items not accounted for go against you!
            }
            totalScore += score;

        }
       

    }
    var missedOrders = numberOfOrdersGenerated-finishedPackages.length;
    totalScore -= missedOrders*3;
    if (totalScore<0){ return 0;}
    return totalScore;
}

function isCollision(object) { 
     return !((playerY + player.offsetHeight) <object.y || 
    playerY > (object.y +object.element.offsetHeight) ||
    (playerX + player.offsetWidth) <object.x ||
    playerX > (object.x +object.element.offsetWidth));
    
}

function pickUpBin(event) {

    for (let i in containers) {
        var thisBin = containers[i];
        
         
            if(isCollision(thisBin)){
                playKeys["KeyP"] = !playKeys["KeyP"];
                if (playKeys["KeyP"] == true) {

                    pickup.play();
                    console.log(`this package ${i} will be picked up!`);
                    playerIsCarrying = thisBin;
                    return;
                }
                else {
                    console.log(`this package ${i} will be dropped off!`);
                    if (thisBin.x + thisBin.element.offsetWidth / 2 > 1000 && thisBin.y + thisBin.element.offsetHeight / 2 > 300) {
                        ship.play()
                        finishedPackages.push(i);
                        var newBin = {element: thisBin.element, x: thisBin.x, y: thisBin.y, shipped: false};
                        containers[i].shipped = true;
                        containers[i].element.style.width = '40px';
                        containers[i].element.style.height = '40px';
                        containers[i].element.style.left = '1150px';
                        for (let i of thisBin.itemIdsInBin) {
                            items[i].element.style.width = '1px';
                            items[i].element.style.height = '1px';
                        }
                       
                        containers.push(newBin);
                        console.log(containers);
                    }
                    pickup.play();
                    playerIsCarrying = null;
                    return;
                }

            }
        
    }

}

function repaintMovingReceiptOrBin() {
    for (let r in receipts) {
        if (playerIsCarrying == receipts[r].element) {
            receipts[r].element.style.left = receipts[r].x + 'px';
            receipts[r].element.style.top = receipts[r].y + 'px';
            return;
        }
        for (let bin in containers) {
            if (playerIsCarrying == containers[bin]) {
                containers[bin].element.style.left = containers[bin].x;
                containers[bin].element.style.top = containers[bin].y;
            }
        }
    }
}


function showScore() {
    var scoreScreen = document.createElement('div');
    scoreScreen.className = "score";
    scoreScreen.innerHTML = `<h1> GAME OVER! </h1><h1>Score: ${getScore()} </h1> `;
    wrapper.appendChild(scoreScreen);
}



function gameLoop() {
    var targetFPS = 60;
    movePlayer();
    moveItemsOnBelt(items);
   paintAllItems(items);
    repaintMovingReceiptOrBin();
    paintBins();

    if (!playing) {
        showScore();
        return;
    }


    requestAnimationFrame(() => {
        setTimeout(gameLoop, targetFPS);

    });



}

gameTimer();
paintConveyorBelt();
paintShippingArea();

paintPlayer();
generateOrder();
generateNewItemOnBelt();
paintReceipts();
gameLoop();
});
