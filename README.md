# Wastewater

## Intent
This is a CLI tool for helping people make informed decisions about COVID risk. COVID testing has become less accessible, resulting in a 69.36% test volume decrease from Nov 2022 to Nov 2023 ([data available here](https://covid.cdc.gov/covid-data-tracker/#trends_select_testpositivity_00)). Given the reduction in test volume (and abundance of unreported at-home test results), wastewater analysis is one of the few remaining tools for gauging comparative COVID risk. This tool is intended to be equally useful for ad-hoc usage as a CLI tool or programmatic / scripted usage.

If you've worked with me before, you may be aware of my love for [sparkline](https://en.wikipedia.org/wiki/Sparkline) charts, a type of small chart usually used in financial reporting, and often included in-line with text. Sparkline charts in a terminal environment are a convenient, legible tool for making sense of large datasets.

## Prerequisites
Install nodeJS, either [directly from their website](https://nodejs.org/en) or through [nvm (node version manager)](https://github.com/nvm-sh/nvm#intro).

## Installation
Install wastewater globally using npm (`npm install wastewater-cli --global`).

## Example Usage
Note that ellipses (`...`) are used for brevity, and represent ommitted data similar to that above and below it. Also note that many of the options for the tool have aliases, both for singular and plural usage (`id` and `ids` or `county` and `counties`) as well as common synonyms (`output` and `format`)

### Graph the wastewater trends for all plants in Florida's Orange county
Notice that, since there's an Orange county in multiple states, this command filters both by state (`--state`) and county (`--county`).
```bash
> wastewater history --county Orange --state Florida
Existing data found. Using it.
 ████████████████████████████████████████ 100% | ETA: 0s | 741807/741807
 Treatment plant in Florida (#1715) serving 183,009 people in Orange county:
▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▂▂▂▂▂▂▂▂▂▃▃▃▃▃▄▄▄▄▄▄▄▄▄▄▄▄▅▅▅▅▅▅▅▅▅▅▅▅▅▅▆▆▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▆▆▆▇▇▇▇███████▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇█████████▇▇▇▇▇▇▇▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▇▇▆▆▆▆▆▆▆▅▅▅▅▅▅▅▄▄▄▄▄▄▄▅▅▅▅▅▆▆▆▆▆▆▆▅▅▄▄▄▃▃▃▃▃▃▂▂▂▃▃▃▃▃▃▃▄▄▄▄▄▄▄▅▅▅▅▅▅▅▆▆▆▆▆▆▆▆▆▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▆▆▆▇▇▇▇▇▇▇▇▇███████████████████████████████████▇▇▇▇▇▇▇▆▆▆▆▆▆▆▆▆▅▅▅▅▅▅▅▅▅▅▅▅▅▅▆▆▆▆▆▆▆▆▆▆▅▅▅▅▄▄▄▃▃▄▄▃▃▃▄▄▄▄▄▄▄▄▄▄▄▃▃▃▃▃▃▃▃▃▃▃▃▄▄▄▄▄▃▃▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▃▃▃▃▃▃▃▃▃▃▂▂▃▃▂▂▂▂▂▂▂▃▃▃▃▃▃▃▃▃▃▄▄▃▃▃▃▃▃▃▃▃▃▃▃▃▃▂▂▂▂▂▂▂▃▃▃▃▃▃▃▃▃▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▆▆▆▆▅▅▆▆▆▇▇▆▆▇▇▇▇▇▇▇████████████▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▆▆▆▆▆▅▅▅▅▅▅▅▅▅▄▄▄▄▄▄▄▅▅▅▄▄▃▃▄▄▄▃▃▄▄▄▃▃▄▄▄▄▅▅▅▅▅▅▅▅▅▅▆▆▅▅▄▄▄▃▃▄▄

Treatment plant in Florida (#1735) serving 51,000 people in Orange and Seminole counties:
▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▂▂▂▂▂▂▂▂▂▂▃▃▃▃▄▄▄▄▄▄▄▅▅▅▅▅▅▅▅▅▅▆▆▆▆▆▆▆▇▇▇▇▇▇▇███████████▇▇▇████▇▇▇███████████▇▇▇▇▇▇▇▇▇▆▆▆▆▆▅▅▅▅▅▅▅▃▃▃▃▃▃▃▃▃▃▄▄▄▄▄▄▄▅▅▅▅▄▄▄▄▄▄▄▃▃▃▃▃▃▃▂▂▂▂▂▂▂▂▂▂

```

### Output a CSV description of the wastewater trends for specific plants
This example uses two specific treatment plant IDs instead of a county or state. Note that it does not output any of the progress bars or text (because of the `--quiet` flag) and re-downloads the dataset, even if it's available on disk (because of the `--refresh` flag).
```bash
> wastewater history --ids 2420 676 --format csv --quiet --refresh
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


## To do
- Handle gaps in sparkline better (see plant ID 671)
- Document what the sparkline actually shows
- Clean up (likely broken) CSV file when process is terminated unexpectedly
- Add performance measurements
- Support alternative bucketing/aggregating schemes
- Estimate duration for fetching new data
- Support API keys and server-side filtering
- Include context (start, end dates) in sparkchart output
- Support requesting date ranges
- Support enumerating sites in a city/county/id set
