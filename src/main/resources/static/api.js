function apiCreatePalette(blocks, onSuccess, onError) {
    const request = $.ajax({
        url: "/api/createPalette",
        method: "POST",
        data: { blocks },
        dataType: "json",
    });
    if (onSuccess) request.done(onSuccess);
    if (onError) request.fail(onError);
    return request;
}

function apiGetPalette(code, onSuccess, onError) {
    const request = $.ajax({
        url: `/api/getPalette/${code}`,
        method: "GET",
        dataType: "json",
    });
    if (onSuccess) request.done(onSuccess);
    if (onError) request.fail(onError);
    return request;
}

function apiGetLatestPalette(onSuccess, onError) {
    const request = $.ajax({
        url: "/api/getLatestPalette",
        method: "GET",
        dataType: "json",
    });
    if (onSuccess) request.done(onSuccess);
    if (onError) request.fail(onError);
    return request;
}
