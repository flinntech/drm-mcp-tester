# GEMINI.md

This file provides context for working with the `drm-mcp-tester` project.

## Directory Overview

This is a non-code project directory containing a comprehensive test plan and specification for the **DRM MCP Tester**. The goal is to systematically test a Digi Remote Manager (DRM) Model Context Protocol (MCP) Server.

The directory does not contain any implementation code. Instead, it provides the complete blueprint for building an automated test suite.

## Key Files

*   `drm-mcp-test-plan.md`: This is the core document, detailing over 150 test cases for more than 50 server tools across 13 distinct categories. It includes requirements for the test environment, sample data fixtures, and the expected outcome for each test case.

*   `CLAUDE.md`: This file acts as a high-level summary and a set of working instructions. It outlines the project's purpose, recommended test framework structure, important DRM query syntax rules, and the phased approach for test execution (Smoke, Happy Path, etc.).

## Usage

The contents of this directory are intended to guide the development of an automated test suite for the DRM MCP Server.

### Test Framework

The documentation recommends using **Vitest or Jest** for implementation. A suggested file and directory structure for the tests is provided in both documents.

### Development Conventions

When implementing tests that involve queries, adhere to the **DRM Query Syntax Rules** outlined in `CLAUDE.md`:

*   Use **single quotes** for values (e.g., `query: "connection_status='connected'"`).
*   The `=` operator is used for equality; there is no `equals` operator.
*   Supported operators include `=`, `contains`, `startswith`, `>`, `<`.
*   Boolean logic uses `and` and `or`.
