const request = require('request')

const GITHUB_USER  = "lexyehia",
      GITHUB_TOKEN = "7201ee1afb501d72a00d043eee85d9910020d441"


console.log("Welcome to the GitHub avatar downloader!")

function getRepoContributors(repoOwner, repoName, cb) {
    const requestURL = `https://${GITHUB_USER}:${GITHUB_TOKEN}@api.github.com/repos/${repoOwner}/${repoName}/contributors`

    console.log(requestURL)
}

getRepoContributors("jquery", "jquery", (err, result) => {
    console.log("Errors: ", err)
    console.log("Result: ", result)
})
