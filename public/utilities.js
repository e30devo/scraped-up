function getScrape() {
    $.ajax({
        method: "GET",
        url: (window.location.origin || 'http://localhost:3000') + "/api/data"
    }).then(function (result) {
        $(".modal-body").html(result);
    })
}

$(document).on("click", "#scrapeButton", function () {
    getScrape()
});

$(document).on("click", "#modalConfirm", function () {
    location.reload();
})

$(document).on("keyup click", "#inputSMEx", function (event) {
    if (event.keyCode === 13) {
        const comment = $(this).val()
        const _id = $(this).attr("data")        
        $.ajax({
            method: "POST",
            url: (window.location.origin || 'http://localhost:3000')  + `/api/comment/${_id}`,
            data: {
                comments: `"${comment}"`
            }
        }).then(function (result) {
            location.reload();
            return result
        })
    }
})

$(document).on("click", ".saveButton", function () {
    const _id = $(this).attr("data");
    const button = $(this).attr("id")    
    $.ajax({
        method: "POST",
        url: (window.location.origin || 'http://localhost:3000') + `/api/save/${_id}`,
    }).then(function (result) {
        console.log(result);
        $(".modal-body").html(result);
        return result
    })
})

