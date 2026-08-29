/* ==========================================================================
   PRISM64 — i18n Translation & Assessment System (วัยรุ่น เข้าใจง่าย กระชับ ตรงประเด็น)
   --------------------------------------------------------------------------
   Handles Thai/English switching with localStorage persistence.
   Provides assessment questionnaire data and complete UI translations.
   ========================================================================== */

const I18N = (() => {
  /* --------------------------------------------------------------- strings */
  const STRINGS = {
    /* site chrome */
    'nav.types':      { th: '64 ประเภท',       en: '64 Types' },
    'nav.dimensions': { th: '6 มิติ',           en: '6 Dimensions' },
    'nav.about':      { th: 'เกี่ยวกับ',         en: 'About' },
    'nav.faq':        { th: 'คำถามที่พบบ่อย',    en: 'FAQ' },
    'nav.test':       { th: 'ทำแบบทดสอบ (3 นาที)', en: 'Take Test' },

    /* hero */
    'hero.kicker':    { th: 'PRISM64 — สรุปตัวตนใน 64 เฉดสี', en: 'PRISM64 — One light. Sixty-four shades.' },
    'hero.kicker_badge': { th: 'ฟรี 100%',        en: 'FREE' },
    'hero.title_1':   { th: 'ค้นพบ',             en: 'Discover' },
    'hero.title_2':   { th: '64 เฉดสี',          en: 'the 64 shades' },
    'hero.title_3':   { th: 'ในตัวคุณแบบเจาะลึก', en: 'of your personality' },
    'hero.sub':       { th: 'บุคลิกภาพลึกกว่าแค่ 4 ตัวอักษร — สรุปให้จบใน 3 นาที ไม่มีน้ำ ไม่อ้อมค้อม รู้จักจุดแข็ง ข้อควรระวัง และคนที่เข้ากับคุณได้ทันที',
                        en: 'The most granular personality system — 6 dimensions, 4 spectra, 64 types. Deeper insight into who you are and how you relate.' },
    'hero.cta_test':  { th: 'ทำแบบทดสอบฟรี (3 นาที)', en: 'Take Free Assessment' },
    'hero.cta_start': { th: 'ดู 64 ประเภท',       en: 'Explore 64 Types' },
    'hero.cta_learn': { th: 'วิธีดู 6 มิติ',       en: 'Learn More' },
    'hero.note':      { th: 'ไม่ต้องล็อกอิน — ตอบ 18 ข้อแล้วรู้ผลทันที',
                        en: 'No sign-up required — instant assessment and results.' },

    /* stats */
    'stats.types':    { th: 'ประเภทบุคลิกภาพ',   en: 'Personality Types' },
    'stats.dims':     { th: 'มิติเจาะลึก',        en: 'Dimensions' },
    'stats.spectra':  { th: 'สเปกตรัมหลัก',      en: 'Spectra' },
    'stats.insights': { th: 'ละเอียด ตรงปก',     en: 'Actionable Insights' },

    /* dimensions section */
    'dims.heading':   { th: '6 มิติแห่งตัวตน (เข้าใจง่ายใน 1 บรรทัด)',
                        en: 'The Six Dimensions' },
    'dims.sub':       { th: 'เพราะคนเราไม่ได้มีแค่ 4 ด้าน — PRISM64 เพิ่มมิติความมั่นใจ (A/O) และสไตล์การเข้าสังคม (H/C) เพื่อให้เห็นภาพคุณชัดที่สุด',
                        en: 'Your personality is more than four letters — PRISM64 adds emotional stability and relational style for the full picture.' },

    /* spectra section */
    'spectra.heading': { th: '4 สเปกตรัมหลักของชาว PRISM64',
                         en: 'The Four Spectra' },
    'spectra.sub':    { th: 'แต่ละกลุ่มมีสไตล์และพลังงานเฉพาะตัว คุณอยู่แก๊งไหนมาเช็กกันเลย',
                        en: 'Every personality type belongs to one of four spectra. Each has its own identity, purpose, and way of seeing the world.' },

    /* types section */
    'types.heading':  { th: 'สำรวจครบ 64 ประเภท',
                        en: 'Explore All 64 Types' },
    'types.sub':      { th: '16 ไทป์หลัก × 4 สไตล์ย่อย = 64 เฉดสี คลิกการ์ดเพื่ออ่านข้อมูลเจาะลึกได้เลย',
                        en: '16 core types × 4 variant layers = 64 shades of self. Click any card for the full profile.' },
    'types.filter_all': { th: 'ทั้งหมด',          en: 'All' },
    'types.search_placeholder': { th: 'พิมพ์ค้นหา... (เช่น INTJ, ENFP, หมวดหมู่)',
                                  en: 'Search types... (INTJ, ENFP, etc.)' },
    'types.showing':  { th: 'แสดง',               en: 'Showing' },
    'types.of':       { th: 'จาก',                en: 'of' },

    /* type detail modal */
    'modal.close':    { th: 'ปิด',                en: 'Close' },
    'modal.overview': { th: 'ภาพรวมตัวตน',        en: 'Overview' },
    'modal.strengths': { th: 'จุดเด่น',           en: 'Strengths' },
    'modal.growth':   { th: 'จุดระวัง',           en: 'Growth' },
    'modal.careers':  { th: 'งานที่เหมาะ',        en: 'Careers' },
    'modal.work':     { th: 'การทำงาน',           en: 'Work' },
    'modal.love':     { th: 'ความรัก',            en: 'Love' },
    'modal.stress':   { th: 'ความเครียด',         en: 'Stress' },
    'modal.motto':    { th: 'คติประจำใจ',          en: 'Motto' },
    'modal.matches':  { th: 'ไทป์ที่เข้ากันได้ดี', en: 'Compatible Types' },
    'modal.variant':  { th: 'สไตล์ย่อย',           en: 'Variant' },
    'modal.identity': { th: 'ความมั่นคงทางใจ',     en: 'Identity' },
    'modal.relating': { th: 'การเข้าสังคม',       en: 'Relating' },
    'modal.watch':    { th: 'ข้อควรระวัง',         en: 'Watch Out For' },
    'modal.population': { th: 'สัดส่วนประชากร',    en: 'Population Share' },

    /* FAQ */
    'faq.heading':    { th: 'คำถามที่พบบ่อย (FAQ)',
                        en: 'Frequently Asked Questions' },
    'faq.sub':        { th: 'ตอบทุกข้อสงสัยเกี่ยวกับ PRISM64 แบบสั้น กระชับ เข้าใจง่าย',
                        en: 'Everything you want to know about PRISM64.' },
    'faq.q1':         { th: 'PRISM64 คืออะไร?',
                        en: 'What is PRISM64?' },
    'faq.a1':         { th: 'แบบทดสอบบุคลิกภาพ 64 แบบ ที่ละเอียดและตรงจุดกว่าเดิม! เพิ่ม 2 มิติใหม่ (ความมั่นใจ vs คิดมาก และ เซฟใจทุกคน vs รักความสงบ) ให้คุณรู้จักตัวเองแบบลึกซึ้งใน 3 นาที',
                        en: 'PRISM64 is a 64-type personality system that extends the classic 16-type model by adding 2 new dimensions — Identity (emotional stability) and Relating (communal vs. autonomous style) — for a more granular and accurate picture of who you are.' },
    'faq.q2':         { th: 'ต่างจาก MBTI 16 แบบทั่วไปยังไง?',
                        en: 'How is it different from MBTI / 16 types?' },
    'faq.a2':         { th: 'MBTI ทั่วไปมีแค่ 16 แบบ แต่ PRISM64 เพิ่ม 2 มิติสำคัญที่มักตกหล่น: ความมั่นคงทางใจ (A/O) และ สไตล์การเข้าสังคม (H/C) ทำให้ได้ 64 เฉดสีที่ตรงปก ตรงจุด และไม่เหมารวม',
                        en: 'The classic model has 4 dimensions (EI/SN/TF/JP) yielding 16 types. PRISM64 adds a 5th dimension (Identity: Assertive vs Oscillating) and a 6th (Relating: Harmony vs Calm) for 64 more nuanced types.' },
    'faq.q3':         { th: 'รหัส 4 ตัว + 2 ตัวต่อท้าย ดูยังไง?',
                        en: 'What do the 4 letters + 2 suffix letters mean?' },
    'faq.a3':         { th: '4 ตัวแรกคือสไตล์หลัก (เช่น INTJ, ENFP) ส่วน 2 ตัวหลังคือรหัสเสริม: A (มูฟออนไว) vs O (คิดมาก/ละเอียด) และ H (เซฟใจทุกคน) vs C (มีสเปซส่วนตัว) เช่น INTJ-AH คือ INTJ ที่มั่นใจและเข้ากับคนง่าย',
                        en: 'The first 4 letters are your core type (e.g., INTJ, ENFP). The 2 suffix letters are your variant: A = Assertive, O = Oscillating, H = Harmony, C = Calm. E.g., INTJ-AH means an Assertive, Harmony INTJ.' },
    'faq.q4':         { th: 'ต้องเสียเงินหรือลงทะเบียนไหม?',
                        en: 'Is it completely free?' },
    'faq.a4':         { th: 'ฟรี 100%! ไม่ต้องล็อกอิน ไม่เก็บข้อมูลส่วนตัว ทำเสร็จดูผลลัพธ์พร้อมแชร์ให้เพื่อนได้ทันที',
                        en: '100% Free! No sign-up, no personal data collection. Instant results with shareable link.' },
    'faq.q5':         { th: 'ใช้เวลาทำนานไหม?',
                        en: 'How long does the test take?' },
    'faq.a5':         { th: 'แค่ 18 ข้อ ใช้เวลาเพียง 2-3 นาที ตอบตามฟีลจริง ข้อไหนใช่ก็กดเลย ไม่ต้องคิดเยอะ!',
                        en: 'Only 18 questions, takes 2-3 minutes. Just answer honestly based on your gut feeling!' },

    /* CTA */
    'cta.heading':    { th: 'พร้อมค้นพบตัวตนใน 64 เฉดสีหรือยัง?',
                        en: 'Ready to discover yourself in 64 shades?' },
    'cta.sub':        { th: 'เริ่มทำแบบทดสอบเลยตอนนี้ — ฟรี ไม่ต้องสมัคร ใช้เวลาแค่ 3 นาที',
                        en: 'Start your personality assessment now — free, no sign-up needed, takes only 3 minutes.' },
    'cta.btn':        { th: 'เริ่มทำแบบทดสอบฟรีเลย →', en: 'Start Free Assessment →' },

    /* footer */
    'footer.desc':    { th: 'PRISM64 ระบบสำรวจบุคลิกภาพ 64 เฉดสี เข้าใจตัวเอง เข้าใจคนรอบข้าง สรุปกระชับ ตรงจุด',
                        en: 'PRISM64 is a 64-type personality system designed to help you understand yourself and others more deeply. One light. Sixty-four shades.' },
    'footer.explore': { th: 'สำรวจ',              en: 'Explore' },
    'footer.types':   { th: 'ครบทั้ง 64 แบบ',      en: 'All Types (64)' },
    'footer.dims':    { th: '6 มิติหลัก',          en: '6 Dimensions' },
    'footer.spectra': { th: '4 สเปกตรัม',          en: '4 Spectra' },
    'footer.test':    { th: 'ทำแบบทดสอบ',          en: 'Personality Test' },
    'footer.resources': { th: 'เมนูเพิ่มเติม',     en: 'Resources' },
    'footer.about':   { th: 'เกี่ยวกับ PRISM64',   en: 'About PRISM64' },
    'footer.research': { th: 'งานวิจัยอ้างอิง',    en: 'Research' },
    'footer.blog':    { th: 'บทความน่าสนใจ',       en: 'Blog' },
    'footer.legal':   { th: 'ข้อตกลง',             en: 'Legal' },
    'footer.privacy': { th: 'นโยบายความเป็นส่วนตัว', en: 'Privacy Policy' },
    'footer.terms':   { th: 'เงื่อนไขการใช้งาน',    en: 'Terms of Use' },
    'footer.disclaimer_title': { th: 'ข้อจำกัดความรับผิดชอบ', en: 'Disclaimer' },
    'footer.disclaimer_text': { th: 'PRISM64 เป็นเครื่องมือสำหรับการสำรวจและเข้าใจตนเอง ไม่ใช่การวินิจฉัยทางการแพทย์หรือจิตวิทยา ข้อมูลทั้งหมดจัดทำขึ้นเพื่อการเรียนรู้และการพัฒนาตนเอง',
                                 en: 'PRISM64 is a tool for self-exploration, not a psychological diagnostic. All content is for educational and entertainment purposes only.' },
    'footer.copyright': { th: '© 2026 PRISM64 — สรุปตัวตนใน 64 เฉดสี',
                          en: '© 2026 PRISM64 — All rights reserved.' },

    /* theme */
    'theme.light':    { th: 'โหมดสว่าง ☀️',       en: 'Light Mode' },
    'theme.dark':     { th: 'โหมดมืด 🌙',          en: 'Dark Mode' },
    'lang.th':        { th: 'ไทย',                en: 'TH' },
    'lang.en':        { th: 'EN',                 en: 'EN' },

    /* misc */
    'misc.loading':   { th: 'กำลังโหลด...',       en: 'Loading...' },
    'misc.no_results': { th: 'ไม่พบประเภทที่ค้นหา ลองพิมพ์ใหม่ดูนะ', en: 'No types match your search.' },

    /* Likert scale options (วัยรุ่น เข้าใจง่าย ไม่กำกวม) */
    'likert.sd':      { th: 'ไม่ใช่เลย',           en: 'Strongly Disagree' },
    'likert.d':       { th: 'ไม่ค่อยใช่',          en: 'Disagree' },
    'likert.sld':     { th: 'แอบไม่ค่อยตรง',       en: 'Slightly Disagree' },
    'likert.n':       { th: 'กลางๆ / แล้วแต่วัน',   en: 'Neutral' },
    'likert.sla':     { th: 'แอบตรงอยู่',          en: 'Slightly Agree' },
    'likert.a':       { th: 'ใช่เลย / ตรงอยู่',    en: 'Agree' },
    'likert.sa':      { th: 'โคตรตรง! / ใช่สุดๆ',  en: 'Strongly Agree' },

    /* Test Flow */
    'test.title':     { th: 'แบบทดสอบบุคลิกภาพ PRISM64 (36 ข้อ)', en: 'PRISM64 Personality Assessment (36 Questions)' },
    'test.sub':       { th: 'ตอบตามฟีลจริงของคุณเลย ไม่ต้องคิดเยอะ เพื่อผลลัพธ์ที่ตรงปกที่สุด!',
                        en: 'Answer honestly based on your true inclinations to reveal your exact shade.' },
    'test.progress':  { th: 'ความคืบหน้า',         en: 'Progress' },
    'test.q_num':     { th: 'ข้อที่',              en: 'Question' },
    'test.of':        { th: 'จาก',                en: 'of' },
    'test.prev':      { th: '← ย้อนกลับ',          en: 'Previous' },
    'test.next':      { th: 'ข้อถัดไป →',          en: 'Next' },
    'test.finish':    { th: 'ประมวลผลตัวตนของคุณ →', en: 'Calculate My Shade →' },
    'test.calculating': { th: 'กำลังวิเคราะห์ 6 มิติในตัวคุณ...',
                          en: 'Analyzing your 6-dimensional profile...' },
    'test.calculating_sub': { th: 'แมตช์เฉดสีที่ตรงกับคุณที่สุดจาก 64 แบบ',
                              en: 'Synthesizing results across 64 archetypes' },
    'test.hint':      { th: 'เลือกข้อที่ตรงกับตัวคุณมากที่สุดตอนนี้', en: 'Select the option that feels most natural to you' },
    'test.resume_title': { th: '⚡ กู้คืนความคืบหน้าที่ทำค้างไว้ให้คุณแล้ว', en: '⚡ Restored your previous in-progress test' },
    'test.resume_desc': { th: 'ตอบไปแล้ว {count} จาก {total} ข้อ (อยู่ที่ข้อ {current})', en: '{count} of {total} answered (at question {current})' },
    'test.reset_btn': { th: '🔄 เริ่มทำใหม่ตั้งแต่ต้น', en: '🔄 Reset & Start Over' },
    'test.reset_confirm': { th: 'ต้องการล้างคำตอบที่ตอบไว้ทั้งหมดแล้วเริ่มทำใหม่ใช่ไหม?', en: 'Are you sure you want to clear your answers and start over?' },
    'test.leave_prompt': { th: 'คุณกำลังทำแบบทดสอบอยู่ ข้อมูลความคืบหน้าจะถูกบันทึกไว้ในเบราว์เซอร์อัตโนมัติ', en: 'You are currently taking the assessment. Your progress is saved automatically.' },

    /* Result Page */
    'result.eyebrow':   { th: 'ผลลัพธ์ตัวตนของคุณ',    en: 'Your Assessment Result' },
    'result.heading':   { th: 'เฉดสีบุคลิกภาพของคุณคือ', en: 'Your Personality Archetype is' },
    'result.radar_title': { th: 'เรดาร์ 6 มิติ (Radar Chart)', en: '6-Dimensional Radar' },
    'result.radar_sub': { th: 'กราฟสรุปความสมดุลและความโดดเด่นใน 6 ด้านของคุณ',
                          en: 'Visual balance and orientation across all 6 traits.' },
    'result.dbars_title': { th: 'สัดส่วนแต่ละมิติ (Dimension Breakdown)', en: 'Dimension Breakdown' },
    'result.share':     { th: 'แชร์ผลลัพธ์ให้เพื่อน',   en: 'Share Result' },
    'result.copy_link': { th: 'คัดลอกลิงก์ผลลัพธ์',    en: 'Copy Link' },
    'result.copied':    { th: 'คัดลอกลิงก์เรียบร้อยแล้ว!', en: 'Link copied to clipboard!' },
    'result.retake':    { th: 'ทำแบบทดสอบใหม่อีกรอบ',  en: 'Retake Assessment' },
    'result.explore_all': { th: 'ดูครบทั้ง 64 แบบ',    en: 'Explore All 64 Types' },
    'result.details_title': { th: 'เจาะลึกตัวตนของคุณแบบละเอียดยิบ', en: 'In-Depth Personality Insights' },
  };

  /* ---------------------------------------------------- assessment questions (36 ข้อ ภาษาวัยรุ่น กระชับ เข้าใจง่าย ตรงประเด็น) */
  const QUESTIONS = [
    /* ========================================================
       1. ENERGY: Extraversion (E) vs Introversion (I) - 6 ข้อ
       ======================================================== */
    {
      id: 1,
      dimension: 'energy',
      pole: 'E',
      weight: 1,
      text: {
        th: 'เวลาไปงานปาร์ตี้หรืออยู่ท่ามกลางคนเยอะๆ คุณจะยิ่งรู้สึกสดชื่นและมีพลัง',
        en: 'In social gatherings, you feel energized and lively by interacting with a large group.'
      }
    },
    {
      id: 2,
      dimension: 'energy',
      pole: 'E',
      weight: 1,
      text: {
        th: 'หลังวันที่เหน็ดเหนื่อย การได้ออกไปเจอเพื่อนเม้าท์มอยคือการชาร์จพลังที่ดีที่สุด',
        en: 'Spending time socializing with friends is your favorite way to recharge after a busy day.'
      }
    },
    {
      id: 3,
      dimension: 'energy',
      pole: 'I',
      weight: -1,
      text: {
        th: 'เวลาเจองานยากหรือมีเรื่องต้องโฟกัส คุณชอบนั่งลุยคนเดียวเงียบๆ มากกว่าทำเป็นกลุ่ม',
        en: 'When facing a difficult task, you prefer working through it independently in quiet focus.'
      }
    },
    {
      id: 4,
      dimension: 'energy',
      pole: 'I',
      weight: -1,
      text: {
        th: 'วันหยุดชอบนอนเล่น ดูหนัง หรือทำอะไรเงียบๆ คนเดียวอยู่ห้อง มากกว่าออกไปข้างนอก',
        en: 'In your free time, you naturally prefer quiet, relaxing activities at home.'
      }
    },
    {
      id: 5,
      dimension: 'energy',
      pole: 'E',
      weight: 1,
      text: {
        th: 'คุยเล่นทักทายคนเก่ง ชวนคุยได้ชิลๆ ไม่เคยรู้สึกอึดอัดเวลาต้องเปิดบทสนทนา',
        en: 'You find small talk enjoyable and can break the ice effortlessly with anyone.'
      }
    },
    {
      id: 6,
      dimension: 'energy',
      pole: 'I',
      weight: -1,
      text: {
        th: 'เวลารวมกลุ่มเพื่อน คุณมักเป็นฝ่ายนั่งฟัง ยิ้มๆ และสังเกตบรรยากาศ มากกว่าเป็นคนพูดเยอะ',
        en: 'At gatherings, you tend to be quiet, reserved, and observe rather than dominate the conversation.'
      }
    },

    /* ========================================================
       2. INPUT: Sensing (S) vs Intuition (N) - 6 ข้อ
       ======================================================== */
    {
      id: 7,
      dimension: 'input',
      pole: 'S',
      weight: 1,
      text: {
        th: 'เวลาแก้ปัญหา คุณยึดความจริง ข้อมูลที่จับต้องได้ และสิ่งที่เกิดขึ้นจริงเป็นหลัก',
        en: 'When solving problems, you rely on concrete facts, verifiable data, and reality.'
      }
    },
    {
      id: 8,
      dimension: 'input',
      pole: 'S',
      weight: 1,
      text: {
        th: 'ชอบลงมือทำจริง เรียนรู้จากของจริง มากกว่านั่งอ่านทฤษฎีหรือคอนเซ็ปต์ลอยๆ',
        en: 'You prefer practical hands-on experience over exploring abstract theories.'
      }
    },
    {
      id: 9,
      dimension: 'input',
      pole: 'N',
      weight: -1,
      text: {
        th: 'เวลาคุยกัน คุณจะอินกับเรื่องภาพใหญ่ ไอเดียใหม่ๆ และความเป็นไปได้ในอนาคต',
        en: 'In conversations, you are drawn to future possibilities, overarching visions, and patterns.'
      }
    },
    {
      id: 10,
      dimension: 'input',
      pole: 'S',
      weight: 1,
      text: {
        th: 'ตัดสินใจโดยมองความเป็นไปได้จริงและผลลัพธ์ที่ทำได้ทันทีเป็นอันดับแรก',
        en: 'You make decisions based on practical feasibility and real-world implications.'
      }
    },
    {
      id: 11,
      dimension: 'input',
      pole: 'S',
      weight: 1,
      text: {
        th: 'เวลาทำงาน คุณโฟกัสงานเฉพาะหน้าที่ต้องทำทีละสเต็ปได้ดีกว่ามองวิสัยทัศน์กว้างๆ',
        en: 'When working on projects, you focus on specific tasks at hand rather than broad vision.'
      }
    },
    {
      id: 12,
      dimension: 'input',
      pole: 'N',
      weight: -1,
      text: {
        th: 'ชอบแชร์ไอเดียแหวกแนว คิดนอกกรอบ และตั้งสมมติฐานใหม่ๆ ในวงสนทนา',
        en: 'In discussions, you love contributing imaginative theories and exploring unconventional ideas.'
      }
    },

    /* ========================================================
       3. DECIDING: Thinking (T) vs Feeling (F) - 6 ข้อ
       ======================================================== */
    {
      id: 13,
      dimension: 'deciding',
      pole: 'T',
      weight: 1,
      text: {
        th: 'เวลาตัดสินใจเรื่องสำคัญ คุณเอาเหตุผลและความถูกต้องเป็นที่ตั้ง แม้จะขัดใจใครก็ตาม',
        en: 'When making choices, you prioritize objective truth and fairness over personal relationships.'
      }
    },
    {
      id: 14,
      dimension: 'deciding',
      pole: 'T',
      weight: 1,
      text: {
        th: 'เวลาเกิดปัญหา ชอบพุ่งเป้าไปที่วิธีแก้ให้จบตามจริง มากกว่ามานั่งดราม่าเรื่องอารมณ์',
        en: 'You focus on constructive, factual solutions rather than dwelling on emotional aspects.'
      }
    },
    {
      id: 15,
      dimension: 'deciding',
      pole: 'F',
      weight: -1,
      text: {
        th: 'เวลาตัดสินใจ มักฟังเสียงหัวใจและความรู้สึกของคนรอบข้าง มากกว่าเหตุผลแห้งๆ',
        en: 'When facing dilemmas, you trust your heart and empathy over pure cold reason.'
      }
    },
    {
      id: 16,
      dimension: 'deciding',
      pole: 'T',
      weight: 1,
      text: {
        th: 'วัดคุณค่างานด้วยความคุ้มค่า ประสิทธิภาพ และตัวเลขจริง มากกว่าความรู้สึกส่วนตัว',
        en: 'You evaluate situations based on logical importance, efficiency, and real metrics.'
      }
    },
    {
      id: 17,
      dimension: 'deciding',
      pole: 'F',
      weight: -1,
      text: {
        th: 'เวลาตัดสินใจร่วมกันในกลุ่ม คุณเลือกทางที่ทุกคนสบายใจและปรองดอง แม้อาจไม่ใช่ตรรกะที่เป๊ะสุด',
        en: 'In group decisions, you advocate for harmony and mutual happiness over rigid logic.'
      }
    },
    {
      id: 18,
      dimension: 'deciding',
      pole: 'F',
      weight: -1,
      text: {
        th: 'ไว้วางใจสัญชาตญาณและความรู้สึกข้างในเวลาต้องเลือกทางเดินชีวิต',
        en: 'When choosing life directions, you rely heavily on your own inner instincts and feelings.'
      }
    },

    /* ========================================================
       4. STRUCTURE: Judging (J) vs Perceiving (P) - 6 ข้อ
       ======================================================== */
    {
      id: 19,
      dimension: 'structure',
      pole: 'J',
      weight: 1,
      text: {
        th: 'ชอบวางแพลนล่วงหน้า รู้สเต็ปชัดเจนว่าวันนี้ต้องทำอะไรบ้าง ไม่ชอบให้มีอะไรหลุดแผน',
        en: 'You enjoy planning ahead and feel most comfortable with a structured, organized schedule.'
      }
    },
    {
      id: 20,
      dimension: 'structure',
      pole: 'J',
      weight: 1,
      text: {
        th: 'เริ่มโปรเจกต์ต้องมีเช็กลิสต์และไทม์ไลน์ชัดเจน ไม่ชอบแบบไปตายเอาดาบหน้า',
        en: 'When starting a project, you prefer a clear roadmap rather than figuring it out as you go.'
      }
    },
    {
      id: 21,
      dimension: 'structure',
      pole: 'P',
      weight: -1,
      text: {
        th: 'ไอเดียจะแล่นและทำงานได้ไฟลุกสุดๆ ตอนใกล้ถึงเดดไลน์ (สายปั่นไฟลนก้น)',
        en: 'You tend to work best under pressure and produce your most creative output close to deadlines.'
      }
    },
    {
      id: 22,
      dimension: 'structure',
      pole: 'J',
      weight: 1,
      text: {
        th: 'ไปเที่ยวต้องแพลนที่พัก การเดินทาง และตารางเที่ยวให้เป๊ะ ไม่อยากเสียเวลาหน้างาน',
        en: 'When planning a trip, you prefer having a detailed itinerary, bookings, and clear timeline.'
      }
    },
    {
      id: 23,
      dimension: 'structure',
      pole: 'J',
      weight: 1,
      text: {
        th: 'โต๊ะทำงานและห้องต้องเป็นระเบียบ ถึงจะโฟกัสงานได้ดี ไม่ชอบความรกรุงรัง',
        en: 'You work much better in a clean, orderly environment than in a chaotic workspace.'
      }
    },
    {
      id: 24,
      dimension: 'structure',
      pole: 'P',
      weight: -1,
      text: {
        th: 'ปรับตัวตามสถานการณ์เก่ง ชอบความยืดหยุ่น เปลี่ยนแผนได้ตลอดตามฟีล ไม่ชอบอะไรตึงเกินไป',
        en: 'You are naturally adaptable and prefer keeping options open rather than sticking to rigid plans.'
      }
    },

    /* ========================================================
       5. IDENTITY: Assertive (A) vs Overthinking (O) - 6 ข้อ
       ======================================================== */
    {
      id: 25,
      dimension: 'identity',
      pole: 'A',
      weight: 1,
      text: {
        th: 'เจอปัญหาหรือเรื่องเฟลๆ จะมูฟออนไวมาก ไม่เสียเวลาจมปลัก ล้มแล้วลุกทันที',
        en: 'You are accustomed to responding quickly to unexpected setbacks and bounce back with ease.'
      }
    },
    {
      id: 26,
      dimension: 'identity',
      pole: 'A',
      weight: 1,
      text: {
        th: 'กล้าตัดสินใจและลงมือทำทันที ไม่มัวนั่งลังเลหรือคิดวนไปวนมาหลายตลบ',
        en: 'You prefer swift, immediate action and rarely get trapped deliberating over endless options.'
      }
    },
    {
      id: 27,
      dimension: 'identity',
      pole: 'O',
      weight: -1,
      text: {
        th: 'มักเก็บเรื่องที่ผ่านมาหรือคำพูดคนอื่นมาคิดวนซ้ำๆ กังวลว่าเราทำอะไรผิดไปไหม',
        en: 'You often replay past situations in your head, worrying whether you made the right move.'
      }
    },
    {
      id: 28,
      dimension: 'identity',
      pole: 'O',
      weight: -1,
      text: {
        th: 'สำหรับคุณ การตัดสินใจให้ถูกต้องเป๊ะ สำคัญกว่าการรีบทำให้เสร็จแบบลวกๆ',
        en: 'For you, making the 100% correct choice is far more important than making it fast.'
      }
    },
    {
      id: 29,
      dimension: 'identity',
      pole: 'A',
      weight: 1,
      text: {
        th: 'มั่นใจในตัวเองเวลาโดนติชม ไม่เก็บคำวิจารณ์มาบั่นทอนจิตใจ แยกแยะได้ดี',
        en: 'You stay self-assured and calm under criticism, trusting your own inner compass.'
      }
    },
    {
      id: 30,
      dimension: 'identity',
      pole: 'O',
      weight: -1,
      text: {
        th: 'มักคิดเผื่อเคสที่แย่ที่สุดไว้ล่วงหน้าเยอะมาก ทำให้บางครั้งระแวงจนไม่กล้าก้าวต่อไป',
        en: 'You are cautious and often hesitate before making decisions due to considering worst-case outcomes.'
      }
    },

    /* ========================================================
       6. RELATING: Humane (H) vs Calm/Cold (C) - 6 ข้อ
       ======================================================== */
    {
      id: 31,
      dimension: 'relating',
      pole: 'C',
      weight: -1,
      text: {
        th: 'นิ่ง สุขุม มีเส้นแบ่งพื้นที่ส่วนตัวชัดเจน ไม่ได้เปิดใจให้ทุกคนเข้ามาง่ายๆ',
        en: 'Overall, you are a somewhat reserved and composed person with clear personal boundaries.'
      }
    },
    {
      id: 32,
      dimension: 'relating',
      pole: 'C',
      weight: -1,
      text: {
        th: 'เพื่อนๆ มักบอกว่าคุณเป็นคนใจเย็นมาก ไม่ค่อยแสดงอารมณ์ดราม่าหรือตื่นตระหนก',
        en: 'Your friends describe you as very calm, collected, and unfazed by emotional drama.'
      }
    },
    {
      id: 33,
      dimension: 'relating',
      pole: 'H',
      weight: 1,
      text: {
        th: 'เซนส์ไวเรื่องอารมณ์คนอื่น รับรู้ได้ทันทีถ้าใครในกลุ่มรู้สึกไม่ดี และพร้อมเข้าไปซัพพอร์ต',
        en: 'You are remarkably good at observing other people’s subtle emotions and responding warmly.'
      }
    },
    {
      id: 34,
      dimension: 'relating',
      pole: 'H',
      weight: 1,
      text: {
        th: 'บางครั้งยอมเหนื่อยหรือมองข้ามความต้องการตัวเอง เพราะแคร์ความรู้สึกคนอื่นมากเกินไป',
        en: 'Sometimes you neglect your own needs because you care deeply about others’ comfort.'
      }
    },
    {
      id: 35,
      dimension: 'relating',
      pole: 'C',
      weight: -1,
      text: {
        th: 'ให้ฟีดแบ็กแบบตรงไปตรงมา ไม่อ้อมค้อม ไม่ปรุงแต่ง เพราะเชื่อว่าความจริงช่วยแก้ปัญหาได้ดีที่สุด',
        en: 'When giving feedback, you provide objective, unvarnished analysis to genuinely solve problems.'
      }
    },
    {
      id: 36,
      dimension: 'relating',
      pole: 'H',
      weight: 1,
      text: {
        th: 'เป็นตัวประสานใจในกลุ่ม เข้ากับคนง่าย สร้างบรรยากาศอบอุ่นและสบายใจให้ทุกคนเสมอ',
        en: 'You naturally diffuse tension, bringing warmth and a safe, welcoming atmosphere to the room.'
      }
    }
  ];

  /* ---------------------------------------------------- Quick Assessment Questions (18 ข้อ ฉบับเร่งด่วน ไวทันใจ สรุปกระชับ) */
  const QUESTIONS_QUICK = [
    /* 1. Energy */
    {
      id: 1,
      dimension: 'energy',
      pole: 'E',
      weight: 1,
      text: {
        th: 'เวลาไปงานปาร์ตี้หรืออยู่ท่ามกลางคนเยอะๆ คุณจะยิ่งรู้สึกสดชื่นและมีพลัง',
        en: 'In social gatherings, you feel energized and lively by interacting with a large group.'
      }
    },
    {
      id: 2,
      dimension: 'energy',
      pole: 'I',
      weight: -1,
      text: {
        th: 'วันหยุดชอบนอนเล่น ดูหนัง หรือทำอะไรเงียบๆ คนเดียวอยู่ห้อง มากกว่าออกไปข้างนอก',
        en: 'In your free time, you naturally prefer quiet, relaxing activities at home.'
      }
    },
    {
      id: 3,
      dimension: 'energy',
      pole: 'E',
      weight: 1,
      text: {
        th: 'คุยเล่นทักทายคนเก่ง ชวนคุยได้ชิลๆ ไม่เคยรู้สึกอึดอัดเวลาต้องเปิดบทสนทนา',
        en: 'You find small talk enjoyable and can break the ice effortlessly with anyone.'
      }
    },

    /* 2. Input */
    {
      id: 4,
      dimension: 'input',
      pole: 'S',
      weight: 1,
      text: {
        th: 'เวลาแก้ปัญหา คุณยึดความจริง ข้อมูลที่จับต้องได้ และสิ่งที่เกิดขึ้นจริงเป็นหลัก',
        en: 'When solving problems, you rely on concrete facts, verifiable data, and reality.'
      }
    },
    {
      id: 5,
      dimension: 'input',
      pole: 'N',
      weight: -1,
      text: {
        th: 'เวลาคุยกัน คุณจะอินกับเรื่องภาพใหญ่ ไอเดียใหม่ๆ และความเป็นไปได้ในอนาคต',
        en: 'In conversations, you are drawn to future possibilities, overarching visions, and patterns.'
      }
    },
    {
      id: 6,
      dimension: 'input',
      pole: 'S',
      weight: 1,
      text: {
        th: 'ชอบลงมือทำจริง เรียนรู้จากของจริง มากกว่านั่งอ่านทฤษฎีหรือคอนเซ็ปต์ลอยๆ',
        en: 'You prefer practical hands-on experience over exploring abstract theories.'
      }
    },

    /* 3. Deciding */
    {
      id: 7,
      dimension: 'deciding',
      pole: 'T',
      weight: 1,
      text: {
        th: 'เวลาตัดสินใจเรื่องสำคัญ คุณเอาเหตุผลและความถูกต้องเป็นที่ตั้ง แม้จะขัดใจใครก็ตาม',
        en: 'When making choices, you prioritize objective truth and fairness over personal relationships.'
      }
    },
    {
      id: 8,
      dimension: 'deciding',
      pole: 'F',
      weight: -1,
      text: {
        th: 'เวลาตัดสินใจ มักฟังเสียงหัวใจและความรู้สึกของคนรอบข้าง มากกว่าเหตุผลแห้งๆ',
        en: 'When facing dilemmas, you trust your heart and empathy over pure cold reason.'
      }
    },
    {
      id: 9,
      dimension: 'deciding',
      pole: 'T',
      weight: 1,
      text: {
        th: 'เวลาเกิดปัญหา ชอบพุ่งเป้าไปที่วิธีแก้ให้จบตามจริง มากกว่ามานั่งดราม่าเรื่องอารมณ์',
        en: 'You focus on constructive, factual solutions rather than dwelling on emotional aspects.'
      }
    },

    /* 4. Structure */
    {
      id: 10,
      dimension: 'structure',
      pole: 'J',
      weight: 1,
      text: {
        th: 'ชอบวางแพลนล่วงหน้า รู้สเต็ปชัดเจนว่าวันนี้ต้องทำอะไรบ้าง ไม่ชอบให้มีอะไรหลุดแผน',
        en: 'You enjoy planning ahead and feel most comfortable with a structured, organized schedule.'
      }
    },
    {
      id: 11,
      dimension: 'structure',
      pole: 'P',
      weight: -1,
      text: {
        th: 'ปรับตัวตามสถานการณ์เก่ง ชอบความยืดหยุ่น เปลี่ยนแผนได้ตลอดตามฟีล ไม่ชอบอะไรตึงเกินไป',
        en: 'You are naturally adaptable and prefer keeping options open rather than sticking to rigid plans.'
      }
    },
    {
      id: 12,
      dimension: 'structure',
      pole: 'J',
      weight: 1,
      text: {
        th: 'เริ่มโปรเจกต์ต้องมีเช็กลิสต์และไทม์ไลน์ชัดเจน ไม่ชอบแบบไปตายเอาดาบหน้า',
        en: 'When starting a project, you prefer a clear roadmap rather than figuring it out as you go.'
      }
    },

    /* 5. Identity */
    {
      id: 13,
      dimension: 'identity',
      pole: 'A',
      weight: 1,
      text: {
        th: 'เจอปัญหาหรือเรื่องเฟลๆ จะมูฟออนไวมาก ไม่เสียเวลาจมปลัก ล้มแล้วลุกทันที',
        en: 'You are accustomed to responding quickly to unexpected setbacks and bounce back with ease.'
      }
    },
    {
      id: 14,
      dimension: 'identity',
      pole: 'O',
      weight: -1,
      text: {
        th: 'มักเก็บเรื่องที่ผ่านมาหรือคำพูดคนอื่นมาคิดวนซ้ำๆ กังวลว่าเราทำอะไรผิดไปไหม',
        en: 'You often replay past situations in your head, worrying whether you made the right move.'
      }
    },
    {
      id: 15,
      dimension: 'identity',
      pole: 'A',
      weight: 1,
      text: {
        th: 'มั่นใจในตัวเองเวลาโดนติชม ไม่เก็บคำวิจารณ์มาบั่นทอนจิตใจ แยกแยะได้ดี',
        en: 'You stay self-assured and calm under criticism, trusting your own inner compass.'
      }
    },

    /* 6. Relating */
    {
      id: 16,
      dimension: 'relating',
      pole: 'H',
      weight: 1,
      text: {
        th: 'เซนส์ไวเรื่องอารมณ์คนอื่น รับรู้ได้ทันทีถ้าใครในกลุ่มรู้สึกไม่ดี และพร้อมเข้าไปซัพพอร์ต',
        en: 'You are remarkably good at observing other people’s subtle emotions and responding warmly.'
      }
    },
    {
      id: 17,
      dimension: 'relating',
      pole: 'C',
      weight: -1,
      text: {
        th: 'นิ่ง สุขุม มีเส้นแบ่งพื้นที่ส่วนตัวชัดเจน ไม่ได้เปิดใจให้ทุกคนเข้ามาง่ายๆ',
        en: 'Overall, you are a somewhat reserved and composed person with clear personal boundaries.'
      }
    },
    {
      id: 18,
      dimension: 'relating',
      pole: 'H',
      weight: 1,
      text: {
        th: 'เป็นตัวประสานใจในกลุ่ม เข้ากับคนง่าย สร้างบรรยากาศอบอุ่นและสบายใจให้ทุกคนเสมอ',
        en: 'You naturally diffuse tension, bringing warmth and a safe, welcoming atmosphere to the room.'
      }
    }
  ];

  const QUESTIONS_FULL = QUESTIONS;

  function getQuestions(mode = 'full') {
    return mode === 'quick' ? QUESTIONS_QUICK : QUESTIONS_FULL;
  }

  /* ---------------------------------------------------------------- state */
  let currentLang = localStorage.getItem('prism64-lang') || 'th';

  /* ----------------------------------------------------------- core methods */
  function t(key) {
    const entry = STRINGS[key];
    if (!entry) return key;
    return entry[currentLang] || key;
  }

  function setLang(lang) {
    if (lang !== 'th' && lang !== 'en') return;
    currentLang = lang;
    localStorage.setItem('prism64-lang', lang);
    document.documentElement.lang = lang;
    _updateDOM();
    window.dispatchEvent(new CustomEvent('langchange', { detail: { lang } }));
  }

  function getLang() { return currentLang; }

  function toggleLang() {
    setLang(currentLang === 'th' ? 'en' : 'th');
  }

  /* ---------------------------------------------------------- DOM update */
  function _updateDOM() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      const raw = t(key);
      if (raw !== key) {
        el.textContent = raw;
      }
    });

    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      const key = el.getAttribute('data-i18n-placeholder');
      const raw = t(key);
      if (raw !== key) {
        el.placeholder = raw;
      }
    });

    document.querySelectorAll('[data-i18n-attr]').forEach(el => {
      const raw = el.getAttribute('data-i18n-attr');
      if (!raw) return;
      const pairs = raw.split(';');
      pairs.forEach(pair => {
        const [attr, key] = pair.split(':');
        if (attr && key) {
          el.setAttribute(attr.trim(), t(key.trim()));
        }
      });
    });
  }

  /* --------------------------------------------------------- init / export */
  function init() {
    document.documentElement.lang = currentLang;
    _updateDOM();
  }

  return { t, setLang, getLang, toggleLang, init, STRINGS, QUESTIONS, QUESTIONS_QUICK, QUESTIONS_FULL, getQuestions };
})();