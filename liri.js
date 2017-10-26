// Liri | By Juliette Rapala
// =====================================================================================

	// Setup Variables 
	// =====================================================================================

		// NPM packages
		var Twitter = require('twitter');
		var fs = require('fs');

		// API keys file 
		var keys = require("./keys.js");
		var twitterCK = keys.consumer_key;
		var twitterCS = keys.consumer_secret;
		var twitterATK = keys.access_token_key;
		var twitterATS = keys.access_token_secret;

		// Command line argument
		var liriCommand = process.argv[2];
		var liriSearchTerm = process.argv[3];

	// Twitter Function
	// =====================================================================================

		var myTweets = function() {

			var client = new Twitter({
			  consumer_key: twitterCK,
			  consumer_secret: twitterCS,
			  access_token_key: twitterATK,
			  access_token_secret: twitterATS
			});

			client.get('statuses/user_timeline', function(error, tweets, response) {

  				if(error) throw error;

  				// Find amount of tweets in timeline
  				var twitterLength = tweets.length;

  				// If timeline has more than 20 tweets, limit length to last 20 tweets
  				if (twitterLength > 20) {
  					twitterLength = 20;
  				}

  				// Log tweet data and tweet
  				for (var i = 0; i<twitterLength; i++) {
  					var currentTweet = tweets[i];  		
	  				console.log(" ");
	  				console.log("Tweeted at: " + currentTweet.created_at);
	  				console.log("Tweet: " + currentTweet.text);
	  				console.log(" ");		
	  				console.log("--------------------------------------------------------------");	
  				}

			});

		};

	// Spotify Function
	// =====================================================================================

		var spotifyThisSong = function() {

		};


	// OMDB Function
	// =====================================================================================

		var movieThis = function() {

		};

	// "Do What It Says" Function
	// =====================================================================================

		var doWhatItSays = function() {

			// Read random.txt
			fs.readFile('random.txt', 'utf8', function(error, data) {
				
				// Log any errors
				if (error) {
					console.log(error);
				}

				// If no error..
				else {
					var contents = data.split(',');
					liriCommand = contents[0];
					liriSearchTerm = contents[1];
				}

			});
		};

	// Liri Commands  
	// =====================================================================================

		switch(liriCommand) {
		    case 'my-tweets':
		    	myTweets();
		        break;
		    case 'spotify-this-song':
		    	spotifyThisSong(liriSearchTerm);
		        break;
		    case 'movie-this':
		    	movieThis(liriSearchTerm);
		    	break;
		    case 'do-what-it-says':
		    	doWhatItSays();
		    	break;
		    default:
		    	console.log("No command was entered.");
		}