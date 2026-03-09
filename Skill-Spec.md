# Skill Spec

This document defines the contract for adding a new managed skill to `skills-store`.

The goal is simple:

- add or update files in this repo
- do not add skill-specific code in `shift`
- after merge, `shift` should be able to discover, install, configure, and invoke the skill dynamically

## Scope

This spec applies to managed skills consumed by Shift.

It covers:

- provider registration
- install metadata
- `SKILL.md` requirements
- `agent-secrets.yaml` requirements
- `skill-router.json` execution manifest requirements
- validation and acceptance checks

It does not cover:

- custom logic in `shift`
- provider-specific backend adapters
- legacy `twitter` or `binance-skills-hub` compatibility

## Core Rules

1. `skills-store` is the source of truth for managed skills.
2. A managed skill must be addable without changing `shift` code.
3. Use `-`, never `_`, for provider ids, skill ids, slot names, and action names.
4. Each managed skill is `1:1` with one install id:
   `tryshift-sh/skills-store/<provider>/<installSkillName>`
5. `SKILL.md` is user-facing / agent-facing documentation only.
   Internal execution metadata must live in JSON/YAML manifests, not in prose.
6. If a skill cannot be expressed with the current declarative `skill-router.json` schema, do not add a one-off hack to `shift`.
   Extend the generic runtime first, or keep the skill out of the managed path.

## Repository Layout

The repository structure is:

```text
providers/
  index.json
  <provider>/
    manifest.json
    <skill>/
      SKILL.md
      agent-secrets.yaml
      skill-router.json
```

Notes:

- `providers/index.json` registers providers.
- `providers/<provider>/manifest.json` provides store and install metadata.
- `providers/<provider>/<skill>/SKILL.md` is what the `skills` CLI and the agent read.
- `providers/<provider>/<skill>/agent-secrets.yaml` defines slot metadata for the Shift dashboard.
- `providers/<provider>/<skill>/skill-router.json` defines runtime execution.

## Naming

### Provider

- lowercase
- use `-` only
- examples: `binance`, `x`

### Skill

- lowercase
- use `-` only
- examples: `square-post`, `post`, `timeline`

### Slot

- lowercase
- use `-` only
- examples: `square-open-api`, `x-oauth`

### Action

- lowercase
- use `-` only
- examples: `create`, `delete`, `user-tweets`

## Adding a New Provider

If the provider does not exist yet, add all of the following:

1. Add a provider entry to `providers/index.json`.
2. Create `providers/<provider>/manifest.json`.
3. Create one or more `providers/<provider>/<skill>/...` folders.

Example `providers/index.json` entry:

```json
{
  "id": "x",
  "name": "X",
  "description": "Managed X skills with built-in Agent Secrets support.",
  "manifestPath": "providers/x/manifest.json"
}
```

## Adding a New Skill Under an Existing Provider

If the provider already exists, you must add:

1. a new skill folder under `providers/<provider>/`
2. a skill entry inside `providers/<provider>/manifest.json`
3. `SKILL.md`
4. `agent-secrets.yaml`
5. `skill-router.json`

## Provider Manifest Contract

Path:

```text
providers/<provider>/manifest.json
```

Shape:

```json
{
  "provider": {
    "id": "x",
    "name": "X",
    "description": "Managed X skills with built-in Agent Secrets support."
  },
  "skills": [
    {
      "id": "post",
      "skill": "post",
      "installSkillName": "post",
      "name": "post",
      "description": "Post, reply, quote, and delete posts on X.",
      "agentSecretsSupported": true,
      "listedInStore": true,
      "skillRouterManifestPath": "providers/x/post/skill-router.json"
    }
  ]
}
```

Rules:

- `provider.id` must match the folder name.
- `skills[].skill` must match the skill folder name.
- `skills[].installSkillName` is the `skills add --skill ...` install name.
- `skills[].installSkillName` must also match the `name:` field in `SKILL.md` frontmatter.
- `skills[].skillRouterManifestPath` must point to the matching `skill-router.json`.
- `listedInStore: false` means the skill stays installable/invokable but hidden from the dashboard store list.
- `agentSecretsSupported` should be `true` for normal managed skills.

