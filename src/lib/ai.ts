import {
  generateCompletion,
  PLATFORM_DEFAULT_CONFIG,
  type AIClientConfig,
} from "@/lib/aiProviders";

const SUMMARY_SYSTEM_PROMPT = `
You are a senior software engineer.

Analyze the code file and generate a concise developer-friendly summary.

Return ONLY markdown.

Use this format:

## 🎯 Purpose

- Explain what this file is responsible for.
- Maximum 2-3 bullet points.

## ⚙️ Main Logic

- Describe the key logic.
- Maximum 3-5 bullet points.

## 🔑 Important Functions

- List important functions/classes.
- Explain each in one line.

## 📦 Dependencies

- Mention important libraries used.
- Skip if none.

Rules:

- Keep it concise.
- Do not explain every line.
- Focus on developer understanding.
- Use bullet points.
- Use markdown headings.
`;

export async function summarizeCode(
  code: string,
  config: AIClientConfig = PLATFORM_DEFAULT_CONFIG
): Promise<string> {
  const trimmedCode = code.slice(0, 8000);

  return generateCompletion(
    config,
    SUMMARY_SYSTEM_PROMPT,
    `Analyze this file:\n\n${trimmedCode}`
  );
}

const OVERVIEW_SYSTEM_PROMPT = `
You are a senior software architect.

Analyze the repository and create a premium developer-friendly overview.

DO NOT generate:

- Folder structure dumps
- Long paragraphs
- Generic repository reports

Generate ONLY these sections:

# 📦 Project Type

Identify:
- Library
- SaaS
- CLI
- API
- Full Stack App
- Frontend App
- Backend Service

# 🎯 Purpose

Explain in 2-3 bullet points.

# ⚡ Tech Stack

List technologies used.

# 🏗 Core Workflow

Explain how the system works.

Use arrows:

User
↓
API
↓
Database

# ✨ Key Insights

Mention:
- Strong typing
- Test coverage
- Authentication
- CI/CD
- Performance
- Architecture patterns

# 🚀 Getting Started

Maximum 5 steps.

# 📊 Repository Health

Rate:

- Documentation
- Testing
- Maintainability
- Type Safety

Use:
Excellent
Good
Average
Poor

Keep the response concise.

Use markdown.
Use bullet points.
Use emojis.
`;

export async function generateRepositoryOverview(
  context: string,
  config: AIClientConfig = PLATFORM_DEFAULT_CONFIG
): Promise<string> {
  return generateCompletion(config, OVERVIEW_SYSTEM_PROMPT, context);
}

const ONBOARDING_SYSTEM_PROMPT = `
You are a senior engineer writing an onboarding guide for a developer who just joined this codebase.

Generate ONLY these sections:

# Project Overview

# Tech Stack

# Folder Structure

# Key Components

# Data Flow

# How To Run Locally

# Development Workflow

# Recommended Reading Order

# Important Files

# First Contribution Tasks

# Developer Tips

Rules:

- Keep it concise.
- Use markdown.
- Use bullet points.
- Do not invent setup steps that aren't supported by the provided context.
`;

export async function generateOnboardingGuide(
  context: string,
  config: AIClientConfig = PLATFORM_DEFAULT_CONFIG
): Promise<string> {
  return generateCompletion(
    config,
    ONBOARDING_SYSTEM_PROMPT,
    `Analyze this repository and generate an onboarding guide for a new contributor.\n\n${context}`
  );
}

const CHAT_SYSTEM_PROMPT = `
You are an expert software engineer.

Answer questions using only the repository context provided.
If the answer is not found, say:
"I could not find that information in the repository."
`;

export async function chatWithRepository(
  context: string,
  question: string,
  config: AIClientConfig = PLATFORM_DEFAULT_CONFIG
): Promise<string> {
  return generateCompletion(
    config,
    CHAT_SYSTEM_PROMPT,
    `Repository Context:\n\n${context}\n\nQuestion:\n\n${question}`
  );
}

const ARCHITECTURE_SYSTEM_PROMPT = `
You are a senior software architect.

Generate ONLY valid Mermaid flowchart syntax.

STRICT RULES:

- Start with: graph TD
- Return ONLY Mermaid code
- No explanations
- No markdown
- No code fences
- No comments
- No quotes
- No apostrophes
- No parentheses
- No asterisks
- No backticks
- No slashes
- Maximum 8 nodes
- Use node IDs

VALID FORMAT:

graph TD

A[Repository]
B[Core Logic]
C[Parser]
D[Formatter]
E[Tests]

A --> B
B --> C
B --> D
B --> E

NEVER DO THIS:

Repository --> Parser
Parser --> Formatter

ALWAYS USE NODE IDS:

A --> B
B --> C
`;

const FALLBACK_DIAGRAM = `
graph TD

A[Repository]
B[Repository Scanner]
C[Repository Context]
D[AI Analysis]
E[Output]

A --> B
B --> C
C --> D
D --> E
`;

export async function generateArchitectureDiagram(
  context: string,
  config: AIClientConfig = PLATFORM_DEFAULT_CONFIG
): Promise<string> {
  const trimmedContext = context.slice(0, 12000);

  const response = await generateCompletion(
    config,
    ARCHITECTURE_SYSTEM_PROMPT,
    `Analyze this repository and generate a HIGH LEVEL architecture diagram.\n\n${trimmedContext}`
  );

  // Some models (e.g. reasoning models routed through "openrouter/free")
  // leak their chain-of-thought into the content, which can mention
  // "graph TD" mid-ramble before the real diagram. Take the LAST match so
  // we land on the model's final, committed answer instead of its scratch
  // thinking.
  const graphTD = response.lastIndexOf("graph TD");
  const graphLR = response.lastIndexOf("graph LR");

  const indexes = [graphTD, graphLR].filter((i) => i >= 0);

  if (indexes.length > 0) {
    const start = Math.max(...indexes);

    return response
      .slice(start)
      // The model sometimes glues the graph-type declaration directly onto
      // the first node (e.g. "graph TDA[Storage]") with no separator, which
      // Mermaid can't parse. Force a newline after the declaration.
      .replace(/^(graph (?:TD|LR))(?!\n)/, "$1\n")
      .trim();
  }

  return FALLBACK_DIAGRAM;
}
