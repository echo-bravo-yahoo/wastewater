import sparkly from 'sparkly'
import { seriesToGraphable } from './dataManipulation.mjs'

function getGlobalFirstDate(series) {
  return Object.values(series).reduce((first, currentSeries) => {
    if (Number(new Date(currentSeries[0].dateStart)) < Number(first)) {
      return new Date(currentSeries[0].dateStart)
    } else {
      return first
    }
  }, new Date())
}

export function outputArraysFromSeries(series, bucketSize) {
  const firstDate = getGlobalFirstDate(series)

  for (let i = 0; i < Object.keys(series).length; i++) {
    const lineEnd = (i !== Object.keys(series).length - 1 ? '\n' : '')

    console.log(headerFromSeries(series[Object.keys(series)[i]]))
    console.log(JSON.stringify(seriesToGraphable(series[Object.keys(series)[i]], firstDate, bucketSize).graphable, null, 2) + lineEnd)
  }
}

export function graphAllSeries(series, bucketSize) {
  const firstDate = getGlobalFirstDate(series)

  for (let i = 0; i < Object.keys(series).length; i++) {
    console.log(headerFromSeries(series[Object.keys(series)[i]]))

    const { graphable, unknown } = seriesToGraphable(series[Object.keys(series)[i]], firstDate, bucketSize)
    let graph = sparkly(graphable, { maximum: 100 })
    for (let i = 0; i < unknown.length; i++) {
      graph = graph.slice(0, i) + '?' + graph.slice(i+1)
    }

    console.log(graph + (i !== Object.keys(series).length - 1 ? '\n' : ''))
  }
}

function headerFromSeries(series) {
  const dataPoint = series[0]
  return `${dataPoint.location} in ${dataPoint.state} (#${dataPoint.id}) serving ${formatNumber(dataPoint.population)} people in ${formatCounties(dataPoint.counties)}:`
}

function formatCounties(counties) {
  let countyNames = counties.length ? counties : counties.split(',')
  let res = ''

  if (countyNames.length > 1) {
    if (countyNames.length === 2) {
      // avoid oxford comma, only 2 counties
      res = `${countyNames[0]} and ${countyNames[1]} counties`
    } else {
      // ensure oxford comma, 3+ counties
      res = countyNames.slice(0, countyNames.length - 1).join(', ') + ', and ' + countyNames.slice(-1) + ' counties'
    }
  } else {
    res = counties + ' county'
  }

  return  res
}

function formatNumber(number) {
  return Intl.NumberFormat('en-US').format(number)
}