## `SKILL.md` Contract

Path:

```text
providers/<provider>/<skill>/SKILL.md
```

`SKILL.md` must begin with YAML frontmatter.
This is required because the `skills` CLI discovers installable skills from it.

Minimum required shape:

```md
---
name: post
description: |
  Post, reply, quote, and delete posts on X through Shift's Skill Router.
metadata:
  author: shift
  version: "1.0"
---
```

Rules:

- `name` must equal `installSkillName` from the provider manifest.
- `description` should be concise and installation-friendly.
- Keep the rest of the file agent-facing.
- Describe when to use the skill and how to invoke it via `POST ${SHIFT_LOCAL_GATEWAY}/skill-router/invoke`.
- Do not put internal provider paths, secret file paths, or backend implementation notes in the prose.

Recommended body sections:

- title
- overview
- when to use
- invocation examples
- authentication expectations
- agent behavior notes

## `agent-secrets.yaml` Contract

Path:

```text
providers/<provider>/<skill>/agent-secrets.yaml
```

Example:

```yaml
slots:
  - name: x-oauth
    providerHint: X account
    description: Used for authenticated X API requests handled by Shift.
```

Rules:

- `slots` must be an array.
- each slot must have a `name`
- slot names must match the `slotName` values used in `skill-router.json`
- `providerHint` is shown in the Shift UI
- `description` should explain what the credential is used for

Current expectation:

- managed skills in the mainline path should expose Shift-managed auth through declared slots
- if a skill cannot use Agent Secrets or needs unsupported signing/auth behavior, do not add it as a normal managed skill until the runtime supports it

## `skill-router.json` Contract

Path:

```text
providers/<provider>/<skill>/skill-router.json
```

This file defines runtime execution.

Example:

```json
{
  "provider": "binance",
  "skill": "square-post",
  "name": "square-post",
  "description": "Post content to Binance Square with Shift-managed authentication.",
  "installSkillId": "tryshift-sh/skills-store/binance/square-post",
  "actions": {
    "create": {
      "slotName": "square-open-api",
      "upstream": {
        "method": "POST",
        "baseUrl": "https://www.binance.com",
        "path": "/bapi/composite/v1/public/pgc/openApi/content/add",
        "headers": {
          "clienttype": "binanceSkill"
        },
        "auth": {
          "mode": "header",
          "headerName": "X-Square-OpenAPI-Key"
        }
      },
      "input": {
        "bodyTemplate": {
          "bodyTextOnly": "$input.text"
        }
      },
      "output": {
        "responseSelect": "data",
        "responseMap": {
          "id": "$data.contentId",
          "text": "$data.bodyTextOnly"
        }
      }
    }
  }
}
```

Rules:

- `provider` must match the provider id
- `skill` must match the skill folder name
- `installSkillId` must be exactly:
  `tryshift-sh/skills-store/<provider>/<installSkillName>`
- every action must be declarative
- do not use transform keys such as `twitter-post-create`

### Action Shape

Each action supports:

```json
{
  "slotName": "x-oauth",
  "upstream": {
    "method": "POST",
    "baseUrl": "https://api.x.com",
    "path": "/2/tweets",
    "headers": {
      "x-foo": "bar"
    },
    "auth": {
      "mode": "bearer"
    }
  },
  "input": {
    "pathParams": {
      "tweetId": "$input.tweetId"
    },
    "queryTemplate": {
      "max_results": "$input.limit"
    },
    "headerTemplate": {
      "x-trace-id": "$runtime.agentId"
    },
    "bodyTemplate": {
      "text": "$input.text"
    }
  },
  "output": {
    "responseSelect": "data",
    "responseMap": {
      "id": "$data.id"
    }
  }
}
```

### Auth Modes

Supported auth modes today:

- `bearer`
- `header`
- `query`

Auth is injected by Shift from the selected secret.

Do not put secret values into `bodyTemplate`, `queryTemplate`, or `headerTemplate`.

