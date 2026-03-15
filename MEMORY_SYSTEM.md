# Gemigram Memory & Skills System

## نظام الذاكرة والمهارات

هذا النظام يسمح للوكلاء الذكية بتخزين والاستفادة من الذاكرة والمهارات المكتسبة.

## البنية الأساسية

### Memory (الذاكرة)

تُستخدم لتخزين المعلومات والسياق والتفضيلات:

```typescript
interface Memory {
  id: string;
  userId: string;           // معرف المستخدم
  agentId: string;          // معرف الوكيل
  content: string;          // محتوى الذاكرة
  category: 'context' | 'preference' | 'skill' | 'interaction';
  timestamp: Timestamp;
  importance: number;       // 1-10 scale
  relatedMemories?: string[];
  metadata?: Record<string, any>;
}
```

### Skill (المهارة)

تُستخدم لتتبع المهارات والأدوات المستخدمة:

```typescript
interface Skill {
  id: string;
  userId: string;
  agentId: string;
  name: string;
  description: string;
  tool: string;             // معرف الأداة (مثل 'repo-analyzer')
  parameters?: Record<string, any>;
  successCount: number;     // عدد الاستخدامات الناجحة
  failureCount: number;     // عدد الاستخدامات الفاشلة
  lastUsed?: Timestamp;
  enabled: boolean;
  createdAt: Timestamp;
}
```

## الاستخدام

### استخدام Hook `useMemory`

```typescript
import { useMemory } from '@/hooks/useMemory';

export function MyComponent() {
  const agentId = 'agent-123';
  const {
    memories,
    skills,
    loading,
    error,
    saveMemory,
    updateMemory,
    deleteMemory,
    searchMemories,
    addSkill,
    recordSkillUsage,
    deleteSkill,
    refetch
  } = useMemory(agentId);

  // حفظ ذاكرة جديدة
  const handleSaveMemory = async () => {
    await saveMemory(
      'محتوى الذاكرة',
      'context',
      7, // importance
      { tags: ['important'] }
    );
  };

  // إضافة مهارة جديدة
  const handleAddSkill = async () => {
    await addSkill(
      'اسم المهارة',
      'وصف المهارة',
      'repo-analyzer',
      { maxDepth: 3 }
    );
  };

  return (
    <div>
      {/* عرض الذاكرة */}
      {memories.map(m => (
        <div key={m.id}>{m.content}</div>
      ))}
    </div>
  );
}
```

### استخدام MemorySystem مباشرة

```typescript
import { MemorySystem, SkillSystem } from '@/lib/memory/MemorySystem';

// حفظ ذاكرة
const memoryId = await MemorySystem.saveMemory(
  'agent-123',
  'محتوى الذاكرة',
  'context',
  8
);

// الحصول على الذاكرة
const memories = await MemorySystem.getMemories('agent-123');

// البحث في الذاكرة
const results = await MemorySystem.searchMemories('agent-123', 'كلمة البحث');

// إضافة مهارة
const skillId = await SkillSystem.addSkill(
  'agent-123',
  'اسم المهارة',
  'وصف المهارة',
  'repo-analyzer'
);

// تسجيل استخدام المهارة
await SkillSystem.recordSkillUsage(skillId, true); // true = نجح، false = فشل
```

## Firebase Collections

### `memories` Collection

تخزن جميع ذاكرة الوكلاء:

```
/memories
  /doc-id-1
    userId: "user-123"
    agentId: "agent-123"
    content: "محتوى الذاكرة"
    category: "context"
    importance: 7
    timestamp: Timestamp
```

### `skills` Collection

تخزن مهارات الوكلاء:

```
/skills
  /skill-id-1
    userId: "user-123"
    agentId: "agent-123"
    name: "اسم المهارة"
    tool: "repo-analyzer"
    successCount: 5
    failureCount: 1
    enabled: true
    createdAt: Timestamp
```

## الميزات

### 1. تخزين السياق
حفظ المعلومات الهامة والسياق للوكيل:

```typescript
await saveMemory(
  'المستخدم يفضل الرد بإيجاز',
  'preference',
  8
);
```

### 2. تتبع المهارات
متابعة نجاح وفشل استخدام الأدوات:

```typescript
await recordSkillUsage(skillId, success);
```

### 3. البحث والاسترجاع
البحث السريع في الذاكرة:

```typescript
const results = await MemorySystem.searchMemories(
  'agent-123',
  'كلمة البحث'
);
```

## MemoryWidget Component

مكون جاهز لعرض الذاكرة والمهارات:

```typescript
import { MemoryWidget } from '@/components/MemoryWidget';

export function Dashboard() {
  return (
    <MemoryWidget agentId="agent-123" />
  );
}
```

## الفئات الرئيسية للذاكرة

- **context**: معلومات سياقية مهمة
- **preference**: تفضيلات المستخدم
- **skill**: مهارات مكتسبة
- **interaction**: سجل التفاعلات السابقة

## رؤية مستقبلية

1. **Semantic Search**: بحث دلالي متقدم
2. **Memory Consolidation**: دمج الذاكرة المتشابهة
3. **Automatic Pruning**: حذف الذاكرة القديمة تلقائياً
4. **Skill Learning**: تعلم المهارات من خلال الاستخدام

---

لأي استفسارات أو مشاكل، تحقق من الأخطاء في console والتأكد من تفعيل Firebase properly.
