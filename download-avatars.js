"use strict";

require('dotenv').config()

const request    = require('request'),
      fs         = require('fs'),
      downloader = require('./helpers')

console.log("Welcome to the GitHub avatar downloader!")

function retrieveContributorsAvatars(response) {
    response.forEach(r => {
        downloadImageByURL(r['avatar_url'], `${r['login']}.png`)
    })
}

// For each contributor, pipe their avatar image to local file
function downloadImageByURL(url, filePath) {

    // First check if we have an Avatars subfolder, otherwise create one
    if (!fs.existsSync("./avatars")) {
        console.log("Avatars subfolder does not exist, creating it...")
        fs.mkdirSync("./avatars")
    } else {

        // Stream avatar directly to Avatars subfolder,
        // while watching for error messages
        request.get(url).on('error', (err) => {
            console.log(err)
        }).pipe(fs.createWriteStream("./avatars/" + filePath))
    }
}



// Call the main function getRepoContributors and
// provide anonymous callback that sets out where to store image files
downloader(process.argv[2], process.argv[3], retrieveContributorsAvatars)
