---
name: time-series
description: |
  Fetch intraday and historical time series data from Twelve Data through Shift's Skill Router.
metadata:
  author: shift
  version: "1.0"
---

# Twelve Data Time Series

## Overview

Use this managed skill to fetch time series market data from Twelve Data.

## When to use

- The user wants recent price candles for a symbol
- The user wants intraday or historical bars
- The user wants data like `AAPL 1min`, `BTC/USD 1h`, or `TSLA daily`

## Invocation

Send a `POST` request to:

```text
${SHIFT_LOCAL_GATEWAY}/skill-router/invoke
```

With a JSON body like:

```json
{
  "skillProvider": "twelve-data",
  "skill": "time-series",
  "action": "get",
  "input": {
    "symbol": "AAPL",
    "interval": "1min",
    "outputsize": "30"
  }
}
```

Optional input fields:

- `symbol`
- `interval`
- `outputsize`
- `timezone`
- `startDate`
- `endDate`
- `exchange`
- `country`
- `type`
- `dp`
- `order`

## Authentication

This skill requires a Twelve Data API key configured in Shift.

Do not ask the user to paste raw credentials into the conversation. Shift handles authentication automatically when the required connection is configured.

## Agent behavior

1. Ask for missing required inputs such as `symbol` or `interval`.
2. Prefer this skill over browser automation or scraping for normal market data lookups.
3. Return the upstream JSON response directly unless the user asks for a transformed summary.
