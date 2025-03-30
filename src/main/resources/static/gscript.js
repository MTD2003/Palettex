// Generates and replaces a palette on the current HTML.
function generatePalette(){
    const blocks = document.getElementById("palette").childElementCount;
    let indexes = [];
    
    for(let i = 0; i < blocks; i++) { // Randomization process.
        let curBlock = document.getElementById("block" + (i + 1));
        if(!curBlock.classList.contains("locked")) {
            indexes[i] = Math.floor(Math.random() * textures.length);
            
            for(let j = 0; j < i; j++) { // Safety check; don't want there to be repeating textures.
                if(indexes[i] == indexes[j]) {
                    indexes[i] = Math.floor(Math.random() * textures.length);
                    j = 0;
                }
            }
            let boxString = textures[indexes[i]].name;
            curBlock.setAttribute("src", "img/textures/" + boxString + ".png");
            curBlock.setAttribute("alt", boxString);
            document.getElementById("text" + (i + 1)).value = boxString;
        }
    }

    // Unlocks save and favourite buttons (assuming they have been locked)
    document.getElementById("bsave").removeAttribute("disabled");
    document.getElementById("bsave").innerHTML = "Save <i class=\"fa-regular fa-star\"></i>";
    document.getElementById("bfave").innerHTML = "Favourite <i class=\"fa-regular fa-heart\"></i>";

    return;
}

//<button onclick="lockBlock(this.id, "block1")"></button> example function call in html
/* sets block element to not be randomized in subsequent generations. */
function lockBlock(ButtonId,BlockID){
    const button = document.getElementById(ButtonId);
    const block = document.getElementById(BlockID);
    const i_element = button.firstElementChild; // takes the <i> element from the button found at buttonId
    if(i_element.classList.contains("fa-lock-open")){ 
        block.classList.add("locked"); // add locked state
        
        // change button to closed lock
        i_element.classList.replace("fa-lock-open", "fa-lock"); 
        button.classList.replace("btn-secondary", "btn-danger");
    }
    
    else if(i_element.classList.contains("fa-lock")){ 
        block.classList.remove("locked"); // remove locked state

        // change button to open lock
        i_element.classList.replace("fa-lock", "fa-lock-open"); 
        button.classList.replace("btn-danger", "btn-secondary");
    }

    else{ // should never occur
        alert("error, invalid button class.");
    }
    lockGenerate();
    return;
}

// Checks if all blocks are locked, locking the generate button if they are.
function lockGenerate(){
    const blocks = document.getElementById("palette").childElementCount;

    for(let i = 1; i <= blocks; i++) {
        curBlock = document.getElementById("block" + i);
        if(!curBlock.classList.contains("locked")) { // Exits function and removes disable if any block isn't locked.
            document.getElementById("bgenr").removeAttribute("disabled");
            return;
        }
    }

    document.getElementById("bgenr").setAttribute("disabled", true); // Disables button.
    return;
}

// allows lookup of block type using actual name. Then sets the block as the entered type
// format is similar to gold_block or magenta_glazed_terracotta
function lookup(field,blockID){
    const input = document.getElementById(field);
    input.addEventListener("keydown", (Event) => {
        if(Event.key === 'Enter'){
            if(textures.find(o => o.name === input.value) != undefined) { // In case the user enters an invalid name.
                document.getElementById(blockID).setAttribute("src", "img/textures/" + input.value + ".png");
            }
        }
    });
}

// Saves the current block palette to the database if it's not already there.
// Stopping duplicate palettes from being saved may be possible, but that would be at leasat O(N) complex and require asynchronous calls.
function savePalette(){
    const blocks = document.getElementById("palette").childElementCount; // Scalable for possible future updates
    let palette = [];
    
    document.getElementById("bsave").setAttribute("disabled", true);
    document.getElementById("bsave").innerHTML = "Saved <i class=\"fa-solid fa-star\"></i>";
    for(let i = 0; i < blocks; i++) {
        let curBlock = document.getElementById("block" + (i + 1));
        palette[i] = curBlock.alt;
    }
        
    apiCreatePalette(palette, 
        (data) => window.alert("Palette Saved!"), 
        (err) => window.alert("Error: " + err.responseText));

    return;
}

// Adds the current palette to the users favourites using cookies.
function favePalette(){
    
}