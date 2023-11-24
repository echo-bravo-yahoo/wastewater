# Wastewater

## Intent
This is a CLI tool for helping people make informed decisions about COVID risk. COVID testing has become less accessible, resulting in a 69.36% test volume decrease from Nov 2022 to Nov 2023 ([data available here](https://covid.cdc.gov/covid-data-tracker/#trends_select_testpositivity_00)). Given the reduction in test volume (and abundance of unreported at-home test results), wastewater analysis is one of the few remaining tools for gauging comparative COVID risk. This tool is intended to be equally useful for ad-hoc usage as a CLI tool or programmatic / scripted usage.

If you've worked with me before, you may be aware of my love for [sparkline](https://en.wikipedia.org/wiki/Sparkline) charts, a type of small chart usually used in financial reporting, and often included in-line with text. Sparkline charts in a terminal environment are a convenient, legible tool for making sense of large datasets.

## Prerequisites
Install nodeJS, either [directly from their website](https://nodejs.org/en) or through [nvm (node version manager)](https://github.com/nvm-sh/nvm#intro).

## Installation
Install wastewater globally using npm (`npm install wastewater-cli --global`).

## Example Usage
Note that ellipses (`...`) are used for brevity, and represent ommitted data similar to that above and below it. Also note that many of the options for the tool have aliases, both for singular and plural usage (`id` and `ids` or `county` and `counties`) as well as common synonyms (`output` and `format`). The examples build on each other; I recommend reading them through from start to finish.

### Graph the wastewater trends for all plants in Florida's Orange county
Notice that, since there's an Orange county in multiple states, this command filters both by state (`--state`) and county (`--county`). The default view is a sparkline of the amount of COVID detected in wastewater by day, as a percentage of the worst recording at that site. For instance, if the worst recorded day was a week ago, and today is half as bad, the value for a week ago would be 100, and today would be 50.
```bash
> wastewater history --county Orange --state Florida
Existing data found. Using it.
 ████████████████████████████████████████ 100% | ETA: 0s | 741807/741807
 Treatment plant in Florida (#1715) serving 183,009 people in Orange county:
▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▂▂▂▂▂▂▂▂▂▃▃▃▃▃▄▄▄▄▄▄▄▄▄▄▄▄▅▅▅▅▅▅▅▅▅▅▅▅▅▅▆▆▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▆▆▆▇▇▇▇███████▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇█████████▇▇▇▇▇▇▇▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▇▇▆▆▆▆▆▆▆▅▅▅▅▅▅▅▄▄▄▄▄▄▄▅▅▅▅▅▆▆▆▆▆▆▆▅▅▄▄▄▃▃▃▃▃▃▂▂▂▃▃▃▃▃▃▃▄▄▄▄▄▄▄▅▅▅▅▅▅▅▆▆▆▆▆▆▆▆▆▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▆▆▆▇▇▇▇▇▇▇▇▇███████████████████████████████████▇▇▇▇▇▇▇▆▆▆▆▆▆▆▆▆▅▅▅▅▅▅▅▅▅▅▅▅▅▅▆▆▆▆▆▆▆▆▆▆▅▅▅▅▄▄▄▃▃▄▄▃▃▃▄▄▄▄▄▄▄▄▄▄▄▃▃▃▃▃▃▃▃▃▃▃▃▄▄▄▄▄▃▃▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▃▃▃▃▃▃▃▃▃▃▂▂▃▃▂▂▂▂▂▂▂▃▃▃▃▃▃▃▃▃▃▄▄▃▃▃▃▃▃▃▃▃▃▃▃▃▃▂▂▂▂▂▂▂▃▃▃▃▃▃▃▃▃▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▆▆▆▆▅▅▆▆▆▇▇▆▆▇▇▇▇▇▇▇████████████▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▆▆▆▆▆▅▅▅▅▅▅▅▅▅▄▄▄▄▄▄▄▅▅▅▄▄▃▃▄▄▄▃▃▄▄▄▃▃▄▄▄▄▅▅▅▅▅▅▅▅▅▅▆▆▅▅▄▄▄▃▃▄▄

Treatment plant in Florida (#1735) serving 51,000 people in Orange and Seminole counties:
▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▂▂▂▂▂▂▂▂▂▂▃▃▃▃▄▄▄▄▄▄▄▅▅▅▅▅▅▅▅▅▅▆▆▆▆▆▆▆▇▇▇▇▇▇▇███████████▇▇▇████▇▇▇███████████▇▇▇▇▇▇▇▇▇▆▆▆▆▆▅▅▅▅▅▅▅▃▃▃▃▃▃▃▃▃▃▄▄▄▄▄▄▄▅▅▅▅▄▄▄▄▄▄▄▃▃▃▃▃▃▃▂▂▂▂▂▂▂▂▂▂

```

### Output a CSV description of the wastewater trends for several specific plants
You can also use a specific plant ID or IDs instead of a state and/or county, and you can output CSV instead of sparklines (`--format`). Note that this example also re-downloads the dataset, even if it's available on disk (because of the `--refresh` flag); this can be helpful if you have an incomplete CSV file, or want to make sure that you have the latest data saved locally. Local data should be at worst one day old.
```bash
> wastewater history --ids 2420 676 --format csv --refresh
Existing data found, but refresh argument provided. Downloading fresh copy now.
Done downloading new data.
 ████████████████████████████████████████ 100% | ETA: 0s | 745063/745063
id,state,counties,location,population,dateStart,dateEnd,changeOver15Days,percentile,firstSampleDate
676,Washington,"King,Snohomish",Treatment plant,288000,2023-09-06,2023-09-20,,58.0,2023-09-20
2420,Washington,"King,Snohomish",Treatment plant,789000,2023-09-05,2023-09-19,,7.0,2023-09-19
...
```

### Output a JSON description of the wastewater trends for a specific plant
This example uses one plant ID. Note that it does not output any of the progress bars or text (because of the `--quiet` flag).
```bash
> wastewater history --id 2420 --quiet --format json
{
    "2420": [
        {
            "state": "Washington",
            "id": "2420",
            "location": "Treatment plant",
            "counties": [
                "King",
                "Snohomish"
            ],
            "population": "789000",
            "dateStart": "2023-09-05",
            "dateEnd": "2023-09-19",
            "changeOver15Days": "",
            "percentile": "7.0",
            "firstSampleDate": "2023-09-19"
        },
        ...
    ]
}
```

### Parsing the CSV description of the wastewater trends for a specific plant using cut
JSON and CSV output (when in `--quiet` mode) are easy to embed in bash scripts and other automated workflows. This example pulls the most recent reading's percentile value for a given plant.
```bash
> wastewater history --id 2420 --quiet --format csv | tail -n 2 | head -n 1 | cut -d ',' -f 10
66.0
```


## To do
### High
- Data handling
  - Many plants have gaps in reporting; show that better (see plant ID 676)
  - Many plants report 999 instead of real data; show that better (see plant ID 676)
- Support requesting date ranges

### Medium
- Support alternative bucketing/aggregating schemes
- Include context (start, end dates, most recent value) in sparkchart output

### Low
- Clean up (likely broken) CSV file when process is terminated unexpectedly
- Add performance measurements
- Estimate duration for fetching new data
- Support API keys and server-side filtering
- Support enumerating sites in a city/county/id set
