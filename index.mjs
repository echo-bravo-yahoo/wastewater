#!/usr/bin/env node

// interactive COVID wastewater site: https://covid.cdc.gov/covid-data-tracker/#wastewater-surveillance
// data and column descriptions from: https://data.cdc.gov/Public-Health-Surveillance/NWSS-Public-SARS-CoV-2-Wastewater-Metric-Data/2ew6-ywp6

import * as fs from 'fs'
import { resolve } from 'path'
const __dirname = import.meta.dirname;

import yargs from 'yargs'
import updateNotifier from 'update-notifier'

import history from './lib/commands/history.mjs'

yargs(process.argv.slice(2))
  .check((argv) => {
    const packageJson = JSON.parse(fs.readFileSync(resolve(__dirname, 'package.json')))
    // check for updates before starting actual work
    const notifier = updateNotifier({
      pkg: packageJson,
      updateCheckInterval: 1000 * 60 * 60 * 24 * 7 // 1 week
    })

    // only notify the user if running in noisy mode
    if (!argv.quiet) notifier.notify()

    return true
  })
  .command(['history', '*'], 'examine COVID wastewater history', {
    state: {
      describe: 'which US state(s) to pull data for'
    },
    counties: {
      alias: 'county',
      describe: 'which US counties to pull data for'
    },
    ids: {
      alias: 'id',
      describe: 'the wastewater treatment center IDs to pull data for',
      type: 'array'
    },
    quiet: {
      describe: 'suppress progress bars, progress text, and update notifications. intended for programmatic / scripted use.',
      default: false,
      type: 'boolean'
    },
    refresh: {
      describe: 'fetch new data, even if there\'s already cached data from earlier today',
      default: false,
      type: 'boolean'
    },
    omitInactive: {
      describe: 'filter out plants that have not reported data in the last week',
      default: false,
      type: 'boolean'
    },
    output: {
      alias: 'format',
      describe: 'what format to output',
      default: 'sparkchart',
      choices: ['sparkchart', 'json', 'csv', 'array', 'none']
    },
    bucketSize: {
      describe: 'the amount of time that each datapoint in a graph or row in a csv/json represents',
      default: '1d',
      choices: ['1d', '1w', '1m']
    }
  },
  history
  ).parse()
