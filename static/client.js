

let streak = Cookies.get('jingleStreak') || 0
console.log("Streak: "+streak)

function GetStreak(){
    return streak
}

function UpdateStreakLabel(){
    document.querySelector("#streakLabel").textContent = "Streak: "+streak
}

function UpdateStreak(newValue){
    streak = newValue
    Cookies.set('jingleStreak', newValue)

    UpdateStreakLabel()
}

function IncrementStreak(inc){
    UpdateStreak(parseInt(streak)+inc)
}


const jsConfetti = new JSConfetti()


const jingleLength = 5;
const numTries = 5;
const noteDelay = 450

var jingle = null;
var tries = []
var currNotes = []
var currTry = 1


const mainTable = document.querySelector("#main")
const btnList = document.querySelector("#buttonList")
const playBtn = document.querySelector("#playBtn");
const playCBtn = document.querySelector("#playC")
const enterBtn = document.querySelector("#enterBtn")
const deleteBtn = document.querySelector("#deleteBtn")
const continueBtn = document.querySelector("#continueBtn")

const notes = ["C","C#","D","D#","E","F","F#","G","G#","A","A#","B"]
const soundFiles = ["C","Cs","D","Ds","E","F","Fs","G","Gs","A","As","B"]
var audioObjects = {}

const successMsgs = [
    "ez",
    "yay",
    "💩💩💩",
    "NICE JOB!!!11!!",
]

const failMsgs = [
    "shitter lmao",
    "damn",
    "suck",
    "bro is not him"
]


var debounce = false;

function GenerateGrid(rows,columns){
    for (let r = 0; r < rows; r++) {
        var newRow = document.querySelector("#rowTemplate").content.cloneNode(true)
        newRow = newRow.querySelector("tr")

        for (let c = 0; c < columns; c++) {
            var newCell = document.querySelector("#cellTemplate").content.cloneNode(true)
            
            newRow.appendChild(newCell);
        }

        mainTable.appendChild(newRow)
    }
}

function SetupAudios(){
    for (let i = 0;i < soundFiles.length;i++){
        var audio = new Audio("../static/notes/"+soundFiles[i]+".mp3");
        audioObjects[soundFiles[i]] = audio
    }
}

function PlayNote(noteName){
    var i = notes.indexOf(noteName)
    var audio = audioObjects[soundFiles[i]];

    if (audio.paused) {
        audio.play();
    }else{
        audio.currentTime = 0
    }
}


function PlayJingle(jingle){
    console.log(jingle)
    for (let i = 0; i < jingle.length; i ++){
        setTimeout(() => PlayNote(jingle[i]), i*noteDelay)
    }
    
}

function GenerateJingle(){
    let poop = [];
    
    for (let i = 0; i < jingleLength; i ++){
        var index = Math.round(Math.random()*(notes.length-1))
        poop.push(notes[index])
    }
    return poop
}

function CreateButtons(notes){
    for (let i = 0; i < notes.length; i++) {
        var newBtn = document.querySelector("#btnTemplate").content.cloneNode(true)
        newBtn = newBtn.querySelector("button")
        newBtn.textContent = notes[i]

        newBtn.onclick = function(){
            if (debounce){
                return
            }
            NotePressed(notes[i])
        }
        btnList.appendChild(newBtn)
    }
}

function ResetGrid(){
    for (let r = 0;r < numTries; r++){
        for (let c = 0; c < jingleLength; c++){
            let cell = mainTable.rows[r].cells[c];
            let cellContent = cell.querySelector(".cellContent")


            let duration = 0

            if (cellContent.dataset.filled == "t"){
                duration = 200

                anime({
                    targets: cellContent,
                    scale: 0,
                    easing: 'easeInOutQuad',
                    direction:"alternate",
                    duration: duration,
                });
            }
            
            setTimeout(() => {
                cell.querySelector(".cellText").textContent = "";
                cellContent.style.backgroundColor = "#ffffff"
                cellContent.dataset.filled = "f"
                cellContent.dataset.outline = "f"
            }, duration);
            
        }
    }
}

function NotePressed(noteName){
    if (currNotes.length >= jingleLength){
        return
    }

    //PlayNote(noteName)

    currNotes.push(noteName)
    let index = currNotes.length - 1
    let cell =  mainTable.rows[currTry-1].cells[index]
    let cellContent = cell.querySelector(".cellContent")
    cellContent.dataset.outline = "t"
    cell.querySelector(".cellText").textContent = noteName

    anime({
        targets: cellContent,
        scale: 1.1,
        easing: 'linear',
        direction:"alternate",
        duration: 30,
    });
}

