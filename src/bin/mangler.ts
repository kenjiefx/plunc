#!/usr/bin/env node
const fs = require("fs");
const path = require("path");

type VariableToken = string & { readonly brand: unique symbol };

const constantKeys = [
  "GLOBAL_DIRECTIVE_FOR_APP_NAME",
  "GLOBAL_DIRECTIVE_FOR_TEMPLATE_NAME",
  "GLOBAL_LOCK_ID_DIRECTIVE",
  "GLOBAL_LOCK_ID_DIRECTIVE_VALUE",
  "GLOBAL_EVENT_LOCK_DIRECTIVE",
  "COMPONENT_ELEMENT_DIRECTIVE",
  "COMPONENT_ID_DIRECTIVE",
  "REPEAT_ELEMENT_DIRECTIVE",
  "IF_ELEMENT_DIRECTIVE",
  "HIDE_ELEMENT_DIRECTIVE",
  "SHOW_ELEMENT_DIRECTIVE",
  "CHECK_ELEMENT_DIRECTIVE",
  "STYLE_ELEMENT_DIRECTIVE",
  "MODEL_ELEMENT_DIRECTIVE",
  "DISABLE_ELEMENT_DIRECTIVE",
  "CLICK_EVENT_DIRECTIVE",
  "CHANGE_EVENT_DIRECTIVE",
  "TOUCH_EVENT_DIRECTIVE",
  "BLOCK_ELEMENT_DIRECTIVE",
  "COMPONENT_REFERENCE_DIRECTIVE",
  "EVENT_ELEMENT_DIRECTIVE",
  "SCOPE_ARGUMENT_KEY",
  "BLOCK_ARGUMENT_KEY",
  "PARENT_ARGUMENT_KEY",
  "CHILDREN_ARGUMENT_KEY",
  "PATCH_ARGUMENT_KEY",
  "APP_ARGUMENT_KEY",
  "COMPONENT_ARGUMENT_KEY",
  "REPEAT_REFERENCE_TOKEN",
];

function createTokenBucket() {
  const tokens = new Map<VariableToken, string>();
  const charstr = "abcdefghijklmnopqrstuvwxyz";
  const chars = charstr.split("");
  let charPos = 0;
  let suffixNumIncrement = 0;
  let baseSuffixNum = 0;
  function createToken(): VariableToken {
    if (charPos >= chars.length) {
      charPos = 0;
      baseSuffixNum = baseSuffixNum + 10;
      suffixNumIncrement = baseSuffixNum;
    }
    const token = `${chars[charPos]}${suffixNumIncrement}`;
    if (suffixNumIncrement >= baseSuffixNum + 9) {
      charPos++;
      suffixNumIncrement = baseSuffixNum;
      return token as VariableToken;
    }
    suffixNumIncrement++;
    return token as VariableToken;
  }
  function tokenizeVar(varName: string) {
    for (const [token, name] of tokens.entries()) {
      if (name === varName) {
        return token;
      }
    }
    const newToken = createToken();
    console.log({ newToken, varName });
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

function replaceKeywordsWithUnderscores(
  fileContent: string,
  tokenBucket: ReturnType<typeof createTokenBucket>,
): string {
  return fileContent.replace(/__([a-zA-Z0-9_]+)/g, (match, varName) => {
    const token = tokenBucket.tokenizeVar(varName);
    return token;
  });
}

function collectMangableKeywordsWithUnderscores(
  fileContent: string,
): Set<string> {
  const varNames = new Set<string>();
  const varRegex = /__([a-zA-Z0-9_]+)/g;
  let match;
  while ((match = varRegex.exec(fileContent)) !== null) {
    varNames.add(match[1].trim());
  }
  return varNames;
}

function collectMangableTopLevelFunctionNames(
  fileContent: string,
): Set<string> {
  const functionNames = new Set<string>();
  const functionRegex = /function\s+([a-zA-Z0-9_]+)\s*\(/g;
  let match;
  while ((match = functionRegex.exec(fileContent)) !== null) {
    // Ignore short function names for now
    if (match[1].trim().length < 12) continue;
    functionNames.add(match[1].trim());
  }
  return functionNames;
}

function replaceTopLevelFunctionNames(
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

function sortMangableConstantKeys(): string[] {
  return constantKeys.sort((a, b) => b.length - a.length);
}

function replaceConstantKeys(
  fileContent: string,
  tokenBucket: ReturnType<typeof createTokenBucket>,
  sortedConstantKeys: string[],
): string {
  let mangledContent = fileContent;
  for (const constKey of sortedConstantKeys) {
    const token = tokenBucket.tokenizeVar(constKey);
    const keyRegex = new RegExp(`\\b${constKey}\\b`, "g");
    mangledContent = mangledContent.replace(keyRegex, token);
  }
  return mangledContent;
}

function run() {
  // Define paths
  const rootDir = process.cwd();
  const outDir = path.join(rootDir, "out");

  // Create token bucket and sets
  const tokenBucket = createTokenBucket();
  const topLevelFunctionNames = new Set<string>();
  const keywordsWithUnderscores = new Set<string>();

  // Create token mappings for constant keys
  const sortedConstantKeys = sortMangableConstantKeys();
  sortedConstantKeys.forEach((constKey) => {
    tokenBucket.tokenizeVar(constKey);
  });

  // Collect mangable functions and keywords that starts with underscores
  readFilesRecursively(outDir, (filePath) => {
    if (filePath.endsWith(".js")) {
      const fileContent = fs.readFileSync(filePath, "utf-8");
      const collectedKeywords =
        collectMangableKeywordsWithUnderscores(fileContent);
      for (const keyword of collectedKeywords) {
        keywordsWithUnderscores.add(keyword);
        tokenBucket.tokenizeVar(keyword);
      }
      const collectedNames = collectMangableTopLevelFunctionNames(fileContent);
      for (const name of collectedNames) {
        topLevelFunctionNames.add(name);
        tokenBucket.tokenizeVar(name);
      }
    }
  });
  // Sort function names by length descending
  const sortedFunctionNames = Array.from(topLevelFunctionNames).sort(
    (a, b) => b.length - a.length,
  );
  topLevelFunctionNames.clear();

  // Sort keywords with underscores by length descending
  const sortedKeywordsWithUnderscores = Array.from(
    keywordsWithUnderscores,
  ).sort((a, b) => b.length - a.length);
  keywordsWithUnderscores.clear();

  // Output mappings to JSON files for reference
  fs.writeFileSync(
    path.join(rootDir, "mangledFunctionNames.json"),
    JSON.stringify(sortedFunctionNames, null, 2),
    "utf-8",
  );

  // Mangle files
  readFilesRecursively(outDir, (filePath) => {
    if (filePath.endsWith(".js")) {
      const fileContent = fs.readFileSync(filePath, "utf-8");
      let mangledContent = replaceConstantKeys(
        fileContent,
        tokenBucket,
        sortedConstantKeys,
      );
      mangledContent = replaceKeywordsWithUnderscores(
        mangledContent,
        tokenBucket,
      );
      mangledContent = replaceTopLevelFunctionNames(
        mangledContent,
        new Set(sortedFunctionNames),
        tokenBucket,
      );
      fs.writeFileSync(filePath, mangledContent, "utf-8");
    }
  });
}
run();
