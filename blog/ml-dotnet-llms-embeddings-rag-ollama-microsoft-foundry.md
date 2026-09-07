---
title: "ML in .NET: From Trained Models to LLMs, Embeddings, RAG, Ollama, and Microsoft Foundry"
date: 2026-09-07
description: "A practical map for .NET developers: classical ML, LLMs, embeddings, RAG, local models with Ollama, and Microsoft Foundry."
tags: [".NET", "ML.NET", "LLMs", "RAG", "Microsoft Foundry", "Ollama"]
author: "Antonio Supan"
lastVerified: 2026-09-07
featured: false
---

# ML in .NET: From Trained Models to LLMs, Embeddings, RAG, Ollama, and Microsoft Foundry

AI terminology becomes much easier once we separate two questions:

1. **What kind of prediction do we need?** A price, category, anomaly, next-word response, or relevant document?
2. **Where should the model run?** Inside our infrastructure, on a developer machine, or as a managed cloud service?

This article is a map for .NET developers. It does not present a production benchmark or a client case study. Technology and availability change quickly; the sources at the end were checked on 7 September 2026.

## The short version

| Need | Typical tool | Output |
|---|---|---|
| Predict a number, class, anomaly, recommendation, or forecast from business data | ML.NET | A typed prediction or score |
| Generate or transform natural language | LLM | Text, structured output, or tool calls |
| Find text by meaning | Embedding model + vector search | Ranked chunks/documents |
| Answer using private or changing documents | RAG | Grounded LLM response with citations |
| Run an open model on a laptop, workstation, or private network | Ollama | Local generation or embeddings API |
| Govern, deploy, observe, and evaluate cloud AI workloads | Microsoft Foundry (`ai.azure.com`) | Managed models, agents, tools, and operations |

These tools complement each other. An LLM does not replace a fraud classifier, and ML.NET does not turn a CSV into a useful support chatbot.

## 1. Classical ML in .NET

**Machine learning** finds patterns in examples instead of encoding every rule manually. For example:

- classification: route a support ticket to the right team;
- regression: estimate a delivery time or price;
- anomaly detection: flag unusual transactions;
- recommendation: suggest a product;
- forecasting: estimate future demand.

