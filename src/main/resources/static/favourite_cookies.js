const COOKIE_NAME = "favourite_palettes";

function getFavouritePalettes() {
    const cookieValue = document.cookie
        .split("; ")
        .find((row) => row.startsWith(COOKIE_NAME + "="));

    if (!cookieValue) return [];

    try {
        return JSON.parse(decodeURIComponent(cookieValue.split("=")[1]));
    } catch (e) {
        return [];
    }
}

function addFavouritePalette(code) {
    let favourites = getFavouritePalettes();
    if (!favourites.includes(code)) {
        favourites.push(code);
        document.cookie = `${COOKIE_NAME}=${encodeURIComponent(
            JSON.stringify(favourites)
        )}; path=/`;
    }
}

function removeFavouritePalette(code) {
    let favourites = getFavouritePalettes();
    favourites = favourites.filter((fav) => fav !== code);
    document.cookie = `${COOKIE_NAME}=${encodeURIComponent(
        JSON.stringify(favourites)
    )}; path=/`;
}

function isFavouritePalette(code) {
    return getFavouritePalettes().includes(code);
}
