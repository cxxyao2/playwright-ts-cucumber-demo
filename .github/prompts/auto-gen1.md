I have a Playwright + Cucumber.js automation project.

Please do not ask me to hand-write code. Generate or update all required files.

Use Playwright MCP server to inspect the Order website.

Goal:
Run French Gherkin feature files in VS Code, execute them with Cucumber.js + Playwright, and generate an HTML report using multiple-cucumber-html-reporter.

Requirements:

1. Feature files are in French Gherkin.
2. Each French feature file must start with:

   # language: fr

3. Use Cucumber.js as the runner.
4. Use Playwright for browser automation.
5. Use Playwright MCP to inspect the website and discover stable selectors.
6. Generate Cucumber JSON output under:
   reports/cucumber-json/

7. Generate HTML report under:
   reports/cucumber-html/

8. Use multiple-cucumber-html-reporter to generate the HTML report.

9. Add npm scripts:
   - test:e2e
   - report
   - test:e2e:report

10. For the Order product grid:
    - The page may contain multiple grids.
    - The products grid should be resolved through gridRegistry.
    - "la 11ème ligne" means ag-row[rowId="11"].
    - Do not use .nth(10).

Please create or update:

- package.json
- cucumber.js
- features/order-products.feature
- src/support/world.ts
- src/support/hooks.ts
- src/steps/navigation.steps.ts
- src/steps/datagrid.steps.ts
- src/ui/datagrid.ts
- src/ui/gridResolver.ts
- src/pages/gridRegistry.ts
- scripts/generate-cucumber-report.ts

After generating the files, run:
npm run test:e2e:report

If execution fails, inspect the failure, use Playwright MCP to verify selectors, and update the code.