[ML.NET](https://learn.microsoft.com/en-us/dotnet/machine-learning/overview) is Microsoft’s open-source, cross-platform framework for these workloads in .NET. Its basic lifecycle is intentionally ordinary software engineering:

```text
labelled historical data
        ↓
feature preparation
        ↓
trainer estimates model parameters
        ↓
evaluate against data the trainer did not see
        ↓
save and serve predictions
```

A **feature** is an input signal, such as order value, country, time of day, or words in a ticket. A **label** is the known answer in training data, such as `fraud = true` or the actual delivery time. Calling `Fit()` estimates model parameters from those examples; it is training, not merely loading a model.

```csharp
using Microsoft.ML;

var ml = new MLContext(seed: 1);
var data = ml.Data.LoadFromTextFile<Ticket>("tickets.csv", hasHeader: true, separatorChar: ',');
var split = ml.Data.TrainTestSplit(data, testFraction: 0.2);

var pipeline = ml.Transforms.Conversion.MapValueToKey("Label")
    .Append(ml.Transforms.Text.FeaturizeText("Features", nameof(Ticket.Text)))
    .Append(ml.MulticlassClassification.Trainers.SdcaMaximumEntropy())
    .Append(ml.Transforms.Conversion.MapKeyToValue("PredictedLabel"));

var model = pipeline.Fit(split.TrainSet);
var predictions = model.Transform(split.TestSet);
var metrics = ml.MulticlassClassification.Evaluate(predictions);

Console.WriteLine($"Micro accuracy: {metrics.MicroAccuracy:P2}");
```

The code is small; the difficult work is not. We need representative data, an explicit train/test split, a suitable metric, monitoring for data drift, and a defined retraining process. A high score on historical data is not evidence that a model will work for a changed business process.

ML.NET can also import pretrained ONNX or TensorFlow models. That is useful when a model was trained elsewhere and .NET should run inference. It is different from training a frontier LLM from scratch.

## 2. LLMs are predictive models, but at a very different scale

An **LLM** (large language model) predicts the next token — a small unit of text — from the tokens that came before it. Repeating that prediction produces an answer, a summary, code, or structured JSON.

Training happens in stages:

1. **Pretraining:** optimise billions of parameters on very large text, code, and other datasets to learn statistical language patterns.
2. **Post-training:** use curated examples, feedback, safety work, and evaluation to make the base model more useful for instruction following.
3. **Optional adaptation:** fine-tune a model or attach an adapter for a narrowly defined style/task, after proving that prompting and RAG are not enough.

Application teams almost never pretrain an LLM. The compute, data governance, evaluation, and cost are a model-provider concern. Application work is choosing a model, designing prompts and tool boundaries, supplying current knowledge, and evaluating the result.

LLMs can explain language and follow instructions, but their trained knowledge is not a transactional database. They can be outdated, lack private facts, and generate plausible but wrong answers. That is why an LLM alone is a poor choice for “What does our current contract say?”

## 3. Embeddings: numbers that preserve useful semantic relationships

An **embedding model** converts text into a vector: a fixed-length list of numbers. It does not write an answer. It lets software compare meaning.

```text
"How do I end my subscription?" → [0.12, -0.04, ...]
"Early termination of an agreement" → [0.10, -0.06, ...]
```

If two vectors are near each other under a distance metric such as cosine distance, their text is often semantically related. Store document-chunk embeddings in a vector index, embed the user’s question with **the same embedding model and dimensions**, then retrieve the nearest chunks.

Embeddings have practical uses beyond RAG: semantic search, duplicate detection, clustering, recommendations, and routing. They are not encrypted source text, and their metadata must receive the same access-control treatment as the source documents.

## 4. RAG connects a search system to an LLM

**Retrieval-augmented generation (RAG)** gives an LLM relevant content at request time instead of expecting it to memorise private or current facts.

```text
documents → extract → chunk → embed → index

user question → embed → retrieve permitted chunks → prompt + chunks → LLM answer + citations
```

The important word is **permitted**. Tenant, document-version, and authorization filters belong in the retrieval query before content reaches the model. They are not a prompt instruction.

RAG normally beats fine-tuning when the goal is to supply changing facts: re-index a changed document rather than retraining a model. Fine-tuning can be appropriate for a repeatable behaviour or format, but it does not substitute for a retrieval pipeline.

Evaluate RAG in two layers. First, retrieval: does the correct chunk appear in the top *k* results (recall@k)? Second, generation: is the answer grounded in those chunks, cited, safe, and useful? A fluent answer is not proof of correct retrieval.

## 5. What Ollama is — and what “local” actually means

[Ollama](https://docs.ollama.com/api/introduction) is a runtime and local HTTP API for downloading, running, and integrating models. After installation its API is normally available at `http://localhost:11434/api`. It can run generative models for chat and purpose-built embedding models for semantic search.

```bash
# Run a generative model locally
ollama run gemma3

# Generate an embedding locally
curl http://localhost:11434/api/embed -d '{
  "model": "embeddinggemma",
  "input": "How can a customer end a contract?"
}'
```

Local models can be attractive when data cannot leave a controlled network, latency must be predictable, internet access is unavailable, or engineers want a low-cost development loop. The trade-offs are real: hardware capacity, model download/storage, patching, access control, monitoring, throughput, and quality are our responsibility. “Local” does not automatically mean secure; an exposed local API or unencrypted disk can still leak data.

Ollama is therefore a deployment choice, not a category of AI. A local LLM can still participate in the same RAG architecture: an embedding model creates vectors, a database retrieves allowed chunks, and a generative model composes the answer.

## 6. Where `ai.azure.com` fits

`ai.azure.com` is the portal for **Microsoft Foundry** (formerly Azure AI Foundry/Azure AI Studio). It is not itself an LLM, embedding model, or RAG algorithm. It is the Azure platform surface for selecting and using models, building agents, connecting tools and knowledge, and applying operational controls such as Microsoft Entra identity, RBAC, network isolation, tracing, evaluation, and policy.

In current Foundry terminology, the direction is a unified Foundry resource with projects, the Responses API for newer agent scenarios, and project-oriented SDKs/endpoints. New investment is focused on the new Foundry experience; hub-based projects remain in the classic experience. This is migration-relevant, so pin SDK/API versions and check the current documentation before starting a project.

For RAG, Foundry can host the LLM and embedding deployment while retrieval is implemented with Azure AI Search, PostgreSQL/pgvector, or another system. Foundry also offers managed retrieval and agent tooling. The architectural responsibility remains the same: model choice does not remove the need to define source ownership, security filters, evaluation data, citation behaviour, and cost limits.

### What is new worth noticing

- The product brand is now **Microsoft Foundry**, consolidating earlier Azure AI surfaces into one platform/resource model.
- The newer agent direction uses **Responses API / Agents v2** rather than the older Assistants, Threads, Messages, and Runs concepts.
- The platform is adding managed agent capabilities, toolboxes, evaluation, tracing, and newer agentic-retrieval patterns. Availability differs by region and feature; treat preview features as previews, not production defaults.
- Microsoft Foundry documentation now describes **agentic retrieval** as an evolution of single-query RAG: a model can plan multiple focused retrieval queries and return structured grounding data. It is useful for complex questions, but costs more and needs stronger evaluation than a simple retrieval baseline.

## 7. Choosing a first implementation

Start with the smallest system that answers the actual problem:

- Need a deterministic prediction from labelled business data? Start with ML.NET.
- Need general language generation without private knowledge? Use one LLM call and evaluate it.
- Need answers from changing internal documents? Add a conventional RAG baseline: chunking, embeddings, permission-filtered retrieval, citations, and an evaluation set.
- Need offline or private-network development? Trial the same architecture with Ollama, then measure quality and operating cost on the target hardware.
- Need managed Azure identity, governance, monitoring, and model/agent operations? Use Microsoft Foundry, but keep retrieval and application authorization explicit.

The goal is not to use every tool. It is to make each component own one well-defined responsibility and to prove it works with representative data and test questions.

## Sources and further reading

- [ML.NET overview](https://learn.microsoft.com/en-us/dotnet/machine-learning/overview)
- [How ML.NET works: training, evaluation, and prediction](https://learn.microsoft.com/en-us/dotnet/machine-learning/mldotnet-api)
- [ML.NET tasks and algorithms](https://learn.microsoft.com/en-us/dotnet/machine-learning/resources/tasks)
- [Ollama API introduction](https://docs.ollama.com/api/introduction) and [embeddings API](https://docs.ollama.com/api/embed)
- [RAG and indexes in Microsoft Foundry](https://learn.microsoft.com/en-us/azure/foundry/concepts/retrieval-augmented-generation)
- [What is Microsoft Foundry?](https://learn.microsoft.com/en-us/azure/ai-foundry/what-is-ai-foundry)
