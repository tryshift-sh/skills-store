# Twitter Like

Use this managed skill for liking and unliking tweets on Twitter / X through Shift.

## When to use
- The user wants to like a tweet
- The user wants to unlike a tweet they previously liked

## How to invoke
Send a `POST` request to `${SHIFT_LOCAL_GATEWAY}/skill-router/invoke` with:

```json
{
  "skillProvider": "twitter",
  "skill": "like",
  "action": "create",
  "input": {
    "userId": "123",
    "tweetId": "456"
  }
}
```

For removing a like, use:

```json
{
  "skillProvider": "twitter",
  "skill": "like",
  "action": "delete",
  "input": {
    "userId": "123",
    "tweetId": "456"
  }
}
```

## Notes
- This skill requires Twitter / X to be connected in Shift.
- Do not ask the user to paste raw credentials into chat.
