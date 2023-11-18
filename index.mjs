#!/usr/bin/env node

// data and column descriptions from: https://data.cdc.gov/Public-Health-Surveillance/NWSS-Public-SARS-CoV-2-Wastewater-Metric-Data/2ew6-ywp6

import yargs from 'yargs'

import history from './lib/commands/history.mjs'

yargs(process.argv.slice(2))
  .command(['history', '*'], 'examine COVID wastewater history', {
    state: {
      describe: 'which US state(s) to pull data for'
    },
    county: {
      alias: 'counties',
      describe: 'which US counties to pull data for'
    },
    output: {
      describe: 'what format to output',
      default: 'sparkchart',
      // TODO: Support JSON, CSV output
      choices: ['sparkchart']
    }
  },
  history
  ).parse()
