const core = require("@actions/core");
const github = require("@actions/github");

(async () => {
  try {
    core.notice("Calling our action --> spreadsheet");
  } catch (err) {
    core.setFailed(err.message);
  }
})();
