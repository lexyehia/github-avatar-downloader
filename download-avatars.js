require('dotenv').config()

const request = require('request'),
      fs      = require('fs')

const GITHUB_USER  = "lexyehia",
      GITHUB_TOKEN = process.env.GITHUB_TOKEN,
      GITHUB_BASE  = `https://${GITHUB_USER}:${GITHUB_TOKEN}@api.github.com/repos`


console.log("Welcome to the GitHub avatar downloader!")

// Send a request for a list of avatar urls
function getRepoContributors(repoOwner, repoName, cb) {

    validateArguments(repoOwner, repoName, (options) => {

        options.url += '/contributors'

        request(options, (error, response, body) => {
            if (error) { console.log("error:", error) }
            cb(JSON.parse(body))
        })
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

// Make sure that the arguments provided lead to a
// repo that actually exists on Github
function validateArguments(repoOwner, repoName, cb) {

    // Check validity of arguments inputted
    if (process.argv.length !== 4) {
        throw Error("Did not supply correct number of arguments, please only provide 2.")
    } else if (!repoOwner) {
        throw Error("Did not provide proper Repo Owner name as first argument")
    } else if (!repoName) {
        throw Error("Did not provide proper Rep Name as second argument")
    } else {

        // Check whether Repo exists on Github
        const options = {
            url: `${GITHUB_BASE}/${repoOwner}/${repoName}`,
            headers: {
                'User-Agent': 'LHL Exercise'
            }
        }

        request(options, (error, response, body) => {

            // If repo does not exist, the response will contain a 'message' property
            // Check to see whether the response contains that; if so, then Repo does not exist
            if(JSON.parse(body).message) {
                throw Error("The provided Repo does not exist.")
            } else {
                cb(options)
            }
        })
    }
}

// Call the main function getRepoContributors and
// provide anonymous callback that sets out where to store image files
getRepoContributors(process.argv[2], process.argv[3], (response) => {
    response.forEach(r => {
        downloadImageByURL(r['avatar_url'], `${r['login']}.png`)
    })
})
