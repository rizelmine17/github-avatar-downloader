const request = require('request');
const fs = require('fs');

console.log('Welcome to the GitHub Avatar Downloader!');

var GITHUB_USER = "rizelmine17";
var GITHUB_TOKEN = "4b4f3706087ba2d1f907b57dba3662257548f948";

let filePath = ''
let url = ''
const repoOwner = process.argv[2]
const repoName = process.argv[3]

function getRepoContributors(repoOwner, repoName, cb) {

  if(repoOwner == null || repoName == null){
    console.log("error: no arguments recieved");
    return;
  }


  var requestURL = 'https://'+ GITHUB_USER + ':' + GITHUB_TOKEN +
                   '@api.github.com/repos/' + repoOwner + '/' +
                    repoName + '/contributors';

//^ this concatnates the request url so that I can make a get request based on repoOwner and
// repoName passed in

  var options = {
    url: requestURL,
    headers: {
      'User-Agent': GITHUB_USER,
      'Authorization': 'token ' + GITHUB_TOKEN
    }
  }

// ^ this object is necessary to be passed into the get request or I won't gain access to it

  request.get(options, function(error, response, body) {
   if (response && response.statusCode == 200) {
      var parsed = JSON.parse(body);
      cb(parsed);
    }
  })
  console.log("Image download completed!")
}
// ^this parses the values of the array of objects you get form the get request and turns
// them into js objects


function ParsedURL(parsedInput){
  parsedInput.forEach(function (item) {
  filePath = "avatars/" + item.login + ".png";
  url = item.avatar_url;
  downloadImageByURL(url, filePath);
  })

// this function extracts the filepath and url of the js objects gained from the get request
// particularly the filepath needs to have a .jpg appended on the end of it or it won't
// a picture
}

function downloadImageByURL(url, filePath) {
  request.get(url)
         .pipe(fs.createWriteStream(filePath));
}

// this function makes a get request based on the url and downloads the file into the file
//path passed in

getRepoContributors(repoOwner, repoName, ParsedURL)

