# 🎨 Landing Page MCP/API Showcase - Quick Reference

**Section:** Limitless Integrations  
**Location:** Between BentoFeatures and Final CTA  
**Purpose:** Highlight MCP & API Marketplace capabilities  

---

## 📐 Layout Structure

```
┌─────────────────────────────────────────────┐
│   Limitless Integrations (Heading)          │
│   Connect to GitHub, 20K+ APIs, MCP...     │
├─────────────────┬───────────────────────────┤
│  MCP Card       │  API Marketplace Card     │
│  (Neon Green)   │  (Neon Blue)              │
│  • GitHub       │  • 20,000+ APIs           │
│  • MCP Market   │  • Secure Credentials     │
│  • JSON-RPC 2.0 │  • Usage Tracking         │
└─────────────────┴───────────────────────────┘
```

---

## 🎨 Design Tokens

### Colors
```css
/* MCP Integration Card */
--border: rgba(16, 255, 135, 0.2)    /* neon-green/20 */
--bg-gradient: rgba(16, 255, 135, 0.05) /* neon-green/5 */
--text: #10FF87                        /* neon-green */
--icon: #10FF87

/* API Marketplace Card */
--border: rgba(0, 240, 255, 0.2)    /* neon-blue/20 */
--bg-gradient: rgba(0, 240, 255, 0.05) /* neon-blue/5 */
--text: #00F0FF                       /* neon-blue */
--icon: #00F0FF
```

### Typography
```css
Heading: text-5xl md:text-7xl font-black
Subheading: text-xl text-white/40
Card Title: text-2xl font-bold
Feature Text: text-white font-semibold / text-sm text-white/40
```

### Spacing
```css
Section Padding: py-32
Container: px-6
Grid Gap: gap-8
Max Width: max-w-6xl
Card Padding: p-8
```

---

## 🧩 Component Tree

```tsx
<section> (py-32, bg-carbon-black/50)
  └─ Container
      ├─ Heading (animated)
      ├─ Subheading
      └─ Grid (md:grid-cols-2)
          ├─ MCP Card (motion.div)
          │   ├─ Package Icon + Title
          │   └─ Feature List (3 items)
          └─ API Card (motion.div)
              ├─ Globe Icon + Title
              └─ Feature List (3 items)
```

---

## 📝 Content Copy

### Heading
```
Limitless Integrations
```

### Subheading
```
Connect to GitHub, access 20,000+ APIs, and integrate with 
external models via MCP protocol
```

### MCP Card Features
1. **GitHub Integration**
   - Repository management, PR reviews, Issues, Actions
2. **MCP Marketplace**
   - Discover & install MCP servers
3. **JSON-RPC 2.0**
   - Standard protocol for AI connections

### API Marketplace Card Features
1. **20,000+ APIs**
   - RapidAPI & APILayer integration
2. **Secure Credentials**
   - Encrypted storage & OAuth2
3. **Usage Tracking**
   - Real-time monitoring & limits

---

## 🎭 Animation Config

### Section Entry
{% raw %}
```typescript
initial={{ opacity: 0, y: 20 }}
whileInView={{ opacity: 1, y: 0 }}
viewport={{ once: true }}
```
{% endraw %}

### MCP Card (Left)
{% raw %}
```typescript
initial={{ opacity: 0, x: -30 }}
whileInView={{ opacity: 1, x: 0 }}
viewport={{ once: true }}
```
{% endraw %}

### API Card (Right)
{% raw %}
```typescript
initial={{ opacity: 0, x: 30 }}
whileInView={{ opacity: 1, x: 0 }}
viewport={{ once: true }}
```
{% endraw %}

---

## 💻 Code Snippet

