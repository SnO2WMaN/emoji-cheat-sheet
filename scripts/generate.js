require('dotenv').config()
const Octokit = require('@octokit/rest')
const { getCategorizeGithubEmojiIds } = require('./fetch')
const { generateCheatSheet } = require('./markdown')

const { GIST_ID: gistId, GH_TOKEN: githubToken } = process.env

const octokit = new Octokit({
  auth: `token ${githubToken}`
})

async function generate() {
  return generateCheatSheet(await getCategorizeGithubEmojiIds())
}

if (require.main === /** @type {unknown} */ (module)) {
  ;(async () => {
    const cheatSheet = await generate()
    await octokit.gists.update({
      gist_id: gistId,
      description: 'https://github.com/SnO2WMaN/emoji-cheat-sheet',
      files: {
        'emoji-cheet-sheet.md': {
          content: cheatSheet
        }
      }
    })
  })()
} else {
  module.exports = generate
}