function Submit(){
    if (currNotes.length < jingleLength){
        return
    }

    debounce = true

    var won = true
    var map = {}

    var totalMap = {}
    for (let v = 0;v<jingle.length;v++){
        totalMap[jingle[v]] = totalMap[jingle[v]] || 0
        totalMap[jingle[v]] += 1
    }

    const animationDuration = 260
    const animationDelay = 260

    const correctColor = "rgb(34, 197, 94)"
    const closeColor = "rgb(234, 179, 8)"
    const wrongColor = "rgb(148, 163, 184)"
    
    let colorMap = {}

    for (let i = 0;i < jingleLength; i ++){ //first pass detect the greens
        let guess = currNotes[i]
        let cell =  mainTable.rows[currTry-1].cells[i]
        let cellContent = cell.querySelector(".cellContent")

        if (guess == jingle[i]){
            //correct placement
            colorMap[i] = correctColor
            map[guess] = map[guess] || 0
            map[guess] += 1

            continue
        }
    }
    
    for (let i = 0;i < jingleLength; i ++){ //second pass detect the yellow and grey
        let guess = currNotes[i]
        let cell =  mainTable.rows[currTry-1].cells[i]
        let cellContent = cell.querySelector(".cellContent")

        if (guess == jingle[i]){
            continue
        }

        won = false

        if (jingle.indexOf(guess) >= 0){
            if (map[guess] && map[guess] >= totalMap[guess]){

            }else{
                colorMap[i] = closeColor
                map[guess] = map[guess] || 0
                map[guess] += 1

                continue
            }
        }

        colorMap[i] = wrongColor
    }

    for (let i = 0;i < jingleLength; i ++){ //last pass do style stuff for all btns
        let guess = currNotes[i]
        let cell =  mainTable.rows[currTry-1].cells[i]
        let cellContent = cell.querySelector(".cellContent")

        
        
        anime({
            targets: cellContent,
            scaleY: 0,
            easing: 'easeInOutQuad',
            direction:"alternate",
            duration: animationDuration,
            delay: animationDelay * i,
        });

        setTimeout(() => {
            cellContent.dataset.filled = "t"
            cellContent.dataset.outline = "f"
            cellContent.style.backgroundColor = colorMap[i]
        }, animationDuration + i*animationDelay);
        
    }


    let ended = currTry == numTries || won


    let delay = (jingleLength+1)*animationDelay
    if (ended){
        delay += 200 //add a delay if game end
    }

    setTimeout(() => {
        debounce = false

        if (ended){
            OnEnd()
        }

        if (won){
            OnWin()
            
        }else{
            //check if is the last try
            console.log(currTry);
            if (currTry == numTries){
                OnLose();
                return
            }
    
            //reset the thing and fucking idk
            tries.push(currNotes)
            currNotes = []
            currTry += 1;
        }


    }, delay);
}

function OnEnd(){
    debounce = true

    continueBtn.style.visibility = "visible"
}

function OnWin(){
    jsConfetti.addConfetti()

    for (let i = 0;i < jingleLength; i ++){ //last pass do style stuff for all btns
        let cell =  mainTable.rows[currTry-1].cells[i]
        let cellContent = cell.querySelector(".cellContent")

        anime({
            targets: cellContent,
            translateY: -23,
            easing: 'easeInOutQuad',
            direction:"alternate",
            duration: 200,
            delay: 100 * i,
        });
        
    }

    PlayJingle(jingle)

    MakeAlert(successMsgs[Math.floor(Math.random()*(successMsgs.length-1))],"success",4000)
    IncrementStreak(1);
}

function OnLose(){

    let answerStr = "";
    for (let i=0; i < jingle.length;i ++){
        answerStr += jingle[i]
        if (i < jingle.length-1){
            answerStr += ", "
        }
    }

    MakeAlert("The answer was "+answerStr,"danger",-1)
    UpdateStreak(0)
}


function Delete(){
    if (currNotes.length <= 0){
        return;
    }

    var index = currNotes.length-1

    let cell = mainTable.rows[currTry-1].cells[index]
    cell.querySelector(".cellText").textContent = ""
    cell.querySelector(".cellContent").dataset.outline = "f"

    currNotes.pop()
    console.log(currNotes)
}

function Setup(){
    ResetGrid()
    debounce = false
    jingle = GenerateJingle();

    continueBtn.style.visibility = "hidden";

    //testhig
    // jingle = []
    // for (let i = 0 ;i < jingleLength;i++){
    //     jingle.push("C")
    // }
    //jingle = ["F","G","F","D#","D#"]

    
    currNotes = []
    currTry = 1;
    tries = []
}

function MakeAlert(text,type,duration){
    var alert = document.querySelector("#alertTemplate").content.cloneNode(true)
    alert = alert.querySelector(".alert")

    
    alert.querySelector(".alertText").textContent = text
    alert.style.visibility = "visible"
    alert.classList.add("alert-"+type||"primary")

    document.body.appendChild(alert)

    if (duration >= 0){
        setTimeout(() => {
            $(".alert").alert('close')
        }, duration);
    }
}



SetupAudios();
GenerateGrid(numTries,jingleLength);
CreateButtons(notes)

Setup()

var playDebounce = false
playBtn.onclick = function(){
    if (playDebounce) {
        return
    }
    playDebounce = true
    setTimeout(() => {
        playDebounce = false
    }, jingleLength * noteDelay);
    PlayJingle(jingle)
}

playCBtn.onclick = function(){
    PlayNote("C")
}

enterBtn.onclick = function(){
    if (debounce){
        return
    }
    Submit()
}

deleteBtn.onclick = function(){
    if (debounce){
        return
    }
    Delete()
}

document.onkeydown = function(event){
    if (event.code == "Backspace"){
        if (debounce){
            return
        }
        Delete()
    }
}

continueBtn.onclick = function(){
    debounce = false;
    Setup();
}

UpdateStreakLabel()
