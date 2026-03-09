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
- `twelve-data`
- `x`

## Current managed skills

- `providers/binance/square-post`
- `providers/twelve-data/time-series`
- `providers/x/post`
- `providers/x/like`
- `providers/x/retweet`
- `providers/x/timeline`
- `providers/x/user`
