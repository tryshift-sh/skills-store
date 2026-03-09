# Twitter User

Use this managed skill for retrieving the authenticated Twitter / X user profile through Shift.

## When to use
- The user wants to inspect the connected Twitter / X account
- The user asks which Twitter / X account is connected

## How to invoke
Send a `POST` request to `${SHIFT_LOCAL_GATEWAY}/skill-router/invoke` with:

```json
{
  "skillProvider": "twitter",
  "skill": "user",
  "action": "me",
  "input": {}
}
```

## Notes
- This skill requires Twitter / X to be connected in Shift.
- Do not ask the user to paste raw credentials into chat.
