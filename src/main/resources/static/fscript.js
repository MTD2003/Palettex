
// Removes favourite from cookies, removes card div page.
function dropFavourite(btnID) {
    const parent = document.getElementById(btnID).parentElement;
    const code = parseInt(parent.getAttribute("id"));
    removeFavouritePalette(code);
    parent.remove();
}

// Fills the favourite page.
// Acts near identical to fillPalettes in pscript.js.
async function fillFavourites(faves) {
    if(faves.length <= 0) {
        document.getElementById("fpt").innerHTML = `
        <div class="no-favorites col-8">
            <h2>No Favourites Yet</h2>
            <p>Visit the generator and click the <i class="fa-regular fa-heart text-danger"></i> to save palettes here.</p>
        </div>`;
        return;
    }

    const fpt = document.getElementById("fpt");
    for(let i = faves.length - 1; 0 < i; i--) {
        apiGetPalette(faves[i],
            (data) => {
                let blocks = data["blocks"];
                fpt.innerHTML += `
                <div id="${faves[i]}" class="col-3 text-center rounded bg-info m-4 py-3">
                    <h3 class="fs-4 py-1">Palette #${faves[i]}</h3>
                    <img src="img/textures/${blocks[0]}.png" alt="${blocks[0]}" class="squeeze"><img src="img/textures/${blocks[1]}.png" alt="${blocks[1]}" class="squeeze"><br>
                    <img src="img/textures/${blocks[2]}.png" alt="${blocks[2]}" class="squeeze"><img src="img/textures/${blocks[3]}.png" alt="${blocks[3]}" class="squeeze">
                    <button id="${faves[i]}-btn" class="btn btn-primary mt-2" style="width: 90%;" onclick="dropFavourite(this.id)">
                        Remove <i class="fa-solid fa-heart-crack"></i>
                    </button>
                </div>
                `;
            },
            (err) => window.alert("Error:" + err.responseText)
        );
        await new Promise(resolve => setTimeout(resolve, 70));
    }
    return;
}

window.addEventListener("load", (event) => {
    fillFavourites(getFavouritePalettes());
});