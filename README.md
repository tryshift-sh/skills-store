# Skills Store

Skills Store is Shift's official repository for managed skills.

See [Skill-Spec.md](./Skill-Spec.md) for the full contract for adding a new managed skill.

## Repository structure

- `providers/`
- `providers/<provider>/`
- `providers/<provider>/<skill>/`

Each managed skill directory contains:

- `SKILL.md`
- `agent-secrets.yaml` when the skill requires Agent Secrets
- `skill-router.json`

Each provider directory also contains:

- `manifest.json`

The repository root contains:

- `providers/index.json`

## Current providers

- `binance`
- `x`

## Current managed skills

- `providers/binance/square-post`
- `providers/x/post`
- `providers/x/like`
- `providers/x/retweet`
- `providers/x/timeline`
- `providers/x/user`
