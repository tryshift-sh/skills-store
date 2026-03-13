---
name: files
description: |
  Browse files, inspect metadata, create folders, and manage sharing in Google Drive through Shift's Skill Router.
metadata:
  author: shift
  version: "1.0"
---

# Google Drive Files

Use this managed skill when the user wants to browse Google Drive files, inspect file metadata, create folders, share a file, or upload file/content into Drive.

This skill uses Shift's local Skill Router. Do not ask the user to paste Google credentials into chat.

## Invocation

Base URL:

`SHIFT_LOCAL_GATEWAY`

Endpoint:

`POST /skill-router/invoke`

Request body to list files:

```json
{
  "skillProvider": "google-drive",
  "skill": "files",
  "action": "list",
  "input": {
    "query": "mimeType = 'application/vnd.google-apps.folder'",
    "pageSize": 10,
    "orderBy": "modifiedTime desc"
  }
}
```

Request body to get file details:

```json
{
  "skillProvider": "google-drive",
  "skill": "files",
  "action": "get",
  "input": {
    "fileId": "1AbCdEfGhIjKlMnOp"
  }
}
```

Request body to create a folder:

```json
{
  "skillProvider": "google-drive",
  "skill": "files",
  "action": "create-folder",
  "input": {
    "name": "Launch assets",
    "parentIds": ["1AbCdEfGhIjKlMnOp"]
  }
}
```

Request body to upload a local file:

```json
{
  "skillProvider": "google-drive",
  "skill": "files",
  "action": "upload",
  "input": {
    "filePath": "/tmp/launch.html",
    "name": "launch.html",
    "mimeType": "text/html",
    "parentIds": ["1AbCdEfGhIjKlMnOp"],
    "description": "Launch page draft"
  }
}
```

Precompiled code-skill helper for uploading raw content:

```bash
node dist/index.js '{
  "operation": "upload-content",
  "name": "launch.html",
  "mimeType": "text/html",
  "content": "<html><body><h1>Launch</h1></body></html>",
  "parentIds": ["1AbCdEfGhIjKlMnOp"]
}'
```

Precompiled code-skill helper for converting uploaded content into a Google Doc:

```bash
node dist/index.js '{
  "operation": "upload-content",
  "name": "launch.html",
  "mimeType": "text/html",
  "targetMimeType": "application/vnd.google-apps.document",
  "content": "<html><body><h1>Launch</h1></body></html>",
  "parentIds": ["1AbCdEfGhIjKlMnOp"]
}'
```

Request body to share a file:

```json
{
  "skillProvider": "google-drive",
  "skill": "files",
  "action": "share",
  "input": {
    "fileId": "1AbCdEfGhIjKlMnOp",
    "type": "user",
    "role": "writer",
    "emailAddress": "teammate@example.com"
  }
}
```

## Authentication

This skill requires a Google Drive connection configured in Shift.

## Agent behavior

1. Use `list` before `get` when the user has not provided a file id.
2. Use `upload` when the user already has a local file path available on the runtime machine.
3. Use `node dist/index.js '<json payload>'` for direct content uploads or Google Doc conversion.
4. Prefer folders and metadata operations before attempting more complex file editing flows.
5. Use `share` only when the user clearly names the recipient and required role.
