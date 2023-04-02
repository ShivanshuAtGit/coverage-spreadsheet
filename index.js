const core = require("@actions/core");
const github = require("@actions/github");
const DomParser = require("dom-parser");
const { GoogleSpreadsheet } = require("google-spreadsheet");

const parser = new DomParser();
const doc = new GoogleSpreadsheet(core.getInput("doc_id"));

const pushIntoExcel = async (str) => {
  await doc.useServiceAccountAuth({
    private_key: core.getInput("private_key"),
    client_email: core.getInput("client_email"),
  }); // authenticating credential for gcloud service

  await doc.loadInfo(); // loads document properties and worksheets
  const sheet = doc.sheetsByIndex[0];

  await sheet.addRows([
    {
      branch: github.context.ref,
      percentage: str,
      date: new Date(),
    },
  ]);
};

const getCoveragePercentage = (report) => {
  // this fn fetches coverage percentage from dom report
  const dom = parser.parseFromString(report);
  const divArr = dom.getElementsByTagName("div");
  return divArr[divArr.length - 1].innerHTML;
};

(async () => {
  try {
    core.notice("Calling our action --> spreadsheet");
    const report = core.getInput("report");
    const lineCoverage = getCoveragePercentage(report);
    pushIntoExcel(lineCoverage);
  } catch (err) {
    core.setFailed(err.message);
  }
})();
