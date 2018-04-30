require("dotenv").config();
var fs = require("fs");
var Spotify = require("node-spotify-api");
var Twitter = require("twitter");
var request = require("request");
var keys = require("./keys.js")
var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);

var client = new Twitter({
    consumer_key: process.env.TWITTER_CONSUMER_KEY,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
    access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
    access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
  });

args=process.argv.slice(2);

function liriRun(){
    var arr=[];
    switch(args[0]){
        case "my-tweets":
            client.get("/statuses/home_timeline",{
                count: 20
            },
            function(err,tweets,response){
                if(err) console.log(err);                        
                arr=[];
                tweets.forEach(e=>{
                  arr.push("Created at: " + e.created_at + " Tweet: " + e.text);
                });
                logIt("\n___________________________________________\n")
                logIt("node liri.js " + args[0] + "\n")
                logIt(arr.join("\n"),1)
            })                
        break;
        case "spotify-this-song":
            if (args[1]){
                songName = args[1];            
            } else {
                songName = "The Sign";
            }    
            spotify.search({
                type: 'track',
                query: songName,
                limit: 20
            }).then(function(data) {      
                // Lets make sure we match the song name exactly
                var i=data.tracks.items.findIndex(function(e){return e.name.toLowerCase() === songName.toLowerCase()});     
                arr.push("Artist(s): " + data.tracks.items[i].artists[0].name + "\n" +
                "Song Name: " + data.tracks.items[i].name + "\n" +
                "Preview Link: " + data.tracks.items[i].preview_url + "\n" +
                "Album: " + data.tracks.items[i].album.name +"\n"
            );
            logIt("\n___________________________________________\n")
            logIt("node liri.js " + args[0] + " " + args[1] + "\n")
            logIt(arr.join("\n"),1);     
            }).catch(function(err){
                console.log("Your Query Returned the Following Error\n",err);
            })
        break;
        case "movie-this":
            request("http://www.omdbapi.com/?t=" + args[1] + "&y=&plot=short&apikey=bb8b7c58", function(error, response, body) {
            if (!error && response.statusCode === 200) {
              arr.push("Title: " + JSON.parse(body).Title + "\n" +
                "Year: " + JSON.parse(body).Year + "\n" +
                "IMDB Rating: " + JSON.parse(body).imdbRating + "\n" + 
                "Rotten Tomatoes Rating: " + JSON.parse(body).Ratings[1].Value + "\n" +
                "Country of Production: " + JSON.parse(body).Country + "\n" + 
                "Language: " + JSON.parse(body).Language + "\n" +
                "Plot: " + JSON.parse(body).Plot + "\n" +
                "Actors: " + JSON.parse(body).Actors + "\n" 
            );
            logIt("\n___________________________________________\n")
            logIt("node liri.js " + args[0] + " " + args[1] + "\n")
            logIt(arr.join("\n"),1);
            }
            })
        break;
        case "do-what-it-says":
        fs.readFile("random.txt", "utf8", function(error, data) {
            if (error) {
              return console.log(error);
            }              
            var dataArr = data.split(",");
            args[0]=dataArr[0];
            args[1]=dataArr[1];
            liriRun();
          });        
        break;
        default:
            console.log("Command not recognized")
        break;
    }
}

function logIt(arr,aa) {
    fs.appendFile("log.txt",arr, function(err) {
        if (err) {
            console.log(err);
          }                          
          else {
              if (aa) console.log(arr);                
          }            
    })
}

liriRun();


