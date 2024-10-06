const fs = require('fs');
const xml2js = require('xml-js');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

const xmlData = fs.readFileSync('./__tests__/tests_case.xml', 'utf8');
const jsonData = xml2js.xml2json(xmlData, { compact: true, spaces: 4 });
const system = JSON.parse(jsonData)['System'];
const testcases = system['Testset']['Testcase'];
const data = { cases: [] }


const generateRandomValue = (field_string, field_number, field_bool, special_chr, empty) => {
  if (empty === 'true' && Math.random() > 0.5) {
    return null;
  }

  if (field_bool === 'true' && Math.random() > 0.5) {
    return Math.random() > 0.5 ? true : false;
  }

  if (field_string === 'true') {
    let randomStr = "sample cell"
    if (special_chr === 'commas') {
      randomStr += ',';
    } else if (special_chr === 'quotes') {
      randomStr += '"';
    } else if (special_chr === 'newlines') {
      randomStr += '\n';
    }
    return randomStr;
  }

  if (field_number) {
    return Math.floor(Math.random() * 100);
  }

  return null;
};



for (const tc of testcases) {
  const { _attributes, Value } = tc;
  const [
    _,
    { _text: column },
    { _text: is_same_row },
    { _text: field_string },
    { _text: field_number },
    { _text: field_bool },
    { _text: special_chr },
    { _text: delimiters },
    { _text: empty },
    { _text: dynamic }
  ] = Value;
  const test_data = {};
  test_data['tcno'] = _attributes.TCNo;
  test_data['dynamic'] = dynamic;
  const csv_path = `./__tests__/fixture/csv/sample${test_data.tcno}.csv`;
  test_data['csv_path'] = csv_path;
  test_data['column'] = column;
  test_data['field_string'] = field_string;
  test_data['field_number'] = field_number;
  test_data['field_bool'] = field_bool;
  test_data['special_chr'] = special_chr;
  test_data['empty'] = empty;
  test_data['delimiters'] = delimiters

  const columnNum = Number(column)

  // csv-writer does not support tsv
  if (delimiters === 'tab') {
    const tsvHeader = Array.from({ length: columnNum }, (_, index) => `Column${index + 1}`);
    const tsvRecords = Array.from({ length: is_same_row === 'true' ? columnNum : columnNum + 10 }, () => generateRandomValue(field_string, field_number, field_bool, special_chr, empty));

    const tsvData = [tsvHeader.join('\t'), tsvRecords.join('\t')].join('\n');
    fs.writeFile(csv_path, tsvData, (err) => {
      if (err) throw err;
      console.log('🚀')
    });
    data.cases.push(test_data);
    continue;
  }

  const csvHeader = Array.from({ length: columnNum }, (_, index) => ({ id: `Column${index + 1}`, title: `Column${index + 1}` }));


  const delimiter = delimiters === 'comma' ? ',' :
    delimiters === 'semicolon' ? ';' : ',';

  const csvWriter = createCsvWriter({
    path: csv_path,
    header: csvHeader,
    fieldDelimiter: delimiter
  });

  const csvRecords = Array.from({ length: is_same_row === 'true' ? columnNum : columnNum + 10 }, () => {
    return csvHeader.reduce((record) => {
      csvHeader.forEach((header) => {
        record[header.id] = generateRandomValue(field_string, field_number, field_bool, special_chr, empty);
      });
      return record;
    }, {});
  });

  csvWriter.writeRecords(csvRecords)
    .then(() => console.log('🚀'))
    .catch(err => console.error('❌', err));

  data.cases.push(test_data);
}

const jsonString = JSON.stringify(data, null, 2);

try {
  fs.writeFileSync('./__tests__/fixture/case.json', jsonString);
  console.log('JSON file has been saved.');
} catch (err) {
  console.error('Error writing JSON file:', err);
}
