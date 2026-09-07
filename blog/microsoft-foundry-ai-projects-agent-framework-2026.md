---
title: "Microsoft Foundry in 2026: Choosing the Right Layer for a .NET Agent"
date: 2026-09-07
description: "A source-backed guide to choosing Microsoft Foundry, Foundry Agent Service, and Microsoft Agent Framework for a .NET workload."
tags: ["Microsoft Foundry", "Azure AI", "AI Agents", ".NET", "Agent Framework"]
author: "Antonio Supan"
featured: true
lastVerified: 2026-09-07
---

# Microsoft Foundry in 2026: Choosing the Right Layer for a .NET Agent

Microsoft's AI platform story is finally becoming easier to reason about, but only if you stop looking at it as "a portal for prompts".

The shift in 2026 is bigger than a rename from Azure AI Foundry to Microsoft Foundry. The important change is architectural: Foundry is becoming the Azure control plane for production AI applications. One project model. One project endpoint. SDKs that understand project-level resources. A hosted agent runtime. A code-first Agent Framework for systems where orchestration belongs inside the application.

That matters if you build .NET systems for real users. Demos can survive with one prompt, one API key, and a happy path. Production systems need identity, RBAC, observability, versioning, evaluation, network boundaries, rollout discipline, and a way to explain what the agent did after something goes wrong.

This is an architecture guide, not a claim that one platform choice fits every workload. Product availability and APIs change quickly; the linked Microsoft documentation is the source of truth and was checked on 7 September 2026.

## 1. The naming shift: Azure AI Foundry to Microsoft Foundry

The name change is not the interesting part. The interesting part is what the name now groups together.

Microsoft Foundry is being positioned as a unified place to discover models, build AI applications, deploy agents, evaluate behavior, and operate those systems with enterprise controls. The new portal is generally available for defined core scenarios, and Microsoft is very clear that teams should understand what is GA, what is preview, and what still lives in the classic portal before standardizing production workloads.

For engineers, that means we should stop treating the portal as a side tool and start treating Foundry projects as environment-level assets. A Foundry project is not just a folder for experiments. It is where models, deployments, agent configurations, tools, tracing, evaluations, and operational settings start to come together.

The practical migration pressure is also real. Classic experiences are not all gone, but the new direction is Foundry projects and Agents v2. Existing assistants and older agent patterns require a careful migration path. That is not a cosmetic detail. If you have built around Assistants-style APIs or classic hub-based projects, your first job is not to rewrite code. Your first job is to map dependencies:

- Which portal experience owns the workload today?
- Which SDK version is used?
- Is the agent based on older assistant/thread/run concepts?
- Which features are GA enough for production?
- What fallback exists while the migration is in progress?

The headline is simple: Foundry is moving from a collection of AI surfaces toward a governed platform. That is good news, but it also means architecture decisions are becoming more explicit.

## 2. Foundry Agent Service is the hosted agent runtime

Foundry Agent Service is the clearest sign of where Microsoft wants production agents to land.

At a high level, it gives you a managed platform for building, deploying, and scaling agents. You can use models from the Foundry model catalog, connect tools, and use the Responses API as the common entry point. The service supports prompt agents and hosted agents, so you can choose how much of the runtime you want Microsoft to manage.

This is the part I like: it does not force every team into the same shape.

If the workflow is close to a managed assistant, a prompt agent can make sense. You define instructions, tools, and behavior in the platform, and Foundry runs it. If the workflow has more custom orchestration, hosted agents let you package code and run it with managed endpoint behavior, scaling, identity, and observability. If you already run agent code elsewhere, you can still call the Responses API and use Foundry models and platform tools without moving the entire runtime immediately.

The tool story is also becoming more serious. File search, code interpreter, web search, memory, MCP servers, WorkIQ, Fabric IQ, toolboxes, skills, routines, and optimizer concepts are all signals that Foundry agents are being pulled toward operational workflows, not just chat windows.

My rule of thumb:

