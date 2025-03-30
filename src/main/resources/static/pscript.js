// This function adds a palette in the saved palettes list to a user's favourites using cookies.
// May also remove a palette from saved palettes list if it is already favourited.
// Note that the parent node ID is the same as the palettes code.
function faveSelect(faveID) {
    const button = document.getElementById(faveID);
    const parent = button.parentElement;
    const texcode = parseInt(parent.getAttribute("id"));
    if(button.classList.contains("faved")) {
        button.classList.remove("faved");
        removeFavouritePalette(texcode);

        button.innerHTML = "Favourite <i class=\"fa-regular fa-heart\"></i>";
    } else {
        button.classList.add("faved");
        addFavouritePalette(texcode);

        button.innerHTML = "Unfavourite <i class=\"fa-solid fa-heart\"></i>";
    }
}

function deleteAuth(tabId){
    const pass = "placeholder"; //I want to use the edit password for the db, without having it shown. How do?
    const enteredPass = prompt("enter password to delete");
        if(enteredPass === pass){
            const table = document.getElementById(tabId);
            for(let i = 0; i < table.rows.length; i++){
                let row = table.rows[i];
                for(let j = 0; j< row.cells.length; j++){
                    let indivPalette = row.cells[j];
                    indivPalette.innerHTML += '<button class="btn btn-secondary" onclick="delete(${tabId})"><i class="fa-solid fa-trash-can"></i></button>';
                }
            }
        }
        else{
            alert("incorrect authentication");
        }
}
// I don't know how to do API calls
function deleteItem(tabId){
    const table = document.getElementById("SPT");
    
}

async function fillPalettes(lastPalette) {
    const parse = lastPalette.split(":"); // Need to parse the stringify ourselves as JSON.parse doesn't work.
    let sCode = parseInt(parse[2]);

    const endCode = Math.max(0, sCode - 12);
    const spt = document.getElementById("spt"); // SPT stands for saved palette tables, encompassing box.
    let favBtn = ``;

    for(; sCode > endCode; sCode--) {
        // Handling favourite button/favourites.
        if(isFavouritePalette(sCode)) {
            favBtn = `
            <button id="${sCode}-btn" class="btn btn-danger mt-2 faved" style="width: 90%;" onclick="faveSelect(this.id)">
                Unfavourite <i class="fa-solid fa-heart"></i>
            </button>
            `;
        } else {
            favBtn = `
            <button id="${sCode}-btn" class="btn btn-danger mt-2" style="width: 90%;" onclick="faveSelect(this.id)">
                Favourite <i class="fa-regular fa-heart"></i>
            </button>
            `;
        }

        // Putting the html into the spt with proper textures.
        apiGetPalette(sCode,
            (data) => {
                let tblock = data["blocks"];
                spt.innerHTML += `
                <div id="${sCode}" class="col-3 text-center rounded bg-info m-4 py-3">
                    <h3 class="fs-4 py-1">Palette #${sCode}</h3>
                    <img src="img/textures/${tblock[0]}.png" alt="Placeholder" class="squeeze"><img src="img/textures/${tblock[1]}.png" alt="Placeholder" class="squeeze"><br>
                    <img src="img/textures/${tblock[2]}.png" alt="Placeholder" class="squeeze"><img src="img/textures/${tblock[3]}.png" alt="Placeholder" class="squeeze">
                    ${favBtn}
                </div>
                `;
            },
            (err) => window.alert("Error: " + err.responseText)
        );
        await new Promise(resolve => setTimeout(resolve, 50)); // Best way I could find to ensure the loops were synchronized.
    }

    // TODO: Show more button implementation here.
}

window.addEventListener("load", (event) => {
    apiGetLatestPalette(
        (data) => fillPalettes(JSON.stringify(data)),
        (err) => window.alert("Error: " + err.responseText)
    );
});