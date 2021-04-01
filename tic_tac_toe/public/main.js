document.addEventListener('DOMContentLoaded', ()=>{
const X_CLASS='x';
const CIRCLE_CLASS='circle';
const WINNER_COMBINATIONS=[
         [0,1,2],
         [3,4,5],
         [6,7,8],
         [0,3,6],
         [1,4,7],
         [2,5,8],
         [0,4,8],
         [2,4,6]
];

const cellElems=document.querySelectorAll('[data-cell]');
const board=document.getElementById('board');
const winningMessageTextElem=document.querySelector('[data-winning-message-text]');
const winningMessageElem=document.getElementById('winning-message');
const restartButton=document.getElementById('restartButton');
const startButton=document.getElementById('startButton');
const singlePlayerButton=document.querySelector("#singlePlayerButton")
const multiPlayerButton=document.querySelector("#multiPlayerButton")
const multiStart=document.querySelector(".multiStart")
//const submitButton=document.getElementById('submitButton');
let player;
let rad=document.getElementsByName('sign')
let form=document.querySelector('.choice');
let circleTurn;
let turnDisplay=""

//listen to the player number being transmited
let gameMode=""
let playerNum=0//player zero is always going to start first
let ready=false
let enemyReady=false
//let allShipsPlaced=false
//let shotFired=-1
let currentPlayer='user'
//select player mode
singlePlayerButton.addEventListener('click',startSinglePlayer)
multiPlayerButton.addEventListener('click',startMultiPlayer)

let infoDisplay=""

//multiplayer
function startMultiPlayer(){
    form.classList.add('hide')
    multiStart.classList.add('show')

    gameMode="multiPlayer"

    const socket=io();
//get your player number
    socket.on('player-number',num=>{
        if(num===-1){
            infoDisplay.innerHTML="sorry, the server is full"
        }else{
            playerNum=parseInt(num)
            if(playerNum===1) currentPlayer='enemy'//player zero is always going to start first
            console.log(playerNum)
            //get other player status
            socket.emit('check-players')
        }
})
//another player has connected or disconnected
socket.on('player-connection',num=>{
    console.log(`player number ${num} has connected or disconnected`)
    playerConnectedOrDisconnected(num)
})
//on enemy ready
socket.on('enemy-ready',num=>{
    enemyReady=true;
    playerReady(num)
    if(ready) playGameMulti(socket)
})
//check player status
socket.on('check-players', players=>{
    players.forEach((p,i)=>{
        if(p.connected) playerConnectedOrDisconnected(i)
        if(p.ready){
            playerReady(i)
            if(i!==playerNum) enemyReady=true
        }
    })
})
//ready button click
multiStart.addEventListener('click',()=>{
    //choice()
    console.log('multiStart')
    playGameMulti(socket)
})
//setup event listeners for 'firing'
cellElems.forEach(cell=>{
    cell.addEventListener('click',()=>{
        if(currentPlayer==='user' && ready && enemyReady){
            let currentClass=  CIRCLE_CLASS//to indicate which class will be given to the cell
            placeMark(cell,currentClass);
            markPlaced=cell.dataset.id
            socket.emit('mark', markPlaced)
        }
    })
})
//on fire received
socket.on('mark', id=>{
    enemyGo(id)
    const cell=cellElems[id]
    socket.emit('mark-reply', cell.classList)
    playGameMulti(socket)// change turns
})
//on fire reply received
socket.on('mark-reply', classList=>{
    revealSquare(classList)
    playGameMulti(socket)
})
function playerConnectedOrDisconnected(num){
    //console.log(num)
    let playerClass=`.p${parseInt(num)+1}`
    console.log(playerClass)
    document.querySelector(`${playerClass} .connected span`).classList.toggle('green');
    p=document.querySelector(`${playerClass}`)
    if(p.classList.contains('p1')) p.classList.add('o')
    if(p.classList.contains('p2')) p.classList.add('ex')
    console.log(p)
    console.log(currentPlayer, 'current player')
    console.log('enemy ready', enemyReady)
    if(parseInt(num)===playerNum) document.querySelector(playerClass).style.fontWeight='bold';
}
function whoesTurn(){

}
}
//single player
function startSinglePlayer(){
gameMode="singlePlayer"
startButton.addEventListener('click',startSingle);
}

restartButton.addEventListener('click', startSingle);
restartButton.addEventListener('click', removeHide);
 function removeHide(){
   form.classList.remove('hide')
   
 }
 //logic for multiplayer
 function playGameMulti(socket){
     console.log('playGameMulty')
    //  if(endGame){
    //      console.log('endGameMulti')
    //     return
    //  } 
     if(!ready){
         socket.emit('player-ready')
         ready=true
         playerReady(playerNum)//visually indicates if player is ready
     }
     if(enemyReady){
         if(currentPlayer==='user'){
             turnDisplay.innerHTML='Your Go'
         }
         if(currentPlayer==='enemy'){
             turnDisplay.innerHTML="Enemy's go"
         }
     }    
 }
 function playerReady(num){
     console.log('point 4')
    let playerClass=`.p${parseInt(num)+1}`
    console.log('point 5')
    console.log('playerReady function', playerClass)
    document.querySelector(`${playerClass} .ready span`).classList.toggle('green')
 }
 function choice(){
    for (let i=0; i<rad.length; i++){
        if(rad[0].checked){
            player='x';
            circleTurn=false;
            console.log('X is chosen')
        }else if(rad[1].checked){
            player='o'
            circleTurn=true;
            console.log('O is chosen')
        }else{
            alert("CHOOSE THE FIGURE")
        }}
   }
 //logic for single player
function startSingle(){
   console.log('lets get it started')
   choice()
   form.classList.add('hide') 
   console.log('choice is executed')
    
    cellElems.forEach(cell=>{
        cell.classList.remove(X_CLASS);
        cell.classList.remove(CIRCLE_CLASS);
        cell.removeEventListener('click',clickHandler);
        cell.addEventListener('click',clickHandler,{once:true});
    });
    setBoardHoverClass();
    winningMessageElem.classList.remove('show');
    return player;
}

function clickHandler(e){
       const cell=e.target;
       const currentClass= circleTurn ? CIRCLE_CLASS : X_CLASS;//to indicate which class will be given to the cell
       placeMark(cell,currentClass);
       if(checkWin()){
           endGame(false);
           console.log('winn');
       }else if(isDraw()){
           console.log('isDraw');
           endGame(true);
       }else{
        let arr=isSpaceFree();
        aiMove(arr);
        if(checkWin()){
         swapTurn();   
         endGame(false);
         console.log('win');
        }else if(isDraw()){
         console.log('isDraw');
         endGame(true);
        }
       }
       
       //check for win
       //check for Draw
       //switch turns
       //swapTurn();
      // setBoardHoverClass();
}
function isDraw(){
    return [...cellElems].every(cell=>{
        return cell.classList.contains(X_CLASS) || cell.classList.contains(CIRCLE_CLASS);
    })
}
function endGame(draw){
    if(draw){
        winningMessageTextElem.innerText=`DRAW!`;
    }else{
        winningMessageTextElem.innerText=`${circleTurn ? 'O\'s ' : 'X\'s '} Win`;//just writing on baner
    }
    winningMessageElem.classList.add('show');
}
function placeMark(cell,currentClass){
        cell.classList.add(currentClass) 
}
function swapTurn(){
    circleTurn=!circleTurn;//switch the turn to opposite
}
function  setBoardHoverClass(){
    board.classList.remove(X_CLASS);
    board.classList.remove(CIRCLE_CLASS);
    //console.log(circleTurn)
    if(circleTurn){
        board.classList.add(CIRCLE_CLASS);//if circleTurn is true litterally(just hover)
    }else{
        board.classList.add(X_CLASS);//if circleTurn is false(just hover)
    }
}
function checkWin(){
    return WINNER_COMBINATIONS.some(combination=>{
       return combination.every(index=>{
            return cellElems[index].classList.contains(CIRCLE_CLASS);
        }) || combination.every(index=>{
            return cellElems[index].classList.contains(X_CLASS);
        });
    });
}  
function isSpaceFree(){
    let freeSpaceList=[];
    for(let i=0;i<8;i++){
        if(!cellElems[i].classList.contains(X_CLASS) && !cellElems[i].classList.contains(CIRCLE_CLASS)){
            freeSpaceList.unshift(i);   
        } 
    }   
    //console.log(freeSpaceList);
    return freeSpaceList;
}
function aiMove(moveList){
    console.log(player)
    //nst arr=[...cellElems];
    if(!Array.isArray(moveList) || !moveList.length){
        console.log("empty");
        isDraw();
    }else{
        let move=moveList[Math.floor(Math.random()*moveList.length)];
        if (player==='o'){
            cellElems[move].classList.add(X_CLASS)
        }else {
            cellElems[move].classList.add( CIRCLE_CLASS)
        }
    
        console.log(cellElems[move]);   
    }   
}
function enemyGo(cell){
    if(!Array.isArray(moveList) || !moveList.length){
        console.log("empty");
        isDraw();
    }else{
        let move=moveList[Math.floor(Math.random()*moveList.length)];
        cellElems[move].classList.add(X_CLASS)
        console.log(cellElems[move]);   
    }   
}
function revealSquare(classList){
    const enemySquare = cellElems.querySelector(`div[data-id='${shotFired}']`)
    const 
}
})