var csv2json = require('csv2json');
var fs = require('fs');
// const data = require('./__tests__/fixture/case.json');


const csvToJson = (path, dest, dynamicTyping, separator) => {
  console.log(dest)
  const delimiter = separator === 'comma' ? ',' :
    separator === 'tab' ? '\t' :
      separator === 'semicolon' ? ';' : ',';
  fs.createReadStream(path)
    .pipe(csv2json({
      dynamicTyping,
      separator: delimiter,
    }))
    .pipe(fs.createWriteStream(dest));
}

exports.csvToJson = csvToJson;

// const cases_data = data.cases;

// cases_data.forEach((cd) => {
//   const dest = `./__tests__/fixture/expected/sample${cd.tcno}.json`;
//   csvToJsonFile(cd.csv_path, dest, cd.dynamic === "true", cd.delimiters)
// })

