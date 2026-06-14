这是一个很多人刚开始用 AI Agent 时都会混淆的问题。

简单来说：

| 文件         | 回答的问题                | 类比         |
| ------------ | ------------------------- | ------------ |
| **agent.md** | AI 应该如何工作？         | 员工手册     |
| **SKILL.md** | AI 如何完成某类专业任务？ | 专业培训教材 |

---

# 1. agent.md 是什么

agent.md 是：

> **项目级(Project Level)行为规范**

告诉 Agent：

- 这个项目是什么
- 应该遵守什么规则
- 使用什么技术栈
- 修改代码时有什么限制
- 测试应该怎么运行

例如：

```text
This repository contains:

- Angular 18
- Playwright
- Cucumber
- TypeScript

Rules:

- Use Page Object Model
- Do not use waitForTimeout
- Prefer expect.poll
- Reuse existing services
- Follow existing naming conventions
```

Agent 每次工作都会看。

所以：

```text
agent.md
```

更像：

```text
你来到这家公司工作
需要遵守什么规定
```

---

# 2. SKILL.md 是什么

SKILL.md 是：

> 某个领域的专业知识

例如：

```text
Playwright Skill
```

告诉 AI：

```text
如何写高质量 Playwright 代码
```

或者：

```text
Angular Skill
```

告诉 AI：

```text
如何写高质量 Angular 代码
```

或者：

```text
ag-grid Skill
```

告诉 AI：

```text
如何操作 ag-grid
```

---

# 3. 两者最大的区别

agent.md：

```text
WHEN
```

SKILL.md：

```text
HOW
```

举例：

Agent 收到：

```gherkin
Get Alert ID from Grid
```

Agent.md 负责：

```text
看到 Grid 时
需要使用 Playwright

使用 Page Object

禁止 waitForTimeout
```

SKILL.md 负责：

```text
如何定位 Grid

如何处理 Virtual Scroll

如何等待数据加载

如何读取 Cell
```

---

# 4. Playwright 项目的典型结构

我一般推荐：

```text
.ai/
│
├── agent.md
│
├── skills/
│
│   ├── playwright-skill.md
│   ├── cucumber-skill.md
│   ├── angular-skill.md
│   ├── ag-grid-skill.md
│   └── api-testing-skill.md
```

---

# 5. 你的项目中的 agent.md

结合你之前说的：

- Angular
- Playwright
- Cucumber
- Typescript
- ag-grid

你的 agent.md 应该关注：

## 项目描述

```md
# Project Overview

This repository contains:

- Angular web application
- Playwright E2E tests
- Cucumber BDD tests
- TypeScript
```

---

## Coding Rules

```md
# Coding Rules

- Reuse existing Page Objects
- Reuse existing Services
- Prefer composition over duplication
- Avoid hard-coded waits
```

---

## Test Rules

```md
# Playwright Rules

- Never use waitForTimeout
- Prefer expect.poll
- Prefer API waits
- Use stable locators
```

---

## Grid Rules

```md
# Grid Rules

Most pages contain:

div.ag-grid

Cells:

div.ag-grid div.ag-cell
```

---

## Input Specification

这里就是你之前想到的东西：

```md
# Input File

Default:

/specs/SPEC.md

If user provides:

--input xxx.md

use that file instead.
```

---

# 6. Playwright Skill.md 应该写什么

这里不是项目规则。

而是：

```text
Playwright最佳实践
```

例如：

```md
# Locator Priority

1. getByRole
2. getByLabel
3. getByText
4. CSS locator

Avoid XPath
```

---

```md
# Waiting Strategy

Preferred:

expect(locator).toBeVisible()

expect.poll()

waitForResponse()

Avoid:

waitForTimeout()
```

---

```md
# Page Object Pattern

Good

LoginPage.login()

Bad

page.locator(...)
page.locator(...)
page.locator(...)
```

---

# 7. ag-grid Skill.md

这是我认为对你最有价值的。

因为 Agent 通常不懂你们项目的 Grid。

---

例如：

```md
# ag-grid Recognition

Grid Root:

div.ag-grid
```

---

```md
# Cell Locator

div.ag-grid div.ag-cell
```

---

```md
# Column Lookup

If specification says:

Alert Column

Search:

div.ag-grid div.ag-cell

containing text:

Alert
```

---

```md
# Waiting

Before reading rows:

await expect.poll(...)
```

---

```md
# Virtualization

ag-grid may render only visible rows.

Never assume:

rows.count()

equals total records.
```

这类内容放 Skill 非常合适。

---

# 8. 一个实际例子

假设 Feature：

```gherkin
Scenario:
Get Alert ID
```

Agent 读取：

```text
agent.md
```

知道：

```text
Angular
Playwright
Cucumber

必须用 Page Object
不能 waitForTimeout
```

---

然后调用：

```text
ag-grid-skill.md
```

知道：

```text
Grid Root

div.ag-grid

Cell

div.ag-cell

Virtual Scroll

expect.poll
```

---

最后生成：

```ts
const grid = page.locator("div.ag-grid");

await expect
  .poll(async () => await grid.locator("div.ag-cell").count())
  .toBeGreaterThan(0);
```

---

# 9. 我给你的建议

对于你的项目：

## agent.md

保持小

控制在：

```text
200~500 行
```

内容：

- 项目介绍
- 技术栈
- 目录结构
- Coding Rules
- Testing Rules
- Input File Rules

不要放太多 Playwright 技巧。

---

## Skill.md

可以很多个

例如：

```text
playwright-skill.md
cucumber-skill.md
angular-skill.md
ag-grid-skill.md
api-testing-skill.md
```

每个：

```text
100~300 行
```

专门解决一个领域的问题。

---

一句话总结：

**agent.md 决定 Agent 应该做什么（What + Rules）；SKILL.md 决定 Agent 应该怎么做（How + Best Practices）。**

对于你的 Playwright + Cucumber + Angular 项目，最值得投入时间写的其实不是 Playwright Skill，而是 **ag-grid-skill.md**，因为这是你们项目特有的知识，公开模型通常并不知道。
