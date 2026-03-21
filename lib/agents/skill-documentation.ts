/**
 * 📚 Skill Documentation Generator
 * 
 * Generates comprehensive documentation for skills including setup instructions,
 * usage examples, troubleshooting guides, and API references.
 */

import { SkillDefinition } from './skill-types';
import { skillRegistry } from './skill-registry';

/**
 * Complete skill documentation structure
 */
export interface SkillDocumentation {
  /** Overview of the skill */
  overview: string;
  /** Step-by-step setup instructions */
  setupInstructions: string[];
  /** Practical usage examples */
  usageExamples: string[];
  /** Common issues and solutions */
  troubleshooting: Array<{ issue: string; solution: string }>;
  /** API reference links if available */
  apiReference?: string;
  /** Related skills */
  relatedSkills: string[];
}

/**
 * Generate comprehensive documentation for a skill
 */
export function generateSkillDocumentation(skill: SkillDefinition): SkillDocumentation {
  // Generate overview
  const overview = `${skill.name} - ${skill.description} This skill provides ${skill.capabilities.length} key capabilities including ${skill.capabilities.slice(0, 3).map(cap => formatCapabilityName(cap)).join(', ')}${skill.capabilities.length > 3 ? ', and more' : ''}.`;
  
  // Generate setup instructions
  const setupInstructions = generateSetupInstructions(skill);
  
  // Generate usage examples
  const usageExamples = generateUsageExamples(skill);
  
  // Generate troubleshooting guide
  const troubleshooting = generateTroubleshooting(skill);
  
  // Get related skills (same category)
  const relatedSkills = getRelatedSkills(skill);
  
  return {
    overview,
    setupInstructions,
    usageExamples,
    troubleshooting,
    apiReference: skill.metadata.documentationUrl,
    relatedSkills
  };
}

/**
 * Generate step-by-step setup instructions
 */
function generateSetupInstructions(skill: SkillDefinition): string[] {
  const instructions: string[] = [];
  
  // Step 1: Enable skill
  instructions.push(`1. Enable ${skill.name} in your agent configuration by toggling it in the skills selection interface`);
  
  // Step 2: API Keys
  if (skill.requirements.apiKeys && skill.requirements.apiKeys.length > 0) {
    const keysList = skill.requirements.apiKeys.join('`, `');
    instructions.push(`2. Configure required API keys: Navigate to your dashboard and add the following API keys: \`${keysList}\``);
    
    instructions.push(`   - Visit the provider's developer console to obtain your API keys`);
    instructions.push(`   - Ensure your API keys have the necessary permissions enabled`);
  } else {
    instructions.push(`2. No API keys required - ${skill.name} is ready to use!`);
  }
  
  // Step 3: OAuth
  if (skill.requirements.oauthScopes && skill.requirements.oauthScopes.length > 0) {
    instructions.push(`3. Grant OAuth permissions: Authorize the following scopes:`);
    skill.requirements.oauthScopes.forEach((scope, index) => {
      instructions.push(`   ${index + 1}. ${scope}`);
    });
    instructions.push(`   - Click "Authorize" to grant access`);
    instructions.push(`   - Complete the OAuth flow in your browser`);
  }
  
  // Step 4: Dependencies
  if (skill.dependencies && skill.dependencies.length > 0) {
    const depNames = skill.dependencies.map(depId => {
      const dep = skillRegistry.get(depId);
      return dep?.name || depId;
    });
    instructions.push(`${instructions.length + 1}. Ensure dependencies are enabled: ${skill.name} requires ${depNames.join(' and ')}`);
  }
  
  // Step 5: Test
  instructions.push(`${instructions.length + 1}. Test the integration: Use one of ${skill.name}'s capabilities to verify everything is working correctly`);
  
  return instructions;
}

/**
 * Generate practical usage examples
 */
function generateUsageExamples(skill: SkillDefinition): string[] {
  const examples: string[] = [];
  
  // Generate examples based on capabilities
  skill.capabilities.slice(0, 5).forEach(capability => {
    const example = generateExampleForCapability(skill, capability);
    if (example) {
      examples.push(example);
    }
  });
  
  return examples;
}

/**
 * Generate a specific example for a capability
 */
