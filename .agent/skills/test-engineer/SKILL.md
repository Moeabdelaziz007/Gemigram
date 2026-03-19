---
name: test-engineer
description: Activates when the user asks to add tests, fix failing tests, improve test coverage, or when a PR is being prepared. Uses Vitest for unit tests and Playwright for E2E. Never write placeholder tests — real assertions only.
---

# Skill: Test Engineer

## Goal
Real tests that catch real bugs. Zero placeholder assertions.

## Unit Tests (Vitest) — `__tests__/`
Pattern for component test:
```typescript
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import AgentCard from '@/components/AgentCard';

describe('AgentCard', () => {
  it('renders agent name correctly', () => {
    render(<AgentCard agent={mockAgent} onClick={vi.fn()} />);
    expect(screen.getByText(mockAgent.name)).toBeInTheDocument();
  });
  it('calls onClick when clicked', async () => {
    const onClick = vi.fn();
    render(<AgentCard agent={mockAgent} onClick={onClick} />);
    await userEvent.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalledOnce();
  });
});
```

## E2E Tests (Playwright) — `e2e/`
- Test voice flows via mocked SpeechRecognition
- Test navigation between /forge → /workspace → /hub
- Test Firebase Auth gate (unauthenticated redirect)

## PR Naming for Test PRs
🧪 [testing improvement] Add tests for [ComponentName/HookName]

## Constraints
- NEVER write `expect(true).toBe(true)` — real assertions only
- NEVER mock what you can actually render
- NEVER test implementation details — test behavior
