---
title: "Azure DevOps Practices: CI/CD, Agents, On-Prem Setups, and Git Flow"
date: 2026-03-29
description: "Simple, practical Azure DevOps guide for CI/CD, self-hosted agents, on-prem setups, build and release pipelines, and Git Flow."
tags: ["Azure DevOps", "CI/CD", "Git Flow", "DevOps"]
author: "Antonio Supan"
---

# Azure DevOps Practices: CI/CD, Agents, On-Prem Setups, and Git Flow

Azure DevOps is easier to manage when a few core things are clear: how you build, how you deploy, where agents run, and how your team uses branches.

This post is a practical overview you can apply right away. We keep it simple and focused on real workflows.

## Start with a Simple CI/CD Baseline

A good CI pipeline should always:

1. Build the application
2. Run tests
3. Publish an artifact
4. Reuse the same artifact for deployments

Example YAML:

```yaml
trigger:
  branches:
    include:
      - develop
      - main
      - release/*
      - hotfix/*

pool:
  vmImage: "ubuntu-latest"

variables:
  buildConfiguration: "Release"

stages:
  - stage: BuildAndTest
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

          - script: dotnet test --configuration $(buildConfiguration) --no-build
            displayName: "Test"

          - script: dotnet publish src/MyApi/MyApi.csproj -c $(buildConfiguration) -o $(Build.ArtifactStagingDirectory)/app
            displayName: "Publish"

          - publish: $(Build.ArtifactStagingDirectory)/app
            artifact: "app"
```

Keep CI fast. If CI is slow, developers stop trusting it.

![Azure DevOps Pipelines overview](/assets/blog/azure-devops/pipelines-overview.png)
*Azure DevOps Pipelines overview screen. Source: [Microsoft Learn](https://learn.microsoft.com/en-us/azure/devops/pipelines/create-first-pipeline?view=azure-devops).*

## Agent Strategy: Microsoft-Hosted vs Self-Hosted

You have two main options.

Use Microsoft-hosted agents when:

- You want minimal maintenance
- You use standard tools
- You do not need private network access

Use self-hosted agents when:

- You need access to internal servers
- You need custom tools or licensed software
- You want more control over security and performance

Many teams use a hybrid model.

![Azure DevOps add agent pool screen](/assets/blog/azure-devops/create-agent-pool.png)
*Project Settings -> Agent pools -> Add pool. Source: [Microsoft Learn](https://learn.microsoft.com/en-us/azure/devops/pipelines/agents/scale-set-agents?view=azure-devops).*

## Installing a Self-Hosted Agent

### Windows Agent Example

```powershell
mkdir C:\azagent
cd C:\azagent

Invoke-WebRequest -Uri https://vstsagentpackage.azureedge.net/agent/4.255.0/vsts-agent-win-x64-4.255.0.zip -OutFile agent.zip
Expand-Archive -Path .\agent.zip -DestinationPath .

.\config.cmd
.\run.cmd
```

### Linux Agent Example

```bash
mkdir -p ~/azagent && cd ~/azagent
curl -fkSL -o agent.tar.gz https://vstsagentpackage.azureedge.net/agent/4.255.0/vsts-agent-linux-x64-4.255.0.tar.gz
tar zxvf agent.tar.gz

./config.sh
sudo ./svc.sh install
sudo ./svc.sh start
```

Installation is straightforward. Reliability comes from good pool and permission setup.

## Agent Configuration Basics

Focus on these rules:

- Separate pools by purpose (`Build`, `DevDeploy`, `ProdDeploy`)
- Use least-privilege service accounts
- Pin tool versions in pipelines
- Rotate credentials
- Update agents regularly

Use demands when tooling differs:

```yaml
pool:
  name: "SelfHosted-Build"
  demands:
    - Agent.OS -equals Linux
    - dotnet
    - docker
```

This avoids jobs landing on the wrong machine.

## On-Premises Azure DevOps Server Considerations

If you run Azure DevOps Server on-prem, keep the architecture simple.

Typical setup:

1. Azure DevOps Server in internal infrastructure
2. SQL Server with backups
3. Self-hosted agents close to target systems
4. Separate non-prod and prod pools

Key recommendations:

- Keep agents in the same network zone as deployment targets
- Avoid broad firewall openings
- Store secrets in a vault
- Test backup and restore
- Document topology early

On-prem agents are usually best for strict security and legacy integrations.

## Build and Release Pipeline Design

Do not mix everything in one stage. Split build and deploy.

Simple staged example:

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

Use Azure DevOps Environments for approvals and deployment history.

![Azure DevOps pipeline run summary with stages](/assets/blog/azure-devops/pipeline-run-summary.png)
*Pipeline run summary (stages, artifacts, and run details). Source: [Microsoft Learn](https://learn.microsoft.com/en-us/azure/devops/pipelines/create-first-pipeline?view=azure-devops).*

![Azure DevOps approvals and checks in environment settings](/assets/blog/azure-devops/approvals-and-checks.png)
*Environment approvals and checks configuration. Source: [Microsoft Learn](https://learn.microsoft.com/en-us/azure/devops/pipelines/process/approvals?view=azure-devops).*

## Git Flow in Real-World Development

Git Flow works well when you need clear release and hotfix paths.

Branch roles:

- `main`: production
- `develop`: integration for next release
- `feature/*`: feature work
- `release/*`: stabilization
- `hotfix/*`: urgent production fixes

Simple workflow:

1. Create `feature/*` from `develop`
2. Merge to `develop` through PR and CI
3. Create `release/*` from `develop`
4. Keep release branch for bug fixes only
5. Merge release into `main` and back into `develop`
6. Create hotfix from `main`, then merge to both `main` and `develop`

Pipeline mapping:

- CI on `feature/*`, `develop`, `release/*`, `hotfix/*`
- Auto deploy to dev/test from `develop`
- Deploy `release/*` to staging/UAT
- Deploy `main` to production with approval

![Azure DevOps branch control check settings](/assets/blog/azure-devops/branch-control-check.png)
*Branch control check used to restrict allowed branches for deployments. Source: [Microsoft Learn](https://learn.microsoft.com/en-us/azure/devops/pipelines/process/approvals?view=azure-devops).*

## Common Mistakes

- Slow pipelines
- Dirty shared agents
- New features added to release branches
- Manual deploy steps outside pipelines
- No rollback plan

Most of these are process issues, not tooling limits.

## Best Practices Summary

1. Keep CI fast and stable.
2. Build once, deploy same artifact everywhere.
3. Use self-hosted agents only when needed.
4. Separate pools by environment and trust level.
5. Use staged pipelines and approvals for production.
6. Keep Git Flow rules simple and consistent.
7. Keep release branches focused on stabilization.
8. Always have a rollback path.

## Conclusion

Azure DevOps does not need to be complex. Start with a clean CI baseline, add controlled deployments, and use a branch strategy your team can follow every day.

If these basics are consistent, scaling to self-hosted agents and on-prem setups becomes much easier.
