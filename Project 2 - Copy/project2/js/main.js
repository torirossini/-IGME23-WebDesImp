//https://rickandmortyapi.com/documentation

window.onload = (e) => { document.querySelector("#showAlive").onclick = allCharactersData};
	
	let searchBy = {
  "characters": "https://rickandmortyapi.com/api/character",
  "locations": "https://rickandmortyapi.com/api/location",
  "episodes": "https://rickandmortyapi.com/api/episode"
}
	let displayTerm = "";
	
	// 3
	function getData(){

	}
      function allCharactersData() {
        console.log("allCharactersData() called");
        
        const MORTY_URL = searchBy["characters"];
        
        let url = MORTY_URL;
        
        document.querySelector("#content").innerHTML = "<b>Searching for " + displayTerm + "</b>";
        console.log(url);
        
        console.log(jQuery);
        console.log($); // $ is an alias to the jQuery object
        
        $.ajax({            
            dataType: "json",
            url: url,
            data: null,
            success: jsonLoaded
        });
        $("#content").fadeOut(100);
          
      }
      function jsonLoaded(obj){
        console.log("obj = " + obj);
        console.log("obj stringified = " + JSON.stringify(obj));
          if (!obj.data || obj.data.length == 0){
            document.querySelector("#content").innerHTML = "<p><i>There are no characters to show</i></p>";
              $("#content").fadeIn(500);
              return;
          }
          
          let results = obj.data;
          console.log("results.length = " + results.length);
          let bigString = "<p><i>Here are " + results.length + " results for " + displayTerm +"</i></p>";
          
          for (let i = 0; i<results.length; i++)
              {
                  let result = results[i];
                  let smallURL = result.images.fixed_width_small.url;
                  if(!smallURL) smallURL = "images/no-image-found.png";
                  
                  let url = result.url;
                  
                  var line = '<div class= result ><img src ='+ smallURL + ' title= '+ result.id + ' />';
                  line += '<span><a href= '+ url + '>View on Giphy</a></span> <p>Rating: ' +result.rating.toUpperCase() + '</p></div>';
                  
                  bigString += line;
              }
          
          document.querySelector("#content").innerHTML = bigString;
          
          $("#content").fadeIn(500);
      }