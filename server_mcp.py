# -*- coding: utf-8 -*-
import os, sys, json, re, time, uuid
from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
from urllib.parse import urlparse

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.join(BASE_DIR, 'data')
os.makedirs(DATA_DIR, exist_ok=True)
SUBMISSIONS_FILE = os.path.join(DATA_DIR, 'submissions.json')
VISITORS_FILE = os.path.join(DATA_DIR, 'visitors.json')

ACTIVE_SESSIONS = {}

def load_submissions():
    if not os.path.exists(SUBMISSIONS_FILE):
        with open(SUBMISSIONS_FILE, 'w', encoding='utf-8') as f:
            json.dump([], f, ensure_ascii=False, indent=2)
        return []
    try:
        with open(SUBMISSIONS_FILE, 'r', encoding='utf-8') as f:
            return json.load(f)
    except Exception:
        return []

def save_submissions(data):
    with open(SUBMISSIONS_FILE, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

def load_visitors():
    if not os.path.exists(VISITORS_FILE):
        with open(VISITORS_FILE, 'w', encoding='utf-8') as f:
            json.dump([], f, ensure_ascii=False, indent=2)
        return []
    try:
        with open(VISITORS_FILE, 'r', encoding='utf-8') as f:
            return json.load(f)
    except Exception:
        return []

def save_visitors(data):
    with open(VISITORS_FILE, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

def load_prism_data():
    data_path = os.path.join(BASE_DIR, 'assets', 'js', 'data-core.js')
    if not os.path.exists(data_path):
        return {}, {}
    with open(data_path, 'r', encoding='utf-8') as f:
        content = f.read()

    shades_match = re.search(r'const\s+SHADES_64\s*=\s*({[\s\S]*?});\s*const ALL_CODES', content)
    shades_64 = {}
    if shades_match:
        raw = shades_match.group(1)
        raw = re.sub(r'//.*', '', raw)
        raw = re.sub(r'([{,]\s*)([a-zA-Z0-9_]+)\s*:', r'"":', raw)
        raw = re.sub(r',\s*([}\]])', r'', raw)
        try: shades_64 = json.loads(raw)
        except Exception: pass

    core_match = re.search(r'const\s+CORE_TYPES\s*=\s*({[\s\S]*?});\s*const VARIANTS', content)
    core_types = {}
    if core_match:
        raw_c = core_match.group(1)
        raw_c = re.sub(r'//.*', '', raw_c)
        raw_c = re.sub(r'([{,]\s*)([a-zA-Z0-9_]+)\s*:', r'"":', raw_c)
        raw_c = re.sub(r',\s*([}\]])', r'', raw_c)
        try: core_types = json.loads(raw_c)
        except Exception: pass

    return shades_64, core_types

SHADES_64, CORE_TYPES = load_prism_data()

MCP_TOOLS = [
    {
        "name": "get_64_personality_profile",
        "description": "Look up full personality profile for any of the 64 PRISM64 archetypes (e.g. INTP-OH, INTJ-AC). Returns title, tagline, deep description, 4 key strengths, growth points, career matches, and population share.",
        "inputSchema": {
            "type": "object",
            "properties": {
                "typeCode": {"type": "string", "description": "PRISM64 code e.g. INTP-OH, INTJ-AH"},
                "lang": {"type": "string", "enum": ["th", "en"], "default": "th"}
            },
            "required": ["typeCode"]
        }
    },
    {
        "name": "search_personality_types",
        "description": "Search and filter among all 64 PRISM64 archetypes by keyword, spectrum, or variant.",
        "inputSchema": {
            "type": "object",
            "properties": {
                "query": {"type": "string", "description": "Search keyword e.g. 'นวัตกรรม', 'สันโดษ'"},
                "spectrum": {"type": "string", "enum": ["all", "violet", "green", "blue", "orange"]},
                "variant": {"type": "string", "enum": ["all", "AH", "AC", "OH", "OC"]},
                "lang": {"type": "string", "enum": ["th", "en"], "default": "th"}
            }
        }
    },
    {
        "name": "calculate_hexaco_prism_scores",
        "description": "Calculate 6-dimensional PRISM64 scores and determine the exact archetype code.",
        "inputSchema": {
            "type": "object",
            "properties": {
                "energy": {"type": "number", "description": "0-100 score for Extraversion vs Introversion"},
                "input": {"type": "number", "description": "0-100 score for Sensing vs Intuition"},
                "deciding": {"type": "number", "description": "0-100 score for Thinking vs Feeling"},
                "structure": {"type": "number", "description": "0-100 score for Judging vs Perceiving"},
                "identity": {"type": "number", "description": "0-100 score for Assertive vs Oscillating"},
                "relating": {"type": "number", "description": "0-100 score for Harmony vs Calm"}
            },
            "required": ["energy", "input", "deciding", "structure", "identity", "relating"]
        }
    },
    {
        "name": "analyze_compatibility",
        "description": "Analyze psychological compatibility and communication dynamics between two PRISM64 types.",
        "inputSchema": {
            "type": "object",
            "properties": {
                "type1": {"type": "string", "description": "First code e.g. INTP-OH"},
                "type2": {"type": "string", "description": "Second code e.g. ENTJ-AH"},
                "lang": {"type": "string", "enum": ["th", "en"], "default": "th"}
            },
            "required": ["type1", "type2"]
        }
    },
    {
        "name": "list_all_64_archetypes",
        "description": "Retrieve complete list of all 64 PRISM64 archetypes organized by Spectra.",
        "inputSchema": {
            "type": "object",
            "properties": {"lang": {"type": "string", "enum": ["th", "en"], "default": "th"}}
        }
    }
]

def handle_mcp_tool_call(tool_name, arguments):
    lang = arguments.get('lang', 'th')
    if tool_name == 'get_64_personality_profile':
        code = arguments.get('typeCode', '').strip().upper()
        if not code: return {"error": "Missing typeCode"}
        parts = code.split('-')
        core_code = parts[0]
        vk = parts[1] if len(parts) > 1 else 'AH'
        full_code = f"{core_code}-{vk}"
        shade = SHADES_64.get(full_code)
        core = CORE_TYPES.get(core_code)
        if not shade and not core:
            return {"error": f"Type {code} not found"}
        return {
            "code": full_code, "coreType": core_code, "variant": vk,
            "title": shade.get('title', {}).get(lang) if shade else (core.get('name', {}).get(lang) if core else core_code),
            "baseName": core.get('name', {}).get(lang) if core else core_code,
            "shadeLabel": shade.get('shadeLabel', {}).get(lang) if shade else vk,
            "tagline": shade.get('tagline', {}).get(lang) if shade else (core.get('tagline', {}).get(lang) if core else ''),
            "description": shade.get('desc', {}).get(lang) if shade else '',
            "strengths": shade.get('strengths', {}).get(lang) if shade else [],
            "growth": shade.get('growth', {}).get(lang) if shade else '',
            "careers": core.get('careers', {}).get(lang) if core else [],
            "populationShare": f"{(core.get('share', 4)/4):.2f}%" if core else "1.56%",
            "bestMatches": core.get('matches', []) if core else []
        }
    elif tool_name == 'search_personality_types':
        q = arguments.get('query', '').strip().lower()
        spec = arguments.get('spectrum', 'all')
        vk_filter = arguments.get('variant', 'all')
        results = []
        for code, shade in SHADES_64.items():
            parts = code.split('-')
            cc = parts[0]
            vk = parts[1]
            core = CORE_TYPES.get(cc, {})
            if spec != 'all' and core.get('spectrum') != spec: continue
            if vk_filter != 'all' and vk != vk_filter: continue
            t_text = shade.get('title', {}).get(lang, '')
            tag_text = shade.get('tagline', {}).get(lang, '')
            n_text = core.get('name', {}).get(lang, '')
            blob = f"{code} {t_text} {tag_text} {n_text}".lower()
            if q and q not in blob: continue
            results.append({"code": code, "title": t_text, "baseName": n_text, "tagline": tag_text, "spectrum": core.get('spectrum', 'violet')})
        return {"count": len(results), "types": results}
    elif tool_name == 'calculate_hexaco_prism_scores':
        e = arguments.get('energy', 50); s = arguments.get('input', 50)
        t = arguments.get('deciding', 50); j = arguments.get('structure', 50)
        a = arguments.get('identity', 50); h = arguments.get('relating', 50)
        c_code = ('E' if e>=50 else 'I') + ('S' if s>=50 else 'N') + ('T' if t>=50 else 'F') + ('J' if j>=50 else 'P')
        v_code = ('A' if a>=50 else 'O') + ('H' if h>=50 else 'C')
        full = f"{c_code}-{v_code}"
        prof = handle_mcp_tool_call('get_64_personality_profile', {'typeCode': full, 'lang': lang})
        return {"resultCode": full, "profile": prof}
    elif tool_name == 'analyze_compatibility':
        t1 = arguments.get('type1', '').strip().upper()
        t2 = arguments.get('type2', '').strip().upper()
        p1 = handle_mcp_tool_call('get_64_personality_profile', {'typeCode': t1, 'lang': lang})
        p2 = handle_mcp_tool_call('get_64_personality_profile', {'typeCode': t2, 'lang': lang})
        c1 = t1.split('-')[0]; c2 = t2.split('-')[0]
        matches1 = CORE_TYPES.get(c1, {}).get('matches', [])
        is_m = c2 in matches1
        return {
            "pair": f"{t1} ❤️ {t2}",
            "synergyScore": "92%" if is_m else "78%",
            "matchTier": "สูงมาก (Natural Complement)" if is_m else "สมดุลและเกื้อหนุนกัน (Growth Opportunity)",
            "summary": f"{p1.get('title')} และ {p2.get('title')} สามารถเติมเต็มมุมมองซึ่งกันและกันได้ดี"
        }
    elif tool_name == 'list_all_64_archetypes':
        res = []
        for code, shade in SHADES_64.items():
            res.append({"code": code, "title": shade.get('title', {}).get(lang), "tagline": shade.get('tagline', {}).get(lang)})
        return {"totalCount": len(res), "types": res}
    return {"error": f"Unknown tool: {tool_name}"}

class PRISMMCPHandler(SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept')
        self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
        super().end_headers()

    def do_OPTIONS(self):
        self.send_response(204)
        self.end_headers()

    def do_GET(self):
        parsed = urlparse(self.path)
        if parsed.path == '/mcp' or parsed.path == '/mcp/info':
            accept = self.headers.get('Accept', '')
            host = self.headers.get('Host', 'localhost:8000')
            proto = 'https' if self.headers.get('X-Forwarded-Proto') == 'https' else 'http'
            host_url = f"{proto}://{host}"

            info = {
                "name": "PRISM64 Gemini Spark MCP Server",
                "version": "2.0.0",
                "protocolVersion": "2024-11-05",
                "status": "online",
                "availableToolsCount": len(MCP_TOOLS),
                "endpoint": "/mcp"
            }
            self.send_response(200)
            self.send_header('Content-Type', 'application/json; charset=utf-8')
            self.end_headers()
            self.wfile.write(json.dumps(info, ensure_ascii=False, indent=2).encode('utf-8'))
            return

        elif parsed.path == '/api/admin/submissions':
            submissions = load_submissions()
            self.send_response(200)
            self.send_header('Content-Type', 'application/json; charset=utf-8')
            self.end_headers()
            self.wfile.write(json.dumps({"count": len(submissions), "submissions": submissions}, ensure_ascii=False).encode('utf-8'))
            return

        elif parsed.path == '/api/admin/live-traffic':
            now = time.time() * 1000
            submissions = load_submissions()
            visitors = load_visitors()

            # Active in last 2 minutes (120,000 ms)
            active_list = []
            for s_id, sess in ACTIVE_SESSIONS.items():
                if now - sess.get('lastSeen', 0) <= 120000:
                    active_list.append(sess)

            # If visitors array exists and active list empty, use latest visitor if within 5 mins
            if not active_list and visitors:
                if now - visitors[0].get('timestamp', 0) <= 300000:
                    active_list.append(visitors[0])

            res_payload = {
                "activeCount": len(active_list),
                "activeVisitors": active_list,
                "recentVisits": visitors[:30],
                "submissionsCount": len(submissions),
                "submissions": submissions
            }
            self.send_response(200)
            self.send_header('Content-Type', 'application/json; charset=utf-8')
            self.end_headers()
            self.wfile.write(json.dumps(res_payload, ensure_ascii=False).encode('utf-8'))
            return

        super().do_GET()

    def do_POST(self):
        parsed = urlparse(self.path)
        length = int(self.headers.get('Content-Length', 0))
        body = self.rfile.read(length).decode('utf-8') if length > 0 else '{}'

        client_ip = self.headers.get('X-Forwarded-For', self.client_address[0])
        if ',' in client_ip: client_ip = client_ip.split(',')[0].strip()

        if parsed.path == '/api/telemetry/visit':
            try: payload = json.loads(body)
            except Exception: payload = {}

            now = int(time.time() * 1000)
            session_id = payload.get('sessionId') or f"sess_{uuid.uuid4().hex[:8]}"
            geo_info = payload.get('geo', {})
            device_info = payload.get('device', {})

            visit_entry = {
                "sessionId": session_id,
                "timestamp": now,
                "lastSeen": now,
                "ip": client_ip,
                "currentPage": payload.get('page', '#home'),
                "geo": {
                    "city": geo_info.get('city', 'Localhost'),
                    "region": geo_info.get('region', 'Local Area'),
                    "country": geo_info.get('country', 'Thailand'),
                    "countryCode": geo_info.get('countryCode', 'TH'),
                    "lat": float(geo_info.get('lat', 13.7563)),
                    "lng": float(geo_info.get('lng', 100.5018)),
                    "org": geo_info.get('org', 'Direct Network'),
                    "source": geo_info.get('source', 'IP_GEOLOCATION')
                },
                "device": device_info,
                "isOnline": True
            }

            # Update memory active session
            ACTIVE_SESSIONS[session_id] = visit_entry

            # Persist to visitors log
            visitors = load_visitors()
            # Update existing session or prepend
            existing_idx = next((i for i, v in enumerate(visitors) if v.get('sessionId') == session_id), None)
            if existing_idx is not None:
                visitors[existing_idx] = visit_entry
            else:
                visitors.insert(0, visit_entry)
            save_visitors(visitors[:100]) # keep latest 100

            self.send_response(200)
            self.send_header('Content-Type', 'application/json; charset=utf-8')
            self.end_headers()
            self.wfile.write(json.dumps({"status": "visit_logged", "sessionId": session_id}, ensure_ascii=False).encode('utf-8'))
            return

        elif parsed.path == '/api/telemetry/submit':
            try: payload = json.loads(body)
            except Exception: payload = {}

            geo_info = payload.get('geo', {})
            now = int(time.time() * 1000)

            submission_entry = {
                "id": f"sub_{uuid.uuid4().hex[:8]}",
                "timestamp": now,
                "fullCode": payload.get('fullCode', 'INTP-OH'),
                "coreCode": payload.get('coreCode', 'INTP'),
                "variantKey": payload.get('variantKey', 'OH'),
                "title": payload.get('title', ''),
                "testMode": payload.get('testMode', 'quick'),
                "scores": payload.get('scores', {}),
                "ip": client_ip,
                "geo": {
                    "city": geo_info.get('city', 'Bangkok'),
                    "region": geo_info.get('region', 'Bangkok'),
                    "country": geo_info.get('country', 'Thailand'),
                    "countryCode": geo_info.get('countryCode', 'TH'),
                    "lat": float(geo_info.get('lat', 13.7563)),
                    "lng": float(geo_info.get('lng', 100.5018)),
                    "org": geo_info.get('org', 'ISP Network'),
                    "source": geo_info.get('source', 'IP_GEOLOCATION')
                },
                "device": payload.get('device', {})
            }

            subs = load_submissions()
            subs.insert(0, submission_entry)
            save_submissions(subs)

            self.send_response(200)
            self.send_header('Content-Type', 'application/json; charset=utf-8')
            self.end_headers()
            self.wfile.write(json.dumps({"status": "saved", "id": submission_entry["id"]}, ensure_ascii=False).encode('utf-8'))
            return

        elif parsed.path == '/api/admin/submissions/clear':
            save_submissions([])
            save_visitors([])
            ACTIVE_SESSIONS.clear()
            self.send_response(200)
            self.send_header('Content-Type', 'application/json; charset=utf-8')
            self.end_headers()
            self.wfile.write(json.dumps({"status": "cleared"}, ensure_ascii=False).encode('utf-8'))
            return

        elif parsed.path == '/mcp' or parsed.path == '/api/mcp':
            try: req = json.loads(body)
            except Exception:
                self.send_response(400)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({"jsonrpc": "2.0", "error": {"code": -32700, "message": "Parse error"}}).encode('utf-8'))
                return

            req_id = req.get('id')
            method = req.get('method', '')
            params = req.get('params', {})
            res = {"jsonrpc": "2.0", "id": req_id}

            if method == 'initialize':
                res['result'] = {
                    "protocolVersion": "2024-11-05",
                    "serverInfo": {"name": "PRISM64 Personality MCP Server", "version": "2.0.0"},
                    "capabilities": {"tools": {"listChanged": False}, "resources": {}, "prompts": {}}
                }
            elif method == 'notifications/initialized':
                self.send_response(204); self.end_headers(); return
            elif method == 'tools/list':
                res['result'] = {"tools": MCP_TOOLS}
            elif method == 'tools/call':
                t_name = params.get('name')
                t_args = params.get('arguments', {})
                t_res = handle_mcp_tool_call(t_name, t_args)
                res['result'] = {"content": [{"type": "text", "text": json.dumps(t_res, ensure_ascii=False, indent=2)}]}
            elif method == 'resources/list':
                res['result'] = {"resources": [{"uri": "prism64://database/all_types", "name": "64 Archetypes Catalog", "mimeType": "application/json"}]}
            elif method == 'prompts/list':
                res['result'] = {"prompts": [{"name": "personality_coach", "description": "Empathetic PRISM64 personality coach"}]}
            else:
                res['error'] = {"code": -32601, "message": f"Method not found: {method}"}

            self.send_response(200)
            self.send_header('Content-Type', 'application/json; charset=utf-8')
            self.end_headers()
            self.wfile.write(json.dumps(res, ensure_ascii=False).encode('utf-8'))
            return

        self.send_response(404); self.end_headers()

if __name__ == '__main__':
    port = int(os.environ.get('PORT', sys.argv[1] if len(sys.argv) > 1 else 8000))
    os.chdir(BASE_DIR)
    httpd = ThreadingHTTPServer(('0.0.0.0', port), PRISMMCPHandler)
    httpd.daemon_threads = True
    print(f"PRISM64 Gemini Spark MCP Server running on port {port}")
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        httpd.server_close()
