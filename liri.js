// Liri | By Juliette Rapala
// =====================================================================================

	// Setup Variables 
	// =====================================================================================

		// NPM packages
		var Twitter = require('twitter');
		var Spotify = require('node-spotify-api');
		var fs = require('fs');
		var moment = require('moment');
		var request = require('request');
		const chalk = require('chalk');

		// API keys file 
		var keys = require("./keys.js");

		// Twitter API Access
		var twitterClient = new Twitter({
		  consumer_key: keys.twitterKeys.consumer_key,
		  consumer_secret: keys.twitterKeys.consumer_secret,
		  access_token_key: keys.twitterKeys.access_token_key,
		  access_token_secret: keys.twitterKeys.access_token_secret
		});

		// Spotify API Access
		var spotifyClient = new Spotify({
			id: keys.spotifyKeys.client_id,
			secret: keys.spotifyKeys.client_secret
		});

		// Command line argument
		var liriCommand = process.argv[2];
		var liriSearchTerm = process.argv[3];

	// Twitter Function
	// =====================================================================================

		var myTweets = function() {

			// Declare variables
			var tweetTime;
			var currentTweet;
			var twitterLength;

			// Twitter NPM package
			twitterClient.get('statuses/user_timeline', function(error, tweets, response) {

  				// Error messaging 
  				if (error) {
  					return console.log('Error occurred: ' + error);
  				}

  				// Find number of tweets in timeline
  				twitterLength = tweets.length;

  				// If timeline has more than 20 tweets, limit to last 20 tweets
  				if (twitterLength > 20) {
  					twitterLength = 20;
  				}

  				// Log tweet data
  				console.log("\n---------------------------------------------------------");
				console.log("************** Here are your latest tweets **************");
				console.log("---------------------------------------------------------\n");
  				for (var i = 0; i<twitterLength; i++) {
  					currentTweet = tweets[i];
			  		console.log("Tweet " + (parseInt(i)+1) + ":");  		
	  				// Reformat date & time
	  				tweetTime = moment(currentTweet.created_at, "ddd MMM D HH:mm:ss ZZ YYYY");
	  				console.log(chalk.underline("\nTweeted at") + ": " + tweetTime.format("dddd, MMMM Do YYYY, h:mm:ss A"));
	  				console.log(chalk.underline("\nTweet") + ": " + currentTweet.text);	
	  				console.log("\n--------------------------------------------------------------\n");	
  				}
			});
		};

	// Spotify Function
	// =====================================================================================

		var spotifyThisSong = function(songTitle) {

			// Declare variables
			var numSearchResults;

			// If user did not enter a song, return results for Ace of Base's "The Sign"
			if (songTitle === undefined) {

				// Spotify NPM package
				spotifyClient.search({ type: 'track', query: 'The Sign', limit: 10 }, function(error, data) {

					// Error messaging 
					if (error) {
						return console.log('Error occurred: ' + error);
					
					// Log "The Sign" data
					} else {
		  				console.log("\n--------------------------------------------------------------\n");	
						console.log('Hmm...looks like you did not enter a song title, so here is a Spotify search result for "The Sign" by Ace of Base:\n');
		  				console.log(chalk.underline("Artist Name") + ": " + data.tracks.items[8].artists[0].name);
		  				console.log(chalk.underline("Song Name") + ": " + data.tracks.items[8].name);
		  				console.log(chalk.underline("Song Preview Link") + ": " + data.tracks.items[8].external_urls.spotify);
		  				console.log(chalk.underline("Album") + ": " + data.tracks.items[8].album.name);		
		  				console.log("\n--------------------------------------------------------------");	
					}
				});

			} else {
 				// Spotify NPM package
				spotifyClient.search({ type: 'track', query: songTitle, limit: 10 }, function(error, data) {

						// Error messaging 
						if (error) {
							return console.log('Error occurred: ' + error);

						// Log Spotify data
						} else {
							// Find the length of the response (may be smaller than 10)
							numSearchResults = data.tracks.items.length;
							// If no results found..
							if (numSearchResults === 0) {
								console.log("\nSorry, no Spotify results found for \"" + songTitle + "\".\n");
							// If results found..
							} else {
								console.log("\n-------------------------------------------------------------------------------------------");
								console.log("************** Here are your top " + numSearchResults + " Spotify results for \"" + songTitle + "\" **************");
								console.log("-------------------------------------------------------------------------------------------\n");
			  					for (var i = 0; i<numSearchResults; i++) {
					  				console.log("Result " + (parseInt(i)+1) + ":");
					  				console.log(chalk.underline("\nArtist Name") + ": " + data.tracks.items[i].artists[0].name);
					  				console.log(chalk.underline("Song Name") + ": " + data.tracks.items[i].name);
					  				console.log(chalk.underline("Song Preview Link") + ": " + data.tracks.items[i].external_urls.spotify);
					  				console.log(chalk.underline("Album") + ": " + data.tracks.items[i].album.name);	
					  				console.log("\n--------------------------------------------------------------\n");	
								}
							}	
						};
				});
			}
		}

	// OMDB Function
	// =====================================================================================

		var movieThis = function(movieTitle) {

			// Declare variables
			var releaseDate;
			var formattedReleaseDate;

			if (movieTitle === undefined) {
   				movieTitle = "Mr. Nobody";		
				console.log('\nHmm...looks like you did not enter a movie title. I will look for "Mr. Nobody" instead..');		
  			}

			request("http://www.omdbapi.com/?t=" + movieTitle + "&apikey=40e9cece", function(error, response, body) {

				// Log any errors
				if (error) {
					console.log(error);
  				} else if (JSON.parse(body).Title === undefined) {
  					console.log("\nSorry, \"" + movieTitle + "\" was not found in the OMDB.\n");
  				// If the request is successful (i.e. if the response status code is 200)
  				} else if (!error && response.statusCode === 200) {
	    			console.log("\n----------------------------------------------------------------------------------------");
					console.log("************** Here are your OMDB search results for \"" + movieTitle + "\" **************");
					console.log("----------------------------------------------------------------------------------------\n");		
					console.log(chalk.underline("Title of the movie") + ": " + JSON.parse(body).Title);
					// Reformat date & time
	  				releaseDate = moment(JSON.parse(body).Released, "DD MMM YYYY");
	  				formattedReleaseDate = releaseDate.format("MMMM DD, YYYY");
				  	console.log(chalk.underline("Date the movie came out") + ": " + formattedReleaseDate);
				  	console.log(chalk.underline("IMDB rating of the movie") + ": " + JSON.parse(body).imdbRating);
				  	// Find Rotten Tomatoes Rating
				  	for (var i = 0; i<JSON.parse(body).Ratings.length; i++) {
				  		if (JSON.parse(body).Ratings[i].Source === "Rotten Tomatoes") {
				  			console.log(chalk.underline("Rotten Tomatoes rating of the movie") + ": " + JSON.parse(body).Ratings[i].Value);
				  		}
				  	}
				  	console.log(chalk.underline("Country where the movie was produced") + ": " + JSON.parse(body).Country);
				  	console.log(chalk.underline("Language(s) of the movie") + ": " + JSON.parse(body).Language);
				  	console.log(chalk.underline("Plot of the movie") + ": " + JSON.parse(body).Plot);
				  	console.log(chalk.underline("Actors in the movie") + ": " + JSON.parse(body).Actors + "\n");
  				
  				} else {
  					console.log("Something went wrong. Please try again.");
  				}
			});

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
					// Get commands in file
					var contents = data.split(',');
					liriCommand = contents[0];
					liriSearchTerm = contents[1];
					// If it exists, remove first and last characters from the second command (double quotation marks).
					if (liriSearchTerm != undefined) {
						liriSearchTerm = liriSearchTerm.substr(1);
						liriSearchTerm = liriSearchTerm.slice(0,-1);
					}
					// Pass in commands
					switchStatements();
				}

			});
		};

	// Liri Commands  
	// =====================================================================================

		var switchStatements = function() {
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
			    	doWhatItSays(liriSearchTerm);
			    	break;
			    default:
			    	welcome();
			}
		};

	// Start up Function
	// =====================================================================================

		var welcome = function() {
			console.log("\n---------------------------------------------------------\n");
			console.log("Welcome to LIRI: The Language Interpretation and Recognition Interface.")
			console.log("\nPlease enter one of the following commands:\n");
			console.log("\t1) To load the lastest tweets from your Twitter timeline, please enter:")
			console.log("\t$ node liri.js my-teets\n");		
			console.log("\t2) To search Spotify for the title of a song, please enter:")			
			console.log("\t$ node liri.js spotify-this-song \"<title of song>\"\n");		
			console.log("\t3) To search the OMDB for the title of a movie, please enter:")
			console.log("\t$ node liri.js movie-this \"<title of movie>\"\n");		
			console.log("\t4) To run a command listed in the 'random.txt' file, please enter:")
			console.log("\t$ node liri.js do-what-it-says\n");		
		}

	// Start App
	// =====================================================================================

	switchStatements();
	