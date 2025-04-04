// This function adds a palette in the saved palettes list to a user's favourites using cookies.
// May also remove a palette from saved palettes list if it is already favourited.
// Note that the parent node ID is the same as the palettes code.
function faveSelect(faveID) {
    const button = document.getElementById(faveID);
    const parent = button.parentElement;
    const texcode = parseInt(parent.getAttribute("id"));
    if (button.classList.contains("faved")) {
        button.classList.remove("faved");
        removeFavouritePalette(texcode);

        button.innerHTML = 'Favourite <i class="fa-regular fa-heart"></i>';
    } else {
        button.classList.add("faved");
        addFavouritePalette(texcode);

        button.innerHTML = 'Unfavourite <i class="fa-solid fa-heart"></i>';
    }
}

// Fills the palettes page. Called on page load.
// Takes into account the "start" parameter using URLSearchParams.get
async function fillPalettes(sCode) {
    const urlParams = new URLSearchParams(window.location.search);
    const newStart = urlParams.get("start"); // Gets the start parameter from the URL.

    if (newStart) {
        // If the start value is valid, replace sCode with it (unless it is too high).
        sCode = Math.min(sCode, newStart);
    }

    const endCode = Math.max(0, sCode - 12);
    const spt = document.getElementById("spt"); // SPT stands for saved palette tables, encompassing box.
    let favBtn = ``;

    for (let i = sCode; i > endCode; i--) {
        // Handling favourite button/favourites.
        if (isFavouritePalette(i)) {
            favBtn = `
            <button id="${i}-btn" class="btn btn-danger mt-2 faved" style="width: 90%;" onclick="faveSelect(this.id)">
                Unfavourite <i class="fa-solid fa-heart"></i>
            </button>
            `;
        } else {
            favBtn = `
            <button id="${i}-btn" class="btn btn-danger mt-2" style="width: 90%;" onclick="faveSelect(this.id)">
                Favourite <i class="fa-regular fa-heart"></i>
            </button>
            `;
        }

        // Putting the html into the spt with proper textures.
        let data = null;
        try {
            data = await apiGetPalette(i);
        } catch (err) {
            window.alert("Error: " + err.responseText);
            continue;
        }
        let tblock = data["blocks"];
        spt.innerHTML += `
            <div id="${i}" class="col-3 text-center rounded bg-info m-4 py-3">
                <h3 class="fs-4 py-1">Palette #${i}</h3>
                <img src="img/textures/${tblock[0]}.png" alt="${tblock[0]}" class="squeeze"><img src="img/textures/${tblock[1]}.png" alt="${tblock[1]}" class="squeeze"><br>
                <img src="img/textures/${tblock[2]}.png" alt="${tblock[2]}" class="squeeze"><img src="img/textures/${tblock[3]}.png" alt="${tblock[3]}" class="squeeze">
                ${favBtn}
            </div>
            `;
    }

    if (endCode > 0) {
        // Add the show more button.
        document.getElementById("next").innerHTML += `
        <form class="text-center" action="palettes.html" method="get">
            <input type="hidden" name="start" value="${endCode}">
            <button class="col-3 fs-5 btn btn-light" type="submit">Show More</button>
        </form>
        `;
    }
}

window.addEventListener("load", (event) => {
    apiGetLatestPalette(
        (data) => fillPalettes(data["code"]),
        (err) => window.alert("Error: " + err.responseText)
    );
});
