# db-hive-infra

Minimal infrastructure repository skeleton for the DB Hive project.

Layout (minimal):

- infra/
- frontend/
- backend/
- tests/
- docs/

## Purpose

This repository will contain IaC modules, CI scripts and deployment manifests used by the project.

## Local validation

To validate that the repository skeleton exists (workspace-level script):

  node scripts/validate-skeletons.js

## Contribution & deploy notes

This repository will contain IaC modules, CI scripts and deployment manifests used by the project.

How to run checks locally

- This repo is primarily IaC (Terraform/CloudFormation), so local validation requires the provider CLI tools. As a minimal validation you can run any provided node scripts or linting helpers if present.

CI expectations

- Pull requests should run IaC static checks (e.g., terraform fmt, terraform validate) and the `validate` job in the canary workflow should execute those checks.
- Pushes to the `canary` branch should run the validate job and, if applicable, deploy changes to a canary environment (some infra changes require human review).

Running the staging health-check from CI

- The canary CI job will assert the canary health endpoint using the `CI_HEALTH_CHECK_URL` secret. To run the check locally:

```bash
export CI_HEALTH_CHECK_URL="https://staging.example.com/health"
curl -sSf "$CI_HEALTH_CHECK_URL" | jq -e '.status == "ok" and .services.db == "ok"'
```

Contact

- Maintainers: infra team (add names/emails)
