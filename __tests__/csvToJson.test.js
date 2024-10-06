const path = require('path');
const data = require('./fixture/case.json');

describe('csv2json', () => {
  const cases_data = data.cases;

  cases_data.forEach((cd) => {
    const description = `Test Case ${cd.tcno}: column = ${cd.column}, field_string = ${cd.field_string}, field_number = ${cd.field_number}, field_bool = ${cd.field_bool}, special_chr = ${cd.special_chr}, empty = ${cd.empty}, delimiters = ${cd.delimiters}`;

    it(description, async () => {
      const dest = path.join(__dirname, `../tmp/${cd.tcno}.json`);
      const expectedFilePath = path.join(__dirname, `./fixture/expected/sample${cd.tcno}.json`);
      const expectedData = require(expectedFilePath);
      const resultData = require(dest);
      expect(resultData).toEqual(expectedData);
    });
  });
});
