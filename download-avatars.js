const request = require('request')

console.log("Welcome to the GitHub avatar downloader!")

function getRepoContributors(repOwner, repName, cb) {

}

getRepoContributors("jquery", "jquery", (err, result) => {
    console.log("Errors: ", err)
    console.log("Result: ", result)
})
