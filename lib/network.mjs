import https from 'https'
import fs from 'fs'

import { dirname, normalize } from 'path'
import { fileURLToPath } from 'url'
const __dirname = dirname(fileURLToPath(import.meta.url))

export function download(url, dest, cb) {
  const file = fs.createWriteStream(dest)
  const request = https.get(url, function(response) {
    console.log(JSON.stringify(response.headers, null, 4))
    response.pipe(file);
    file.on('finish', function() {
      file.close(cb);
    });
  });
}

// this is the format used by the CDC website query param
function buildDateStr() {
  const now = new Date()
  const yearStr = String(now.getFullYear())
  const monthStr = String(now.getMonth() + 1).padStart(2, '0')
  const dateStr = String(now.getDate() + 1).padStart(2, '0')
  return `${yearStr}${monthStr}${dateStr}`
}

function checkForData() {
  return fs.existsSync(getDataPath())
}

export function getDataPath() {
  return normalize(`${__dirname}/../data/${buildDateStr()}-full.csv`)
}

export function getData() {
  const dateStr = buildDateStr()
  const url = `https://data.cdc.gov/api/views/2ew6-ywp6/rows.csv?date=${dateStr}&accessType=DOWNLOAD`

  if (checkForData()) {
    console.log(`Existing data found. Using it.`)
  } else {
    console.log(`No existing data found. Downloading now.`)
    download(url, getDataPath(), () => { console.log('Done!') })
  }
}
