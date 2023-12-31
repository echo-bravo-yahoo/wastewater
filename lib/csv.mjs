import fs from 'node:fs'
import { parse } from 'csv-parse'
import { exec } from 'child_process'

export async function processFile(filePath, filters = [], goalCb = () => {}, incrementalCb = () => {}) {

  exec(`wc -l ${filePath}`, function (error, results) {
    goalCb(Number(results.split(' ')[0]))
  })

  const records = []
  const parser = fs
    .createReadStream(filePath)
    .pipe(parse({ columns: [
      /************************************************************************
       * Column 0, wwtp_jurisdiction => state                                 *
       *                                                                      *
       * Description: State, DC, US territory, or Freely Associated State     *
       * jurisdiction name (2-letter abbreviation) in which the wastewater    *
       * treatment plant provided in 'wwtp_id' is located.                    *
       *                                                                      *
       * Sample data: "Washington"                                            *
       ************************************************************************/
      'state',

      /************************************************************************
       * Column 1, wwtp_id => id                                              *
       *                                                                      *
       * Description: State, DC, US territory, or Freely Associated State     *
       * jurisdiction name (2-letter abbreviation) in which the wastewater    *
       * treatment plant provided in 'wwtp_id' is located.                    *
       * A unique identifier for wastewater treatment plants. This is an      *
       * arbitrary integer used to provide a unique, but anonymous identifier *
       * for a wastewater treatment plant. This identifier is consistent over *
       * time, such that the same plant retains the same ID regardless of the *
       * addition or subtraction of other plants from the data set.           *
       *                                                                      *
       * Sample data: "2149"                                                  *
       ************************************************************************/
      'id',

      /************************************************************************
       * Column 2, reporting_jurisdiction => undefined                        *
       *                                                                      *
       * Description: The CDC Epidemiology and Laboratory Capacity (ELC)      *
       * jurisdiction, most frequently a state, reporting these data          *
       * (2-letter abbreviation).                                             *
       *                                                                      *
       * Notes: At least for Washington, this is _not_ a 2 letter             *
       * abbreviation. Not including.                                         *
       *                                                                      *
       * Sample data: "Washington"                                            *
       ************************************************************************/
      undefined,

      /************************************************************************
       * Column 3, sample_location => location                                *
       *                                                                      *
       * Description: Sample collection location in the wastewater system,    *
       * whether at a wastewater treatment plant (or other community level    *
       * treatment infrastructure such as community-scale septic) or upstream *
       * in the wastewater system.                                            *
       *                                                                      *
       * Sample data: "Treatment plant"                                       *
       ************************************************************************/
      'location',

      /************************************************************************
       * Column 4, sample_location_specify => undefined                       *
       *                                                                      *
       * Description: A unique identifier for "upstream" sample locations.    *
       * Specifically, when 'sample_location' is "upstream", this field has a *
       * non-empty value, which provides a unique, but anonymous identifier   *
       * for the upstream sample collection sites. This identifier is         *
       * consistent over time, such that the same sample collection site      *
       * retains the same ID regardless of the addition or subtraction of     *
       * other sample collection sites from the data set.                     *
       *                                                                      *
       * Sample data: ''                                                      *
       ************************************************************************/
      undefined,

      /************************************************************************
       * Column 5, key_plot_id => undefined                                   *
       *                                                                      *
       * Description: A unique identifier for the geographic area served by   *
       * this sampling site, called a sewershed. This is an underscore-       *
       * separated concatenation of the fields 'wwtp_jurisdiction',           *
       * 'wwtp_id', and, if 'sample_location' is "upstream", then also        *
       * 'sample_location_specify', and sample_matrix.                        *
       *                                                                      *
       * Sample data: "NWSS_wa_2419_Treatment plant_post grit removal"        *
       ************************************************************************/
      undefined,

      /************************************************************************
       * Column 6, county_name => counties                                    *
       *                                                                      *
       * Description: The county and county-equivalent names corresponding to *
       * the FIPS codes in 'county_fips'.                                     *
       *                                                                      *
       * Sample data: "King,Pierce" => ["King", "Pierce"]                     *
       ************************************************************************/
      'counties',

      /************************************************************************
       * Column 7, county_fips => undefined                                   *
       *                                                                      *
       * Description: 5-digit numeric FIPS codes of all counties and county   *
       * equivalents served by this sampling site (i.e., served by this       *
       * wastewater treatment plant or, if 'sample_location' is "upstream",   *
       * then by this upstream location). Note that multiple sampling sites   *
       * or treatment plants may serve a single county, and that a single     *
       * sampling site or treatment plant may serve multiple counties.        *
       * Counties listed may be entirely or only partly served by this        *
       * sampling site.                                                       *
       *                                                                      *
       * Sample data: "53053,53033"                                           *
       ************************************************************************/
      undefined,

      /************************************************************************
       * Column 8, population_served => population                            *
       *                                                                      *
       * Description: Estimated number of persons served by this sampling     *
       * site (i.e., served by this wastewater treatment plant or, if         *
       * 'sample_location' is "upstream", then by this upstream location).    *
       *                                                                      *
       * Sample data: "896000"                                                *
       ************************************************************************/
      'population',

      /************************************************************************
       * Column 9, date_start => dateStart                                    *
       *                                                                      *
       * Description: The start date of the interval over which the metric is *
       * calculated. Intervals are inclusive of start and end dates.          *
       *                                                                      *
       * Sample data: "2023-10-19"                                            *
       ************************************************************************/
      'dateStart',

      /************************************************************************
       * Column 10, date_end => dateEnd                                       *
       *                                                                      *
       * Description: The end date of the interval over which the metric is   *
       * calculated. Intervals are inclusive of start and end dates.          *
       *                                                                      *
       * Sample data: "2023-11-02"                                            *
       ************************************************************************/
      'dateEnd',

      /************************************************************************
       * Column 11, ptc_15d => changeOver15Days                               *
       *                                                                      *
       * Description: The percent change in SARS-CoV-2 RNA levels over the    *
       * 15-day interval defined by 'date_start' and 'date_end'. Percent      *
       * change is calculated as the modeled change over the interval, based  *
       * on linear regression of log-transformed SARS-CoV-2 levels.           *
       * SARS-CoV-2 RNA levels are wastewater concentrations that have been   *
       * normalized for wastewater composition.                               *
       *                                                                      *
       * Sample data: "-28"                                            *
       ************************************************************************/
      'changeOver15Days',

      /************************************************************************
       * Column 12, detect_prop_15d => undefined                              *
       *                                                                      *
       * Description: The proportion of tests with SARS-CoV-2 detected,       *
       * meaning a cycle threshold (Ct) value <40 for RT-qPCR or at least 3   *
       * positive droplets/partitions for RT-ddPCR, by sewershed over the     *
       * 15-day window defined by 'date_start' and "date_end'. The detection  *
       * proportion is the percent calculated by dividing the 15-day rolling  *
       * sum of SARS-CoV-2 detections by the 15-day rolling sum of the number *
       * of tests for each sewershed and multiplying by 100.                  *
       *                                                                      *
       * Sample data: "100"                                                   *
       ************************************************************************/
      undefined,

      /************************************************************************
       * Column 13, percentile => percentile                                  *
       *                                                                      *
       * Description: This metric shows whether SARS-CoV-2 virus levels at a  *
       * site are currently higher or lower than past historical levels at    *
       * the same site. 0% means levels are the lowest they have been at the  *
       * site; 100% means levels are the highest they have been at the site.  *
       * Public health officials watch for increasing levels of the virus in  *
       * wastewater over time and use this data to help make public health    *
       * decisions.                                                           *
       *                                                                      *
       * Sample data: "42.0"                                                   *
       ************************************************************************/
      'percentile',

      /************************************************************************
       * Column 14, sampling_prior => undefined                               *
       *                                                                      *
       * Description: Indicates whether the site was collecting wastewater    *
       * samples before or on December 1, 2021.                               *
       *                                                                      *
       * Sample data: "no"                                                    *
       ************************************************************************/
      undefined,

      /************************************************************************
       * Column 14, first_sample_date => firstSampleDate                      *
       *                                                                      *
       * Description: The first date samples were collected at a site.        *
       *                                                                      *
       * Sample data: "2023-09-18"                                            *
       ************************************************************************/
      'firstSampleDate'
    ]}))

  for await (const record of parser) {
    record.counties = record.counties.split(',')

    let passed = true
    for (const filter of filters) {
      if (!filter(record)) {
        passed = false
        break;
      }
    }
    if (passed) records.push(record)
    incrementalCb()
  }

  return records
}
