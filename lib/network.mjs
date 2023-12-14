import https from 'https'
import fs from 'fs'

import { dirname, normalize } from 'path'
import { fileURLToPath } from 'url'
const __dirname = dirname(fileURLToPath(import.meta.url))

import cliProgress from 'cli-progress'

import { formatDate, dateFromString } from './dataManipulation.mjs'

export async function download(url, dest, quiet) {
  const file = fs.createWriteStream(dest)
  let goalCb = () => {}
  const goal = calculateFileSizeFromPath(getMostRecentDataPath())
  let incrementalCb = () => {}
  let progress = undefined

  if (!quiet) {
    progress = new cliProgress.SingleBar({
      etaBuffer: 250,
      fps: 5
    }, cliProgress.Presets.shades_classic);
    let count = 0

    goalCb = (goal) => {
      progress.start(goal, count)
    }

    incrementalCb = (amount = 1) => {
      count = count + amount
      progress.update(count)
    }

    goalCb(goal)
  }

  return new Promise((resolve) => {
    https.get(url, function(response) {
      response.pipe(file);
      response.on('data', function(chunk) {
        incrementalCb(chunk.byteLength)
      })

      file.on('finish', function() {
        if (!quiet) {
          // Since we're estimating from the last record, we'll be wrong by a bit.
          // Let's fix the record before we stop the status bar so it doesn't report an ETA
          // and 99% or 101% completion.
          progress.update(goal)
          progress.stop()
        }

        file.close(resolve)
      })
    })
  })
}

function calculateFileSizeFromPath(path) {
  return fs.statSync(path).size // in bytes
}

function getMostRecentDataPath() {
  let files = fs.readdirSync(normalize(`${__dirname}/../data`))
  files = files.filter((file) => file.includes('-full.csv'))
  files = files.sort((a, b) => {
    return Number(dateFromString(b)) - Number(dateFromString(a))
  })

  return normalize(`${__dirname}/../data/${files[0]}`)
}

// this is the format used by the CDC website query param
function buildDateStr() {
  return formatDate(new Date(), '')
}

function checkForData() {
  return fs.existsSync(getDataPath())
}

export function getDataPath() {
  return normalize(`${__dirname}/../data/${buildDateStr()}-full.csv`)
}

export async function getData(refresh, quiet) {
  return new Promise(async (resolve) => {
    const dateStr = buildDateStr()
    const url = `https://data.cdc.gov/api/views/2ew6-ywp6/rows.csv?date=${dateStr}&accessType=DOWNLOAD`
    const hasData = checkForData()
    const _log = quiet ? () => {} : console.log

    if (hasData && !refresh) {
      _log(`Existing data found. Using it.`)
      resolve()
    } else if (refresh && hasData) {
      _log(`Existing data found, but refresh argument provided. Downloading fresh copy now.`)
      await download(url, getDataPath(), quiet)
      _log(`Done downloading new data.`)
      resolve()
    } else if (!hasData) {
      _log(`No existing data found. Downloading now.`)
      await download(url, getDataPath(), quiet)
      _log(`Done downloading new data.`)
      resolve()
    }
  })
}
