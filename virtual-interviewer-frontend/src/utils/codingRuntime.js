export function normalizeOutput(value) {
  if (value == null) return "";
  return String(value).replace(/\r\n/g, "\n").trim();
}

function normalizeRelaxed(value) {
  return normalizeOutput(value)
    .split("\n")
    .map((line) => line.trim().replace(/[ \t]+/g, " "))
    .join("\n");
}

function normalizeTokenized(value) {
  return normalizeOutput(value).split(/\s+/).filter(Boolean).join(" ");
}

export function isOutputMatch(expected, actual, mode = "relaxed") {
  const strictExpected = normalizeOutput(expected);
  const strictActual = normalizeOutput(actual);
  if (strictExpected === strictActual) return true;

  if (mode === "strict") return false;

  if (mode === "token") {
    return normalizeTokenized(expected) === normalizeTokenized(actual);
  }

  if (mode === "float") {
    const e = Number(strictExpected);
    const a = Number(strictActual);
    if (!Number.isNaN(e) && !Number.isNaN(a)) {
      return Math.abs(e - a) <= 1e-6;
    }
  }

  const relaxedExpected = normalizeRelaxed(expected);
  const relaxedActual = normalizeRelaxed(actual);
  if (relaxedExpected === relaxedActual) return true;

  return normalizeTokenized(expected) === normalizeTokenized(actual);
}

export function buildOutputText(result, language = "python") {
  const parts = [
    result.stdout ? `Output:\n${result.stdout}` : "",
    result.stderr ? `Error:\n${result.stderr}` : "",
    result.compile_output ? `Compile:\n${result.compile_output}` : "",
    result.message ? `Message:\n${result.message}` : "",
    result.status?.description ? `Status: ${result.status.description}` : "",
  ].filter(Boolean);

  const hint = getRuntimeHint(result, language);
  if (hint) {
    parts.push(`Hint:\n${hint}`);
  }

  return parts.join("\n\n");
}

export function getStarterCode(language = "python") {
  if (language === "c") {
    return [
      "#include <stdio.h>",
      "",
      "int main() {",
      "  // Write your solution here",
      "  return 0;",
      "}",
    ].join("\n");
  }

  if (language === "java") {
    return [
      "import java.util.*;",
      "",
      "public class Main {",
      "  public static void main(String[] args) {",
      "    // Write your solution here",
      "  }",
      "}",
    ].join("\n");
  }

  return [
    "import sys",
    "",
    "def solve():",
    "    data = sys.stdin.read().strip().split()",
    "    # Write your solution here",
    "    pass",
    "",
    "if __name__ == \"__main__\":",
    "    solve()",
  ].join("\n");
}

export function handleTabIndent(event) {
  if (event.key !== "Tab") return;
  event.preventDefault();
  const target = event.target;
  const start = target.selectionStart;
  const end = target.selectionEnd;
  const value = target.value;
  const nextValue = `${value.slice(0, start)}  ${value.slice(end)}`;
  target.value = nextValue;
  target.selectionStart = target.selectionEnd = start + 2;
  target.dispatchEvent(new Event("input", { bubbles: true }));
}

export function validateBeforeRun({ language, code }) {
  if (!code.trim()) return "Please enter code before running.";

  if (language === "java") {
    const hasMain = /public\s+static\s+void\s+main\s*\(/.test(code);
    if (!hasMain) return "Java code should contain `public static void main(String[] args)`.";
  }

  if (language === "c") {
    const hasMain = /\bint\s+main\s*\(/.test(code);
    if (!hasMain) return "C code should contain `int main()`.";
  }

  if (language === "python") {
    const lines = code.split("\n");
    const hasTabs = lines.some((line) => /\t/.test(line));
    const has4Spaces = lines.some((line) => /^ {4,}\S/.test(line));
    if (hasTabs && has4Spaces) {
      return "Python indentation warning: avoid mixing tabs and spaces.";
    }
  }

  return "";
}

export function hasExecutionError(result) {
  const status = (result?.status?.description || "").toLowerCase();
  const hasStderr = Boolean((result?.stderr || "").trim());
  const compileOutput = (result?.compile_output || "").trim();

  if (hasStderr) return true;
  if (status.includes("compilation error")) return true;
  if (status.includes("runtime error")) return true;
  if (status.includes("time limit exceeded")) return true;
  if (status.includes("memory limit exceeded")) return true;
  if (status.includes("internal error")) return true;
  if (status.includes("exec format error")) return true;

  // Compilation output can include warnings; only treat as failure when status indicates compile failure.
  if (compileOutput && status.includes("compile")) return true;

  return false;
}

function getRuntimeHint(result, language) {
  const combined = [
    result.stderr || "",
    result.compile_output || "",
    result.message || "",
    result.status?.description || "",
  ]
    .join("\n")
    .toLowerCase();

  if (!combined) return "";

  if (language === "python" && combined.includes("indentationerror")) {
    return "Fix Python indentation. Use consistent spaces (prefer 4 spaces) and avoid mixing tabs and spaces.";
  }

  if (language === "python" && combined.includes("syntaxerror")) {
    return "Check missing ':' or unmatched brackets/quotes in Python.";
  }

  if (language === "python" && combined.includes("eoferror")) {
    return "stdin ended before your code finished reading input. Check how many input() calls your code makes and match that with the expected input format.";
  }

  if (combined.includes("time limit exceeded")) {
    return "Your code is too slow for this input. Optimize time complexity.";
  }

  if (combined.includes("memory limit exceeded")) {
    return "Your code uses too much memory. Avoid storing unnecessary large structures.";
  }

  if (combined.includes("runtime error")) {
    return "Handle edge cases like empty input, invalid indexing, and division by zero.";
  }

  return "";
}
