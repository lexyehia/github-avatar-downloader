"use strict";

require('dotenv').config()

const downloader = require('./helpers'),
      request    = require('request')


function getContributorStars(response) {

    let result = {}

    response.forEach((contributor, index) => {
        let options = {
            url: `https://${process.env.GITHUB_TOKEN}@api.github.com/users/${contributor.login}/starred`,
            headers: {
                'User-Agent': 'LHL Exercise'
            }
        }

        request.get(options, (err, res, body) => {
            if (err) throw err

            body = JSON.parse(body)

            for (let item of body) {
                addStarredRepo(result, item)
            }

            if (index === response.length - 1) {
                const arr = compareStarredRepo(result)
                logNiceList(arr)
            }
        })
    })
}

function addStarredRepo(result, repo) {

    if (repo.id.toString() in result) {
        result[repo.id]['stars'] += 1
    } else {
        result[repo.id] = {
            'id'   : repo.id,
            'owner': repo.owner.login,
            'name' : repo.name,
            'stars': 1
        }
    }
}

function compareStarredRepo(result) {
    let firstFive = []

    Object.keys(result).sort((a, b) => result[b].stars - result[a].stars)

    for (let repo in result) {
        if (firstFive.length === 5) break
        firstFive.push(result[repo])
    }

    return firstFive
}

function logNiceList(arr) {
    arr.forEach(e => {
        console.log(`[ ${e.stars} stars ] ${e.owner} / ${e.name}`)
    })
}

//downloader(process.argv[2], process.argv[3], getContributorStars)

downloader('lighthouse-labs', 'laser_shark', getContributorStars)