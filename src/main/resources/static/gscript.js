// Current palette
let paletteId = null;

// Generates and replaces a palette on the current HTML.
function generatePalette() {
    const blocks = document.getElementById("palette").childElementCount;
    let indexes = [];

    let changed = false;
    for (let i = 0; i < blocks; i++) {
        // Randomization process.
        let curBlock = document.getElementById("block" + (i + 1));
        if (!curBlock.classList.contains("locked")) {
            changed = true;
            indexes[i] = Math.floor(Math.random() * textures.length);

            for (let j = 0; j < i; j++) {
                // Safety check; don't want there to be repeating textures.
                if (indexes[i] == indexes[j]) {
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

    if (changed) onPaletteChange();

    return;
}

// Unlocks save and favourite buttons (assuming they have been locked)
function onPaletteChange() {
    paletteId = null;
    saveButtonAvailable("Save");
    document.getElementById("bfave").classList.remove("faved");
    document.getElementById("bfave").innerHTML =
        'Favourite <i class="fa-regular fa-heart"></i>';
}

//<button onclick="lockBlock(this.id, "block1")"></button> example function call in html
/* sets block element to not be randomized in subsequent generations. */
function lockBlock(ButtonId, BlockID) {
    const button = document.getElementById(ButtonId);
    const block = document.getElementById(BlockID);
    const i_element = button.firstElementChild; // takes the <i> element from the button found at buttonId
    if (i_element.classList.contains("fa-lock-open")) {
        block.classList.add("locked"); // add locked state

        // change button to closed lock
        i_element.classList.replace("fa-lock-open", "fa-lock");
        button.classList.replace("btn-secondary", "btn-danger");
    } else if (i_element.classList.contains("fa-lock")) {
        block.classList.remove("locked"); // remove locked state

        // change button to open lock
        i_element.classList.replace("fa-lock", "fa-lock-open");
        button.classList.replace("btn-danger", "btn-secondary");
    } else {
        // should never occur
        alert("error, invalid button class.");
    }
    lockGenerate();
    return;
}

// Checks if all blocks are locked, locking the generate button if they are.
function lockGenerate() {
    const blocks = document.getElementById("palette").childElementCount;

    for (let i = 1; i <= blocks; i++) {
        curBlock = document.getElementById("block" + i);
        if (!curBlock.classList.contains("locked")) {
            // Exits function and removes disable if any block isn't locked.
            document.getElementById("bgenr").removeAttribute("disabled");
            return;
        }
    }

    document.getElementById("bgenr").setAttribute("disabled", true); // Disables button.
    return;
}

// allows lookup of block type using actual name. Then sets the block as the entered type
// format is similar to gold_block or magenta_glazed_terracotta
function lookup(field, blockID) {
    const input = document.getElementById(field);
    input.addEventListener("keydown", (Event) => {
        if (Event.key === "Enter") {
            if (textures.find((o) => o.name === input.value) != undefined) {
                // In case the user enters an invalid name.
                const block = document.getElementById(blockID);
                block.setAttribute("src", "img/textures/" + input.value + ".png");
                block.setAttribute("alt", input.value);
                onPaletteChange();
            }
        }
    });
}

// Saves the current block palette to the database if it's not already there.
function savePalette() {
    // Check if already saved
    if (paletteId) {
        showSavedPopup();
        return;
    }

    const blocks = document.getElementById("palette").childElementCount; // Scalable for possible future updates
    let palette = [];
    saveButtonUnavailable("Save");

    for (let i = 0; i < blocks; i++) {
        let curBlock = document.getElementById("block" + (i + 1));
        palette[i] = curBlock.alt;
    }

    apiCreatePalette(
        palette,
        (data) => {
            saveButtonAvailable("Saved");
            paletteId = data["code"];
            showSavedPopup();
        },
        (err) => {
            window.alert("Error: " + err.responseText);
            saveButtonAvailable("Save");
            paletteId = null;
        }
    );

    return;
}

function showSavedPopup() {
    let button = $("#bsave");
    let popup = $("#savedPopup");
    let buttonPosition = button.position();
    let buttonHeight = button.outerHeight();
    popup
        .css({
            top: buttonPosition.top + buttonHeight + 10 + "px", // 10px margin below button
            left: "50%",
            transform: "translateX(-50%)",
            display: "block",
        })
        .addClass("show");
    $("#paletteText").text("Saved Palette #" + paletteId);
}

function saveButtonAvailable(text) {
    document.getElementById("bsave").removeAttribute("disabled");
    document.getElementById("bsave").innerHTML =
        text + ' <i class="fa-regular fa-star"></i>';
}

function saveButtonUnavailable(text) {
    document.getElementById("bsave").setAttribute("disabled", true);
    document.getElementById("bsave").innerHTML =
        text + ' <i class="fa-solid fa-star"></i>';
}

// Adds the current palette to the users favourites using cookies.
async function favePalette() {
    const favBtn = document.getElementById("bfave");
    if(!(paletteId)) {
        savePalette();
        await new Promise(resolve => setTimeout(resolve, 300)); // Lazy solution: Wait as we save the palette.
    }
    
    if(favBtn.classList.contains("faved")) { 
        removeFavouritePalette(paletteId);
        favBtn.classList.remove("faved");
        favBtn.innerHTML = `
            Favourite <i class="fa-regular fa-heart"></i>`;
        return;
    }

    addFavouritePalette(paletteId);
    favBtn.classList.add("faved");
    favBtn.innerHTML = `
        Unfavourite <i class="fa-solid fa-heart"></i>`;
    return;
}

// Sets a block on the page
function setBlock(num, block) {
    //console.log("Setting " + num + " to " + block);
    $("#text" + num).val(block);
    $("#block" + num).attr("src", "img/textures/" + block + ".png");
    $("#block" + num).attr("alt", block);
}

$(document).ready(function () {
    const urlParams = new URLSearchParams(window.location.search);
    let code = urlParams.get("code");
    if (code) {
        apiGetPalette(
            code,
            (data) => {
                console.log(data["blocks"]);
                for (let i = 0; i < data["blocks"].length; i++) {
                    setBlock(i + 1, data["blocks"][i]);
                }
                saveButtonAvailable("Saved");
                paletteId = code;
            },
            (err) => {
                alert("Failed to load palette with code " + code);
            }
        );
        // Bug: This code just doesn't work sometimes. 90% sure it has to do with page loading.
        if(isFavouritePalette(code.toString())) {
            const favBtn = document.getElementById("bfave");
            favBtn.classList.add("faved");
            favBtn.innerHTML = `
                Unfavourite <i class="fa-solid fa-heart"></i>`;
        }
    }

    $("#copyLinkBtn").click(function () {
        navigator.clipboard
            .writeText(
                `${window.location.origin}/generator.html?code=${paletteId}`
            )
            .catch(function (error) {
                console.error("Copy failed", error);
            });
    });

    $(document).click(function (event) {
        if (!$(event.target).closest("#bsave, #savedPopup").length) {
            console.log("aa");
            $("#savedPopup").removeClass("show").hide();
        }
    });
});
