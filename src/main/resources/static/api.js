function apiInsertPalette(blocks, onSuccess, onError) {
    $.ajax({
        url: "/api/createPalette",
        method: "POST",
        data: { blocks },
        dataType: "json",
        success: onSuccess,
        error: onError,
    });
}

function apiGetPalette(code, onSuccess, onError) {
    $.ajax({
        url: `/api/getPalette/${code}`,
        method: "GET",
        dataType: "json",
        success: onSuccess,
        error: onError,
    });
}

function apiGetLatestPalette(onSuccess, onError) {
    $.ajax({
        url: "/api/getLatestPalette",
        method: "GET",
        dataType: "json",
        success: onSuccess,
        error: onError,
    });
}
