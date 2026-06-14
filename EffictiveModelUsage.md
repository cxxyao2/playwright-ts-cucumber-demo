下面这个分工最适合你这种日常：**Playwright + Cucumber + TypeScript 自动化测试 / 文档报告 / Email**。核心原则是：**便宜模型做筛选和草稿，强模型做计划和关键判断，Agent 模式只给明确任务，不让它漫游。**

---

## 1. Ask / Plan / Agent 三种模式怎么省 token

### A. Ask 模式：最省 token，用来“问、改、解释、翻译”

适合：

| 任务                    | 用 Ask 模式                    |
| ----------------------- | ------------------------------ |
| 解释一个错误            | 粘贴 error + 相关 20–80 行代码 |
| 写一封邮件              | 给背景 + tone + 要点           |
| 文档总结                | 给一段或一页内容               |
| Cucumber step 命名      | 给 feature 片段                |
| Playwright locator 问题 | 给 HTML 片段 + 你的目标        |

**不要在 Ask 模式里丢整个 repo、整份 report、整页 DOM。**

你可以这样问：

```text
You are helping me with Playwright + Cucumber + TypeScript.
Goal: fix this flaky test.
Context: This is an Angular app using ag-grid.
Problem: rows are rendered dynamically.
Here is the error:
...
Here is the relevant step definition:
...
Please explain the root cause and suggest a minimal fix. Do not rewrite unrelated code.
```

**推荐模型：Haiku / GPT-4 / GPT-5 mini 类便宜模型。**
如果只是邮件、总结、翻译、简单 code review，不要上 Sonnet 4.6 或 GPT-5.5。

---

### B. Plan 模式：中等 token，用来“先设计，不执行”

适合：

| 任务                                 | 用 Plan 模式 |
| ------------------------------------ | ------------ |
| 新增一组 E2E tests                   |              |
| 从 test plan 生成 Cucumber features  |              |
| 设计 page object / service structure |              |
| 改造一批 flaky tests                 |              |
| 分析一个 report 的结构               |              |
| 规划自动化策略                       |              |

Plan 模式的关键是：**让模型先输出步骤、文件清单、风险点，不让它马上写代码。**

你可以这样写：

```text
Plan mode only. Do not modify files yet.

Task:
Generate Playwright + Cucumber + TypeScript tests for this feature.

Context:
- Angular web app
- ag-grid is used for data tables
- One page usually has one div.ag-grid
- Cell locators should use div.ag-grid div.ag-cell
- We prefer stable locators and avoid hard waits

Please produce:
1. Test scenarios
2. Step definitions needed
3. Page object methods
4. Locator strategy
5. Risks / flaky points
6. Estimated files to change
```

这样可以省 token，因为你先检查方向。如果 plan 不对，就不用让 Agent 白白改一堆文件。

**推荐模型：Claude Sonnet 4.6 / GPT-5 / GPT-5.5。**
Claude Sonnet 4.6 官方定位是 speed + intelligence 的组合，并强化 coding、computer use、long-context reasoning、agent planning、knowledge work；Anthropic 文档也列出 Sonnet 4.6 有 1M context、64k max output。([Claude Platform][1])
GPT-5.5 官方也强调它适合 coding/debugging、research、documents/spreadsheets、操作软件和跨工具完成任务。([OpenAI][2])

---

### C. Agent 模式：最贵，只给“明确、可验证”的任务

适合：

| 任务                                        | 用 Agent 模式 |
| ------------------------------------------- | ------------- |
| 让 Playwright MCP 打开网页找 locator        |               |
| 自动生成 test code                          |               |
| 跑 test，读失败日志，再修                   |               |
| 修改多个文件                                |               |
| 从 feature → step definitions → page object |               |
| 修复真实 flaky test                         |               |

Agent 模式最容易烧 token，因为它会看文件、跑命令、读日志、循环修复。所以要给它**边界**。

好的 Agent 指令应该像这样：

