//https://rickandmortyapi.com/documentation

window.onload = (e) => { 
    document.querySelector("#showAlive").onclick = allCharactersData;
    document.querySelector("#search").onclick = getSearchedData;
};

const searchBy = {
  "characters": "https://rickandmortyapi.com/api/character",
  "locations": "https://rickandmortyapi.com/api/location",
  "episodes": "https://rickandmortyapi.com/api/episode"
}

let displayTerm = "";
	
	// 3
	function getSearchedData(){
        let term = document.querySelector("#searchterm").value;
        displayTerm = term;
        term=term.trim();
        
        term = encodeURIComponent(term);
        
        if (term.length<1) return;
        
        let searchFor = document.getElementById("searchtype");
        let searchForText = searchFor.options[searchFor.selectedIndex].text.toLowerCase();
        
        let url = "https://rickandmortyapi.com/api/" + searchForText + "/?" + searchFor.options[searchFor.selectedIndex].value + "=" + term;
        
        document.querySelector("#content").innerHTML = "<b>Searching for " + displayTerm + "</b>";
        console.log(url);
        
        console.log(jQuery);
        console.log($); // $ is an alias to the jQuery object
        
        $.ajax({            
            dataType: "json",
            url: url,
            data: null,
            success: jsonShowSearchCharacters
        });
        $("#content").fadeOut(100);

	}
      function allCharactersData() {
        console.log("allCharactersData() called");
        
        const MORTY_URL = "https://rickandmortyapi.com/api/character/";
        
        let url = MORTY_URL;
        
        document.querySelector("#content").innerHTML = "<b>Searching for " + displayTerm + "</b>";
        console.log(url);
        
        console.log(jQuery);
        console.log($); // $ is an alias to the jQuery object
        
        $.ajax({            
            dataType: "json",
            url: url,
            data: null,
            success: jsonShowCharacters
        });
        $("#content").fadeOut(100);
          
      }

      function jsonShowCharacters(obj){
        console.log("obj = " + obj);
        console.log("obj stringified = " + JSON.stringify(obj));
          if (!obj.results || obj.results.length == 0){
            document.querySelector("#content").innerHTML = "<p><i>There are no characters to show</i></p>";
              $("#content").fadeIn(500);
              return;
          }
          
          let results = obj.results;
          console.log("results.length = " + results.length);
          let bigString = "<p><i>Now showing " + results.length + " characters</i></p>";
          
          printResults(results, bigString);
      }

      function jsonShowSearchCharacters(obj){
        console.log("obj = " + obj);
        console.log("obj stringified = " + JSON.stringify(obj));
          
        let searchFor = document.getElementById("searchtype");
        let searchForText = searchFor.options[searchFor.selectedIndex].text.toLowerCase();
          
          if (!obj.results || obj.results.length == 0){
            document.querySelector("#content").innerHTML = "<p><i>There are no " +searchForText + "s that match your search input</i></p>";
              $("#content").fadeIn(500);
              return;
          }
          
          let result = obj.results;
          console.log("results.length = " + result.length);
          let bigString = "<p><i>Now showing " + result.length +" " + searchForText + " results for '" + displayTerm + "'</i></p>";
          
          printResults(result, bigString);
      }


function printResults(results, bs)
{
    bs += '<div class = "row">';
    for (let i = 0; i<results.length; i++)
              {
                  let result = results[i];
                  let smallURL = result.image;
                  if(!smallURL) smallURL = "images/no-image-found.png";
                  
                  let name = result.name;
                  
                  let line = '<div class = "column"><div class="result-content"><img src ='+ smallURL + ' title= '+ result.id + ' />';
                  line += "<b>" + name + "</b>" + ""
                  + "<span><b>Status:</b> " + result.status + "</span>"
                  + "<span><b>Gender: </b>" + result.gender + "</span>"
                  + "<span><b>Origin: </b>" + result.origin.name + "</span>";
                  line += "<br></div></div>";
                  bs += line;
              }
    bs += '</div>';
          
          document.querySelector("#content").innerHTML = bs;
          
          $("#content").fadeIn(500);
}