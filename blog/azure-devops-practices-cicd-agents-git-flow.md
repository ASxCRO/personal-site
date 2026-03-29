---
title: "Azure DevOps Practices: CI/CD, Agents, On-Prem Setups, and Git Flow"
date: 2026-03-29
description: "Practical Azure DevOps guide covering CI/CD pipelines, self-hosted agent setup, on-premises considerations, release workflows, and Git Flow usage in real teams."
tags: ["Azure DevOps", "CI/CD", "Git Flow", "DevOps"]
author: "Antonio Supan"
---

# Azure DevOps Practices: CI/CD, Agents, On-Prem Setups, and Git Flow

Azure DevOps can scale from a small product team to enterprise delivery across multiple environments. The difference between a setup that "works" and one that stays reliable under pressure usually comes down to a few practical decisions: pipeline structure, agent strategy, release controls, and branch workflow discipline.

This guide focuses on battle-tested practices you can apply immediately, with examples for CI/CD, self-hosted agents, on-premises scenarios, and Git Flow in day-to-day development.

## Start with a Practical CI/CD Baseline

A good baseline pipeline should do four things consistently:

1. Build the application
2. Run fast validation (tests, linting, static checks)
3. Publish versioned artifacts
4. Make deployments repeatable across environments

Here is a minimal multi-stage YAML pipeline for a .NET service:

```yaml
trigger:
  branches:
    include:
      - develop
      - main
      - release/*
      - hotfix/*

pr:
  branches:
    include:
      - develop
      - main

pool:
  vmImage: "ubuntu-latest"

variables:
  buildConfiguration: "Release"

stages:
  - stage: BuildAndTest
    displayName: "Build and Test"
    jobs:
      - job: Build
        steps:
          - task: UseDotNet@2
            inputs:
              packageType: "sdk"
              version: "8.0.x"

          - script: dotnet restore
            displayName: "Restore"

          - script: dotnet build --configuration $(buildConfiguration) --no-restore
            displayName: "Build"

          - script: dotnet test --configuration $(buildConfiguration) --no-build --collect:"XPlat Code Coverage"
            displayName: "Test"

          - script: dotnet publish src/MyApi/MyApi.csproj -c $(buildConfiguration) -o $(Build.ArtifactStagingDirectory)/app
            displayName: "Publish"

          - publish: $(Build.ArtifactStagingDirectory)/app
            artifact: "app"
```

This gives you a reliable CI foundation before adding deployment complexity.

## Agent Strategy: Microsoft-Hosted vs Self-Hosted

Azure DevOps agent strategy should be intentional, not accidental.

Use Microsoft-hosted agents when:

- You want zero maintenance overhead
- Your build dependencies are standard
- You do not need private network access

Use self-hosted agents when:

- You need access to private on-prem resources
- You depend on licensed tools or custom SDKs
- You need predictable performance and warm caches
- You must control security boundaries tightly

In most enterprise setups, you end up with a hybrid model: Microsoft-hosted for generic workloads, self-hosted for internal systems and regulated environments.

## Installing a Self-Hosted Agent

### Windows Agent Example

```powershell
# Run in an elevated PowerShell session
mkdir C:\azagent
cd C:\azagent

# Download from Azure DevOps agent pool page
# Example file name may differ by version
Invoke-WebRequest -Uri https://vstsagentpackage.azureedge.net/agent/4.255.0/vsts-agent-win-x64-4.255.0.zip -OutFile agent.zip
Expand-Archive -Path .\agent.zip -DestinationPath .

.\config.cmd
# Select:
# 1) Azure DevOps URL
# 2) PAT with Agent Pools (Read, manage)
# 3) Agent pool name
# 4) Agent name and work folder
# 5) Run as service (recommended)

.\run.cmd
```

### Linux Agent Example

```bash
mkdir -p ~/azagent && cd ~/azagent
curl -fkSL -o agent.tar.gz https://vstsagentpackage.azureedge.net/agent/4.255.0/vsts-agent-linux-x64-4.255.0.tar.gz
tar zxvf agent.tar.gz

./config.sh
# Provide Azure DevOps URL, PAT, pool and agent name

sudo ./svc.sh install
sudo ./svc.sh start
```

The installation itself is easy. Production quality comes from how you configure pools, permissions, and maintenance.

## Agent Configuration That Works in Production

Focus on these practices:

- Create dedicated pools per environment or trust boundary (for example `Build`, `DevDeploy`, `ProdDeploy`)
- Use least-privilege service accounts for agent runtime
- Keep tool versions explicit in pipeline tasks (`UseDotNet`, `NodeTool`, etc.)
- Rotate PAT tokens and prefer short-lived credentials where possible
- Patch and update agents regularly to avoid surprise failures

