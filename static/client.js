

let streak = Cookies.get('jingleStreak') || 0
console.log(streak)

function GetStreak(){
    return streak
}

function UpdateStreakLabel(){
    console.log(streak)
    document.querySelector("#streakLabel").textContent = "Streak: "+streak
}

function UpdateStreak(newValue){
    streak = newValue
    Cookies.set('jingleStreak', newValue)

    UpdateStreakLabel()
}

function IncrementStreak(inc){
    UpdateStreak(streak+inc)
}


const jsConfetti = new JSConfetti()


const jingleLength = 5;
const numTries = 2;
const noteDelay = 400

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
        var audio = new Audio("../notes/"+soundFiles[i]+".mp3");
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
    console.log(notes,notes.length)
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
            var cell = mainTable.rows[r].cells[c];
            cell.querySelector(".cellText").textContent = "";
            cell.querySelector(".cellContent").style.backgroundColor = "#ffffff"
            cell.querySelector(".cellContent").dataset.filled = "f"
        }
    }
}

function NotePressed(noteName){
    if (currNotes.length >= jingleLength){
        return
    }

    //PlayNote(noteName)

    currNotes.push(noteName)
    var index = currNotes.length - 1
    var cell =  mainTable.rows[currTry-1].cells[index]
    cell.querySelector(".cellText").textContent = noteName

    console.log(currNotes)
}

function Submit(){
    if (currNotes.length < jingleLength){
        alert("what the sigma")
        return
    }

    var won = true
    var map = {}

    var totalMap = {}
    for (let v = 0;v<jingle.length;v++){
        totalMap[jingle[v]] = totalMap[jingle[v]] || 0
        totalMap[jingle[v]] += 1
    }
    console.log(totalMap)


    for (let i = 0;i < jingleLength; i ++){ //first pass detect the greens
        var guess = currNotes[i]
        var cell =  mainTable.rows[currTry-1].cells[i]
        var cellContent = cell.querySelector(".cellContent")

        if (guess == jingle[i]){
            //correct placement
            cellContent.style.backgroundColor = "rgb(34, 197, 94)"
            map[guess] = map[guess] || 0
            map[guess] += 1

            continue
        }
    }
    
    for (let i = 0;i < jingleLength; i ++){ //second pass detect the yellow and grey
        var guess = currNotes[i]
        var cell =  mainTable.rows[currTry-1].cells[i]
        var cellContent = cell.querySelector(".cellContent")

        if (guess == jingle[i]){
            continue
        }

        won = false

        if (jingle.indexOf(guess) > 0){
            if (map[guess] && map[guess] >= totalMap[guess]){

            }else{
                cellContent.style.backgroundColor = "rgb(234, 179, 8)"
                map[guess] = map[guess] || 0
                map[guess] += 1

                continue
            }
        }

        cellContent.style.backgroundColor = "rgb(148, 163, 184)"
    }

    for (let i = 0;i < jingleLength; i ++){ //last pass do style stuff for all btns
        var guess = currNotes[i]
        var cell =  mainTable.rows[currTry-1].cells[i]
        var cellContent = cell.querySelector(".cellContent")

        cellContent.dataset.filled = "t"
    }


    if (won){
        OnEnd()
        OnWin()
        
    }else{
        //check if is the last try
        console.log(currTry);
        if (currTry == numTries){
            OnEnd()
            OnLose();
            return
        }

        //reset the thing and fucking idk
        tries.push(currNotes)
        currNotes = []
        currTry += 1;
    }
}

function OnEnd(){
    debounce = true

    continueBtn.style.visibility = "visible"
}

function OnWin(){
    jsConfetti.addConfetti()

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
    mainTable.rows[currTry-1].cells[index].querySelector(".cellText").textContent = ""

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
    jingle = ["C","E","C","F","G"]

    
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

playBtn.onclick = function(){
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

continueBtn.onclick = function(){
    debounce = false;
    Setup();
}

UpdateStreakLabel()