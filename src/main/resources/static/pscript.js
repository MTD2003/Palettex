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