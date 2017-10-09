const request = require('request')

const GITHUB_USER  = "lexyehia",
      GITHUB_TOKEN = "7201ee1afb501d72a00d043eee85d9910020d441"


console.log("Welcome to the GitHub avatar downloader!")

function getRepoContributors(repoOwner, repoName, cb) {
    const options = {
        url: `https://${GITHUB_USER}:${GITHUB_TOKEN}@api.github.com/repos/${repoOwner}/${repoName}/contributors`,
        headers: {
            'User-Agent': 'request'
        }
    }

    request(options, (error, response, body) => {
        if (error) { console.log("error:", error) }
        cb(JSON.parse(body))
    })
}

function retrieveAvatars(response) {
    let result = []
    response.forEach(r => result.push(r['avatar_url']))
    console.log(result)
}

getRepoContributors("jquery", "jquery", retrieveAvatars)
