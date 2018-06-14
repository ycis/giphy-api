var topics = [
        "Rumi", "Nelson Mandela", "Helen Keller", 
        "Eckhart Tolle", "Dalai Lama", "Thich Nhat Hanh",
        "Marcus Aurelius", "Henry Ford", "Napoleon Hill", "Siddhartha Gautama"
    ];

function pullAPI(){
    var person = $(this).attr("data-person");
    person.replace(" ","+");
    var queryURL = "https://api.giphy.com/v1/gifs/search?q=" +
        person + "&api_key=cW5pu27x1xekDgPvRaLWQjOJl7j18hPz";
        $.ajax({
            url: queryURL,
            method: "GET"
        })
        .then(fillImages);
}

function fillImages(response){
    var imgDiv = $("#images")
        .empty();
    console.log(response);
    console.log(response.data);
    if(response.meta.msg !== "OK") {return};
    var results = response.data;
    var listedCnt = 0;
    for (var i = 0; i < results.length && listedCnt < 11; i++) {
        if (results[i].rating !== "r" && results[i].rating !== "pg-13") {
            var urlInMotion = results[i].images.original.url;
            var urlStill = results[i].images.original_still.url;
            var gifDiv = $("<div>");
            var rating = results[i].rating;
            var p = $("<p>").text("Rating: " + rating);
            var personImage = $("<img class='item'>")
                .attr("src", urlStill)
                .attr("data-static-url", urlStill)
                .attr("data-gif-url",urlInMotion)
                .attr("data-state","Still");
            gifDiv.append(p);
            gifDiv.append(personImage);
            imgDiv.prepend(gifDiv);
            listedCnt++
        }   
    }
}
function fillButtons() {
    var buttonDiv = $("#button-holder")
        .empty();
    for(i = 0; i < topics.length; i++) {
        var newDiv = $("<span> </span>")
        var newButton = $("<button>")
            .attr("type","button")
            .addClass("quote btn btn-outline-primary btn-sm")
            .text(topics[i])
            .attr("data-person",topics[i]);
        // newDiv.append(newButton);
        buttonDiv.append(newButton);
        buttonDiv.append(newDiv);
    };
};

function updateList(event){
    event.preventDefault();
    var newItemHolder = $("#item-input");
    var newItemStr = newItemHolder.val();
    if (typeof newItemStr == "undefined" || newItemStr == "") {
        swal({
            title: "Forget Something?",
            html: '<iframe src="https://giphy.com/embed/y4E6VumnBbIfm" width="240" height="240" frameBorder="0" class="giphy-embed" allowFullScreen></iframe><p>There was no name entered into the entry field</p>',
          });
        return;
    } 
    var isListed = false;
    for(var i = 0; i < topics.length; i++) {
        if(topics[i]== newItemStr) {
            isListed = true;
        }
    }
    newItemHolder.val("");
    if(isListed == true) {
        swal({
            title: "Umm, Yeahhhh...",
            html: '<iframe src="https://giphy.com/embed/VcWnY3R6YWVtC" width="300" height="173" frameBorder="0" class="giphy-embed" allowFullScreen></iframe><p>That person is already listed. Please try again.</p>',
          });
    } else {
        topics.push(newItemStr);
        fillButtons();
    }
}

$(document).ready(function() {
    fillButtons();
    $("#main").on("click",".quote",pullAPI);
    $("#addItem").click(updateList);
    $("#images").on("click",".item",function(){
        var currentState = $(this).attr("data-state")
        var urlStill = $(this).attr("data-static-url")
        var urlInMotion = $(this).attr("data-gif-url")
        if(currentState == "Still") {
            $(this).attr("src", urlInMotion)
                .attr("data-state","Gif-In-Motion");
        } else {
            $(this).attr("src", urlStill)
                .attr("data-state","Still");
        }
    })
});