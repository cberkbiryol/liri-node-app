# liri-node-app

## Summary
This app runs from command line and returns  desired information based on four different operation modes, all appended to the command as argument. These arguments are
````javascript
    node liri.js my-tweets
    node liri.js spotify-this-song '<Song Name>'
    node liri.js movie-this '<Movie Name>'
    node liri.js do-what-it-says
````

As seen above the app retrives tweets (latest 20) from twitter in the first mode and retrieves song and movie information in the following two modes. In the mode `do-what-it-says`, the app reads a the text file `random.txt` using `fs` module and executes the command (any of the three above) and provides the information on the prompt screen. The app also logs the commands and the returned information in `log.txt` file.
___
## Specifications
The app consists of 2 functions:
1. `liriRun()`:  the main program;
2. `logIt()`: logging and screen printing function.

The following modes constitude the `liriRun()` that are defined in a `switch <mode name>` statement.

**`my-tweets` mode:**
 
 In this mode the app retreives the latest 20 tweet from the home timeline of the user, utilizing the node-twitter-api npm module. The user information and acess tokens, secrets and API keys are stored in `.env` file referenced as environment variables in `keys.js`. This information is obtained in the app with the following snippet:
 ````javascript
    var client = new Twitter({
    consumer_key: process.env.TWITTER_CONSUMER_KEY,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
    access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
    access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
  });
  ````
The results are pushed into an empty array and logged both in console and in `log.txt` using the function `logIt(array,flag)`. The `array` in this statement is the array of returned rersults and the `flag` is a variable that helps discriminate between the types of information that are printed in the log file and to the screen. This information consist of both the tweet itself as well as the time the tweet is created.

**`spotify-this-song` mode:**
The information about the requested song is retrieved using the spotify module of npm. In order to obtain the exact match for the song name, a loop is added to retrieve the index (`var i`) of the returned results that matches the exact name of the song instead of some parts of it. 

````javascript
    var i=data.tracks.items.findIndex(function(e){return e.name.toLowerCase() === songName.toLowerCase()});
````

The app returns the artis name, song name, preview link and the album name in the console and in the log file. If no song name given the app defaults to retrieving information about  The Sign by Ace of Base.

**`movie-this` mode:**

The mode uses `request` module to retreive movie information from omdb api. The app prints out the title, year, IMDB and Rotten Tomatoes ratings as well as country of production, language, plot and actors both to the screen and also to the log file. The log file also contains the command using hich the query was initiated. 

**`do-what-it-says` mode:**

Using the built-in fs module, this mode reads the `random.txt` file that resides in the same directory and executes one of the modes described above. Since the command needs to be re-evaluated basded on the contents of the file the `liriRun()` function is called here reqursiveley after the contents of the file are assigned to the `args` array variable that is what `liriRun()` uses to execute the users request.

* If the user input is none of the above, the program throws an error message telling the user that their request/command is not recognized. 

