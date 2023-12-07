import cliProgress from 'cli-progress'
import { stringify } from 'csv-stringify/sync'

import { processFile } from '../csv.mjs'
import { sortTimeSeries, filterTimeSeries, timeSeriesFromKey, stateFilter, countyFilter, idFilter, sampleFilter } from '../dataManipulation.mjs'
import { graphAllSeries } from '../graph.mjs'
import { getData, getDataPath } from '../network.mjs'
import { outputArraysFromSeries } from '../graph.mjs'

export default async function history(args) {
  await getData(args.refresh, args.quiet)

  let goalCb = () => {}
  let incrementalCb = () => {}
  let progress = undefined

  if (!args.quiet) {
    progress = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);
    let count = 0

    goalCb = (goal) => {
      progress.start(goal, count)
    }

    incrementalCb = () => {
      progress.update(++count)
    }
  }

  let records = await processFile(
    getDataPath(),
    [ stateFilter(args.state), countyFilter(args.county), idFilter(args.ids), sampleFilter() ],
    goalCb,
    incrementalCb
  )

  if (!args.quiet) {
    progress.stop()
  }

  const series = sortTimeSeries(filterTimeSeries(timeSeriesFromKey(records, 'id'), args.omitInactive));

  // console.log('global first date: ', firstDate)
  if (args.output === 'sparkchart') {
    graphAllSeries(series)
  } else if (args.output.toLowerCase() === 'json') {
    console.log(JSON.stringify(series, null, 4))
  } else if (args.output.toLowerCase() === 'csv') {
    records = records.map((record) => {
      return [
        record.id,
        record.state,
        record.counties.join(","),
        record.location,
        record.population,
        record.dateStart,
        record.dateEnd,
        record.changeOver15Days,
        record.percentile,
        record.firstSampleDate
      ]
    })
    records = [['id', 'state', 'counties', 'location', 'population', 'dateStart', 'dateEnd', 'changeOver15Days', 'percentile', 'firstSampleDate']].concat(records)
    console.log(stringify(records))
  } else if (args.output.toLowerCase() === 'array') {
    outputArraysFromSeries(series)
  } else {
    throw new Error(`Unknown output format ${args.output}.`)
  }
}
