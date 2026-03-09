# Twitter Retweet

Use this managed skill for retweeting and undoing retweets on Twitter / X through Shift.

## When to use
- The user wants to retweet a tweet
- The user wants to undo a retweet

## How to invoke
Send a `POST` request to `${SHIFT_LOCAL_GATEWAY}/skill-router/invoke` with:

```json
{
  "skillProvider": "twitter",
  "skill": "retweet",
  "action": "create",
  "input": {
    "userId": "123",
    "tweetId": "456"
  }
}
```

To undo a retweet, use:

```json
{
  "skillProvider": "twitter",
  "skill": "retweet",
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
