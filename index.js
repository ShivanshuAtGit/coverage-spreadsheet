const core = require("@actions/core");
const github = require("@actions/github");

(async () => {
  try {
    core.notice("Calling our action --> spreadsheet");
    const report = core.getInput("report");
    console.log(`------>  ${report}!`);
  } catch (err) {
    core.setFailed(err.message);
  }
})();
