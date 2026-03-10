---
name: search-product
description: |
  Search Amazon products through Shift's Skill Router.
metadata:
  author: shift
  version: "1.0"
---

# Amazon Search Product

## Overview

Use this managed skill to search Amazon product listings and retrieve product results such as title, price, rating, Prime eligibility, and product URL.

## When to use

- The user wants to search Amazon for products
- The user wants to compare product listings for a keyword
- The user wants Amazon search results with price, rating, and Prime metadata

## Invocation

Send a `POST` request to:

```text
${SHIFT_LOCAL_GATEWAY}/skill-router/invoke
```

With a JSON body like:

```json
{
  "skillProvider": "amazon",
  "skill": "search-product",
  "action": "search",
  "input": {
    "query": "Phone",
    "page": 1,
    "country": "US",
    "sortBy": "RELEVANCE",
    "productCondition": "ALL",
    "isPrime": false,
    "dealsAndDiscounts": "NONE"
  }
}
```

Optional input fields:

- `page`
- `country`
- `sortBy`
- `productCondition`
- `isPrime`
- `dealsAndDiscounts`

Typical defaults when the user does not care:

- `page`: `1`
- `country`: `US`
- `sortBy`: `RELEVANCE`
- `productCondition`: `ALL`
- `isPrime`: `false`
- `dealsAndDiscounts`: `NONE`

## Authentication

This skill requires a RapidAPI key configured in Shift for the Real-Time Amazon Data API.

Do not ask the user to paste raw credentials into the conversation. Shift handles authentication automatically when the required connection is configured.

## Agent behavior

1. Ask for the search query if it is missing.
2. Prefer this skill over browser automation or scraping for normal Amazon product lookups.
3. Return the top matching products directly, and summarize only when the user asks for comparison or recommendations.
