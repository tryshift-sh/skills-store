---
name: square-post
description: |
  Post content to Binance Square through Shift's Skill Router.
  Auto-run on messages like "post to square", "send this to Binance Square", or "发到币安广场".
metadata:
  author: shift
  version: "1.0"
---

# Square Post

## Overview

Use this managed skill to publish a text post to Binance Square.

## Invocation

Send a `POST` request to:

```
${SHIFT_LOCAL_GATEWAY}/skill-router/invoke
```

With a JSON body:

```json
{
  "skillProvider": "binance",
  "skill": "square-post",
  "action": "create",
  "input": {
    "text": "GN"
  }
}
```

### Required fields

| Field | Type | Description |
| --- | --- | --- |
| `skillProvider` | string | Always `"binance"` |
| `skill` | string | Always `"square-post"` |
| `action` | string | Always `"create"` |
| `input.text` | string | Text content to publish |

## Authentication

This skill requires Binance Square to be connected in Shift.

Do not ask the user to paste raw credentials into the conversation. Shift handles authentication automatically when the required connection is configured.

## Agent behavior

1. If the user does not provide post content, ask what they want to publish.
2. Prefer direct publication through the Skill Router. Do not fall back to browser automation for normal posting.
3. After a successful post, return the Binance Square post URL when an ID is available.
