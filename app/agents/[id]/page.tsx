"use client";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useContext } from "react";
import { agentById, ownershipLabel, pipelinesForAgent, useCasesOf, yamlForPipeline } from "@/lib/catalog";
import { agentConsoleUrl, applyYamlScope, scopeComplete } from "@/lib/scope";
import { YamlBlock } from "@/components/YamlBlock";
import { ConfigChecklist } from "@/components/ConfigChecklist";
import { ScopeContext } from "@/app/layout";

export default function AgentDetailPage() {
  const scope = useContext(ScopeContext);
  const { id } = useParams<{ id: string }>();
  const agent = id ? agentById(id) : undefined;
  if (!agent) {
    return (
      <div className="page">
        <p>Agent not found. <Link href="/agents">Back to catalog</Link></p>
      </div>
    );
  }
  const available = agent.availability !== "coming_soon";
  const url = available ? agentConsoleUrl(agent.harnessAgentId, agent.linkType, scope) : null;
  const related = pipelinesForAgent(agent.id);

  return (
    <div className="page">
      <div className="kicker">
        {ownershipLabel(agent.ownership)} · {agent.scope} · v{agent.version}
        {agent.author ? ` · ${agent.author}` : ""}
        {useCasesOf(agent).includes("enterprise") ? " · enterprise" : ""}
      </div>
      <div className="detail-head">
        <div>
          <h1 style={{ margin: "8px 0" }}>{agent.name}</h1>
          <p className="lede">{agent.description}</p>
        </div>
        <div className="actions">
          {url ? (
            <a className="btn" href={url} target="_blank" rel="noreferrer">Open in Harness</a>
          ) : (
            <button className="btn" type="button" disabled>Open in Harness</button>
          )}
        </div>
      </div>
      {!available && (
        <p className="banner" style={{ marginTop: 16 }}>
          This marketplace agent is marked "Coming soon" by Harness and is not ready for use.
        </p>
      )}
      {available && !scopeComplete(scope) && (
        <p className="banner" style={{ marginTop: 16 }}>
          Add account, org, and project IDs in <strong>Your Harness project</strong> to enable Open in Harness.
          This agent uses <code>?type={agent.linkType}</code>.
        </p>
      )}
      {agent.prerequisites.length > 0 && (
        <div className="section">
          <h2>Prerequisites</h2>
          <ul className="list">
            {agent.prerequisites.map((p) => <li key={p}>{p}</li>)}
          </ul>
        </div>
      )}
      {agent.configuration.length > 0 && (
        <div className="section">
          <h2>What you need to configure</h2>
          <ConfigChecklist items={agent.configuration} />
        </div>
      )}
      {related.length > 0 && (
        <div className="section">
          <h2>Pipeline examples</h2>
          {related.map((pipeline) => (
            <div key={pipeline.id} className="section">
              <h3><Link href={`/pipelines/${pipeline.id}`}>{pipeline.name}</Link></h3>
              <p>{pipeline.summary}</p>
              <YamlBlock yaml={applyYamlScope(yamlForPipeline(pipeline), scope)} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
