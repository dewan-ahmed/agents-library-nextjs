import { agents, customAgents, marketplaceAgents, pipelines } from "@/lib/catalog";

export default function AboutPage() {
  const enterpriseAgents = agents.filter((a) => a.useCases?.includes("enterprise")).length;
  const enterprisePipelines = pipelines.filter((p) => p.useCases?.includes("enterprise")).length;

  return (
    <div className="page">
      <div className="kicker">About</div>
      <h1>How this library works</h1>
      <p className="lede">
        This is a public, unauthenticated catalog. Matching and browse filters use curated metadata for{" "}
        {marketplaceAgents.length} Harness-managed marketplace agents, {customAgents.length} custom agents, and{" "}
        {pipelines.length} pipeline examples.
      </p>
      <div className="section">
        <h2>What you can do here</h2>
        <ul className="list">
          <li>Describe a problem on the homepage to match agents and copyable pipeline YAML.</li>
          <li>Open <strong>Lifecycle</strong> for a cloud of agent counts by delivery stage.</li>
          <li>Browse agents and pipelines. {enterpriseAgents} agents and {enterprisePipelines} pipelines are tagged <code>enterprise</code>.</li>
          <li>Copy pipeline YAML with <code>{"{{orgId}}"}</code> / <code>{"{{projectId}}"}</code> substitution.</li>
          <li>Open an agent in the Harness console after you set account, org, and project IDs.</li>
        </ul>
      </div>
      <div className="section">
        <h2>Open in Harness</h2>
        <pre>{`https://app.harness.io/ng/account/{accountId}/all/ai-agents/orgs/{orgId}/projects/{projectId}/agents/{agentId}?type={custom|system}`}</pre>
      </div>
      <div className="section">
        <h2>Copy YAML</h2>
        <p>
          Pipeline YAML is tokenized so your org and project identifiers can be substituted in the browser.
          Connectors, secrets, and repo names stay as placeholders.
        </p>
      </div>
    </div>
  );
}