```text
Agent mode.

Goal:
Create or fix Playwright + Cucumber + TypeScript automation for the "Alert column id" scenario.

Rules:
- Use Playwright MCP only when locator cannot be inferred from existing code.
- Do not inspect unrelated pages.
- Prefer div.ag-grid as grid root.
- For cells, use: div.ag-grid div.ag-cell
- Avoid waitForTimeout.
- Use expect.poll when waiting for dynamic ag-grid rows.
- Modify only these files unless necessary:
  - features/alert.feature
  - steps/alert.steps.ts
  - pages/alert.page.ts

Workflow:
1. Inspect existing page object patterns.
2. Add minimal page methods.
3. Add/update step definitions.
4. Run the specific cucumber test only.
5. If failed, fix once or twice.
6. Stop and summarize changes.

Output:
- Files changed
- Commands run
- Test result
- Remaining risks
```

**关键省 token 技巧：不要说 “fix all tests”。要说 “run this one spec / this tag”。**

例如：

```bash
npm run test:e2e -- --tags "@alert-grid"
```

而不是：

```bash
npm test
```

---

## 2. 你的任务应该怎么分配模型

### 总表

| 场景                    | 首选模型                                  | 原因                                 |
| ----------------------- | ----------------------------------------- | ------------------------------------ |
| 简单邮件、日常回复      | Haiku / GPT-4 / GPT-4o mini 类            | 快、省、够用                         |
| 英法中邮件润色          | GPT-4 / GPT-5 mini / Haiku                | 语言任务不需要最强 agent             |
| 文档摘要、report 初稿   | Haiku → GPT-5/Sonnet 审核                 | 先便宜模型提取，再强模型整理         |
| 复杂 report、跨多个文档 | Claude Sonnet 4.6 / GPT-5.5               | 长上下文、推理、文档理解更重要       |
| Playwright locator 问题 | Claude Sonnet 4.6 / GPT-5                 | 需要理解 DOM、测试稳定性             |
| Playwright MCP 操作网页 | Claude Sonnet 4.6 / GPT-5.5               | agent planning + computer use 更合适 |
| 大量代码生成            | Claude Sonnet 4.6 / GPT-5-Codex           | coding agent 更强                    |
| 修 flaky tests          | Claude Sonnet 4.6 / GPT-5-Codex / GPT-5.5 | 需要读日志、定位原因、循环修         |
| 架构设计、测试策略      | GPT-5.5 / Claude Sonnet 4.6               | 需要全局判断                         |
| 便宜批量分类、提取      | Haiku                                     | 成本低、速度快                       |

OpenAI 官方现在把 GPT-5 视为上一代 coding/reasoning/agentic model，并推荐更新的 GPT-5.5；GPT-5 仍有 400k context 和 configurable reasoning effort。([OpenAI开发者][3]) 如果你有 GPT-5-Codex，它是专门为 Codex 或类似环境里的 agentic coding 优化的版本。([OpenAI开发者][4])

---

## 3. 对你最实用的工作流

### 工作流 1：从 test plan / feature 生成自动化代码

**不要直接 Agent。先 Plan，再 Agent。**

1. **Ask/Plan：让强模型读 test plan，生成测试设计**
2. 你检查 scenario 是否正确
3. **Agent：只生成相关 feature、steps、page object**
4. Agent 跑单个 tag
5. 失败后让 Agent 修，不要超过 2–3 轮
6. 最后让便宜模型总结 change log

推荐模型：

| 阶段                  | 模型                        |
| --------------------- | --------------------------- |
| 理解 test plan        | Claude Sonnet 4.6 / GPT-5.5 |
| 写 feature            | GPT-4 / Sonnet 4.6          |
| 写 step + page object | Sonnet 4.6 / GPT-5-Codex    |
| 修失败                | Sonnet 4.6 / GPT-5-Codex    |
| 总结 PR               | Haiku / GPT-4               |

---

### 工作流 2：修 Playwright flaky test

你的测试里如果有 Angular dynamic rendering、ag-grid、loading、virtual scroll，最容易 flaky。建议固定模板：

```text
Analyze this flaky Playwright+Cucumber test.

Please identify:
1. Is it a locator issue?
2. Is it a timing/rendering issue?
3. Is it caused by ag-grid virtualization?
4. Should we use expect(locator).toBeVisible(), expect.poll(), or wait for API response?
5. Give the minimal code change.

Do not rewrite the whole test.
```