Use Foundry Agent Service when the agent lifecycle itself needs Azure governance.

That means:

- The agent needs managed identity and RBAC.
- Tool access must be controlled and auditable.
- You need tracing, evaluation, and operational review.
- Business users or platform teams need visibility into agent configuration.
- The agent should scale and be operated like a platform workload.

If the agent is only a small helper inside one application, a full hosted agent may be more platform than you need. But if the agent is a business workflow, Foundry Agent Service is the direction to watch.

## 3. The Microsoft Foundry SDK is the project-level developer surface

The SDK story has changed quickly, especially for teams that followed previews. The important consolidation is a project client against one Foundry project endpoint. In .NET, `Azure.AI.Projects` provides `AIProjectClient`; use `Azure.Identity` and `DefaultAzureCredential` for keyless authentication where the deployment supports it.

Use the project client for Foundry-native resources such as connections, model deployments, datasets and agent administration. Use the documented OpenAI-compatible client or REST API for model inference and Responses API calls. Do not copy package names or API snippets from older blog posts into a production repository: pin the exact package version, record the API version, and follow the SDK reference for that version.

The architectural implication is larger than the API call. The application connects to a Foundry project that carries access boundaries and platform configuration, rather than treating a model deployment as an ungoverned endpoint.

When upgrading from hub-based projects or preview packages, first inventory the endpoint, package versions, agent API and portal features in use. Microsoft states that new investment is focused on Foundry projects; older hub-based projects remain in the classic experience. Plan the migration in a branch, run integration tests against a non-production project, then remove superseded packages deliberately.

## 4. Microsoft Agent Framework is the code-first orchestration layer

Microsoft Agent Framework is the other half of the story.

Foundry gives you platform primitives. Agent Framework gives you code-first orchestration for .NET and Python. Microsoft describes it as a convergence of the enterprise foundations of Semantic Kernel and the orchestration ideas from AutoGen. That framing is useful because it explains why the framework is not just another chat wrapper.

The framework gives you:

- Individual agents that use LLMs, tools, MCP servers, and provider-specific model clients.
- Graph-based workflows for multi-step processes.
- Type-safe routing and checkpointing.
- Sessions and state management.
- Middleware hooks for logging, safety, policy, and custom behavior.
- Context providers and memory.
- Support for multiple providers, including Microsoft Foundry, Azure OpenAI, OpenAI, Anthropic, Ollama, and others.

This is what I would use when orchestration is part of the application domain.

For example, a public-sector document workflow might need one agent to extract fields, another to validate rules, another to prepare a response, and a deterministic service to persist the result. That should not be a prompt blob hidden inside a portal. That is application logic. It needs tests, versioning, observability, deployment discipline, and code review.

Agent Framework is also where multi-agent work becomes less mystical. The value is not "agents talking to agents" as a novelty. The value is that you can separate responsibilities:

- Research agent
- Validation agent
- Planning agent
- Tool execution agent
- Human review step
- Final response composer

That separation lets you test and observe the workflow more clearly than a single giant prompt trying to do everything.

The useful mental model is:

Use Agent Framework when the agent is software, not configuration.

If you need branching, memory, typed workflow steps, middleware, cross-provider support, or local runtime control, code-first orchestration is the cleaner place to work.

## 5. How I would choose between the pieces

The current Microsoft stack makes more sense when you stop asking "which one replaces which?" and start asking "which layer owns which responsibility?"

Use **the Foundry SDK** when you need project access:

- Project endpoint configuration
- Connections
- Foundry-native resources
- Evaluations
- Tracing setup
- Agent administration
- Access to Foundry platform tools

Use the **OpenAI-compatible client** when you need model and Responses API execution:

- Standard text or multimodal responses
- OpenAI-style request/response patterns
- Lower-friction model integration
- Compatibility with OpenAI-shaped app code

Use **Foundry Agent Service** when you need hosted runtime and platform governance:

