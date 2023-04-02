const core = require("@actions/core");
const github = require("@actions/github");
const DomParser = require('dom-parser');
const parser = new DomParser();

(async () => {
  try {
    core.notice("Calling our action --> spreadsheet");
    const report = core.getInput("report");
    const dom = parser.parseFromString(report);
    console.log(dom)

    console.log(dom.getElementsByTagName('div'));
  } catch (err) {
    core.setFailed(err.message);
  }
})();
