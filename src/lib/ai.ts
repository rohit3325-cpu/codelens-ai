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

export async function chatWithRepository(
  context: string,
  question: string
) {
  const completion = await client.chat.completions.create({
    model: "openrouter/free",
    messages: [
      {
        role: "system",
        content: `
You are an expert software engineer.

Answer questions using only the repository context provided.
If the answer is not found, say:
"I could not find that information in the repository."
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

  const graphTD =
    response.indexOf("graph TD");

  const graphLR =
    response.indexOf("graph LR");

  const indexes = [
    graphTD,
    graphLR,
  ].filter((i) => i >= 0);

  if (indexes.length > 0) {
    const start = Math.min(...indexes);

    return response
      .slice(start)
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