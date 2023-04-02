const core = require("@actions/core");
const github = require("@actions/github");
const DomParser = require("dom-parser");
const { GoogleSpreadsheet } = require("google-spreadsheet");

const parser = new DomParser();
const doc = new GoogleSpreadsheet(core.getInput("doc_id"));

const pushIntoExcel = async (coverage) => {
  await doc.useServiceAccountAuth({
    private_key: core.getInput("private_key"),
    client_email: core.getInput("client_email"),
  }); // authenticating credential for gcloud service

  await doc.loadInfo(); // loads document properties and worksheets
  const sheet = doc.sheetsByIndex[0];

  await sheet.addRows([
    github.context.ref,
    ...Object.values(coverage),
    new Date(),
  ]);
};

const getCoveragePercentage = (report) => {
  // this fn fetches coverage percentage from dom report
  const dom = parser.parseFromString(report);
  const divArr = dom.getElementsByTagName("div");
  return {
    statementCoverage: divArr[1],
    branchCoverage: divArr[2],
    functionCoverage: divArr[3],
    lineCoverage: divArr[4],
  };
};

(async () => {
  try {
    core.notice("Calling our action --> spreadsheet");
    const report = core.getInput("report");
    const coverageReport = getCoveragePercentage(report);
    pushIntoExcel(coverageReport);
  } catch (err) {
    core.setFailed(err.message);
  }
})();
