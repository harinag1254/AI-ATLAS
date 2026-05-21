// AIAtlas v1.0 — Critical Fixes + High-Impact Improvements
import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
import {
  AreaChart, Area, BarChart, Bar, RadarChart, Radar,
  PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  PieChart, Pie, Cell, XAxis, YAxis,
  CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from "recharts";
import {
  Search, Star, TrendingUp, Zap, Globe, Briefcase, BookOpen, Code, Mic,
  Video, Palette, Database, Bot, ChevronDown, ExternalLink,
  Bookmark, BookmarkCheck, Cpu, BarChart2, Users, X, Sparkles,
  Grid, Shield, Rocket, Brain, CheckCircle2, Circle, SlidersHorizontal,
  Activity, Hash, Plus, Minus, ArrowRight, Wand2, Package,
  DollarSign, MapPin, RefreshCw, Check, Copy, Trash2,
  Lightbulb, MoreHorizontal, Home, AlertTriangle,
  Terminal, FileText, Lock, BookOpen, Sun, Moon,
  DollarSign as DollarSignIcon, Plug, CreditCard
} from "lucide-react";

class ErrorBoundary extends React.Component {
  state = { hasError: false, error: null };
  static getDerivedStateFromError(error) { return { hasError: true, error }; }
  componentDidCatch(error, info) { console.error("AIAtlas error:", error, info); }
  render() {
    if (!this.state.hasError) return this.props.children;
    return (
      <div style={{ minHeight:"100vh",background:"#050508",display:"flex",alignItems:"center",justifyContent:"center",padding:24 }}>
        <div style={{ maxWidth:420,textAlign:"center",display:"flex",flexDirection:"column",alignItems:"center",gap:16 }}>
          <div style={{ width:56,height:56,borderRadius:14,background:"rgba(239,68,68,0.1)",border:"1px solid rgba(239,68,68,0.25)",display:"flex",alignItems:"center",justifyContent:"center" }}>
            <AlertTriangle size={24} color="#ef4444"/>
          </div>
          <h2 style={{ color:"var(--fg)",fontSize:20,fontWeight:700,margin:0 }}>Something went wrong</h2>
          <p style={{ color:"var(--fg-3)",fontSize:14,lineHeight:1.6,margin:0 }}>An unexpected error occurred. Please refresh the page to continue.</p>
          <button type="button" onClick={()=>window.location.reload()} style={{ padding:"8px 20px",background:"rgba(96,165,250,0.12)",border:"1px solid rgba(96,165,250,0.3)",borderRadius:8,color:"var(--accent)",fontSize:13,fontWeight:600,cursor:"pointer" }}>Refresh page</button>
        </div>
      </div>
    );
  }
}

function Toast({ toast }) {
  if (!toast) return null;
  const bg = toast.type==="error" ? "rgba(239,68,68,0.15)" : "rgba(16,185,129,0.15)";
  const bc = toast.type==="error" ? "rgba(239,68,68,0.3)" : "rgba(16,185,129,0.3)";
  const col = toast.type==="error" ? "#f87171" : "#34d399";
  return (
    <div style={{ position:"fixed",top:76,right:20,zIndex:9999,background:bg,border:`1px solid ${bc}`,borderRadius:10,padding:"10px 16px",display:"flex",alignItems:"center",gap:8,backdropFilter:"blur(12px)",boxShadow:"0 4px 24px rgba(0,0,0,0.4)",animation:"toastIn 0.25s ease" }}>
      {toast.type==="error" ? <AlertTriangle size={14} color={col}/> : <Check size={14} color={col}/>}
      <span style={{ fontSize:13,fontWeight:500,color:col }}>{toast.msg}</span>
    </div>
  );
}

function Skeleton({ width="100%", height=16, radius=6, style={} }) {
  return <div className="skeleton" style={{ width,height,borderRadius:radius,...style }}/>;
}
function ToolCardSkeleton() {
  return (
    <div style={{ background:"var(--elevated)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:16,padding:18,display:"flex",flexDirection:"column",gap:12 }}>
      <div style={{ display:"flex",gap:12 }}>
        <Skeleton width={46} height={46} radius={12}/>
        <div style={{ flex:1,display:"flex",flexDirection:"column",gap:8 }}>
          <Skeleton width="55%" height={14}/>
          <Skeleton width="35%" height={11}/>
        </div>
      </div>
      <Skeleton height={4} radius={4}/>
      <Skeleton height={36} radius={8}/>
      <div style={{ display:"flex",gap:6 }}>
        <Skeleton width={64} height={22} radius={6}/>
        <Skeleton width={72} height={22} radius={6}/>
        <Skeleton width={56} height={22} radius={6}/>
      </div>
    </div>
  );
}

// ── Real brand logos — GitHub org avatars (avatars.githubusercontent.com/{org}?s=64) ──
// Grayscale by default to blend with amber dark theme; full color on card hover
const GITHUB_ORGS = {
  "ChatGPT":          "openai",       "Claude":           "anthropics",
  "Gemini":           "google",       "Grok":             "xai-org",
  "DeepSeek":         "deepseek-ai",  "Mistral AI":       "mistralai",
  "Meta AI (Llama)":  "meta-llama",   "Cursor":           "getcursor",
  "GitHub Copilot":   "github",       "Windsurf":         "Exafunction",
  "v0":               "vercel",       "bolt.new":         "stackblitz",
  "Replit AI":        "replit",       "Amazon Q Dev":     "aws",
  "Adobe Firefly":    "adobe",        "Stable Diffusion": "Stability-AI",
  "ElevenLabs":       "elevenlabs-io","Perplexity":       "perplexity-ai",
  "NotebookLM":       "google",       "Zapier AI":        "zapier",
  "n8n":              "n8n-io",       "MS Copilot 365":   "microsoft",
  "Databricks AI":    "databricks",   "Tableau AI":       "tableau",
  "Julius AI":        null,           "Devin":            "cognition-ai",
  "Cohere":           "cohere",       "Jasper":           "JasperAI",
};

function BrandIcon({ tool, size = 46 }) {
  const [err, setErr] = useState(false);
  const org  = GITHUB_ORGS[tool.name];
  const r    = Math.round(size * 0.22);
  const iSz  = Math.round(size * 0.64);

  if (org && !err) {
    return (
      <div style={{
        width:size, height:size, borderRadius:r, flexShrink:0,
        background:"var(--elevated)", border:"1px solid var(--border)",
        display:"flex", alignItems:"center", justifyContent:"center",
        overflow:"hidden"
      }} className="brand-icon">
        <img
          src={`https://avatars.githubusercontent.com/${org}?s=64`}
          alt={tool.name}
          width={iSz} height={iSz}
          onError={() => setErr(true)}
          draggable={false}
          style={{ borderRadius: Math.round(r * 0.7), objectFit:"cover" }}
          className="brand-icon-img"
        />
      </div>
    );
  }

  // Fallback — styled initial with tool accent color
  const initials = tool.name.split(/\s+/).map(w=>w[0]).join("").slice(0,2).toUpperCase();
  return (
    <div style={{
      width:size, height:size, borderRadius:r, flexShrink:0,
      background:tool.color+"1A", border:`1px solid ${tool.color}30`,
      display:"flex", alignItems:"center", justifyContent:"center",
    }}>
      <span style={{ fontSize:size*0.3, fontWeight:800, color:tool.color,
        fontFamily:"'Montserrat',sans-serif", letterSpacing:"-0.02em", lineHeight:1 }}>
        {initials}
      </span>
    </div>
  );
}

const AVATAR_COLORS = ["var(--accent)","#4285f4","#10a37f","#6366f1","#db2777","#f59e0b","#06b6d4","#8b5cf6"];
function LetterAvatar({ name, size=36 }) {
  const initials = name.split(" ").map(w=>w[0]).join("").slice(0,2).toUpperCase();
  const idx = name.charCodeAt(0) % AVATAR_COLORS.length;
  const bg = AVATAR_COLORS[idx];
  return (
    <div style={{ width:size,height:size,borderRadius:size*0.28,background:bg+"22",border:`1px solid ${bg}44`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0 }}>
      <span style={{ fontSize:size*0.33,fontWeight:700,color:bg,letterSpacing:"-0.5px" }}>{initials}</span>
    </div>
  );
}

const TOOLS = [
  // ── WRITING / LLM ──
  { id:1,  name:"ChatGPT",       company:"OpenAI",       category:"writing",    emoji:"🟢", color:"#10a37f", website:"https://chat.openai.com",
    description:"World's leading conversational AI — GPT-4o with multimodal reasoning, memory, code execution and agentic tasks.",
    tags:["GPT-4o","Multimodal","Memory","Agents"], features:["Text & Vision","DALL·E 3","Code Interpreter","Custom GPTs"],
    pricing:{free:true,plan:"$20/mo",api:true}, metrics:{users:"200M+",growth:"+18%",rating:4.8},
    regions:["🇺🇸","🇮🇳","🇬🇧","🇩🇪"], score:98, trending:true, enterprise:true, openSource:false,
    useCases:["writing","research"], radar:{intelligence:98,speed:82,value:85,context:78,coding:90,multimodal:96} },
  { id:2,  name:"Claude",        company:"Anthropic",    category:"writing",    emoji:"🟠", color:"#d97706", website:"https://claude.ai",
    description:"Safety-first AI with 200K context, Artifacts and industry-leading document analysis. Best for long-form reasoning.",
    tags:["200K Context","Artifacts","Analysis","Safety"], features:["200K Context","Artifacts","Code Review","Vision"],
    pricing:{free:true,plan:"$20/mo",api:true}, metrics:{users:"40M+",growth:"+65%",rating:4.9},
    regions:["🇺🇸","🇬🇧","🇩🇪","🇯🇵"], score:97, trending:true, enterprise:true, openSource:false,
    useCases:["writing","research","coding"], radar:{intelligence:97,speed:80,value:88,context:99,coding:93,multimodal:85} },
  { id:3,  name:"Gemini",        company:"Google",       category:"writing",    emoji:"🔵", color:"#4285f4", website:"https://gemini.google.com",
    description:"Google's multimodal AI with 1M token context, deep Workspace integration and real-time web grounding.",
    tags:["1M Context","Multimodal","Google Suite","Gemini 2.0"], features:["1M Context","Google Drive","Live Search","Code"],
    pricing:{free:true,plan:"$19.99/mo",api:true}, metrics:{users:"100M+",growth:"+45%",rating:4.6},
    regions:["🇺🇸","🇮🇳","🇬🇧","🇯🇵"], score:94, trending:true, enterprise:true, openSource:false,
    useCases:["writing","research"], radar:{intelligence:95,speed:85,value:84,context:96,coding:88,multimodal:97} },
  { id:4,  name:"Grok",          company:"xAI",          category:"writing",    emoji:"🦊", color:"#1a1a1a", website:"https://grok.com",
    description:"xAI's real-time AI with direct X/Twitter data access, image generation and uncensored analysis.",
    tags:["Real-time X","Aurora Images","DeepSearch","Voice"], features:["X/Twitter Data","Image Gen","Voice Mode","Code"],
    pricing:{free:true,plan:"$16/mo",api:true}, metrics:{users:"50M+",growth:"+90%",rating:4.5},
    regions:["🇺🇸","🇬🇧","🇦🇺","🇨🇦"], score:88, trending:true, enterprise:false, openSource:false,
    useCases:["writing","research"], radar:{intelligence:90,speed:88,value:82,context:68,coding:80,multimodal:88} },
  { id:5,  name:"DeepSeek",      company:"DeepSeek",     category:"writing",    emoji:"🌊", color:"#2563eb", website:"https://chat.deepseek.com",
    description:"China's open-source breakthrough — R1 matches o1-level reasoning at near-zero cost. Fully open weights.",
    tags:["Open Source","Chain-of-Thought","Ultra-cheap","R1"], features:["Deep Reasoning","Open Weights","Code","Math"],
    pricing:{free:true,plan:"$0.001/1K",api:true}, metrics:{users:"30M+",growth:"+500%",rating:4.7},
    regions:["🇨🇳","🇺🇸","🇮🇳","🇩🇪"], score:92, trending:true, enterprise:false, openSource:true,
    useCases:["coding","research"], radar:{intelligence:95,speed:78,value:99,context:80,coding:94,multimodal:60} },
  { id:6,  name:"Mistral AI",    company:"Mistral",      category:"writing",    emoji:"🌬️", color:"#f97316", website:"https://mistral.ai",
    description:"Europe's leading open-weight LLM. Mistral Large 2 rivals GPT-4 at a fraction of cost.",
    tags:["Open Source","European AI","MoE","Efficient"], features:["Open Weights","JSON Mode","Function Calling","Long Context"],
    pricing:{free:true,plan:"$0.002/1K",api:true}, metrics:{users:"5M+",growth:"+200%",rating:4.6},
    regions:["🇫🇷","🇩🇪","🇬🇧","🇺🇸"], score:88, trending:true, enterprise:true, openSource:true,
    useCases:["coding","automation"], radar:{intelligence:90,speed:90,value:96,context:78,coding:86,multimodal:65} },
  { id:7,  name:"Meta AI (Llama)",company:"Meta",         category:"writing",    emoji:"🦙", color:"#0668e1", website:"https://ai.meta.com",
    description:"Meta's Llama 3 family — best-in-class open weights powering billions of devices globally.",
    tags:["Open Source","Llama 3","On-device","Free"], features:["Open Weights","Fine-tuning","Multi-size","Multimodal"],
    pricing:{free:true,plan:"Free",api:true}, metrics:{users:"400M+",growth:"+120%",rating:4.5},
    regions:["🇺🇸","🇮🇳","🇧🇷","🇩🇪"], score:89, trending:true, enterprise:false, openSource:true,
    useCases:["coding","writing"], radar:{intelligence:91,speed:85,value:98,context:72,coding:84,multimodal:70} },
  { id:8,  name:"Jasper",        company:"Jasper AI",    category:"writing",    emoji:"✍️", color:"#7c3aed", website:"https://jasper.ai",
    description:"Enterprise AI content platform — brand voice, 90+ templates, SEO integration and campaign workflows.",
    tags:["Marketing AI","Brand Voice","Templates","SEO"], features:["Brand Voice","Campaign Manager","SEO Mode","Team"],
    pricing:{free:false,plan:"$49/mo",api:true}, metrics:{users:"100K+",growth:"+18%",rating:4.3},
    regions:["🇺🇸","🇬🇧","🇦🇺","🇨🇦"], score:80, trending:false, enterprise:true, openSource:false,
    useCases:["writing"], radar:{intelligence:78,speed:80,value:60,context:55,coding:30,multimodal:68} },
  // ── CODING ──
  { id:9,  name:"Cursor",        company:"Anysphere",    category:"coding",     emoji:"⚡", color:"#6366f1", website:"https://cursor.com",
    description:"AI-first code editor — multi-file edits, codebase chat and agentic coding powered by Claude and GPT-4o.",
    tags:["Code Agent","Multi-file","Composer","VS Code"], features:["AI Autocomplete","Codebase Chat","Agent Mode","Git"],
    pricing:{free:true,plan:"$20/mo",api:false}, metrics:{users:"4M+",growth:"+200%",rating:4.9},
    regions:["🇺🇸","🇮🇳","🇨🇳","🇪🇺"], score:97, trending:true, enterprise:true, openSource:false,
    useCases:["coding"], radar:{intelligence:89,speed:90,value:83,context:80,coding:99,multimodal:58} },
  { id:10, name:"GitHub Copilot",company:"Microsoft",    category:"coding",     emoji:"🐙", color:"#58a6ff", website:"https://github.com/features/copilot",
    description:"The original AI pair programmer — Copilot Workspace, PR reviews and multi-model support including Claude.",
    tags:["IDE Plugin","PR Reviews","Workspace","GPT-4o"], features:["Inline Suggestions","Copilot Chat","PR Reviews","CLI"],
    pricing:{free:true,plan:"$10/mo",api:true}, metrics:{users:"15M+",growth:"+35%",rating:4.6},
    regions:["🇺🇸","🇮🇳","🇩🇪","🇨🇳"], score:92, trending:false, enterprise:true, openSource:false,
    useCases:["coding"], radar:{intelligence:86,speed:93,value:80,context:68,coding:97,multimodal:48} },
  { id:11, name:"Windsurf",      company:"Codeium",      category:"coding",     emoji:"🏄", color:"#06b6d4", website:"https://codeium.com/windsurf",
    description:"Agentic IDE with Cascade — deep-context AI that reads your whole codebase and acts autonomously.",
    tags:["Cascade Agent","Deep Context","Agentic","Free"], features:["Cascade Agent","Codebase Awareness","Autocomplete","Multi-model"],
    pricing:{free:true,plan:"$15/mo",api:false}, metrics:{users:"1M+",growth:"+300%",rating:4.8},
    regions:["🇺🇸","🇮🇳","🇩🇪","🇬🇧"], score:93, trending:true, enterprise:true, openSource:false,
    useCases:["coding"], radar:{intelligence:87,speed:88,value:90,context:84,coding:98,multimodal:52} },
  { id:12, name:"v0",            company:"Vercel",       category:"coding",     emoji:"▲", color:"#e2e8f0", website:"https://v0.dev",
    description:"Generate full-stack React/Tailwind UI from text prompts — shadcn/ui components, deploy to Vercel instantly.",
    tags:["UI Generation","React","Tailwind","shadcn/ui"], features:["Component Gen","shadcn/ui","Next.js","One-click Deploy"],
    pricing:{free:true,plan:"$20/mo",api:false}, metrics:{users:"2M+",growth:"+400%",rating:4.7},
    regions:["🇺🇸","🇬🇧","🇩🇪","🇯🇵"], score:91, trending:true, enterprise:false, openSource:false,
    useCases:["coding","design"], radar:{intelligence:85,speed:92,value:85,context:70,coding:96,multimodal:80} },
  { id:13, name:"bolt.new",      company:"StackBlitz",   category:"coding",     emoji:"🔩", color:"#f59e0b", website:"https://bolt.new",
    description:"Full-stack AI web app builder in the browser — prompt to production app with npm, terminal and live preview.",
    tags:["Full-stack","WebContainers","Instant Deploy","Browser"], features:["Full-stack Gen","Live Preview","npm","Deployment"],
    pricing:{free:true,plan:"$20/mo",api:false}, metrics:{users:"1M+",growth:"+600%",rating:4.6},
    regions:["🇺🇸","🇬🇧","🇩🇪","🇦🇺"], score:89, trending:true, enterprise:false, openSource:false,
    useCases:["coding"], radar:{intelligence:83,speed:90,value:84,context:65,coding:94,multimodal:72} },
  { id:14, name:"Replit AI",     company:"Replit",       category:"coding",     emoji:"🔄", color:"#f26207", website:"https://replit.com",
    description:"Cloud IDE with AI Agent — builds full apps from plain descriptions, instant deployment included.",
    tags:["Cloud IDE","AI Agent","Hosting","Multiplayer"], features:["Replit Agent","Instant Hosting","Templates","Collab"],
    pricing:{free:true,plan:"$25/mo",api:false}, metrics:{users:"30M+",growth:"+40%",rating:4.4},
    regions:["🇺🇸","🇮🇳","🇧🇷","🇬🇧"], score:85, trending:true, enterprise:false, openSource:false,
    useCases:["coding"], radar:{intelligence:80,speed:85,value:80,context:60,coding:90,multimodal:55} },
  { id:15, name:"Devin",         company:"Cognition AI",  category:"coding",     emoji:"🧑‍💻", color:"#8b5cf6", website:"https://cognition.ai",
    description:"First true AI software engineer — autonomously plans, codes, tests and deploys full engineering tasks.",
    tags:["AI Engineer","Autonomous","Full Cycle","Agent"], features:["Autonomous Coding","Browser","Shell","PR Creation"],
    pricing:{free:false,plan:"$500/mo",api:false}, metrics:{users:"10K+",growth:"+150%",rating:4.2},
    regions:["🇺🇸","🇬🇧","🇩🇪","🇯🇵"], score:86, trending:true, enterprise:true, openSource:false,
    useCases:["coding","automation"], radar:{intelligence:90,speed:60,value:50,context:88,coding:97,multimodal:62} },
  // ── DESIGN ──
  { id:16, name:"Midjourney",    company:"Midjourney Inc",category:"design",    emoji:"🎨", color:"#ec4899", website:"https://midjourney.com",
    description:"The gold standard for AI art — v6.1 produces photorealistic and painterly images with unmatched aesthetic quality.",
    tags:["Text-to-Image","v6.1","Photorealistic","Style"], features:["Image Gen","Style Mixing","Upscaling","Niji Mode"],
    pricing:{free:false,plan:"$10/mo",api:false}, metrics:{users:"20M+",growth:"+12%",rating:4.8},
    regions:["🇺🇸","🇯🇵","🇰🇷","🇬🇧"], score:94, trending:false, enterprise:false, openSource:false,
    useCases:["design"], radar:{intelligence:78,speed:65,value:88,context:35,coding:12,multimodal:97} },
  { id:17, name:"Adobe Firefly", company:"Adobe",          category:"design",   emoji:"🔥", color:"#fa0f00", website:"https://firefly.adobe.com",
    description:"Commercially safe generative AI in Adobe Creative Cloud — image gen, vector, video and motion effects.",
    tags:["Commercially Safe","Creative Cloud","Vectors","Brand"], features:["Generative Fill","Text Effects","Video Gen","Structure Ref"],
    pricing:{free:true,plan:"$54.99/mo",api:true}, metrics:{users:"10M+",growth:"+55%",rating:4.5},
    regions:["🇺🇸","🇬🇧","🇩🇪","🇯🇵"], score:89, trending:true, enterprise:true, openSource:false,
    useCases:["design","video"], radar:{intelligence:80,speed:70,value:68,context:42,coding:15,multimodal:94} },
  { id:18, name:"Canva AI",      company:"Canva",           category:"design",  emoji:"🎪", color:"#7d2ae8", website:"https://canva.com",
    description:"Magic Studio brings AI to 150M+ users — Magic Design, Dream Lab, background remover and brand kit generation.",
    tags:["Magic Design","Dream Lab","Templates","Brand Kit"], features:["Magic Design","Dream Lab","BG Remove","AI Presentation"],
    pricing:{free:true,plan:"$14.99/mo",api:false}, metrics:{users:"150M+",growth:"+30%",rating:4.6},
    regions:["🇦🇺","🇺🇸","🇮🇳","🇧🇷"], score:87, trending:false, enterprise:true, openSource:false,
    useCases:["design","writing"], radar:{intelligence:74,speed:82,value:90,context:38,coding:8,multimodal:92} },
  { id:19, name:"Stable Diffusion",company:"Stability AI", category:"design",  emoji:"🎭", color:"#7c2d12", website:"https://stability.ai",
    description:"Open-source image generation powering thousands of apps — SD3 with fine-tuning and full local deployment.",
    tags:["Open Source","Local Run","Fine-tuning","SD3"], features:["Open Weights","LoRA","ControlNet","API"],
    pricing:{free:true,plan:"$20/mo",api:true}, metrics:{users:"10M+",growth:"+5%",rating:4.4},
    regions:["🇺🇸","🇬🇧","🇩🇪","🇨🇳"], score:84, trending:false, enterprise:false, openSource:true,
    useCases:["design"], radar:{intelligence:76,speed:72,value:96,context:32,coding:55,multimodal:90} },
  { id:20, name:"Ideogram",      company:"Ideogram AI",     category:"design",  emoji:"💡", color:"#f0a500", website:"https://ideogram.ai",
    description:"Best AI for text-in-image — v2.0 accurately renders typography inside generated images and posters.",
    tags:["Text-in-Image","Typography","v2.0","Poster"], features:["Text Rendering","Remix","Canvas","Aspect Ratio"],
    pricing:{free:true,plan:"$8/mo",api:true}, metrics:{users:"2M+",growth:"+120%",rating:4.6},
    regions:["🇺🇸","🇬🇧","🇩🇪","🇯🇵"], score:83, trending:true, enterprise:false, openSource:false,
    useCases:["design"], radar:{intelligence:76,speed:74,value:90,context:30,coding:10,multimodal:95} },
  // ── VIDEO ──
  { id:21, name:"Runway",        company:"Runway AI",       category:"video",   emoji:"🎬", color:"#14b8a6", website:"https://runwayml.com",
    description:"Professional AI video studio — Gen-3 Alpha Turbo produces cinema-quality clips from text and image inputs.",
    tags:["Gen-3 Alpha","Text-to-Video","Motion Brush","Inpainting"], features:["Text-to-Video","Image-to-Video","Motion Brush","Green Screen"],
    pricing:{free:true,plan:"$15/mo",api:true}, metrics:{users:"5M+",growth:"+120%",rating:4.7},
    regions:["🇺🇸","🇬🇧","🇩🇪","🇦🇺"], score:93, trending:true, enterprise:true, openSource:false,
    useCases:["video","design"], radar:{intelligence:82,speed:64,value:75,context:42,coding:15,multimodal:98} },
  { id:22, name:"Sora",          company:"OpenAI",           category:"video",  emoji:"🎥", color:"#10a37f", website:"https://sora.com",
    description:"OpenAI's text-to-video model — generates 1080p cinematic videos up to 60 seconds with world-model understanding.",
    tags:["1080p","60s Clips","Storyboard","World Model"], features:["Text-to-Video","Image-to-Video","Remix","Storyboard"],
    pricing:{free:false,plan:"$20/mo",api:false}, metrics:{users:"2M+",growth:"+300%",rating:4.6},
    regions:["🇺🇸","🇬🇧","🇩🇪","🇯🇵"], score:94, trending:true, enterprise:false, openSource:false,
    useCases:["video"], radar:{intelligence:88,speed:58,value:70,context:55,coding:10,multimodal:99} },
  { id:23, name:"HeyGen",        company:"HeyGen",           category:"video",  emoji:"👤", color:"#3b82f6", website:"https://heygen.com",
    description:"AI video platform with 300+ avatars, voice cloning and 40+ language translation dubbing at scale.",
    tags:["AI Avatars","Voice Clone","Translation","Interactive"], features:["AI Avatars","Voice Cloning","Auto-translate","Interactive"],
    pricing:{free:true,plan:"$29/mo",api:true}, metrics:{users:"2M+",growth:"+140%",rating:4.6},
    regions:["🇺🇸","🇬🇧","🇩🇪","🇨🇳"], score:88, trending:true, enterprise:true, openSource:false,
    useCases:["video"], radar:{intelligence:78,speed:72,value:78,context:35,coding:10,multimodal:95} },
  { id:24, name:"Synthesia",     company:"Synthesia",        category:"video",  emoji:"📹", color:"#f59e0b", website:"https://synthesia.io",
    description:"Enterprise AI video with 230+ avatars, screen recorder and 140+ language dubbing for L&D teams.",
    tags:["Enterprise","230+ Avatars","140+ Languages","L&D"], features:["AI Presenters","Auto-translation","Custom Avatars","SCORM"],
    pricing:{free:false,plan:"$29/mo",api:true}, metrics:{users:"500K+",growth:"+55%",rating:4.5},
    regions:["🇺🇸","🇬🇧","🇩🇪","🇦🇺"], score:86, trending:false, enterprise:true, openSource:false,
    useCases:["video"], radar:{intelligence:75,speed:70,value:68,context:32,coding:10,multimodal:93} },
  { id:25, name:"Kling AI",      company:"Kuaishou",         category:"video",  emoji:"🎞️", color:"#ef4444", website:"https://klingai.com",
    description:"Kuaishou's cinematic generator — Kling 1.6 with hyper-realistic motion, face consistency and physics.",
    tags:["Hyper-realistic","Face Consistency","Physics","5s/10s"], features:["Text-to-Video","Image-to-Video","Face Lock","Camera"],
    pricing:{free:true,plan:"$9.99/mo",api:false}, metrics:{users:"3M+",growth:"+250%",rating:4.5},
    regions:["🇨🇳","🇺🇸","🇯🇵","🇰🇷"], score:87, trending:true, enterprise:false, openSource:false,
    useCases:["video"], radar:{intelligence:84,speed:62,value:88,context:38,coding:8,multimodal:97} },
  // ── AUDIO ──
  { id:26, name:"ElevenLabs",    company:"ElevenLabs",       category:"audio",  emoji:"🔊", color:"#8b5cf6", website:"https://elevenlabs.io",
    description:"Ultra-realistic voice synthesis and cloning across 32 languages — real-time API, dubbing studio and SFX.",
    tags:["Voice Clone","32 Languages","Real-time","Studio"], features:["Voice Cloning","TTS","Dubbing Studio","Sound Effects"],
    pricing:{free:true,plan:"$5/mo",api:true}, metrics:{users:"1M+",growth:"+95%",rating:4.8},
    regions:["🇺🇸","🇬🇧","🇩🇪","🇫🇷"], score:92, trending:true, enterprise:true, openSource:false,
    useCases:["video","automation"], radar:{intelligence:84,speed:87,value:92,context:36,coding:6,multimodal:90} },
  { id:27, name:"Suno AI",       company:"Suno",              category:"audio", emoji:"🎵", color:"#7c3aed", website:"https://suno.com",
    description:"Generate full studio-quality songs with vocals, instruments and lyrics from a text prompt — v4 is shockingly good.",
    tags:["Song Generation","Vocals","v4","Full Songs"], features:["Full Song Gen","Lyrics","Cover Art","Stems"],
    pricing:{free:true,plan:"$10/mo",api:false}, metrics:{users:"12M+",growth:"+200%",rating:4.7},
    regions:["🇺🇸","🇬🇧","🇩🇪","🇯🇵"], score:90, trending:true, enterprise:false, openSource:false,
    useCases:["audio"], radar:{intelligence:80,speed:82,value:90,context:28,coding:5,multimodal:88} },
  { id:28, name:"Udio",          company:"Udio",              category:"audio", emoji:"🎶", color:"#db2777", website:"https://udio.com",
    description:"AI music creation with detailed genre control, custom lyrics, 2-minute tracks and ultra-realistic instruments.",
    tags:["Music Gen","Genre Control","Custom Lyrics","Extend"], features:["Music Gen","Genre Mixing","Extend Track","Remix"],
    pricing:{free:true,plan:"$10/mo",api:false}, metrics:{users:"3M+",growth:"+150%",rating:4.5},
    regions:["🇺🇸","🇬🇧","🇩🇪","🇦🇺"], score:86, trending:true, enterprise:false, openSource:false,
    useCases:["audio"], radar:{intelligence:78,speed:75,value:88,context:25,coding:5,multimodal:86} },
  { id:29, name:"Descript",      company:"Descript",          category:"audio", emoji:"✂️", color:"#22c55e", website:"https://descript.com",
    description:"Edit audio and video by editing text — overdub voice cloning, filler word removal and podcast production.",
    tags:["Text Editing","Overdub","Podcast","Filler Remove"], features:["Text-based Edit","Voice Overdub","Filler Remove","Transcription"],
    pricing:{free:true,plan:"$24/mo",api:false}, metrics:{users:"500K+",growth:"+60%",rating:4.5},
    regions:["🇺🇸","🇬🇧","🇦🇺","🇨🇦"], score:83, trending:false, enterprise:true, openSource:false,
    useCases:["audio","video"], radar:{intelligence:76,speed:78,value:80,context:40,coding:15,multimodal:82} },
  // ── RESEARCH ──
  { id:30, name:"Perplexity",    company:"Perplexity AI",    category:"research",emoji:"🔍", color:"#0ea5e9", website:"https://perplexity.ai",
    description:"AI answer engine with real-time web search, source citations, Deep Research reports and Sonar API.",
    tags:["Web Search","Citations","Deep Research","Sonar API"], features:["Live Search","Source Citations","Deep Research","API"],
    pricing:{free:true,plan:"$20/mo",api:true}, metrics:{users:"15M+",growth:"+80%",rating:4.6},
    regions:["🇺🇸","🇮🇳","🇩🇪","🇯🇵"], score:90, trending:true, enterprise:false, openSource:false,
    useCases:["research"], radar:{intelligence:88,speed:90,value:86,context:62,coding:56,multimodal:72} },
  { id:31, name:"NotebookLM",    company:"Google",            category:"research",emoji:"📔", color:"#4285f4", website:"https://notebooklm.google.com",
    description:"Google's AI research assistant — upload docs, generate Audio Overviews, Q&A and mind maps from sources.",
    tags:["Document AI","Audio Overview","Sources","Mind Map"], features:["Source Upload","Audio Overview","Q&A","Mind Map"],
    pricing:{free:true,plan:"$19.99/mo",api:false}, metrics:{users:"5M+",growth:"+300%",rating:4.7},
    regions:["🇺🇸","🇬🇧","🇩🇪","🇯🇵"], score:88, trending:true, enterprise:true, openSource:false,
    useCases:["research","writing"], radar:{intelligence:90,speed:78,value:95,context:92,coding:40,multimodal:75} },
  { id:32, name:"Elicit",        company:"Elicit",            category:"research",emoji:"🔬", color:"#6366f1", website:"https://elicit.com",
    description:"AI research assistant — searches 200M+ academic papers, extracts key data and summarises with citations.",
    tags:["Academic Papers","200M Papers","Extraction","Citations"], features:["Paper Search","Data Extraction","Summarization","Compare"],
    pricing:{free:true,plan:"$12/mo",api:false}, metrics:{users:"400K+",growth:"+90%",rating:4.5},
    regions:["🇺🇸","🇬🇧","🇩🇪","🇦🇺"], score:82, trending:false, enterprise:false, openSource:false,
    useCases:["research"], radar:{intelligence:86,speed:75,value:85,context:78,coding:35,multimodal:50} },
  // ── AUTOMATION ──
  { id:33, name:"Zapier AI",     company:"Zapier",           category:"automation",emoji:"🔗", color:"#ff4a00", website:"https://zapier.com/ai",
    description:"AI-powered workflow automation connecting 7,000+ apps — build Zaps in plain English with Copilot and Agents.",
    tags:["7000+ Apps","No-Code","Copilot","AI Agents"], features:["AI Zap Builder","Copilot","Tables","Interfaces"],
    pricing:{free:true,plan:"$19.99/mo",api:true}, metrics:{users:"8M+",growth:"+25%",rating:4.4},
    regions:["🇺🇸","🇬🇧","🇦🇺","🇮🇳"], score:86, trending:false, enterprise:true, openSource:false,
    useCases:["automation"], radar:{intelligence:74,speed:80,value:78,context:46,coding:62,multimodal:52} },
  { id:34, name:"Make",          company:"Make",              category:"automation",emoji:"🔧", color:"#6d28d9", website:"https://make.com",
    description:"Visual automation platform — drag-and-drop workflow builder with 1,800+ app integrations and branching logic.",
    tags:["Visual Builder","1800+ Apps","Branching","Webhooks"], features:["Visual Builder","Data Mapping","Iterators","Error Handling"],
    pricing:{free:true,plan:"$9/mo",api:true}, metrics:{users:"500K+",growth:"+45%",rating:4.5},
    regions:["🇨🇿","🇺🇸","🇩🇪","🇬🇧"], score:83, trending:false, enterprise:true, openSource:false,
    useCases:["automation"], radar:{intelligence:70,speed:78,value:85,context:42,coding:65,multimodal:48} },
  { id:35, name:"n8n",           company:"n8n GmbH",          category:"automation",emoji:"🕸️", color:"#ea580c", website:"https://n8n.io",
    description:"Open-source workflow automation with AI nodes — self-host for full data privacy, 400+ integrations.",
    tags:["Open Source","Self-host","AI Nodes","400+ Apps"], features:["AI Nodes","Self-host","Code Node","Webhook"],
    pricing:{free:true,plan:"$20/mo",api:true}, metrics:{users:"400K+",growth:"+80%",rating:4.6},
    regions:["🇩🇪","🇺🇸","🇬🇧","🇫🇷"], score:82, trending:true, enterprise:true, openSource:true,
    useCases:["automation","coding"], radar:{intelligence:70,speed:76,value:90,context:44,coding:70,multimodal:45} },
  { id:36, name:"MS Copilot 365",company:"Microsoft",         category:"automation",emoji:"🪟", color:"#00a1f1", website:"https://microsoft.com/copilot",
    description:"AI across all Microsoft 365 apps — Word, Excel, PowerPoint, Teams, Outlook with enterprise security.",
    tags:["Microsoft 365","Word","Excel","Teams"], features:["Draft in Word","Excel Analysis","PPT Gen","Teams Summary"],
    pricing:{free:false,plan:"$30/mo",api:false}, metrics:{users:"300M+",growth:"+50%",rating:4.3},
    regions:["🇺🇸","🇬🇧","🇩🇪","🇮🇳"], score:84, trending:true, enterprise:true, openSource:false,
    useCases:["automation","writing"], radar:{intelligence:82,speed:80,value:72,context:68,coding:60,multimodal:80} },
  // ── DATA ──
  { id:37, name:"Julius AI",     company:"Julius",            category:"data",     emoji:"📈", color:"#3b82f6", website:"https://julius.ai",
    description:"Chat with your data — upload CSVs or databases and get instant analysis, charts and Python code.",
    tags:["Data Analysis","CSV","Charts","Python"], features:["Chat with Data","Auto Charts","SQL","Statistics"],
    pricing:{free:true,plan:"$20/mo",api:false}, metrics:{users:"500K+",growth:"+150%",rating:4.6},
    regions:["🇺🇸","🇬🇧","🇩🇪","🇦🇺"], score:84, trending:true, enterprise:false, openSource:false,
    useCases:["data","research"], radar:{intelligence:84,speed:82,value:85,context:68,coding:80,multimodal:55} },
  { id:38, name:"Tableau AI",    company:"Salesforce",        category:"data",     emoji:"📉", color:"#e97627", website:"https://tableau.com",
    description:"Einstein AI in Tableau — natural language to interactive dashboards, predictive forecasting and auto-insights.",
    tags:["Einstein AI","Dashboards","Predictive","NL Query"], features:["NL to Chart","Forecasting","Explain Data","Ask Data"],
    pricing:{free:false,plan:"$75/mo",api:true}, metrics:{users:"4M+",growth:"+25%",rating:4.4},
    regions:["🇺🇸","🇬🇧","🇩🇪","🇯🇵"], score:80, trending:false, enterprise:true, openSource:false,
    useCases:["data"], radar:{intelligence:80,speed:72,value:60,context:62,coding:55,multimodal:65} },
  { id:39, name:"Databricks AI",  company:"Databricks",       category:"data",     emoji:"🧱", color:"#ff3621", website:"https://databricks.com",
    description:"Unified analytics and AI platform — Mosaic AI, Delta Lake, MLflow and LakeHouse for enterprise data teams.",
    tags:["LakeHouse","MLflow","Mosaic AI","Delta Lake"], features:["Mosaic AI","Unity Catalog","Delta Lake","Workflows"],
    pricing:{free:false,plan:"Pay-as-go",api:true}, metrics:{users:"10K+",growth:"+40%",rating:4.4},
    regions:["🇺🇸","🇬🇧","🇩🇪","🇯🇵"], score:79, trending:false, enterprise:true, openSource:true,
    useCases:["data","coding"], radar:{intelligence:82,speed:70,value:65,context:70,coding:78,multimodal:40} },
  // ── HR ──
  { id:40, name:"HireVue",       company:"HireVue",           category:"hr",        emoji:"💼", color:"#0ea5e9", website:"https://hirevue.com",
    description:"AI-powered video interviewing — game-based assessments, structured interviews and bias-reducing scoring.",
    tags:["Video Interview","Assessments","Bias Reduction","ATS"], features:["Video Interview","Game Assess","Structured Score","Integrations"],
    pricing:{free:false,plan:"Custom",api:true}, metrics:{users:"50K+",growth:"+30%",rating:4.1},
    regions:["🇺🇸","🇬🇧","🇦🇺","🇩🇪"], score:76, trending:false, enterprise:true, openSource:false,
    useCases:["hr"], radar:{intelligence:72,speed:75,value:60,context:50,coding:20,multimodal:78} },
  { id:41, name:"Workday AI",    company:"Workday",           category:"hr",        emoji:"👔", color:"#f59e0b", website:"https://workday.com",
    description:"Enterprise HR with embedded AI — skills intelligence, workforce planning, payroll automation and talent management.",
    tags:["Skills AI","Workforce","Payroll","Enterprise"], features:["Skills Graph","Workforce Planning","AI Contracts","Analytics"],
    pricing:{free:false,plan:"Custom",api:true}, metrics:{users:"65M+",growth:"+20%",rating:4.2},
    regions:["🇺🇸","🇬🇧","🇩🇪","🇦🇺"], score:74, trending:false, enterprise:true, openSource:false,
    useCases:["hr","automation"], radar:{intelligence:70,speed:68,value:55,context:58,coding:30,multimodal:50} },
  { id:42, name:"Eightfold AI",  company:"Eightfold",         category:"hr",        emoji:"🌐", color:"#6366f1", website:"https://eightfold.ai",
    description:"Talent Intelligence Platform — AI-driven talent acquisition, skills matching and workforce upskilling.",
    tags:["Talent Intelligence","Upskilling","DEI","Workforce"], features:["Talent Insights","Career Hub","Skills Match","DEI Analytics"],
    pricing:{free:false,plan:"Custom",api:true}, metrics:{users:"100K+",growth:"+35%",rating:4.2},
    regions:["🇺🇸","🇮🇳","🇬🇧","🇩🇪"], score:73, trending:false, enterprise:true, openSource:false,
    useCases:["hr"], radar:{intelligence:74,speed:70,value:58,context:56,coding:25,multimodal:48} },
];

const catCount = TOOLS.reduce((acc,t) => { acc[t.category]=(acc[t.category]||0)+1; return acc; },{});
const CATEGORIES = [
  { id:"all",        name:"All Tools",   icon:Grid,      count:TOOLS.length },
  { id:"writing",    name:"AI Writing",  icon:BookOpen,  count:catCount.writing||0,    trend:"+28%" },
  { id:"coding",     name:"AI Coding",   icon:Code,      count:catCount.coding||0,     trend:"+55%" },
  { id:"design",     name:"AI Design",   icon:Palette,   count:catCount.design||0,     trend:"+38%" },
  { id:"video",      name:"AI Video",    icon:Video,     count:catCount.video||0,      trend:"+72%" },
  { id:"audio",      name:"AI Audio",    icon:Mic,       count:catCount.audio||0,      trend:"+44%" },
  { id:"research",   name:"AI Research", icon:Brain,     count:catCount.research||0,   trend:"+32%" },
  { id:"automation", name:"Automation",  icon:Zap,       count:catCount.automation||0, trend:"+48%" },
  { id:"data",       name:"AI Data",     icon:BarChart2, count:catCount.data||0,       trend:"+22%" },
  { id:"hr",         name:"AI HR",       icon:Users,     count:catCount.hr||0,         trend:"+18%" },
];

const ALL_TREND = [
  { m:"Jul'24",ChatGPT:161,Claude:13,Gemini:38,Cursor:2.1,Perplexity:9    },
  { m:"Aug'24",ChatGPT:163,Claude:14,Gemini:40,Cursor:2.4,Perplexity:9.8  },
  { m:"Sep'24",ChatGPT:165,Claude:15,Gemini:44,Cursor:2.8,Perplexity:11   },
  { m:"Oct'24",ChatGPT:168,Claude:16.5,Gemini:46,Cursor:3.1,Perplexity:12 },
  { m:"Nov'24",ChatGPT:170,Claude:17,Gemini:48,Cursor:3.4,Perplexity:13   },
  { m:"Dec'24",ChatGPT:172,Claude:18,Gemini:50,Cursor:3.6,Perplexity:13.5 },
  { m:"Jan'25", ChatGPT:174,Claude:22, Gemini:55,Cursor:3.8,Perplexity:14.5 },
  { m:"Feb'25", ChatGPT:176,Claude:28, Gemini:58,Cursor:3.9,Perplexity:15   },
  { m:"Mar'25", ChatGPT:178,Claude:34, Gemini:62,Cursor:4.0,Perplexity:15.5 },
  { m:"Apr'25", ChatGPT:180,Claude:38, Gemini:68,Cursor:4.1,Perplexity:16   },
  { m:"May'25", ChatGPT:200,Claude:40, Gemini:72,Cursor:4.2,Perplexity:16.5 },
];
const RANGE_SLICES = { "3M":3, "6M":6, "1Y":11, "2Y":11 };

const CATEGORY_GROWTH = [
  { cat:"Video",      growth:52, fill:"#14b8a6" },{ cat:"Automation",growth:38,fill:"#f59e0b" },
  { cat:"Design",     growth:31, fill:"#ec4899" },{ cat:"Audio",      growth:29,fill:"#8b5cf6" },
  { cat:"Coding",     growth:24, fill:"#6366f1" },{ cat:"Research",   growth:22,fill:"#0ea5e9" },
  { cat:"Writing",    growth:18, fill:"#10a37f" },{ cat:"Data",       growth:15,fill:"#3b82f6" },
  { cat:"HR",         growth:11, fill:"#d97706" },
];

const COUNTRIES = [
  { name:"United States", cc:"US",x:135,y:172,r:22,adopt:96,top:"ChatGPT, Claude" },
  { name:"Canada",        cc:"CA",x:148,y:130,r:12,adopt:88,top:"ChatGPT, Cursor" },
  { name:"Brazil",        cc:"BR",x:208,y:298,r:14,adopt:72,top:"ChatGPT, Canva AI" },
  { name:"Mexico",        cc:"MX",x:148,y:208,r:9, adopt:65,top:"ChatGPT, Canva AI" },
  { name:"Argentina",     cc:"AR",x:202,y:338,r:9, adopt:60,top:"ChatGPT, Midjourney" },
  { name:"United Kingdom",cc:"GB",x:355,y:128,r:12,adopt:90,top:"Claude, ChatGPT" },
  { name:"Germany",       cc:"DE",x:388,y:130,r:11,adopt:86,top:"ChatGPT, Mistral" },
  { name:"France",        cc:"FR",x:372,y:140,r:10,adopt:82,top:"Mistral, ChatGPT" },
  { name:"Netherlands",   cc:"NL",x:378,y:122,r:7, adopt:84,top:"ChatGPT, Cursor" },
  { name:"Sweden",        cc:"SE",x:403,y:108,r:8, adopt:80,top:"ChatGPT, Copilot" },
  { name:"Spain",         cc:"ES",x:358,y:152,r:9, adopt:75,top:"ChatGPT, Jasper" },
  { name:"Poland",        cc:"PL",x:410,y:128,r:7, adopt:74,top:"ChatGPT, Cursor" },
  { name:"Russia",        cc:"RU",x:530,y:115,r:14,adopt:52,top:"GigaChat, ChatGPT" },
  { name:"India",         cc:"IN",x:548,y:218,r:18,adopt:85,top:"ChatGPT, Canva AI" },
  { name:"China",         cc:"CN",x:600,y:182,r:18,adopt:70,top:"Qwen, Doubao" },
  { name:"Japan",         cc:"JP",x:652,y:178,r:12,adopt:82,top:"ChatGPT, Character.AI" },
  { name:"South Korea",   cc:"KR",x:638,y:188,r:9, adopt:80,top:"CLOVA X, ChatGPT" },
  { name:"Singapore",     cc:"SG",x:612,y:248,r:7, adopt:78,top:"ChatGPT, Claude" },
  { name:"Australia",     cc:"AU",x:632,y:322,r:13,adopt:83,top:"ChatGPT, Claude" },
  { name:"UAE",           cc:"AE",x:504,y:208,r:8, adopt:76,top:"ChatGPT, Claude" },
  { name:"Saudi Arabia",  cc:"SA",x:492,y:220,r:9, adopt:70,top:"ChatGPT, Jasper" },
  { name:"Israel",        cc:"IL",x:468,y:196,r:6, adopt:82,top:"ChatGPT, Perplexity" },
  { name:"South Africa",  cc:"ZA",x:415,y:320,r:9, adopt:58,top:"ChatGPT, Canva AI" },
  { name:"Nigeria",       cc:"NG",x:375,y:255,r:8, adopt:50,top:"ChatGPT, Canva AI" },
  { name:"Egypt",         cc:"EG",x:448,y:210,r:7, adopt:55,top:"ChatGPT, Jasper" },
  { name:"Turkey",        cc:"TR",x:456,y:168,r:9, adopt:68,top:"ChatGPT, ElevenLabs" },
  { name:"Indonesia",     cc:"ID",x:620,y:265,r:10,adopt:62,top:"ChatGPT, Canva AI" },
  { name:"Pakistan",      cc:"PK",x:546,y:198,r:8, adopt:54,top:"ChatGPT, Claude" },
  { name:"Bangladesh",    cc:"BD",x:570,y:215,r:6, adopt:48,top:"ChatGPT, Canva AI" },
];
const REGIONS = [
  { name:"North America",adopt:92,growth:"+18%",top:["ChatGPT","Claude","Cursor"],      color:"var(--accent)" },
  { name:"Europe",       adopt:85,growth:"+22%",top:["ChatGPT","Mistral AI","Claude"],  color:"#A78BFA" },
  { name:"South Asia",   adopt:74,growth:"+38%",top:["ChatGPT","Canva AI","Claude"],    color:"#34d399" },
  { name:"East Asia",    adopt:76,growth:"+28%",top:["ChatGPT","Qwen","Character.AI"],  color:"#fb923c" },
  { name:"ANZ",          adopt:83,growth:"+20%",top:["ChatGPT","Claude","Canva AI"],    color:"#f472b6" },
  { name:"Middle East",  adopt:68,growth:"+45%",top:["ChatGPT","Claude","Jasper"],      color:"#fbbf24" },
  { name:"Latin America",adopt:62,growth:"+32%",top:["ChatGPT","Canva AI","Midjourney"],color:"#4ade80" },
  { name:"Africa",       adopt:50,growth:"+55%",top:["ChatGPT","Canva AI","Claude"],    color:"#f87171" },
];

const JOB_STATS = [
  { label:"AI Job Openings",       value:"~240K",  icon:Briefcase,   color:"var(--accent)", sub:"est. across major platforms" },
  { label:"Avg. Senior AI Salary", value:"~$212K", icon:DollarSign,  color:"#3DD68C", sub:"est. USD total comp (US)" },
  { label:"Remote Job Share",      value:"~68%",   icon:Globe,       color:"#A78BFA", sub:"of tracked AI roles" },
  { label:"YoY Hiring Growth",     value:"+89%",   icon:TrendingUp,  color:"#f59e0b", sub:"est. vs prior year" },
];
const TOP_SKILLS = [
  { skill:"Python + ML Libs",     openings:45200, growth:"+62%",  color:"var(--accent)" },
  { skill:"Prompt Engineering",   openings:24800, growth:"+145%", color:"#A78BFA" },
  { skill:"OpenAI / Claude API",  openings:22600, growth:"+180%", color:"#10a37f" },
  { skill:"LangChain / LlamaIndex",openings:18200,growth:"+220%", color:"#f59e0b" },
  { skill:"RAG Systems",          openings:14500, growth:"+310%", color:"#ec4899" },
  { skill:"GitHub Copilot",       openings:13800, growth:"+95%",  color:"var(--fg-3)" },
  { skill:"AI Agents",            openings:11400, growth:"+450%", color:"#14b8a6" },
  { skill:"Fine-tuning LLMs",     openings:9600,  growth:"+190%", color:"#8b5cf6" },
  { skill:"Vector Databases",     openings:8200,  growth:"+280%", color:"#f97316" },
  { skill:"LLMOps / MLFlow",      openings:7800,  growth:"+165%", color:"#6366f1" },
];
const SALARY_DATA = [
  { role:"Prompt Eng",  junior:85, mid:108,senior:135,freelance:95 },
  { role:"ML Engineer", junior:105,mid:145,senior:195,freelance:140},
  { role:"AI PM",       junior:110,mid:148,senior:185,freelance:160},
  { role:"LLM Engineer",junior:115,mid:158,senior:215,freelance:175},
  { role:"AI Researcher",junior:120,mid:165,senior:230,freelance:190},
  { role:"Safety Eng",  junior:130,mid:175,senior:245,freelance:200},
  { role:"Staff AI Eng",junior:160,mid:215,senior:310,freelance:240},
];
const ROLE_PIE = [
  { name:"Engineering", value:42,color:"var(--accent)"},{ name:"Research",   value:18,color:"#A78BFA"},
  { name:"Product/PM",  value:14,color:"#3DD68C"},{ name:"Data Science",value:12,color:"#f59e0b"},
  { name:"Sales/GTM",   value:8, color:"#ec4899"},{ name:"Other",       value:6, color:"var(--fg-3)"},
];
const REGIONAL_JOBS = [
  { region:"San Francisco",jobs:38400,growth:"+22%",color:"var(--accent)"},{ region:"New York",   jobs:24600,growth:"+31%",color:"#A78BFA"},
  { region:"London",       jobs:18200,growth:"+45%",color:"#3DD68C"},{ region:"Bengaluru",  jobs:16500,growth:"+88%",color:"#f59e0b"},
  { region:"Seattle",      jobs:14800,growth:"+18%",color:"#ec4899"},{ region:"Berlin",     jobs:12200,growth:"+62%",color:"#14b8a6"},
  { region:"Singapore",    jobs:9800, growth:"+74%",color:"#f97316"},{ region:"Toronto",    jobs:8400, growth:"+55%",color:"#8b5cf6"},
];
const TOP_COMPANIES = [
  { name:"OpenAI",       openings:420, yoy:"+85%", badges:["Research","Eng"]   },
  { name:"Anthropic",    openings:280, yoy:"+120%",badges:["Safety","Research"] },
  { name:"Google DeepMind",openings:1200,yoy:"+42%",badges:["Research","Product"]},
  { name:"Microsoft",    openings:2800,yoy:"+65%", badges:["Engineering","PM"]  },
  { name:"Meta AI",      openings:1600,yoy:"+55%", badges:["Research","Eng"]    },
  { name:"Nvidia",       openings:940, yoy:"+92%", badges:["Infra","Research"]  },
  { name:"Hugging Face", openings:180, yoy:"+145%",badges:["OSS","Research"]    },
  { name:"Stability AI", openings:95,  yoy:"+38%", badges:["Design","Research"] },
];

const REC_STEPS = [
  { id:"usecase", q:"What is your primary AI use case?",
    opts:[
      { val:"writing",    label:"Writing & Content",   icon:FileText,  desc:"Blog posts, copy, emails" },
      { val:"coding",     label:"AI Coding",           icon:Terminal,  desc:"Code generation & review" },
      { val:"design",     label:"Design & Visuals",    icon:Palette,   desc:"Images, video, creative" },
      { val:"research",   label:"Research & Analysis", icon:Brain,     desc:"Search, summarize, analyze" },
      { val:"automation", label:"Workflow Automation",  icon:Zap,       desc:"Connect apps, automate tasks" },
      { val:"video",      label:"Video & Audio",       icon:Video,     desc:"Video gen, voice, podcasts" },
    ]
  },
  { id:"budget", q:"What is your monthly budget?",
    opts:[
      { val:"free", label:"Free only",          icon:Sparkles,      desc:"No subscription costs" },
      { val:"low",  label:"Under $25/mo",       icon:DollarSign,      desc:"Light usage budget" },
      { val:"mid",  label:"$25–$100/mo",        icon:CreditCard,    desc:"Professional use" },
      { val:"high", label:"$100+ / Enterprise", icon:Briefcase,     desc:"Team or enterprise plan" },
    ]
  },
  { id:"priority", q:"What matters most? (pick up to 2)", multi:true,
    opts:[
      { val:"performance", label:"Raw Performance", icon:Rocket,    desc:"Best output quality" },
      { val:"value",       label:"Cost Efficiency", icon:Star,       desc:"Best bang for buck" },
      { val:"ease",        label:"Ease of Use",     icon:Sparkles,  desc:"Minimal learning curve" },
      { val:"api",         label:"API & Dev Tools", icon:Plug,      desc:"Developer-friendly" },
      { val:"privacy",     label:"Privacy & Safety",icon:Lock,      desc:"Secure, responsible AI" },
      { val:"openSource",  label:"Open Source",     icon:BookOpen,desc:"Full model access" },
    ]
  },
];

const PRESET_STACKS = [
  { id:"startup",   name:"Startup Stack",    icon:Rocket,    color:"var(--accent)", desc:"Lean, high-leverage stack for early teams",       tools:[1,9,30,33]   },
  { id:"creator",   name:"Creator Stack",    icon:Palette,   color:"#ec4899", desc:"Full creative suite for content creators",        tools:[1,16,21,26,27]},
  { id:"developer", name:"Developer Stack",  icon:Terminal,  color:"#6366f1", desc:"AI-accelerated development environment",          tools:[2,9,10,12,5]  },
  { id:"marketer",  name:"Marketer Stack",   icon:TrendingUp, color:"#f59e0b", desc:"End-to-end AI toolkit for marketing teams",       tools:[1,17,18,23,8] },
  { id:"researcher",name:"Researcher Stack", icon:Brain,     color:"#3DD68C", desc:"Deep research and knowledge synthesis toolkit",   tools:[2,30,31,32]   },
  { id:"enterprise",name:"Enterprise Stack", icon:Briefcase, color:"#A78BFA", desc:"Scalable, secure AI for large organizations",     tools:[2,3,10,36,41] },
];

const TRENDING_TICKER = [
  "DeepSeek R2 matches o3 at 1/100th the cost","Claude 4 Opus reaches #1 on LMSYS Chatbot Arena",
  "Cursor crosses 4M developers — fastest growth in dev tools","Sora 2.0 enables real-time video generation",
  "Google Gemini 2.5 Pro tops coding benchmarks","Windsurf raises $150M Series B at $1.25B valuation",
  "AI coding tools used by 78% of professional developers","ElevenLabs now supports 32 neural voice languages",
];
const HERO_STATS = [
  { label:"Featured Tools",    value:"42+",   icon:Database  },
  { label:"Countries Mapped",  value:"29",    icon:Globe     },
  { label:"Est. Global Users", value:"2B+",   icon:Users     },
  { label:"Est. Job Openings", value:"~320K", icon:Briefcase },
];
const NAV_TABS    = ["Explore","Global Trends","AI Jobs","Compare","AI Picks","My Stack","Saved"];
const MOBILE_TABS = [
  { id:"Explore",       icon:Home,        label:"Explore"  },
  { id:"Global Trends", icon:Globe,       label:"Trends"   },
  { id:"AI Jobs",       icon:Briefcase,   label:"Jobs"     },
  { id:"AI Picks",      icon:Wand2,       label:"AI Picks" },
  { id:"My Stack",      icon:Package,     label:"My Stack" },
];
const TAG_COLORS  = { "GPT-4o":"#10a37f","Multimodal":"#6366f1","Agentic":"#8b5cf6","Voice AI":"#ec4899","Open Source":"#22c55e","Constitutional AI":"#d97706","Long Context":"#0ea5e9" };
const TOOL_COLORS = ["var(--accent)","#3DD68C","#60A5FA","#A78BFA","#F87171","#FB923C"];
const RADAR_KEYS  = ["intelligence","speed","value","context","coding","multimodal"];
const RADAR_LABELS= { intelligence:"Intelligence",speed:"Speed",value:"Value",context:"Context",coding:"Coding",multimodal:"Multimodal" };
const scoreColor  = sc => sc>=90?"#3DD68C":sc>=80?"#f59e0b":"#ef4444";

function scoreMatch(tool, answers) {
  const { usecase, budget, priority: priorities=[] } = answers;
  let points=0, max=0;
  max+=40;
  if (usecase) {
    if (tool.useCases?.includes(usecase)) points+=40;
    else if (tool.category===usecase) points+=20;
  }
  max+=30;
  const planPrice = parseFloat(tool.pricing.plan?.replace(/[^0-9.]/g,"")||"999");
  if (budget==="free") { points+= tool.pricing.free ? 30 : 0; }
  else if (budget==="low") { points+= tool.pricing.free ? 28 : planPrice<=25 ? 22 : planPrice<=50 ? 10 : 0; }
  else if (budget==="mid") { points+= planPrice<=100 ? 26 : planPrice<=200 ? 18 : 10; }
  else if (budget==="high") { points+= tool.enterprise ? 28 : 18; }
  max+=30;
  const applied = (priorities||[]).slice(0,2);
  applied.forEach(p => {
    if (p==="performance") points+= Math.round((tool.score/100)*15);
    if (p==="value")       points+= tool.pricing.free ? 15 : planPrice<=20 ? 12 : 6;
    if (p==="ease")        points+= tool.metrics.rating>=4.7 ? 15 : tool.metrics.rating>=4.5 ? 10 : 5;
    if (p==="api")         points+= tool.pricing.api ? 15 : 0;
    if (p==="privacy")     points+= ["Claude","Mistral AI"].includes(tool.name)?15:tool.enterprise?7:2;
    if (p==="openSource")  points+= tool.openSource ? 15 : 0;
  });
  return Math.min(99, max>0 ? Math.round((points/max)*100) : 50);
}

function ChartTip({ active, payload, label }) {
  if (!active||!payload?.length) return null;
  return (
    <div style={{ background:"var(--bg)",border:"1px solid var(--border)",borderRadius:8,padding:"10px 14px",boxShadow:"0 2px 8px rgba(0,0,0,0.06)" }}>
      <p style={{ fontSize:11,color:"var(--fg-3)",marginBottom:6,fontFamily:"'Montserrat',sans-serif",textTransform:"uppercase",letterSpacing:"0.06em" }}>{label}</p>
      {payload.map((p,i)=>(
        <div key={i} style={{ display:"flex",alignItems:"center",gap:8,marginBottom:3 }}>
          <span style={{ width:8,height:8,borderRadius:8,background:p.color||p.fill,flexShrink:0 }}/>
          <span style={{ fontSize:11,color:"var(--fg-3)",fontFamily:"'Montserrat',sans-serif" }}>{p.name}:</span>
          <span style={{ fontSize:11,fontWeight:700,color:"var(--fg)",fontFamily:"'Montserrat',sans-serif" }}>{p.value}{p.unit||""}</span>
        </div>
      ))}
    </div>
  );
}

// ── react-simple-maps equivalent using d3-geo (d3 is available; RSM isn't) ──
// Lat/lng for each country in COUNTRIES (decimal degrees)

function WorldMap() {
  const [hov, setHov] = useState(null);

  const SCALE = [
    { min:0,  max:50,  col:"#E5E7EB", label:"< 50%",  tier:"MINIMAL" },
    { min:50, max:62,  col:"#C4B5FD", label:"50–62%", tier:"LOW"     },
    { min:62, max:75,  col:"#A78BFA", label:"62–75%", tier:"MED"     },
    { min:75, max:88,  col:"#7C3AED", label:"75–88%", tier:"HIGH"    },
    { min:88, max:101, col:"var(--accent)", label:"88%+",   tier:"LEADER"  },
  ];
  const adC    = a => SCALE.find(s => a >= s.min && a < s.max)?.col ?? "#1E2030";
  const tierOf = a => SCALE.find(s => a >= s.min && a < s.max)?.tier ?? "";
  const yoyEst = a => a>=88?"+18%":a>=75?"+28%":a>=62?"+41%":a>=50?"+57%":"+71%";
  const tierCounts = SCALE.map(s => COUNTRIES.filter(c => c.adopt >= s.min && c.adopt < s.max).length);
  const ccMap = Object.fromEntries(COUNTRIES.map(c => [c.cc, c]));

  // Tile grid positions [col, row] — geographically approximate
  const TILES = {
    // Americas
    CA:[2,1], US:[2,2], MX:[2,3], BR:[3,4], AR:[3,5],
    // Europe
    SE:[9,0], GB:[7,1], NL:[8,1],
    FR:[6,2], DE:[7,2], PL:[8,2],
    ES:[6,3],
    // Russia
    RU:[12,1],
    // Middle East & Africa
    TR:[10,2],
    IL:[10,3], EG:[10,4], NG:[9,4], AE:[11,3], SA:[11,4], ZA:[10,5],
    // South & East Asia
    PK:[13,2], IN:[14,2],
    BD:[14,3],
    CN:[16,2], KR:[17,2], JP:[18,2],
    SG:[16,3], ID:[16,4],
    // Oceania
    AU:[17,4],
  };

  const CELL = 34, GAP = 4, S = CELL + GAP;
  const W = 20 * S + 10, H = 7 * S + 52;

  // Region background zones
  const ZONES = [
    { label:"AMERICAS",    x:1*S,  y:0*S,  w:3*S,  h:6*S,  col:"rgba(0,0,0,0.025)" },
    { label:"EUROPE",      x:5*S,  y:-2,   w:5*S,  h:5*S,  col:"rgba(0,0,0,0.025)" },
    { label:"RUSSIA",      x:11*S, y:0,    w:2*S,  h:2*S,  col:"rgba(0,0,0,0.025)" },
    { label:"M. EAST & AFRICA", x:9*S, y:2*S, w:3*S, h:4*S, col:"rgba(0,0,0,0.025)" },
    { label:"ASIA",        x:12*S, y:0,    w:7*S,  h:5*S,  col:"rgba(0,0,0,0.025)" },
    { label:"OCEANIA",     x:16*S, y:4*S,  w:3*S,  h:2*S,  col:"rgba(0,0,0,0.025)" },
  ];

  // Smart tooltip positioning
  const ttip = hov ? (() => {
    const [tc, tr] = TILES[hov.cc] || [0,0];
    const bx = tc * S + 6, by = tr * S + 6;
    const tw = 212, th = 106;
    const tx = bx + CELL + 8 + tw > W ? bx - tw - 8 : bx + CELL + 8;
    const ty = Math.max(4, Math.min(by - 4, H - th - 4));
    return { tx, ty, tw, th };
  })() : null;

  return (
    <div style={{ position:"relative", borderRadius:10, overflow:"hidden", border:"1px solid var(--border)" }}>
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width:"100%", display:"block", background:"var(--bg)" }}
        aria-label="Tile map showing AI adoption rates by country">

        {/* Region zones */}
        {ZONES.map(z => (
          <g key={z.label}>
            <rect x={z.x+5} y={z.y+5} width={z.w-8} height={z.h-8} rx={6}
              fill={z.col} stroke="#E5E2DB" strokeWidth={0.5}/>
            <text x={z.x+12} y={z.y+16} fontSize={6.5} fill="#9CA3AF"
              fontFamily="PT Mono,monospace" letterSpacing="1.2">{z.label}</text>
          </g>
        ))}

        {/* Country tiles */}
        {Object.entries(TILES).map(([cc, [col, row]]) => {
          const ctry = ccMap[cc];
          if (!ctry) return null;
          const x = col * S + 6, y = row * S + 6;
          const fill = adC(ctry.adopt);
          const on = hov?.cc === cc;
          const dark = ctry.adopt >= 62;
          return (
            <g key={cc} style={{ cursor:"pointer" }}
              onMouseEnter={() => setHov(ctry)}
              onMouseLeave={() => setHov(null)}>
              {/* Glow on hover */}
              {on && <rect x={x-3} y={y-3} width={CELL+6} height={CELL+6} rx={7}
                fill={fill} opacity={0.2}/>}
              {/* Tile */}
              <rect x={x} y={y} width={CELL} height={CELL} rx={4}
                fill={fill}
                opacity={on ? 1 : 0.88}
                stroke={on ? "rgba(255,255,255,0.7)" : "rgba(139,92,246,0.1)"}
                strokeWidth={on ? 1.5 : 0.5}/>
              {/* Adoption bar at bottom of tile */}
              <rect x={x+2} y={y+CELL-5} width={CELL-4} height={3} rx={1}
                fill="rgba(0,0,0,0.08)"/>
              <rect x={x+2} y={y+CELL-5} width={Math.round((ctry.adopt/100)*(CELL-4))} height={3} rx={1}
                fill={dark ? "rgba(0,0,0,0.4)" : "rgba(255,255,255,0.5)"}/>
              {/* Country code */}
              <text x={x + CELL/2} y={y + CELL/2 - 2}
                textAnchor="middle" dominantBaseline="middle"
                fontSize={8} fontWeight={800}
                fill="#FFFFFF"
                fontFamily="PT Mono,monospace" pointerEvents="none">
                {cc}
              </text>
            </g>
          );
        })}

        {/* Tooltip */}
        {hov && ttip && (() => {
          const { tx, ty, tw, th } = ttip;
          const fill = adC(hov.adopt);
          const rank = [...COUNTRIES].sort((a,b) => b.adopt - a.adopt).findIndex(x => x.cc === hov.cc) + 1;
          const barW = Math.round((hov.adopt / 100) * (tw - 20));
          return (
            <g pointerEvents="none" style={{ filter:"drop-shadow(0 6px 16px rgba(0,0,0,0.8))" }}>
              <rect x={tx} y={ty} width={tw} height={th} rx={7}
                fill="#FFFFFF" stroke={fill} strokeWidth={1.2}/>
              <rect x={tx} y={ty} width={tw} height={22} rx={7} fill={fill} opacity={0.12}/>
              <rect x={tx} y={ty+16} width={tw} height={6} fill={fill} opacity={0.12}/>
              {/* Name */}
              <text x={tx+10} y={ty+14} fontSize={11} fill="#111111" fontWeight={700}
                fontFamily="Montserrat,sans-serif">{hov.name}</text>
              {/* Tier badge */}
              <rect x={tx+tw-52} y={ty+5} width={42} height={13} rx={3} fill={fill} opacity={0.2}/>
              <text x={tx+tw-31} y={ty+13.5} textAnchor="middle" fontSize={7.5} fill={fill}
                fontWeight={800} fontFamily="PT Mono,monospace">{tierOf(hov.adopt)}</text>
              {/* Labels */}
              <text x={tx+10}  y={ty+37} fontSize={7} fill="#9CA3AF" fontFamily="PT Mono,monospace">ADOPTION</text>
              <text x={tx+86}  y={ty+37} fontSize={7} fill="#9CA3AF" fontFamily="PT Mono,monospace">YOY EST.</text>
              <text x={tx+160} y={ty+37} fontSize={7} fill="#9CA3AF" fontFamily="PT Mono,monospace">RANK</text>
              {/* Values */}
              <text x={tx+10}  y={ty+52} fontSize={15} fill={fill} fontWeight={800}
                fontFamily="PT Mono,monospace">{hov.adopt}%</text>
              <text x={tx+86}  y={ty+52} fontSize={13} fill="#3DD68C" fontWeight={800}
                fontFamily="PT Mono,monospace">{yoyEst(hov.adopt)}</text>
              <text x={tx+160} y={ty+52} fontSize={13} fill="#9CA3AF" fontWeight={600}
                fontFamily="PT Mono,monospace">#{rank}</text>
              {/* Progress bar */}
              <rect x={tx+10} y={ty+59} width={tw-20} height={3} rx={2} fill="#E5E2DB"/>
              <rect x={tx+10} y={ty+59} width={barW}  height={3} rx={2} fill={fill} opacity={0.9}/>
              {/* Divider + tools */}
              <line x1={tx+8} y1={ty+69} x2={tx+tw-8} y2={ty+69} stroke="#E5E2DB"/>
              <text x={tx+10} y={ty+80} fontSize={7} fill="#9CA3AF" fontFamily="PT Mono,monospace">TOP TOOLS</text>
              <text x={tx+10} y={ty+94} fontSize={9} fill="#374151" fontFamily="Montserrat,sans-serif">{hov.top}</text>
            </g>
          );
        })()}

        {/* Legend */}
        <g transform={`translate(6,${6 * S + 16})`}>
          <text x={0} y={-2} fontSize={6.5} fill="#6B7280"
            fontFamily="PT Mono,monospace" letterSpacing="1.4">AI ADOPTION INTENSITY</text>
          {SCALE.map((s,i) => (
            <g key={i} transform={`translate(${i*138},6)`}>
              <rect x={0} y={0} width={18} height={10} rx={2} fill={s.col}/>
              <rect x={0} y={0} width={18} height={10} rx={2}
                fill="none" stroke="rgba(0,0,0,0.18)" strokeWidth={0.5}/>
              <text x={23} y={8.5} fontSize={8.5} fill="#9CA3AF"
                fontFamily="PT Mono,monospace">{s.label}</text>
              <text x={66} y={8.5} fontSize={7.5} fill="#6B7280"
                fontFamily="PT Mono,monospace">({tierCounts[i]})</text>
            </g>
          ))}
        </g>

      </svg>
    </div>
  );
}
// ── ToolRow — data broadsheet row (covid19virusdata.com inspired) ──
function ToolRow({ tool, index, saved, onSave, onToast }) {
  const [exp, setExp] = useState(false);
  const scoreC = tool.score>=90?"var(--accent)":tool.score>=80?"#3DD68C":"var(--fg-3)";
  const openSite = () => tool.website && window.open(tool.website,"_blank","noopener,noreferrer");
  return (
    <div className="tool-row" style={{ borderBottom:"1px solid var(--border)" }}>
      {/* ── Main row ── */}
      <div style={{ display:"flex", alignItems:"center", gap:0, padding:"12px 0", minHeight:58 }}>
        {/* Rank */}
        <span style={{ fontSize:10, color:"var(--fg-3)", fontFamily:"'Azeret Mono',monospace",
          minWidth:36, textAlign:"right", paddingRight:12, flexShrink:0 }}>
          {String(index+1).padStart(2,"0")}
        </span>

        {/* Logo */}
        <div style={{ flexShrink:0, marginRight:14 }}>
          <BrandIcon tool={tool} size={36}/>
        </div>

        {/* Name + company */}
        <div style={{ flex:"0 0 180px", minWidth:0 }}>
          <div style={{ display:"flex", alignItems:"center", gap:6, flexWrap:"wrap" }}>
            <span style={{ fontSize:14, fontWeight:700, color:"var(--fg)", letterSpacing:"-0.01em" }}>{tool.name}</span>
            {tool.trending && <span style={{ fontSize:8, fontWeight:800, color:"var(--accent)",
              fontFamily:"'Azeret Mono',monospace", letterSpacing:"0.08em", textTransform:"uppercase",
              border:"1px solid var(--accent)", padding:"1px 5px", flexShrink:0 }}>TRENDING</span>}
          </div>
          <div style={{ fontSize:9, color:"var(--fg-3)", fontFamily:"'Azeret Mono',monospace",
            textTransform:"uppercase", letterSpacing:"0.07em", marginTop:2 }}>{tool.company}</div>
        </div>

        {/* Score bar + value */}
        <div style={{ flex:"0 0 200px", display:"flex", alignItems:"center", gap:10 }}>
          <div style={{ flex:1, height:2, background:"var(--elevated)" }}>
            <div style={{ width:`${tool.score}%`, height:"100%", background:scoreC, transition:"width 0.6s ease" }}/>
          </div>
          <span style={{ fontSize:14, fontWeight:800, color:scoreC,
            fontFamily:"'Azeret Mono',monospace", minWidth:28, textAlign:"right" }}>{tool.score}</span>
        </div>

        {/* Users */}
        <div style={{ flex:"0 0 80px", paddingLeft:20 }}>
          <div style={{ fontSize:13, fontWeight:700, color:"var(--fg)",
            fontFamily:"'Azeret Mono',monospace", letterSpacing:"-0.02em" }}>{tool.metrics.users}</div>
          <div style={{ fontSize:8, color:"var(--fg-3)", textTransform:"uppercase",
            letterSpacing:"0.1em", fontFamily:"'Azeret Mono',monospace", marginTop:1 }}>USERS</div>
        </div>

        {/* Growth */}
        <div style={{ flex:"0 0 60px" }}>
          <span style={{ fontSize:12, fontWeight:800, color:"#3DD68C",
            fontFamily:"'Azeret Mono',monospace" }}>{tool.metrics.growth}</span>
        </div>

        {/* Rating */}
        <div style={{ flex:"0 0 50px", display:"flex", alignItems:"center", gap:3 }}>
          <Star size={10} color="var(--accent)" fill="#8B5CF6"/>
          <span style={{ fontSize:11, fontWeight:700, color:"var(--fg-2)",
            fontFamily:"'Azeret Mono',monospace" }}>{tool.metrics.rating}</span>
        </div>

        {/* Tags */}
        <div style={{ flex:1, display:"flex", gap:8, flexWrap:"wrap", paddingLeft:8 }}>
          {tool.tags.slice(0,2).map(t=>(
            <span key={t} style={{ fontSize:9, color:"var(--fg-3)",
              fontFamily:"'Azeret Mono',monospace", textTransform:"uppercase", letterSpacing:"0.06em" }}>{t}</span>
          ))}
        </div>

        {/* Actions */}
        <div style={{ display:"flex", gap:4, flexShrink:0 }}>
          {tool.pricing.free && <span style={{ fontSize:8, color:"#3DD68C", fontFamily:"'Azeret Mono',monospace",
            border:"1px solid #3DD68C33", padding:"2px 6px", textTransform:"uppercase", letterSpacing:"0.07em" }}>FREE</span>}
          <button type="button" onClick={()=>onSave(tool.id)}
            style={{ background:"none", border:"none", cursor:"pointer", color:saved?"var(--accent)":"var(--fg-3)", padding:"4px 6px" }}
            aria-pressed={saved}>
            {saved?<BookmarkCheck size={13}/>:<Bookmark size={13}/>}
          </button>
          <button type="button" onClick={openSite}
            style={{ background:"none", border:"none", cursor:"pointer", color:"var(--fg-3)", padding:"4px 6px" }}>
            <ExternalLink size={13}/>
          </button>
          <button type="button" onClick={()=>setExp(e=>!e)}
            style={{ background:"none", border:"none", cursor:"pointer", color:"var(--fg-3)", padding:"4px 6px",
              display:"flex", alignItems:"center", gap:3, fontSize:9, fontFamily:"'Azeret Mono',monospace",
              textTransform:"uppercase", letterSpacing:"0.06em" }} className="expand-btn">
            {exp?"LESS":"MORE"}<ChevronDown size={10} style={{ transform:exp?"rotate(180deg)":"none", transition:"transform 0.2s" }}/>
          </button>
        </div>
      </div>

      {/* ── Expanded detail ── */}
      {exp && (
        <div style={{ paddingBottom:16, paddingLeft:50, display:"grid",
          gridTemplateColumns:"2fr 1fr 1fr", gap:24, borderTop:"1px solid var(--border)" }}>
          <div style={{ paddingTop:12 }}>
            <div style={{ fontSize:8, color:"var(--fg-3)", textTransform:"uppercase",
              letterSpacing:"0.12em", fontFamily:"'Azeret Mono',monospace", marginBottom:6 }}>DESCRIPTION</div>
            <p style={{ fontSize:12, color:"var(--fg-2)", lineHeight:1.6 }}>{tool.description}</p>
            <div style={{ display:"flex", flexWrap:"wrap", gap:6, marginTop:8 }}>
              {tool.features.map(f=>(
                <span key={f} style={{ fontSize:9, color:"var(--fg-3)", background:"var(--elevated)",
                  padding:"2px 8px", fontFamily:"'Azeret Mono',monospace" }}>{f}</span>
              ))}
            </div>
          </div>
          <div style={{ paddingTop:12 }}>
            <div style={{ fontSize:8, color:"var(--fg-3)", textTransform:"uppercase",
              letterSpacing:"0.12em", fontFamily:"'Azeret Mono',monospace", marginBottom:8 }}>PRICING</div>
            <div style={{ display:"flex", flexDirection:"column", gap:4 }}>
              {tool.pricing.free&&<span style={{ fontSize:11, color:"#3DD68C", fontFamily:"'Azeret Mono',monospace" }}>✓ Free tier available</span>}
              {tool.pricing.plan&&<span style={{ fontSize:11, color:"var(--accent)", fontFamily:"'Azeret Mono',monospace" }}>{tool.pricing.plan}</span>}
              {tool.pricing.api&&<span style={{ fontSize:11, color:"var(--fg-2)", fontFamily:"'Azeret Mono',monospace" }}>API access</span>}
            </div>
          </div>
          <div style={{ paddingTop:12 }}>
            <div style={{ fontSize:8, color:"var(--fg-3)", textTransform:"uppercase",
              letterSpacing:"0.12em", fontFamily:"'Azeret Mono',monospace", marginBottom:8 }}>TAGS</div>
            <div style={{ display:"flex", flexWrap:"wrap", gap:4 }}>
              {tool.tags.map(t=>(
                <span key={t} style={{ fontSize:9, color:"var(--fg-2)", fontFamily:"'Azeret Mono',monospace",
                  border:"1px solid var(--border)", padding:"2px 6px", textTransform:"uppercase", letterSpacing:"0.05em" }}>{t}</span>
              ))}
            </div>
            <div style={{ display:"flex", gap:6, marginTop:8, flexWrap:"wrap" }}>
              {tool.enterprise&&<span style={{ fontSize:9, color:"#60A5FA", fontFamily:"'Azeret Mono',monospace", border:"1px solid #60A5FA33", padding:"2px 6px" }}>ENTERPRISE</span>}
              {tool.openSource&&<span style={{ fontSize:9, color:"#3DD68C", fontFamily:"'Azeret Mono',monospace", border:"1px solid #3DD68C33", padding:"2px 6px" }}>OPEN SOURCE</span>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ToolCard({ tool, saved, onSave, onToast }) {
  const [exp,setExp]=useState(false);
  const openWebsite=()=>{ if(tool.website) window.open(tool.website,"_blank","noopener,noreferrer"); };
  return (
    <article style={s.toolCard} className="tool-card" data-trending={tool.trending ? "true" : undefined}>
      <div style={s.tcHead}>
        <BrandIcon tool={tool} size={46} />
        <div style={s.tcInfo}>
          <div style={{ display:"flex",alignItems:"center",gap:6,flexWrap:"wrap" }}>
            <h3 style={s.tcName}>{tool.name}</h3>
            {tool.trending&&<span style={s.trendBadge}><TrendingUp size={9}/> Trending</span>}
          </div>
          <span style={s.tcCompany}>{tool.company}</span>
        </div>
        <div style={{ display:"flex",gap:4 }}>
          <button type="button" onClick={()=>onSave(tool.id)} style={s.iconBtn} className="icon-btn"
            aria-label={saved?`Remove ${tool.name} from saved`:`Save ${tool.name}`} aria-pressed={saved}>
            {saved?<BookmarkCheck size={15} color="var(--accent)"/>:<Bookmark size={15} color="var(--fg-3)"/>}
          </button>
          <button type="button" onClick={openWebsite} style={s.iconBtn} className="icon-btn"
            aria-label={`Open ${tool.name} website`} disabled={!tool.website}>
            <ExternalLink size={15} color={tool.website?"var(--fg-3)":"var(--fg-2)"}/>
          </button>
        </div>
      </div>
      <div style={{ display:"flex",alignItems:"center",gap:8 }}>
        <div style={s.scoreTrack} role="progressbar" aria-valuenow={tool.score} aria-valuemin={0} aria-valuemax={100}>
          <div style={{ ...s.scoreFill,width:`${tool.score}%`,background:scoreColor(tool.score) }}/>
        </div>
        <span style={{ fontSize:12,fontWeight:700,color:scoreColor(tool.score),minWidth:24,textAlign:"right" }}>{tool.score}</span>
      </div>
      <p style={s.tcDesc}>{tool.description}</p>
      <div style={{ display:"flex",flexWrap:"wrap",gap:5 }}>
        {tool.tags.slice(0,3).map(t=>(
          <span key={t} style={{ fontSize:11,fontWeight:500,padding:"3px 8px",borderRadius:6,background:(TAG_COLORS[t]||"var(--fg-2)")+"22",color:TAG_COLORS[t]||"var(--fg-3)",border:`1px solid ${(TAG_COLORS[t]||"var(--fg-2)")}44` }}>{t}</span>
        ))}
        {tool.tags.length>3&&<span style={s.tagMore}>+{tool.tags.length-3}</span>}
      </div>
      <div style={{ display:"flex",gap:14,flexWrap:"wrap",paddingTop:10,borderTop:"1px solid rgba(255,255,255,0.06)" }}>
        <div style={s.metric}><Users size={11} color="var(--fg-3)"/><span style={s.mv}>{tool.metrics.users}</span></div>
        <div style={s.metric}><TrendingUp size={11} color="#3DD68C"/><span style={{ ...s.mv,color:"#16A34A" }}>{tool.metrics.growth}</span></div>
        <div style={s.metric}><Star size={11} color="#f59e0b" fill="#f59e0b"/><span style={s.mv}>{tool.metrics.rating}</span></div>
        <div style={s.metric}>{tool.regions.slice(0,3).map((r,i)=><span key={i} style={{ fontSize:13 }}>{r}</span>)}</div>
      </div>
      {exp&&(
        <div style={{ display:"flex",flexDirection:"column",gap:10,paddingTop:10,borderTop:"1px solid rgba(255,255,255,0.06)" }}>
          <div>
            <span style={s.exLabel}>Features</span>
            <div style={{ display:"flex",flexWrap:"wrap",gap:5,marginTop:5 }}>
              {tool.features.map(f=><span key={f} style={s.featItem}><CheckCircle2 size={10} color="#3DD68C"/> {f}</span>)}
            </div>
          </div>
          <div>
            <span style={s.exLabel}>Pricing</span>
            <div style={{ display:"flex",gap:6,marginTop:5,flexWrap:"wrap" }}>
              {tool.pricing.free&&<span style={s.pBadge}>Free Plan</span>}
              {tool.pricing.plan&&<span style={s.pPlan}>{tool.pricing.plan}</span>}
              {tool.pricing.api&&<span style={s.pBadge}>API</span>}
            </div>
          </div>
          <div style={{ display:"flex",gap:6 }}>
            {tool.enterprise&&<span style={s.badgeEnt}><Shield size={10}/> Enterprise</span>}
            {tool.openSource&&<span style={s.badgeOS}><Hash size={10}/> Open Source</span>}
          </div>
        </div>
      )}
      <button type="button" style={s.expandBtn} onClick={()=>setExp(e=>!e)} className="expand-btn" aria-expanded={exp}>
        {exp?"Show less":"View details"}
        <ChevronDown size={13} style={{ transform:exp?"rotate(180deg)":"rotate(0)",transition:"transform 0.2s" }}/>
      </button>
    </article>
  );
}

function GlobalTrendsTab() {
  const [timeRange,setTimeRange]=useState("1Y");
  const [hovRegion,setHovRegion]=useState(null);
  const trendData = ALL_TREND.slice(-RANGE_SLICES[timeRange]);
  const topAdopter  = REGIONS.reduce((a,b)=>a.adopt>b.adopt?a:b);
  const fastestGrow = REGIONS.reduce((a,b)=>parseFloat(a.growth)>parseFloat(b.growth)?a:b);
  const KPI_ROW = [
    { label:"Countries Mapped",  value:"29",             sub:"active markets tracked" },
    { label:"Peak Adoption",     value:`${topAdopter.adopt}%`, sub:topAdopter.name },
    { label:"Fastest Growth",    value:fastestGrow.growth,    sub:fastestGrow.name },
    { label:"Top Tool Globally", value:"ChatGPT",        sub:"200M+ MAU · May 2025" },
  ];
  const activeColor = timeRange==="1Y"||timeRange==="2Y" ? "var(--accent)" : "var(--accent)";
  return (
    <div style={{ display:"flex",flexDirection:"column",gap:24 }}>

      {/* ── Dashboard header ── */}
      <div style={{ display:"flex",alignItems:"flex-start",justifyContent:"space-between",flexWrap:"wrap",gap:12 }}>
        <div>
          <h2 style={{ ...s.sectionTitle, display:"flex",alignItems:"center",gap:10 }}>
            <span style={{ width:3,height:16,background:"var(--accent)",borderRadius:2,flexShrink:0,display:"inline-block" }}/>
            Global AI Adoption
          </h2>
          <p style={{ ...s.sectionSub,marginTop:4 }}>Estimated tool usage intensity across 29 markets — updated May 2025</p>
        </div>
        <div style={{ display:"flex",gap:6 }}>
          {["3M","6M","1Y","2Y"].map(r=>(
            <button type="button" key={r} onClick={()=>setTimeRange(r)} aria-pressed={timeRange===r}
              style={{ padding:"5px 12px",fontSize:10,fontFamily:"'PT Mono',monospace",fontWeight:timeRange===r?700:400,
                background:timeRange===r?"rgba(139,92,246,0.1)":"var(--surface)",
                border:timeRange===r?"1px solid rgba(139,92,246,0.45)":"1px solid var(--border)",
                borderRadius:5,color:timeRange===r?"var(--accent)":"var(--fg-3)",cursor:"pointer",transition:"all 0.12s" }} className="chip">{r}</button>
          ))}
        </div>
      </div>

      {/* ── KPI summary bar ── */}
      <div style={{ display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:1,background:"var(--border)",borderRadius:8,overflow:"hidden" }}>
        {KPI_ROW.map(({ label,value,sub },i)=>(
          <div key={label} style={{ background:"var(--surface)",padding:"14px 18px",display:"flex",flexDirection:"column",gap:4 }}>
            <span style={{ fontSize:9,color:"var(--fg-3)",textTransform:"uppercase",letterSpacing:"0.09em",fontFamily:"'PT Mono',monospace" }}>{label}</span>
            <span style={{ fontSize:18,fontWeight:800,color:"var(--accent)",letterSpacing:"-0.025em",fontFamily:"'PT Mono',monospace",lineHeight:1 }}>{value}</span>
            <span style={{ fontSize:10,color:"var(--fg-3)",fontFamily:"'PT Mono',monospace" }}>{sub}</span>
          </div>
        ))}
      </div>

      {/* ── World map ── */}
      <div style={{ ...s.card, padding:0, overflow:"hidden" }}>
        <div style={{ padding:"14px 18px 10px",borderBottom:"1px solid var(--border)",display:"flex",alignItems:"center",justifyContent:"space-between" }}>
          <span style={{ fontSize:12,fontWeight:600,color:"var(--fg)",letterSpacing:"-0.01em" }}>Adoption intensity by country</span>
          <span style={{ fontSize:10,color:"var(--fg-3)",fontFamily:"'PT Mono',monospace" }}>Hover for details</span>
        </div>
        <div style={{ padding:16 }}><WorldMap/></div>
      </div>

      {/* ── Trend chart (primary 3/5) + Growth chart (2/5) ── */}
      <div className="chart-grid" style={{ display:"grid",gridTemplateColumns:"3fr 2fr",gap:14 }}>
        <div style={s.card}>
          <div style={{ display:"flex",alignItems:"flex-start",justifyContent:"space-between",marginBottom:12,gap:8 }}>
            <div>
              <h3 style={s.chartTitle}>Monthly Active Users</h3>
              <p style={{ ...s.chartSub,margin:0 }}>Millions · {timeRange==="3M"?"last 3 months":timeRange==="6M"?"last 6 months":"last 11 months"} · est.</p>
            </div>
            <div style={{ display:"flex",alignItems:"center",gap:6,padding:"4px 10px",background:"oklch(72% 0.19 152 / 0.1)",border:"1px solid oklch(72% 0.19 152 / 0.25)",borderRadius:4 }}>
              <TrendingUp size={10} color="#3DD68C"/>
              <span style={{ fontSize:9,fontWeight:700,color:"#16A34A",fontFamily:"'PT Mono',monospace" }}>ChatGPT +24% YoY</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={230}>
            <AreaChart data={trendData} margin={{ top:5,right:5,bottom:0,left:-10 }}>
              <defs>
                {["ChatGPT","Claude","Gemini","Cursor","Perplexity"].map((k,i)=>(
                  <linearGradient key={k} id={`g${i}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor={TOOL_COLORS[i]} stopOpacity={0.2}/>
                    <stop offset="95%" stopColor={TOOL_COLORS[i]} stopOpacity={0}/>
                  </linearGradient>
                ))}
              </defs>
              <CartesianGrid stroke="#E5E2DB" vertical={false} strokeDasharray="3 3"/>
              <XAxis dataKey="m" tick={{ fill:"var(--fg-3)",fontSize:9,fontFamily:"DM Mono" }} axisLine={false} tickLine={false}/>
              <YAxis tick={{ fill:"var(--fg-3)",fontSize:9,fontFamily:"DM Mono" }} axisLine={false} tickLine={false} width={28}/>
              <Tooltip content={<ChartTip/>}/>
              <Legend wrapperStyle={{ fontSize:10,color:"var(--fg-3)",fontFamily:"DM Mono" }} iconType="circle" iconSize={7}/>
              {["ChatGPT","Claude","Gemini","Cursor","Perplexity"].map((k,i)=>(
                <Area key={k} type="monotone" dataKey={k} stroke={TOOL_COLORS[i]} fill={`url(#g${i})`} strokeWidth={i===0?2.5:1.5} dot={false} strokeOpacity={i===0?1:0.8}/>
              ))}
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div style={s.card}>
          <h3 style={s.chartTitle}>Category Growth</h3>
          <p style={{ ...s.chartSub,marginBottom:10 }}>Est. YoY user growth (%)</p>
          <ResponsiveContainer width="100%" height={230}>
            <BarChart data={CATEGORY_GROWTH} layout="vertical" margin={{ top:0,right:24,bottom:0,left:56 }}>
              <CartesianGrid stroke="#E5E2DB" horizontal={false} strokeDasharray="3 3"/>
              <XAxis type="number" tick={{ fill:"var(--fg-3)",fontSize:9,fontFamily:"DM Mono" }} axisLine={false} tickLine={false}/>
              <YAxis type="category" dataKey="cat" tick={{ fill:"var(--fg-2)",fontSize:10,fontFamily:"DM Mono" }} axisLine={false} tickLine={false} width={54}/>
              <Tooltip content={<ChartTip/>}/>
              <Bar dataKey="growth" name="Growth %" radius={[0,3,3,0]} maxBarSize={14}>
                {CATEGORY_GROWTH.map((e,i)=><Cell key={i} fill={e.fill}/>)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ── Regional breakdown table ── */}
      <div style={s.card}>
        <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:14 }}>
          <div>
            <h3 style={s.chartTitle}>Adoption by Region</h3>
            <p style={{ ...s.chartSub,margin:0 }}>Est. % of population using AI tools regularly</p>
          </div>
          <span style={{ fontSize:9,fontWeight:700,color:"var(--fg-3)",fontFamily:"'PT Mono',monospace",textTransform:"uppercase",letterSpacing:"0.07em" }}>8 REGIONS</span>
        </div>
        <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))",gap:8 }}>
          {REGIONS.map(r=>(
            <div key={r.name}
              style={{ padding:"12px 14px",borderRadius:7,border:`1px solid ${hovRegion===r.name?r.color+"55":"var(--border)"}`,background: hovRegion===r.name?"var(--elevated)":"transparent",transition:"all 0.15s",cursor:"default" }}
              onMouseEnter={()=>setHovRegion(r.name)} onMouseLeave={()=>setHovRegion(null)}>
              <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8 }}>
                <span style={{ fontSize:13,fontWeight:600,color:"var(--fg)",letterSpacing:"-0.01em" }}>{r.name}</span>
                <div style={{ display:"flex",gap:6,alignItems:"center" }}>
                  <span style={{ fontSize:9,fontWeight:700,color:"#16A34A",fontFamily:"'PT Mono',monospace" }}>{r.growth}</span>
                  <span style={{ fontSize:12,fontWeight:700,color:r.color,fontFamily:"'PT Mono',monospace" }}>{r.adopt}%</span>
                </div>
              </div>
              <div style={{ height:3,borderRadius:3,background:"var(--elevated)",overflow:"hidden",marginBottom:8 }}>
                <div style={{ height:"100%",width:`${r.adopt}%`,background:r.color,borderRadius:3,transition:"width 0.8s" }}/>
              </div>
              <div style={{ display:"flex",flexWrap:"wrap",gap:4 }}>
                {r.top.map(t=><span key={t} style={{ fontSize:9,color:"var(--fg-3)",background:"var(--elevated)",padding:"2px 6px",borderRadius:3,fontFamily:"'PT Mono',monospace" }}>{t}</span>)}
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}

function AIJobsTab() {
  const KPI_BAR = [
    { label:"Open AI Roles",    value:"~320K", delta:"+125% YoY" },
    { label:"Avg Senior Salary",value:"~$235K",delta:"US total comp" },
    { label:"Remote Share",     value:"~72%",  delta:"of all AI jobs" },
    { label:"Top Hiring City",  value:"SF Bay", delta:"42K+ openings" },
  ];
  return (
    <div style={{ display:"flex",flexDirection:"column",gap:24 }}>

      {/* ── Dashboard header ── */}
      <div style={{ display:"flex",alignItems:"flex-start",justifyContent:"space-between",flexWrap:"wrap",gap:12 }}>
        <div>
          <h2 style={{ ...s.sectionTitle,display:"flex",alignItems:"center",gap:10 }}>
            <span style={{ width:3,height:16,background:"var(--accent)",borderRadius:2,flexShrink:0,display:"inline-block" }}/>
            AI Job Market
          </h2>
          <p style={{ ...s.sectionSub,marginTop:4 }}>Estimated hiring data aggregated from public sources</p>
        </div>
        <span style={{ fontSize:9,fontWeight:600,color:"var(--fg-3)",fontFamily:"'PT Mono',monospace",background:"var(--surface)",border:"1px solid var(--border)",padding:"4px 10px",borderRadius:4,textTransform:"uppercase",letterSpacing:"0.07em" }}>
          Est. figures · May 2025
        </span>
      </div>

      {/* ── KPI bar — horizontal, not identical hero-metric cards ── */}
      <div style={{ display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:1,background:"var(--border)",borderRadius:8,overflow:"hidden" }}>
        {KPI_BAR.map(({ label,value,delta })=>(
          <div key={label} style={{ background:"var(--surface)",padding:"14px 18px",display:"flex",flexDirection:"column",gap:4 }}>
            <span style={{ fontSize:9,color:"var(--fg-3)",textTransform:"uppercase",letterSpacing:"0.09em",fontFamily:"'PT Mono',monospace" }}>{label}</span>
            <span style={{ fontSize:20,fontWeight:800,color:"var(--accent)",letterSpacing:"-0.03em",fontFamily:"'PT Mono',monospace",lineHeight:1 }}>{value}</span>
            <span style={{ fontSize:10,color:"#16A34A",fontFamily:"'PT Mono',monospace" }}>{delta}</span>
          </div>
        ))}
      </div>

      {/* ── Insight callout ── */}
      <div style={{ display:"flex",alignItems:"flex-start",gap:12,padding:"12px 16px",background:"oklch(77% 0.163 70 / 0.06)",border:"1px solid rgba(139,92,246,0.2)",borderRadius:7 }}>
        <Lightbulb size={15} color="var(--accent)" style={{ marginTop:1,flexShrink:0 }}/>
        <div>
          <span style={{ fontSize:11,fontWeight:700,color:"var(--accent)",textTransform:"uppercase",letterSpacing:"0.07em",fontFamily:"'PT Mono',monospace" }}>Key Insight · </span>
          <span style={{ fontSize:12,color:"var(--fg-2)",lineHeight:1.5 }}>
            AI Safety Engineering (+520% YoY) and AI Agents (+450%) are the fastest-growing skill demands. RAG Systems has the highest growth of any infrastructure skill at +420% — engineers who can build retrieval pipelines are commanding a 38% salary premium over base ML roles.
          </span>
        </div>
      </div>

      {/* ── Primary: skills demand (3/5) + role distribution (2/5) ── */}
      <div className="chart-grid" style={{ display:"grid",gridTemplateColumns:"3fr 2fr",gap:14 }}>
        <div style={s.card}>
          <div style={{ display:"flex",alignItems:"flex-start",justifyContent:"space-between",marginBottom:14,gap:8 }}>
            <div>
              <h3 style={s.chartTitle}>Top AI Skills by Job Demand</h3>
              <p style={{ ...s.chartSub,margin:0 }}>Est. total job postings requiring each skill</p>
            </div>
            <span style={{ fontSize:9,color:"var(--fg-3)",fontFamily:"'PT Mono',monospace" }}>10 skills · May 2025</span>
          </div>
          <div style={{ display:"flex",flexDirection:"column",gap:7 }}>
            {TOP_SKILLS.map((sk,i)=>(
              <div key={sk.skill} style={{ display:"flex",alignItems:"center",gap:10 }}>
                <span style={{ fontSize:10,color:"var(--fg-3)",minWidth:18,textAlign:"right",fontFamily:"'PT Mono',monospace" }}>#{i+1}</span>
                <span style={{ fontSize:12,color:"var(--fg)",flex:1,minWidth:0,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis",letterSpacing:"-0.01em" }}>{sk.skill}</span>
                <div style={{ width:100,height:4,borderRadius:2,background:"var(--elevated)",flexShrink:0,overflow:"hidden" }}>
                  <div style={{ height:"100%",width:`${(sk.openings/55200)*100}%`,background:i===0?"#8B5CF6":sk.color,borderRadius:2,transition:"width 0.6s" }}/>
                </div>
                <span style={{ fontSize:10,fontWeight:700,color:i===0?"#8B5CF6":sk.color,minWidth:38,textAlign:"right",fontFamily:"'PT Mono',monospace" }}>{(sk.openings/1000).toFixed(1)}K</span>
                <span style={{ fontSize:9,fontWeight:700,color:"#16A34A",minWidth:48,textAlign:"right",fontFamily:"'PT Mono',monospace" }}>{sk.growth}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display:"flex",flexDirection:"column",gap:14 }}>
          <div style={{ ...s.card,flex:1 }}>
            <h3 style={s.chartTitle}>Roles by Discipline</h3>
            <p style={{ ...s.chartSub,marginBottom:8 }}>Est. share of open roles</p>
            <ResponsiveContainer width="100%" height={160}>
              <PieChart>
                <Pie data={ROLE_PIE} cx="50%" cy="50%" innerRadius={46} outerRadius={74} paddingAngle={2} dataKey="value" strokeWidth={0}>
                  {ROLE_PIE.map((e,i)=><Cell key={i} fill={e.color}/>)}
                </Pie>
                <Tooltip content={<ChartTip/>}/>
              </PieChart>
            </ResponsiveContainer>
            <div style={{ display:"flex",flexWrap:"wrap",gap:6,justifyContent:"center",marginTop:4 }}>
              {ROLE_PIE.map(r=>(
                <div key={r.name} style={{ display:"flex",alignItems:"center",gap:4 }}>
                  <span style={{ width:7,height:7,borderRadius:2,background:r.color,flexShrink:0 }}/>
                  <span style={{ fontSize:9,color:"var(--fg-3)",fontFamily:"'PT Mono',monospace" }}>{r.name.split("/")[0]} {r.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Salary bands — full width ── */}
      <div style={s.card}>
        <div style={{ display:"flex",alignItems:"flex-start",justifyContent:"space-between",marginBottom:4,gap:8 }}>
          <div>
            <h3 style={s.chartTitle}>Salary Bands by Role</h3>
            <p style={{ ...s.chartSub,margin:0 }}>US total compensation, $K/yr · Junior / Mid / Senior / Freelance</p>
          </div>
          <div style={{ display:"flex",alignItems:"center",gap:6,padding:"4px 10px",background:"rgba(139,92,246,0.08)",border:"1px solid rgba(139,92,246,0.2)",borderRadius:4 }}>
            <span style={{ fontSize:9,fontWeight:700,color:"var(--accent)",fontFamily:"'PT Mono',monospace" }}>Senior avg: $235K</span>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={SALARY_DATA} margin={{ top:10,right:20,bottom:24,left:0 }}>
            <CartesianGrid stroke="#E5E2DB" vertical={false} strokeDasharray="3 3"/>
            <XAxis dataKey="role" tick={{ fill:"var(--fg-2)",fontSize:10,fontFamily:"DM Mono" }} axisLine={false} tickLine={false} angle={-15} textAnchor="end"/>
            <YAxis tick={{ fill:"var(--fg-3)",fontSize:9,fontFamily:"DM Mono" }} axisLine={false} tickLine={false} unit="K" width={32}/>
            <Tooltip content={<ChartTip/>}/>
            <Legend wrapperStyle={{ fontSize:10,color:"var(--fg-3)",fontFamily:"DM Mono" }} iconType="square" iconSize={8}/>
            <Bar dataKey="junior"    name="Junior"    fill="#9CA3AF" radius={[2,2,0,0]}/>
            <Bar dataKey="mid"       name="Mid"       fill="#A78BFA" radius={[2,2,0,0]}/>
            <Bar dataKey="senior"    name="Senior"    fill="#8B5CF6" radius={[2,2,0,0]}/>
            <Bar dataKey="freelance" name="Freelance" fill="#3DD68C" radius={[2,2,0,0]}/>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* ── Cities + Employers ── */}
      <div className="chart-grid" style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:14 }}>
        <div style={s.card}>
          <h3 style={s.chartTitle}>Top Hiring Cities</h3>
          <p style={{ ...s.chartSub,marginBottom:12 }}>Est. AI openings by metro area</p>
          <div style={{ display:"flex",flexDirection:"column",gap:8 }}>
            {REGIONAL_JOBS.map((r,i)=>(
              <div key={r.region} style={{ display:"flex",alignItems:"center",gap:10 }}>
                <span style={{ fontSize:9,color:"var(--fg-3)",minWidth:16,fontFamily:"'PT Mono',monospace" }}>#{i+1}</span>
                <MapPin size={11} color={r.color} style={{ flexShrink:0 }}/>
                <span style={{ fontSize:12,color:"var(--fg)",flex:1,letterSpacing:"-0.01em" }}>{r.region}</span>
                <div style={{ width:72,height:3,borderRadius:2,background:"var(--elevated)",flexShrink:0,overflow:"hidden" }}>
                  <div style={{ height:"100%",width:`${(r.jobs/42000)*100}%`,background:r.color,borderRadius:2 }}/>
                </div>
                <span style={{ fontSize:10,fontWeight:700,color:r.color,minWidth:36,textAlign:"right",fontFamily:"'PT Mono',monospace" }}>{(r.jobs/1000).toFixed(1)}K</span>
                <span style={{ fontSize:9,color:"#16A34A",minWidth:40,textAlign:"right",fontWeight:600,fontFamily:"'PT Mono',monospace" }}>{r.growth}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={s.card}>
          <h3 style={s.chartTitle}>Top AI Employers</h3>
          <p style={{ ...s.chartSub,marginBottom:12 }}>Companies with most open AI roles (est.)</p>
          <div style={{ display:"flex",flexDirection:"column",gap:6 }}>
            {TOP_COMPANIES.map(c=>(
              <div key={c.name} style={{ display:"flex",alignItems:"center",gap:10,padding:"8px 10px",background:"var(--elevated)",borderRadius:6,border:"1px solid var(--border)" }}>
                <LetterAvatar name={c.name} size={32}/>
                <div style={{ flex:1,minWidth:0 }}>
                  <div style={{ fontSize:12,fontWeight:600,color:"var(--fg)",letterSpacing:"-0.01em" }}>{c.name}</div>
                  <div style={{ display:"flex",gap:3,marginTop:2,flexWrap:"wrap" }}>
                    {c.badges.map(b=><span key={b} style={{ fontSize:8,color:"var(--fg-3)",background:"var(--surface)",padding:"1px 5px",borderRadius:3,fontFamily:"'PT Mono',monospace" }}>{b}</span>)}
                  </div>
                </div>
                <div style={{ textAlign:"right",flexShrink:0 }}>
                  <div style={{ fontSize:13,fontWeight:700,color:"var(--accent)",fontFamily:"'PT Mono',monospace" }}>{c.openings}</div>
                  <div style={{ fontSize:9,color:"#16A34A",fontWeight:600,fontFamily:"'PT Mono',monospace" }}>{c.yoy}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}

function CompareTab() {
  const [selected,setSelected]=useState([1,2]);
  const [showPicker,setShowPicker]=useState(false);
  const toggle=id=>setSelected(p=>p.includes(id)?p.length>2?p.filter(x=>x!==id):p:p.length<4?[...p,id]:p);
  const ct=TOOLS.filter(t=>selected.includes(t.id));
  const radarData=RADAR_KEYS.map(k=>{ const e={ key:RADAR_LABELS[k] }; ct.forEach(t=>{ e[t.name]=t.radar[k]; }); return e; });
  return (
    <div style={{ display:"flex",flexDirection:"column",gap:24 }}>
      <div style={{ display:"flex",alignItems:"flex-start",justifyContent:"space-between",flexWrap:"wrap",gap:12 }}>
        <div><h2 style={s.sectionTitle}>Compare AI Tools</h2><p style={s.sectionSub}>Select 2–4 tools for a side-by-side analysis</p></div>
        <button type="button" style={s.addToolBtn} onClick={()=>setShowPicker(p=>!p)} className="cta-btn" aria-expanded={showPicker}>
          {showPicker?<X size={13}/>:<Plus size={13}/>}
          {showPicker?"Close":"Select Tools"}
        </button>
      </div>
      {showPicker&&(
        <div style={s.card}>
          <p style={{ fontSize:12,color:"var(--fg-3)",marginBottom:12 }}>Select 2–4 tools. Selected: {selected.length}/4</p>
          <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(160px,1fr))",gap:8 }}>
            {TOOLS.map(t=>(
              <button type="button" key={t.id} onClick={()=>toggle(t.id)} aria-pressed={selected.includes(t.id)}
                style={{ ...s.pickerBtn,...(selected.includes(t.id)?{ border:`1px solid ${t.color}66`,background:t.color+"11" }:{}) }} className="picker-btn">
                <span style={{ fontSize:18 }}>{t.emoji}</span>
                <div style={{ textAlign:"left" }}>
                  <div style={{ fontSize:12,fontWeight:600,color:selected.includes(t.id)?t.color:"var(--fg)" }}>{t.name}</div>
                  <div style={{ fontSize:10,color:"var(--fg-3)" }}>{t.company}</div>
                </div>
                {selected.includes(t.id)&&<CheckCircle2 size={13} color={t.color} style={{ marginLeft:"auto" }}/>}
              </button>
            ))}
          </div>
        </div>
      )}
      <div style={{ display:"grid",gridTemplateColumns:`100px repeat(${ct.length},1fr)`,gap:10 }}>
        <div/>
        {ct.map(t=>(
          <div key={t.id} style={{ background:t.color+"0d",border:`1px solid ${t.color}44`,borderRadius:14,padding:"16px 14px",display:"flex",flexDirection:"column",alignItems:"center",gap:8,textAlign:"center" }}>
            <span style={{ fontSize:28 }}>{t.emoji}</span>
            <div><div style={{ fontSize:14,fontWeight:700,color:"var(--fg)" }}>{t.name}</div><div style={{ fontSize:11,color:"var(--fg-3)" }}>{t.company}</div></div>
            <div><span style={{ fontSize:22,fontWeight:800,color:t.color }}>{t.score}</span><span style={{ fontSize:10,color:"var(--fg-3)",marginLeft:3 }}>/ 100</span></div>
          </div>
        ))}
      </div>
      <div style={s.card}>
        <h3 style={s.chartTitle}>Capability Radar</h3>
        <p style={s.chartSub}>Normalized performance across 6 dimensions (0–100)</p>
        <ResponsiveContainer width="100%" height={300}>
          <RadarChart data={radarData} margin={{ top:10,right:30,bottom:10,left:30 }}>
            <PolarGrid stroke="#E5E2DB"/>
            <PolarAngleAxis dataKey="key" tick={{ fill:"var(--fg-3)",fontSize:11 }}/>
            <PolarRadiusAxis domain={[0,100]} tick={{ fill:"var(--fg-3)",fontSize:9 }} tickCount={4}/>
            {ct.map((t,i)=><Radar key={t.id} name={t.name} dataKey={t.name} stroke={TOOL_COLORS[i]} fill={TOOL_COLORS[i]} fillOpacity={0.12} strokeWidth={2}/>)}
            <Legend wrapperStyle={{ fontSize:11,color:"var(--fg-3)" }}/>
            <Tooltip content={<ChartTip/>}/>
          </RadarChart>
        </ResponsiveContainer>
      </div>
      <div style={s.card}>
        <h3 style={s.chartTitle}>Feature Comparison</h3>
        <div style={{ overflowX:"auto",marginTop:12 }}>
          <table style={{ width:"100%",borderCollapse:"collapse",minWidth:400 }}>
            <thead>
              <tr>
                <th style={s.th}>Attribute</th>
                {ct.map(t=><th key={t.id} style={{ ...s.th,color:t.color }}>{t.name}</th>)}
              </tr>
            </thead>
            <tbody>
              {[{ l:"Free Plan",g:t=>t.pricing.free },{ l:"API Access",g:t=>t.pricing.api },{ l:"Enterprise",g:t=>t.enterprise },{ l:"Open Source",g:t=>t.openSource },{ l:"Trending",g:t=>t.trending }].map(({ l,g })=>(
                <tr key={l} style={{ borderBottom:"1px solid rgba(255,255,255,0.05)" }}>
                  <td style={s.tdLabel}>{l}</td>
                  {ct.map(t=><td key={t.id} style={s.td}>{g(t)?<CheckCircle2 size={15} color="#3DD68C"/>:<Minus size={15} color="var(--fg-2)"/>}</td>)}
                </tr>
              ))}
              {[
                { l:"User Rating",   render:t=><span style={{ display:"flex",alignItems:"center",gap:4,justifyContent:"center" }}><Star size={11} color="#f59e0b" fill="#f59e0b"/><span style={{ fontSize:12,fontWeight:700,color:"var(--fg)" }}>{t.metrics.rating}</span></span> },
                { l:"Monthly Users", render:t=><span style={{ fontSize:12,color:"#C8BFB3" }}>{t.metrics.users}</span> },
                { l:"Growth",        render:t=><span style={{ fontSize:12,fontWeight:700,color:"#16A34A" }}>{t.metrics.growth}</span> },
                { l:"Starting Price",render:t=>t.pricing.free?<span style={{ color:"#16A34A",fontWeight:600,fontSize:12 }}>Free</span>:<span style={{ color:"#f59e0b",fontWeight:600,fontSize:12 }}>{t.pricing.plan}</span> },
              ].map(({ l,render })=>(
                <tr key={l} style={{ borderBottom:"1px solid rgba(255,255,255,0.05)" }}>
                  <td style={s.tdLabel}>{l}</td>
                  {ct.map(t=><td key={t.id} style={s.td}>{render(t)}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function AIPicksTab() {
  const [step,setStep]=useState(0);
  const [answers,setAnswers]=useState({});
  const [done,setDone]=useState(false);
  const cur=REC_STEPS[step];
  const progress=Math.round(((step+0.5)/REC_STEPS.length)*100);

  const pick=useCallback((val)=>{
    if(cur.multi){
      setAnswers(a=>{ const prev=a[cur.id]||[]; return { ...a,[cur.id]:prev.includes(val)?prev.filter(x=>x!==val):prev.length<2?[...prev,val]:prev }; });
    } else {
      const next={ ...answers,[cur.id]:val };
      setAnswers(next);
      if(step<REC_STEPS.length-1) setTimeout(()=>setStep(n=>n+1),280);
      else setTimeout(()=>setDone(true),280);
    }
  },[cur,answers,step]);

  const isSelected=val=>cur.multi?(answers[cur.id]||[]).includes(val):answers[cur.id]===val;
  const reset=()=>{ setStep(0); setAnswers({}); setDone(false); };
  const recommendations=done ? TOOLS.map(t=>({ ...t,match:scoreMatch(t,answers) })).sort((a,b)=>b.match-a.match).slice(0,5) : [];

  return (
    <div style={{ display:"flex",flexDirection:"column",gap:24 }}>
      <div style={{ display:"flex",alignItems:"flex-start",justifyContent:"space-between",flexWrap:"wrap",gap:12 }}>
        <div>
          <h2 style={s.sectionTitle}><Wand2 size={20} color="#a78bfa"/> AI Tool Recommender</h2>
          <p style={s.sectionSub}>Answer 3 questions — get your personalised AI stack in seconds.</p>
        </div>
        {(step>0||done)&&<button type="button" style={s.addToolBtn} onClick={reset} className="cta-btn"><RefreshCw size={13}/> Start over</button>}
      </div>
      {!done?(
        <div style={{ maxWidth:680,margin:"0 auto",width:"100%" }}>
          <div style={{ marginBottom:24 }}>
            <div style={{ display:"flex",justifyContent:"space-between",marginBottom:8 }}>
              <span style={{ fontSize:12,color:"var(--fg-3)" }}>Step {step+1} of {REC_STEPS.length}</span>
              <span style={{ fontSize:12,color:"#A78BFA",fontWeight:600 }}>{progress}% complete</span>
            </div>
            <div style={{ height:4,borderRadius:4,background:"var(--border)" }}>
              <div style={{ height:"100%",width:`${progress}%`,background:"linear-gradient(90deg,#6366f1,#a78bfa)",borderRadius:4,transition:"width 0.4s ease" }}/>
            </div>
          </div>
          <div style={{ display:"flex",gap:8,marginBottom:28,justifyContent:"center" }}>
            {REC_STEPS.map((_,i)=>(
              <button type="button" key={i} aria-label={`Step ${i+1}`}
                style={{ width:i===step?24:8,height:8,borderRadius:4,background:i<step?"#a78bfa":i===step?"linear-gradient(90deg,#6366f1,#a78bfa)":"rgba(139,92,246,0.1)",transition:"all 0.3s",border:"none",cursor:i<step?"pointer":"default",padding:0 }}
                onClick={()=>i<step&&setStep(i)}/>
            ))}
          </div>
          <div style={s.card}>
            <h3 style={{ fontSize:20,fontWeight:700,color:"var(--fg)",margin:"0 0 6px",textAlign:"center" }}>{cur.q}</h3>
            {cur.multi&&<p style={{ fontSize:12,color:"var(--fg-3)",textAlign:"center",marginBottom:18 }}>Choose up to 2 options</p>}
            <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))",gap:10,marginTop:20 }}>
              {cur.opts.map(opt=>(
                <button type="button" key={opt.val} onClick={()=>pick(opt.val)} aria-pressed={isSelected(opt.val)}
                  style={{ display:"flex",alignItems:"flex-start",gap:12,padding:"14px 16px",background:isSelected(opt.val)?"rgba(139,92,246,0.08)":"var(--surface)",border:isSelected(opt.val)?"1px solid rgba(139,92,246,0.4)":"1px solid var(--border)",borderRadius:8,cursor:"pointer",textAlign:"left",transition:"all 0.15s" }} className="picker-btn">
                  <div style={{ width:38,height:38,borderRadius:8,flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center",
                    background:isSelected(opt.val)?"rgba(139,92,246,0.12)":"var(--elevated)",
                    border:`1px solid ${isSelected(opt.val)?"rgba(139,92,246,0.3)":"var(--border)"}` }}>
                    {opt.icon && <opt.icon size={18} color={isSelected(opt.val)?"var(--accent)":"var(--fg-3)"}/>}
                  </div>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:13,fontWeight:600,color:isSelected(opt.val)?"var(--accent)":"var(--fg)",letterSpacing:"-0.01em" }}>{opt.label}</div>
                    <div style={{ fontSize:11,color:"var(--fg-3)",marginTop:2 }}>{opt.desc}</div>
                  </div>
                  {isSelected(opt.val)&&<CheckCircle2 size={15} color="var(--accent)" style={{ marginLeft:"auto",flexShrink:0 }}/>}
                </button>
              ))}
            </div>
            {cur.multi&&(
              <div style={{ marginTop:20,textAlign:"center" }}>
                <button type="button" className="cta-btn"
                  style={{ ...s.addToolBtn,opacity:(answers[cur.id]||[]).length>0?1:0.4 }}
                  disabled={(answers[cur.id]||[]).length===0}
                  onClick={()=>step<REC_STEPS.length-1?setStep(n=>n+1):setDone(true)}>
                  Continue <ArrowRight size={13}/>
                </button>
              </div>
            )}
          </div>
        </div>
      ):(
        <div style={{ display:"flex",flexDirection:"column",gap:16 }}>
          <div style={{ textAlign:"center",padding:"8px 0 16px" }}>
            <div style={{ fontSize:32,marginBottom:8 }}>✨</div>
            <h3 style={{ fontSize:22,fontWeight:700,color:"var(--fg)",margin:"0 0 6px" }}>Your Personalised AI Stack</h3>
            <p style={{ fontSize:14,color:"var(--fg-3)" }}>Based on your answers — sorted by match score</p>
          </div>
          {recommendations.map((t,i)=>(
            <div key={t.id} style={{ ...s.card,display:"flex",alignItems:"center",gap:16,flexWrap:"wrap",position:"relative",overflow:"hidden" }}>
              {i===0&&<div style={{ position:"absolute",top:0,right:0,background:"linear-gradient(135deg,#6366f1,#a78bfa)",padding:"4px 12px",borderRadius:"0 14px 0 10px",fontSize:10,fontWeight:700,color:"#fff",letterSpacing:0.5 }}>BEST MATCH</div>}
              <div style={{ fontSize:12,fontWeight:800,color:"var(--fg-3)",minWidth:22 }}>#{i+1}</div>
              <div style={{ width:48,height:48,borderRadius:12,flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center",background:t.color+"22",border:`1px solid ${t.color}44`,fontSize:26 }}>{t.emoji}</div>
              <div style={{ flex:1,minWidth:120 }}>
                <div style={{ display:"flex",alignItems:"center",gap:8,flexWrap:"wrap" }}>
                  <span style={{ fontSize:16,fontWeight:700,color:"var(--fg)" }}>{t.name}</span>
                  {t.trending&&<span style={s.trendBadge}><TrendingUp size={9}/> Trending</span>}
                </div>
                <span style={{ fontSize:12,color:"var(--fg-3)" }}>{t.company}</span>
                <p style={{ fontSize:12.5,color:"var(--fg-3)",marginTop:4,lineHeight:1.5 }}>{t.description}</p>
              </div>
              <div style={{ display:"flex",flexDirection:"column",alignItems:"center",gap:4,flexShrink:0 }}>
                <div style={{ position:"relative",width:64,height:64 }}>
                  <svg viewBox="0 0 64 64" style={{ width:64,height:64,transform:"rotate(-90deg)" }}>
                    <circle cx="32" cy="32" r="26" fill="none" stroke="#E5E2DB" strokeWidth="6"/>
                    <circle cx="32" cy="32" r="26" fill="none"
                      stroke={t.match>=75?"#3DD68C":t.match>=50?"#f59e0b":"#6366f1"}
                      strokeWidth="6" strokeDasharray={`${(t.match/100)*163} 163`} strokeLinecap="round"/>
                  </svg>
                  <div style={{ position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)",fontSize:13,fontWeight:800,color:"var(--fg)" }}>{t.match}%</div>
                </div>
                <span style={{ fontSize:10,color:"var(--fg-3)" }}>match</span>
              </div>
              <div style={{ display:"flex",gap:6,flexShrink:0 }}>
                {t.pricing.free&&<span style={s.pBadge}>Free</span>}
                {t.pricing.plan&&<span style={s.pPlan}>{t.pricing.plan}</span>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function MyStackTab({ onToast }) {
  const [myStack,setMyStack]=useState([1,3,8,10]);
  const [showAll,setShowAll]=useState(false);
  const [activePreset,setActivePreset]=useState(null);
  const [copied,setCopied]=useState(false);

  const stackTools=TOOLS.filter(t=>myStack.includes(t.id));
  const estCost=stackTools.reduce((acc,t)=>{ if(!t.pricing.free&&t.pricing.plan){ acc+=parseFloat(t.pricing.plan.replace(/[^0-9.]/g,"")||0); } return acc; },0);
  const catGroups=stackTools.reduce((g,t)=>{ (g[t.category]=g[t.category]||[]).push(t); return g; },{});

  const loadPreset=p=>{ setMyStack(p.tools); setActivePreset(p.id); onToast(`${p.name} loaded`,"success"); };
  const toggleTool=id=>setMyStack(p=>p.includes(id)?p.filter(x=>x!==id):[...p,id]);

  const copyStack=async()=>{
    const txt=stackTools.map(t=>`${t.emoji} ${t.name} (${t.company}) — ${t.pricing.free?"Free":t.pricing.plan} — ${t.website}`).join("\n");
    try {
      if(navigator.clipboard?.writeText){ await navigator.clipboard.writeText(txt); }
      else { const ta=document.createElement("textarea"); ta.value=txt; document.body.appendChild(ta); ta.select(); document.execCommand("copy"); document.body.removeChild(ta); }
      setCopied(true); onToast("Stack copied to clipboard","success");
      setTimeout(()=>setCopied(false),2200);
    } catch { onToast("Copy failed","error"); }
  };

  return (
    <div style={{ display:"flex",flexDirection:"column",gap:28 }}>
      <div style={{ display:"flex",alignItems:"flex-start",justifyContent:"space-between",flexWrap:"wrap",gap:12 }}>
        <div>
          <h2 style={s.sectionTitle}><Package size={20} color="#3DD68C"/> My AI Stack</h2>
          <p style={s.sectionSub}>Build and manage your personal AI toolkit</p>
        </div>
        <button type="button" style={s.addToolBtn} onClick={copyStack} className="cta-btn">
          {copied?<Check size={13} color="#3DD68C"/>:<Copy size={13}/>}
          {copied?"Copied!":"Export Stack"}
        </button>
      </div>
      <div>
        <h3 style={{ fontSize:15,fontWeight:700,color:"var(--fg)",margin:"0 0 12px",display:"flex",alignItems:"center",gap:8 }}>
          <Lightbulb size={15} color="#f59e0b"/> Curated Starter Stacks
        </h3>
        <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))",gap:10 }}>
          {PRESET_STACKS.map(ps=>(
            <button type="button" key={ps.id} onClick={()=>loadPreset(ps)} aria-pressed={activePreset===ps.id}
              style={{ display:"flex",flexDirection:"column",alignItems:"flex-start",gap:6,padding:"14px 16px",background:activePreset===ps.id?ps.color+"0f":"rgba(255,255,255,0.03)",border:activePreset===ps.id?`1px solid ${ps.color}55`:"1px solid rgba(255,255,255,0.07)",borderRadius:12,cursor:"pointer",transition:"all 0.15s",textAlign:"left" }} className="cat-card">
              <div style={{ display:"flex",alignItems:"center",gap:10,width:"100%" }}>
                <div style={{ width:34,height:34,borderRadius:8,flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center",
                  background:activePreset===ps.id ? ps.color+"20" : "var(--elevated)",
                  border:`1px solid ${activePreset===ps.id ? ps.color+"44" : "var(--border)"}` }}>
                  {ps.icon && <ps.icon size={16} color={activePreset===ps.id ? ps.color : "var(--fg-3)"}/>}
                </div>
                <span style={{ fontSize:13,fontWeight:700,color:activePreset===ps.id?ps.color:"var(--fg)",flex:1,letterSpacing:"-0.01em" }}>{ps.name}</span>
                {activePreset===ps.id&&<Check size={13} color={ps.color}/>}
              </div>
              <p style={{ fontSize:11,color:"var(--fg-3)",lineHeight:1.4,margin:0 }}>{ps.desc}</p>
              <div style={{ display:"flex",gap:4,flexWrap:"wrap",marginTop:2 }}>
                {ps.tools.slice(0,3).map(tid=>{ const t=TOOLS.find(x=>x.id===tid); return t?<span key={tid} style={{ fontSize:9,color:"var(--fg-3)",background:"var(--elevated)",padding:"2px 6px",borderRadius:3,fontFamily:"'PT Mono',monospace",letterSpacing:"0.02em" }}>{t.name.split(" ")[0]}</span>:null; })}
                {ps.tools.length>3&&<span style={{ fontSize:9,color:"var(--fg-3)",fontFamily:"'PT Mono',monospace" }}>+{ps.tools.length-3}</span>}
              </div>
            </button>
          ))}
        </div>
      </div>
      <div style={s.card}>
        <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16,flexWrap:"wrap",gap:8 }}>
          <div>
            <h3 style={s.chartTitle}>Your Stack ({stackTools.length} tools)</h3>
            <p style={s.chartSub}>{estCost>0?`Est. ~$${estCost.toFixed(0)}/mo · Free tools not included`:"All tools have a free tier — $0 to start"}</p>
          </div>
          <button type="button" style={{ ...s.addToolBtn,borderColor:"rgba(239,68,68,0.3)",color:"#ef4444",background:"rgba(239,68,68,0.05)" }}
            onClick={()=>{ setMyStack([]); setActivePreset(null); }} className="cta-btn">
            <Trash2 size={13}/> Clear Stack
          </button>
        </div>
        {stackTools.length===0?(
          <div style={{ textAlign:"center",padding:"40px 20px",color:"var(--fg-3)",fontSize:14 }}>
            <Package size={32} color="var(--fg-2)" style={{ display:"block",margin:"0 auto 12px" }}/>
            Your stack is empty — load a preset or add tools below
          </div>
        ):(
          <>
            {Object.entries(catGroups).map(([cat,tools])=>(
              <div key={cat} style={{ marginBottom:16 }}>
                <p style={{ fontSize:11,fontWeight:600,color:"var(--fg-3)",textTransform:"uppercase",letterSpacing:0.8,marginBottom:8,display:"flex",alignItems:"center",gap:6 }}>
                  <span style={{ flex:1,height:1,background:"var(--border)" }}/>
                  {cat}
                  <span style={{ flex:1,height:1,background:"var(--border)" }}/>
                </p>
                <div style={{ display:"flex",flexWrap:"wrap",gap:10 }}>
                  {tools.map(t=>(
                    <div key={t.id} style={{ display:"flex",alignItems:"center",gap:10,padding:"10px 14px",background:t.color+"0d",border:`1px solid ${t.color}33`,borderRadius:12,flex:"1 1 200px",minWidth:0 }}>
                      <span style={{ fontSize:20,flexShrink:0 }}>{t.emoji}</span>
                      <div style={{ flex:1,minWidth:0 }}>
                        <div style={{ fontSize:13,fontWeight:600,color:"var(--fg)",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis" }}>{t.name}</div>
                        <div style={{ fontSize:11,color:"var(--fg-3)" }}>{t.pricing.free?"Free tier available":t.pricing.plan}</div>
                      </div>
                      <button type="button" onClick={()=>setMyStack(p=>p.filter(x=>x!==t.id))} style={{ background:"none",border:"none",cursor:"pointer",color:"var(--fg-3)",padding:4,display:"flex",alignItems:"center",borderRadius:4 }} className="icon-btn"
                        aria-label={`Remove ${t.name} from stack`}>
                        <X size={13}/>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
            <div style={{ display:"flex",gap:12,marginTop:16,paddingTop:16,borderTop:"1px solid rgba(255,255,255,0.06)",flexWrap:"wrap" }}>
              {[
                { label:"Avg Score",  value:Math.round(stackTools.reduce((a,t)=>a+t.score,0)/stackTools.length),  unit:"",    color:"#3DD68C" },
                { label:"Avg Rating", value:(stackTools.reduce((a,t)=>a+t.metrics.rating,0)/stackTools.length).toFixed(1), unit:"★",color:"#f59e0b" },
                { label:"Free Tiers", value:`${stackTools.filter(t=>t.pricing.free).length}/${stackTools.length}`, unit:"",  color:"var(--accent)" },
                { label:"With API",   value:`${stackTools.filter(t=>t.pricing.api).length}/${stackTools.length}`,  unit:"",  color:"#A78BFA" },
              ].map(({ label,value,unit,color })=>(
                <div key={label} style={{ flex:1,minWidth:100,background:"var(--elevated)",border:"1px solid rgba(255,255,255,0.06)",borderRadius:10,padding:"10px 12px",textAlign:"center" }}>
                  <div style={{ fontSize:20,fontWeight:800,color,letterSpacing:"-0.5px" }}>{value}{unit}</div>
                  <div style={{ fontSize:10,color:"var(--fg-3)",marginTop:2 }}>{label}</div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
      <div>
        <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:12 }}>
          <h3 style={{ fontSize:15,fontWeight:700,color:"var(--fg)",margin:0 }}>Add Tools to Stack</h3>
          <button type="button" style={{ ...s.chip,fontSize:12 }} onClick={()=>setShowAll(a=>!a)} className="chip">
            {showAll?"Show less":"Show all"} {TOOLS.length} tools
          </button>
        </div>
        <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(175px,1fr))",gap:8 }}>
          {(showAll?TOOLS:TOOLS.filter(t=>!myStack.includes(t.id)).slice(0,8)).map(t=>(
            <button type="button" key={t.id} onClick={()=>toggleTool(t.id)} aria-pressed={myStack.includes(t.id)}
              style={{ display:"flex",alignItems:"center",gap:10,padding:"10px 12px",background:myStack.includes(t.id)?t.color+"0f":"rgba(255,255,255,0.03)",border:myStack.includes(t.id)?`1px solid ${t.color}55`:"1px solid rgba(255,255,255,0.07)",borderRadius:10,cursor:"pointer",transition:"all 0.15s" }} className="picker-btn">
              <span style={{ fontSize:20 }}>{t.emoji}</span>
              <div style={{ flex:1,textAlign:"left",minWidth:0 }}>
                <div style={{ fontSize:12,fontWeight:600,color:myStack.includes(t.id)?t.color:"var(--fg)",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis" }}>{t.name}</div>
                <div style={{ fontSize:10,color:"var(--fg-3)" }}>{t.pricing.free?"Free":"Paid"} · {t.company}</div>
              </div>
              {myStack.includes(t.id)?<CheckCircle2 size={14} color={t.color} style={{ flexShrink:0 }}/>:<Plus size={14} color="var(--fg-3)" style={{ flexShrink:0 }}/>}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [activeTab,setActiveTab]         = useState("Explore");
  const [activeCategory,setActiveCategory]= useState("all");
  const [searchQuery,setSearchQuery]     = useState("");
  const [savedIds,setSavedIds]           = useState(()=>new Set());  const [filterOpen,setFilterOpen]       = useState(false);
  const [filters,setFilters]             = useState({ free:false,openSource:false,api:false,enterprise:false });
  const [sortBy,setSortBy]               = useState("score");
  const [tickerIdx,setTickerIdx]         = useState(0);
  const [navScrolled,setNavScrolled]     = useState(false);
  const [moreOpen,setMoreOpen]           = useState(false);
  const [toast,setToast]                 = useState(null);
  const [loading,setLoading]             = useState(false);
  const [theme,setTheme]                 = useState("dark");
  const isDark = theme === "dark";

  useEffect(()=>{ const t=setInterval(()=>setTickerIdx(i=>(i+1)%TRENDING_TICKER.length),3200); return()=>clearInterval(t); },[]);

  const showToast=useCallback((msg,type="success")=>{ setToast({msg,type}); setTimeout(()=>setToast(null),2500); },[]);
  const switchTab=useCallback((tab)=>{ setLoading(true); setActiveTab(tab); setMoreOpen(false); setTimeout(()=>setLoading(false),400); },[]);
  const toggleSave=useCallback(id=>setSavedIds(p=>{ const n=new Set(p); n.has(id)?n.delete(id):n.add(id); showToast(n.has(id)?"Saved":"Removed from saved"); return n; }),[showToast]);
  const toggleFilter=k=>setFilters(f=>({...f,[k]:!f[k]}));

  const displayTools = (() => {
    let tools = TOOLS
      .filter(t=>activeCategory==="all"||t.category===activeCategory)
      .filter(t=>{ const q=searchQuery.toLowerCase(); return !q||t.name.toLowerCase().includes(q)||t.company.toLowerCase().includes(q)||t.description.toLowerCase().includes(q)||t.tags.some(tag=>tag.toLowerCase().includes(q)); })
      .filter(t=>(!filters.free||t.pricing.free)&&(!filters.openSource||t.openSource)&&(!filters.api||t.pricing.api)&&(!filters.enterprise||t.enterprise))
      .sort((a,b)=>sortBy==="score"?b.score-a.score:sortBy==="rating"?b.metrics.rating-a.metrics.rating:parseFloat(b.metrics.growth)-parseFloat(a.metrics.growth));
    return activeTab==="Saved"?TOOLS.filter(t=>savedIds.has(t.id)):tools;
  })();

  const showExplore = activeTab==="Explore";
  const showTools   = activeTab==="Explore"||activeTab==="Saved";

  return (
    <ErrorBoundary>
      <div style={{ ...s.root, transition:"background 0.25s, color 0.25s", ...(isDark ? {} : {
        "--bg":      "#111014",
        "--surface": "#1B1921",
        "--elevated":"#252232",
        "--accent":  "var(--accent)",
        "--fg":      "var(--bg)",
        "--fg-2":    "#9B95A8",
        "--fg-3":    "#52485E",
        "--border":  "#2E2B38",
        "--nav-bg":  "rgba(17,16,20,0.96)",
        background:  "#111014",
        color:       "var(--bg)",
      })}}>
        <style>{css}</style>
        <Toast toast={toast}/>
        <nav style={{ ...s.nav,...(navScrolled?s.navScrolled:{}) }}>
          <div style={s.navInner}>
            <div style={s.navLogo}>
              <div style={s.logoMark}><Cpu size={16} color="var(--accent)"/></div>
              <span style={s.logoText}>AI<span style={{ color:"var(--accent)" }}>Atlas</span></span>
              <span style={s.logoBadge}>BETA</span>
            </div>
            <div style={s.navTabs} className="nav-tabs-desktop">
              {NAV_TABS.map(tab=>(
                <button type="button" key={tab} onClick={()=>switchTab(tab)}
                  style={{ ...s.navTab,...(activeTab===tab?s.navTabActive:{}) }} className="nav-tab">
                  {tab}
                  {tab==="Saved"&&savedIds.size>0&&<span style={s.navBadge}>{savedIds.size}</span>}
                  {tab==="AI Picks"&&<Wand2 size={11} color="var(--accent)"/>}
                </button>
              ))}
            </div>
            {/* Theme toggle */}
            <button type="button" onClick={()=>setTheme(t=>t==="dark"?"light":"dark")}
              aria-label={isDark?"Switch to Paper theme":"Switch to Dark theme"}
              style={{
                display:"flex", alignItems:"center", gap:7, padding:"6px 12px",
                background: isDark ? "var(--elevated)" : "#EDE8DE",
                border: `1px solid var(--border)`,
                borderRadius:6, cursor:"pointer", flexShrink:0,
                transition:"all 0.2s", color:"var(--fg-2)"
              }}>
              {isDark
                ? <><Sun size={13} color="var(--accent)"/><span style={{ fontSize:11, fontWeight:600, color:"var(--fg-2)", letterSpacing:"0.01em" }}>Light</span></>
                : <><Moon size={13} color="var(--accent)"/><span style={{ fontSize:11, fontWeight:600, color:"var(--fg-2)", letterSpacing:"0.01em" }}>Dark</span></>
              }
            </button>
            <button type="button" style={s.navCta} className="cta-btn nav-cta-desktop">
              <Rocket size={13}/> Submit Tool
            </button>
          </div>
        </nav>

        {activeTab==="Explore"&&(
          <section style={{ ...s.hero, background: isDark ? "var(--bg)" : "var(--bg)" }}>
            <div style={s.glow1}/><div style={s.glow2}/><div style={s.heroGrid}/>
            <div style={s.heroInner}>
              <div style={s.ticker}>
                <span style={s.tickerLabel}><Activity size={11}/> NEWS</span>
                <span className="ticker-fade" key={tickerIdx}>{TRENDING_TICKER[tickerIdx]}</span>
              </div>
              <h1 style={s.heroTitle}>
                Discover the World's<br/>
                <span style={s.heroAccent}>Most Powerful AI Tools</span>
              </h1>
              <p style={s.heroSub}>Browse 12 curated AI tools by category, geography, usage, and hiring demand.</p>
              <div style={s.searchWrap}>
                <Search size={18} color="var(--fg-3)" style={{ flexShrink:0 }}/>
                <input type="search" style={s.searchInput} className="search-input"
                  placeholder="Search tools, categories, companies…"
                  value={searchQuery} onChange={e=>setSearchQuery(e.target.value)}/>
                {searchQuery&&<button type="button" onClick={()=>setSearchQuery("")} style={s.srClear}><X size={14}/></button>}
                <button type="button" style={s.srBtn} className="cta-btn"><Sparkles size={13}/> Search</button>
              </div>
              <div style={s.quickFilters}>
                {["Cursor","DeepSeek","Sora","Suno AI","Open Source","v0"].map(q => (
                  <button type="button" key={q} style={s.chip} className="chip" onClick={()=>setSearchQuery(q)}>{q}</button>
                ))}
              </div>
              <div style={{ display:"flex",gap:8,marginTop:-4,flexWrap:"wrap",justifyContent:"center" }}>
                <button type="button" style={{ ...s.chip,borderColor:"rgba(167,139,250,0.3)",color:"#A78BFA",background:"rgba(167,139,250,0.08)" }}
                  className="chip" onClick={()=>switchTab("AI Picks")}>
                  <Wand2 size={12}/> Get Recommendations →
                </button>
                <button type="button" style={{ ...s.chip,borderColor:"rgba(16,185,129,0.3)",color:"#16A34A",background:"rgba(16,185,129,0.08)" }}
                  className="chip" onClick={()=>switchTab("My Stack")}>
                  <Package size={12}/> Build My Stack →
                </button>
              </div>
              <div style={{ display:"flex", alignItems:"flex-start", gap:0, paddingTop:20, borderTop:"1px solid var(--border)", width:"100%" }}>
                {HERO_STATS.map(({ label, value, icon:Icon }, i) => (
                  <div key={label} style={{ flex:1, paddingRight:32, marginRight:32,
                    borderRight: i < HERO_STATS.length-1 ? "1px solid var(--border)" : "none" }}>
                    <div style={{ fontSize:"clamp(28px,3.5vw,52px)", fontWeight:800, color:"var(--fg)",
                      letterSpacing:"-0.04em", fontFamily:"'Azeret Mono',monospace", lineHeight:1 }}>{value}</div>
                    <div style={{ fontSize:9, color:"var(--fg-3)", textTransform:"uppercase",
                      letterSpacing:"0.12em", fontFamily:"'Azeret Mono',monospace", marginTop:6 }}>{label}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        <main style={s.main} id="main-content">
          {showExplore&&(
            <section style={s.section}>
              <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16,gap:12,flexWrap:"wrap" }}>
                <div>
                  <h2 style={{ ...s.sectionTitle, display:"flex",alignItems:"center",gap:10 }}>
                    <span style={{ width:3,height:16,background:"var(--accent)",borderRadius:2,flexShrink:0,display:"inline-block" }}/>
                    Browse by Category
                  </h2>
                  <p style={{ ...s.sectionSub, marginTop:4 }}>
                    {activeCategory==="all"
                      ? `${TOOLS.length} tools across ${CATEGORIES.length-1} categories`
                      : `Showing ${CATEGORIES.find(c=>c.id===activeCategory)?.count||0} tools in ${CATEGORIES.find(c=>c.id===activeCategory)?.name}`}
                  </p>
                </div>
                {activeCategory!=="all"&&(
                  <button type="button" onClick={()=>setActiveCategory("all")}
                    style={{ display:"flex",alignItems:"center",gap:5,padding:"5px 12px",background:"var(--elevated)",border:"1px solid var(--border)",borderRadius:5,color:"var(--fg-3)",fontSize:10,cursor:"pointer",fontFamily:"'PT Mono',monospace",textTransform:"uppercase",letterSpacing:"0.05em" }}>
                    <X size={11}/> Clear filter
                  </button>
                )}
              </div>

              <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))",gap:8 }}>
                {CATEGORIES.map(({ id,name,icon:Icon,count,trend })=>{
                  const active = activeCategory===id;
                  return (
                    <button type="button" key={id} onClick={()=>setActiveCategory(id)} aria-pressed={active}
                      className="cat-card"
                      style={{
                        display:"flex", alignItems:"center", gap:12,
                        padding:"14px 16px",
                        background: active ? "oklch(77% 0.163 70 / 0.07)" : "var(--surface)",
                        border: active ? "1px solid rgba(139,92,246,0.45)" : "1px solid var(--border)",
                        borderTop: active ? "2px solid var(--accent)" : "2px solid transparent",
                        borderRadius:8, cursor:"pointer", textAlign:"left",
                        transition:"all 0.15s", boxShadow: active ? "0 2px 12px rgba(139,92,246,0.1)" : "none"
                      }}>
                      <div style={{
                        width:38, height:38, borderRadius:8, flexShrink:0,
                        background: active ? "rgba(139,92,246,0.14)" : "var(--elevated)",
                        color: active ? "var(--accent)" : "var(--fg-3)",
                        display:"flex", alignItems:"center", justifyContent:"center",
                        transition:"all 0.15s"
                      }}>
                        <Icon size={18}/>
                      </div>
                      <div style={{ flex:1, minWidth:0, display:"flex", flexDirection:"column", gap:3 }}>
                        <span style={{
                          fontSize:13, fontWeight:600,
                          color: active ? "var(--fg)" : "var(--fg)",
                          whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis",
                          letterSpacing:"-0.01em"
                        }}>
                          {name}
                        </span>
                        <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                          <span style={{ fontSize:10, color:"var(--fg-3)", fontFamily:"'PT Mono',monospace" }}>
                            {count} {count===1?"tool":"tools"}
                          </span>
                          {trend&&(
                            <span style={{
                              fontSize:9, fontWeight:700, color:"#16A34A",
                              fontFamily:"'PT Mono',monospace", display:"flex", alignItems:"center", gap:2
                            }}>
                              <TrendingUp size={8}/>{trend}
                            </span>
                          )}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </section>
          )}

          {showTools&&(
            <section style={s.section}>
              <div style={s.sectionHeader}>
                <div>
                  <h2 style={s.sectionTitle}>
                    {activeTab==="Saved"?"Saved Tools":"AI Tool Directory"}
                    <span style={s.countBadge}>{displayTools.length}</span>
                  </h2>
                  <p style={s.sectionSub}>
                    {activeTab==="Saved"?"Your bookmarked AI tools"
                      :activeCategory!=="all"?`Showing: ${CATEGORIES.find(c=>c.id===activeCategory)?.name}`
                      :"All curated AI tools"}
                  </p>
                </div>
                <div style={{ display:"flex",gap:8,alignItems:"center",flexWrap:"wrap" }}>
                  <div style={{ display:"flex",alignItems:"center",gap:6 }}>
                    <label htmlFor="sort-select" style={{ fontSize:12,color:"var(--fg-3)" }}>Sort:</label>
                    <select id="sort-select" style={s.select} value={sortBy} onChange={e=>setSortBy(e.target.value)} className="select">
                      <option value="score">Relevance</option>
                      <option value="rating">Rating</option>
                      <option value="growth">Growth</option>
                    </select>
                  </div>
                  <button type="button" style={{ display:"flex",alignItems:"center",gap:6,padding:"6px 12px",background:filterOpen?"rgba(139,92,246,0.1)":"var(--surface)",border:filterOpen?"1px solid rgba(139,92,246,0.4)":"1px solid var(--border)",borderRadius:8,color:filterOpen?"var(--accent)":"var(--fg-3)",fontSize:12,fontWeight:500,cursor:"pointer",transition:"all 0.15s",position:"relative" }}
                    onClick={()=>setFilterOpen(f=>!f)} className="filter-btn">
                    <SlidersHorizontal size={13}/> Filters
                    {Object.values(filters).some(Boolean)&&<span style={{ position:"absolute",top:4,right:4,width:6,height:6,borderRadius:"50%",background:"var(--accent)" }}/>}
                  </button>
                </div>
              </div>
              {filterOpen&&(
                <div style={{ display:"flex",flexWrap:"wrap",gap:8,padding:"14px 16px",marginBottom:16,background:"var(--elevated)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:12 }}>
                  {[{k:"free",l:"Free Plan"},{k:"openSource",l:"Open Source"},{k:"api",l:"API Available"},{k:"enterprise",l:"Enterprise Ready"}].map(({k,l})=>(
                    <button type="button" key={k} onClick={()=>toggleFilter(k)} aria-pressed={filters[k]}
                      style={{ display:"flex",alignItems:"center",gap:6,padding:"6px 12px",background:filters[k]?"rgba(139,92,246,0.1)":"var(--surface)",border:filters[k]?"1px solid rgba(139,92,246,0.4)":"1px solid var(--border)",borderRadius:8,color:filters[k]?"var(--accent)":"var(--fg-3)",fontSize:12,cursor:"pointer" }} className="filter-chip">
                      {filters[k]?<CheckCircle2 size={13} color="var(--accent)"/>:<Circle size={13} color="var(--fg-3)"/>} {l}
                    </button>
                  ))}
                  {Object.values(filters).some(Boolean)&&(
                    <button type="button" onClick={()=>setFilters({free:false,openSource:false,api:false,enterprise:false})} style={{ display:"flex",alignItems:"center",gap:4,padding:"6px 10px",background:"none",border:"1px solid rgba(239,68,68,0.2)",borderRadius:8,color:"#ef4444",fontSize:12,cursor:"pointer" }}>
                      <X size={12}/> Clear all
                    </button>
                  )}
                </div>
              )}
              {loading?(
                <div>
                  {[1,2,3,4,5,6].map(i=>(
                    <div key={i} style={{ display:"flex",alignItems:"center",gap:12,padding:"14px 0",borderBottom:"1px solid var(--border)" }}>
                      <div className="skeleton" style={{ width:28,height:12,borderRadius:2,flexShrink:0 }}/>
                      <div className="skeleton" style={{ width:36,height:36,borderRadius:6,flexShrink:0 }}/>
                      <div className="skeleton" style={{ width:160,height:14,borderRadius:2 }}/>
                      <div className="skeleton" style={{ flex:1,height:2,borderRadius:2 }}/>
                    </div>
                  ))}
                </div>
              ):displayTools.length===0?(
                <div style={{ display:"flex",flexDirection:"column",alignItems:"center",padding:"60px 0",gap:10 }}>
                  <Bot size={36} color="var(--fg-3)"/>
                  <p style={{ color:"var(--fg-3)",fontSize:13,fontFamily:"'Azeret Mono',monospace",textTransform:"uppercase",letterSpacing:"0.08em" }}>
                    {activeTab==="Saved"?"No saved tools":"No results"}
                  </p>
                </div>
              ):(
                <div>
                  {/* Table header */}
                  <div style={{ display:"flex",alignItems:"center",gap:0,padding:"8px 0",borderBottom:"1px solid var(--border)" }}>
                    <span style={{ minWidth:36,paddingRight:12,flexShrink:0 }}/>
                    <span style={{ flexShrink:0,width:36,marginRight:14 }}/>
                    <span style={{ flex:"0 0 180px",fontSize:8,color:"var(--fg-3)",fontFamily:"'Azeret Mono',monospace",textTransform:"uppercase",letterSpacing:"0.12em" }}>TOOL</span>
                    <span style={{ flex:"0 0 200px",fontSize:8,color:"var(--fg-3)",fontFamily:"'Azeret Mono',monospace",textTransform:"uppercase",letterSpacing:"0.12em" }}>SCORE</span>
                    <span style={{ flex:"0 0 80px",paddingLeft:20,fontSize:8,color:"var(--fg-3)",fontFamily:"'Azeret Mono',monospace",textTransform:"uppercase",letterSpacing:"0.12em" }}>USERS</span>
                    <span style={{ flex:"0 0 60px",fontSize:8,color:"var(--fg-3)",fontFamily:"'Azeret Mono',monospace",textTransform:"uppercase",letterSpacing:"0.12em" }}>GROWTH</span>
                    <span style={{ flex:"0 0 50px",fontSize:8,color:"var(--fg-3)",fontFamily:"'Azeret Mono',monospace",textTransform:"uppercase",letterSpacing:"0.12em" }}>RATING</span>
                    <span style={{ flex:1,paddingLeft:8,fontSize:8,color:"var(--fg-3)",fontFamily:"'Azeret Mono',monospace",textTransform:"uppercase",letterSpacing:"0.12em" }}>TAGS</span>
                    <span style={{ width:130 }}/>
                  </div>
                  {displayTools.map((t,i)=><ToolRow key={t.id} tool={t} index={i} saved={savedIds.has(t.id)} onSave={toggleSave} onToast={showToast}/>)}
                </div>
              )}
            </section>
          )}

          {activeTab==="Global Trends"&&<section style={s.section}><GlobalTrendsTab/></section>}
          {activeTab==="AI Jobs"&&      <section style={s.section}><AIJobsTab/></section>}
          {activeTab==="Compare"&&      <section style={s.section}><CompareTab/></section>}
          {activeTab==="AI Picks"&&     <section style={s.section}><AIPicksTab/></section>}
          {activeTab==="My Stack"&&     <section style={s.section}><MyStackTab onToast={showToast}/></section>}
        </main>

        <footer style={s.footer}>
          <div style={s.footerInner}>
            <div style={{ display:"flex",alignItems:"center",gap:8 }}>
              <Cpu size={14} color="var(--accent)"/>
              <span style={{ color:"var(--fg-3)",fontSize:12,fontFamily:"'Montserrat',sans-serif" }}>AI<span style={{ color:"var(--accent)",fontWeight:800 }}>ATLAS</span> — Global AI Intelligence Platform</span>
            </div>
            <p style={{ color:"var(--fg-3)",fontSize:11,fontFamily:"'Montserrat',sans-serif" }}>© 2025 AIAtlas · {TOOLS.length} tools · estimates only · v2.0</p>
          </div>
        </footer>

        <nav className="mobile-nav">
          {MOBILE_TABS.map(({ id,icon:Icon,label })=>(
            <button type="button" key={id} onClick={()=>switchTab(id)}
              style={{ display:"flex",flexDirection:"column",alignItems:"center",gap:3,padding:"8px 12px",background:"none",border:"none",cursor:"pointer",flex:1,minWidth:0 }}>
              <Icon size={20} color={activeTab===id?"var(--accent)":"var(--fg-3)"}/>
              <span style={{ fontSize:10,fontWeight:activeTab===id?700:400,color:activeTab===id?"var(--accent)":"var(--fg-3)",whiteSpace:"nowrap",fontFamily:"'Montserrat',sans-serif",textTransform:"uppercase",letterSpacing:"0.05em" }}>{label}</span>
              {activeTab===id&&<span style={{ width:4,height:4,borderRadius:8,background:"var(--accent)" }}/>}
            </button>
          ))}
          <button type="button" onClick={()=>setMoreOpen(o=>!o)}
            style={{ display:"flex",flexDirection:"column",alignItems:"center",gap:3,padding:"8px 12px",background:"none",border:"none",cursor:"pointer",flex:1 }}>
            <MoreHorizontal size={20} color="var(--fg-3)"/>
            <span style={{ fontSize:10,color:"var(--fg-3)",fontFamily:"'Montserrat',sans-serif" }}>More</span>
          </button>
          {moreOpen&&(
            <div style={{ position:"absolute",bottom:"calc(100% + 8px)",right:8,background:"var(--bg)",border:"1px solid var(--border)",borderRadius:8,padding:8,display:"flex",flexDirection:"column",gap:2,minWidth:160,zIndex:200,boxShadow:"0 4px 16px rgba(0,0,0,0.07)" }}>
              {["Compare","Saved"].map(tab=>(
                <button type="button" key={tab} onClick={()=>switchTab(tab)}
                  style={{ display:"flex",alignItems:"center",gap:10,padding:"10px 14px",background:activeTab===tab?"rgba(139,92,246,0.08)":"transparent",border:"none",borderRadius:8,color:activeTab===tab?"var(--fg)":"var(--fg-3)",fontSize:11,cursor:"pointer",textAlign:"left",fontFamily:"'Montserrat',sans-serif",fontWeight:700,textTransform:"uppercase",letterSpacing:"0.06em" }}>
                  {tab}
                  {tab==="Saved"&&savedIds.size>0&&<span style={{ fontSize:9,fontWeight:800,background:"var(--accent)",color:"var(--bg)",padding:"1px 5px",borderRadius:8,marginLeft:"auto" }}>{savedIds.size}</span>}
                </button>
              ))}
            </div>
          )}
        </nav>
      </div>
    </ErrorBoundary>
  );
}

// ─── Perspective Design System (typeui.sh) ────────────────────────────────
// Warm cream palette · Inter · bento grid cells · warmth over sterility
// Layered elevation: base → surface → elevated → overlay
// 4px grid · shadows encode hierarchy · anti-flat by design

// ─── Bento Design System (typeui.sh) ─────────────────────────────────────
// ─── Amber Precision ─────────────────────────────────────────────────────
// Scene: PM on standing desk 3pm · near-black #111014 · amber oklch(77% .163 70)
// Epilogue display · DM Mono data · Committed color strategy · OKLCH tokens
// Impeccable: no side-stripes · no hero-metric · no identical cards · no gradient text

// ── Data Broadsheet Design System ─────────────────────────────────────────
// Inspired by covid19virusdata.com — near-pure black, giant condensed numbers,
// horizontal ranked rows, razor dividers, uppercase mono labels.
// Azeret Mono (data/numbers) + Barlow (UI text) · amber accent on pure black.

// ─── Paper Design System (typeui.sh) ──────────────────────────────────────
// Tactile, minimal, content-first · warm paper base · violet accent #8B5CF6
// Montserrat display · Roboto body · PT Mono data · soft paper-lift shadows
// WCAG 2.2 AA · 4px grid · generous whitespace · zero gradients

const s = {
  root:{ minHeight:"100vh", background:"var(--bg)", color:"var(--fg)", fontFamily:"'Roboto','Inter',sans-serif", position:"relative" },

  // NAV — clean white paper strip
  nav:{ position:"sticky", top:0, zIndex:100, background:"var(--nav-bg,rgba(255,255,255,0.96))", backdropFilter:"blur(12px)", borderBottom:"1px solid var(--border)", transition:"box-shadow 0.2s" },
  navScrolled:{ boxShadow:"0 2px 12px rgba(0,0,0,0.07)" },
  navInner:{ maxWidth:1320, margin:"0 auto", padding:"0 28px", height:58, display:"flex", alignItems:"center", gap:16 },
  navLogo:{ display:"flex", alignItems:"center", gap:10, flexShrink:0 },
  logoMark:{ width:28, height:28, borderRadius:7, background:"var(--accent)", display:"flex", alignItems:"center", justifyContent:"center", boxShadow:"0 2px 8px rgba(139,92,246,0.3)" },
  logoText:{ fontSize:16, fontWeight:700, color:"var(--fg)", letterSpacing:"-0.02em", fontFamily:"'Montserrat',sans-serif" },
  logoBadge:{ fontSize:9, fontWeight:700, color:"var(--accent)", letterSpacing:"0.08em", background:"rgba(139,92,246,0.1)", border:"1px solid rgba(139,92,246,0.25)", padding:"2px 7px", borderRadius:4 },
  navTabs:{ display:"flex", gap:1, flex:1, overflow:"auto", scrollbarWidth:"none" },
  navTab:{ padding:"6px 14px", borderRadius:6, fontSize:13, fontWeight:500, color:"var(--fg-3)", background:"transparent", border:"none", cursor:"pointer", display:"flex", alignItems:"center", gap:5, whiteSpace:"nowrap", flexShrink:0, letterSpacing:"-0.01em", transition:"color 0.12s, background 0.12s" },
  navTabActive:{ color:"var(--accent)", background:"rgba(139,92,246,0.08)", fontWeight:600 },
  navBadge:{ background:"var(--accent)", color:"#fff", fontSize:9, fontWeight:700, padding:"2px 6px", borderRadius:10 },
  navCta:{ display:"flex", alignItems:"center", gap:6, padding:"8px 16px", background:"var(--accent)", border:"none", borderRadius:7, color:"#fff", fontSize:13, fontWeight:600, cursor:"pointer", flexShrink:0, letterSpacing:"-0.01em", boxShadow:"0 2px 8px rgba(139,92,246,0.3)", transition:"box-shadow 0.15s, opacity 0.15s" },

  // HERO — warm paper, dot grid texture, left-aligned
  hero:{ position:"relative", overflow:"hidden", padding:"72px 28px 60px", background:"var(--bg)" },
  glow1:{ position:"absolute", top:-60, left:"5%", width:500, height:400, background:"radial-gradient(ellipse,rgba(139,92,246,0.06) 0%,transparent 65%)", pointerEvents:"none" },
  glow2:{ position:"absolute", top:-40, right:"5%", width:360, height:360, background:"radial-gradient(ellipse,rgba(16,185,129,0.04) 0%,transparent 65%)", pointerEvents:"none" },
  heroGrid:{ position:"absolute", inset:0, opacity:0.5, backgroundImage:"radial-gradient(circle,rgba(0,0,0,0.1) 1px,transparent 1px)", backgroundSize:"24px 24px", pointerEvents:"none" },
  heroInner:{ position:"relative", maxWidth:820, margin:"0 auto", display:"flex", flexDirection:"column", alignItems:"flex-start", gap:20 },
  ticker:{ display:"flex", alignItems:"center", gap:8, fontSize:11, background:"#fff", border:"1px solid var(--border)", padding:"4px 12px", borderRadius:20, color:"var(--fg-3)", boxShadow:"0 1px 4px rgba(0,0,0,0.06)" },
  tickerLabel:{ color:"var(--accent)", fontWeight:700, fontSize:10, letterSpacing:"0.08em", display:"flex", alignItems:"center", gap:4, textTransform:"uppercase" },
  heroTitle:{ fontSize:"clamp(30px,4.5vw,56px)", fontWeight:800, color:"var(--fg)", lineHeight:1.1, letterSpacing:"-0.03em", margin:0, textAlign:"left", fontFamily:"'Montserrat',sans-serif" },
  heroAccent:{ color:"var(--accent)", background:"none", WebkitTextFillColor:"var(--accent)", WebkitBackgroundClip:"unset" },
  heroSub:{ fontSize:15, color:"var(--fg-2)", lineHeight:1.65, maxWidth:500, margin:0, textAlign:"left", fontWeight:400 },
  searchWrap:{ width:"100%", maxWidth:580, display:"flex", alignItems:"center", gap:0, background:"#fff", border:"1px solid var(--border)", borderRadius:10, padding:"4px 4px 4px 16px", boxShadow:"0 2px 12px rgba(0,0,0,0.07), 0 0 0 3px rgba(139,92,246,0.05)", transition:"box-shadow 0.2s" },
  searchInput:{ flex:1, background:"transparent", border:"none", outline:"none", color:"var(--fg)", fontSize:14, minWidth:0, padding:"8px 0", fontFamily:"'Roboto',sans-serif" },
  srClear:{ background:"none", border:"none", cursor:"pointer", color:"var(--fg-3)", padding:"8px", display:"flex", alignItems:"center", borderRadius:6 },
  srBtn:{ display:"flex", alignItems:"center", gap:6, padding:"9px 18px", background:"var(--accent)", border:"none", borderRadius:7, color:"#fff", fontSize:13, fontWeight:600, cursor:"pointer", flexShrink:0, boxShadow:"0 2px 8px rgba(139,92,246,0.3)" },
  quickFilters:{ display:"flex", flexWrap:"wrap", gap:8 },
  chip:{ padding:"5px 13px", fontSize:12, color:"var(--fg-3)", background:"#fff", border:"1px solid var(--border)", borderRadius:20, cursor:"pointer", display:"flex", alignItems:"center", gap:4, transition:"all 0.12s", boxShadow:"0 1px 3px rgba(0,0,0,0.05)" },
  statsRow:{ display:"flex", alignItems:"center", flexWrap:"wrap", gap:0, paddingTop:16, borderTop:"1px solid var(--border)", width:"100%" },
  statCard:{ display:"flex", alignItems:"center", gap:8, paddingRight:24, marginRight:24, borderRight:"1px solid var(--border)" },
  statVal:{ fontSize:17, fontWeight:700, color:"var(--accent)", letterSpacing:"-0.02em", fontFamily:"'PT Mono',monospace", lineHeight:1 },
  statLabel:{ fontSize:10, color:"var(--fg-3)", textTransform:"uppercase", letterSpacing:"0.07em", fontFamily:"'PT Mono',monospace" },

  // MAIN
  main:{ maxWidth:1320, margin:"0 auto", padding:"32px 28px 80px" },
  section:{ marginBottom:48 },
  sectionHeader:{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", marginBottom:16, gap:12, flexWrap:"wrap" },
  sectionTitle:{ fontSize:13, fontWeight:700, color:"var(--fg)", margin:0, display:"flex", alignItems:"center", gap:8, letterSpacing:"0.05em", textTransform:"uppercase", fontFamily:"'Montserrat',sans-serif" },
  sectionSub:{ fontSize:12, color:"var(--fg-3)", margin:"3px 0 0", fontFamily:"'PT Mono',monospace" },
  countBadge:{ fontSize:10, fontWeight:700, color:"var(--accent)", background:"rgba(139,92,246,0.1)", padding:"2px 9px", borderRadius:10 },
  select:{ background:"#fff", border:"1px solid var(--border)", borderRadius:7, color:"var(--fg-2)", fontSize:12, padding:"6px 10px", cursor:"pointer", outline:"none", boxShadow:"0 1px 3px rgba(0,0,0,0.05)" },

  // TOOL CARDS — white paper cards, lift on hover
  toolCard:{ background:"#fff", border:"1px solid var(--border)", borderRadius:12, padding:18, boxShadow:"0 1px 4px rgba(0,0,0,0.06)", transition:"transform 0.18s, box-shadow 0.18s", display:"flex", flexDirection:"column", gap:12 },
  tcHead:{ display:"flex", alignItems:"flex-start", gap:12 },
  tcInfo:{ flex:1, minWidth:0 },
  tcName:{ fontSize:14, fontWeight:700, color:"var(--fg)", margin:0, letterSpacing:"-0.01em", fontFamily:"'Montserrat',sans-serif" },
  trendBadge:{ fontSize:9, fontWeight:700, color:"var(--accent)", background:"rgba(139,92,246,0.1)", border:"1px solid rgba(139,92,246,0.25)", padding:"2px 7px", borderRadius:10, display:"flex", alignItems:"center", gap:3 },
  tcCompany:{ fontSize:11, color:"var(--fg-3)", fontFamily:"'PT Mono',monospace" },
  iconBtn:{ width:30, height:30, borderRadius:7, background:"var(--elevated)", border:"1px solid var(--border)", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", transition:"all 0.12s" },
  scoreTrack:{ flex:1, height:2, borderRadius:2, background:"var(--border)", overflow:"hidden" },
  scoreFill:{ height:"100%", borderRadius:2, transition:"width 0.5s" },
  tcDesc:{ fontSize:12, color:"var(--fg-2)", lineHeight:1.65, margin:0, fontWeight:400 },
  tagMore:{ fontSize:10, color:"var(--fg-3)", padding:"2px 7px", background:"var(--elevated)", border:"1px solid var(--border)", borderRadius:5 },
  metric:{ display:"flex", alignItems:"center", gap:4 },
  mv:{ fontSize:11, fontWeight:600, color:"var(--fg-2)", fontFamily:"'PT Mono',monospace" },
  exLabel:{ fontSize:9, fontWeight:700, color:"var(--fg-3)", textTransform:"uppercase", letterSpacing:"0.1em", fontFamily:"'PT Mono',monospace" },
  featItem:{ fontSize:11, color:"var(--fg-2)", display:"flex", alignItems:"center", gap:3, background:"var(--elevated)", padding:"2px 8px", borderRadius:5, border:"1px solid var(--border)" },
  pBadge:{ fontSize:10, color:"#14532D", background:"#DCFCE7", border:"1px solid #BBF7D0", padding:"2px 8px", borderRadius:5, fontWeight:600, fontFamily:"'PT Mono',monospace" },
  pPlan:{ fontSize:10, color:"var(--accent)", background:"rgba(139,92,246,0.08)", border:"1px solid rgba(139,92,246,0.2)", padding:"2px 8px", borderRadius:5, fontWeight:600, fontFamily:"'PT Mono',monospace" },
  badgeEnt:{ fontSize:9, fontWeight:600, color:"#1D4ED8", display:"flex", alignItems:"center", gap:3, background:"#DBEAFE", border:"1px solid #BFDBFE", padding:"2px 7px", borderRadius:5 },
  badgeOS:{ fontSize:9, fontWeight:600, color:"#14532D", display:"flex", alignItems:"center", gap:3, background:"#DCFCE7", border:"1px solid #BBF7D0", padding:"2px 7px", borderRadius:5 },
  expandBtn:{ display:"flex", alignItems:"center", justifyContent:"center", gap:4, padding:"6px 12px", background:"var(--elevated)", border:"1px solid var(--border)", borderRadius:7, color:"var(--fg-3)", fontSize:10, cursor:"pointer", fontWeight:500, transition:"all 0.12s" },

  // PANELS
  card:{ background:"#fff", border:"1px solid var(--border)", borderRadius:12, padding:"20px 20px 16px", boxShadow:"0 1px 4px rgba(0,0,0,0.06)" },
  chartTitle:{ fontSize:13, fontWeight:700, color:"var(--fg)", margin:"0 0 2px", letterSpacing:"-0.01em", fontFamily:"'Montserrat',sans-serif" },
  chartSub:{ fontSize:10, color:"var(--fg-3)", margin:"0 0 12px", fontFamily:"'PT Mono',monospace" },
  regionCard:{ background:"#fff", border:"1px solid var(--border)", borderRadius:9, padding:"12px 14px", boxShadow:"0 1px 3px rgba(0,0,0,0.05)", transition:"box-shadow 0.12s" },
  addToolBtn:{ display:"flex", alignItems:"center", gap:6, padding:"8px 16px", background:"var(--accent)", border:"none", borderRadius:7, color:"#fff", fontSize:12, fontWeight:600, cursor:"pointer", boxShadow:"0 2px 8px rgba(139,92,246,0.25)", transition:"opacity 0.15s, box-shadow 0.15s" },
  pickerBtn:{ display:"flex", alignItems:"center", gap:10, padding:"12px 14px", background:"#fff", border:"1px solid var(--border)", borderRadius:9, cursor:"pointer", transition:"border-color 0.12s, box-shadow 0.12s", textAlign:"left", boxShadow:"0 1px 3px rgba(0,0,0,0.05)" },
  th:{ fontSize:10, fontWeight:600, color:"var(--fg-3)", textAlign:"center", padding:"10px", borderBottom:"1px solid var(--border)", textTransform:"uppercase", letterSpacing:"0.07em", background:"var(--elevated)", fontFamily:"'PT Mono',monospace" },
  td:{ fontSize:13, textAlign:"center", padding:"10px", display:"table-cell", verticalAlign:"middle" },
  tdLabel:{ fontSize:11, color:"var(--fg-2)", padding:"10px", fontWeight:500, fontFamily:"'PT Mono',monospace", textTransform:"uppercase", letterSpacing:"0.05em" },
  footer:{ borderTop:"1px solid var(--border)", padding:28, background:"var(--elevated)" },
  footerInner:{ maxWidth:1320, margin:"0 auto", display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:8 },
};

const css = `
@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800&family=Roboto:wght@300;400;500&family=PT+Mono&display=swap');
*{box-sizing:border-box;margin:0;padding:0}

:root {
  --bg:       #F4F1EB;
  --surface:  #FFFFFF;
  --elevated: #FAFAF8;
  --accent:   #8B5CF6;
  --fg:       #111111;
  --fg-2:     #374151;
  --fg-3:     #9CA3AF;
  --border:   #E5E2DB;
}

:focus-visible{outline:2px solid var(--accent);outline-offset:2px;border-radius:5px}

/* Nav */
.nav-tab:hover{color:var(--fg)!important;background:rgba(139,92,246,0.06)!important}
.cta-btn:hover{opacity:0.87!important;box-shadow:0 4px 16px rgba(139,92,246,0.4)!important}

/* Chips */
.chip:hover{background:rgba(139,92,246,0.08)!important;border-color:rgba(139,92,246,0.3)!important;color:var(--accent)!important}

/* Category cards */
.cat-card:hover{border-top-color:var(--accent)!important;box-shadow:0 4px 16px rgba(0,0,0,0.08)!important}

/* Tool cards — paper lift */
.tool-card:hover{transform:translateY(-3px)!important;box-shadow:0 8px 24px rgba(0,0,0,0.1),0 2px 6px rgba(0,0,0,0.06)!important;border-color:rgba(139,92,246,0.3)!important}
.tool-card[data-trending="true"]{border-top:2px solid var(--accent)!important}

/* Brand icon hover — desaturate to paper, color on hover */
.brand-icon-img{filter:grayscale(1) brightness(0.92);transition:filter 0.2s}
.tool-card:hover .brand-icon-img{filter:grayscale(0) brightness(1)}
.brand-icon{transition:border-color 0.15s}
.tool-card:hover .brand-icon{border-color:rgba(139,92,246,0.3)!important}

.icon-btn:hover{background:rgba(139,92,246,0.08)!important;border-color:rgba(139,92,246,0.25)!important}
.expand-btn:hover{background:rgba(139,92,246,0.06)!important;color:var(--accent)!important}
.filter-chip:hover,.filter-btn:hover{border-color:rgba(139,92,246,0.3)!important;color:var(--accent)!important;background:rgba(139,92,246,0.06)!important}
.picker-btn:hover{border-color:rgba(139,92,246,0.35)!important;box-shadow:0 2px 12px rgba(0,0,0,0.08)!important}
.region-card:hover{box-shadow:0 4px 16px rgba(0,0,0,0.08)!important;border-color:rgba(139,92,246,0.25)!important}
.search-wrap:focus-within{box-shadow:0 2px 12px rgba(0,0,0,0.08),0 0 0 3px rgba(139,92,246,0.15)!important;border-color:rgba(139,92,246,0.4)!important}

/* Inputs */
.search-input::placeholder{color:var(--fg-3)}
.select option{background:#fff;color:var(--fg)}
.nav-tabs-desktop::-webkit-scrollbar{display:none}

/* Skeleton */
.skeleton{background:linear-gradient(90deg,#F4F1EB 25%,#EAE7E0 50%,#F4F1EB 75%);background-size:200% 100%;animation:shimmer 1.4s infinite}
@keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}

/* Animations */
@keyframes toastIn{from{opacity:0;transform:translateY(-8px)}to{opacity:1;transform:translateY(0)}}
@keyframes tickerFade{from{opacity:0;transform:translateY(4px)}to{opacity:1;transform:translateY(0)}}
.ticker-fade{animation:tickerFade 0.35s ease}

/* Scrollbar — paper style */
::-webkit-scrollbar{width:4px;height:4px}
::-webkit-scrollbar-track{background:transparent}
::-webkit-scrollbar-thumb{background:var(--border);border-radius:2px}

/* Mobile nav — white paper strip */
.mobile-nav{display:none;position:fixed;bottom:0;left:0;right:0;background:rgba(255,255,255,0.97);border-top:1px solid var(--border);backdrop-filter:blur(12px);padding:6px 4px 10px;z-index:200;flex-direction:row;align-items:center;box-shadow:0 -2px 12px rgba(0,0,0,0.07)}

/* Recharts */
.recharts-cartesian-grid line{stroke:var(--border)!important}
.recharts-text{fill:var(--fg-3)!important}
.recharts-legend-item-text{color:var(--fg-2)!important}

/* Responsive */
@media(max-width:768px){
  .nav-tabs-desktop{display:none!important}
  .nav-cta-desktop{display:none!important}
  .mobile-nav{display:flex!important}
  #main-content{padding-bottom:80px!important}
  .stats-grid{grid-template-columns:repeat(2,1fr)!important}
  .chart-grid{grid-template-columns:1fr!important}
}
@media(max-width:520px){.stats-grid{grid-template-columns:repeat(2,1fr)!important}}
`;
