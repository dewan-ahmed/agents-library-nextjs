"use client";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useContext } from "react";
import { agentById, pipelineById, useCasesOf, yamlForPipeline } from "@/lib/catalog";
import { YamlBlock } from "@/components/YamlBlock";
import { ConfigChecklist } from "@/components/ConfigChecklist";
import { agentConsoleUrl, applyYamlScope } from "@/lib/scope";
import { ScopeContext } from "@/app/layout";

export default function PipelineDetailPage() {
  const scope = useContext(ScopeContext);
  const { id } = useParams<{ id: string }>();
  const pipeline = id ? pipelineById(id) : undefined;
  if (!pipeline) {
    return (
      <div className="page">
        <p>Pipeline not found. <Link href="/pipelines">Back to catalog</Link></p>
      </div>
    );
  }
  const yaml = applyYamlScope(yamlForPipeline(pipeline), scope);
  const relatedAgents = pipeline.agentIds.map((agentId) => agentById(agentId)).filter(Boolean);

  return (
    <div className="page">
      <div className="kicker">
        {pipeline.complexity} · {pipeline.identifier}
        {useCasesOf(pipeline).includes("enterprise") ? " · enterprise" : ""}
      </div>
      <div className="detail-head">
        <div>
          <h1 style={{ margin: "8px 0" }}>{pipeline.name}</h1>
          <p className="lede">{pipeline.summary}</p>
        </div>
      </div>
      {pipeline.availability === "coming_soon" && (
        <div className="banner">
          This sample uses an agent that Harness currently marks as coming soon. The YAML is available for preview, but the agent cannot be run yet.
        </div>
      )}
      {pipeline.prerequisites && pipeline.prerequisites.length > 0 && (
        <div className="section">
          <h2>Prerequisites</h2>
          <ul className="list">
            {pipeline.prerequisites.map((p) => <li key={p}>{p}</li>)}
          </ul>
        </div>
      )}
      {pipeline.configuration && pipeline.configuration.length > 0 && (
        <div className="section">
          <h2>What you need to configure</h2>
          <ConfigChecklist items={pipeline.configuration} />
        </div>
      )}
      <div className="section">
        <h2>Stages</h2>
        <div className="flow">
          {pipeline.stages.map((stage, index) => (
            <span key={stage} className="flow">
              <span className="pill">{stage}</span>
              {index < pipeline.stages.length - 1 && <span className="arrow">→</span>}
            </span>
          ))}
        </div>
      </div>
      <div className="section">
        <h2>Worker agents used</h2>
        <ul className="list">
          {relatedAgents.map((agent) =>
            agent ? (
              <li key={agent.id}>
                <Link href={`/agents/${agent.id}`}>{agent.name}</Link>
                {" · "}
                {agentConsoleUrl(agent.harnessAgentId, agent.linkType, scope) ? (
                  <a href={agentConsoleUrl(agent.harnessAgentId, agent.linkType, scope)!} target="_blank" rel="noreferrer">Open in Harness</a>
                ) : (
                  <span className="muted">set project scope to open</span>
                )}
              </li>
            ) : null,
          )}
        </ul>
      </div>
      <div className="section">
        <h2>You supply at run time</h2>
        <div className="starters">
          {pipeline.runtimeInputs.map((input) => (
            <span className="pill" key={input}>{input}</span>
          ))}
        </div>
      </div>
      <div className="section">
        <h2>Copyable YAML</h2>
        <YamlBlock yaml={yaml}>
          <p className="muted">
            Only <code>{"{{orgId}}"}</code> and <code>{"{{projectId}}"}</code> are filled from your saved project scope.
          </p>
        </YamlBlock>
      </div>
    </div>
  );
}
