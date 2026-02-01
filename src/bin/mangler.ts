#!/usr/bin/env node
const fs = require("fs");
const path = require("path");

type VariableToken = string & { readonly brand: unique symbol };

function createTokenBucket() {
  const tokens = new Map<VariableToken, string>();
  function createToken() {
    const chars = ["a", "b", "c", "d", "e", "f", "g"];
    let exists = false;
    let token = [
      `${chars[Math.floor(Math.random() * chars.length)]}`,
      `${chars[Math.floor(Math.random() * chars.length)]}`,
    ].join("") as VariableToken;
    let differentiator = 0;
    while (!exists) {
      const temp = token;
      token = `${token}${differentiator}` as VariableToken;
      if (!tokens.has(token)) {
        exists = true;
        // Short-circuiting return
        return token;
      }
      token = temp;
      differentiator++;
    }
    return token;
  }
  function tokenizeVar(varName: string) {
    for (const [token, name] of tokens) {
      if (name === varName) {
        return token;
      }
    }
    const newToken = createToken();
    tokens.set(newToken, varName);
    return newToken;
  }
  return { tokenizeVar };
}

function readFilesRecursively(
  dir: string,
  callback: (filePath: string) => void,
): void {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath: string = path.join(dir, entry.name);
    // if path contains '/bin', skip it
    if (fullPath.includes(`${path.sep}bin${path.sep}`)) {
      continue;
    }
    if (fullPath.endsWith(`domReady.js`)) {
      continue;
    }
    if (entry.isDirectory()) {
      readFilesRecursively(fullPath, callback);
    } else if (entry.isFile()) {
      callback(fullPath);
    }
  }
}

function mangleVarsWithUnderscores(
  fileContent: string,
  tokenBucket: ReturnType<typeof createTokenBucket>,
): string {
  return fileContent.replace(/__([a-zA-Z0-9_]+)/g, (match, varName) => {
    const token = tokenBucket.tokenizeVar(varName);
    return token;
  });
}

function collectMangableTopLevelFunctionsNames(
  fileContent: string,
  tokenBucket: ReturnType<typeof createTokenBucket>,
): Set<string> {
  const functionNames = new Set<string>();
  const functionRegex = /function\s+([a-zA-Z0-9_]+)\s*\(/g;
  let match;
  while ((match = functionRegex.exec(fileContent)) !== null) {
    if (match[1].trim() === "if") continue;
    if (match[1].trim().length < 12) continue;
    functionNames.add(match[1].trim());
    tokenBucket.tokenizeVar(match[1].trim());
  }
  return functionNames;
}

// function collectMangableTopLevelFunctionsNames(
//   fileContent: string,
//   tokenBucket: ReturnType<typeof createTokenBucket>,
// ): Set<string> {
//   const functionNames = new Set<string>();

//   // function must start the line (optionally after whitespace)
//   const functionRegex =
//     /^(?:\s*)(?:async\s+)?function\s*\*?\s+([a-zA-Z_$][\w$]*)\s*\(/gm;

//   let braceDepth = 0;
//   let match: RegExpExecArray | null;
//   let lastIndex = 0;

//   while ((match = functionRegex.exec(fileContent)) !== null) {
//     // update brace depth from last scan point to this match
//     for (let i = lastIndex; i < match.index; i++) {
//       const ch = fileContent[i];
//       if (ch === "{") braceDepth++;
//       else if (ch === "}") braceDepth--;
//     }

//     lastIndex = functionRegex.lastIndex;

//     // only collect true top-level functions
//     if (braceDepth === 0) {
//       const name = match[1];
//       functionNames.add(name);
//       tokenBucket.tokenizeVar(name);
//     }
//   }

//   return functionNames;
// }

function mangleFunctionNames(
  fileContent: string,
  functionNames: Set<string>,
  tokenBucket: ReturnType<typeof createTokenBucket>,
) {
  let mangledContent = fileContent;
  for (const name of functionNames) {
    const token = tokenBucket.tokenizeVar(name);
    const nameRegex = new RegExp(`\\b${name}\\b`, "g");
    mangledContent = mangledContent.replace(nameRegex, token);
  }
  return mangledContent;
}

function sortMangableFunctionNames(functionNames: Set<string>): string[] {
  return Array.from(functionNames).sort((a, b) => b.length - a.length);
}

function run() {
  const rootDir = process.cwd();
  const outDir = path.join(rootDir, "out");
  const tokenBucket = createTokenBucket();
  const topLevelFunctionNames = new Set<string>();
  // First pass: collect top-level function names
  readFilesRecursively(outDir, (filePath) => {
    if (filePath.endsWith(".js")) {
      const fileContent = fs.readFileSync(filePath, "utf-8");
      const mangledContent = mangleVarsWithUnderscores(
        fileContent,
        tokenBucket,
      );
      const collectedNames = collectMangableTopLevelFunctionsNames(
        mangledContent,
        tokenBucket,
      );
      for (const name of collectedNames) {
        topLevelFunctionNames.add(name);
      }
      fs.writeFileSync(filePath, mangledContent, "utf-8");
    }
  });
  // Sort function names by length descending
  const sortedFunctionNames = sortMangableFunctionNames(topLevelFunctionNames);
  topLevelFunctionNames.clear();
  fs.writeFileSync(
    path.join(rootDir, "mangledFunctionNames.json"),
    JSON.stringify(sortedFunctionNames, null, 2),
    "utf-8",
  );
  // Second pass: mangle top-level functions
  readFilesRecursively(outDir, (filePath) => {
    if (filePath.endsWith(".js")) {
      const fileContent = fs.readFileSync(filePath, "utf-8");
      const mangledContent = mangleFunctionNames(
        fileContent,
        new Set(sortedFunctionNames),
        tokenBucket,
      );
      fs.writeFileSync(filePath, mangledContent, "utf-8");
    }
  });
}
run();
