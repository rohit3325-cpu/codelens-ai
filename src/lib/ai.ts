// import OpenAI from "openai";

// const client = new OpenAI({
//   apiKey: process.env.OPENROUTER_API_KEY,
//   baseURL: "https://openrouter.ai/api/v1",
// });

// export async function summarizeCode(code: string) {
//   const completion = await client.chat.completions.create({
//     model: "qwen/qwen3-32b:free",
//     messages: [
//       {
//         role: "system",
//         content:
//           "You are a senior software engineer. Explain code files in simple bullet points.",
//       },
//       {
//         role: "user",
//         content: `
// Explain this code file in 3-5 bullet points.

// ${code}
//         `,
//       },
//     ],
//   });

//   return completion.choices[0].message.content;
// }

import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: "https://openrouter.ai/api/v1",
});

export async function summarizeCode(code: string) {
  const trimmedCode = code.slice(0, 8000);

  const completion =
    await client.chat.completions.create({
      model: "openrouter/free",
      messages: [
        {
          role: "system",
          content: `
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
`,
        },
        {
          role: "user",
          content: `
Analyze this file:

${trimmedCode}
`,
        },
      ],
    });

  return (
    completion.choices[0].message.content ||
    ""
  );
}

export async function generateRepositoryOverview(
  context: string
) {
  const completion =
    await client.chat.completions.create({
      model: "openrouter/free",
      messages: [
        {
  role: "system",
  content: `
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
`
},
        {
          role: "user",
          content: context,
        },
      ],
    });
    

  return (
    completion.choices[0].message.content ||
    ""
  );
}

export async function generateOnboardingGuide(context: string) {
  const completion = await client.chat.completions.create({
    model: "openrouter/free",
    messages: [
      {
        role: "system",
        content: `
You are a senior engineer writing an onboarding guide for a developer who just joined this codebase.

Generate ONLY these sections:

## 🚀 Getting Started

Steps to set up and run the project locally. Maximum 6 steps.

## 🗺️ Codebase Map

Explain where to find key logic, organized by folder or file.

## 🔧 Common Tasks

Explain how to do 2-3 common tasks in this codebase (e.g. add an endpoint, add a component).

## ⚠️ Gotchas

Mention non-obvious pitfalls a new contributor should know about.

Rules:

- Keep it concise.
- Use markdown.
- Use bullet points.
- Do not invent setup steps that aren't supported by the provided context.
`,
      },
      {
        role: "user",
        content: `
Analyze this repository and generate an onboarding guide for a new contributor.

${context}
`,
      },
    ],
  });

  return completion.choices[0].message.content || "";
}

export async function chatWithRepository(
  context: string,
  question: string
) {
  const completion = await client.chat.completions.create({
    model: "openrouter/free",
    messages: [
      {
        role: "system",
        content:  `
You are a senior software engineer analyzing a GitHub repository.

Rules:
- Always answer in markdown.
- Use bullet points whenever possible.
- Never return large paragraphs.
- Keep answers concise and structured.
- Mention relevant files when possible.
- If information is unavailable, clearly state it.

Response Format:

## Answer

- Point 1
- Point 2
- Point 3

## Relevant Files

- file1.ts
- file2.ts
      `,
      },
      {
        role: "user",
        content: `
Repository Context:

${context}

Question:

${question}
`,
      },
    ],
  });

  return completion.choices[0].message.content || "";
}

export async function generateArchitectureDiagram(
  context: string
) {
  const trimmedContext = context.slice(0, 12000);

  const completion =
    await client.chat.completions.create({
      model: "openrouter/free",
      messages: [
        {
          role: "system",
          content: `
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
`,
        },
        {
          role: "user",
          content: `
Analyze this repository and generate a HIGH LEVEL architecture diagram.

${trimmedContext}
`,
        },
      ],
    });

  const response =
    completion.choices[0].message.content || "";

  console.log(
    "==== ARCHITECTURE RESPONSE ===="
  );
  console.log(response);
  console.log(
    "=============================="
  );

  // Some models (e.g. reasoning models routed through "openrouter/free")
  // leak their chain-of-thought into the content, which can mention
  // "graph TD" mid-ramble before the real diagram. Take the LAST match so
  // we land on the model's final, committed answer instead of its scratch
  // thinking.
  const graphTD =
    response.lastIndexOf("graph TD");

  const graphLR =
    response.lastIndexOf("graph LR");

  const indexes = [
    graphTD,
    graphLR,
  ].filter((i) => i >= 0);

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

  return `
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
}