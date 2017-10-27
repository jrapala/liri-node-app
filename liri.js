// Liri | By Juliette Rapala
// =====================================================================================

	// Setup Variables 
	// =====================================================================================

		// NPM packages
		var Twitter = require('twitter');
		var Spotify = require('node-spotify-api');
		var fs = require('fs');
		var moment = require('moment');

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

			var tweetTime;

			twitterClient.get('statuses/user_timeline', function(error, tweets, response) {

  				if (error) {
  					return console.log('Error occurred: ' + error);
  				}

  				// Find amount of tweets in timeline
  				var twitterLength = tweets.length;

  				// If timeline has more than 20 tweets, limit length to last 20 tweets
  				if (twitterLength > 20) {
  					twitterLength = 20;
  				}

  				// Log tweet data and tweet
  				console.log(" ");
				console.log("********** Here are your latest tweets **********");
  				for (var i = 0; i<twitterLength; i++) {
  					var currentTweet = tweets[i];
  					console.log(" ");
			  		console.log("Tweet " + (parseInt(i)+1) + ":");  		
	  				console.log(" ");
	  				// Reformat date & time
	  				tweetTime = moment(currentTweet.created_at, "ddd MMM D HH:mm:ss ZZ YYYY");
	  				console.log("Tweeted at: " + tweetTime.format("dddd, MMMM Do YYYY, h:mm:ss A"));
	  				console.log(" ");
	  				console.log("Tweet: " + currentTweet.text);
	  				console.log(" ");		
	  				console.log("--------------------------------------------------------------");	
  				}

			});

		};

	// Spotify Function
	// =====================================================================================

		var spotifyThisSong = function(songTitle) {

			// If user did not enter a song, return results for Ace of Base's "The Sign"
			if (songTitle === undefined) {
				spotifyClient.search({ type: 'track', query: 'The Sign', limit: 10 }, function(error, data) {
					// Error messaging 
					if (error) {
						return console.log('Error occurred: ' + error);
					} else {
		  				console.log("--------------------------------------------------------------");	
						console.log(" ");
						console.log('********** Hmm...looks like you did not enter a song title, so here is a Spotify search result for "The Sign" by Ace of Base **********');
		  				console.log(" ");
		  				console.log("Artist Name: " + data.tracks.items[8].artists[0].name);
		  				console.log("Song Name: " + data.tracks.items[8].name);
		  				console.log("Song Preview Link: " + data.tracks.items[8].external_urls.spotify);
		  				console.log("Album: " + data.tracks.items[8].album.name);
		  				console.log(" ");		
		  				console.log("--------------------------------------------------------------");	
					}
				});
			} else {
 
				spotifyClient.search({ type: 'track', query: songTitle, limit: 10 }, function(error, data) {
						// Error messaging 
						if (error) {
							return console.log('Error occurred: ' + error);
						} else {
							// Find the length of the response (may be smaller than 10)
							var numSearchResults = data.tracks.items.length;
							// If no results found..
							if (numSearchResults === 0) {
								console.log("Sorry, no results found.");
							// If results found..
							} else {
			  					console.log("--------------------------------------------------------------");	
								console.log(" ");
								console.log("********** Here are your top " + numSearchResults + " Spotify results for \"" + songTitle + "\" **********");
								for (var i = 0; i<numSearchResults; i++) {
					  				console.log(" ");
					  				console.log("Result " + (parseInt(i)+1) + ":");
					  				console.log(" ");
					  				console.log("Artist Name: " + data.tracks.items[i].artists[0].name);
					  				console.log("Song Name: " + data.tracks.items[i].name);
					  				console.log("Song Preview Link: " + data.tracks.items[i].external_urls.spotify);
					  				console.log("Album: " + data.tracks.items[i].album.name);
					  				console.log(" ");		
					  				console.log("--------------------------------------------------------------");	
								}
							}	
						};
				});
			}
		}

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


// This will show the following information about the song in your terminal/bash window
// Artist(s)
// The song's name
// A preview link of the song from Spotify
// The album that the song is from
// If no song is provided then your program will default to "The Sign" by Ace of Base.

// [ { album: 
//      { album_type: 'album',
//        artists: [Array],
//        available_markets: [Array],
//        external_urls: [Object],
//        href: 'https://api.spotify.com/v1/albums/5qt11cWjSs5Gbqj2Wyfu38',
//        id: '5qt11cWjSs5Gbqj2Wyfu38',
//        images: [Array],
//        name: 'Enema Of The State',
//        type: 'album',
//        uri: 'spotify:album:5qt11cWjSs5Gbqj2Wyfu38' },
//     artists: [ [Object] ],
//     available_markets: [ 'CA', 'MX', 'US' ],
//     disc_number: 1,
//     duration_ms: 168000,
//     explicit: false,
//     external_ids: { isrc: 'USMC19959123' },
//     external_urls: { spotify: 'https://open.spotify.com/track/7yCPwWs66K8Ba5lFuU2bcx' },
//     href: 'https://api.spotify.com/v1/tracks/7yCPwWs66K8Ba5lFuU2bcx',
//     id: '7yCPwWs66K8Ba5lFuU2bcx',
//     name: 'All The Small Things',
//     popularity: 74,
//     preview_url: null,
//     track_number: 8,
//     type: 'track',
//     uri: 'spotify:track:7yCPwWs66K8Ba5lFuU2bcx' } ]