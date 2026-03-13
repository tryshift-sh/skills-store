var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// src/index.ts
var import_promises = __toESM(require("node:fs/promises"), 1);
var import_node_os = __toESM(require("node:os"), 1);
var import_node_path = __toESM(require("node:path"), 1);
async function invokeUpload(input) {
  const gatewayBase = process.env.SHIFT_LOCAL_GATEWAY;
  if (!gatewayBase) {
    throw new Error("SHIFT_LOCAL_GATEWAY is required.");
  }
  const response = await fetch(`${gatewayBase}/skill-router/invoke`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      skillProvider: "google-drive",
      skill: "files",
      action: "upload",
      input: {
        filePath: input.filePath,
        name: input.name,
        mimeType: input.mimeType,
        targetMimeType: input.targetMimeType,
        parentIds: input.parentIds,
        description: input.description
      }
    })
  });
  const responseText = await response.text();
  const parsed = responseText ? JSON.parse(responseText) : null;
  if (!response.ok) {
    const errorMessage = parsed?.error ?? parsed?.message ?? `Skill Router returned ${response.status}.`;
    throw new Error(errorMessage);
  }
  if (!parsed?.ok) {
    throw new Error(parsed?.error ?? `Provider returned ${parsed?.status ?? "unknown status"}.`);
  }
  return parsed.data;
}
function resolveOperation(input) {
  if (input.operation) return input.operation;
  if (typeof input.content === "string") return "upload-content";
  if (typeof input.filePath === "string") return "upload-file";
  throw new Error("Set operation to upload-content or upload-file.");
}
function getFileName(input) {
  if (typeof input.name === "string" && input.name.trim()) {
    return input.name.trim();
  }
  if (typeof input.filePath === "string" && input.filePath.trim()) {
    return import_node_path.default.basename(input.filePath.trim());
  }
  return "upload.txt";
}
async function uploadContent(input) {
  if (typeof input.content !== "string") {
    throw new Error("upload-content requires a string content field.");
  }
  const fileName = getFileName(input);
  const tempDir = await import_promises.default.mkdtemp(import_node_path.default.join(import_node_os.default.tmpdir(), "shift-google-drive-upload-"));
  const tempPath = import_node_path.default.join(tempDir, fileName);
  await import_promises.default.writeFile(tempPath, input.content, "utf8");
  try {
    return await invokeUpload({
      filePath: tempPath,
      name: fileName,
      mimeType: input.mimeType ?? "text/plain",
      targetMimeType: input.targetMimeType,
      parentIds: input.parentIds,
      description: input.description
    });
  } finally {
    await import_promises.default.rm(tempDir, { recursive: true, force: true });
  }
}
async function uploadFile(input) {
  if (typeof input.filePath !== "string" || !input.filePath.trim()) {
    throw new Error("upload-file requires filePath.");
  }
  return invokeUpload({
    filePath: input.filePath.trim(),
    name: getFileName(input),
    mimeType: input.mimeType,
    targetMimeType: input.targetMimeType,
    parentIds: input.parentIds,
    description: input.description
  });
}
async function main() {
  const rawPayload = process.argv[2];
  if (!rawPayload) {
    throw new Error("Pass a single JSON payload string as the first argument.");
  }
  const input = JSON.parse(rawPayload);
  const operation = resolveOperation(input);
  const result = operation === "upload-content" ? await uploadContent(input) : await uploadFile(input);
  process.stdout.write(
    `${JSON.stringify(
      {
        operation,
        ...result
      },
      null,
      2
    )}
`
  );
}
main().catch((error) => {
  const message = error instanceof Error ? error.message : String(error);
  process.stderr.write(`${message}
`);
  process.exitCode = 1;
});