### Full Section Implementation
{% raw %}
```tsx
{/* MCP & API Marketplace Integration Showcase */}
<section className="py-32 relative bg-carbon-black/50">
  <div className="container mx-auto px-6">
    <div className="text-center mb-16">
      <motion.h2 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-5xl md:text-7xl font-black mb-6 tracking-tighter text-white"
      >
        Limitless <span className="text-neon-green">Integrations</span>
      </motion.h2>
      <p className="text-xl text-white/40 max-w-3xl mx-auto">
        Connect to GitHub, access 20,000+ APIs, and integrate with external models via MCP protocol
      </p>
    </div>
    
    <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
      {/* MCP Integration Card */}
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        className="cyber-panel p-8 rounded-3xl border border-neon-green/20 bg-gradient-to-br from-neon-green/5 to-transparent"
      >
        <div className="flex items-center gap-4 mb-6">
          <Package className="w-12 h-12 text-neon-green" />
          <h3 className="text-2xl font-bold text-white">Model Context Protocol</h3>
        </div>
        <ul className="space-y-4">
          <li className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-neon-green mt-0.5" />
            <div>
              <div className="text-white font-semibold">GitHub Integration</div>
              <div className="text-white/40 text-sm">Repository management, PR reviews, Issues, Actions</div>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-neon-green mt-0.5" />
            <div>
              <div className="text-white font-semibold">MCP Marketplace</div>
              <div className="text-white/40 text-sm">Discover & install MCP servers</div>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-neon-green mt-0.5" />
            <div>
              <div className="text-white font-semibold">JSON-RPC 2.0</div>
              <div className="text-white/40 text-sm">Standard protocol for AI connections</div>
            </div>
          </li>
        </ul>
      </motion.div>
      
      {/* API Marketplace Card */}
      <motion.div
        initial={{ opacity: 0, x: 30 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        className="cyber-panel p-8 rounded-3xl border border-neon-blue/20 bg-gradient-to-br from-neon-blue/5 to-transparent"
      >
        <div className="flex items-center gap-4 mb-6">
          <Globe className="w-12 h-12 text-neon-blue" />
          <h3 className="text-2xl font-bold text-white">API Marketplace</h3>
        </div>
        <ul className="space-y-4">
          <li className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-neon-blue mt-0.5" />
            <div>
              <div className="text-white font-semibold">20,000+ APIs</div>
              <div className="text-white/40 text-sm">RapidAPI & APILayer integration</div>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-neon-blue mt-0.5" />
            <div>
              <div className="text-white font-semibold">Secure Credentials</div>
              <div className="text-white/40 text-sm">Encrypted storage & OAuth2</div>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-neon-blue mt-0.5" />
            <div>
              <div className="text-white font-semibold">Usage Tracking</div>
              <div className="text-white/40 text-sm">Real-time monitoring & limits</div>
            </div>
          </li>
        </ul>
      </motion.div>
    </div>
  </div>
</section>
```
{% endraw %}

---

## 🔧 Customization Options

### Change Number of Features
```tsx
// Add more features to the list
<ul className="space-y-4">
  {/* Existing features... */}
  <li className="flex items-start gap-3">
    <CheckCircle2 className="w-5 h-5 text-neon-green mt-0.5" />
    <div>
      <div className="text-white font-semibold">New Feature</div>
      <div className="text-white/40 text-sm">Description here</div>
    </div>
  </li>
</ul>
```

### Change Icons
```tsx
// Replace Package icon
import { Server, Database } from 'lucide-react';
<Server className="w-12 h-12 text-neon-green" />

// Replace Globe icon
import { Cloud, Zap } from 'lucide-react';
<Cloud className="w-12 h-12 text-neon-blue" />
```

### Change Colors
```tsx
// For different theme
border-purple-500/20
from-purple-500/5 to-transparent
text-purple-400
```

---

## 📱 Responsive Behavior

### Mobile (< 768px)
- Single column layout
- Cards stack vertically
- Reduced heading size (text-5xl)
- Maintained padding

### Tablet (768px - 1024px)
- Two-column grid
- Full feature display
- Medium heading size (text-6xl)

### Desktop (> 1024px)
- Two-column grid with max-width
- Large heading (text-7xl)
- Optimal reading width

---

## ✅ Quality Checklist

- [x] Headings properly nested (h2 → h3)
- [x] Icons sized consistently (12px card, 5px list)
- [x] Colors match design system
- [x] Animations smooth and performant
- [x] Responsive breakpoints tested
- [x] Accessibility maintained (semantic HTML)
- [x] Glassmorphism effect applied
- [x] Gradient backgrounds subtle
- [x] Border opacity correct

---

## 🚀 Performance Impact

### Bundle Size
- **Additional Code:** ~2kB (icons + motion config)
- **Lazy Loading:** Not required (static content)
- **Animation Cost:** Minimal (CSS transforms)

### Render Performance
- **Component Type:** Static (no state)
- **Re-renders:** Only on scroll (whileInView)
- **Memory:** Negligible

---

## 🎯 A/B Testing Ideas

### Variant B: Different Headings
- "Powerful Integrations"
- "Extend Your Reach"
- "Connect Everything"

### Variant C: Different Layout
- Three-column with stats
- Horizontal cards
- Interactive demo

### Variant D: Social Proof
- Add company logos
- User testimonials
- Integration count badges

---

**Last Updated:** March 16, 2025  
**Status:** ✅ Production Ready  
**Location:** `/app/page.tsx` lines 47-140
