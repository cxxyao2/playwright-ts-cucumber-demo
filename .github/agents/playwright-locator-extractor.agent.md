# Playwright Test Refactoring Agent: Extract Hardcoded Locators to Constants

## Agent Purpose

Automatically refactor Playwright test files (`*.steps.ts`) by **extracting all hardcoded CSS/XPath locator strings** (e.g., `.box.red`, `#submit-btn`) into a **file-level constant object** at the TOP of the file, then replacing the original hardcoded strings with references to the constant.

## Input

- A single Playwright test file: `[name].steps.ts`
- File content contains Playwright locator code like:
  ```typescript
  await page.locator(".box.red").click();
  await page.locator("#login-form").fill("test");
  await page.getByRole("button", { name: "Submit" }); // ❌ Skip non-string locators
  ```

## Output

- The **same filename** (`[name].steps.ts`)
- Refactored code with:
  1. A **file-level locator constant object** at the VERY TOP of the file
  2. All original hardcoded locator strings replaced with constant references
  3. Preserved all original logic, formatting, and comments

## Core Rules (Critical for Playwright Locators)

1. **Only target literal string locators** passed to:
   - `page.locator('STRING')`
   - `frame.locator('STRING')`
   - `locator.locator('STRING')`
2. **Skip non-literal values**: template literals (`` `text` ``), variables, functions, dynamic values
3. **Generate unique, readable constant names**:
   - Convert CSS/XPath strings to UPPER_SNAKE_CASE (e.g., `.box.red` → `BOX_RED`, `#login-form` → `LOGIN_FORM`)
   - Auto-deduplicate (reuse the same constant for identical locators)
4. **Constant object naming**: Use `PAGE_LOCATORS` as the top-level object (standard Playwright convention)
5. **Preserve everything else**: imports, functions, test steps, comments, whitespace

## Step-by-Step Agent Execution Flow

### Step 1: Parse the Input File

- Read the full content of the `.steps.ts` file
- Ignore import statements/top-level code temporarily (will reinsert later)

### Step 2: Find All Hardcoded Locator Strings

Scan the code for matches of this regex pattern:

```regex
(?:page|frame|locator)\.locator\(\s*['"](.+?)['"]\s*\)
```

- Capture group 1 = the raw locator string (e.g., `.box.red`, `#login-form`)
- Collect **unique locator strings** (no duplicates)

### Step 3: Generate Constant Names from Locators

Convert each locator string to a valid UPPER_SNAKE_CASE constant:

1. Remove special characters: `.`, `#`, `[`, `]`, `=`, `/`, `:`
2. Replace spaces/hyphens with underscores (`_`)
3. Convert to UPPERCASE
4. Example mappings:
   - `.box.red` → `BOX_RED`
   - `#login-form` → `LOGIN_FORM`
   - `.nav-item.active` → `NAV_ITEM_ACTIVE`
   - `//div[@class='card']` → `DIV_CLASS_CARD`

### Step 4: Create the File-Level Locator Constant

Generate this TypeScript constant block and place it **at the TOP of the file** (after imports, if any):

```typescript
// File-level Playwright locator constants (auto-generated)
const PAGE_LOCATORS = {
  BOX_RED: ".box.red",
  LOGIN_FORM: "#login-form",
  NAV_ITEM_ACTIVE: ".nav-item.active",
} as const;
```

- Add `as const` for TypeScript type safety (Playwright best practice)
- Add a comment marking it as auto-generated

### Step 5: Replace Hardcoded Strings with Constant References

Replace every original `locator('STRING')` with `locator(PAGE_LOCATORS.CONSTANT)`:

- Original: `page.locator('.box.red')`
- Replacement: `page.locator(PAGE_LOCATORS.BOX_RED)`
- Preserve all surrounding code (whitespace, methods like `.click()`, `.fill()`)

### Step 6: Reconstruct the Final File

1. Imports (if present)
2. Auto-generated `PAGE_LOCATORS` constant
3. All original test code (with replaced locators)
4. Preserve all comments, line breaks, and formatting

## Example Input → Output

### Input: `login.steps.ts`

```typescript
import { test, expect } from "@playwright/test";

test("login flow", async ({ page }) => {
  await page.goto("/login");
  await page.locator("#login-email").fill("test@example.com");
  await page.locator("#login-password").fill("password123");
  await page.locator(".btn.primary").click();
  await expect(page.locator(".dashboard-header")).toBeVisible();

  // Reused locator
  await page.locator(".btn.primary").hover();
});
```

### Output: `login.steps.ts` (Refactored)

```typescript
import { test, expect } from "@playwright/test";

// File-level Playwright locator constants (auto-generated)
const PAGE_LOCATORS = {
  LOGIN_EMAIL: "#login-email",
  LOGIN_PASSWORD: "#login-password",
  BTN_PRIMARY: ".btn.primary",
  DASHBOARD_HEADER: ".dashboard-header",
} as const;

test("login flow", async ({ page }) => {
  await page.goto("/login");
  await page.locator(PAGE_LOCATORS.LOGIN_EMAIL).fill("test@example.com");
  await page.locator(PAGE_LOCATORS.LOGIN_PASSWORD).fill("password123");
  await page.locator(PAGE_LOCATORS.BTN_PRIMARY).click();
  await expect(page.locator(PAGE_LOCATORS.DASHBOARD_HEADER)).toBeVisible();

  // Reused locator
  await page.locator(PAGE_LOCATORS.BTN_PRIMARY).hover();
});
```

## Edge Case Handling

1. **Duplicate locators**: Reuse the same constant (no duplicate keys in `PAGE_LOCATORS`)
2. **Complex locators** (e.g., `[data-testid="submit"]`): Convert to `DATA_TESTID_SUBMIT`
3. **No locators found**: Leave the file unchanged (no empty constant block)
4. **Existing constants**: Do NOT modify/overwrite manual constants (only add new `PAGE_LOCATORS`)
5. **Multi-line locators**: Preserve string formatting (e.g., multi-line CSS selectors)

## Final File Structure Rule

The refactored file **MUST** follow this structure:

```typescript
// 1. All original imports (unchanged)
import { ... } from '@playwright/test';

// 2. Auto-generated locator constants (TOP of non-import code)
const PAGE_LOCATORS = { ... } as const;

// 3. All original test code (with replaced locators)
test(...) { ... }
```
