"use strict";

/**
 * Create a promotion pull request using the provided Octokit-like client.
 *
 * Params:
 * - octokit: object with pulls.create method
 * - opts: { owner, repo, head, base, runId, sha }
 */
async function createPromotionPR(octokit, opts = {}) {
  const owner = opts.owner;
  const repo = opts.repo;
  const head = opts.head;
  const base = opts.base || process.env.PROMOTE_BRANCH || 'release/prd-v0.2';
  const runId = opts.runId || process.env.GITHUB_RUN_ID || 'local-run';
  const sha = opts.sha || process.env.GITHUB_SHA || 'local-sha';

  const title = `Promote canary (${head}) → ${base}`;
  const body = `Canary build passed health checks. CI run: ${runId}\nCommit: ${sha}`;

  const resp = await octokit.pulls.create({ owner, repo, head, base, title, body });
  return resp;
}

module.exports = { createPromotionPR };
