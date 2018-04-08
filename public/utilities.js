function getScrape() {
    $.ajax({
        method: "GET",
        url: "http://localhost:3000/api/data"            
    }).then(function (result) {
        $(".modal-body").html(result);
        // location.reload();
    })
}

$(document).on("click", "#scrapeButton", function () {
    getScrape()
});

$(document).on("click", "#modalConfirm", function(){
    location.reload();
})