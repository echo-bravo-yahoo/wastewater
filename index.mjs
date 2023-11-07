// data and column descriptions from: https://data.cdc.gov/Public-Health-Surveillance/NWSS-Public-SARS-CoV-2-Wastewater-Metric-Data/2ew6-ywp6

import yargs from 'yargs'

import { processFile } from './lib/csv.mjs'
import { sortTimeSeries, timeSeriesFromKey, isInState, isInCounty } from './lib/dataManipulation.mjs'
import { graphAllSeries } from './lib/graph.mjs'
import { getData, getDataPath } from './lib/network.mjs'

import cliProgress from 'cli-progress'

(async () => {
  const args = await yargs(process.argv.slice(2)).parse()
  getData()

  const progress = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);
  let count = 0
  const goalCb = (goal) => {
    progress.start(goal, count)
  }
  const incrementalCb = () => {
    progress.update(++count)
  }

  const records = await processFile(getDataPath(), [isInState(args.state), isInCounty(args.county)], goalCb, incrementalCb)

  progress.stop()

  const series = sortTimeSeries(timeSeriesFromKey(records, 'id'));

  // console.log('global first date: ', firstDate)
  graphAllSeries(series)
})()
