import sparkly from 'sparkly'
import { seriesToGraphable } from './dataManipulation.mjs'

export function graphAllSeries(series) {
  const firstDate = Object.values(series).reduce((first, currentSeries) => {
    if (Number(new Date(currentSeries[0].dateStart)) < Number(first)) {
      return new Date(currentSeries[0].dateStart)
    } else {
      return first
    }
  }, new Date())

  for (let i = 0; i < Object.keys(series).length; i++) {
    console.log(headerFromSeries(series[Object.keys(series)[i]]))
    console.log(sparkly(seriesToGraphable(series[Object.keys(series)[i]], firstDate)) + '\n')
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