对于 ag-grid，建议让模型优先考虑：

```typescript
const grid = page.locator("div.ag-grid").first();
const cells = grid.locator("div.ag-cell");
await expect
  .poll(async () => await cells.count(), {
    timeout: 90000,
  })
  .toBeGreaterThan(0);
```

如果是等待数据稳定：

```typescript
await expect
  .poll(
    async () => {
      const count = await page.locator("div.ag-grid div.ag-cell").count();
      return count;
    },
    {
      timeout: 90000,
      intervals: [1000, 2000, 5000],
    },
  )
  .toBeGreaterThan(0);
```

这里不要让 Agent 一开始就操作浏览器。先用 Ask 让它判断是否真需要 MCP。只有 locator 不确定、DOM 不知道、页面行为必须观察时，才开 Playwright MCP。

---

### 工作流 3：处理 documents / report

建议分两层：

**第一层：Haiku / 便宜模型做 extraction**

```text
Extract only:
- key facts
- dates
- numbers
- risks
- action items
Do not rewrite. Do not add assumptions.
```

**第二层：GPT-5.5 / Sonnet 4.6 做 final report**

```text
Using the extracted facts below, create a professional report.
Structure:
1. Executive summary
2. Current status
3. Issues
4. Recommendations
5. Next actions
Do not invent missing data.
```

这样比直接把整份文档丢给强模型省很多。

如果 report 涉及表格、PDF、截图、复杂格式，优先用 Sonnet 4.6 或 GPT-5.5。Sonnet 4.6 官方强调 enterprise documents、charts、PDFs、tables 的 document comprehension 工作负载；GPT-5.5 官方也强调 documents、spreadsheets、软件操作和跨工具任务。([Anthropic][5])

---

### 工作流 4：Email

Email 不要浪费强模型。用小模型即可。

模板：

```text
Write a concise professional email.

Context:
...

Tone:
Polite, clear, not too formal.

Must include:
- ...
- ...
- ...

Length:
Under 120 words.
```

如果是重要邮件，例如给 manager、HR、client、VP，可以这样：

1. Haiku/GPT-4 写第一版
2. GPT-5/Sonnet 审核语气和风险
3. 小模型生成最终短版

---

## 4. 模型选择建议：按你的实际情况

### Claude Sonnet 4.6

**你的主力 Agent 模型。**

适合：

- Playwright MCP 操作网页
- 读代码库
- 修改多文件
- 生成 Cucumber step definitions
- 修 flaky tests
- Angular / frontend 页面相关
- 长文档、复杂 report
- 需要“计划 + 执行 + 修复”的任务

Sonnet 4.6 官方说它是 Sonnet 里更强版本，升级了 coding、computer use、long-context reasoning、agent planning、knowledge work、design，并且在 Claude Code 用户测试中相对 Sonnet 4.5 有明显偏好。([Anthropic][5])

**我的建议：只要你要开 Agent + Playwright MCP，优先 Sonnet 4.6。**

---

### Claude Sonnet 4.5

**如果没有 4.6，再用 4.5。**

适合：

- coding
- test generation
- code review
- frontend
- report 结构化

但如果你同时有 4.6，就没有太大理由优先用 4.5。4.6 是 4.5 的升级版，官方也说价格保持相同起点。([Anthropic][5])

---

### Claude Haiku

**便宜快速工具人。**

适合：

- email 草稿
- 文档初步摘要
- 从 report 里提取 action items
- test case 分类
- 从 feature 里提取 step list
- 给 Cucumber scenario 改英文
- 生成 PR summary
- 简单 TypeScript 语法问题

不适合：

- 复杂 flaky test
- 多文件 refactor
- MCP 自动操作网页
- 大型 report 最终版
- 需要深度判断的 bug

Haiku 4.5 在 Anthropic 官方模型表里是 fastest model with near-frontier intelligence，价格低于 Sonnet，context 是 200k。([Claude Platform][1])

---

### GPT-5 / GPT-5.5

**适合复杂 reasoning、文档、策略、debug。**

适合：

