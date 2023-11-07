// data and column descriptions from: https://data.cdc.gov/Public-Health-Surveillance/NWSS-Public-SARS-CoV-2-Wastewater-Metric-Data/2ew6-ywp6

import yargs from 'yargs'

import { processFile } from './lib/csv.mjs'
import { sortTimeSeries, timeSeriesFromKey, isInState, isInCounty } from './lib/dataManipulation.mjs'
import { graphAllSeries } from './lib/graph.mjs'

(async () => {
  const args = await yargs(process.argv.slice(2)).parse()
  const records = await processFile('NWSS_Public_SARS-CoV-2_Wastewater_Metric_Data_20231105', [isInState(args.state), isInCounty(args.county)])

  const series = sortTimeSeries(timeSeriesFromKey(records, 'id'));

  // console.log('global first date: ', firstDate)
  graphAllSeries(series)
})()
