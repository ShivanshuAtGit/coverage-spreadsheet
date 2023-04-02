const core = require("@action/core");
const github = require("@action/github");

(async () => {
  try {
    core.notice("Calling our action --> spreadsheet");
  } catch (err) {
    core.setFailed(err.message);
  }
})();
