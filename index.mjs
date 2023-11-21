#!/usr/bin/env node

// interactive COVID wastewater site: https://covid.cdc.gov/covid-data-tracker/#wastewater-surveillance
// data and column descriptions from: https://data.cdc.gov/Public-Health-Surveillance/NWSS-Public-SARS-CoV-2-Wastewater-Metric-Data/2ew6-ywp6

import yargs from 'yargs'

import history from './lib/commands/history.mjs'

yargs(process.argv.slice(2))
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
      describe: 'suppress progress bars and text. intended for programmatic / scripted use.',
      default: false,
      type: 'boolean'
    },
    refresh: {
      describe: 'fetch new data, even if there\'s already cached data from earlier today',
      default: false,
      type: 'boolean'
    },
    output: {
      alias: 'format',
      describe: 'what format to output',
      default: 'sparkchart',
      choices: ['sparkchart', 'json', 'csv']
    }
  },
  history
  ).parse()
