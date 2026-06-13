# Research Notes

Research date: 2026-06-13

The goal was to find a project direction that could impress GitHub profile visitors while staying realistic to build well. The scan combined verified GitHub API data with public developer-discussion surfaces.

## What Was Checked

- GitHub API search for repositories above 100,000 stars.
- GitHub API search for AI repositories above 20,000 stars.
- GitHub API search for MCP repositories above 5,000 stars.
- GitHub Trending.
- OSSInsight AI trending.
- Public Hacker News and Reddit discussions around agent workflows, MCP, spec-driven development, and AI automation security.
- Public YouTube search results around 2026 AI GitHub project roundups.

## Strongest Patterns

### Build-Your-Own Learning

`codecrafters-io/build-your-own-x` had 514,816 stars in the verified GitHub API response. This pattern works because it signals technical depth, practical learning, and from-scratch credibility.

### Curated Developer Knowledge

`sindresorhus/awesome`, `awesome-mcp-servers`, and similar lists show that developers star well-organized discovery surfaces. A great profile project should be useful even before someone runs it.

### Visual Workflow Builders

`n8n`, `langflow`, and `dify` show sustained interest in node-based workflow products. They are visually demoable and technically rich, but too large to clone well in a short portfolio build.

### Agent Guardrails And Specs

GitHub's `spec-kit`, MCP-related repositories, and public developer discussions point toward a useful gap: developers want agentic workflows, but they also want inspectable plans, safety boundaries, and repeatable execution.

## Decision

Build SpecForge: a local-first workflow studio that combines the social pull of high-star developer resources with the demo appeal of workflow builders and the engineering seriousness of spec-driven development.

## Source Links

- https://api.github.com/search/repositories?q=stars:%3E100000&sort=stars&order=desc
- https://api.github.com/search/repositories?q=topic:ai%20stars:%3E20000&sort=stars&order=desc
- https://api.github.com/search/repositories?q=topic:mcp%20stars:%3E5000&sort=stars&order=desc
- https://github.com/trending
- https://ossinsight.io/trending/ai
- https://news.ycombinator.com/item?id=48413629
- https://news.ycombinator.com/item?id=47350516
