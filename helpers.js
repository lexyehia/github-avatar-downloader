const request = require('request'),
      fs      = require('fs')

// Get list of contributors from Github API
function getRepoContributors(repoOwner, repoName, cb) {

    let options = {
        url: `https://${process.env.GITHUB_TOKEN}@api.github.com/`,
        headers: {
            'User-Agent': 'LHL Exercise'
        }
    }

    // Validate both environment variable, then arguments,
    // then retrieve contributors list
    validateEnvironmentVariable(repoOwner, repoName, options, validateArguments, (options) => {
        options.url += '/contributors'

        request(options, (error, response, body) => {
            if (error) { console.log("error:", error) }
            cb(JSON.parse(body))
        })
    })
}

// Make sure that the arguments provided lead to a
// repo that actually exists on Github
function validateArguments(repoOwner, repoName, options, cb) {

    // Check validity of arguments inputted
    // if (process.argv.length !== 4) {
    //     throw Error("Did not supply correct number of arguments, please only provide 2.")
    // } else if (!repoOwner) {
    //     throw Error("Did not provide proper Repo Owner name as first argument")
    // } else if (!repoName) {
    //     throw Error("Did not provide proper Rep Name as second argument")
    // } else {

        options.url += `repos/${repoOwner}/${repoName}`

        request(options, (error, response, body) => {

            // If repo does not exist, the response will contain a 'message' property
            // Check to see whether the response contains that; if so, then Repo does not exist
            if(JSON.parse(body).message) {
                throw Error("The provided Repo does not exist.")
            } else {
                cb(options)
            }
        })
    //}
}

function validateEnvironmentVariable(repoOwner, repoName, options, cb, cb2) {
    if(!fs.existsSync('.env')) {
        throw Error("Cannot locate a valid .env file, please create one at project root")
    }

    if (process.env.GITHUB_TOKEN) {

        request(options, (error, response) => {
            if (response.statusCode == 401) {
                throw Error("Invalid Github Token in .env file")
            } else {
                cb(repoOwner, repoName, options, cb2)
            }
        })
    } else {
        throw Error("Please make sure .env file contains a valid GITHUB_TOKEN value")
    }
}

module.exports = getRepoContributors