- 自动化测试策略
- 分析为什么 flaky
- 比较几种 locator/wait 策略
- report 逻辑重组
- 多步骤办公任务
- 难一点的代码 review
- 让它做“第二意见”

GPT-5.5 官方强调它能处理 messy multi-part task，并且适合 writing/debugging code、research、documents/spreadsheets、operating software、跨工具完成任务。([OpenAI][2])

**我的建议：GPT-5.5 更适合当 reviewer / planner / finalizer。Sonnet 4.6 更适合当 coding agent。**

---

### GPT-5-Codex

**如果你能用，就专门给 coding agent。**

适合：

- 自动修改代码
- repo 内搜索
- 多文件改动
- 自动生成测试
- 修 test failure
- codebase-level refactor

OpenAI 官方说明 GPT-5-Codex 是 GPT-5 的一个版本，optimized for agentic coding tasks in Codex or similar environments。([OpenAI开发者][4])

**我的建议：如果你的环境支持 GPT-5-Codex + 文件编辑 + test runner，就用它处理纯代码任务；如果要浏览器操作和 web app UI 观察，Sonnet 4.6 + Playwright MCP 也很强。**

---

### GPT-4 / GPT-4o

**现在更像日常轻量模型。**

适合：

- email
- translation
- simple explanation
- small code snippet
- meeting message
- report wording polish

不建议用来：

- 大型 Agent
- 长上下文代码库
- 复杂 flaky tests
- 多文件自动改动

如果 GPT-5/5.5/Sonnet 4.6 都可用，GPT-4 主要就是“便宜、快、够用”的角色。

---

## 5. 一个简单的决策树

你可以这样选：

```text
只是问问题 / 写邮件 / 改英文？
→ Haiku or GPT-4

要理解复杂需求，但不改文件？
→ GPT-5.5 or Sonnet 4.6 Plan mode

要改 Playwright/Cucumber/TypeScript 文件？
→ Sonnet 4.6 or GPT-5-Codex Agent mode

要用 Playwright MCP 打开网页找 locator？
→ Sonnet 4.6 Agent mode

要总结长文档？
→ Haiku 先提取，Sonnet 4.6 / GPT-5.5 最终整理

要修一个非常烦的 flaky test？
→ GPT-5.5 先分析原因，Sonnet 4.6/GPT-5-Codex 执行修改
```

---

## 6. 最推荐你的默认配置

### 日常默认

| 默认任务                    | 模型                      |
| --------------------------- | ------------------------- |
| 邮件 / 翻译 / 小改动        | Haiku 或 GPT-4            |
| 文档初筛                    | Haiku                     |
| 文档最终版                  | GPT-5.5 或 Sonnet 4.6     |
| Playwright 问题分析         | GPT-5.5 或 Sonnet 4.6     |
| Playwright MCP + 自动修代码 | Sonnet 4.6                |
| 纯代码 Agent                | GPT-5-Codex 或 Sonnet 4.6 |
| 最终 review                 | GPT-5.5                   |

---

## 7. 最重要的一条：给 Agent 的上下文要“窄而准”

你不要说：

```text
Please check my automation tests and fix issues.
```

要说：

```text
Fix only the Cucumber scenario tagged @alert-grid.
The app uses Angular and ag-grid.
Use div.ag-grid as the grid root.
Use div.ag-grid div.ag-cell for cell lookup.
Avoid waitForTimeout.
Run only this test tag.
Stop after 2 fix attempts and summarize.
```

这会明显省 token，也能减少 Agent 乱改代码。

[1]: https://platform.claude.com/docs/en/about-claude/models/overview "Models overview - Claude API Docs"
[2]: https://openai.com/index/introducing-gpt-5-5/ "Introducing GPT-5.5 | OpenAI"
[3]: https://developers.openai.com/api/docs/models/gpt-5 "GPT-5 Model | OpenAI API"
[4]: https://developers.openai.com/api/docs/models/gpt-5-codex "GPT-5-Codex Model | OpenAI API"
[5]: https://www.anthropic.com/news/claude-sonnet-4-6 "Introducing Sonnet 4.6 \\ Anthropic"
