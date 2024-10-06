const path = require('path');
const { csvToJson } = require('../index');
const data = require('./fixture/case.json');

const cases_data = data.cases;

cases_data.forEach((cd) => {
  const dest = path.join(__dirname, `../tmp/${cd.tcno}.json`);
  csvToJson(cd.csv_path, dest, cd.dynamic === "true", cd.delimiters);
})

