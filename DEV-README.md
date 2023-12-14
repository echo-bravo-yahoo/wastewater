## To do
### High
- Data handling
  - Show missing data as ' ' instead of '_'
- Support requesting date ranges
- Fix parsing ETA display (always shows 0 seconds)
- Support displaying progress bar and ETA for getData calls

### Medium
- Support alternative bucketing/aggregating schemes
- Include context (start, end dates, most recent value) in sparkchart output
- Estimate duration for fetching new data

### Low
- Clean up (likely broken) CSV file when process is terminated unexpectedly
- Add performance measurements
- Support API keys and server-side filtering
- Support enumerating sites in a city/county/id set

## Perf testing strategies
`command time wastewater history --id 2420 --format none`

