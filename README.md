### To do
- Add performance measurements
- Support filtering for specific treatment centers
- Support alternative bucketing/aggregating schemes
- Estimate duration for fetching new data
- Alternate export formats
  - CSV
  - JSON
- Support API keys and server-side filtering
- Fix parsing the whole dataset (see Whole dataset parsing bug, below)
- Include context (start, end dates) in sparkchart output
- Support requesting date ranges
- Support force fetching new dataset

### Whole dataset parsing bug
 sample_location in wwtp_jurisdiction (#wwtp_id) serving NaN people in county_names county:
index.mjs history

examine COVID wastewater history

Options:
  --help                Show help                                      [boolean]
  --version             Show version number                            [boolean]
  --state               which US state(s) to pull data for
  --county, --counties  which US counties to pull data for
  --output              what format to output
                                 [choices: "sparkchart"] [default: "sparkchart"]

RangeError: Invalid array length
    at seriesToGraphable (file:///home/swift/workspace/wastewater/lib/dataManipulation.mjs:46:13)
    at graphAllSeries (file:///home/swift/workspace/wastewater/lib/graph.mjs:15:25)
    at Object.doHistory [as handler] (file:///home/swift/workspace/wastewater/lib/commands/history.mjs:27:5)
    at runMicrotasks (<anonymous>)
    at processTicksAndRejections (node:internal/process/task_queues:96:5)
