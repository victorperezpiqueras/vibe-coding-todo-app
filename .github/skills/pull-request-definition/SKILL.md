---
name: pull-request-definition
description: >
  Defines the required pull request structure and content for this repository.
  Trigger: When creating or updating pull request descriptions or templates.
license: Apache-2.0
metadata:
  version: "1.0.0"
  auto_invoke:
    - "Creating a pull request"
    - "Updating PR description"
---

## Required PR structure

Every pull request must include the following sections in this order:

1. **Description of changes**
   - Summarize what changed at a high level.

2. **Test suites**
   - List unit/component tests run.
   - List e2e tests run (if applicable).
   - If tests were not run, state why.

3. **Playwright screenshots**
   - Attach screenshots captured with Playwright.
   - List filenames or artifacts, and what they show.
   - If no UI changes, explicitly state "N/A".

4. **Breaking changes**
   - Describe any breaking changes.
   - If none, explicitly state "None".

## Usage

- Use the PR template in the references folder as the default structure.
- Keep content concise and actionable.
