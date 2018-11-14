//https://rickandmortyapi.com/documentation

window.onload = (e) => {

    document.querySelector("#showCharacters").onclick = allCharactersData;
    document.querySelector("#showLocations").onclick = allLocationData;
    document.querySelector("#showEpisodes").onclick = allEpisodeData;
    document.querySelector("#search").onclick = getSearchedData;

    let searchField = document.querySelector("#searchterm");
    const prefix = "tar6248-"; // change 'abc1234' to your banjo id
    const searchKey = prefix + "name";
    const storedName = localStorage.getItem(searchKey);

    if (storedName) {
        searchField.value = storedName;
    } else {
        searchField.value = ""; // a default value if `nameField` is not found
    }

    searchField.onchange = e => {
        localStorage.setItem(searchKey, e.target.value);
    };
};


let displayTerm = "";

const searchBy = {
    "characters": "https://rickandmortyapi.com/api/character",
    "locations": "https://rickandmortyapi.com/api/location",
    "episodes": "https://rickandmortyapi.com/api/episode"
}

//Called when Show All Characters button is pressed
function allCharactersData() {

    const MORTY_URL = searchBy["characters"];

    let url = MORTY_URL;

    document.querySelector("#content").innerHTML = "<b>Searching for " + displayTerm + "</b>";
    ajax(url, jsonShowCharacters);

}

function allLocationData() {

    const MORTY_URL = searchBy["locations"];

    let url = MORTY_URL;

    document.querySelector("#content").innerHTML = "<b>Searching for " + displayTerm + "</b>";

    ajax(url, jsonShowLocations);

}

function allEpisodeData() {

    const MORTY_URL = searchBy["episodes"];

    let url = MORTY_URL;

    document.querySelector("#content").innerHTML = "<b>Searching for " + displayTerm + "</b>";

    ajax(url, jsonShowEpisodes);

}

function ajax(url, method) {
    $.ajax({
        dataType: "json",
        url: url,
        data: null,
        success: method,
        error: errorOut
    });
    $("#content").fadeOut(100);
}

function getSearchedData() {
    let term = document.querySelector("#searchterm").value;
    displayTerm = term;
    term = term.trim();

    term = encodeURIComponent(term);

    if (term.length < 1) return;

    let searchFor = document.getElementById("searchtype");
    let searchForText = searchFor.options[searchFor.selectedIndex].text.toLowerCase();

    let url = "https://rickandmortyapi.com/api/" + searchForText + "/?name=" + term;

    document.querySelector("#content").innerHTML = "<b>Searching for " + displayTerm + "</b>";
    try {
        if (searchFor.options[searchFor.selectedIndex].value === "name") {
            ajax(url, jsonShowSearchCharacters);
        }
        else if (searchFor.options[searchFor.selectedIndex].value === "episode") {
            ajax(url, jsonShowSearchEpisodes);
        }
        else if (searchFor.options[searchFor.selectedIndex].value === "location") {
            ajax(url, jsonShowSearchLocations);
        }
    }
    catch {
        errorOut();
    }

}

function makePages(obj, type) {
    let nextPage = obj.info.next;

    let nextButton = document.querySelector("#next");
    nextButton.onclick = function (){ajax(nextPage, type)};
}

function jsonShowCharacters(obj) {

    if (!obj.results || obj.results.length == 0) {
        document.querySelector("#content").innerHTML = "<p><i>There are no characters to show</i></p>";
        $("#content").fadeIn(500);
        return;
    }

    let results = obj.results;
    let bigString = "<p><i>There are " + obj.info.count + " total characters.</i></p>";

    makePages(obj, jsonShowSearchCharacters);
    printCharacterResults(results, bigString);
}

function jsonShowLocations(obj) {

    if (!obj.results || obj.results.length == 0) {
        document.querySelector("#content").innerHTML = "<p><i>There are no locations to show</i></p>";
        $("#content").fadeIn(500);
        return;
    }

    let results = obj.results;
    let bigString = "<p><i>There are " + obj.info.count + " total locations</i></p>";

    makePages(obj, jsonShowSearchLocations);
    printLocationResults(results, bigString);
}

