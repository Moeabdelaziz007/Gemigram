import test from 'node:test';
import assert from 'node:assert';
import { renderToString } from 'react-dom/server';
import React from 'react';

// Make React globally available to components that don't import it
(global as any).React = React;

import NeuralPulse from '../../components/NeuralPulse';

test('NeuralPulse component', async (t) => {
  await t.test('renders without crashing', () => {
    const html = renderToString(<NeuralPulse />);
    assert.ok(html, 'Component should render successfully');
  });

  await t.test('renders the component title', () => {
    const html = renderToString(<NeuralPulse />);
    assert.ok(html.includes('Neural Pulse'), 'Should render "Neural Pulse" title');
  });

  await t.test('renders all heartbeat agents', () => {
    const html = renderToString(<NeuralPulse />);

    // Check for all agents defined in the component
    const expectedAgents = ['Atlas', 'System', 'Nova', 'Sovereign', 'Orion'];
    for (const agent of expectedAgents) {
      assert.ok(html.includes(agent), `Should render agent: ${agent}`);
    }
  });

  await t.test('renders expected actions and times', () => {
    const html = renderToString(<NeuralPulse />);

    // Check for a sample of actions and times
    assert.ok(html.includes('Neural Sync Complete'), 'Should render Atlas action');
    assert.ok(html.includes('just now'), 'Should render Atlas time');

    assert.ok(html.includes('Protocol V2.0 Active'), 'Should render Sovereign action');
    assert.ok(html.includes('12m ago'), 'Should render Sovereign time');
  });

  await t.test('applies key CSS classes for styling', () => {
    const html = renderToString(<NeuralPulse />);

    assert.ok(html.includes('glass-medium'), 'Should include glass-medium class for background');
    assert.ok(html.includes('gemigram-neon'), 'Should include gemigram-neon class for text/styling');
    assert.ok(html.includes('aether-carbon'), 'Should include aether-carbon class for heartbeat rows');
  });

  await t.test('renders icons and motion container', () => {
    const html = renderToString(<NeuralPulse />);

    // Lucide icons are rendered as SVGs
    assert.ok(html.includes('<svg'), 'Should render at least one SVG icon');
    assert.ok(html.includes('lucide'), 'Should render lucide icons');
  });
});
