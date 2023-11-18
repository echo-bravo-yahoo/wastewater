import cliProgress from 'cli-progress'

import { processFile } from '../csv.mjs'
import { sortTimeSeries, timeSeriesFromKey, isInState, isInCounty } from '../dataManipulation.mjs'
import { graphAllSeries } from '../graph.mjs'
import { getData, getDataPath } from '../network.mjs'

export default async function doHistory(args) {
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
  }
