function generatePalette(){
    // will check if blocks have locked state, then randomize ones that do not.
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

