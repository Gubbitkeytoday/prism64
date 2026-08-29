/* ==========================================================================
   PRISM64 — Stealth Admin Portal & Live Geo Map Operations Center
   --------------------------------------------------------------------------
   - Anti-detection gateway: Hidden from crawlers and public UI
   - Secret triggers: [Ctrl + Shift + A] / [#prism-admin-gate] / [Logo 3x click]
   - Cyber-glass Master PIN security (Default: 646464)
   - Interactive Leaflet Live Map of all user test submissions & coordinates
   - Live Gemini Spark MCP endpoint manager & interactive JSON-RPC tester
   - 64 Archetypes live database editor & JSON export/backup
   ========================================================================== */

const PRISM_ADMIN = (() => {
  const MASTER_PIN = '646464';
  let state = {
    isAuthenticated: sessionStorage.getItem('prism64_admin_token') === 'authorized',
    activeTab: 'telemetry',
    searchQuery: '',
    submissions: [],
    mapInstance: null,
    markers: []
  };

  /* --------------------------------------------------------- Init */
  function init() {
    _bindSecretTriggers();
    _handleAdminRoute();
    window.addEventListener('hashchange', _handleAdminRoute);
  }

  /* --------------------------------------------------------- Secret Triggers */
  function _bindSecretTriggers() {
    window.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        e.preventDefault();
        _togglePortal();
      }
    });

    let clickCount = 0;
    let clickTimer = null;
    const logo = document.querySelector('.logo');
    if (logo) {
      logo.addEventListener('click', (e) => {
        clickCount++;
        if (clickCount === 1) {
          clickTimer = setTimeout(() => { clickCount = 0; }, 800);
        } else if (clickCount >= 3) {
          clearTimeout(clickTimer);
          clickCount = 0;
          e.preventDefault();
          _togglePortal();
        }
      });
    }
  }

  function _handleAdminRoute() {
    const hash = window.location.hash.slice(1);
    if (hash === 'prism-admin-gate' || hash === 'admin') {
      _openPortal();
    }
  }

  function _togglePortal() {
    if (window.location.hash === '#prism-admin-gate') {
      window.location.hash = 'home';
    } else {
      window.location.hash = 'prism-admin-gate';
    }
  }

  function _openPortal() {
    const viewHome = document.getElementById('view-home');
    const viewTest = document.getElementById('view-test');
    const viewResult = document.getElementById('view-result');
    const viewAdmin = document.getElementById('view-admin');

    if (!viewAdmin) return;

    if (viewHome) viewHome.hidden = true;
    if (viewTest) viewTest.hidden = true;
    if (viewResult) viewResult.hidden = true;
    viewAdmin.hidden = false;

    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (!state.isAuthenticated) {
      _renderLockScreen();
    } else {
      _loadSubmissionsData().then(() => {
        _renderDashboard();
      });
    }
  }

  function _closePortal() {
    window.location.hash = 'home';
  }

  async function _loadSubmissionsData() {
    try {
      const res = await fetch('/api/admin/submissions');
      if (res.ok) {
        const json = await res.json();
        state.submissions = json.submissions || [];
      }
    } catch (e) {
      console.warn('Submissions load error:', e);
    }
  }

  /* --------------------------------------------------------- Lock Screen */
  function _renderLockScreen() {
    const container = document.getElementById('view-admin');
    if (!container) return;

    container.innerHTML = `
      <div class="admin-lock-screen">
        <div class="admin-lock-card">
          <div class="admin-lock-badge">🔒 PRISM64 STEALTH GATEWAY</div>
          <h2 class="admin-lock-title">ศูนย์ควบคุมหลังบ้านเฉพาะแอดมิน</h2>
          <p class="admin-lock-sub">กรุณากรอกรหัส Master Passkey เพื่อเข้าสู่ระบบจัดการและแผนที่พิกัดผู้ใช้</p>

          <form id="admin-login-form" class="admin-pin-form">
            <div class="admin-pin-inputs">
              <input type="password" id="admin-pin-input" class="admin-pin-field" maxlength="12" placeholder="••••••" autofocus autocomplete="off" />
            </div>
            <div id="admin-pin-error" class="admin-pin-error" hidden>❌ รหัสผ่านไม่ถูกต้อง กรุณาลองใหม่อีกครั้ง</div>
            <button type="submit" class="btn btn--primary admin-login-btn">
              ⚡ ยืนยันรหัสผ่าน (Unlock Gate)
            </button>
            <div class="admin-hint-text">
              🔑 Default Master Key: <code>646464</code> | <a href="#home" class="admin-back-link">กลับสู่หน้าหลัก</a>
            </div>
          </form>
        </div>
      </div>
    `;

    const form = document.getElementById('admin-login-form');
    const input = document.getElementById('admin-pin-input');
    const errorEl = document.getElementById('admin-pin-error');

    if (form && input) {
      form.onsubmit = async (e) => {
        e.preventDefault();
        const pin = input.value.trim();
        if (pin === MASTER_PIN) {
          state.isAuthenticated = true;
          sessionStorage.setItem('prism64_admin_token', 'authorized');
          await _loadSubmissionsData();
          _renderDashboard();
        } else {
          if (errorEl) errorEl.hidden = false;
          input.value = '';
          input.focus();
        }
      };
    }
  }

  /* --------------------------------------------------------- Admin Dashboard */
  function _renderDashboard() {
    const container = document.getElementById('view-admin');
    if (!container) return;

    container.innerHTML = `
      <div class="admin-dashboard-container">
        
        <!-- Header Bar -->
        <header class="admin-topbar">
          <div class="admin-brand">
            <span class="admin-brand-icon">🔮</span>
            <div>
              <div class="admin-brand-name">PRISM64 STEALTH OPS</div>
              <div class="admin-brand-status"><span class="pulse-dot"></span> Telemetry & Geo Map: <b>ACTIVE</b> (${state.submissions.length} Records)</div>
            </div>
          </div>

          <div class="admin-topbar-actions">
            <button id="admin-btn-refresh-subs" class="btn btn--xs btn--ghost">🔄 รีเฟรชข้อมูล</button>
            <button id="admin-btn-preview" class="btn btn--xs btn--ghost">🌐 กลับหน้าเว็บหลัก</button>
            <button id="admin-btn-logout" class="btn btn--xs btn--danger">🚪 ออกจากระบบ</button>
          </div>
        </header>

        <!-- Navigation Tabs -->
        <nav class="admin-nav-tabs">
          <button class="admin-tab-btn ${state.activeTab === 'telemetry' ? 'is-active' : ''}" data-tab="telemetry">
            📊 ภาพรวม & สถิติ (Telemetry)
          </button>
          <button class="admin-tab-btn ${state.activeTab === 'geomap' ? 'is-active' : ''}" data-tab="geomap">
            🗺️ แผนที่พิกัดผู้ใช้งาน (Live Geo Map)
          </button>
          <button class="admin-tab-btn ${state.activeTab === 'mcp' ? 'is-active' : ''}" data-tab="mcp">
            🤖 Gemini Spark MCP Center
          </button>
          <button class="admin-tab-btn ${state.activeTab === 'archetypes' ? 'is-active' : ''}" data-tab="archetypes">
            💎 จัดการ 64 บุคลิกภาพ (Data Studio)
          </button>
          <button class="admin-tab-btn ${state.activeTab === 'backup' ? 'is-active' : ''}" data-tab="backup">
            💾 สำรองข้อมูล & ซ่อมบำรุง
          </button>
        </nav>

        <!-- Content Area -->
        <main class="admin-content-box" id="admin-tab-content">
          <!-- Rendered dynamically based on active tab -->
        </main>

      </div>
    `;

    // Bind Header Actions
    const refreshBtn = document.getElementById('admin-btn-refresh-subs');
    if (refreshBtn) {
      refreshBtn.onclick = async () => {
        refreshBtn.textContent = '⏳ กำลังดึงข้อมูล...';
        await _loadSubmissionsData();
        _renderTabContent();
        refreshBtn.textContent = '🔄 รีเฟรชข้อมูล';
      };
    }

    const previewBtn = document.getElementById('admin-btn-preview');
    if (previewBtn) previewBtn.onclick = () => { window.location.hash = 'home'; };

    const logoutBtn = document.getElementById('admin-btn-logout');
    if (logoutBtn) logoutBtn.onclick = () => {
      state.isAuthenticated = false;
      sessionStorage.removeItem('prism64_admin_token');
      _renderLockScreen();
    };

    // Bind Navigation Tabs
    container.querySelectorAll('.admin-tab-btn').forEach(btn => {
      btn.onclick = () => {
        state.activeTab = btn.dataset.tab;
        container.querySelectorAll('.admin-tab-btn').forEach(b => b.classList.remove('is-active'));
        btn.classList.add('is-active');
        _renderTabContent();
      };
    });

    _renderTabContent();
  }

  function _renderTabContent() {
    const box = document.getElementById('admin-tab-content');
    if (!box) return;

    if (state.activeTab === 'telemetry') {
      _renderTelemetryTab(box);
    } else if (state.activeTab === 'geomap') {
      _renderMapTab(box);
    } else if (state.activeTab === 'mcp') {
      _renderMcpTab(box);
    } else if (state.activeTab === 'archetypes') {
      _renderArchetypesTab(box);
    } else if (state.activeTab === 'backup') {
      _renderBackupTab(box);
    }
  }

  /* --------------------------------------------------------- Tab 1: Telemetry */
  function _renderTelemetryTab(box) {
    const shadesCount = window.PRISM_DATA?.SHADES_64 ? Object.keys(window.PRISM_DATA.SHADES_64).length : 64;
    const subsCount = state.submissions.length;
    const citiesCount = new Set(state.submissions.map(s => s.geo?.city).filter(Boolean)).size;
    const latestSub = state.submissions[0];

    box.innerHTML = `
      <div class="admin-grid-cards">
        <div class="admin-stat-card">
          <div class="admin-stat-card__label">จำนวนการทำแบบทดสอบทั้งหมด</div>
          <div class="admin-stat-card__val" style="color:#8B5CF6">${subsCount} คน</div>
          <div class="admin-stat-card__sub">บันทึกพิกัด & อุปกรณ์ลงฐานข้อมูลแล้ว</div>
        </div>

        <div class="admin-stat-card">
          <div class="admin-stat-card__label">เมือง / พิกัดที่ตรวจพบ</div>
          <div class="admin-stat-card__val" style="color:#10B981">${citiesCount} พื้นที่</div>
          <div class="admin-stat-card__sub">ทั่วประเทศ & ต่างประเทศ</div>
        </div>

        <div class="admin-stat-card">
          <div class="admin-stat-card__label">ฐานข้อมูล 64 บุคลิกภาพ</div>
          <div class="admin-stat-card__val">${shadesCount} / 64</div>
          <div class="admin-stat-card__sub">16 แม่แบบ × 4 เฉดย่อย (สมบูรณ์ 100%)</div>
        </div>

        <div class="admin-stat-card">
          <div class="admin-stat-card__label">ผู้ทำแบบทดสอบล่าสุด</div>
          <div class="admin-stat-card__val" style="color:#38BDF8;font-size:1.3rem">${latestSub ? `${latestSub.fullCode} (${latestSub.geo?.city || 'BKK'})` : 'ยังไม่มี'}</div>
          <div class="admin-stat-card__sub">${latestSub ? new Date(latestSub.timestamp).toLocaleTimeString('th-TH') : '-'}</div>
        </div>
      </div>

      <div class="admin-card-section mt-4">
        <div class="row row-between" style="align-items:center;margin-bottom:1rem">
          <h3 class="admin-section-heading" style="margin:0">📍 ผู้ทำแบบทดสอบล่าสุด (Recent Submissions Stream)</h3>
          <button class="btn btn--xs btn--primary" onclick="PRISM_ADMIN.switchToMap()">🗺️ ดูทั้งหมดบนแผนที่ Live Map</button>
        </div>

        <div class="admin-table-container">
          <table class="admin-table">
            <thead>
              <tr>
                <th>เวลา</th>
                <th>รหัสบุคลิกภาพ</th>
                <th>ตำแหน่ง / เมือง</th>
                <th>พิกัด (Lat, Lng)</th>
                <th>อุปกรณ์ / OS</th>
                <th>IP / เครือข่าย</th>
              </tr>
            </thead>
            <tbody>
              ${state.submissions.length === 0 ? `
                <tr>
                  <td colspan="6" style="text-align:center;padding:2.5rem;color:var(--text-3)">
                    <div style="font-size:1.8rem;margin-bottom:.5rem">📡</div>
                    <b>ยังไม่มีประวัติการส่งแบบทดสอบจริง</b><br>
                    <small>เมื่อมีผู้ใช้งานทำแบบทดสอบเสร็จสิ้น ระบบจะบันทึกพิกัดจริงและอุปกรณ์ลงที่นี่โดยอัตโนมัติ</small>
                  </td>
                </tr>
              ` : state.submissions.slice(0, 8).map(s => `
                <tr>
                  <td style="white-space:nowrap;font-size:.8rem;color:var(--text-3)">${new Date(s.timestamp).toLocaleString('th-TH')}</td>
                  <td><b class="mono" style="color:#A78BFA">${s.fullCode}</b> <small style="color:var(--text-2)">(${s.title || ''})</small></td>
                  <td>📍 <b>${s.geo?.city || '-'}</b>, ${s.geo?.country || '-'}</td>
                  <td><span class="mono" style="font-size:.78rem;color:#38BDF8">${s.geo?.lat?.toFixed(4) || '-'}, ${s.geo?.lng?.toFixed(4) || '-'}</span></td>
                  <td>${s.device?.os || 'Desktop'} • ${s.device?.browser || 'Browser'}</td>
                  <td><span class="mono" style="font-size:.78rem;color:var(--text-3)">${s.ip || '127.0.0.1'}</span></td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  /* --------------------------------------------------------- Tab 2: Live Geo Map */
  function _renderMapTab(box) {
    box.innerHTML = `
      <div class="admin-card-section">
        <div class="row row-between" style="margin-bottom:.8rem;flex-wrap:wrap;gap:.8rem;align-items:center">
          <div>
            <h3 class="admin-section-heading" style="margin:0">🗺️ แผนที่พิกัดผู้ทำแบบทดสอบ (Live Geo Telemetry Map)</h3>
            <p class="admin-section-desc" style="margin:0">แสดงตำแหน่งและพิกัดภูมิศาสตร์จริงแบบ Real-time ของผู้ใช้งานที่ทำแบบทดสอบ PRISM64</p>
          </div>
          <div class="row" style="gap:.5rem">
            <span class="badge" style="background:#8B5CF622;color:#C084FC;border-color:#8B5CF644">🟣 NT</span>
            <span class="badge" style="background:#10B98122;color:#10B981;border-color:#10B98144">🟢 NF</span>
            <span class="badge" style="background:#3B82F622;color:#3B82F6;border-color:#3B82F644">🔵 SJ</span>
            <span class="badge" style="background:#F59E0B22;color:#F59E0B;border-color:#F59E0B44">🟡 SP</span>
          </div>
        </div>

        <!-- Interactive Leaflet Map Container -->
        <div id="admin-live-map" class="admin-map-box"></div>

        <!-- Submissions Table with Fly-To Action -->
        <div class="mt-4">
          <h4 style="margin-bottom:.8rem;font-size:1.05rem;color:var(--text)">📍 รายชื่อผู้ใช้งาน & พิกัดระบุตำแหน่ง:</h4>
          <div class="admin-table-container">
            <table class="admin-table">
              <thead>
                <tr>
                  <th>เวลา</th>
                  <th>รหัสบุคลิกภาพ</th>
                  <th>สถานที่ (City, Country)</th>
                  <th>พิกัด (Lat / Lng)</th>
                  <th>อุปกรณ์ & เบราว์เซอร์</th>
                  <th>การกระทำ</th>
                </tr>
              </thead>
              <tbody id="admin-map-subs-tbody">
                ${state.submissions.length === 0 ? `
                  <tr>
                    <td colspan="6" style="text-align:center;padding:2.5rem;color:var(--text-3)">
                      <div style="font-size:1.8rem;margin-bottom:.5rem">📍</div>
                      <b>ยังไม่มีหมุดพิกัดจริงบนแผนที่</b><br>
                      <small>เมื่อมีผู้ใช้งานส่งแบบทดสอบ หมุดเรืองแสงจะปรากฏบนพิกัดจริงของเมืองนั้นทันที</small>
                    </td>
                  </tr>
                ` : state.submissions.map((s, idx) => `
                  <tr>
                    <td style="white-space:nowrap;font-size:.8rem;color:var(--text-3)">${new Date(s.timestamp).toLocaleString('th-TH')}</td>
                    <td><b class="mono" style="color:#A78BFA">${s.fullCode}</b></td>
                    <td>📍 <b>${s.geo?.city || 'Bangkok'}</b>, ${s.geo?.country || 'Thailand'}</td>
                    <td><span class="mono" style="font-size:.8rem;color:#38BDF8">${s.geo?.lat?.toFixed(4)}, ${s.geo?.lng?.toFixed(4)}</span></td>
                    <td>${s.device?.os || 'Desktop'} • ${s.device?.browser || 'Browser'} <small style="color:var(--text-3)">(${s.device?.screen || ''})</small></td>
                    <td>
                      <button class="btn btn--xs btn--primary admin-btn-fly-to" data-lat="${s.geo?.lat}" data-lng="${s.geo?.lng}" data-code="${s.fullCode}" data-title="${s.title || ''}" data-idx="${idx}">
                        📍 ซูมไปที่พิกัด (Fly)
                      </button>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    `;

    // Initialize Leaflet Map
    setTimeout(() => {
      _initLeafletMap();
    }, 100);

    // Bind Fly-to Buttons
    box.querySelectorAll('.admin-btn-fly-to').forEach(btn => {
      btn.onclick = () => {
        const lat = parseFloat(btn.dataset.lat);
        const lng = parseFloat(btn.dataset.lng);
        const idx = parseInt(btn.dataset.idx, 10);
        if (state.mapInstance && !isNaN(lat) && !isNaN(lng)) {
          state.mapInstance.flyTo([lat, lng], 13, { duration: 1.2 });
          if (state.markers[idx]) {
            state.markers[idx].openPopup();
          }
          const mapEl = document.getElementById('admin-live-map');
          if (mapEl) mapEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      };
    });
  }

  function _initLeafletMap() {
    const mapEl = document.getElementById('admin-live-map');
    if (!mapEl || typeof L === 'undefined') return;

    if (state.mapInstance) {
      state.mapInstance.remove();
      state.mapInstance = null;
    }

    state.markers = [];

    // Default center Thailand [13.7563, 100.5018]
    const defaultCenter = state.submissions[0]?.geo?.lat ? [state.submissions[0].geo.lat, state.submissions[0].geo.lng] : [13.7563, 100.5018];
    const map = L.map('admin-live-map', {
      center: defaultCenter,
      zoom: 6,
      zoomControl: true
    });

    state.mapInstance = map;

    // OpenStreetMap Tiles with CSS dark theme
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
      maxZoom: 19
    }).addTo(map);

    // Add Markers for all submissions
    state.submissions.forEach((s, idx) => {
      const lat = s.geo?.lat;
      const lng = s.geo?.lng;
      if (!lat || !lng) return;

      const cc = s.coreCode || s.fullCode.split('-')[0];
      const isNT = ['INTJ','INTP','ENTJ','ENTP'].includes(cc);
      const isNF = ['INFJ','INFP','ENFJ','ENFP'].includes(cc);
      const isSJ = ['ISTJ','ISFJ','ESTJ','ESFJ'].includes(cc);

      const color = isNT ? '#8B5CF6' : (isNF ? '#10B981' : (isSJ ? '#3B82F6' : '#F59E0B'));

      // Custom pulsing glowing HTML marker
      const customIcon = L.divIcon({
        className: 'custom-geo-marker',
        html: `
          <div class="geo-pulse" style="background:${color};box-shadow:0 0 12px ${color};"></div>
          <div class="geo-pin-label">${s.fullCode}</div>
        `,
        iconSize: [40, 40],
        iconAnchor: [20, 20]
      });

      const marker = L.marker([lat, lng], { icon: customIcon }).addTo(map);

      const popupContent = `
        <div class="geo-popup-card">
          <div class="geo-popup-code" style="color:${color}">${s.fullCode}</div>
          <div class="geo-popup-title">${s.title || 'บุคลิกภาพเฉพาะตัว'}</div>
          <div class="geo-popup-divider"></div>
          <div class="geo-popup-row"><span>📍 พิกัด:</span> <b>${s.geo?.city || 'Bangkok'}, ${s.geo?.country || 'Thailand'}</b></div>
          <div class="geo-popup-row"><span>🌐 ละติจูด/ลองจิจูด:</span> <span class="mono">${lat.toFixed(4)}, ${lng.toFixed(4)}</span></div>
          <div class="geo-popup-row"><span>💻 อุปกรณ์:</span> <span>${s.device?.os || 'Desktop'} (${s.device?.browser || 'Chrome'})</span></div>
          <div class="geo-popup-row"><span>🌐 IP / ISP:</span> <span>${s.ip || '127.0.0.1'} (${s.geo?.org || 'ISP'})</span></div>
          <div class="geo-popup-row"><span>🕒 เวลาที่ส่ง:</span> <span>${new Date(s.timestamp).toLocaleString('th-TH')}</span></div>
        </div>
      `;

      marker.bindPopup(popupContent);
      state.markers.push(marker);
    });

    if (state.markers.length > 0) {
      const group = new L.featureGroup(state.markers);
      map.fitBounds(group.getBounds().pad(0.2));
    }
  }

  /* --------------------------------------------------------- Tab 3: MCP Center */
  function _renderMcpTab(box) {
    const currentHost = window.location.origin;
    const mcpUrl = `${currentHost}/mcp`;

    box.innerHTML = `
      <div class="admin-card-section">
        <h3 class="admin-section-heading">⚡ คู่มือเชื่อมต่อ Google Gemini Spark Custom Apps</h3>
        <p class="admin-section-desc">
          คุณสามารถนำลิงก์ MCP Server ด้านล่างนี้ไปใส่ใน <b>Gemini (gemini.google.com) > Settings & help > Connected Apps > Custom apps for Spark</b> เพื่อให้ Gemini Spark เรียกใช้ข้อมูล 64 เฉดสีของ PRISM64 ได้แบบอัตโนมัติตลอด 24 ชม.
        </p>

        <div class="admin-mcp-copy-box">
          <div class="admin-mcp-copy-box__label">🔗 ลิงก์เชื่อมต่อ MCP Endpoint (HTTPS / Localhost URL):</div>
          <div class="admin-mcp-input-group">
            <input type="text" id="admin-mcp-url-input" class="admin-input-mono" value="${mcpUrl}" readonly />
            <button id="admin-btn-copy-mcp" class="btn btn--primary">📋 คัดลอกลิงก์ (Copy URL)</button>
          </div>
          <small style="color:var(--text-3);margin-top:.4rem;display:block">
            💡 สำหรับการเชื่อมต่อจากภายนอกบน Gemini Cloud ให้ใช้ HTTPS Tunnel URL เช่น <code>https://your-domain.com/mcp</code> หรือผ่าน Ngrok / Cloudflare Tunnel
          </small>
        </div>

        <h4 style="margin:1.8rem 0 .8rem 0;color:var(--text);font-size:1.05rem">🛠️ 5 เครื่องมือ AI ที่เปิดให้บริการใน MCP Server:</h4>
        <div class="admin-mcp-tools-list">
          <div class="admin-tool-item">
            <div class="admin-tool-item__head">
              <code>get_64_personality_profile(typeCode, lang)</code>
              <span class="badge" style="background:#10B98122;color:#10B981;border-color:#10B98144">Ready</span>
            </div>
            <p>ดึงข้อมูลเจาะลึกของบุคลิกภาพทั้ง 64 แบบ เช่น <code>INTP-OH</code>, <code>INTJ-AC</code> (จุดแข็ง, สโลแกน, อาชีพ, ข้อควรระวัง)</p>
          </div>
          <div class="admin-tool-item">
            <div class="admin-tool-item__head">
              <code>search_personality_types(query, spectrum, variant, lang)</code>
              <span class="badge" style="background:#10B98122;color:#10B981;border-color:#10B98144">Ready</span>
            </div>
            <p>ค้นหาและกรองประเภทบุคลิกภาพตามคำค้นหา, สเปกตรัม, หรือตัวแปรย่อย</p>
          </div>
          <div class="admin-tool-item">
            <div class="admin-tool-item__head">
              <code>calculate_hexaco_prism_scores(energy, input, deciding, structure, identity, relating)</code>
              <span class="badge" style="background:#10B98122;color:#10B981;border-color:#10B98144">Ready</span>
            </div>
            <p>คำนวณคะแนน 6 มิติ และสรุปผลรหัสบุคลิกภาพ 6 ตัวอักษรพร้อมบทวิเคราะห์</p>
          </div>
          <div class="admin-tool-item">
            <div class="admin-tool-item__head">
              <code>analyze_compatibility(type1, type2, lang)</code>
              <span class="badge" style="background:#10B98122;color:#10B981;border-color:#10B98144">Ready</span>
            </div>
            <p>วิเคราะห์ความเข้ากันได้ ความสัมพันธ์ และไดนามิกส์การทำงานร่วมกันระหว่าง 2 บุคลิกภาพ</p>
          </div>
          <div class="admin-tool-item">
            <div class="admin-tool-item__head">
              <code>list_all_64_archetypes(lang)</code>
              <span class="badge" style="background:#10B98122;color:#10B981;border-color:#10B98144">Ready</span>
            </div>
            <p>ดึงสารบบแค็ตตาล็อกครบทั้ง 64 เฉดสีเพื่อนำไปใช้ในการวิเคราะห์ข้อมูลเชิงภาพรวม</p>
          </div>
        </div>

        <div class="admin-mcp-tester mt-4">
          <h4 style="color:var(--text);font-size:1.05rem;margin-bottom:.6rem">🧪 ทดสอบยิงคำสั่ง MCP (Interactive JSON-RPC Tester)</h4>
          <div class="row" style="gap:.6rem;margin-bottom:.8rem">
            <select id="mcp-test-tool-select" class="admin-select">
              <option value="get_64_personality_profile">get_64_personality_profile (ทดสอบ INTP-OH)</option>
              <option value="search_personality_types">search_personality_types (ค้นหา 'นวัตกรรม')</option>
              <option value="analyze_compatibility">analyze_compatibility (INTP-OH + ENTJ-AH)</option>
              <option value="list_all_64_archetypes">list_all_64_archetypes (ดึงทั้ง 64 แบบ)</option>
            </select>
            <button id="admin-btn-run-mcp-test" class="btn btn--primary">🚀 รันคำสั่งทดสอบ (Execute)</button>
          </div>
          <pre id="mcp-test-response-box" class="admin-console-box">// ผลลัพธ์ JSON-RPC 2.0 Response จะแสดงที่นี่หลังกดรันคำสั่ง...</pre>
        </div>

      </div>
    `;

    const copyBtn = document.getElementById('admin-btn-copy-mcp');
    const input = document.getElementById('admin-mcp-url-input');
    if (copyBtn && input) {
      copyBtn.onclick = () => {
        input.select();
        navigator.clipboard.writeText(input.value);
        copyBtn.textContent = '✅ คัดลอกสำเร็จแล้ว!';
        setTimeout(() => { copyBtn.textContent = '📋 คัดลอกลิงก์ (Copy URL)'; }, 2000);
      };
    }

    const runTestBtn = document.getElementById('admin-btn-run-mcp-test');
    const selectEl = document.getElementById('mcp-test-tool-select');
    const resBox = document.getElementById('mcp-test-response-box');

    if (runTestBtn && selectEl && resBox) {
      runTestBtn.onclick = async () => {
        const toolName = selectEl.value;
        let args = {};
        if (toolName === 'get_64_personality_profile') args = { typeCode: 'INTP-OH', lang: 'th' };
        else if (toolName === 'search_personality_types') args = { query: 'นวัตกรรม', lang: 'th' };
        else if (toolName === 'analyze_compatibility') args = { type1: 'INTP-OH', type2: 'ENTJ-AH', lang: 'th' };
        else if (toolName === 'list_all_64_archetypes') args = { lang: 'th' };

        const payload = {
          jsonrpc: "2.0",
          id: Date.now(),
          method: "tools/call",
          params: { name: toolName, arguments: args }
        };

        resBox.textContent = "กำลังส่ง Request ไปยัง /mcp endpoint...";

        try {
          const res = await fetch('/mcp', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          });
          const json = await res.json();
          resBox.textContent = JSON.stringify(json, null, 2);
        } catch (e) {
          resBox.textContent = `Error connecting to MCP server: ${e.message}`;
        }
      };
    }
  }

  /* --------------------------------------------------------- Tab 4: Archetypes Data Studio */
  function _renderArchetypesTab(box) {
    const shades = window.PRISM_DATA?.SHADES_64 || {};
    const coreTypes = window.PRISM_DATA?.CORE_TYPES || {};
    const keys = Object.keys(shades);

    box.innerHTML = `
      <div class="admin-card-section">
        <div class="row row-between" style="margin-bottom:1rem;flex-wrap:wrap;gap:.8rem">
          <div>
            <h3 class="admin-section-heading" style="margin:0">💎 สตูดิโอข้อมูล 64 บุคลิกภาพ (Archetypes Catalog)</h3>
            <p class="admin-section-desc" style="margin:0">สามารถตรวจสอบและดูรายละเอียดเชิงลึกของทุกเฉดสีได้ที่นี่</p>
          </div>
          <div class="admin-search-wrapper">
            <input type="text" id="admin-archetypes-search" class="admin-search-input" placeholder="🔍 ค้นหารหัส หรือชื่อบุคลิกภาพ..." />
          </div>
        </div>

        <div class="admin-table-container">
          <table class="admin-table">
            <thead>
              <tr>
                <th>รหัส 6 ตัว</th>
                <th>ชื่อเฉดสีเฉพาะ (Subtype Title)</th>
                <th>แม่แบบหลัก</th>
                <th>สโลแกนประจำตัว</th>
                <th>สเปกตรัม</th>
                <th>การจัดการ</th>
              </tr>
            </thead>
            <tbody id="admin-archetypes-tbody">
              <!-- Rendered rows -->
            </tbody>
          </table>
        </div>
      </div>
    `;

    const searchInput = document.getElementById('admin-archetypes-search');
    if (searchInput) {
      searchInput.oninput = () => {
        _renderArchetypeRows(searchInput.value.trim().toLowerCase());
      };
    }

    _renderArchetypeRows('');
  }

  function _renderArchetypeRows(query) {
    const tbody = document.getElementById('admin-archetypes-tbody');
    if (!tbody) return;

    const shades = window.PRISM_DATA?.SHADES_64 || {};
    const coreTypes = window.PRISM_DATA?.CORE_TYPES || {};
    const keys = Object.keys(shades);

    const filtered = keys.filter(k => {
      if (!query) return true;
      const s = shades[k];
      const cc = k.split('-')[0];
      const ct = coreTypes[cc] || {};
      const blob = `${k} ${s.title?.th || ''} ${s.title?.en || ''} ${ct.name?.th || ''} ${s.tagline?.th || ''}`.toLowerCase();
      return blob.includes(query);
    });

    if (filtered.length === 0) {
      tbody.innerHTML = `<tr><td colspan="6" style="text-align:center;padding:2rem;color:var(--text-3)">ไม่พบบุคลิกภาพที่ค้นหา</td></tr>`;
      return;
    }

    tbody.innerHTML = filtered.map(k => {
      const s = shades[k];
      const cc = k.split('-')[0];
      const ct = coreTypes[cc] || {};
      const spec = ct.spectrum || 'violet';
      const specColor = spec === 'violet' ? '#8B5CF6' : (spec === 'green' ? '#10B981' : (spec === 'blue' ? '#3B82F6' : '#F59E0B'));

      return `
        <tr>
          <td><b class="mono" style="color:${specColor}">${k}</b></td>
          <td><b>${s.title?.th || '-'}</b> <small style="color:var(--text-3)">(${s.title?.en || ''})</small></td>
          <td>${ct.name?.th || cc}</td>
          <td style="max-width:280px;font-size:.82rem;color:var(--text-2)">“${s.tagline?.th || '-'}”</td>
          <td><span class="badge" style="border-color:${specColor};color:${specColor}">${spec.toUpperCase()}</span></td>
          <td>
            <button class="btn btn--xs btn--ghost admin-btn-view-card" data-code="${k}">👁️ ดูการ์ด</button>
          </td>
        </tr>
      `;
    }).join('');

    tbody.querySelectorAll('.admin-btn-view-card').forEach(btn => {
      btn.onclick = () => {
        const code = btn.dataset.code;
        if (code && window.PRISM && window.PRISM.openModal) {
          window.PRISM.openModal(code);
        }
      };
    });
  }

  /* --------------------------------------------------------- Tab 5: Backup & Maintenance */
  function _renderBackupTab(box) {
    box.innerHTML = `
      <div class="admin-card-section">
        <h3 class="admin-section-heading">💾 จัดการสำรองข้อมูล & ตรวจสอบระบบ (Backup & Tools)</h3>
        <p class="admin-section-desc">ดาวน์โหลดชุดข้อมูล 64 บุคลิกภาพ และประวัติการทำแบบทดสอบพร้อมพิกัดทั้งหมด</p>

        <div class="admin-backup-actions-grid">
          <div class="admin-backup-card">
            <h4>📦 ดาวน์โหลดฐานข้อมูล JSON ทั้งหมด</h4>
            <p>ส่งออกข้อมูล 64 เฉดสี + 16 แม่แบบหลัก</p>
            <button id="admin-btn-export-json" class="btn btn--primary mt-2">📥 Export 64 Types Database</button>
          </div>

          <div class="admin-backup-card">
            <h4>🗺️ ส่งออกประวัติพิกัดผู้ใช้งาน (Submissions Telemetry)</h4>
            <p>ดาวน์โหลดไฟล์ JSON บันทึกผู้ทำแบบทดสอบทั้งหมด (${state.submissions.length} รายการ)</p>
            <button id="admin-btn-export-subs" class="btn btn--primary mt-2" style="background:#0D9488">📥 Export Submissions JSON</button>
          </div>

          <div class="admin-backup-card">
            <h4>🗑️ ล้างฐานข้อมูลการทำแบบทดสอบบนเซิร์ฟเวอร์</h4>
            <p>ล้างประวัติการส่งแบบทดสอบทั้งหมดใน <code>data/submissions.json</code></p>
            <button id="admin-btn-clear-subs" class="btn btn--danger mt-2">🗑️ ล้าง Submissions ทั้งหมด</button>
          </div>
        </div>
      </div>
    `;

    const exportBtn = document.getElementById('admin-btn-export-json');
    if (exportBtn) {
      exportBtn.onclick = () => {
        const data = window.PRISM_DATA || {};
        const str = JSON.stringify(data, null, 2);
        const blob = new Blob([str], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `PRISM64_Database_Backup_${new Date().toISOString().slice(0, 10)}.json`;
        a.click();
        URL.revokeObjectURL(url);
      };
    }

    const exportSubsBtn = document.getElementById('admin-btn-export-subs');
    if (exportSubsBtn) {
      exportSubsBtn.onclick = () => {
        const str = JSON.stringify(state.submissions, null, 2);
        const blob = new Blob([str], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `PRISM64_Submissions_GeoTelemetry_${new Date().toISOString().slice(0, 10)}.json`;
        a.click();
        URL.revokeObjectURL(url);
      };
    }

    const clearSubsBtn = document.getElementById('admin-btn-clear-subs');
    if (clearSubsBtn) {
      clearSubsBtn.onclick = async () => {
        if (confirm('คุณต้องการล้างประวัติผู้ทำแบบทดสอบทั้งหมดบนเซิร์ฟเวอร์ใช่ไหม?')) {
          await fetch('/api/admin/submissions/clear', { method: 'POST' });
          await _loadSubmissionsData();
          alert('ล้างประวัติข้อมูลเรียบร้อยแล้ว!');
          _renderBackupTab(document.getElementById('admin-tab-content'));
        }
      };
    }
  }

  function switchToMap() {
    state.activeTab = 'geomap';
    const container = document.getElementById('view-admin');
    if (container) {
      container.querySelectorAll('.admin-tab-btn').forEach(b => {
        b.classList.toggle('is-active', b.dataset.tab === 'geomap');
      });
    }
    _renderTabContent();
  }

  return {
    init,
    openPortal: _openPortal,
    closePortal: _closePortal,
    switchToMap
  };
})();

document.addEventListener('DOMContentLoaded', () => {
  PRISM_ADMIN.init();
});