- Managed prompt agents
- Hosted agent endpoints
- Managed scaling
- Identity and observability
- Platform tools such as memory, file search, code interpreter, web search, WorkIQ, Fabric IQ, or MCP servers

Use **Microsoft Agent Framework** when orchestration belongs in code:

- Multi-agent workflows
- Middleware
- State and checkpointing
- Human-in-the-loop flows
- Complex domain workflows
- Provider abstraction across Foundry, Azure OpenAI, OpenAI, Anthropic, and others

The mistake is trying to make one layer do every job. A mature architecture will often use several of these together.

For example:

- The Foundry SDK creates the project-level client.
- A documented OpenAI-compatible client calls the Responses API.
- Foundry Agent Service hosts the agent and gives operations teams visibility.
- Agent Framework handles orchestration logic that is too important to hide in prompt configuration.

That is more moving parts than a weekend demo, but it is also closer to how serious enterprise systems are built.

## 6. Production reality check

The biggest trap in AI engineering is pretending non-deterministic software does not need ordinary software engineering discipline.

It needs more of it.

Before shipping a Foundry or Agent Framework workload, I would want answers to these questions.

### Identity and RBAC

Is the workload using Microsoft Entra ID and managed identities where possible, or are we spreading API keys through environments? API keys can be useful, but they do not give the same permission granularity as RBAC. For governed environments, that tradeoff matters.

### Environment separation

Are dev, test, UAT, and production represented as separate projects or at least clearly separated deployments and configuration? If the same agent can mutate production data while someone is testing a prompt, the design is already broken.

### Prompt and agent versioning

Where do instructions live? How are they reviewed? Can we roll back? Are prompts versioned together with code, or are portal changes drifting away from repository history?

### Tool permissions

What can the agent actually do? Which APIs can it call? Can it write data, send emails, create tickets, or trigger workflows? Every tool should have an explicit permission boundary and an audit story.

### Evaluation

Do we have evaluation datasets for expected behavior, failure cases, edge cases, and regression tests? "It looked good in the playground" is not an acceptance criterion.

### Observability

Can we trace a user interaction across the application, agent, model call, tool call, and downstream system? If not, support teams will be blind when the agent behaves strangely.

### Cost and latency

Which model is used for which step? Are we using the strongest model everywhere because it was convenient? Are tool calls creating hidden latency? Do we have budgets, alerts, and fallback behavior?

### Migration from classic patterns

Are we still depending on classic portal behavior, older assistants, or preview SDK packages? If yes, what is the migration path and what is the fallback while the platform changes?

This is the engineering work that separates prototypes from production.

## Conclusion

Microsoft Foundry is becoming less "one more AI portal" and more the Azure control plane for production AI apps.

That is a good direction. Enterprise AI does not fail only because models hallucinate. It fails because nobody knows who owns the agent, which version is running, what tools it can call, why it made a decision, how much it costs, or how to roll it back.

The winning pattern is not to throw agents at every workflow. The winning pattern is disciplined software engineering around agents:

- Put platform concerns in Foundry.
- Put project access through the Foundry SDK.
- Put hosted lifecycle into Foundry Agent Service when the agent needs governance.
- Put orchestration into Agent Framework when the workflow is real application logic.

Agents are becoming part of the software architecture. That means we should treat them with the same seriousness we apply to APIs, databases, queues, CI/CD, and production support.

That is where the interesting work starts.

## Sources and further reading

- [What is Microsoft Foundry?](https://learn.microsoft.com/en-us/azure/ai-foundry/what-is-ai-foundry)
- [Azure AI Projects client library for .NET](https://learn.microsoft.com/en-us/dotnet/api/overview/azure/ai.projects-readme?view=azure-dotnet)
- [What is Microsoft Foundry Agent Service?](https://learn.microsoft.com/en-us/azure/foundry/agents/overview)
- [Microsoft Agent Framework overview](https://learn.microsoft.com/en-us/agent-framework/overview/)
- [Foundry Agent Service: agent types and operations](https://learn.microsoft.com/en-us/azure/foundry/agents/overview)
