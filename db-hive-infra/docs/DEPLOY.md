# Infra DEPLOY Runbook

Minimal infra canary runbook (Terraform or provider-specific).

Prerequisites

- Provider credentials and appropriate permissions in GitHub Actions

## Steps

1. Push infra changes to `canary`
2. CI runs `terraform fmt`, `terraform validate` and `terraform plan`
3. Human review may be required before applying changes to staging/canary

Rollback

- Revert commit and reapply previous configuration
