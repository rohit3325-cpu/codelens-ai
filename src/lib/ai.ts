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

  const completion = await client.chat.completions.create({
    model: "openrouter/free",
    messages: [
      {
        role: "system",
        content:
          "You are a senior software engineer. Explain code in 3-5 simple bullet points.",
      },
      {
        role: "user",
        content: `Explain this code file:\n\n${trimmedCode}`,
      },
    ],
  });

  console.log(JSON.stringify(completion, null, 2));

  return completion.choices[0].message.content || "";
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

Analyze the repository and generate a concise repository overview.

Return the following sections:

# Project Type

# Purpose

# Core Workflow

# Tech Stack

# Main Features

# Important Files

# Key Insights

# Developer Onboarding

# Repository Health

Rules:

- Use markdown.
- Use bullet points.
- Keep explanations concise.
- Do not dump folder structures.
- Focus on helping a developer understand the repository quickly.
`,
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