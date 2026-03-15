import JSZip from 'jszip';
import { saveAs } from 'file-saver';

export const exportAgentAsAth = async (agent: any) => {
  const zip = new JSZip();

  // 📄 manifest.json
  const manifest = {
    name: agent.name,
    version: '1.0.0',
    aetherId: agent.aetherId,
    pwa: { themeColor: '#050B14', icon: 'icon.png' }
  };
  zip.file('manifest.json', JSON.stringify(manifest, null, 2));

  // 🧠 /core
  const core = {
    systemPrompt: agent.systemPrompt,
    persona: agent.role,
    soul: agent.soul,
    rules: agent.rules
  };
  zip.folder('core')?.file('soul.json', JSON.stringify(core, null, 2));

  // 🛠️ /skills
  zip.folder('skills')?.file('tools.json', JSON.stringify(agent.tools || {}, null, 2));

  // 📚 /memory
  zip.folder('memory')?.file('firestore_ref.json', JSON.stringify({ collection: 'agents', id: agent.id }, null, 2));

  // 🛡️ /sandbox
  zip.folder('sandbox')?.file('permissions.json', JSON.stringify({ permissions: ['camera', 'microphone'] }, null, 2));

  const content = await zip.generateAsync({ type: 'blob' });
  saveAs(content, `${agent.name.replace(/\s+/g, '_')}.ath`);
};

export const importAgentFromAth = async (file: File): Promise<any> => {
  const zip = new JSZip();
  const content = await zip.loadAsync(file);
  
  // 📄 manifest.json
  const manifestRaw = await content.file('manifest.json')?.async('string');
  const manifest = manifestRaw ? JSON.parse(manifestRaw) : {};

  // 🧠 /core
  const coreRaw = await content.file('core/soul.json')?.async('string');
  const core = coreRaw ? JSON.parse(coreRaw) : {};

  // 🛠️ /skills
  const skillsRaw = await content.file('skills/tools.json')?.async('string');
  const skills = skillsRaw ? JSON.parse(skillsRaw) : {};

  // 📚 /memory
  const memoryRaw = await content.file('memory/firestore_ref.json')?.async('string');
  const memory = memoryRaw ? JSON.parse(memoryRaw) : {};

  return {
    id: memory.id || `ingested_${Date.now()}`,
    aetherId: manifest.aetherId,
    name: manifest.name,
    role: core.persona,
    systemPrompt: core.systemPrompt,
    soul: core.soul,
    rules: core.rules,
    tools: skills,
    imported: true
  };
};
