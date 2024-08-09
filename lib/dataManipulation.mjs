const msPerDay = 86400000

export function stateFilter(state) {
  return state ? (record) => record.state.toLowerCase() === state.toLowerCase() : () => true
}

export function idFilter(ids) {
  return ids && ids.length ? (record) => ids.includes(Number(record.id)) : () => true
}

export function countyFilter(county) {
  function _isInCounty(record) {
    return record.counties.map((data) => data.toLowerCase()).includes(county.toLowerCase())
  }
  return county ? _isInCounty : () => true
}

// there's a sample record that breaks all the parsing - just throw it out
export function sampleFilter() {
  return (record) => record.id !== 'wwtp_id'
}

// in: raw json records
// intermediate: dictionary<plantId, dictionary<date, record>>
// out: dictionary<plantId, list<records>>

/* This method deserves an explanation.
 * Sometimes, plants change their reporting basis without changing their id.
 * Plant 676 did this around 7/1/2023.
 * When a plant does this, they report multiple data points per day - one per basis.
 * If they're using 1/1/2022 as a basis, and 9/15/2023 as another basis, they'll report
 * two numbers per day until the newer basis has enough history (15 days) to cut over.
 *
 * This sucks for us, because I don't think we have enough information to map from one
 * basis to another well. Instead, we choose the _worst_ of the two to report.
 *
 */
export function timeSeriesFromKey(data, key, args) {
  const intermediate = data.reduce((dictionary, newDataPoint) => {
    const seriesKey = newDataPoint[key]

    // throw out useless datapoints
    if (newDataPoint.percentile === '' || Number(newDataPoint.percentile) === 999)
      return dictionary

    if (!dictionary[seriesKey]) dictionary[seriesKey] = {}

    if (dictionary[seriesKey][newDataPoint.dateStart]) {
      // if there's a collision, use the datapoint with the highest (worst) percentile)
      if (dictionary[seriesKey][newDataPoint.dateStart].percentile < newDataPoint.percentile)
        dictionary[seriesKey][newDataPoint.dateStart] = newDataPoint
    } else {
      dictionary[seriesKey][newDataPoint.dateStart] = newDataPoint
    }

    return dictionary
  }, {})

  let res = {}
  for (let i = 0; i < Object.keys(intermediate).length; i++) {
    const key = Object.keys(intermediate)[i]
    res[key] = Object.values(intermediate[key])
  }

  return sortTimeSeries(filterTimeSeries(res, args.omitInactive))
}

function findMostRecentReporting(series) {
  for (let i = series.length - 1; i >= 0; i--) {
    if (series[i].percentile) return series[i]
  }

  return undefined
}

function filterTimeSeries(data, omitInactive) {
  if (omitInactive) {
    const keys = Object.keys(data)
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i]
      const record = findMostRecentReporting(data[key])
      if (record) {
        const diff = new Date() - new Date(record.dateEnd)
        // console.log(`key: ${key}, dateEnd: ${record.dateEnd}, percentile: ${record.percentile}, diff: ${diff}`)

        // "inactive" means 7 days, i guess
        if (diff > 1000 * 60 * 60 * 24 * 7) {
          delete data[key]
        }
      } else {
        delete data[key]
      }
    }
  }

  return data
}

function sortTimeSeries(data) {
  for (let i = 0; i < Object.keys(data).length; i++) {
    const key = Object.keys(data)[i]
    if (!data[key]) {
      delete data[key] // this time series was filtered out by arg filters, so let's delete the key
    } else {
      sortOneTimeSeries(data[key])
    }
  }

  return data // just to make chaining/composition easier, since this fn mutates in place
}

function sortOneTimeSeries(data) {
  data.sort((a, b) => {
    return Number(new Date(a.dateStart)) - Number(new Date(b.dateStart))
  })
}

export function dateFromString(string) {
  const yearStr = string.slice(0, 4)
  const monthStr = string.slice(4, 6)
  const dateStr = string.slice(6, 8)
  return new Date(`${yearStr}-${monthStr}-${dateStr}`)
}

export function formatDate(date, seperator='-') {
  const yearStr = String(date.getFullYear())
  const monthStr = String(date.getMonth() + 1).padStart(2, '0')
  const dateStr = String(date.getDate() + 1).padStart(2, '0')
  return `${yearStr}${seperator}${monthStr}${seperator}${dateStr}`
}

function calcTotalDays(firstDate, series) {
  return (Number(new Date(series[series.length - 1].dateStart)) - Number(firstDate)) / msPerDay
}

function calcDaysPerBucket(bucketSize) {
  const sanitizedBucketSize = bucketSize.trim().toLowerCase()
  if (sanitizedBucketSize === "1d") {
    return 1
  } else if (sanitizedBucketSize === "1w") {
    return 7
  } else if (sanitizedBucketSize === "1m") {
    return 30 // better way to do this...?
  } else {
    throw new Error(`Unsupported bucket size: "${bucketSize}".`)
  }
}

function averageAggregator(values) {
  const nums = values.map(value => Number(value.percentile))
  return nums.reduce((a, b) => a + b) / nums.length
}

function bucketizeSeries(index, series, daysPerBucket, aggregator=averageAggregator) {
  return aggregator(series.slice(index, index + daysPerBucket))
}

export function seriesToGraphable(series, globalFirstDate, bucketSize) {
  const localFirstDate = new Date(series[0].dateStart)
  const totalDays = calcTotalDays(globalFirstDate, series)
  const daysPerBucket = calcDaysPerBucket(bucketSize)
  const daysWithoutData = Math.max(
    (Number(localFirstDate) - Number(globalFirstDate)) / msPerDay,
    totalDays - series.length
  )

  const bucketsWithoutData = Math.ceil(daysWithoutData / daysPerBucket)
  const totalBuckets = Math.ceil(totalDays / daysPerBucket)
  let res = Array(bucketsWithoutData).fill(0, 0, bucketsWithoutData)
  const unknownDays = []

  console.log(`Outputing ${totalDays} days from ${formatDate(localFirstDate)} to ${series[series.length - 1].dateStart}.`)
  for (let i = 0; i < totalBuckets - bucketsWithoutData - 1; i++) {
    let val
    try {
      val = Number(series[i].percentile)
    } catch (e) {
      console.log(`localFirstDate: ${localFirstDate}, globalFirstDate: ${globalFirstDate}, daysWithoutData: ${daysWithoutData}, totalDays: ${totalDays}, i: ${i}, series.length: ${series.length}`)
      throw e
    }

    if (val < 0 || val > 100) {
      unknownDays.push(i)
    }

    res[i + bucketsWithoutData] = bucketizeSeries(i, series, daysPerBucket)
  }

  // TODO: make use of unknown days to render ' ' instead of '▁' when we don't have data
  return { graphable: res, unknown: unknownDays }
}
