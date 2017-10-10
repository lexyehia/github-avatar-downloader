"use strict";

require('dotenv').config()

const downloader = require('./helpers'),
      request    = require('request')


function getContributorStars(response) {

    let result = []

    response.forEach((contributor, index) => {
        let options = {
            url: `https://${process.env.GITHUB_TOKEN}@api.github.com/users/${contributor.login}/starred?per_page=100`,
            headers: {
                'User-Agent': 'LHL Exercise'
            }
        }

        request(options, (err, res, body) => {
            if (err) throw err

            JSON.parse(body).forEach(repo => {
                addStarredRepo(result, repo)
            })

            if (index === response.length - 1) {
                result.sort((a, b) => b[3] - a[3])
                logNiceList(result.slice(0, 4))
            }
        })
    })
}

function addStarredRepo(result, repo) {
    let existingEntry = result.find(e => e[0] === repo.id)

    if (existingEntry) {
        existingEntry[3]++
    } else {
        result.push([
            repo.id,
            repo.owner.login,
            repo.name,
            1
        ])
    }
}

function logNiceList(arr) {
    arr.forEach(e => {
        console.log(`[ ${e[3]} stars ] ${e[1]} / ${e[2]}`)
    })
}

//downloader(process.argv[2], process.argv[3], getContributorStars)

downloader('jquery', 'jquery', getContributorStars)