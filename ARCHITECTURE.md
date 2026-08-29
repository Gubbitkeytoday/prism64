# 🏛️ PRISM64 Architecture & Engineering Manual

## 1. System Topology

```mermaid
graph TD
  User([User Browser]) -->|HTTP / HTTPS| Server[server_mcp.py - ThreadingHTTPServer]
  AI([Gemini / LLM Agent]) -->|JSON-RPC 2.0 /mcp| Server
  
  subgraph "Backend Engine"
    Server --> StaticHandler[Static Assets Handler]
    Server --> MCPHandler[MCP Tools Dispatcher]
    Server --> TelemetryAPI[/api/telemetry/submit]
    Server --> AdminAPI[/api/admin/live-traffic]
    
    TelemetryAPI --> Storage[(data/submissions.json)]
    AdminAPI --> Storage
  end

  subgraph "Frontend Client (Vanilla Reactive)"
    StaticHandler --> HTML[index.html]
    HTML --> CoreJS[data-core.js - 64 Shades DB]
    HTML --> MainJS[main.js - Hash Router & Canvas Studio]
    HTML --> AdminJS[admin.js - Leaflet Geo Map]
    HTML --> I18nJS[i18n.js - Dual Language]
  end
```

## 2. Key Modules
1. **Core Data Matrix (`assets/js/data-core.js`)**:
   - 16 Core MBTI Types with deep descriptions, careers, strengths, growth points, and population percentages.
   - 64 Variant Overrides (AH, AC, OH, OC) providing unique identity and social relating nuances.
2. **Canvas Story Studio (`assets/js/main.js`)**:
   - 1080×1920 9:16 high-density canvas renderer for Instagram/TikTok Stories.
   - Dual-theme rendering (Light Pearl Glass & Midnight Dark).
3. **Model Context Protocol (`server_mcp.py`)**:
   - Native compliance with Anthropic & Google Gemini Spark MCP specification.
