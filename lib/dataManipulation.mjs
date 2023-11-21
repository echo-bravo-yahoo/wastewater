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

export function timeSeriesFromKey(data, key) {
  return data.reduce((dictionary, newDataPoint) => {
    const seriesKey = newDataPoint[key]

    if (dictionary[seriesKey]) {
      dictionary[seriesKey].push(newDataPoint)
    } else {
      dictionary[seriesKey] = [newDataPoint]
    }

    return dictionary
  }, {})
}

function findMostRecentReporting(series) {
  for (let i = series.length - 1; i >= 0; i--) {
    if (series[i].percentile) return series[i]
  }

  return undefined
}

export function filterTimeSeries(data, omitInactive) {
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

export function sortTimeSeries(data) {
  for (let i = 0; i < Object.keys(data); i++) {
    const key = Object.keys(data)[i]
    if (!data[key]) {
      delete data[key] // this time series was filtered out by arg filters, so let's delete the key
    } else {
      data[key].sort((a, b) => {
        return Number(new Date(a.dateStart)) - Number(new Date(b.dateStart))
      })
    }
  }

  return data // just to make chaining/composition easier, since this fn mutates in place
}

export function seriesToGraphable(series, globalFirstDate) {
  let localFirstDate = new Date(series[0].dateStart)
  let msPerDay = 86400000
  let daysWithoutData = (Number(localFirstDate) - Number(globalFirstDate)) / msPerDay
  let totalDays = (Number(new Date(series[series.length - 1].dateStart)) - Number(globalFirstDate)) / msPerDay
  let res = Array(daysWithoutData).fill(0, 0, daysWithoutData)

  for (let i = 0; i < totalDays - daysWithoutData - 1; i++) {
    res[i + daysWithoutData] = Number(series[i].percentile)
  }

  return res
}