Use demands and capabilities when workloads require specific tooling:

```yaml
pool:
  name: "SelfHosted-Build"
  demands:
    - Agent.OS -equals Linux
    - dotnet
    - docker
```

This prevents jobs from landing on incompatible machines.

## On-Premises Azure DevOps Server Considerations

For on-premises (Azure DevOps Server), design for network reality first.

Typical pattern:

1. Azure DevOps Server hosted in internal infrastructure
2. SQL Server on dedicated, backed-up storage
3. Self-hosted agents deployed close to target systems
4. Segmented pools for non-prod and prod

Key recommendations:

- Keep agents inside the same network zone as deployment targets
- Avoid opening broad inbound firewall rules just for deployment convenience
- Externalize secrets to a managed vault solution where possible
- Define backup and restore drills for both Azure DevOps Server and SQL databases
- Document collection/project topology early to avoid later migration pain

If your builds require internal package feeds, artifact repositories, or legacy systems, on-prem agents usually provide the cleanest and most stable route.

## Build and Release Pipeline Design

A common anti-pattern is mixing every concern in a single pipeline stage. Separate concerns by stage and environment.

Example deployment stages with branch-based controls:

```yaml
stages:
  - stage: BuildAndTest
    jobs:
      - job: Build
        steps:
          - script: echo "Build + test"

  - stage: DeployDev
    dependsOn: BuildAndTest
    condition: succeeded()
    jobs:
      - deployment: DeployToDev
        environment: "dev"
        strategy:
          runOnce:
            deploy:
              steps:
                - download: current
                  artifact: app
                - script: echo "Deploy to DEV"

  - stage: DeployProd
    dependsOn: DeployDev
    condition: and(succeeded(), eq(variables['Build.SourceBranch'], 'refs/heads/main'))
    jobs:
      - deployment: DeployToProd
        environment: "prod"
        strategy:
          runOnce:
            deploy:
              steps:
                - download: current
                  artifact: app
                - script: echo "Deploy to PROD"
```

Use Azure DevOps Environments for approval gates, deployment history, and traceability. That gives release confidence without hiding logic in manual runbooks.

## Git Flow in Real-World Development

Git Flow still works well in teams that need formal release cycles and predictable hotfix handling.

Typical branch roles:

- `main`: production-ready code
- `develop`: integration branch for upcoming release
- `feature/*`: isolated feature work
- `release/*`: stabilization before production cut
- `hotfix/*`: urgent fixes from production incidents

Practical workflow:

1. Developers branch from `develop` into `feature/*`
2. Pull requests validate into `develop` with CI checks
3. Release prep starts by creating `release/*` from `develop`
4. Only fixes go into `release/*` during stabilization
5. Release merges into `main` and back into `develop`
6. Hotfixes branch from `main`, then merge into both `main` and `develop`

Pipeline mapping that works:

- CI pipeline on `feature/*`, `develop`, `release/*`, `hotfix/*`
- Automatic deployment to shared dev/test from `develop`
- Candidate deployment from `release/*` to staging/UAT
- Production deployment from `main` with approvals

This model gives teams structure while still enabling fast incident response.

## Common Failure Modes

Teams usually hit the same issues:

- Long-running pipelines because every job runs on every branch
- Shared self-hosted agents accumulating stale state
- Release branches carrying new features instead of only stabilization fixes
- Manual deployment steps outside pipeline traceability
- Missing rollback strategy for production releases

Most of these are process problems, not tooling limitations.

## Best Practices Summary

1. Keep CI fast and deterministic; fail early on compile/test quality gates.
2. Publish immutable artifacts and deploy the same artifact across environments.
3. Use self-hosted agents only when network, compliance, or tooling requires them.
4. Separate agent pools by trust boundary and environment.
5. Model deployments as staged YAML pipelines with approvals in Environments.
6. Map Git Flow branches to clear deployment targets and policies.
7. Keep release branches focused on stabilization, not scope growth.
8. Treat rollback and incident hotfix flow as first-class pipeline scenarios.

## Conclusion

Azure DevOps becomes significantly easier to operate when pipeline design, agent strategy, and branch workflow are aligned from the start. You do not need a complex setup on day one, but you do need consistency.

Start with a clean CI baseline, add staged deployments, and formalize Git Flow rules your team actually follows. From there, self-hosted agents and on-prem patterns become a controlled extension of the same delivery model, not a separate world.
