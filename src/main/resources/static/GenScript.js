// Generates and replaces a palette on the current HTML.
function generatePalette(){
    let blocks = document.getElementById("palette").childElementCount;
    let indexes = [];
    
    for(let i = 0; i < blocks; i++) { // Randomization process.
        let curBlock = document.getElementById("block" + (i + 1));
        if(!curBlock.classList.contains("locked")) {
            indexes[i] = Math.floor(Math.random() * 324); // 324 is the hard-coded number of textures (as of now)
            
            for(let j = 0; j < i; j++) { // Safety check; don't want there to be repeating textures.
                if(indexes[i] == indexes[j]) {
                    indexes[i] = Math.floor(Math.random() * 324);
                    j = 0;
                }
                console.log("img/textures/" + textures[indexes[i]].name + ".png");
            }
            let boxString = textures[indexes[i]].name;
            curBlock.setAttribute("src", "img/textures/" + boxString + ".png");
            document.getElementById("text" + (i + 1)).value = boxString;
        }
    }
}

//<button onclick="lockBlock(this.id, "block1")"></button> example function call in html
/* sets block element to not be randomized in subsequent generations. */
function lockBlock(ButtonId,BlockID){
    let button = document.getElementById(ButtonId);
    let block = document.getElementById(BlockID);
    let i_element = button.firstElementChild; // takes the <i> element from the button found at buttonId
    if(i_element.classList.contains("fa-lock-open")){ 
        block.classList.add("locked"); // add locked state
        
        // change button to closed lock
        i_element.classList.remove("fa-lock-open"); 
        i_element.classList.add("fa-lock"); 
        return;
    }
    
    else if(i_element.classList.contains("fa-lock")){ 
        block.classList.remove("locked"); // remove locked state

        // change button to open lock
        i_element.classList.remove("fa-lock"); 
        i_element.classList.add("fa-lock-open");
        return;
    }

    else{ // should never occur
        alert("error, invalid button class.");
        return;
    }
}

function lookup(){
    
}

