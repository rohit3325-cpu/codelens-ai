"use client";

import mermaid from "mermaid";
import { useEffect, useRef } from "react";

export default function MermaidDiagram({
  chart,
}: {
  chart: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    mermaid.initialize({
      startOnLoad: false,
      securityLevel: "loose",
    });

    const renderDiagram = async () => {
      if (!ref.current) return;

      try {
        let cleanedChart = chart
          .replace(/```mermaid/g, "")
          .replace(/```/g, "")
          .replace(/'/g, "")
          .replace(/"/g, "")
          .replace(/`/g, "")
          .replace(/\*/g, "")
          .replace(/#/g, "")
          .replace(/\(/g, "-")
          .replace(/\)/g, "-")
          .trim();

        // Extract only Mermaid content. Use the LAST match in case the
        // model's raw text mentions "graph TD" while reasoning before
        // settling on its final diagram.
        const graphTD =
          cleanedChart.lastIndexOf("graph TD");
        const graphLR =
          cleanedChart.lastIndexOf("graph LR");
        const flowTD =
          cleanedChart.lastIndexOf("flowchart TD");
        const flowLR =
          cleanedChart.lastIndexOf("flowchart LR");

        const indexes = [
          graphTD,
          graphLR,
          flowTD,
          flowLR,
        ].filter((i) => i >= 0);

        if (indexes.length > 0) {
          const start = Math.max(...indexes);
          cleanedChart =
            cleanedChart.slice(start);
        }

        // Guard against the declaration being glued directly onto the
        // first node with no separator, e.g. "graph TDA[Storage]".
        cleanedChart = cleanedChart.replace(
          /^(graph (?:TD|LR)|flowchart (?:TD|LR))(?!\n)/,
          "$1\n"
        );

        const validDiagram =
          cleanedChart.startsWith(
            "graph TD"
          ) ||
          cleanedChart.startsWith(
            "graph LR"
          ) ||
          cleanedChart.startsWith(
            "flowchart TD"
          ) ||
          cleanedChart.startsWith(
            "flowchart LR"
          );

        if (!validDiagram) {
          throw new Error(
            `Invalid Mermaid Diagram:\n${cleanedChart}`
          );
        }

        const id = `mermaid-${Date.now()}`;

        const { svg } =
          await mermaid.render(
            id,
            cleanedChart
          );

        ref.current.innerHTML = svg;

        const svgElement =
          ref.current.querySelector("svg");

        if (svgElement) {
          svgElement.style.width =
            "100%";
          svgElement.style.height =
            "auto";
          svgElement.style.maxWidth =
            "100%";
        }
      } catch (error) {
        console.error(
          "Mermaid Render Error:",
          error
        );

        if (ref.current) {
          ref.current.innerHTML = `
            <div style="
              padding:16px;
              border:1px solid #444;
              border-radius:8px;
              background:#111;
              color:white;
              overflow:auto;
            ">
              <h3>Unable to render diagram</h3>
              <pre>${chart}</pre>
            </div>
          `;
        }
      }
    };

    renderDiagram();
  }, [chart]);

  return (
    <div
      ref={ref}
      className="overflow-auto rounded-2xl border border-slate-800 bg-slate-900 p-4"
    />
  );
}