import { GoogleGenAI } from '@google/genai';
import JSZip from 'jszip';

// NOTE: Using public API key for the demo client-side analyzer. 
// In a production production environment, this should be gated or use a proxy if sensitive.
// But for AetherOS Zero-Cost Static Export, we use direct browser-to-Gemini connection.
const ai = new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY || '' });

// Module-level cache for analysis results with size limit (LRU-like behavior)
const MAX_CACHE_SIZE = 20;
const analysisCache = new Map<string, any>();

function shouldIgnore(filename: string): boolean {
  const ignorePatterns = [
    'node_modules/', '.git/', 'dist/', 'build/', '.next/', 'coverage/',
    'package-lock.json', 'yarn.lock', 'pnpm-lock.yaml',
    '.png', '.jpg', '.jpeg', '.gif', '.svg', '.ico', '.webp',
    '.mp3', '.wav', '.ogg', '.mp4', '.webm',
    '.pdf', '.zip', '.tar', '.gz', '.ttf', '.woff', '.woff2', '.eot',
  ];
  return ignorePatterns.some(pattern => filename.includes(pattern));
}

export async function analyzeRepository(repoUrl: string) {
  try {
    const match = repoUrl.match(/github\.com\/([^/]+)\/([^/]+)/);
    if (!match) {
      throw new Error('Invalid GitHub URL');
    }
    const owner = match[1];
    const repo = match[2];

    let commitSha = '';
    try {
      const commitUrl = `https://api.github.com/repos/${owner}/${repo}/commits/main`;
      const commitRes = await fetch(commitUrl, { headers: { 'User-Agent': 'Aether-Voice-OS-Analyzer' } });
      if (commitRes.ok) {
        const commitData = await commitRes.json();
        commitSha = commitData.sha;
      } else {
        const commitUrlMaster = `https://api.github.com/repos/${owner}/${repo}/commits/master`;
        const commitResMaster = await fetch(commitUrlMaster, { headers: { 'User-Agent': 'Aether-Voice-OS-Analyzer' } });
        if (commitResMaster.ok) {
          const commitDataMaster = await commitResMaster.json();
          commitSha = commitDataMaster.sha;
        }
      }
    } catch (e) {
      console.warn('Failed to fetch commit sha for caching', e);
    }

    const cacheKey = `aether_repo_cache_${owner}_${repo}_${commitSha}`;

    if (commitSha && analysisCache.has(cacheKey)) {
      console.log(`[Cache Hit] Returning cached analysis for ${owner}/${repo} at ${commitSha}`);
      // Re-insert to maintain recent usage order
      const cached = analysisCache.get(cacheKey);
      analysisCache.delete(cacheKey);
      analysisCache.set(cacheKey, cached);
      return cached;
    }

    const zipUrl = `https://api.github.com/repos/${owner}/${repo}/zipball/main`;
    const response = await fetch(zipUrl, {
      headers: {
        'User-Agent': 'Aether-Voice-OS-Analyzer',
      },
    });

    let buffer: ArrayBuffer;
    if (!response.ok) {
      const zipUrlMaster = `https://api.github.com/repos/${owner}/${repo}/zipball/master`;
      const responseMaster = await fetch(zipUrlMaster, {
        headers: { 'User-Agent': 'Aether-Voice-OS-Analyzer' },
      });
      if (!responseMaster.ok) {
        throw new Error(`Failed to fetch repository: ${responseMaster.statusText}`);
      }
      buffer = await responseMaster.arrayBuffer();
    } else {
      buffer = await response.arrayBuffer();
    }

    const zip = await JSZip.loadAsync(buffer);
    let combinedCode = '';
    let fileCount = 0;

    for (const [filename, fileEntry] of Object.entries(zip.files)) {
      const file = fileEntry as any;
      if (file.dir || shouldIgnore(filename)) continue;

      const actualPath = filename.split('/').slice(1).join('/');
      if (!actualPath) continue;

      try {
        const content = await file.async('string');
        combinedCode += `\n\n--- File: ${actualPath} ---\n\`\`\`\n${content}\n\`\`\`\n`;
        fileCount++;
      } catch (err) {
        console.warn(`Could not read file ${filename}`);
      }
    }

    if (fileCount === 0) {
      throw new Error('No readable code files found in the repository.');
    }

    const prompt = `
أنت مهندس معماري رئيسي للذكاء الاصطناعي والأمن السيبراني (Principal AI Architecture & Cybersecurity Engineer).
عقليتك تحليلية، هادئة، وتعتمد على المبادئ الأولى (First Principles).

الهدف: تحليل مستودع "Aether-Voice-OS" لبناء نظام تشغيل صوتي (Voice-First OS) متطور للفوز بتحدي Gemini Live Agent.
يجب أن يكون النظام "Zero-UI" (يعتمد على الصوت كلياً مع واجهة محيطية Ambient)، ويستخدم بيئة Google (Gemini Live API, Firebase, Google Workspace).

إليك الكود المصدري للمشروع بالكامل:
${combinedCode}

المطلوب منك تقديم تقرير هندسي عميق ومفصل باللغة العربية يغطي النقاط التالية:
1. تحليل الكمون (Latency Analysis): أين توجد عنق الزجاجة في مسار الصوت الحالي؟ وكيف نستبدله بـ Gemini Live API (Bidi WebSockets / PCM Audio) للوصول إلى زمن انتقال شبه معدوم؟
2. معمارية ClawHub (Dynamic Plugins): كيف نبني نظام إضافات ديناميكي باستخدام Firebase Firestore لتخزين OpenAPI Schemas واستدعائها عبر Function Calling بدون إعادة نشر الكود؟
3. الذاكرة المستمرة (Continuous Memory): كيف ندمج Firestore لتخزين سياق المستخدم وتفضيلاته وتمريرها كـ System Instructions لـ Gemini؟
4. تبسيط الواجهة (Zero-UI): ما هي المكونات (Components) الحالية التي يجب إزالتها أو تحويلها إلى متخيلات بصرية (Visualizers) بسيطة باستخدام framer-motion؟
5. خطة عمل تنفيذية (Action Plan): خطوات برمجية واضحة (1، 2، 3) للبدء في التعديل فوراً.

استخدم أداة البحث (Google Search) إذا احتجت للتأكد من أحدث توثيق لـ Gemini Multimodal Live API أو Firebase.
`;

    const modelResponse = await ai.models.generateContent({
      model: 'gemini-2.0-flash-exp',
      contents: [
        { role: 'user', parts: [{ text: "System Instruction: أنت خبير معماريات برمجيات الذكاء الاصطناعي. أجب باللغة العربية دائماً وباحترافية عالية. قدم أكواد وأمثلة دقيقة." }] },
        { role: 'user', parts: [{ text: prompt }] }
      ],
    });

    const result = {
      success: true,
      analysis: modelResponse.text as string,
      fileCount,
    };

    if (commitSha) {
      if (analysisCache.size >= MAX_CACHE_SIZE) {
        // Remove the oldest entry (the first key in the Map iterator)
        const firstKey = analysisCache.keys().next().value;
        if (firstKey) analysisCache.delete(firstKey);
      }
      analysisCache.set(cacheKey, result);
    }

    return result;

  } catch (error: any) {
    console.error('Analysis error:', error);
    return {
      success: false,
      error: error.message || 'An unknown error occurred during analysis.',
    };
  }
}
