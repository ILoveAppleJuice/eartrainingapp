const jingleLength = 5;
const numTries = 6;

var jingle = null;

const mainTable = document.querySelector("#main")

function GenerateGrid(rows,columns){
    for (let r = 0; r < rows; r++) {
        var newRow = document.querySelector("#rowTemplate").content.cloneNode(true)

        for (let c = 0; c < columns; c++) {
            var newCell = document.querySelector("#cellTemplate").content.cloneNode(true)
            
            console.log(newCell)
            newRow.appendChild(newCell);
        }

        mainTable.appendChild(newRow)
    }
}

function GenerateJingle(){

}

jingle = GenerateJingle();

GenerateGrid(numTries,jingleLength);