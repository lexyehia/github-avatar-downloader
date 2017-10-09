const request = require('request'),
      fs      = require('fs')

const GITHUB_USER  = "lexyehia",
      GITHUB_TOKEN = "7201ee1afb501d72a00d043eee85d9910020d441"


console.log("Welcome to the GitHub avatar downloader!")

// Send a request for a list of avatar urls
function getRepoContributors(repoOwner, repoName, cb) {

    // Cancel execution and send message to console that arguments were not provided
    if (!repoOwner) {
        return console.log("Did not provide proper Repo Owner name as first argument")
    } else if (!repoName) {
        return console.log("Did not provide proper Rep Name as second argument")
    }

    const options = {
        url: `https://${GITHUB_USER}:${GITHUB_TOKEN}@api.github.com/repos/${repoOwner}/${repoName}/contributors`,
        headers: {
            'User-Agent': 'LHL Exercise'
        }
    }

    request(options, (error, response, body) => {
        if (error) { console.log("error:", error) }
        cb(JSON.parse(body))
    })
}

// For each contributor, pipe their avatar image to local file
function downloadImageByURL(url, filePath) {
    request.get(url).pipe(fs.createWriteStream(filePath))
}

// Call the main function getRepoContributors and
// provide anonymous callback that sets out where to store image files
getRepoContributors(process.argv[2], process.argv[3], (response) => {
    response.forEach(r => {
        downloadImageByURL(r['avatar_url'], `./avatars/${r['login']}.png`)
    })
})
