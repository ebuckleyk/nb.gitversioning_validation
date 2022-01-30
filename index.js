const core = require('@actions/core');
const github = require('@actions/github');

async function run() {
  const token = await core.getInput('github-token');
  // const octokit = github.getOctokit(token, {baseUrl: 'https://api.github.com'});
  const octokit = github.getOctokit(token);

  const { data } = await octokit.rest.pulls.listFiles({
    owner: github.context.repo.owner,
    repo: github.context.repo.repo,
    pull_number: github.context.issue.number
  });

  const version_json = data.find(x => x.filename == 'version.json');
  if (!version_json) return null;

  console.log({version_json})

  const json = await (await fetch(version_json.raw_url)).json();

  console.log({ json })

  console.log({ data });
}
try {
  const pathToVersion = core.getInput('version-json-path')
  console.log(`Path to version.json: ${pathToVersion}`);
  // const repoUrl = `https://api.github.com/repos/${github.context.repo.repo}/pulls/${github.context.issue.number}/files`
  // console.log({repoUrl})
  // const payload = JSON.parse(github.context.payload, undefined, 2);
  // console.log({payload});
  core.setOutput('time', (new Date()).toTimeString()); // temporary for testing
  run();
} catch (error) {
  core.setFailed(error.message);
}