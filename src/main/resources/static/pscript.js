// This function adds a palette in the saved palettes list to a user's favourites using cookies.
// May also remove a palette from saved palettes list if it is already favourited.
// Note that the parent node ID is the same as the palettes code.
function faveSelect(faveID) {
    const button = document.getElementById(faveID);
    const parent = button.parentElement;
    const texcode = parseInt(parent.getAttribute("id"));
    if(parent.classList.contains("faved")) {
        parent.classList.remove("faved");
        removeFavouritePalette(texcode);

        button.innerHTML = "Favourite <i class=\"fa-regular fa-heart\"></i>";
    } else {
        parent.classList.add("faved");
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