function generateExampleForCapability(skill: SkillDefinition, capability: string): string {
  const capName = formatCapabilityName(capability);
  
  const exampleTemplates: Record<string, string> = {
    send_email: `• "${capName}: Send an email to john@example.com with the subject 'Meeting Tomorrow' and body 'Let's meet at 3 PM'"`,
    read_emails: `• "${capName}: Show me my unread emails from today"`,
    create_events: `• "${capName}: Schedule a team meeting for next Monday at 2 PM for 1 hour"`,
    upload_files: `• "${capName}: Upload this document to my Drive folder 'Projects'"`,
    search_files: `• "${capName}: Find all PDF files related to 'budget' in my Drive"`,
    create_documents: `• "${capName}: Create a new document titled 'Project Proposal' with an introduction section"`,
    create_spreadsheets: `• "${capName}: Create a spreadsheet to track monthly expenses with columns for date, amount, and category"`,
    get_directions: `• "${capName}: What's the fastest route from New York to Boston right now?"`,
    translate_text: `• "${capName}: Translate 'Hello, how are you?' to Spanish"`,
    statistical_analysis: `• "${capName}: Analyze this dataset and show me the correlation between sales and advertising spend"`,
    web_search: `• "${capName}: Find recent news about artificial intelligence breakthroughs in healthcare"`,
    code_generation: `• "${capName}: Write a Python function that calculates fibonacci numbers recursively"`
  };
  
  // Check if we have a template for this capability
  if (exampleTemplates[capability]) {
    return exampleTemplates[capability];
  }
  
  // Generic template
  return `• "${capName}: [Describe what you want to accomplish with ${skill.name}]"`;
}

/**
 * Generate troubleshooting guide
 */
function generateTroubleshooting(skill: SkillDefinition): Array<{ issue: string; solution: string }> {
  const issues: Array<{ issue: string; solution: string }> = [];
  
  // Common issues
  if (skill.requirements.apiKeys && skill.requirements.apiKeys.length > 0) {
    issues.push({
      issue: 'Authentication failed or invalid API key',
      solution: 'Verify that your API key is correct and hasn\'t expired. Check that the API key has the necessary permissions enabled in the provider\'s console.'
    });
  }
  
  if (skill.requirements.oauthScopes && skill.requirements.oauthScopes.length > 0) {
    issues.push({
      issue: 'Permission denied or insufficient OAuth scopes',
      solution: 'Re-authorize the application and ensure all required OAuth scopes are granted. You may need to revoke and re-grant permissions.'
    });
  }
  
  // Rate limiting
  issues.push({
    issue: 'Rate limit exceeded',
    solution: 'Implement exponential backoff for retries. Consider upgrading your API plan for higher rate limits if you frequently hit this issue.'
  });
  
  // Network issues
  issues.push({
    issue: 'Network connectivity errors',
    solution: 'Check your internet connection. Verify that firewalls aren\'t blocking the API endpoints. Try again in a few moments.'
  });
  
  // Dependency issues
  if (skill.dependencies && skill.dependencies.length > 0) {
    issues.push({
      issue: 'Dependency skill not enabled',
      solution: `Ensure all required dependencies (${skill.dependencies.map(depId => skillRegistry.get(depId)?.name || depId).join(', ')}) are enabled before using this skill.`
    });
  }
  
  return issues;
}

/**
 * Get related skills in the same category
 */
function getRelatedSkills(skill: SkillDefinition): string[] {
  const allSkills = skillRegistry.getAll();
  const relatedSkills = allSkills
    .filter(s => s.category === skill.category && s.id !== skill.id)
    .slice(0, 3)
    .map(s => s.name);
  
  return relatedSkills;
}

/**
 * Format capability name for display
 */
function formatCapabilityName(capability: string): string {
  return capability
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Generate documentation for all enabled skills
 */
export function generateAllSkillsDocumentation(enabledSkills: Record<string, boolean>): Record<string, SkillDocumentation> {
  const docs: Record<string, SkillDocumentation> = {};
  
  Object.entries(enabledSkills)
    .filter(([, enabled]) => enabled)
    .forEach(([skillId]) => {
      const skill = skillRegistry.get(skillId);
      if (skill) {
        docs[skillId] = generateSkillDocumentation(skill);
      }
    });
  
  return docs;
}

/**
 * Export documentation as markdown
 */
export function exportDocumentationAsMarkdown(skill: SkillDefinition): string {
  const doc = generateSkillDocumentation(skill);
  
  let markdown = `# ${skill.name}\n\n`;
  markdown += `## Overview\n\n${doc.overview}\n\n`;
  
  markdown += `## Setup Instructions\n\n`;
  doc.setupInstructions.forEach(instruction => {
    markdown += `${instruction}\n`;
  });
  markdown += '\n';
  
  markdown += `## Usage Examples\n\n`;
  doc.usageExamples.forEach(example => {
    markdown += `${example}\n`;
  });
  markdown += '\n';
  
  markdown += `## Troubleshooting\n\n`;
  doc.troubleshooting.forEach(({ issue, solution }) => {
    markdown += `### ${issue}\n\n${solution}\n\n`;
  });
  
  if (doc.relatedSkills.length > 0) {
    markdown += `\n## Related Skills\n\n`;
    doc.relatedSkills.forEach(name => {
      markdown += `- ${name}\n`;
    });
  }
  
  if (doc.apiReference) {
    markdown += `\n## API Reference\n\n[${doc.apiReference}](${doc.apiReference})\n`;
  }
  
  return markdown;
}
