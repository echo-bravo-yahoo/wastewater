import https from 'https'
import fs from 'fs'

import { dirname, normalize } from 'path'
import { fileURLToPath } from 'url'
const __dirname = dirname(fileURLToPath(import.meta.url))

import { formatDate } from './dataManipulation.mjs'

export async function download(url, dest) {
  const file = fs.createWriteStream(dest)
  return new Promise((resolve) => {
    https.get(url, function(response) {
      response.pipe(file);
      file.on('finish', function() {
        file.close(resolve);
      })
    })
  })
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
      await download(url, getDataPath())
      _log(`Done downloading new data.`)
      resolve()
    } else if (!hasData) {
      _log(`No existing data found. Downloading now.`)
      await download(url, getDataPath())
      _log(`Done downloading new data.`)
      resolve()
    }
  })
}
