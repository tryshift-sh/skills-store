# Twitter / X Post

Use this managed skill when the user wants to post to Twitter / X, reply to a tweet, quote a tweet, or delete a tweet.

This skill uses Shift's local Skill Router. Do not ask the user to paste credentials into chat.

## Invocation

Base URL:

`SHIFT_LOCAL_GATEWAY`

Endpoint:

`POST /skill-router/invoke`

Request body for a new tweet:

```json
{
  "skillProvider": "twitter",
  "skill": "post",
  "action": "create",
  "input": {
    "text": "Hello from Shift"
  }
}
```

Request body for a reply:

```json
{
  "skillProvider": "twitter",
  "skill": "post",
  "action": "reply",
  "input": {
    "text": "Reply text",
    "tweetId": "1234567890"
  }
}
```

Request body for a quote tweet:

```json
{
  "skillProvider": "twitter",
  "skill": "post",
  "action": "quote",
  "input": {
    "text": "Quoted text",
    "tweetId": "1234567890"
  }
}
```

Request body to delete a tweet:

```json
{
  "skillProvider": "twitter",
  "skill": "post",
  "action": "delete",
  "input": {
    "tweetId": "1234567890"
  }
}
```

If the connection is missing, tell the user to configure Twitter / X in Shift.
