
    window.onload = (e) => { document.querySelector("#search").onclick = getData};
	
	// 2
	let displayTerm = "";

    let usernames = ["HardlyDifficult", "ESL_SC2", "OgamingSC2", "adobe", "cretetion", "freecodecamp", "storbeck", "habathcx", "RobotCaleb"];

    const TWITCH_URL = "https://api.twitch.tv/kraken/";
        
    const TWITCH_KEY = '?client_id=o9qs22c4fetezmqnc31pyac4gycmm3';
    
	
    

    usernames.forEach(function(channel){
        function makeURL(type, name){
            return TWITCH_URL + type + "/" + name + TWITCH_KEY;
        }
    });


	function getData(){
		console.log("getData() called");
        

        let url = TWITCH_URL + TWITCH_KEY;
        
        
        let term = document.querySelector("#searchterm").value; 
        displayTerm = term; 
        
        term = term.trim();
        term = encodeURIComponent(term);
        if(term.length < 1) return;
        url += "&q=" + term;
        let limit = document.querySelector("#limit").value;
        url += "&limit=" + limit;
        
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
            document.querySelector("#content").innerHTML = "<p><i>No results found for "+ displayTerm + "</i></p>";
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