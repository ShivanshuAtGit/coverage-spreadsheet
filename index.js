const core = require("@actions/core");
const github = require("@actions/github");
const DomParser = require("dom-parser");
const { GoogleSpreadsheet } = require("google-spreadsheet");
const creds = require("./client_secret.json");

const parser = new DomParser();
const doc = new GoogleSpreadsheet(
  "1nNIMn_0vXO4Vd8Zavft9I-3y9y5atfHS8KuTQNTec-8"
);

const pushIntoExcel = async (str) => {
  await doc.useServiceAccountAuth(creds);

  await doc.loadInfo(); // loads document properties and worksheets
  const sheet = doc.sheetsByIndex[0];
  await sheet.setHeaderRow(["branch", "percentage", "date"]);

  await sheet.addRows([
    {
      branch: "testing branch",
      percentage: str,
      date: new Date(),
    },
  ]);
};

(async () => {
  try {
    core.notice("Calling our action --> spreadsheet");
    const report = core.getInput("report");
    const dom = parser.parseFromString(report);
    pushIntoExcel(report);
    console.log(dom);
  } catch (err) {
    core.setFailed(err.message);
  }
})();