function jsonShowEpisodes(obj) {


    if (!obj.results || obj.results.length == 0) {
        document.querySelector("#content").innerHTML = "<p><i>There are no episodes to show</i></p>";
        $("#content").fadeIn(500);
        return;
    }

    let results = obj.results;
    let bigString = "<p><i>There are " + obj.info.count + " total episodes.</i></p>";

    makePages(obj, jsonShowSearchEpisodes);
    printEpisodeResults(results, bigString);
}


function jsonShowSearchCharacters(obj) {


    let searchFor = document.getElementById("searchtype");
    let searchForText = searchFor.options[searchFor.selectedIndex].text.toLowerCase();

    if (!obj.results || obj.results.length == 0) {
        document.querySelector("#content").innerHTML = "<p><i>There are no " + searchForText + "s that match your search input</i></p>";
        $("#content").fadeIn(500);
        return;
    }

    let result = obj.results;
    let bigString = "<p><i>There are " + obj.info.count + " total results for '" + displayTerm + "'</i></p>";

    makePages(obj, jsonShowSearchCharacters);
    printCharacterResults(result, bigString);
}

function jsonShowSearchEpisodes(obj) {


    let searchFor = document.getElementById("searchtype");
    let searchForText = searchFor.options[searchFor.selectedIndex].text.toLowerCase();

    if (!obj.results || obj.results.length == 0) {
        document.querySelector("#content").innerHTML = "<p><i>There are no " + searchForText + "s that match your search input</i></p>";
        $("#content").fadeIn(500);
        return;
    }

    let result = obj.results;
    let bigString = "<p><i> There are" + obj.info.count + " total results for '" + displayTerm + "'</i></p>";

    makePages(obj, jsonShowSearchEpisodes);
    printEpisodeResults(result, bigString);
}

function jsonShowSearchLocations(obj) {


    let searchFor = document.getElementById("searchtype");
    let searchForText = searchFor.options[searchFor.selectedIndex].text.toLowerCase();

    if (!obj.results || obj.results.length == 0) {
        document.querySelector("#content").innerHTML = "<p><i>There are no " + searchForText + "s that match your search input</i></p>";
        $("#content").fadeIn(500);
        return;
    }

    let result = obj.results;
    let bigString = "<p><i>There are " + obj.info.count + " total results for '" + displayTerm + "'</i></p>";

    makePages(obj, jsonShowSearchLocations);
    printLocationResults(result, bigString);
}


function printCharacterResults(results, bs) {
    bs += '<div class = "row">';
    for (let i = 0; i < results.length; i++) {
        let result = results[i];
        let smallURL = result.image;
        if (!smallURL) smallURL = "images/no-image-found.png";

        let line = '<div class = "column"><div class="result-content"><img src =' + smallURL + ' title= ' + result.id + ' />';
        line += "<b>" + result.name + "</b>" + ""
            + "<span><b>Status:</b> " + result.status + "</span>"
            + "<span><b>Gender: </b>" + result.gender + "</span>"
            + "<span><b>Origin: </b>" + result.origin.name + "</span>";
        line += "<br></div></div>";
        bs += line;
    }
    bs += '</div>';

    document.querySelector("#content").innerHTML += bs;

    $("#content").fadeIn(500);
}

function printLocationResults(results, bs) {
    bs += '<div class = "row">';
    for (let i = 0; i < results.length; i++) {
        let result = results[i];
        let line = '<div class = "column"><div class="result-content-loc">';
        line += "<b>" + result.name + "</b>" + ""
            + "<span><b>Type:</b> " + result.type + "</span>"
            + "<span><b>Dimension: </b>" + result.dimension + "</span>";
        line += "<br></div></div>";
        bs += line;
    }
    bs += '</div>';

    document.querySelector("#content").innerHTML += bs;

    $("#content").fadeIn(500);
}

function printEpisodeResults(results, bs) {
    bs += '<div class = "row">';
    for (let i = 0; i < results.length; i++) {
        let result = results[i];
        let line = '<div class = "column"><div class="result-content-loc">';
        line += "<b>" + result.name + "</b>" + ""
            + "<span><b>Air Date:</b> " + result.air_date + "</span>";
        line += "<br></div></div>";
        bs += line;
    }
    bs += '</div>';

    document.querySelector("#content").innerHTML += bs;

    $("#content").fadeIn(500);
}

function errorOut() {
    document.querySelector("#content").innerHTML = "<p><i>There are no results that match your search input for the selected search type. Try something else! </i></p>";
    $("#content").fadeIn(500);
    return;
}