## Declarative Template Rules

The current renderer supports these sources:

- `$input.*`
- `$runtime.*`
- `$response.*`
- `$data.*`
- `$item.*`

The current renderer supports these patterns:

- direct value: `"$input.text"`
- string interpolation: `"https://x.com/i/status/${data.id}"`
- per-item mapping:

```json
{
  "$each": "$data",
  "map": {
    "id": "$item.id",
    "text": "$item.text"
  }
}
```

- fallback value:

```json
{
  "$value": "$response.meta.next_token",
  "$default": null
}
```

- length:

```json
{
  "$length": "$data"
}
```

- boolean inversion:

```json
{
  "$not": "$data.liked",
  "$default": true
}
```

If the skill needs logic outside these generic capabilities, stop and decide one of:

1. extend the generic renderer
2. simplify the skill contract
3. do not add the skill yet

Do not add provider-specific logic to `shift`.

## Store Visibility

If the skill should appear in the dashboard store, either omit `listedInStore` or set:

```json
"listedInStore": true
```

If the skill is internal-only or should stay hidden for now:

```json
"listedInStore": false
```

Hidden skills must still have valid manifests if they are intended to be installable or invokable.

## Install Semantics

There are three related ids. Keep them straight:

### Store install id

Used by Shift internally:

```text
tryshift-sh/skills-store/<provider>/<installSkillName>
```

### CLI install name

Used by `skills add --skill ...`:

```text
<installSkillName>
```

### Runtime invocation tuple

Used by the agent when invoking the router:

```json
{
  "skillProvider": "<provider>",
  "skill": "<skill>",
  "action": "<action>"
}
```

Example:

- install id: `tryshift-sh/skills-store/x/post`
- CLI skill name: `post`
- runtime invoke:

```json
{
  "skillProvider": "x",
  "skill": "post",
  "action": "create"
}
```

## Validation Checklist

Before opening a PR, validate all of the following.

### File-level checks

- `providers/index.json` points to the right provider manifest
- `providers/<provider>/manifest.json` includes the new skill entry
- `SKILL.md` has valid frontmatter
- `agent-secrets.yaml` slot names match `skill-router.json`
- `skill-router.json` is valid JSON
- `installSkillId` is correct

### Discovery checks

From a local checkout of this repo:

```bash
npx skills add /path/to/skills-store --list
```

The new skill must appear in the list.

Then:

```bash
npx skills add /path/to/skills-store --skill <installSkillName> --yes
```

The install must succeed.

### Shift integration checks

After `skills-store` is updated, `shift` should work without code changes:

- dashboard can discover the skill from manifests
- install uses the skill's declared install name
- agent detail can load `agent-secrets.yaml`
- skill router can resolve `provider + skill + action`
- invocation succeeds through the declarative manifest

## Common Mistakes

### Missing `SKILL.md` frontmatter

If frontmatter is missing, the `skills` CLI may not discover the skill at all.

### `installSkillName` and `SKILL.md name` mismatch

If these diverge, store metadata and CLI install behavior drift apart.

### Wrong `installSkillId`

It must always be:

```text
tryshift-sh/skills-store/<provider>/<installSkillName>
```

### Slot name mismatch

If `agent-secrets.yaml` says `x-oauth` but `skill-router.json` uses another slot name, the dashboard and runtime will not bind correctly.

### Skill-specific execution hacks

Do not introduce action-specific transform names or provider-specific fallback behavior in `shift`.

### Using `_` in ids

Do not add new ids like `square_open_api` or `user_tweets`.
Use `square-open-api` and `user-tweets`.

## Acceptance Standard

A skill addition is complete only if all of the following are true:

1. the skill exists entirely inside `skills-store`
2. `shift` does not need a code change to recognize it
3. the skill shows up correctly in the dashboard when `listedInStore` is enabled
4. the skill installs using its own `installSkillName`
5. the dashboard reads its `agent-secrets.yaml`
6. the runtime executes it via `skill-router.json`
7. there is no provider-specific or skill-specific special case added to `shift`
