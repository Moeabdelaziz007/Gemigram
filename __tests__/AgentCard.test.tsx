import test from 'node:test';
import assert from 'node:assert';
import { JSDOM } from 'jsdom';
import React from 'react';

// Setup JSDOM globally
const dom = new JSDOM('<!DOCTYPE html><html><body><div id="root"></div></body></html>', {
  url: 'http://localhost'
});
global.window = dom.window as any;
global.document = dom.window.document;
global.navigator = dom.window.navigator;
global.HTMLElement = dom.window.HTMLElement;

// FIX React is not defined: Add React to global object
global.React = React;

import { render, fireEvent, cleanup } from '@testing-library/react';
import { AgentCard } from '../components/ui/AgentCard';

test('AgentCard component', async (t) => {
  t.afterEach(() => {
    cleanup();
  });

  await t.test('renders with default props', () => {
    const { getByText, container } = render(<AgentCard name="Nexus" status="sleeping" />);
    assert.ok(getByText('Nexus'));
    assert.ok(getByText('General Intelligence'));
    assert.ok(getByText('sleeping'));

    // Check color map (cyan gradient by default)
    const blurElement = container.querySelector('.bg-gradient-to-br');
    assert.ok(blurElement?.className.includes('from-cyan-500'));

    // Check status color map
    const statusDotElement = container.querySelector('.rounded-full.w-1\\.5.h-1\\.5');
    assert.ok(statusDotElement?.className.includes('bg-slate-500'));
  });

  await t.test('renders custom role and status', () => {
    const { getByText, container } = render(
      <AgentCard
        name="Atlas"
        status="working"
        role="Data Analyst"
        color="purple"
      />
    );
    assert.ok(getByText('Atlas'));
    assert.ok(getByText('Data Analyst'));
    assert.ok(getByText('working'));

    // Check custom color map
    const blurElement = container.querySelector('.bg-gradient-to-br');
    assert.ok(blurElement?.className.includes('from-purple-500'));

    // Check working status dot and pulse animation
    const statusDotElement = container.querySelector('.rounded-full.w-1\\.5.h-1\\.5');
    assert.ok(statusDotElement?.className.includes('bg-amber-500'));
    assert.ok(statusDotElement?.className.includes('animate-pulse'));

    // Verify waveform visualization is present since it's "working"
    const waveformContainer = container.querySelector('.absolute.-bottom-6');
    assert.ok(waveformContainer !== null);
  });

  await t.test('renders connected status with emerald color', () => {
    const { getByText, container } = render(
      <AgentCard
        name="Zephyr"
        status="connected"
        role="Network Operations"
        color="emerald"
      />
    );
    assert.ok(getByText('Zephyr'));
    assert.ok(getByText('Network Operations'));
    assert.ok(getByText('connected'));

    // Check custom color map
    const blurElement = container.querySelector('.bg-gradient-to-br');
    assert.ok(blurElement?.className.includes('from-emerald-500'));

    // Check connected status dot (no pulse)
    const statusDotElement = container.querySelector('.rounded-full.w-1\\.5.h-1\\.5');
    assert.ok(statusDotElement?.className.includes('bg-emerald-500'));
    assert.strictEqual(statusDotElement?.className.includes('animate-pulse'), false);

    // Verify waveform visualization is present since it's "connected"
    const waveformContainer = container.querySelector('.absolute.-bottom-6');
    assert.ok(waveformContainer !== null);
  });

  await t.test('calls onClick handler', () => {
    let clicked = false;
    const { container } = render(
      <AgentCard
        name="Nexus"
        status="sleeping"
        onClick={() => { clicked = true; }}
      />
    );

    const card = container.querySelector('.group');
    if (card) {
      fireEvent.click(card);
    }
    assert.strictEqual(clicked, true);
  });
});
