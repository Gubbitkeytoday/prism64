/* ==========================================================================
   PRISM64 — Core Data Model (วัยรุ่น เข้าใจง่าย กระชับ ตรงประเด็น)
   --------------------------------------------------------------------------
   6 Dimensions × 4 Spectra × 16 Core Types × 4 Variants = 64 Unique Shades
   ========================================================================== */

const DIMENSIONS = [
  {
    key: 'energy', index: 0, letters: ['E', 'I'], spectrum: 'amber',
    label: { th: 'พลังงาน (สายชาร์จพลัง)', en: 'Energy' },
    glyph: 'E / I',
    bigfive: { th: 'Extraversion (เปิดรับ vs เก็บพลัง)', en: 'Extraversion' },
    question: { th: 'คุณชาร์จพลังจากที่ไหน?', en: 'Where does your energy come from?' },
    poles: {
      E: {
        name: { th: 'Extravert — สายเปิดตี้', en: 'Extravert' },
        short: { th: 'สายตี้ (E)', en: 'Extravert' },
        desc: {
          th: 'ได้พลังจากเพื่อน การพูดคุย และกิจกรรม คิดออกเสียงแล้วไอเดียแล่นไว',
          en: 'Recharges around people, conversation and shared action. Thinks out loud, then finds clarity.'
        }
      },
      I: {
        name: { th: 'Introvert — สายชาร์จเงียบ', en: 'Introvert' },
        short: { th: 'สายเงียบ (I)', en: 'Introvert' },
        desc: {
          th: 'ได้พลังจากพื้นที่ส่วนตัวและความสงบ คิดจบในหัวก่อนค่อยพูดออกมา',
          en: 'Recharges in private space and quiet. Finishes the thought inside before saying it.'
        }
      }
    }
  },
  {
    key: 'input', index: 1, letters: ['S', 'N'], spectrum: 'green',
    label: { th: 'การรับข้อมูล (สายมองโลก)', en: 'Input' },
    glyph: 'S / N',
    bigfive: { th: 'Openness (ข้อเท็จจริง vs ภาพในหัว)', en: 'Openness to Experience' },
    question: { th: 'คุณเชื่ออะไรมากกว่า — ข้อมูลจริงตรงหน้า หรือ ไอเดียในหัว?', en: 'What do you trust more — what is there, or the pattern behind it?' },
    poles: {
      S: {
        name: { th: 'Sensing — สายเรียล', en: 'Sensing' },
        short: { th: 'สายเรียล (S)', en: 'Sensing' },
        desc: {
          th: 'เชื่อข้อเท็จจริงและประสบการณ์ตรง เน้นสิ่งที่จับต้องได้ วัดผลได้ชัวร์ๆ',
          en: 'Trusts facts, detail and direct experience. Starts from what can actually be measured.'
        }
      },
      N: {
        name: { th: 'iNtuition — สายเซนส์', en: 'iNtuition' },
        short: { th: 'สายเซนส์ (N)', en: 'Intuition' },
        desc: {
          th: 'เชื่อรูปแบบ ความเป็นไปได้ และไอเดียใหม่ๆ ชอบมองภาพใหญ่ไปข้างหน้า',
          en: 'Trusts patterns, connections and possibility. Starts from the big picture and works back.'
        }
      }
    }
  },
  {
    key: 'deciding', index: 2, letters: ['T', 'F'], spectrum: 'violet',
    label: { th: 'การตัดสินใจ (สายเลือก)', en: 'Deciding' },
    glyph: 'T / F',
    bigfive: { th: 'Agreeableness (ตรรกะ vs แคร์ใจคน)', en: 'Agreeableness' },
    question: { th: 'เวลาเลือกอะไร คุณเอาอะไรนำ?', en: 'When you decide, what gets weighed first?' },
    poles: {
      T: {
        name: { th: 'Thinking — สายตรรกะ', en: 'Thinking' },
        short: { th: 'สายตรรกะ (T)', en: 'Thinking' },
        desc: {
          th: 'ตัดสินด้วยเหตุผลและความถูกต้อง ตรงไปตรงมา ไม่อ้อมค้อม',
          en: 'Decides by logic, consistency and provable outcome. Will accept an awkward conversation if it is the honest one.'
        }
      },
      F: {
        name: { th: 'Feeling — สายแคร์ใจ', en: 'Feeling' },
        short: { th: 'สายแคร์ใจ (F)', en: 'Feeling' },
        desc: {
          th: 'ตัดสินด้วยความรู้สึกและผลกระทบต่อคน เน้นรักษาความสัมพันธ์และความสบายใจ',
          en: 'Decides by values, human impact and relational fit. The cost to people counts as real data.'
        }
      }
    }
  },
  {
    key: 'structure', index: 3, letters: ['J', 'P'], spectrum: 'blue',
    label: { th: 'การใช้ชีวิต (สายจัดการ)', en: 'Structure' },
    glyph: 'J / P',
    bigfive: { th: 'Conscientiousness (วางแผน vs ด้นสด)', en: 'Conscientiousness' },
    question: { th: 'ชอบวางแผนไว้ก่อน หรือ ชอบไปลุ้นข้างหน้า?', en: 'Do you want things settled, or left open?' },
    poles: {
      J: {
        name: { th: 'Judging — สายเป๊ะ', en: 'Judging' },
        short: { th: 'สายเป๊ะ (J)', en: 'Judging' },
        desc: {
          th: 'ชอบมีแพลนชัด มีตารางเวลา สบายใจเมื่องานเสร็จเรียบร้อยตามนัด',
          en: 'Comfortable with plans, deadlines and closure. Settles the question early and moves.'
        }
      },
      P: {
        name: { th: 'Perceiving — สายด้นสด', en: 'Perceiving' },
        short: { th: 'สายด้นสด (P)', en: 'Perceiving' },
        desc: {
          th: 'ชอบความยืดหยุ่น ปรับตามสถานการณ์ได้ดี ไม่ชอบโดนตีกรอบตายตัว',
          en: 'Comfortable keeping options open, adapting live, and deciding when the information is actually in.'
        }
      }
    }
  },
  {
    key: 'identity', index: 4, letters: ['A', 'O'], spectrum: 'violet', variant: true,
    label: { th: 'ความมั่นคงทางใจ (สายฟีลลิ่ง)', en: 'Identity' },
    glyph: 'A / O',
    bigfive: { th: 'Emotional Stability (มั่นใจ vs คิดมากง่าย)', en: 'Neuroticism, reversed (emotional stability)' },
    question: { th: 'เวลาเจอปัญหาหรือคำวิจารณ์ คุณรู้สึกยังไง?', en: 'Is your confidence steady, or does it move?' },
    poles: {
      A: {
        name: { th: 'Assertive — สายมูฟออนไว', en: 'Assertive' },
        short: { th: 'มูฟออนไว (A)', en: 'Assertive' },
        desc: {
          th: 'มั่นใจในตัวเอง ล้มแล้วลุกเร็ว ไม่เก็บเรื่องกังวลมาคิดวนก่อนนอน',
          en: 'Confidence sits fairly level. Rarely ruminates on mistakes, lets criticism pass through.'
        }
      },
      O: {
        name: { th: 'Oscillating — สายคิดมากง่าย', en: 'Oscillating' },
        short: { th: 'คิดมากง่าย (O)', en: 'Oscillating' },
        desc: {
          th: 'เซนซิทีฟ ตรวจงานซ้ำๆ ละเอียดรอบคอบเพราะอยากให้ผลงานออกมาดีที่สุด',
          en: 'Confidence tracks results. Sensitive to error — which becomes the engine that keeps improving the work.'
        }
      }
    }
  },
  {
    key: 'relating', index: 5, letters: ['H', 'C'], spectrum: 'teal', variant: true,
    label: { th: 'การเข้าสังคม (สายปรับตัว)', en: 'Relating' },
    glyph: 'H / C',
    bigfive: { th: 'Relational Style (เซฟใจทุกคน vs มีสเปซส่วนตัว)', en: 'Communal orientation vs. autonomy' },
    question: { th: 'คุณวางตัวกับคนรอบข้างแบบไหน?', en: 'How do you manage the space between you and other people?' },
    poles: {
      H: {
        name: { th: 'Harmony — สายเซฟใจทุกคน', en: 'Harmony' },
        short: { th: 'เซฟใจทุกคน (H)', en: 'Harmony' },
        desc: {
          th: 'อ่านมู้ดห้องไว ชอบปรับตัวเพื่อความสบายใจของคนในกลุ่ม',
          en: 'Reads the room and adapts to keep group flow smooth.'
        }
      },
      C: {
        name: { th: 'Calm — สายมีสเปซส่วนตัว', en: 'Calm' },
        short: { th: 'มีสเปซส่วนตัว (C)', en: 'Calm' },
        desc: {
          th: 'นิ่งสงบ ไม่เอาดราม่าของคนอื่นมารบกวนใจ อยู่กับตัวเองได้ชิลๆ',
          en: 'Holds own equilibrium regardless of group dynamics.'
        }
      }
    }
  }
];

/* ---------------------------------------------------------------- Spectra */

const SPECTRA = {
  violet: {
    key: 'violet', filter: 'NT',
    name: { th: 'สเปกตรัมม่วง', en: 'Violet Spectrum' },
    role: { th: 'สายสมอง & วางแผนล้ำ', en: 'The Systems Minds' },
    desc: {
      th: 'มองโลกเป็นระบบ ถอดประกอบและแก้เกมเก่ง ตรรกะแน่น ไม่ชอบอะไรไร้สาระ',
      en: 'Sees the world as a system that can be taken apart. Driven by the need to understand something to its root.'
    },
    codes: ['INTJ', 'INTP', 'ENTJ', 'ENTP']
  },
  green: {
    key: 'green', filter: 'NF',
    name: { th: 'สเปกตรัมเขียว', en: 'Green Spectrum' },
    role: { th: 'สายฟีลกู้ด & เชื่อมใจ', en: 'The Idealists' },
    desc: {
      th: 'แคร์ความหมายและจิตใจคน มองเห็นศักยภาพในตัวทุกคน เข้าใจความรู้สึกเก่ง',
      en: 'Driven by meaning and human potential. Tends to see what someone could become.'
    },
    codes: ['INFJ', 'INFP', 'ENFJ', 'ENFP']
  },
  blue: {
    key: 'blue', filter: 'SJ',
    name: { th: 'สเปกตรัมน้ำเงิน', en: 'Blue Spectrum' },
    role: { th: 'สายเป๊ะ & พึ่งพาได้', en: 'The Stabilisers' },
    desc: {
      th: 'รักษาคำพูด มีวินัย จัดการงานเรียบร้อย เสาหลักที่ทุกคนไว้ใจได้เสมอ',
      en: 'The structure everything else stands on. Believes in responsibility, continuity, and keeping promises.'
    },
    codes: ['ISTJ', 'ISFJ', 'ESTJ', 'ESFJ']
  },
  amber: {
    key: 'amber', filter: 'SP',
    name: { th: 'สเปกตรัมเหลือง', en: 'Amber Spectrum' },
    role: { th: 'สายแอ็กชัน & ลุยแหลก', en: 'The Doers' },
    desc: {
      th: 'อยู่กับปัจจุบัน ชอบลงมือทำจริง ปรับตัวไว ไหวพริบดีในทุกสถานการณ์',
      en: 'Lives in the present. Learns by doing and is at its best when the situation changes fast.'
    },
    codes: ['ISTP', 'ISFP', 'ESTP', 'ESFP']
  }
};

/* ------------------------------------------------- 16 Core Type Profiles */

const CORE_TYPES = {

  /* ---------------------------------------------------- Violet Spectrum */

  INTJ: {
    code: 'INTJ', spectrum: 'violet', share: 4.24, img: 'INTJ',
    name: { th: 'นักวางแผนลับ', en: 'The Strategist' },
    tagline: {
      th: 'เห็นทางออกก่อนใคร ไม่ชอบคุยเรื่องไร้สาระ',
      en: 'Sees the destination before anyone else sees the road.'
    },
    blurb: {
      th: 'คิดเป็นระบบระยะยาว ทำงานเงียบๆ แต่ผลลัพธ์เปลี่ยนเกม',
      en: 'Long-horizon systems thinker. Works quietly, moves the whole board.'
    },
    overview: {
      th: 'INTJ วางแผนชีวิตเหมือนเขียนโค้ด มองข้ามช็อตไปไกลกว่าคนอื่นเสมอ คิดจบในหัวก่อนพูด ไม่ชอบการเสียเวลากับเรื่องไร้สาระ เวลาลงมือทำอะไรคือตั้งใจให้สำเร็จจริง',
      en: 'INTJs treat the future like a blueprint that can still be edited. You reverse-engineer from an end state back to this week faster than most people, and often lose interest in work you have already solved in your head.'
    },
    strengths: {
      th: ['วางแผนระยะยาวได้เป๊ะและใช้งานได้จริง', 'ตัดสินใจเด็ดขาดโดยไม่อิงอารมณ์', 'กล้าตั้งคำถามกับกฎเดิมๆ ที่ไม่เวิร์ก', 'ทำงานคนเดียวได้เก่ง ไม่ต้องมีใครคุม', 'ยกเครื่องแก้ปัญหายากๆ ได้ตั้งแต่ต้นตอ'],
      en: ['Builds a long horizon and an actual order of operations', 'Separates emotion from analysis under pressure', 'Questions the assumption everyone else already accepted', 'Runs entirely self-directed, needs no one pushing', 'Rebuilds a broken system at the root rather than patching it']
    },
    growth: {
      th: ['อธิบายเหตุผลให้เพื่อนร่วมทีมฟังบ้าง', 'ยอมปล่อยงานที่ 80% ออกไปเทสต์ก่อน', 'สังเกตความรู้สึกคนรอบข้างที่ไม่ได้พูดออกมา', 'ใจเย็นกับคนที่คิดช้ากว่า', 'บางเรื่องแก้ด้วยความสัมพันธ์ ไม่ใช่แค่ตรรกะ'],
      en: ['Show the reasoning, not just the conclusion', 'Let work ship at 80% and meet the real world', 'Read the team signals nobody said out loud', 'Watch the habit of writing people off for thinking slower', 'Accept that some problems are solved by relationship, not logic']
    },
    careers: {
      th: ['นักวางกลยุทธ์ธุรกิจ', 'System Architect', 'นักวิเคราะห์การลงทุน', 'ผู้ก่อตั้งสตาร์ตอัป', 'Product Director', 'Data Scientist', 'ที่ปรึกษาการจัดการ'],
      en: ['Corporate strategist', 'Systems / solution architect', 'Investment analyst', 'Startup founder', 'Management consultant', 'Director of product', 'Data engineer']
    },
    work: {
      th: 'ทำงานได้ดีสุดเมื่อได้เป้าหมายชัดเจน และมีอิสระในการเลือกวิธีทำ เกลียดการโดนจู้จี้สั่งการมากกว่างานหนัก',
      en: 'At your best with a clear objective, freedom over method, and no meeting that ends without a decision.'
    },
    love: {
      th: 'แสดงความรักด้วยการกระทำ คอยแก้ปัญหาให้ และวางแผนอนาคตด้วยกัน สิ่งที่ต้องฝึกคือรับฟังอารมณ์โดยไม่ต้องรีบเสนอทางแก้',
      en: 'You rarely say it in soft words; you say it by remembering details, removing problems, and planning a shared future seriously.'
    },
    stress: {
      th: 'เวลาเครียดจะถอยไปคิดคนเดียวและดูเย็นชา ทางแก้คือลุกขึ้นมาทำกิจกรรมที่ใช้แรงหรือออกกำลังกายเพื่อตัดวงจรความคิดวน',
      en: 'Under stress you retreat inward, loop the same analysis, and go cold on the people nearby.'
    },
    motto: { th: '“แก้ปัญหาที่ต้นตอ ดีกว่าตามแก้ที่ปลายเหตุ”', en: '“If the system is broken, do not treat the symptom.”' },
    matches: ['ENFP', 'ENTP', 'INFJ']
  },

  INTP: {
    code: 'INTP', spectrum: 'violet', share: 3.97, img: 'INTP',
    name: { th: 'ยอดนักคิดจอมสงสัย', en: 'The Theorist' },
    tagline: {
      th: 'สงสัยทุกเรื่อง อยากรู้ความจริง ไม่ชอบทำตามกรอบ',
      en: 'Not trying to win the argument — trying to find what is true.'
    },
    blurb: {
      th: 'ชอบรื้อระบบดูการทำงาน สนุกกับการตั้งคำถามและคิดนอกกรอบ',
      en: 'Takes everything apart to see how it works. Enjoys the question more than the answer.'
    },
    overview: {
      th: 'INTP ขับเคลื่อนด้วยความสงสัย ไม่เชื่ออะไรง่ายๆ จนกว่าจะพิสูจน์เอง หัวแล่นเร็ว เชื่อมโยงเก่ง จุดที่ต้องระวังคือเริ่มเก่งแต่ขี้เกียจปิดจ็อบ',
      en: 'The INTP\'s primary instrument is doubt. You rarely accept something because you were told; you accept it once it survives being interrogated.'
    },
    strengths: {
      th: ['จับจุดผิดสังเกตและข้อขัดแย้งได้ไวมาก', 'คิดนอกกรอบเก่ง ไม่ยึดติดวิธีเดิมๆ', 'เรียนรู้เรื่องยากๆ ด้วยตัวเองได้เร็ว', 'ยอมรับความจริงเมื่อมีข้อมูลใหม่ที่ดีกว่า', 'เปิดกว้าง ไม่ตัดสินคนจากภายนอก'],
      en: ['Spots the internal contradiction in an argument fast', 'Genuinely original because unattached to the standard method', 'Teaches itself complicated things at speed', 'Intellectually honest — changes position when the data does', 'Flexible, and slow to judge people on surface']
    },
    growth: {
      th: ['ทำงานที่เริ่มไว้ให้เสร็จก่อนเปิดโปรเจกต์ใหม่', 'สรุปเนื้อหาให้เข้าใจง่าย ไม่ใช้ศัพท์ยากเกินไป', 'ให้ความสำคัญกับเดดไลน์เท่ากับความถูกต้อง', 'รับฟังเรื่องอารมณ์โดยไม่ต้องรีบวิเคราะห์', 'ลงมือทำทันทีโดยไม่ต้องรอให้รู้ครบ 100%'],
      en: ['Finish the thing instead of opening a new one when bored', 'Translate the conclusion for people outside the domain', 'Treat a deadline as seriously as correctness', 'Stay in an emotional conversation without converting it to analysis', 'Act before understanding is 100% complete']
    },
    careers: {
      th: ['Software Engineer', 'นักวิจัย / นักวิทยาศาสตร์', 'Data Architect', 'Cybersecurity Specialist', 'นักวิเคราะห์ระบบ', 'อาจารย์ / ติวเตอร์'],
      en: ['Researcher / scientist', 'Software engineer', 'Mathematician / statistician', 'Data architect', 'Systems analyst', 'Cybersecurity specialist']
    },
    work: {
      th: 'ต้องการเวลาโฟกัสยาวๆ ที่ไม่มีใครมากวน ชอบงานที่วัดกันที่ผลลัพธ์ ไม่ใช่วัดที่จำนวนชั่วโมงนั่งโต๊ะ',
      en: 'Needs long uninterrupted blocks and a manager who cares what is right rather than who said it.'
    },
    love: {
      th: 'แสดงความรักด้วยการแชร์ความคิดและคุยเรื่องลึกๆ ควรฝึกพูดความรู้สึกออกมาตรงๆ แทนที่จะคิดไปเองว่าอีกฝ่ายรู้อยู่แล้ว',
      en: 'You love by making room in your head for someone. Practise saying the feeling out loud instead of assuming it was understood.'
    },
    stress: {
      th: 'เครียดแล้วจะหายตัวไปเงียบๆ ทางแก้คือแบ่งงานเป็นชิ้นเล็กๆ แล้วทำทีละอย่างให้เสร็จใน 30 นาที',
      en: 'Stress makes you disappear from people and from the task. The exit is shrinking the problem until an hour of work fits it.'
    },
    motto: { th: '“ทุกอย่างจะน่าสนใจทันที เมื่อเรารู้ว่ามันทำงานยังไง”', en: '“Everything is interesting once you can open it.”' },
    matches: ['ENTJ', 'ENFJ', 'ESTJ']
  },

  ENTJ: {
    code: 'ENTJ', spectrum: 'violet', share: 5.01, img: 'ENTJ',
    name: { th: 'บอสใหญ่สายลุย', en: 'The Vanguard' },
    tagline: {
      th: 'หลบไป ตัวแม่/ตัวพ่อจะคุมเอง ทำงานให้ไว ไม่รอใคร',
      en: 'Was never waiting for permission.'
    },
    blurb: {
      th: 'เห็นเป้าหมาย สั่งการชัด ผลักดันทีมให้ถึงเส้นชัย',
      en: 'Sees the goal, arranges the people, sets the clock, makes it happen.'
    },
    overview: {
      th: 'ENTJ เปลี่ยนไอเดียให้กลายเป็นผลงานจริงได้เร็วมาก ตัดสินใจเด็ดขาด ตรงไปตรงมา ไม่ชอบคนผลัดวันประกันพรุ่ง ทำงานด้วยแล้วโปรเจกต์เดินไวสุดๆ',
      en: 'ENTJs convert vision into structure at speed. You do not just know where to go — you know who is needed, how long it takes, and what gets cut.'
    },
    strengths: {
      th: ['ตัดสินใจไวและเฉียบขาดแม้ข้อมูลไม่ครบ', 'จัดสรรงานและดึงศักยภาพทีมได้ยอดเยี่ยม', 'สื่อสารชัดเจน ตรงไปตรงมา ไม่ต้องเดา', 'มองความล้มเหลวเป็นบทเรียนเพื่อไปต่อ', 'ยกระดับมาตรฐานของทั้งทีมให้สูงขึ้น'],
      en: ['Decides fast on incomplete information', 'Organises work and people into something that actually moves', 'Says it plainly — leaves nobody guessing', 'Treats failure as data rather than injury', 'Raises the whole team\'s standard without being asked']
    },
    growth: {
      th: ['ลองถามความคิดเห็นทีมก่อนสั่งการ', 'ให้เวลากับคนที่คิดช้ากว่าเพื่อความรอบคอบ', 'ใจเย็นกับความรู้สึกของเพื่อนร่วมงาน', 'พักผ่อนบ้างโดยไม่ต้องรู้สึกผิด'],
      en: ['Ask before instructing, even when you already know', 'Give room to people who think slower in order to think deeper', 'Accept that speed sometimes costs relational quality', 'Rest without treating it as lost time']
    },
    careers: {
      th: ['ผู้บริหาร / CEO', 'ผู้ก่อตั้งสตาร์ตอัป', 'Operations Director', 'นักลงทุน / VC', 'Project Manager ระดับสูง', 'ที่ปรึกษากลยุทธ์'],
      en: ['Chief executive', 'Founder and scaler', 'Director of operations', 'Investor / venture capital', 'Large-programme manager', 'Strategy consultant']
    },
    work: {
      th: 'ชอบบทบาทที่มีอำนาจตัดสินใจจริง ทนไม่ได้กับระบบชักช้าหรือการทำงานแบบไร้ประสิทธิภาพ',
      en: 'Needs authority equal to accountability. Put in a seat that carries the consequence but not the decision, you will be gone inside a year.'
    },
    love: {
      th: 'มองความรักเป็นทีมเวิร์กที่ต้องซัพพอร์ตและโตไปด้วยกัน อย่าลืมบอกรักและให้กำลังใจบ่อยๆ ด้วยคำพูดอบอุ่น',
      en: 'You see a relationship as a team that should get better together. But your partner needs to hear "I am with you", not only "I will handle it".'
    },
    stress: {
      th: 'เครียดแล้วจะเริ่มเผด็จการและใจร้อน ทางแก้คือกระจายงานให้คนอื่นทำบ้างแล้วหยุดพักเบรกสั้นๆ',
      en: 'Stress makes you grip tighter and move faster. The exit is actually delegating one thing that matters.'
    },
    motto: { th: '“แผนการที่ไม่มีคนลงมือทำ ก็เป็นแค่คำพูดลอยๆ”', en: '“A plan nobody executes is just an opinion.”' },
    matches: ['INTP', 'INFP', 'ISTP']
  },

  ENTP: {
    code: 'ENTP', spectrum: 'violet', share: 4.34, img: 'ENTP',
    name: { th: 'ตัวปั่นไอเดีย', en: 'The Catalyst' },
    tagline: {
      th: 'ชอบท้าทายกรอบเดิมๆ แกล้งเพื่อนและหาทางใหม่คืองานถนัด',
      en: 'Keeps asking "why that way" until a new way appears.'
    },
    blurb: {
      th: 'ไอเดียพรั่งพรู ปรับตัวไว สนุกกับการเถียงเพื่อหาความจริง',
      en: 'Ideas arrive in volleys. Enjoys challenging whatever everyone accepted.'
    },
    overview: {
      th: 'ENTP มองเห็นทางเลือกที่คนอื่นคิดไม่ถึงเสมอ ชอบคุยแลกเปลี่ยนไอเดีย ปรับตัวโคตรไว เบื่อง่ายกับงานซ้ำซาก ชอบอะไรที่ท้าทายสมอง',
      en: 'ENTPs run on possibility. You see the third option while everyone is still arguing between one and two. The pleasure is testing ideas.'
    },
    strengths: {
      th: ['หาทางออกใหม่ๆ ในปัญหาที่คนอื่นตันได้ไว', 'ปรับตัวตามสถานการณ์ได้เร็วมาก', 'กล้าแสดงความคิดเห็นที่แตกต่าง', 'เชื่อมโยงไอเดียข้ามสายงานได้เก่ง', 'ไม่กลัวการโดนแย้งถ้าอีกฝ่ายมีเหตุผลดีกว่า'],
      en: ['Finds a new route through a problem people called fixed', 'Adapts fast when the situation changes mid-way', 'Makes a room braver about disagreeing the moment you speak', 'Connects people and ideas across unrelated fields', 'Genuinely unafraid of being shown wrong']
    },
    growth: {
      th: ['ทำโปรเจกต์ให้เสร็จทีละชิ้นก่อนเริ่มใหม่', 'ระวังการหยอกล้อหรือเถียงในจังหวะที่คนอื่นซีเรียส', 'ทำงานเอกสารหรือดีเทลที่จำเป็นให้ครบ', 'รักษาคำพูดที่ให้ไว้กับเพื่อน'],
      en: ['Pick one thing and land it before starting another', 'Know when you are helping the thinking and when you are just poking', 'Handle the detail and routine that credibility rests on', 'Deliver the whole commitment, not only the exciting part']
    },
    careers: {
      th: ['ผู้ประกอบการ / Founder', 'Creative Director', 'Product Manager', 'Marketing Strategist', 'Content Creator / นักเขียน', 'นักพัฒนานวัตกรรม'],
      en: ['Founder', 'Marketing strategist', 'Creative director', 'Business development', 'Innovation consultant', 'Product manager']
    },
    work: {
      th: 'ต้องการโจทย์ใหม่ๆ ให้แก้เรื่อยๆ ถ้าต้องทำงานประจำซ้ำๆ ทุกวันจะเบื่อและหมดไฟเร็วมาก',
      en: 'Needs a fresh problem regularly and colleagues who can take being challenged. Once the work becomes routine you will start stirring things.'
    },
    love: {
      th: 'ชอบคนที่คุยทันกันและแลกเปลี่ยนความเห็นสนุกๆ ควรฝึกรักษาความสม่ำเสมอในวันที่เรียบง่าย',
      en: 'You love someone who is fun to think with. The practice is consistency on the unexciting days.'
    },
    stress: {
      th: 'เครียดแล้วจะยิ่งเถียงหรือหนีไปเริ่มของใหม่ ทางแก้คือเขียนสิ่งที่ต้องทำออกมา 3 ข้อแล้วปิดให้จบทีละข้อ',
      en: 'Stress makes you jump to something new, avoid the unfinished thing, and argue harder than usual. The exit is writing the open list down.'
    },
    motto: { th: '“กฎข้อนี้มีไว้ทำไม — และเราทำวิธีที่ดีกว่านี้ได้ไหม?”', en: '“Why does this rule exist — and does it still need to?”' },
    matches: ['INTJ', 'INFJ', 'ISFJ']
  },

  /* ----------------------------------------------------- Green Spectrum */

  INFJ: {
    code: 'INFJ', spectrum: 'green', share: 4.30, img: 'INFJ',
    name: { th: 'ผู้หยั่งรู้ประจำกลุ่ม', en: 'The Oracle' },
    tagline: {
      th: 'อ่านใจคนขาดตั้งแต่ยังไม่พูด แคร์ความหมายมากกว่าเงินทอง',
      en: 'Reads people before they speak.'
    },
    blurb: {
      th: 'เงียบ ลึกซึ้ง และมีเป้าหมายชัดเจน อ่านคนเก่งจนน่ากลัว',
      en: 'Deep, quiet, purposeful. Unsettlingly accurate about what drives people.'
    },
    overview: {
      th: 'INFJ เซนส์แรง อ่านความรู้สึกคนอื่นได้ลึกมาก ให้ความสำคัญกับความจริงใจ มีอุดมการณ์แรงกล้า ชอบอยู่เงียบๆ เพื่อชาร์จพลังใจ',
      en: 'INFJs work with people below the level of what is said. You catch the gap between what someone states and what they want.'
    },
    strengths: {
      th: ['เข้าใจแรงจูงใจและความรู้สึกคนอื่นได้อย่างลึกซึ้ง', 'มองเห็นภาพอนาคตและผลกระทบต่อจิตใจคน', 'พูดเตือนสติได้อย่างนุ่มนวลแต่ตรงใจ', 'ยึดมั่นในคุณธรรมและความถูกต้อง', 'เป็นผู้ฟังที่ดีและสร้างพื้นที่ปลอดภัยให้คนรอบตัว'],
      en: ['Reads hidden motivation accurately', 'Holds the long horizon and the human cost at once', 'Delivers hard things gently but honestly', 'Holds a principle even in the minority', 'Creates a space where people genuinely open up']
    },
    growth: {
      th: ['บอกสิ่งที่ตัวเองต้องการออกมาตรงๆ', 'อย่าแบกความรู้สึกของทุกคนไว้คนเดียวจนหมดพลัง', 'ยอมปล่อยวางความสัมพันธ์ที่เป็นพิษ', 'อย่าเพิ่งคิดลบไปเองก่อนถามความจริง'],
      en: ['Say your own need out loud and plainly', 'Let some relationships end instead of repairing everything', 'Watch burning yourself to keep other people warm', 'Do not trust your read without checking it against reality']
    },
    careers: {
      th: ['นักจิตวิทยา / ที่ปรึกษา', 'นักเขียน / คอนเทนต์ครีเอเตอร์', 'UX Researcher', 'HR & Culture Specialist', 'อาจารย์ / โค้ช', 'ผู้นำองค์กรเพื่อสังคม'],
      en: ['Psychologist / therapist', 'Writer / editor', 'Organisational and culture consultant', 'UX researcher', 'Career counsellor', 'Social researcher']
    },
    work: {
      th: 'ต้องการงานที่มีคุณค่าต่อสังคม บรรยากาศสงบ และทีมที่เคารพความรู้สึกลึกซึ้งซึ่งกันและกัน',
      en: 'Needs work connected to your values, enough quiet to think, and colleagues who do not treat depth as over-sensitivity.'
    },
    love: {
      th: 'รักใครแล้วทุ่มเทเต็มที่และจริงจังมาก ระวังการหลงรักภาพในฝันที่อยากให้อีกฝ่ายเป็น มากกว่าคนที่เขาเป็นจริงๆ',
      en: 'You give deeply to few people, and once chosen you commit entirely. The risk is loving the version of someone you can see they could become.'
    },
    stress: {
      th: 'เครียดแล้วจะปิดตัวเองเงียบกริบและมองโลกมืดมน ทางแก้คือระบายให้เพื่อนสนิทที่ไว้ใจได้ฟัง 1 คน',
      en: 'Stress makes you quietly cut everyone off and read everything darker than it is. The exit is talking to one trusted person.'
    },
    motto: { th: '“ถ้าทำแล้วไม่มีความหมายกับใจ ก็ทำไม่ลง”', en: '“If it means nothing, I cannot do it.”' },
    matches: ['ENTP', 'ENFP', 'INTJ']
  },

  INFP: {
    code: 'INFP', spectrum: 'green', share: 7.60, img: 'INFP',
    name: { th: 'คนช่างฝันฟีลกู้ด', en: 'The Dreamweaver' },
    tagline: {
      th: 'ใจดี โลกสวยข้างใน ดื้อเงียบเมื่อโดนแตะคุณค่าที่รัก',
      en: 'Larger on the inside than the outside shows.'
    },
    blurb: {
      th: 'อ่อนโยนแต่ยึดมั่นในหลักการ โลกส่วนตัวสดใสและมีความหมาย',
      en: 'Gentle, but immovable on principle. A detailed, high-colour inner world.'
    },
    overview: {
      th: 'INFP ใช้หัวใจนำทาง ซื่อสัตย์กับความรู้สึกตัวเอง เข้าใจความเจ็บปวดของคนอื่นเก่งมาก เป็นที่ปรึกษาที่อบอุ่น แค่ต้องระวังคิดมากจนหมดพลัง',
      en: 'INFPs navigate by a sense of what is right. You look flexible about most things, and become completely immovable when a core value is hit.'
    },
    strengths: {
      th: ['เข้าใจและเห็นใจความรู้สึกคนอื่นเก่งมาก', 'มีความคิดสร้างสรรค์และมุมมองเฉพาะตัว', 'ซื่อสัตย์ต่อตัวเองและคุณค่าที่เชื่อมั่น', 'เปิดรับความแตกต่างของคนอย่างจริงใจ', 'สร้างงานศิลปะหรือข้อความที่ทัชใจคนได้ลึก'],
      en: ['Understands other people\'s feelings without needing them explained', 'Creative with a genuinely personal point of view', 'Faithful to its values even when nobody is watching', 'Truly open to how differently other people live', 'Excellent at work requiring emotional precision']
    },
    growth: {
      th: ['แปลงไอเดียในหัวให้กลายเป็นชิ้นงานจริง', 'กล้าปฏิเสธก่อนที่พลังใจจะหมดเกลี้ยง', 'รับคำวิจารณ์งานโดยไม่คิดว่าเขาเกลียดเรา', 'จัดการเรื่องเอกสารและการเงินให้เป็นระเบียบ', 'ยอมให้งานไม่เพอร์เฟกต์ 100% แต่ได้ส่งจริง'],
      en: ['Turn the beautiful idea into a finished object', 'State the boundary before the energy runs out', 'Take criticism of the work without hearing rejection of the self', 'Systematise the boring parts — money, paperwork', 'Allow an imperfect version so the thing exists at all']
    },
    careers: {
      th: ['นักเขียน / กวี', 'Graphic Designer', 'ศิลปิน / นักดนตรี', 'Art Therapist', 'นักแปล', 'Content Creator สายสื่อสาร', 'นักสังคมสงเคราะห์'],
      en: ['Writer / poet', 'Graphic designer', 'Musician / artist', 'Art therapist', 'Librarian / knowledge curator', 'Social worker', 'Translator']
    },
    work: {
      th: 'ต้องการอิสระ บรรยากาศที่เป็นมิตร และงานที่มีความหมาย เกลียดสภาพแวดล้อมที่แก่งแย่งชิงดี',
      en: 'Needs autonomy, meaning, and a manager whose feedback is humane. A win-at-all-costs environment makes you go quiet and withdraw.'
    },
    love: {
      th: 'โรแมนติกและมองหาความรักที่เข้าใจจิตใจกันจริงๆ ระวังการเก็บความน้อยใจไว้คนเดียวจนระเบิด',
      en: 'You love romantically and seriously, looking for connection at depth. The risk is holding a grievance far too long to avoid inconveniencing anyone.'
    },
    stress: {
      th: 'เครียดแล้วจะโทษตัวเองและดิ่งง่าย ทางแก้คือเตือนตัวเองว่า “ความผิดพลาดไม่ได้แปลว่าเราไม่ดี” แล้ววาดรูปหรือฟังเพลงผ่อนคลาย',
      en: 'Stress pulls you into guilt and heavy self-criticism. The exit is separating "I made a mistake" from "I am the mistake".'
    },
    motto: { th: '“ยอมตามได้เกือบทุกเรื่อง — ยกเว้นเรื่องความจริงใจ”', en: '“I will bend on almost anything — except the thing that matters.”' },
    matches: ['ENFJ', 'ENTJ', 'ESFJ']
  },

  ENFJ: {
    code: 'ENFJ', spectrum: 'green', share: 5.90, img: 'ENFJ',
    name: { th: 'ผู้นำพลังบวก', en: 'The Beacon' },
    tagline: {
      th: 'อยากเห็นทุกคนเติบโต ดึงศักยภาพเพื่อนเก่งเบอร์หนึ่ง',
      en: 'Makes people believe it about themselves.'
    },
    blurb: {
      th: 'อบอุ่น มีพลัง และสร้างแรงบันดาลใจให้คนรอบตัวเสมอ',
      en: 'Warm, energising, and sees your potential before you do.'
    },
    overview: {
      th: 'ENFJ อ่านใจคนในกลุ่มขาด คอยเชื่อมทุกคนให้เข้ากันและมีไฟทำงาน แคร์ความรู้สึกคนอื่นมากจนบางครั้งลืมดูแลตัวเอง',
      en: 'ENFJs have a rare capability: making a group want to be a better version of itself. You read a room quickly and bring people together.'
    },
    strengths: {
      th: ['ปลุกพลังและสร้างแรงบันดาลใจให้ทีมได้ดีเยี่ยม', 'แก้ปัญหาความขัดแย้งและประสานใจคนเก่ง', 'สื่อสารได้อย่างชัดเจนและอบอุ่นในเวลาเดียวกัน', 'ทุ่มเทพัฒนาคนอื่นอย่างจริงใจ', 'จัดระเบียบกิจกรรมและงานกลุ่มได้ราบรื่น'],
      en: ['Inspires people into actual movement, not just good feelings', 'Reads group dynamics and works conflict through', 'Communicates clearly and warmly at the same time', 'Invests seriously in other people\'s growth', 'Organises people and work so both move together']
    },
    growth: {
      th: ['กล้าปฏิเสธคนอื่นโดยไม่ต้องรู้สึกผิด', 'คุณค่าของเราไม่ต้องรอให้ใครมาชม', 'ปล่อยให้คนอื่นได้ล้มและเรียนรู้เองบ้าง', 'บอกความต้องการของตัวเองออกมาตรงๆ'],
      en: ['Say no without guilt', 'Separate your worth from other people\'s approval', 'Let people fall sometimes — some lessons cannot be taught', 'State what you want, not only what the group wants']
    },
    careers: {
      th: ['HR Director / People Lead', 'โค้ชพัฒนาตัวเอง', 'ครู / วิทยากร', 'PR & Communications Lead', 'ผู้จัดการฝ่ายขาย', 'ผู้นำองค์กรเพื่อสังคม'],
      en: ['Head of people', 'Coach / development consultant', 'Teacher / school head', 'Sales manager', 'Public relations lead', 'Community organiser']
    },
    work: {
      th: 'ชอบทำงานเป็นทีม ได้ช่วยให้คนอื่นเติบโต ทนไม่ได้กับที่ทำงานที่มองคนเป็นแค่เครื่องจักร',
      en: 'Needs a team that takes people seriously and work measured in growth as well as numbers.'
    },
    love: {
      th: 'ดูแลแฟนอย่างดี จำรายละเอียดได้หมด ระวังอย่าเผลอไปจัดแจงชีวิตเขามากเกินไป และยอมให้เขาดูแลเรากลับบ้าง',
      en: 'You care for a partner in detail and remember all the small things. Watch for care sliding into control without noticing.'
    },
    stress: {
      th: 'เครียดแล้วจะยิ่งวิ่งวุ่นดูแลคนอื่นเพื่อหนีปัญหาตัวเอง ทางแก้คือหยุดพักแล้วถามตัวเองว่า “ตอนนี้เราต้องการอะไรจริงๆ”',
      en: 'Stress makes you care harder for others to avoid your own feeling. The exit is stopping to answer: what do I need right now?'
    },
    motto: { th: '“เธอทำได้แน่นอน — และฉันจะคอยเชียร์อยู่ข้างๆ”', en: '“You can do this — and I will stay until you can see it.”' },
    matches: ['INFP', 'INTP', 'ISFP']
  },

  ENFP: {
    code: 'ENFP', spectrum: 'green', share: 10.52, img: 'ENFP',
    name: { th: 'เจ้าลูกหมาพลังล้น', en: 'The Wildfire' },
    tagline: {
      th: 'ไฮเปอร์สุด พลังบวกเต็มเปี่ยม อยู่กับใครก็สร้างรอยยิ้ม',
      en: 'Lights up a room without meaning to.'
    },
    blurb: {
      th: 'พลังเยอะ อยากรู้อยากเห็น เฟรนด์ลี่เข้ากับทุกคนง่าย',
      en: 'High energy, curious about everything, a natural connector of people.'
    },
    overview: {
      th: 'ENFP คือแสงสว่างของกลุ่ม กระตือรือร้นกับสิ่งใหม่ๆ เกลียดความซ้ำซาก เข้าถึงง่าย มีเสน่ห์ แต่ต้องฝึกโฟกัสงานให้จบเป็นชิ้นๆ',
      en: 'ENFPs live on excitement — about possibility and about people. Your interest in someone is real, not polite, and people can feel it.'
    },
    strengths: {
      th: ['สร้างบรรยากาศสนุกสนานได้ทันทีที่เดินเข้าห้อง', 'คิดไอเดียสดใหม่และมองเห็นโอกาสตลอดเวลา', 'ทำให้คนแปลกหน้ารู้สึกสนิทใจได้ใน 5 นาที', 'ปรับตัวเก่ง กล้าลองอะไรใหม่ๆ จากศูนย์', 'พูดจูงใจให้คนอื่นคล้อยตามได้เก่ง'],
      en: ['Raises a group\'s energy the moment you walk in', 'Sees possibilities and links other people step over', 'Makes a stranger feel seen within minutes', 'Adapts fast and starts new things from nothing', 'Pitches an idea so people want to follow it']
    },
    growth: {
      th: ['ตามงานให้จบ แม้ตอนที่หมดความตื่นเต้นแล้ว', 'จัดตารางเวลาช่วยเตือนส่งงานให้ตรงเวลา', 'อย่าเพิ่งรีบรับปากทุกคนถ้าทำไม่ทัน', 'พักผ่อนก่อนที่แบตจะหมดแบบกะทันหัน'],
      en: ['Finish it, including the part that stopped being fun', 'Build the small systems that make you on time', 'Make fewer promises so you can actually keep them', 'Rest before the energy drops out all at once']
    },
    careers: {
      th: ['Creative / โฆษณา', 'Content Creator / บล็อกเกอร์', 'Event Producer', 'Brand Communicator', 'เจ้าของธุรกิจ', 'Community Manager', 'นักจัดกิจกรรม'],
      en: ['Creative / advertising', 'Community manager', 'Brand communications', 'Entrepreneur', 'Event producer', 'Journalist / content creator']
    },
    work: {
      th: 'ต้องการงานที่มีความหลากหลาย ได้เจอคน และมีอิสระในการคิด งานรูทีนซ้ำๆ ทุกวันจะทำให้เหี่ยวเฉาเร็วมาก',
      en: 'Needs variety, people to talk to, and freedom over method. Identical steps every day will visibly wilt you.'
    },
    love: {
      th: 'รักเต็มที่ แสดงออกชัดเจน โรแมนติก ระวังช่วงหมดโปรตื่นเต้นแล้วเผลอละเลยความสม่ำเสมอ',
      en: 'You love fully and show it plainly. Watch the pattern of chasing the exciting beginning and going missing when the relationship needs steadiness.'
    },
    stress: {
      th: 'เครียดแล้วจะคิดฟุ้งกระจายไปทุกเรื่องจนไม่เสร็จสักอย่าง ทางแก้คือลิสต์สิ่งที่ต้องทำ 3 อย่างลงกระดาษแล้วทำทีละข้อ',
      en: 'Stress scatters you across everything until nothing lands. The exit is cutting the list to three items on one page.'
    },
    motto: { th: '“โลกนี้มีเรื่องสนุกให้ทำเยอะเกินกว่าจะเลือกแค่อย่างเดียว”', en: '“There is far too much worth doing to pick only one.”' },
    matches: ['INTJ', 'INFJ', 'ISTJ']
  },

  /* ------------------------------------------------------ Blue Spectrum */

  ISTJ: {
    code: 'ISTJ', spectrum: 'blue', share: 9.35, img: 'ISTJ',
    name: { th: 'คนจริงจังเป๊ะระเบียบ', en: 'The Keeper' },
    tagline: {
      th: 'พูดจริงทำจริง มีวินัย อย่ามาผิดนัด',
      en: 'Said it would be done, so it is done.'
    },
    blurb: {
      th: 'แม่นยำ พึ่งพาได้ เป็นเสาหลักที่ทุกคนไว้ใจ',
      en: 'Precise, dependable, the beam everyone leans on without noticing.'
    },
    overview: {
      th: 'ISTJ คือนิยามของความรับผิดชอบ ทำตามที่พูดเสมอ ละเอียดรอบคอบ ไม่ชอบเรื่องดราม่า อยู่ด้วยแล้วรู้สึกมั่นคงปลอดภัย',
      en: 'ISTJs are dependability in human form. You remember who promised what, and you deliver on the days nobody is checking.'
    },
    strengths: {
      th: ['รักษาคำพูดและส่งงานตรงเวลาเสมอ', 'จับจุดผิดพลาดในดีเทลได้ก่อนงานพัง', 'วางระบบและระเบียบการทำงานที่ใช้ได้จริง', 'สุขุม มีเหตุผล ไม่ตื่นตระหนกง่าย', 'รับผิดชอบงานอย่างซื่อสัตย์แม้ไม่มีใครตรวจ'],
      en: ['Delivers what was promised, consistently', 'Catches the detail error before it becomes expensive', 'Builds standards and systems that survive years', 'Calm and reasoned while others panic', 'Keeps the responsibility even unobserved']
    },
    growth: {
      th: ['เปิดใจลองวิธีใหม่ๆ ก่อนรีบปฏิเสธ', 'ผ่อนปรนความเป๊ะกับตัวเองและคนอื่นบ้าง', 'พูดความรู้สึกออกมา ไม่ใช่ทำแต่งานเงียบๆ', 'ยอมรับความไม่แน่นอนในบางสถานการณ์'],
      en: ['Try the new method before ruling it out', 'Ease the standard you hold yourself to, occasionally', 'Say the feeling instead of only demonstrating it through work', 'Sit with ambiguity during a transition']
    },
    careers: {
      th: ['ผู้ตรวจสอบบัญชี (Auditor)', 'วิศวกรโครงสร้าง', 'Operations Manager', 'นักกฎหมาย / นิติกร', 'Compliance Officer', 'Supply Chain Manager', 'System Admin'],
      en: ['Auditor', 'Structural engineer', 'Operations manager', 'Lawyer / legal officer', 'Compliance officer', 'Supply chain manager', 'Financial analyst']
    },
    work: {
      th: 'ทำงานได้ดีสุดเมื่อมีขอบเขตชัดเจน กฎกติกาตรงไปตรงมา และไม่เปลี่ยนแผนกะทันหันบ่อยๆ',
      en: 'At your best with a clear scope, an agreed standard, and no changing the rules mid-game.'
    },
    love: {
      th: 'แสดงความรักด้วยความสม่ำเสมอ อยู่เคียงข้างเสมอ และดูแลเรื่องจริงจังให้เรียบร้อย อย่าลืมพูดคำหวานๆ บ้าง',
      en: 'You show love through consistency, turning up every time, and quietly handling the serious things. The practice is saying it too.'
    },
    stress: {
      th: 'เครียดแล้วจะยิ่งยึดกฎเป๊ะเกินไปและมองโลกแง่ลบ ทางแก้คือแยกสิ่งที่คุมได้กับคุมไม่ได้ออกจากกัน',
      en: 'Stress makes you grip the rules tighter, forecast worse, and speak less. The exit is putting controllable and uncontrollable in two columns.'
    },
    motto: { th: '“ถ้าคิดจะทำ ก็ทำให้ถูกต้องตั้งแต่แรก”', en: '“If it is worth doing, it is worth doing right the first time.”' },
    matches: ['ENFP', 'ESFP', 'ENTP']
  },

  ISFJ: {
    code: 'ISFJ', spectrum: 'blue', share: 9.28, img: 'ISFJ',
    name: { th: 'คนดูแลประจำกลุ่ม', en: 'The Nurturer' },
    tagline: {
      th: 'จำได้ทุกดีเทล หิวยัง? มีขนมมาฝาก',
      en: 'Remembers what you like, even though you never said.'
    },
    blurb: {
      th: 'ใจดี เทคแคร์เก่ง ใส่ใจความรู้สึกคนรอบข้างอย่างเงียบๆ',
      en: 'Genuinely kind, attentive to the details of people, caring without noise.'
    },
    overview: {
      th: 'ISFJ เป็นสายซัพพอร์ตตัวจริง จำเรื่องเล็กๆ น้อยๆ ของคนอื่นได้แม่น อดทนสูง ไม่ชอบอวดตัว แค่อยากให้ทุกคนรอบข้างมีความสุข',
      en: 'ISFJs care by noticing. You remember who is allergic to what, and who is saying they are fine while clearly not being fine — and you help before being asked.'
    },
    strengths: {
      th: ['ใส่ใจและจำรายละเอียดของเพื่อนได้แม่นยำ', 'อดทนสูง ทำงานละเอียดได้โดยไม่บ่น', 'สร้างความรู้สึกอบอุ่นและปลอดภัยให้ทุกคน', 'ทำงานเรียบร้อยสม่ำเสมอเสมอต้นเสมอปลาย', 'ประนีประนอมเก่งเพื่อความสงบสุข'],
      en: ['Remembers the human details and uses them thoughtfully', 'Patient — stays with long work without complaint', 'Makes the people nearby feel safe', 'Delivers detailed work consistently', 'Compromises without losing the core principle']
    },
    growth: {
      th: ['กล้าบอกความต้องการของตัวเองบ้าง', 'กล้าปฏิเสธคำขอที่เกินตัวโดยไม่ต้องรู้สึกผิด', 'รับคำชมจากคนอื่นอย่างภาคภูมิใจ', 'ปล่อยให้คนอื่นช่วยทำงานบ้าง'],
      en: ['State your need before you feel overlooked', 'Decline what is beyond capacity without guilt', 'Accept a compliment instead of deflecting it', 'Let someone else do it, differently']
    },
    careers: {
      th: ['พยาบาล / แพทย์', 'ครูอาจารย์', 'HR Officer', 'ผู้จัดการสำนักงาน', 'นักโภชนาการ', 'นักกายภาพบำบัด', 'Customer Success Lead'],
      en: ['Nurse / clinical staff', 'Primary teacher', 'HR officer', 'Dietitian', 'Office manager', 'Physiotherapist', 'Customer success coordinator']
    },
    work: {
      th: 'ชอบทีมที่ให้เกียรติกัน หน้าที่ชัดเจน และได้รับการยอมรับอย่างจริงใจ',
      en: 'Needs a decent team, a clear remit, and recognition that is actually said out loud.'
    },
    love: {
      th: 'ทุ่มเทดูแลในชีวิตประจำวันอย่างอบอุ่น ระวังอย่าให้จนหมดตัวแล้วแอบน้อยใจที่ไม่มีใครสังเกตเห็น',
      en: 'You love through small daily care and deep loyalty. Watch giving until empty and then storing the feeling of being unappreciated inside.'
    },
    stress: {
      th: 'เครียดแล้วจะเก็บไว้คนเดียวจนเหนื่อยสะสม ทางแก้คือเอ่ยปากขอให้คนอื่นช่วยตรงๆ 1 เรื่อง',
      en: 'Stress makes you carry it alone, hide the exhaustion, and quietly build resentment. The exit is asking for one specific piece of help.'
    },
    motto: { th: '“ไม่เป็นไร สบายมาก เดี๋ยวฉันช่วยดูให้เอง”', en: '“It is fine — I will take care of it.”' },
    matches: ['ESTP', 'ENTP', 'ESFP']
  },

  ESTJ: {
    code: 'ESTJ', spectrum: 'blue', share: 9.16, img: 'ESTJ',
    name: { th: 'ผู้จัดระเบียบสายลุย', en: 'The Marshal' },
    tagline: {
      th: 'งานใคร ถึงไหนแล้ว ขอคำตอบเดี๋ยวนี้',
      en: 'Clarity is a form of kindness.'
    },
    blurb: {
      th: 'จัดการเรื่องวุ่นวายให้เข้าที่ได้เร็วที่สุด ตรงไปตรงมา',
      en: 'Turns a chaotic situation into order faster than anyone in the room.'
    },
    overview: {
      th: 'ESTJ เกลียดความไม่เป็นระเบียบ แบ่งงานเก่ง คุมงานเป๊ะ ตัดสินใจเด็ดขาด ยุติธรรม ทำงานด้วยแล้วสบายใจเพราะทุกอย่างชัดเจน',
      en: 'ESTJs cannot leave disorder alone. You are excellent at converting a goal into a schedule, a set of duties, and a named owner for each.'
    },
    strengths: {
      th: ['จัดระเบียบงานยุ่งๆ ให้เดินหน้าได้ทันที', 'ตัดสินใจเด็ดขาดและกล้ารับผิดชอบผลลัพธ์', 'สั่งงานชัดเจน ไม่มีใครต้องนั่งเดา', 'ผลักดันงานให้เสร็จตามกำหนดได้ชัวร์', 'ยุติธรรม ยึดมาตรฐานเดียวกันกับทุกคน'],
      en: ['Structures chaos into something that moves immediately', 'Decides firmly and owns the consequence', 'States expectations so plainly nobody has to guess', 'Actually gets things delivered on the date', 'Fair — applies one standard to everyone']
    },
    growth: {
      th: ['ฟังเหตุผลของทีมให้จบก่อนตัดสินใจ', 'ใจเย็นกับเรื่องอารมณ์และความรู้สึกคน', 'ยืดหยุ่นบ้างเมื่อวิธีเดิมเริ่มไม่ตอบโจทย์', 'เอ่ยปากชมคนในทีมให้บ่อยขึ้น'],
      en: ['Ask before concluding, even when certain', 'Listen to a case that is not yet fully evidenced', 'Give the emotional side the time you give the numbers', 'Flex when the old method no longer fits', 'Praise as often as you correct']
    },
    careers: {
      th: ['Operations Director', 'Project Manager', 'ผู้จัดการทั่วไป', 'Sales Director', 'ผู้บริหารโรงงาน', 'ผู้ตรวจสอบภายใน', 'ผู้จัดการสาขา'],
      en: ['General manager', 'Operations director', 'Construction project manager', 'Sales director', 'Plant manager', 'Internal auditor']
    },
    work: {
      th: 'ต้องการโครงสร้างชัดเจน บทบาทชัดเจน และทีมงานที่รับผิดชอบคำพูด ทนไม่ได้กับความเหลาะแหละ',
      en: 'Needs clear structure, decision rights, and a team that does what was agreed. Other people\'s unaccountability is what angers you most.'
    },
    love: {
      th: 'ดูแลครอบครัวและคนรักให้มั่นคง มีแพลนอนาคตชัดเจน ควรฝึกรับฟังความรู้สึกของอีกฝ่ายโดยไม่ต้องรีบแก้ปัญหา',
      en: 'You show love by making the shared life stable, planned, and lacking nothing. The practice is asking how they feel and listening to the end.'
    },
    stress: {
      th: 'เครียดแล้วจะเริ่มสั่งการเยอะขึ้นและพูดเสียงดัง ทางแก้คือถอยมา 1 ก้าว แล้วโฟกัสที่ตัวปัญหา ไม่ใช่หาคนผิด',
      en: 'Stress makes you control more, move faster, and speak harder than intended. The exit is one step back and the question: what is the actual problem.'
    },
    motto: { th: '“งานนี้ใครรับผิดชอบ และกำหนดส่งเมื่อไหร่?”', en: '“Who owns this, and by when?”' },
    matches: ['INTP', 'ISFP', 'INFP']
  },

  ESFJ: {
    code: 'ESFJ', spectrum: 'blue', share: 9.75, img: 'ESFJ',
    name: { th: 'พี่สาวคนสวยสายซัพพอร์ต', en: 'The Host' },
    tagline: {
      th: 'จัดตี้เก่ง คอยดูแลทุกคน ไม่ให้มีใครเหงา',
      en: 'Nobody gets forgotten in your room.'
    },
    blurb: {
      th: 'อบอุ่น เข้าสังคมเก่ง ทำให้กลุ่มอบอุ่นและสนิทกันเร็ว',
      en: 'Warm, socially fluent, turns a set of people into an actual group.'
    },
    overview: {
      th: 'ESFJ มีสกิลเข้าสังคมสูงมาก คอยสังเกตว่าใครต้องการอะไร ใส่ใจทุกคนในกลุ่มอย่างจริงใจ รักษาความสัมพันธ์ได้ยอดเยี่ยม',
      en: 'ESFJs are the reason groups hold together. You know who has not spoken to whom and who is sitting alone, and you fix it without making anyone lose face.'
    },
    strengths: {
      th: ['ทำให้ทุกคนรู้สึกเป็นกันเองและเข้ากับกลุ่มได้ไว', 'ประสานงานกับคนหลายฝ่ายได้อย่างราบรื่น', 'ใส่ใจทุกดีเทลที่ทำให้คนรอบตัวแฮปปี้', 'ไว้ใจได้ รักษาคำพูดเสมอ', 'อ่านบรรยากาศและปรับตัวเข้าหาคนเก่งมาก'],
      en: ['Makes people feel included, fast', 'Excellent at work requiring many parties to coordinate', 'Attends to the details that make someone\'s experience better', 'Reliable — keeps their word', 'Reads the atmosphere and adjusts quickly']
    },
    growth: {
      th: ['แคร์ความรู้สึกตัวเองให้เท่ากับที่แคร์คนอื่น', 'อย่ากังวลกับคำพูดหรือสายตาคนอื่นบนโซเชียลเกินไป', 'กล้าพูดความจริงที่จำเป็นแม้คนฟังจะไม่ชอบ', 'ปล่อยวางความสัมพันธ์ที่ไม่ดีต่อใจ'],
      en: ['Weigh your own needs as heavily as everyone else\'s', 'Tolerate someone\'s displeasure when the decision was right', 'Watch measuring yourself against others online', 'Say the unwelcome truth when it is needed']
    },
    careers: {
      th: ['Event Manager', 'PR & Client Relations', 'HR & Recruiter', 'พยาบาล / ผู้ประสานงานการแพทย์', 'ครูอาจารย์', 'ผู้จัดการโรงแรม'],
      en: ['Client relationship manager', 'Registered nurse', 'Teacher', 'Event manager', 'Recruiter', 'Hotel manager', 'Community programme coordinator']
    },
    work: {
      th: 'ชอบทำงานร่วมกับคน บรรยากาศเป็นมิตร ได้เห็นผลกระทบที่ดีต่อคนจริงๆ การนั่งทำงานคนเดียวนานๆ จะเหงาและหมดไฟ',
      en: 'Needs a warm team, a clear role, and visible human impact. Long stretches working alone will drain you.'
    },
    love: {
      th: 'ทุ่มเทความรักให้เต็มร้อย อย่าเอาคุณค่าตัวเองไปผูกกับความพอใจของอีกฝ่ายจนยอมเสียความเป็นตัวเอง',
      en: 'You commit hard and take the relationship seriously. Watch measuring your worth by whether your partner is pleased.'
    },
    stress: {
      th: 'เครียดแล้วจะนอยด์ง่ายและต้องการการยืนยัน ทางแก้คือคุยกับเพื่อนสนิทที่ไว้ใจได้ตรงๆ แทนที่จะนั่งเดาใจคนอื่น',
      en: 'Stress makes you sensitive to criticism and hungry for reassurance. The exit is asking someone you trust directly.'
    },
    motto: { th: '“มานั่งกินข้าวด้วยกันสิ เดี๋ยวฉันดูแลเอง”', en: '“Come and eat with us — I have already arranged it.”' },
    matches: ['ISFP', 'ISTP', 'INFP']
  },

  /* ----------------------------------------------------- Amber Spectrum */

  ISTP: {
    code: 'ISTP', spectrum: 'amber', share: 3.19, img: 'ISTP',
    name: { th: 'ช่างสายเงียบ', en: 'The Tinkerer' },
    tagline: {
      th: 'อย่าพูดเยอะ ขอลงมือทำเลย แก้ปัญหาเฉพาะหน้าเก่งสุด',
      en: 'Do not explain it — let me try it.'
    },
    blurb: {
      th: 'มือไว หัวเย็น แก้ปัญหาเฉพาะหน้าเก่งมากในสถานการณ์คับขัน',
      en: 'Capable hands, cool head, best in the room the moment something breaks.'
    },
    overview: {
      th: 'ISTP พูดน้อยแต่ทำจริง เรียนรู้จากการลงมือทำ ไม่ตกใจกับเรื่องฉุกเฉิน รักอิสระ ไม่ชอบให้ใครมาตีกรอบหรือสั่งจุกจิก',
      en: 'ISTPs learn with their hands. You understand something once you have opened it. In an emergency you are usually the calmest and most useful person present.'
    },
    strengths: {
      th: ['แก้ปัญหาเฉพาะหน้าได้เร็วและใช้งานได้จริง', 'สุขุม นิ่งมากเวลาเกิดเรื่องฉุกเฉิน', 'เข้าใจกลไกและระบบเครื่องมือต่างๆ ได้ลึกซึ้ง', 'ตรงไปตรงมา ไม่อ้อมค้อม ไม่ดราม่า', 'ปรับตัวตามสถานการณ์ได้ทันที'],
      en: ['Fixes the immediate problem fast, in a way that works', 'Extremely calm under pressure', 'Deep grasp of mechanisms and physical systems', 'No drama, direct, economical with words', 'Adjusts the moment the plan changes']
    },
    growth: {
      th: ['บอกสิ่งที่คิดให้คนอื่นรู้บ้าง ไม่ใช่ทำเงียบๆ คนเดียว', 'วางแผนระยะยาวไว้บ้างแม้จะรู้สึกว่ายังไม่ถึงเวลา', 'อดทนกับบทสนทนาเรื่องความรู้สึก', 'รักษาคำสัญญาแม้จะเริ่มเบื่อแล้ว'],
      en: ['Say what you are thinking instead of only doing it silently', 'Plan long-term even when it feels unnecessary', 'Stay in an emotional conversation instead of walking out', 'Honour the commitment after the interest fades']
    },
    careers: {
      th: ['Mechanical Engineer', 'Software Developer', 'Cybersecurity Specialist', 'นักบิน / ช่างเครื่องยนต์', 'แพทย์ฉุกเฉิน / กู้ภัย', 'ช่างภาพ / ช่างวิดีโอ', 'นักกีฬาอาชีพ'],
      en: ['Mechanical engineer / technician', 'Pilot / aircraft engineer', 'Cybersecurity specialist', 'Emergency medic', 'Photographer / videographer', 'Software developer']
    },
    work: {
      th: 'ต้องการงานที่มีปัญหาจริงให้แก้ มีอิสระ และการประชุมน้อยที่สุดเท่าที่จะทำได้',
      en: 'Needs real problems to solve, freedom over method, and the fewest meetings physically possible.'
    },
    love: {
      th: 'แสดงความรักด้วยการคอยซ่อมของให้ ขับรถไปรับ และอยู่ตรงนั้นเสมอ ควรใช้คำพูดบอกความรู้สึกบ้างเพื่อความสบายใจของคนรัก',
      en: 'You show love by fixing the thing, driving over, and being there when needed. The practice is using words too.'
    },
    stress: {
      th: 'เครียดแล้วจะหายตัวไปเงียบๆ และตัดการติดต่อ ทางแก้คือบอกแฟนหรือเพื่อนล่วงหน้าว่าขอเวลาส่วนตัวสักพัก',
      en: 'Stress makes you go quiet and cut communication. The exit is saying how long you need, instead of simply disappearing.'
    },
    motto: { th: '“เดี๋ยวฉันลองดูเอง แป๊บเดียวเสร็จ”', en: '“Let me have a look at it.”' },
    matches: ['ESFJ', 'ENFJ', 'ESTJ']
  },

  ISFP: {
    code: 'ISFP', spectrum: 'amber', share: 4.84, img: 'ISFP',
    name: { th: 'ศิลปินตามฟีล', en: 'The Aesthete' },
    tagline: {
      th: 'รักอิสระ อยู่เงียบๆ สร้างสรรค์งานตามใจชอบ',
      en: 'Says little, feels everything.'
    },
    blurb: {
      th: 'ละเอียดอ่อน มีรสนิยม รักอิสระมากกว่าที่ใครคิด',
      en: 'Sensitive, tasteful, and far more independent than they appear.'
    },
    overview: {
      th: 'ISFP สัมผัสโลกด้วยความรู้สึกและสายตาทางศิลปะ อ่อนโยน ไม่ชอบการแข่งขัน เอาจริงเอาจังกับสิ่งที่รักและจริงใจกับตัวเองเสมอ',
      en: 'ISFPs take the world in through the senses and through feeling. You see beauty in what other people walk past, and you sense insincerity quickly.'
    },
    strengths: {
      th: ['สายตาด้านความงามและดีเทลเฉียบคมมาก', 'เข้าใจความรู้สึกคนอื่นได้โดยไม่ต้องอธิบาย', 'อยู่กับปัจจุบันและอินกับช่วงเวลาดีๆ ได้เต็มที่', 'เปิดกว้าง ไม่ตัดสินคนอื่นง่ายๆ', 'ซื่อสัตย์กับสไตล์และตัวตนของตัวเอง'],
      en: ['A precise eye for beauty and detail', 'Understands what someone feels without explanation', 'Fully present — actually experiences the moment', 'Flexible and slow to judge', 'Honest with itself even when that means standing alone']
    },
    growth: {
      th: ['กล้าบอกสิ่งที่ตัวเองต้องการก่อนจะสายไป', 'วางแผนการเงินและอนาคตให้เป็นระบบขึ้น', 'แยกคำวิจารณ์งานออกจากตัวเรา', 'เคลียร์ใจเวลาเกิดปัญหา ไม่หนีความขัดแย้ง', 'ทำงานให้เสร็จตามนัดแม้จะหมดฟีลแล้ว'],
      en: ['Say what you want before it is too late', 'Plan long-term and systematise money', 'Separate criticism of the work from criticism of you', 'Stop avoiding the conflict that has to happen', 'Finish it even when the mood is gone']
    },
    careers: {
      th: ['Designer / Interior', 'ช่างภาพ / สไตลิสต์', 'เชฟ / Pastry Chef', 'นักดนตรี / ศิลปิน', 'ครูสอนโยคะ / กายภาพบำบัด', 'สัตวแพทย์ / ดูแลสัตว์', 'ช่างคราฟต์'],
      en: ['Designer / interiors', 'Photographer', 'Chef / pastry chef', 'Musician', 'Physiotherapist / yoga teacher', 'Vet / animal care', 'Craftsperson', 'Stylist']
    },
    work: {
      th: 'ต้องการอิสระ บรรยากาศสวยงาม และไม่มีคนมาคอยจับผิดทุกขั้นตอน',
      en: 'Needs autonomy, some beauty in the work, and nobody watching every step. Rigid bureaucracy will make you go quiet.'
    },
    love: {
      th: 'แสดงความรักด้วยการอยู่เคียงข้างและใส่ใจเรื่องเล็กๆ ควรฝึกพูดสิ่งที่อึดอัดใจตั้งแต่ตอนที่ปัญหายังเล็ก',
      en: 'You love through presence and small attentions. The practice is raising a grievance while it is still small.'
    },
    stress: {
      th: 'เครียดแล้วจะปลีกตัวไปอยู่คนเดียวและแอบคิดมาก ทางแก้คือทำงานฝีมือ วาดรูป หรือออกไปเดินเล่นธรรมชาติ',
      en: 'Stress makes you withdraw and criticise yourself in private. The exit is something physical and hands-on that returns you to the present.'
    },
    motto: { th: '“ฉันขอทำในแบบที่เป็นตัวเองดีที่สุด”', en: '“I would rather do it my own way.”' },
    matches: ['ENFJ', 'ESFJ', 'ESTJ']
  },

  ESTP: {
    code: 'ESTP', spectrum: 'amber', share: 3.08, img: 'ESTP',
    name: { th: 'สายลุยไม่คุยเยอะ', en: 'The Maverick' },
    tagline: {
      th: 'ลุยก่อน ค่อยแก้ตอนวิ่ง ชีวิตมีไว้ท้าทาย',
      en: 'Move first, correct while running.'
    },
    blurb: {
      th: 'กล้าได้กล้าเสีย ไหวพริบดี อ่านสถานการณ์จริงขาด',
      en: 'Bold, quick, better at reading a live situation than a report.'
    },
    overview: {
      th: 'ESTP ปรับตัวไวและตัดสินใจเร็วมาก ชอบความตื่นเต้นและแอ็กชัน ไม่กลัวความเสี่ยง ช่างเจรจา แก้ปัญหาเฉพาะหน้าได้ทันควัน',
      en: 'ESTPs decide from what is in front of them and act at once. You read people and situations fast, find the opening inside chaos.'
    },
    strengths: {
      th: ['ตัดสินใจและลงมือทำได้ไวในสถานการณ์จริง', 'เจรจาต่อรองและอ่านคนได้อย่างแม่นยำ', 'มีสติ นิ่ง และแก้ปัญหาได้ดีในวิกฤต', 'เรียนรู้จากการลุยจริงได้เร็วกว่าอ่านทฤษฎี', 'กล้าได้กล้าเสีย ไม่กลัวความท้าทาย'],
      en: ['Decides and acts fast in live conditions', 'Strong negotiator and people-reader', 'Calm and useful in a crisis', 'Learns from doing far faster than from theory', 'Takes the risk where others stall']
    },
    growth: {
      th: ['คิดถึงผลกระทบระยะยาวก่อนตัดสินใจเรื่องใหญ่', 'ฟังคนอื่นพูดให้จบก่อนเสนอทางออก', 'จัดการงานเอกสารที่จำเป็นให้ครบ', 'ระวังคำพูดตรงที่อาจแทงใจคนฟัง'],
      en: ['Weigh the long-term before a big call', 'Let them finish before you offer the solution', 'Complete the boring but necessary work', 'Watch how much your directness lands on people']
    },
    careers: {
      th: ['ผู้บริหารฝ่ายขาย', 'ผู้ประกอบการ / Trader', 'นักเจรจาต่อรอง / Broker', 'Site Manager', 'นักกีฬาอาชีพ / โค้ช', 'นักวางแผนธุรกิจสายลุย'],
      en: ['Sales director', 'Entrepreneur', 'Negotiator / broker', 'Firefighter / rescue', 'Trader', 'Site manager', 'Professional athlete']
    },
    work: {
      th: 'ต้องการงานที่มีความเคลื่อนไหว เห็นผลลัพธ์ไว และวัดกันที่ผลงานจริง ไม่ใช่วัดที่พิธีรีตอง',
      en: 'Needs fast feedback, movement, and measurement by outcome rather than process.'
    },
    love: {
      th: 'ทำให้ความรักสนุก มีชีวิตชีวา และไม่น่าเบื่อ ควรฝึกความสม่ำเสมอและความใส่ใจในวันที่เรียบง่าย',
      en: 'You are fun and keep a relationship alive. The practice is depth and continuity — excitement alone does not hold anything together.'
    },
    stress: {
      th: 'เครียดแล้วจะหาทางระบายด้วยกิจกรรมเสี่ยงๆ หรือช้อปปิ้ง ทางแก้คือหยุดหายใจลึกๆ แล้วโฟกัสแก้ปัญหาจริงทีละข้อ',
      en: 'Stress pushes you into risk or immediate distraction. The exit is stopping to name the one real problem before moving.'
    },
    motto: { th: '“พูดเยอะเสียเวลา ไปลุยกันเลยดีกว่า!”', en: '“Enough talking — let us go.”' },
    matches: ['ISFJ', 'INFJ', 'ISTJ']
  },

  ESFP: {
    code: 'ESFP', spectrum: 'amber', share: 5.47, img: 'ESFP',
    name: { th: 'ดาวเด่นประจำตี้', en: 'The Spotlight' },
    tagline: {
      th: 'ที่ไหนมีเสียงหัวเราะ ที่นั่นมีฉัน เอนเตอร์เทนเบอร์หนึ่ง',
      en: 'Turns an ordinary day into one people remember.'
    },
    blurb: {
      th: 'สนุกสนาน อบอุ่น มีชีวิตชีวา ใครอยู่ใกล้ก็มีความสุข',
      en: 'Fun, warm, and alive in a way that makes people want to be near.'
    },
    overview: {
      th: 'ESFP อยู่กับปัจจุบันอย่างเต็มที่ เอนเตอร์เทนเนอร์ธรรมชาติ ดึงคนเข้ามาร่วมสนุกได้เก่งมาก อบอุ่น จริงใจ และสร้างบรรยากาศดีๆ เสมอ',
      en: 'ESFPs are more fully present than almost anyone. You notice the person standing awkwardly at the edge and bring them in immediately. Your warmth is not performance.'
    },
    strengths: {
      th: ['ทำให้คนรอบข้างหัวเราะและสนุกสนานได้ทันที', 'อ่านอารมณ์คนไว ปรับมู้ดได้เก่งมาก', 'ปรับตัวเก่ง กล้าลองสิ่งใหม่ๆ ตลอดเวลา', 'ใจกว้าง ชอบช่วยเหลือเพื่อนโดยไม่คิดเล็กคิดน้อย', 'ทำงานที่ต้องใช้พลังกับคนได้อย่างยอดเยี่ยม'],
      en: ['Puts people at ease and makes it fun, quickly', 'Reads mood fast and responds well', 'Adapts easily and will try the new thing', 'Generous — helps without overthinking it', 'Excellent in work that runs on energy with people']
    },
    growth: {
      th: ['วางแผนการเงินและอนาคตไว้ล่วงหน้า', 'เผชิญหน้ากับความรู้สึกแย่ๆ โดยไม่วิ่งหนีไปปาร์ตี้', 'ฝึกความอดทนกับงานที่ต้องใช้เวลานาน', 'อย่าตามใจคนอื่นจนตัวเองลำบาก', 'แบ่งเวลาพักผ่อนเงียบๆ ให้ตัวเองบ้าง'],
      en: ['Systematise money and the future', 'Stay with the hard feeling instead of running', 'Finish the work that requires long patience', 'Watch conceding just to keep the mood pleasant', 'Build some quiet time for yourself']
    },
    careers: {
      th: ['นักแสดง / พิธีกร', 'Creator / Influencer', 'Event Manager', 'Sales & PR Specialist', 'Fitness Coach', 'ผู้จัดการร้านอาหาร / ผับ'],
      en: ['Performer / presenter', 'Event manager', 'Personal trainer / coach', 'Sales and client relations', 'Early-years teacher', 'Creator / influencer']
    },
    work: {
      th: 'ต้องการงานที่ได้พบปะผู้คน มีความสนุก และเห็นผลตอบรับทันที การนั่งทำงานเงียบๆ คนเดียวจะทำให้หมดไฟเร็ว',
      en: 'Needs people, movement, and immediate visible results. Months of quiet solo work will burn you out.'
    },
    love: {
      th: 'รักใครแล้วแสดงออกเต็มที่ อบอุ่นและโรแมนติก ควรฝึกคุยเรื่องซีเรียสตรงๆ แทนที่จะหลีกเลี่ยงหรือทำเป็นเล่นทุกครั้ง',
      en: 'You love warmly and expressively. The practice is having the hard conversation directly, rather than lightening the mood every time.'
    },
    stress: {
      th: 'เครียดแล้วจะหนีไปปาร์ตี้หรือหาอะไรทำแก้เหงา ทางแก้คือยอมรับความรู้สึกเศร้าแล้วคุยกับคนที่ไว้ใจอย่างจริงจัง',
      en: 'Stress sends you toward distraction or company to cover the feeling. The exit is letting yourself feel it through once.'
    },
    motto: { th: '“ชีวิตมีครั้งเดียว ใช้ให้คุ้มและสนุกไปเลย!”', en: '“You only get the one life — make it good.”' },
    matches: ['ISTJ', 'ISFJ', 'INTJ']
  }
};

/* ------------------------------------------------- The 4 Variant Layers */

const VARIANTS = {
  AH: {
    key: 'AH', letters: ['A', 'H'],
    name: { th: 'มั่นใจ & เข้ากับคนง่าย', en: 'Confident Connector' },
    tagline: {
      th: 'ข้างในนิ่งมั่นใจ ข้างนอกเฟรนด์ลี่อบอุ่น',
      en: 'Steady inside, warm outside.'
    },
    desc: {
      th: 'มั่นใจในตัวเอง ไม่ต้องแข่งกับใครเพื่อพิสูจน์ตัวตน แคร์คนรอบข้างและทำให้ทุกคนรู้สึกปลอดภัย ล้มแล้วลุกไว เข้ากับเพื่อนๆ ได้สบายใจ',
      en: 'Confident enough not to need to win, invested enough in the group to make people around you feel safe. This is the combination people come to when they want someone both steady and understanding.'
    },
    identity: {
      th: 'มูฟออนไว ไม่เก็บคำวิจารณ์มาคิดวนซ้ำ แยกแยะฟีดแบ็กที่มีประโยชน์ได้ดี',
      en: 'Criticism does not shake you easily. You can tell useful feedback apart from the speaker\'s mood.'
    },
    relating: {
      th: 'อ่านมู้ดห้องเก่ง ปรับตัวให้ทุกคนแฮปปี้โดยไม่สูญเสียจุดยืนของตัวเอง',
      en: 'You read the room and choose to adapt for smoothness without abandoning your own position.'
    },
    watch: {
      th: 'ระวังเป็นที่พึ่งให้คนอื่นจนลืมดูแลใจตัวเอง',
      en: 'Watch becoming everyone\'s support until nobody asks how you are.'
    }
  },
  AC: {
    key: 'AC', letters: ['A', 'C'],
    name: { th: 'นิ่งสงบ & ชิลจริง', en: 'Steady Anchor' },
    tagline: {
      th: 'ไม่หวั่นไหวง่าย ไม่ต้องรอให้ใครมาการันตี',
      en: 'Unshaken, and not waiting for anyone to confirm it.'
    },
    desc: {
      th: 'นิ่งและสุขุมที่สุดใน 64 แบบ ความมั่นใจมาจากข้างใน ไม่ผูกติดกับคำชมใคร โลกแตกก็ยังคุมสติได้ เป็นที่พึ่งสำคัญในวิกฤต',
      en: 'This is the steadiest of the sixty-four. Your confidence is not tied to outcomes and your mood is not tied to the room\'s. This is the person others look to in a crisis.'
    },
    identity: {
      th: 'ล้มแล้วลุกไวมาก ไม่เก็บความผิดพลาดมานอนคิดมากตอนกลางคืน',
      en: 'You recover fast and do not replay mistakes at night.'
    },
    relating: {
      th: 'รักษาสเปซและความสงบของตัวเองได้ดี ไม่เอาดราม่าคนอื่นมาปนใจ',
      en: 'You hold your own equilibrium regardless of the people around you, and sit comfortably with disagreement.'
    },
    watch: {
      th: 'ระวังคนอื่นเข้าใจผิดว่าเย็นชา อย่าลืมส่งสัญญาณแสดงความใส่ใจบ้าง',
      en: 'People may need more reassurance from you than you think is necessary.'
    }
  },
  OH: {
    key: 'OH', letters: ['O', 'H'],
    name: { th: 'เซนส์ไว & แคร์ทุกคน', en: 'Sensitive Empath' },
    tagline: {
      th: 'รู้สึกลึก ซึมซับอารมณ์คนรอบข้างได้ไว',
      en: 'Feels deeply, and feels along with everyone else.'
    },
    desc: {
      th: 'เซนส์ไวที่สุดใน 64 แบบ รู้ทันทีว่าใครกำลังไม่โอเค ใส่ใจงานและคนรอบตัวมาก ทำให้งานออกมาละเอียดเนี๊ยบ แต่อาจเหนื่อยใจง่าย',
      en: 'The most sensitive of the sixty-four — to your own feeling and to everyone else\'s. You catch that someone is struggling before they say it. The cost is tiring quickly.'
    },
    identity: {
      th: 'แคร์ผลงานและคำวิจารณ์มาก เป็นแรงผลักดันให้พัฒนาตัวเองตลอดเวลา',
      en: 'Criticism stays with you and confidence tracks performance — which is also why your work is finer than average.'
    },
    relating: {
      th: 'รับอารมณ์ของห้องเข้ามาโดยอัตโนมัติ ชอบปรับตัวเพื่อไม่ให้ใครต้องลำบากใจ',
      en: 'You absorb the room automatically and tend to adjust so nobody is inconvenienced.'
    },
    watch: {
      th: 'ฝึกแยกให้ออกว่าอารมณ์ไหนเป็นของเรา อารมณ์ไหนเรารับมาจากคนอื่น',
      en: 'Practise telling which feeling is yours and which you simply picked up.'
    }
  },
  OC: {
    key: 'OC', letters: ['O', 'C'],
    name: { th: 'ข้างนอกนิ่ง ข้างในคิดวน', en: 'Restless Observer' },
    tagline: {
      th: 'ภายนอกดูชิล แต่ในหัวตรวจงานตัวเองไม่หยุด',
      en: 'Still on the outside; never stops auditing itself inside.'
    },
    desc: {
      th: 'ข้างนอกดูนิ่งและคุมสถานการณ์ได้ แต่ข้างในตรวจเช็กตัวเองตลอดเวลา มาตรฐานสูงเงียบๆ ทำงานออกมาดีมากแต่แอบเหนื่อยคนเดียว',
      en: 'Calm and controlled on the outside; internally auditing yourself without pause. This is the highest private standard of the sixty-four. The result is very good work, and a fatigue nobody else sees.'
    },
    identity: {
      th: 'เก็บความผิดพลาดมาคิดทบทวนเงียบๆ เพื่อปรับปรุงให้เป๊ะขึ้นในครั้งต่อไป',
      en: 'You hold on to mistakes, but privately, without showing it.'
    },
    relating: {
      th: 'มีโลกส่วนตัวสูง ไม่ชอบอธิบายตัวเองให้ใครฟังถ้าไม่จำเป็น',
      en: 'You do not tie your mood to the group, and feel no need to explain yourself.'
    },
    watch: {
      th: 'อย่าแบกทุกอย่างไว้คนเดียวจนหมดแรง กล้าเอ่ยปากขอความช่วยเหลือบ้าง',
      en: 'Telling nobody what you are carrying means nobody can help in time.'
    }
  }
};

/* --------------------------------------------------------------- Exports */


/* ------------------------------------------------- 64 Distinct Personality Shades */

const SHADES_64 = {
  "INTJ-AH": {
    "code": "INTJ-AH",
    "base": "INTJ",
    "modifier": "AH",
    "title": {
      "th": "ผู้นำยุทธศาสตร์ประสานพลัง",
      "en": "Strategic Catalyst"
    },
    "shadeLabel": {
      "th": "มั่นใจ & เชื่อมโยงทีม",
      "en": "Confident & Collaborative"
    },
    "tagline": {
      "th": "มองเห็นอนาคตชัดเจน พร้อมสื่อสารและขับเคลื่อนทุกคนไปสู่เป้าหมาย",
      "en": "Clear long-term vision, articulate and proactive in rallying teams."
    },
    "desc": {
      "th": "เป็น INTJ ที่เปิดกว้างและสื่อสารเก่ง กล้าผลักดันวิสัยทัศน์ใหญ่พร้อมรับฟังข้อเสนอแนะ นำทีมด้วยเป้าหมายที่ชัดเจน",
      "en": "An assertive INTJ with great relational finesse, translating grand strategies into team alignment."
    },
    "strengths": {
      "th": [
        "วิสัยทัศน์เฉียบคม",
        "สื่อสารกลยุทธ์ชัดเจน",
        "ตัดสินใจเด็ดขาด",
        "นำทีมสู่เป้าหมายใหญ่"
      ],
      "en": [
        "Strategic foresight",
        "Articulate communication",
        "Decisive execution",
        "Team alignment"
      ]
    },
    "growth": {
      "th": "ระวังเดินหน้าเร็วเกินไปจนทีมตามไม่ทัน ควรเผื่อเวลาอธิบายรายละเอียด",
      "en": "Watch out for outpacing the team; allow buffer time for detailed onboarding."
    }
  },
  "INTJ-AC": {
    "code": "INTJ-AC",
    "base": "INTJ",
    "modifier": "AC",
    "title": {
      "th": "มาสเตอร์มายด์สันโดษ",
      "en": "Autonomous Mastermind"
    },
    "shadeLabel": {
      "th": "นิ่งสงบ & ลุยเดี่ยว",
      "en": "Steady & Independent"
    },
    "tagline": {
      "th": "วางระบบระยะยาวแบบไร้จุดบกพร่อง ไม่หวั่นไหวต่อแรงกดดันภายนอก",
      "en": "Architects flawless complex systems without needing external validation."
    },
    "desc": {
      "th": "เป็น INTJ ที่นิ่งที่สุด สมาธิสูงมาก โฟกัสการสร้างโครงสร้างและโมเดลที่สมบูรณ์แบบ ทำงานเดี่ยวได้ทรงพลัง",
      "en": "Hyper-focused on pure strategic execution, impervious to emotional noise and social friction."
    },
    "strengths": {
      "th": [
        "วางระบบไร้ช่องโหว่",
        "สมาธิแน่วแน่สูงมาก",
        "ไม่หวั่นไหวต่อแรงกดดัน",
        "พึ่งพาตัวเอง 100%"
      ],
      "en": [
        "Flawless system design",
        "Unwavering focus",
        "High stress resilience",
        "Total self-reliance"
      ]
    },
    "growth": {
      "th": "ระวังตัดขาดจากทีมจนเกินไป ควรส่งสัญญาณความคืบหน้าให้คนอื่นทราบบ้าง",
      "en": "Avoid complete isolation; periodically sync progress with key stakeholders."
    }
  },
  "INTJ-OH": {
    "code": "INTJ-OH",
    "base": "INTJ",
    "modifier": "OH",
    "title": {
      "th": "นักวางแผนผู้มีวิสัยทัศน์เพื่อผู้คน",
      "en": "Empathetic Visionary"
    },
    "shadeLabel": {
      "th": "เซนส์ไว & แคร์ส่วนรวม",
      "en": "Sensitive & Human-Centric"
    },
    "tagline": {
      "th": "วางแผนเพื่อประโยชน์ของทุกคน สัมผัสถึงความต้องการที่ซ่อนอยู่ของคนรอบข้าง",
      "en": "Strategic foresight tuned with deep social intuition and impact."
    },
    "desc": {
      "th": "ผสมผสานความคิดเชิงกลยุทธ์เข้ากับความใส่ใจผู้คน วางแผนละเอียดรอบคอบเพื่อไม่ให้ใครถูกทิ้งไว้ข้างหลัง",
      "en": "Balances ruthless foresight with profound empathy, auditing plans for their human impact."
    },
    "strengths": {
      "th": [
        "วางแผนเห็นอกเห็นใจคน",
        "อ่านบรรยากาศทีมขาด",
        "รับฟังอย่างลึกซึ้ง",
        "แก้ปัญหาเชิงมนุษย์เก่ง"
      ],
      "en": [
        "Empathetic strategy",
        "Acute social intuition",
        "Deep listening",
        "Human-centered problem solving"
      ]
    },
    "growth": {
      "th": "ระวังเก็บความกดดันของทุกคนมาแบกไว้คนเดียวจนหมดพลัง",
      "en": "Guard against absorbing collective stress and over-functioning for others."
    }
  },
  "INTJ-OC": {
    "code": "INTJ-OC",
    "base": "INTJ",
    "modifier": "OC",
    "title": {
      "th": "สถาปนิกแห่งความสมบูรณ์แบบ",
      "en": "Perfectionist Architect"
    },
    "shadeLabel": {
      "th": "คิดลึก & มาตรฐานไร้ที่ติ",
      "en": "Deep Deliberation & Exacting"
    },
    "tagline": {
      "th": "คิดทบทวนทุกมิติในหัว ปิดทุกช่องโหว่ก่อนลงมือทำจริง",
      "en": "Endlessly stress-tests ideas internally before committing a single step."
    },
    "desc": {
      "th": "มีมาตรฐานในใจสูงลิ่ว ตรวจทานทุกความเป็นไปได้เงียบๆ เก็บตัวและมุ่งมั่นสร้างผลงานระดับมาสเตอร์พีซ",
      "en": "Quietly holds impossibly high internal benchmarks, ensuring zero vulnerabilities in their work."
    },
    "strengths": {
      "th": [
        "ความแม่นยำระดับสูงสุด",
        "วิเคราะห์รอบด้านลึกซึ้ง",
        "ความรับผิดชอบในงาน",
        "ไม่ปล่อยผ่านจุดผิดพลาด"
      ],
      "en": [
        "Maximum precision",
        "Comprehensive analysis",
        "High personal standard",
        "Zero tolerance for flaw"
      ]
    },
    "growth": {
      "th": "ระวังติดกับดักความสมบูรณ์แบบจนเริ่มลงมือช้า (Analysis Paralysis)",
      "en": "Watch out for analysis paralysis; set deadlines to ship practical iterations."
    }
  },
  "INTP-AH": {
    "code": "INTP-AH",
    "base": "INTP",
    "modifier": "AH",
    "title": {
      "th": "นักนวัตกรรมมั่นใจ",
      "en": "Confident Innovator"
    },
    "shadeLabel": {
      "th": "คิดลึก & สื่อสารลื่นไหล",
      "en": "Confident & Articulate"
    },
    "tagline": {
      "th": "กล้าพูด กล้าแชร์ไอเดียทดลองใหม่ ไม่กลัวความผิดพลาด",
      "en": "Brings abstract breakthroughs to life through fearless experimentation and clear debate."
    },
    "desc": {
      "th": "เป็น INTP ที่กล้าพูด กล้าแชร์ไอเดีย มีทักษะการสื่อสารกับทีมได้ลื่นไหล ไม่กลัวการทดลองสิ่งใหม่เพื่อค้นหาคำตอบ",
      "en": "Translates complex logic into engaging concepts, actively collaborating to solve tough puzzles."
    },
    "strengths": {
      "th": [
        "ถ่ายทอดเรื่องยากให้เข้าใจง่าย",
        "กล้าทดลองสิ่งใหม่",
        "เชื่อมโยงทฤษฎีกับการปฏิบัติ",
        "ถกเถียงอย่างสร้างสรรค์"
      ],
      "en": [
        "Clear technical communication",
        "Fearless prototyping",
        "Bridging theory & practice",
        "Constructive debate"
      ]
    },
    "growth": {
      "th": "ระวังเปลี่ยนความสนใจเร็วเกินไปจนโปรเจกต์เก่ายังไม่เสร็จสมบูรณ์",
      "en": "Stay anchored long enough to finish core deliverables before chasing next novelty."
    }
  },
  "INTP-AC": {
    "code": "INTP-AC",
    "base": "INTP",
    "modifier": "AC",
    "title": {
      "th": "สถาปนิกทฤษฎีสายลุยเดี่ยว",
      "en": "Independent Architect"
    },
    "shadeLabel": {
      "th": "อินดี้ & ชิลจริง",
      "en": "Autonomous & Unbothered"
    },
    "tagline": {
      "th": "โฟกัสระบบและโค้ด ไม่แคร์คำวิจารณ์ ไม่ต้องรอใครมาการันตี",
      "en": "Pure analytical focus, solving hardest logical problems in complete independence."
    },
    "desc": {
      "th": "เป็น INTP สายลุยเดี่ยว ไม่สนใจคำวิจารณ์ ไม่ต้องการการยอมรับจากสังคม ทำงานกับระบบและโค้ดได้ทรงพลังที่สุด",
      "en": "Zero desire for spotlight; thrives when left alone with intricate logic, theories, or systems."
    },
    "strengths": {
      "th": [
        "แก้โจทย์ซับซ้อนได้ลึกซึ้ง",
        "มีสมาธิยาวนานต่อเนื่อง",
        "ไม่หวั่นไหวต่อคำตัดสิน",
        "คิดนอกกรอบอย่างแท้จริง"
      ],
      "en": [
        "Deep complex problem solving",
        "Enduring focus",
        "Immune to social bias",
        "Pure first-principles thinking"
      ]
    },
    "growth": {
      "th": "อย่าลืมอธิบายเหตุผลให้คนอื่นฟังบ้างเพื่อลดช่องว่างในการทำงานร่วมกัน",
      "en": "Share the reasoning behind conclusions so collaborators can follow along."
    }
  },
  "INTP-OH": {
    "code": "INTP-OH",
    "base": "INTP",
    "modifier": "OH",
    "title": {
      "th": "นักวิเคราะห์ผู้เห็นอกเห็นใจ",
      "en": "Empathetic Deep Thinker"
    },
    "shadeLabel": {
      "th": "เซนส์ไว & แคร์ทุกคน",
      "en": "Empathetic & Analytical"
    },
    "tagline": {
      "th": "รู้สึกลึก ซึมซับอารมณ์คนรอบข้างได้ไว ข้างในวิเคราะห์หาทางออกที่ดีที่สุด",
      "en": "Feels deeply and absorbs room vibe while running deep logic to help everyone."
    },
    "desc": {
      "th": "รับฟังและใส่ใจคนรอบข้างสูงมาก มีความเห็นอกเห็นใจผสมกับการคิดวิเคราะห์ มักหาคำตอบที่ทั้งถูกหลักการและสบายใจทุกคน",
      "en": "Combines acute logic with genuine emotional care, synthesizing solutions that respect both truth and people."
    },
    "strengths": {
      "th": [
        "ตรรกะแม่นยำแต่พูดจานุ่มนวล",
        "สังเกตความรู้สึกคนรอบข้างเก่ง",
        "ประนีประนอมจุดขัดแย้งได้ดี",
        "คิดเพื่อผลประโยชน์ทีม"
      ],
      "en": [
        "Gentle yet rigorous logic",
        "High emotional antenna",
        "Graceful conflict resolution",
        "Team-first intellectualism"
      ]
    },
    "growth": {
      "th": "ระวังคิดวนซ้ำซากและแบกรับความรู้สึกลบของคนอื่นจนหมดพลัง",
      "en": "Use timeboxing for decisions and protect your personal emotional boundaries."
    }
  },
  "INTP-OC": {
    "code": "INTP-OC",
    "base": "INTP",
    "modifier": "OC",
    "title": {
      "th": "นักทฤษฎีตรวจทานลึก",
      "en": "Perfectionist Theorist"
    },
    "shadeLabel": {
      "th": "คิดวน & โลกส่วนตัวสูง",
      "en": "Deep Deliberation & Solitary"
    },
    "tagline": {
      "th": "ภายนอกดูนิ่ง แต่ในหัวตรวจทานระบบตลอดเวลา มาตรฐานสูงมาก",
      "en": "Calm exterior concealing an unyielding internal engine of logical scrutiny."
    },
    "desc": {
      "th": "เป็น INTP ที่เงียบที่สุด มุ่งเน้นการตรวจทานหาข้อผิดพลาดในหัว มีมาตรฐานสูงและเริ่มลงมือช้าจนกว่าจะมั่นใจ 100%",
      "en": "Analyzes every hypothesis to the nth degree, refusing to release work until every logical knot is untangled."
    },
    "strengths": {
      "th": [
        "ค้นพบช่องโหว่ที่คนอื่นมองข้าม",
        "คิดอย่างเป็นระบบรัดกุม",
        "ซื่อสัตย์ต่อข้อเท็จจริง",
        "ความรู้เฉพาะทางลึกซึ้ง"
      ],
      "en": [
        "Spotting obscure edge cases",
        "Tight conceptual consistency",
        "Unwavering intellectual honesty",
        "Deep domain mastery"
      ]
    },
    "growth": {
      "th": "กล้าปล่อยงานเวอร์ชันแรกออกมาทดสอบเร็วขึ้น อย่ารอให้สมบูรณ์แบบ 100%",
      "en": "Practice shipping MVPs early rather than waiting for 100% theoretical perfection."
    }
  },
  "ENTJ-AH": {
    "code": "ENTJ-AH",
    "base": "ENTJ",
    "modifier": "AH",
    "title": {
      "th": "ผู้นำทรงพลังผู้จุดประกาย",
      "en": "Inspirational Commander"
    },
    "shadeLabel": {
      "th": "เฉียบคม & สร้างแรงบันดาลใจ",
      "en": "Decisive & Charismatic"
    },
    "tagline": {
      "th": "ลุยไปข้างหน้าด้วยความมั่นใจ พร้อมโอบอุ้มและพาคนในทีมเติบโต",
      "en": "Leads from the front with unstoppable energy, uplifting everyone along the ascent."
    },
    "desc": {
      "th": "ผสมผสานความเด็ดขาดเข้ากับการสร้างบรรยากาศทีมที่ดี กล้าตัดสินใจและพร้อมเปิดใจรับฟังเพื่อพาองค์กรชนะ",
      "en": "The quintessential leader who couples fierce execution with infectious team charisma."
    },
    "strengths": {
      "th": [
        "ภาวะผู้นำโดดเด่น",
        "ขับเคลื่อนเป้าหมายรวดเร็ว",
        "สื่อสารสร้างแรงบันดาลใจ",
        "กล้าแบกรับความรับผิดชอบ"
      ],
      "en": [
        "Dynamic leadership",
        "Rapid goal achievement",
        "Inspirational presence",
        "Accountability"
      ]
    },
    "growth": {
      "th": "ระวังคาดหวังความเร็วจากทุกคนเท่าตัวเอง ควรให้เวลาทีมปรับจังหวะ",
      "en": "Calibrate pace expectations so team members don't burn out under high velocity."
    }
  },
  "ENTJ-AC": {
    "code": "ENTJ-AC",
    "base": "ENTJ",
    "modifier": "AC",
    "title": {
      "th": "ผู้บัญชาการสายสตรอง",
      "en": "Stoic Commander"
    },
    "shadeLabel": {
      "th": "เด็ดเดี่ยว & ไม่สนดราม่า",
      "en": "Resolute & Laser-Focused"
    },
    "tagline": {
      "th": "มองที่ผลลัพธ์เป็นหลัก ไม่หวั่นไหวต่อแรงต้าน เดินหน้าชนทุกเป้าหมาย",
      "en": "Unapologetic focus on bottom-line results, navigating adversity with iron discipline."
    },
    "desc": {
      "th": "โฟกัสเป้าหมายและความสำเร็จ 100% ไม่เสียเวลากับเรื่องหยุมหยิม ตัดสินใจรวดเร็วและแก้ปัญหาได้เฉียบขาด",
      "en": "Direct, unflinching, and hyper-efficient; builds and scales machines that deliver guaranteed victory."
    },
    "strengths": {
      "th": [
        "เด็ดขาดไม่ลังเล",
        "แก้ปัญหาวิกฤตได้ทันที",
        "ประสิทธิภาพการทำงานสูงสุด",
        "ไม่ยอมแพ้ต่ออุปสรรค"
      ],
      "en": [
        "Zero hesitation",
        "Crisis execution",
        "Maximum operational speed",
        "Relentless grit"
      ]
    },
    "growth": {
      "th": "ระวังแสดงความแข็งกร้าวเกินไป เพิ่มความยืดหยุ่นและการชื่นชมทีม",
      "en": "Balance direct commands with positive reinforcement and empathetic active listening."
    }
  },
  "ENTJ-OH": {
    "code": "ENTJ-OH",
    "base": "ENTJ",
    "modifier": "OH",
    "title": {
      "th": "ผู้นำปฏิรูปผู้ใส่ใจ",
      "en": "Conscientious Driver"
    },
    "shadeLabel": {
      "th": "ตั้งใจจริง & แคร์ผลกระทบ",
      "en": "Driven & Socially Aware"
    },
    "tagline": {
      "th": "ขับเคลื่อนการเปลี่ยนแปลงครั้งใหญ่ โดยคำนึงถึงความรู้สึกของทีมเสมอ",
      "en": "Drives high-stakes transformations while continuously checking on team morale."
    },
    "desc": {
      "th": "เป็น ENTJ ที่คิดใคร่ครวญถึงผลกระทบต่อคน ใส่ใจเรื่องความเป็นธรรม มุ่งมั่นพัฒนาทีมให้ยั่งยืน",
      "en": "A reflective commander who balances ambition with deep responsibility for their people."
    },
    "strengths": {
      "th": [
        "นำทีมอย่างเป็นธรรม",
        "วางแผนพัฒนาคนควบคู่กับงาน",
        "รับฟังความคิดเห็นรอบด้าน",
        "มุ่งผลลัพธ์ระยะยาว"
      ],
      "en": [
        "Fair leadership",
        "Human capital growth",
        "Broad stakeholder listening",
        "Sustainable performance"
      ]
    },
    "growth": {
      "th": "ระวังแบกความคาดหวังเรื่องความสมบูรณ์แบบทั้งงานและใจคนจนเครียดสะสม",
      "en": "Accept that tough decisions may occasionally disappoint some people in the short term."
    }
  },
  "ENTJ-OC": {
    "code": "ENTJ-OC",
    "base": "ENTJ",
    "modifier": "OC",
    "title": {
      "th": "จอมทัพนักวิเคราะห์เป้าหมาย",
      "en": "Strategic Master Controller"
    },
    "shadeLabel": {
      "th": "ละเอียดลึก & คุมเชิงเงียบ",
      "en": "Analytical & Methodical"
    },
    "tagline": {
      "th": "คิดคำนวณความเสี่ยงทุกขั้นตอน คุมเกมเบื้องหลังอย่างเงียบกริบ",
      "en": "Internally calculates all contingency paths, orchestrating execution with precision."
    },
    "desc": {
      "th": "มีความรอบคอบสูง ประเมินความเสี่ยงอย่างละเอียดก่อนสั่งการ มีมาตรฐานสูงและชอบควบคุมคุณภาพด้วยตัวเอง",
      "en": "High-standard driver who double-checks strategic vulnerabilities before launching all-out execution."
    },
    "strengths": {
      "th": [
        "ประเมินความเสี่ยงแม่นยำ",
        "วางแผนสำรองรัดกุม",
        "คุมคุณภาพงานเข้มงวด",
        "บริหารทรัพยากรคุ้มค่า"
      ],
      "en": [
        "Risk assessment",
        "Rock-solid contingencies",
        "Quality gatekeeping",
        "Resource efficiency"
      ]
    },
    "growth": {
      "th": "ระวังการไมโครแมเนจเมนต์ (Micromanagement) ควรไว้วางใจให้ทีมลงมือทำ",
      "en": "Delegate autonomy to trusted lieutenants without inspecting every micro-step."
    }
  },
  "ENTP-AH": {
    "code": "ENTP-AH",
    "base": "ENTP",
    "modifier": "AH",
    "title": {
      "th": "นักปั้นนวัตกรรมเสน่ห์ล้น",
      "en": "Charismatic Innovator"
    },
    "shadeLabel": {
      "th": "ไอเดียพุ่ง & เข้าถึงง่าย",
      "en": "Visionary & Engaging"
    },
    "tagline": {
      "th": "เปลี่ยนไอเดียบ้าๆ ให้เป็นจริง พร้อมดึงดูดทุกคนให้มาร่วมสนุก",
      "en": "Turns wild sparks into magnetic realities, captivating audiences with effortless charm."
    },
    "desc": {
      "th": "มีพลังงานเหลือล้น สื่อสารไอเดียยากๆ ให้ทุกคนตื่นเต้นได้เสมอ กล้าลองสิ่งใหม่และสร้างคอนเนกชันได้ดีเยี่ยม",
      "en": "Fast-talking, witty, and deeply engaging; transforms brainstorming into high-energy breakthroughs."
    },
    "strengths": {
      "th": [
        "ความคิดสร้างสรรค์ไร้ขีดจำกัด",
        "เสน่ห์การพูดโน้มน้าวใจ",
        "ปรับตัวเข้ากับสถานการณ์ไว",
        "แก้ปัญหาด้วยวิธีนอกกรอบ"
      ],
      "en": [
        "Boundless creativity",
        "Persuasive charisma",
        "Hyper-adaptability",
        "Out-of-the-box agility"
      ]
    },
    "growth": {
      "th": "ระวังรับปากหลายโปรเจกต์พร้อมกัน โฟกัสไอเดียที่ดีที่สุดให้สำเร็จเป็นชิ้นๆ",
      "en": "Limit active bets; prioritize finishing top ideas before taking on exciting new ones."
    }
  },
  "ENTP-AC": {
    "code": "ENTP-AC",
    "base": "ENTP",
    "modifier": "AC",
    "title": {
      "th": "นักต่อกรสายอินดี้",
      "en": "Disruptive Maverick"
    },
    "shadeLabel": {
      "th": "ท้าทายกรอบ & ลุยเดี่ยว",
      "en": "Bold & Self-Reliant"
    },
    "tagline": {
      "th": "ฉีกทุกกฎเกณฑ์เดิม ไม่แคร์กระแสสังคม มั่นใจในทฤษฎีของตัวเอง",
      "en": "Breaks orthodox molds without flinching, thriving on raw intellect and experimentation."
    },
    "desc": {
      "th": "ไม่ยึดติดกับธรรมเนียม ชอบท้าทายสมมติฐานเดิมๆ เพื่อหาทางที่ดีกว่า ลุยเดี่ยวได้สบายโดยไม่ต้องรอเสียงสนับสนุน",
      "en": "Fearless debater and conceptual explorer who needs neither permission nor consensus to disrupt."
    },
    "strengths": {
      "th": [
        "กล้าท้าทายสิ่งล้าสมัย",
        "ไหวพริบปฏิภาณเฉียบแหลม",
        "พึ่งพาตัวเองในการทดลอง",
        "มองเห็นโอกาสในวิกฤต"
      ],
      "en": [
        "Challenging legacy dogma",
        "Razor-sharp wit",
        "Self-directed R&D",
        "Opportunity spotter"
      ]
    },
    "growth": {
      "th": "ระวังการถกเถียงเพื่อเอาชนะจนกระทบความสัมพันธ์ ควรเลือกสมรภูมิที่คุ้มค่า",
      "en": "Choose battles wisely; not every flawed premise needs immediate public dismantling."
    }
  },
  "ENTP-OH": {
    "code": "ENTP-OH",
    "base": "ENTP",
    "modifier": "OH",
    "title": {
      "th": "นักปฏิรูปสายสร้างสรรค์",
      "en": "Empathetic Catalyst"
    },
    "shadeLabel": {
      "th": "ไวต่อความรู้สึก & ปรับไอเดียเก่ง",
      "en": "Sensitive & Ideative"
    },
    "tagline": {
      "th": "คิดหาไอเดียเพื่อแก้ปัญหาให้คน แคร์ผลตอบรับและพร้อมปรับปรุงเสมอ",
      "en": "Generates creative pathways specifically designed to resolve human and cultural pain points."
    },
    "desc": {
      "th": "ใช้ความฉลาดและไอเดียในการช่วยเหลือผู้คน รับฟังความรู้สึกคนรอบข้างได้ไว มักคิดค้นทางออกที่ทุกคนแฮปปี้",
      "en": "Combines cognitive agility with emotional resonance, crafting ideas that uplift and harmonize."
    },
    "strengths": {
      "th": [
        "สร้างสรรค์นวัตกรรมเพื่อผู้คน",
        "สังเกตความต้องการตลาดไว",
        "รับฟังคำวิจารณ์เพื่อพัฒนา",
        "เชื่อมโยงคนหลากหลายกลุ่ม"
      ],
      "en": [
        "Human-centric innovation",
        "Early trend detection",
        "Receptive to feedback",
        "Cross-pollinating networks"
      ]
    },
    "growth": {
      "th": "ระวังความกังวลใจเรื่องคำตัดสินของคนอื่นจนชะลอการเปิดตัวไอเดียใหม่",
      "en": "Don't let fear of friction dilute the sharpness of original, disruptive ideas."
    }
  },
  "ENTP-OC": {
    "code": "ENTP-OC",
    "base": "ENTP",
    "modifier": "OC",
    "title": {
      "th": "นักประดิษฐ์ทฤษฎีสุดขั้ว",
      "en": "Inventive Strategist"
    },
    "shadeLabel": {
      "th": "คิดซับซ้อน & สันโดษ",
      "en": "Complex & Deeply Inquisitive"
    },
    "tagline": {
      "th": "ภายนอกดูสนุก แต่ในหัวทดลองตรรกะและหาวิธีแฮกระบบไม่หยุด",
      "en": "Playful facade hiding an intense, solitary intellect hacking through complex systems."
    },
    "desc": {
      "th": "ชอบคิดทดลองเงียบๆ ในหัว ตรวจสอบช่องโหว่ทางความคิด มีไอเดียแปลกใหม่ที่ผ่านการกลั่นกรองมาอย่างลึกซึ้ง",
      "en": "Internally interrogates ideas for hidden flaws, producing deeply original and non-obvious models."
    },
    "strengths": {
      "th": [
        "วิเคราะห์กลไกซับซ้อน",
        "สร้างสรรค์โมเดลที่ไม่ซ้ำใคร",
        "ตรวจจับช่องโหว่เชิงตรรกะ",
        "ความลุ่มลึกทางความคิด"
      ],
      "en": [
        "Complex system hacking",
        "Novel architectural models",
        "Logical flaw detection",
        "Intellectual depth"
      ]
    },
    "growth": {
      "th": "ระวังคิดซับซ้อนเกินไปจนสื่อสารยาก พยายามสรุปให้เรียบง่ายและใช้งานได้จริง",
      "en": "Keep explanations simple so non-technical collaborators can understand and implement."
    }
  },
  "INFJ-AH": {
    "code": "INFJ-AH",
    "base": "INFJ",
    "modifier": "AH",
    "title": {
      "th": "ผู้ชี้ทางสว่างผู้สร้างพลัง",
      "en": "Inspiring Guide"
    },
    "shadeLabel": {
      "th": "มั่นใจ & สื่อสารอบอุ่น",
      "en": "Confident & Uplifting"
    },
    "tagline": {
      "th": "เปลี่ยนวิสัยทัศน์ทางจิตวิญญาณให้เป็นรูปธรรม ขับเคลื่อนสังคมด้วยความหวัง",
      "en": "Grounds deep intuitive wisdom into actionable community inspiration."
    },
    "desc": {
      "th": "เป็น INFJ ที่กล้าออกมานำ สื่อสารความเข้าใจมนุษย์ได้อย่างทรงพลัง เป็นที่พึ่งทางใจและสร้างแรงบันดาลใจให้คนรอบข้าง",
      "en": "Confident counselor who steps up to guide groups with warmth and moral clarity."
    },
    "strengths": {
      "th": [
        "สร้างแรงบันดาลใจลึกซึ้ง",
        "เข้าใจจิตใจมนุษย์ถ่องแท้",
        "สื่อสารอย่างมีพลัง",
        "นำการเปลี่ยนแปลงเชิงบวก"
      ],
      "en": [
        "Soulful inspiration",
        "Deep psychological insight",
        "Empowered communication",
        "Positive social change"
      ]
    },
    "growth": {
      "th": "อย่าลืมพักผ่อนเพื่อเติมพลังใจ อย่าทุ่มเทช่วยคนอื่นจนลืมดูแลสุขภาพตัวเอง",
      "en": "Schedule mandatory solitude to recharge mental energy after intense social guidance."
    }
  },
  "INFJ-AC": {
    "code": "INFJ-AC",
    "base": "INFJ",
    "modifier": "AC",
    "title": {
      "th": "นักปราชญ์ผู้สงบเงียบ",
      "en": "Tranquil Mystic"
    },
    "shadeLabel": {
      "th": "สุขุม & มีสเปซส่วนตัว",
      "en": "Serene & Self-Contained"
    },
    "tagline": {
      "th": "หยั่งรู้จิตใจคนอย่างลึกซึ้ง รักษาสมดุลภายในโดยไม่ถูกอารมณ์ภายนอกรบกวน",
      "en": "Profound intuitive insight anchored by unbreakable inner stillness."
    },
    "desc": {
      "th": "มีความสงบในจิตใจสูง ไม่หวั่นไหวต่อแรงกดดัน รักความสันโดษ เข้าใจธรรมชาติมนุษย์อย่างถ่องแท้",
      "en": "Quietly perceptive and emotionally resilient, holding space for profound philosophical truths."
    },
    "strengths": {
      "th": [
        "ความสงบในจิตใจสูง",
        "หยั่งรู้ความจริงแท้",
        "ไม่หวั่นไหวต่อดราม่า",
        "คำแนะนำลึกซึ้งเฉียบขาด"
      ],
      "en": [
        "Inner serenity",
        "Profound intuition",
        "Drama resilience",
        "Sage-like counsel"
      ]
    },
    "growth": {
      "th": "ระวังเก็บตัวมากเกินไปจนคนรอบข้างรู้สึกว่าเข้าถึงยาก",
      "en": "Open little windows of emotional availability for close friends and family."
    }
  },
  "INFJ-OH": {
    "code": "INFJ-OH",
    "base": "INFJ",
    "modifier": "OH",
    "title": {
      "th": "ผู้เยียวยาหัวใจผู้เสียสละ",
      "en": "Selfless Healer"
    },
    "shadeLabel": {
      "th": "เซนส์ไว & แคร์สุดหัวใจ",
      "en": "Deeply Empathetic & Caring"
    },
    "tagline": {
      "th": "ซึมซับความรู้สึกคนอื่นได้ทันที ทุ่มเทเพื่อความสุขและความสงบของทุกคน",
      "en": "Feels the unspoken sorrow and joys of others, dedicating themselves to collective healing."
    },
    "desc": {
      "th": "มี Empathy สูงมาก ไวต่อความทุกข์ของคนอื่น พร้อมรับฟังและช่วยเหลือ แต่อาจเหนื่อยใจง่ายถ้าไม่ตั้งขอบเขต",
      "en": "Extremely attuned to the emotional atmosphere, weaving empathy and harmony into everything they touch."
    },
    "strengths": {
      "th": [
        "ความเห็นอกเห็นใจสูงสุด",
        "รับฟังโดยไม่ตัดสิน",
        "เยียวยาจิตใจผู้คน",
        "สร้างบรรยากาศอบอุ่นปลอดภัย"
      ],
      "en": [
        "Peak empathy",
        "Non-judgmental listening",
        "Emotional healing",
        "Safe psychological space"
      ]
    },
    "growth": {
      "th": "ต้องสร้างเกราะป้องกันอารมณ์ (Emotional Boundary) และกล้าปฏิเสธเมื่อเกินกำลัง",
      "en": "Set firm boundaries and learn to say no without carrying unwarranted guilt."
    }
  },
  "INFJ-OC": {
    "code": "INFJ-OC",
    "base": "INFJ",
    "modifier": "OC",
    "title": {
      "th": "นักหยั่งรู้ผู้ใคร่ครวญลึก",
      "en": "Contemplative Sage"
    },
    "shadeLabel": {
      "th": "คิดลึก & โลกภายในกว้างใหญ่",
      "en": "Reflective & Introspective"
    },
    "tagline": {
      "th": "ใคร่ครวญความหมายของชีวิตเงียบๆ ค้นหาความจริงแท้ผ่านการใคร่ครวญ",
      "en": "Explores the deepest corridors of human meaning in complete inner contemplation."
    },
    "desc": {
      "th": "มีมาตรฐานศีลธรรมและอุดมคติในใจสูง ทบทวนความคิดตัวเองอย่างละเอียด มีความลึกซึ้งและเข้าใจเรื่องซับซ้อน",
      "en": "High inner standards and rich internal reflections, creating written or artistic masterworks in solitude."
    },
    "strengths": {
      "th": [
        "ความเข้าใจปรัชญาชีวิต",
        "สังเคราะห์ความคิดตกผลึก",
        "ซื่อสัตย์ต่ออุดมคติ",
        "มองเห็นภาพรวมทางจิตวิทยา"
      ],
      "en": [
        "Philosophical depth",
        "Crystallized synthesis",
        "Idealistic integrity",
        "Holistic human understanding"
      ]
    },
    "growth": {
      "th": "อย่าปล่อยให้ความผิดหวังในโลกความจริงทำให้หมดศรัทธา ลงมือทำสิ่งเล็กๆ เท่าที่ทำได้",
      "en": "Focus on tangible micro-actions instead of despairing over imperfect realities."
    }
  },
  "INFP-AH": {
    "code": "INFP-AH",
    "base": "INFP",
    "modifier": "AH",
    "title": {
      "th": "นักเคลื่อนไหวผู้เปี่ยมอุดมการณ์",
      "en": "Radiant Idealist"
    },
    "shadeLabel": {
      "th": "มั่นใจ & เชื่อมโยงใจ",
      "en": "Confident & Soulful"
    },
    "tagline": {
      "th": "กล้าแสดงออกถึงคุณค่าในใจ พร้อมส่งต่อพลังบวกและความหวังให้ผู้คน",
      "en": "Fearlessly stands for authentic values, radiating hope and genuine connection."
    },
    "desc": {
      "th": "เป็น INFP ที่กล้าแสดงตัวตนและคุณค่าที่ยึดถือ สื่อสารเรื่องราวที่สะเทือนอารมณ์และสร้างพลังใจให้ผู้อื่น",
      "en": "Expressive idealist who articulates their inner world with confidence, inspiring authentic living."
    },
    "strengths": {
      "th": [
        "สื่อสารความจริงใจ",
        "สร้างสรรค์งานศิลปะมีพลัง",
        "เข้าอกเข้าใจผู้อื่น",
        "ส่งต่อพลังบวก"
      ],
      "en": [
        "Authentic storytelling",
        "Soulful creativity",
        "Empathetic connection",
        "Uplifting hope"
      ]
    },
    "growth": {
      "th": "ระวังการมองโลกในแง่ดีเกินไปจนละเลยความเป็นจริงทางการเงินหรือข้อจำกัด",
      "en": "Ground romantic idealism with realistic timelines and practical constraints."
    }
  },
  "INFP-AC": {
    "code": "INFP-AC",
    "base": "INFP",
    "modifier": "AC",
    "title": {
      "th": "ศิลปินสันโดษผู้ซื่อสัตย์",
      "en": "Authentic Hermit"
    },
    "shadeLabel": {
      "th": "นิ่งสงบ & ยึดมั่นตัวตน",
      "en": "Grounded & Autonomous"
    },
    "tagline": {
      "th": "ซื่อสัตย์ต่อหัวใจตัวเอง ไม่ตามกระแสสังคม สบายใจในโลกส่วนตัว",
      "en": "Uncompromising integrity, flourishing peacefully in their own creative solitude."
    },
    "desc": {
      "th": "อยู่อย่างสงบและพอเพียง ไม่สนใจความคาดหวังของสังคม มีความสุขกับการสร้างสรรค์งานในพื้นที่ส่วนตัว",
      "en": "Grounded in personal ethics; refuses to conform to shallow trends and protects their calm domain."
    },
    "strengths": {
      "th": [
        "ความซื่อตรงต่อตัวเอง",
        "ไม่หวั่นไหวต่อแรงกดดันสังคม",
        "สร้างสรรค์ผลงานมีเอกลักษณ์",
        "รักความสงบสุข"
      ],
      "en": [
        "Radical authenticity",
        "Immune to social pressure",
        "Distinct creative voice",
        "Inner harmony"
      ]
    },
    "growth": {
      "th": "ระวังการตัดขาดจากโอกาสใหม่ๆ ลองก้าวออกจากคอมฟอร์ตโซนบ้าง",
      "en": "Step outside your solitary comfort zone to share your gifts with broader circles."
    }
  },
  "INFP-OH": {
    "code": "INFP-OH",
    "base": "INFP",
    "modifier": "OH",
    "title": {
      "th": "จิตวิญญาณผู้เห็นอกเห็นใจ",
      "en": "Tender Soul"
    },
    "shadeLabel": {
      "th": "อ่อนโยน & ไวต่ออารมณ์",
      "en": "Tender & Empathetic"
    },
    "tagline": {
      "th": "รู้สึกทุกความรู้สึกอย่างลึกซึ้ง เข้าใจความเปราะบางของมนุษย์อย่างแท้จริง",
      "en": "Deeply moved by beauty and pain alike, offering sanctuary to wounded hearts."
    },
    "desc": {
      "th": "มีความละเอียดอ่อนสูงมาก สัมผัสถึงความเจ็บปวดและความงดงามรอบตัว คอยปลอบโยนและเข้าใจทุกคน",
      "en": "Hyper-sensitive heart that absorbs both beauty and sorrow, offering pure emotional sanctuary."
    },
    "strengths": {
      "th": [
        "ความอ่อนโยนลึกซึ้ง",
        "เข้าใจความรู้สึกเปราะบาง",
        "ให้กำลังใจอย่างจริงใจ",
        "ละเอียดอ่อนทางศิลปะ"
      ],
      "en": [
        "Profound gentleness",
        "Empathy for vulnerability",
        "Sincere validation",
        "Artistic sensitivity"
      ]
    },
    "growth": {
      "th": "อย่าเก็บคำพูดทำร้ายจิตใจของคนอื่นมาตอกย้ำตัวเอง ฝึกปล่อยวาง",
      "en": "Don't internalize harsh words as self-worth metrics; practice emotional detachment."
    }
  },
  "INFP-OC": {
    "code": "INFP-OC",
    "base": "INFP",
    "modifier": "OC",
    "title": {
      "th": "กวีผู้ค้นหาความหมายลึกซึ้ง",
      "en": "Introspective Poet"
    },
    "shadeLabel": {
      "th": "คิดวน & โลกส่วนตัวเข้มข้น",
      "en": "Complex & Introspective"
    },
    "tagline": {
      "th": "สำรวจอารมณ์และความหมายในใจเงียบๆ กลั่นกรองออกมาเป็นงานศิลปะ",
      "en": "Private perfectionist of personal meaning, turning internal turbulence into rare art."
    },
    "desc": {
      "th": "มีโลกภายในที่ซับซ้อนและงดงาม คิดทบทวนความรู้สึกของตัวเองตลอดเวลา สร้างผลงานที่ลึกซึ้งและมีความหมาย",
      "en": "Rich inner emotional universe, transforming quiet existential struggles into poignant artistic expressions."
    },
    "strengths": {
      "th": [
        "ความลึกซึ้งทางอารมณ์",
        "สะท้อนความคิดตกผลึก",
        "สร้างงานศิลปะเฉพาะตัว",
        "เห็นคุณค่าในสิ่งเล็กๆ"
      ],
      "en": [
        "Emotional depth",
        "Profound self-reflection",
        "Sublime artistic craft",
        "Appreciation for nuance"
      ]
    },
    "growth": {
      "th": "ระวังจมอยู่กับความคิดและอารมณ์เศร้านานเกินไป หาทางระบายออกสู่การกระทำ",
      "en": "Channel contemplative spirals into physical activity or outward creative completion."
    }
  },
  "ENFJ-AH": {
    "code": "ENFJ-AH",
    "base": "ENFJ",
    "modifier": "AH",
    "title": {
      "th": "ผู้นำแห่งการเปลี่ยนแปลง",
      "en": "Magnetic Mentor"
    },
    "shadeLabel": {
      "th": "มั่นใจ & ดึงศักยภาพคน",
      "en": "Charismatic & Empowering"
    },
    "tagline": {
      "th": "สร้างแรงบันดาลใจและปลุกพลังทุกคน นำพาชุมชนไปสู่เป้าหมายร่วมกัน",
      "en": "Galvanizes communities with unwavering warmth, conviction, and forward momentum."
    },
    "desc": {
      "th": "เป็นผู้นำที่เปี่ยมด้วยเสน่ห์และความมั่นใจ สื่อสารเข้าถึงหัวใจคน ดึงศักยภาพที่ดีที่สุดของคนในทีมออกมา",
      "en": "Inspiring coach and community catalyst who rallies groups with irresistible charisma and warmth."
    },
    "strengths": {
      "th": [
        "สร้างแรงบันดาลใจชั้นยอด",
        "พัฒนาคนเก่งกาจ",
        "สื่อสารสร้างความกลมเกลียว",
        "นำพาเป้าหมายร่วม"
      ],
      "en": [
        "Inspiring mentorship",
        "Talent development",
        "Harmonious rhetoric",
        "Collective momentum"
      ]
    },
    "growth": {
      "th": "ระวังควบคุมทิศทางมากเกินไป เปิดพื้นที่ให้ผู้อื่นได้ลองผิดลองถูกด้วยตัวเอง",
      "en": "Allow others room to stumble and learn at their own pace without constant intervention."
    }
  },
  "ENFJ-AC": {
    "code": "ENFJ-AC",
    "base": "ENFJ",
    "modifier": "AC",
    "title": {
      "th": "พี่ใหญ่สายชิลคุมเกม",
      "en": "Stoic Facilitator"
    },
    "shadeLabel": {
      "th": "มั่นคง & นิ่งสงบ",
      "en": "Stable & Supportive"
    },
    "tagline": {
      "th": "ดูแลทุกคนอย่างมั่นคง เป็นเสาหลักที่ไว้ใจได้ในทุกสถานการณ์",
      "en": "A solid pillar of strength and support, anchoring groups without being drained."
    },
    "desc": {
      "th": "เป็น ENFJ ที่นิ่งและมีเสถียรภาพทางอารมณ์สูง คอยสนับสนุนทีมอยู่เบื้องหลังอย่างมั่นคง ไม่หวั่นไหวต่อดราม่า",
      "en": "Emotionally grounded facilitator who supports community infrastructure without getting consumed by social turbulence."
    },
    "strengths": {
      "th": [
        "ความมั่นคงทางอารมณ์",
        "เป็นที่พึ่งพาในวิกฤต",
        "ไกล่เกลี่ยข้อพิพาทเป็นกลาง",
        "สนับสนุนทีมต่อเนื่อง"
      ],
      "en": [
        "Emotional fortitude",
        "Crisis dependability",
        "Fair mediation",
        "Consistent team support"
      ]
    },
    "growth": {
      "th": "อย่าลืมแสดงความรู้สึกและความต้องการของตัวเองให้ทีมรู้บ้าง",
      "en": "Express personal needs and vulnerabilities rather than always playing the unshakeable rock."
    }
  },
  "ENFJ-OH": {
    "code": "ENFJ-OH",
    "base": "ENFJ",
    "modifier": "OH",
    "title": {
      "th": "ผู้ดูแลหัวใจทุกคน",
      "en": "Devoted Harmonizer"
    },
    "shadeLabel": {
      "th": "แคร์สุดตัว & ไวต่อความรู้สึก",
      "en": "Ultra-Sensitive & Devoted"
    },
    "tagline": {
      "th": "ทุ่มเทดูแลทุกคนจนสุดกำลัง ใส่ใจทุกรายละเอียดความรู้สึกของคนในทีม",
      "en": "Pours boundless heart into nurturing others, acutely sensing every interpersonal shift."
    },
    "desc": {
      "th": "ไวต่ออารมณ์ของคนรอบข้างมาก ทุ่มเททั้งแรงกายแรงใจเพื่อให้ทุกคนมีความสุขและรู้สึกเป็นส่วนหนึ่ง",
      "en": "Devotes immense emotional bandwidth to keeping every single person happy and included."
    },
    "strengths": {
      "th": [
        "ใส่ใจความรู้สึกผู้อื่น",
        "สร้างบรรยากาศเป็นกันเอง",
        "ดูแลทุกคนอย่างทั่วถึง",
        "เห็นอกเห็นใจลึกซึ้ง"
      ],
      "en": [
        "Ultra-considerate",
        "Inclusive atmosphere",
        "Attentive caretaking",
        "Profound empathy"
      ]
    },
    "growth": {
      "th": "ระวังการเอาใจคนอื่นจนหมดพลัง (People Pleasing) จำไว้ว่าเราไม่สามารถทำให้ทุกคนพอใจได้ 100%",
      "en": "Overcome people-pleasing; recognize you cannot fix everyone's mood simultaneously."
    }
  },
  "ENFJ-OC": {
    "code": "ENFJ-OC",
    "base": "ENFJ",
    "modifier": "OC",
    "title": {
      "th": "นักยุทธศาสตร์เพื่อสังคม",
      "en": "Reflective Advocate"
    },
    "shadeLabel": {
      "th": "คิดรอบคอบ & มุ่งผลระยะยาว",
      "en": "Deliberate & Purposeful"
    },
    "tagline": {
      "th": "วางแผนเพื่อช่วยเหลือคนอย่างรอบคอบ ตรวจทานตัวเองเพื่อสร้างผลกระทบที่ดีที่สุด",
      "en": "Carefully plans human-centered programs, holding themselves to the highest ethical bar."
    },
    "desc": {
      "th": "คิดทบทวนผลกระทบของโครงการต่อสังคมอย่างละเอียด มีมาตรฐานทางจริยธรรมสูง ทำงานเพื่อพัฒนาคนอย่างยั่งยืน",
      "en": "Evaluates social initiatives with meticulous ethical rigor, aiming for enduring positive impact."
    },
    "strengths": {
      "th": [
        "วางแผนเพื่อสังคมรอบคอบ",
        "มาตรฐานจริยธรรมสูง",
        "คิดวิเคราะห์ผลกระทบมนุษย์",
        "มุ่งมั่นพัฒนาอย่างยั่งยืน"
      ],
      "en": [
        "Ethical strategic planning",
        "Moral integrity",
        "Human impact analysis",
        "Sustainable community design"
      ]
    },
    "growth": {
      "th": "อย่ากดดันตัวเองด้วยมาตรฐานคุณธรรมที่สูงเกินไปจนรู้สึกผิดตลอดเวลา",
      "en": "Release harsh self-judgment when practical realities force imperfect compromises."
    }
  },
  "ENFP-AH": {
    "code": "ENFP-AH",
    "base": "ENFP",
    "modifier": "AH",
    "title": {
      "th": "ผู้จุดประกายความสุข",
      "en": "Dynamic Trailblazer"
    },
    "shadeLabel": {
      "th": "มั่นใจ & พลังบวกล้นเหลือ",
      "en": "Vibrant & Inspiring"
    },
    "tagline": {
      "th": "เชื่อมโยงผู้คนด้วยรอยยิ้มและไอเดียใหม่ๆ ลุยทุกโปรเจกต์ด้วยความมั่นใจ",
      "en": "Spreads infectious joy and innovation, turning novel ideas into social movements."
    },
    "desc": {
      "th": "มีพลังงานบวกท่วมท้น สร้างแรงบันดาลใจและเชื่อมโยงผู้คนได้ทุกกลุ่ม มั่นใจในการริเริ่มโปรเจกต์ใหม่ๆ",
      "en": "High-octane dynamo who turns brainstorms into vibrant cultural movements with boundless positivity."
    },
    "strengths": {
      "th": [
        "สร้างบรรยากาศสนุกสนาน",
        "ไอเดียแปลกใหม่ไม่รู้จบ",
        "ดึงดูดผู้คนด้วยความเป็นมิตร",
        "กล้าลองสิ่งใหม่"
      ],
      "en": [
        "Contagious enthusiasm",
        "Endless fresh concepts",
        "Magnetic friendliness",
        "Fearless initiation"
      ]
    },
    "growth": {
      "th": "ระวังการเบื่อง่ายและทิ้งงานกลางคัน ฝึกโฟกัสและส่งมอบงานให้จบ",
      "en": "Build discipline to push past the mid-project dip and reach the finish line."
    }
  },
  "ENFP-AC": {
    "code": "ENFP-AC",
    "base": "ENFP",
    "modifier": "AC",
    "title": {
      "th": "นักผจญภัยอิสระ",
      "en": "Free-Spirited Explorer"
    },
    "shadeLabel": {
      "th": "ชิลจริง & ไม่แคร์ใครขวาง",
      "en": "Carefree & Independent"
    },
    "tagline": {
      "th": "ใช้ชีวิตตามเสียงหัวใจ ลุยหาประสบการณ์ใหม่โดยไม่ต้องรอใครอนุญาต",
      "en": "Follows curiosity wherever it leads, resilient and completely at ease in their skin."
    },
    "desc": {
      "th": "รักอิสระเหนือสิ่งอื่นใด ไม่หวั่นไหวต่อคำวิจารณ์ ใช้ชีวิตตามใจปรารถนาและสนุกกับการเรียนรู้โลกกว้าง",
      "en": "Unshakeable free spirit charting uncharted territories without needing social consensus or approval."
    },
    "strengths": {
      "th": [
        "ความเป็นตัวของตัวเองสูง",
        "ปรับตัวกับความเปลี่ยนแปลงไว",
        "ไม่ยึดติดกับกรอบเดิมๆ",
        "กล้าเสี่ยงเพื่อเรียนรู้"
      ],
      "en": [
        "Radical individuality",
        "Rapid adaptability",
        "Unbounded mindset",
        "Adventurous courage"
      ]
    },
    "growth": {
      "th": "อย่าละเลยข้อตกลงและความรับผิดชอบต่อคนที่ร่วมเดินทางไปด้วยกัน",
      "en": "Keep commitments to collaborators even when routine tasks feel tedious."
    }
  },
  "ENFP-OH": {
    "code": "ENFP-OH",
    "base": "ENFP",
    "modifier": "OH",
    "title": {
      "th": "เพื่อนแท้ผู้รับฟังจากใจ",
      "en": "Heartfelt Catalyst"
    },
    "shadeLabel": {
      "th": "เซนส์ไว & ใส่ใจทุกคน",
      "en": "Sensitive & Empathetic"
    },
    "tagline": {
      "th": "สัมผัสได้ถึงความรู้สึกที่ซ่อนอยู่ พร้อมอยู่เคียงข้างและให้กำลังใจเสมอ",
      "en": "Deeply attuned to emotional nuances, offering unconditional acceptance and spark."
    },
    "desc": {
      "th": "มีเรดาร์ตรวจจับความรู้สึกคนรอบข้างอย่างแม่นยำ เป็นเพื่อนที่เข้าใจคนอื่นอย่างลึกซึ้งและคอยเติมพลังใจ",
      "en": "Acutely tuned to interpersonal undercurrents, radiating warm empathy and lifting up spirits."
    },
    "strengths": {
      "th": [
        "เข้าอกเข้าใจเพื่อนแท้",
        "รับฟังและให้กำลังใจเก่ง",
        "สังเกตความรู้สึกละเอียด",
        "สร้างความรู้สึกปลอดภัย"
      ],
      "en": [
        "Profound friendship",
        "Uplifting listener",
        "Subtle emotion detector",
        "Psychological safety builder"
      ]
    },
    "growth": {
      "th": "ระวังเก็บอารมณ์ของทุกคนมาคิดมากจนนอนไม่หลับ ฝึกเคลียร์ใจก่อนนอน",
      "en": "Practice mental hygiene to unload others' worries before sleep."
    }
  },
  "ENFP-OC": {
    "code": "ENFP-OC",
    "base": "ENFP",
    "modifier": "OC",
    "title": {
      "th": "นักคิดสร้างสรรค์สายใคร่ครวญ",
      "en": "Soulful Innovator"
    },
    "shadeLabel": {
      "th": "คิดลึก & มีมุมเงียบ",
      "en": "Reflective & Creative"
    },
    "tagline": {
      "th": "ภายนอกสดใส แต่ข้างในคิดทบทวนชีวิตและค้นหาตัวตนที่แท้จริง",
      "en": "Bubbly on stage, deeply philosophical and exacting in their private creative lair."
    },
    "desc": {
      "th": "ภายนอกดูสดใส แต่มีมุมเงียบที่ชอบคิดวิเคราะห์ความหมายของชีวิต ตรวจทานงานสร้างสรรค์ของตัวเองอย่างละเอียด",
      "en": "Playful exterior concealing a rigorous, deeply reflective seeker refining their authentic craft."
    },
    "strengths": {
      "th": [
        "ความคิดสร้างสรรค์ตกผลึก",
        "เข้าใจมิติความรู้สึกลึกซึ้ง",
        "มีมาตรฐานในงานสูง",
        "มองโลกได้หลายมุมมอง"
      ],
      "en": [
        "Crystallized creative vision",
        "Nuanced emotional depth",
        "High personal craftsmanship",
        "Multi-perspective wisdom"
      ]
    },
    "growth": {
      "th": "อย่าปล่อยให้ความสงสัยในตัวเอง (Self-doubt) มาหยุดยั้งไม่ให้ปล่อยผลงานดีๆ",
      "en": "Don't let internal self-doubt block you from sharing valuable creative insights."
    }
  },
  "ISTJ-AH": {
    "code": "ISTJ-AH",
    "base": "ISTJ",
    "modifier": "AH",
    "title": {
      "th": "เสาหลักแห่งความสำเร็จ",
      "en": "Steadfast Leader"
    },
    "shadeLabel": {
      "th": "มั่นใจ & สื่อสารชัดเจน",
      "en": "Authoritative & Reliable"
    },
    "tagline": {
      "th": "บริหารจัดการระบบอย่างแม่นยำ พร้อมประสานงานให้ทุกฝ่ายทำงานราบรื่น",
      "en": "Executes procedures with total precision while keeping team alignment rock solid."
    },
    "desc": {
      "th": "เป็น ISTJ ที่มีความมั่นใจและสื่อสารกับทีมได้อย่างราบรื่น บริหารงานตามกฎเกณฑ์พร้อมสร้างความไว้วางใจให้ทุกคน",
      "en": "Authoritative yet approachable administrator, enforcing dependable standards while maintaining team buy-in."
    },
    "strengths": {
      "th": [
        "บริหารระบบแม่นยำ",
        "สื่อสารขั้นตอนชัดเจน",
        "รับผิดชอบงานสมบูรณ์แบบ",
        "เป็นที่ไว้วางใจ"
      ],
      "en": [
        "Precise operations",
        "Clear procedural communication",
        "Flawless reliability",
        "Institutional trust"
      ]
    },
    "growth": {
      "th": "เปิดรับวิธีทำงานแบบใหม่ๆ ที่ทีมเสนอ อย่าปฏิเสธเพียงเพราะไม่เคยทำมาก่อน",
      "en": "Be receptive to unconventional workflows proposed by team members."
    }
  },
  "ISTJ-AC": {
    "code": "ISTJ-AC",
    "base": "ISTJ",
    "modifier": "AC",
    "title": {
      "th": "ผู้พิทักษ์กฎเกณฑ์สายสตรอง",
      "en": "Ironclad Realist"
    },
    "shadeLabel": {
      "th": "นิ่งสนิท & ไม่หวั่นไหว",
      "en": "Unshakeable & Methodical"
    },
    "tagline": {
      "th": "ยึดมั่นในหน้าที่และข้อเท็จจริง ไม่สนคำวิจารณ์ ทำงานไร้ข้อผิดพลาด",
      "en": "Flawless execution of duty, completely unbothered by chaotic surroundings."
    },
    "desc": {
      "th": "นิ่งและมีวินัยสูงสุด ทำงานตามหน้าที่อย่างเคร่งครัด ไม่สนใจเสียงรบกวนภายนอก จัดการข้อมูลและระบบได้แม่นยำ",
      "en": "Rock-solid bastion of discipline and duty, executing systems with absolute integrity regardless of pressure."
    },
    "strengths": {
      "th": [
        "วินัยและสมาธิเป็นเลิศ",
        "ทำงานถูกต้องแม่นยำ 100%",
        "ไม่หวั่นไหวต่อแรงกดดัน",
        "ความซื่อสัตย์ในหน้าที่"
      ],
      "en": [
        "Ironclad discipline",
        "Near-zero error rate",
        "Extreme resilience under stress",
        "Uncompromising duty"
      ]
    },
    "growth": {
      "th": "เพิ่มความยืดหยุ่นในการสื่อสาร และอธิบายเหตุผลด้วยความเห็นอกเห็นใจมากขึ้น",
      "en": "Soften delivery tone when communicating procedural rules to creative peers."
    }
  },
  "ISTJ-OH": {
    "code": "ISTJ-OH",
    "base": "ISTJ",
    "modifier": "OH",
    "title": {
      "th": "ผู้ดูแลระบบผู้ใส่ใจ",
      "en": "Conscientious Guardian"
    },
    "shadeLabel": {
      "th": "รอบคอบ & แคร์เพื่อนร่วมงาน",
      "en": "Diligent & Considerate"
    },
    "tagline": {
      "th": "ตรวจเช็กงานอย่างละเอียดเพื่อไม่ให้ใครเดือดร้อน ใส่ใจความสบายใจของทีม",
      "en": "Double-checks every detail out of genuine care for the people relying on the system."
    },
    "desc": {
      "th": "ทำงานด้วยความรับผิดชอบและใส่ใจความรู้สึกเพื่อนร่วมงาน ตรวจสอบความถูกต้องอย่างละเอียดเพื่อความปลอดภัยของทุกคน",
      "en": "Meticulous steward who audits every detail specifically to safeguard the team's peace of mind."
    },
    "strengths": {
      "th": [
        "ตรวจเช็กความปลอดภัยละเอียด",
        "ใส่ใจผลกระทบต่อเพื่อนร่วมงาน",
        "มีความรับผิดชอบสูง",
        "สร้างความอุ่นใจให้ทีม"
      ],
      "en": [
        "Safety-first auditing",
        "Thoughtful team support",
        "High personal accountability",
        "Reassuring reliability"
      ]
    },
    "growth": {
      "th": "ระวังความกังวลเกินเหตุเรื่องข้อผิดพลาดเล็กๆ น้อยๆ จนทำให้เหนื่อยสะสม",
      "en": "Differentiate critical risks from minor cosmetic errors to conserve energy."
    }
  },
  "ISTJ-OC": {
    "code": "ISTJ-OC",
    "base": "ISTJ",
    "modifier": "OC",
    "title": {
      "th": "ผู้ตรวจทานความถูกต้องไร้ที่ติ",
      "en": "Exacting Archivist"
    },
    "shadeLabel": {
      "th": "คิดวน & ตรวจสอบไม่หยุด",
      "en": "Vigilant & Meticulous"
    },
    "tagline": {
      "th": "ตรวจทานทุกตัวเลขและขั้นตอนซ้ำๆ เพื่อให้แน่ใจว่าไม่มีข้อผิดพลาดแม้แต่น้อย",
      "en": "Private perfectionist of structure, auditing processes to absolute zero error."
    },
    "desc": {
      "th": "มีมาตรฐานความถูกต้องสูงสุด ตรวจทานรายละเอียดทุกเม็ดเงียบๆ ในหัว ปิดทุกช่องโหว่ของงานอย่างรัดกุม",
      "en": "Relentless internal quality controller, auditing data and workflows until complete zero defect is achieved."
    },
    "strengths": {
      "th": [
        "จับจุดผิดพลาดได้เฉียบคม",
        "ความถูกต้องของข้อมูลสูงสุด",
        "ความรับผิดชอบส่วนบุคคล",
        "การจัดเก็บข้อมูลเป็นระเบียบ"
      ],
      "en": [
        "Error detection genius",
        "Data precision",
        "Extreme thoroughness",
        "Flawless organization"
      ]
    },
    "growth": {
      "th": "อย่าแบกรับความรับผิดชอบไว้คนเดียวจนหมดแรง กล้าส่งต่องานให้คนอื่น",
      "en": "Delegate routine verifications instead of personally inspecting every single file."
    }
  },
  "ISFJ-AH": {
    "code": "ISFJ-AH",
    "base": "ISFJ",
    "modifier": "AH",
    "title": {
      "th": "ผู้อภิบาลผู้เข้มแข็ง",
      "en": "Gracious Pillar"
    },
    "shadeLabel": {
      "th": "มั่นใจ & อบอุ่นเสมอ",
      "en": "Steady & Nurturing"
    },
    "tagline": {
      "th": "ดูแลทุกคนด้วยความมั่นใจ สร้างความปลอดภัยและเป็นที่พึ่งให้คนรอบข้าง",
      "en": "Provides unconditional care and steady leadership with graceful confidence."
    },
    "desc": {
      "th": "เป็นเสาหลักที่อบอุ่นและมั่นใจ ดูแลความเป็นอยู่ของทุกคนอย่างทั่วถึง จัดการเรื่องยากๆ ให้ราบรื่นด้วยรอยยิ้ม",
      "en": "Gentle authority who protects and nurtures community welfare with quiet confidence and warmth."
    },
    "strengths": {
      "th": [
        "ดูแลทุกคนอย่างอบอุ่น",
        "จัดการงานเบื้องหลังยอดเยี่ยม",
        "เป็นที่พึ่งพาทางใจ",
        "สร้างความสามัคคี"
      ],
      "en": [
        "Nurturing leadership",
        "Logistical caretaking",
        "Emotional rock",
        "Group harmony"
      ]
    },
    "growth": {
      "th": "อย่าลืมหาเวลาพักผ่อนให้ตัวเองบ้าง อย่าปล่อยให้การดูแลคนอื่นมาเบียดเบียนเวลาส่วนตัว",
      "en": "Carve out protected private time away from family and work obligations."
    }
  },
  "ISFJ-AC": {
    "code": "ISFJ-AC",
    "base": "ISFJ",
    "modifier": "AC",
    "title": {
      "th": "ผู้พิทักษ์สันโดษ",
      "en": "Quiet Defender"
    },
    "shadeLabel": {
      "th": "นิ่งสงบ & ทำหน้าที่เงียบๆ",
      "en": "Peaceful & Resilient"
    },
    "tagline": {
      "th": "ทำหน้าที่ของตัวเองอย่างดีที่สุด ไม่เรียกร้องคำชม รักษาสันติสุขในใจ",
      "en": "Quietly does what is right, content with internal peace and dependable service."
    },
    "desc": {
      "th": "ทำหน้าที่อย่างเงียบๆ และมีประสิทธิภาพ ไม่ต้องการคำสรรเสริญ มั่นคงในความดีงามและรักษาสเปซของตัวเองได้ดี",
      "en": "Self-sufficient caretaker whose loyalty and support are rock-solid, requiring no applause."
    },
    "strengths": {
      "th": [
        "ความซื่อสัตย์และภักดี",
        "ทำงานรอบคอบเงียบๆ",
        "ไม่สร้างความขัดแย้ง",
        "พึ่งพาตัวเองได้ดี"
      ],
      "en": [
        "Loyalty & reliability",
        "Quiet diligence",
        "Zero drama generation",
        "Self-sufficiency"
      ]
    },
    "growth": {
      "th": "กล้าพูดความต้องการของตัวเองออกมาบ้าง อย่าเก็บความอึดอัดไว้คนเดียว",
      "en": "Voice your personal preferences instead of quietly accommodating everyone else."
    }
  },
  "ISFJ-OH": {
    "code": "ISFJ-OH",
    "base": "ISFJ",
    "modifier": "OH",
    "title": {
      "th": "ผู้เสียสละผู้เปี่ยมเมตตา",
      "en": "Tender Guardian"
    },
    "shadeLabel": {
      "th": "เซนส์ไว & แคร์ทุกคนสุดใจ",
      "en": "Ultra-Caring & Altruistic"
    },
    "tagline": {
      "th": "รับรู้ทุกความต้องการของคนอื่น พร้อมช่วยเหลือจนลืมคิดถึงตัวเอง",
      "en": "Anticipates every need of loved ones, pouring unending love into the group."
    },
    "desc": {
      "th": "มีหัวใจแห่งการเสียสละ ไวต่อความทุกข์และความต้องการของผู้อื่นเสมอ ทุ่มเทสุดกำลังเพื่อดูแลคนที่รัก",
      "en": "Boundless altruism and acute sensitivity, anticipating family and team needs before they are spoken."
    },
    "strengths": {
      "th": [
        "ความเมตตาและเสียสละ",
        "จำรายละเอียดของทุกคนได้แม่น",
        "ดูแลเอาใจใส่เป็นเลิศ",
        "สร้างบรรยากาศแห่งความรัก"
      ],
      "en": [
        "Boundless kindness",
        "Detail memory for loved ones",
        "Impeccable caregiving",
        "Loving atmosphere"
      ]
    },
    "growth": {
      "th": "ฝึกพูดคำว่า 'ไม่' และยอมรับว่าคุณไม่จำเป็นต้องรับผิดชอบความสุขของทุกคน",
      "en": "Practice setting hard limits on what you take on for others without apologizing."
    }
  },
  "ISFJ-OC": {
    "code": "ISFJ-OC",
    "base": "ISFJ",
    "modifier": "OC",
    "title": {
      "th": "ผู้ดูแลระบบความเรียบร้อย",
      "en": "Vigilant Caretaker"
    },
    "shadeLabel": {
      "th": "คิดวน & ระวังทุกจุด",
      "en": "Cautious & Thorough"
    },
    "tagline": {
      "th": "เตรียมพร้อมรับมือทุกสถานการณ์เงียบๆ เพื่อให้แน่ใจว่าคนที่รักจะปลอดภัย",
      "en": "Constantly anticipates risks in private, ensuring bulletproof safety for family and team."
    },
    "desc": {
      "th": "คิดป้องกันความเสี่ยงทุกขั้นตอนเงียบๆ ตรวจเช็กความเรียบร้อยเพื่อให้แน่ใจว่าทุกคนจะปลอดภัยและไม่มีเรื่องเดือดร้อน",
      "en": "Vigilantly monitors safety and practical details in silence, keeping domestic and workplace order intact."
    },
    "strengths": {
      "th": [
        "เตรียมพร้อมรับมือปัญหา",
        "รอบคอบและระมัดระวังสูง",
        "จัดระเบียบงานได้เรียบร้อย",
        "ความจงรักภักดี"
      ],
      "en": [
        "Proactive risk mitigation",
        "Extreme thoroughness",
        "Organizational neatness",
        "Deep loyalty"
      ]
    },
    "growth": {
      "th": "ปล่อยวางความกังวลใจในเรื่องที่ควบคุมไม่ได้ และเชื่อมั่นในความสามารถของผู้อื่น",
      "en": "Trust others to handle their own minor challenges without your constant safety net."
    }
  },
  "ESTJ-AH": {
    "code": "ESTJ-AH",
    "base": "ESTJ",
    "modifier": "AH",
    "title": {
      "th": "ผู้อำนวยการผู้ทรงพลัง",
      "en": "Commanding Organizer"
    },
    "shadeLabel": {
      "th": "มั่นใจ & รวมพลังทีม",
      "en": "Decisive & Team-Oriented"
    },
    "tagline": {
      "th": "จัดระเบียบและขับเคลื่อนโครงการใหญ่ พร้อมสร้างขวัญกำลังใจให้ทีมงาน",
      "en": "Drives operations with clear authority and motivating team camaraderie."
    },
    "desc": {
      "th": "เป็นผู้นำสายบริหารที่มั่นใจและเข้าถึงง่าย ขับเคลื่อนงานใหญ่ให้สำเร็จตามกำหนด พร้อมสร้างความสามัคคีในทีม",
      "en": "High-impact operational leader who combines ironclad structure with team spirit and clear recognition."
    },
    "strengths": {
      "th": [
        "บริหารโครงการขนาดใหญ่",
        "ตัดสินใจเด็ดขาดชัดเจน",
        "จัดสรรทรัพยากรมีประสิทธิภาพ",
        "สร้างแรงจูงใจให้ทีม"
      ],
      "en": [
        "Large-scale operations",
        "Decisive command",
        "Resource allocation",
        "Team motivation"
      ]
    },
    "growth": {
      "th": "ระวังการด่วนตัดสินใจเรื่องคน ควรรับฟังข้อคิดเห็นที่แตกต่างอย่างตั้งใจ",
      "en": "Listen patiently to minority viewpoints before finalizing operational procedures."
    }
  },
  "ESTJ-AC": {
    "code": "ESTJ-AC",
    "base": "ESTJ",
    "modifier": "AC",
    "title": {
      "th": "นายพลสายวินัยเหล็ก",
      "en": "Disciplined Enforcer"
    },
    "shadeLabel": {
      "th": "เด็ดขาด & มุ่งเป้าหมาย",
      "en": "Strict & Result-Driven"
    },
    "tagline": {
      "th": "ยึดมั่นในกฎระเบียบและความมีประสิทธิภาพ ไม่ยอมให้มีอะไรรั่วไหล",
      "en": "Rigorous enforcer of standard operating procedures, delivering spotless results."
    },
    "desc": {
      "th": "มุ่งมั่นในวินัยและความถูกต้อง 100% ไม่เสียเวลากับข้ออ้าง ควบคุมงานให้ได้ผลลัพธ์ตามมาตรฐานสูงสุด",
      "en": "No-nonsense champion of standard operating procedures, driving zero-tolerance execution under all conditions."
    },
    "strengths": {
      "th": [
        "วินัยเหล็กไร้ข้ออ้าง",
        "รักษามาตรฐานสูงสุด",
        "แก้ปัญหาหน้างานเฉียบขาด",
        "ส่งมอบงานตรงเวลาเสมอ"
      ],
      "en": [
        "Iron discipline",
        "Pristine operational bar",
        "Pragmatic problem solving",
        "Punctual delivery"
      ]
    },
    "growth": {
      "th": "ลดความตึงเครียดลงบ้าง เพิ่มการให้กำลังใจและความยืดหยุ่นในการทำงาน",
      "en": "Incorporate empathy into performance reviews to foster sustainable long-term loyalty."
    }
  },
  "ESTJ-OH": {
    "code": "ESTJ-OH",
    "base": "ESTJ",
    "modifier": "OH",
    "title": {
      "th": "ผู้จัดการผู้รับผิดชอบสูง",
      "en": "Dedicated Overseer"
    },
    "shadeLabel": {
      "th": "ละเอียด & แคร์ความเป็นธรรม",
      "en": "Conscientious & Fair"
    },
    "tagline": {
      "th": "บริหารงานอย่างเคร่งครัดเพื่อความเป็นธรรม และดูแลสวัสดิการของทุกคน",
      "en": "Balances hard administrative deadlines with a deep duty of care for workers."
    },
    "desc": {
      "th": "เป็น ESTJ ที่ละเอียดรอบคอบและแคร์ความรู้สึกของทีมมาก บริหารงานด้วยความยุติธรรมและใส่ใจสวัสดิภาพของทุกคน",
      "en": "Fair, detail-conscious administrator who treats worker wellbeing as an essential metric of success."
    },
    "strengths": {
      "th": [
        "บริหารด้วยความยุติธรรม",
        "ใส่ใจสวัสดิการทีมงาน",
        "รอบคอบในทุกขั้นตอน",
        "ความรับผิดชอบต่อส่วนรวม"
      ],
      "en": [
        "Ethical fairness",
        "Team welfare prioritization",
        "Comprehensive oversight",
        "Civic responsibility"
      ]
    },
    "growth": {
      "th": "ระวังการเครียดสะสมจากการพยายามทำให้ทุกอย่างเป๊ะและทุกคนพอใจพร้อมกัน",
      "en": "Accept that operational changes won't immediately please every single employee."
    }
  },
  "ESTJ-OC": {
    "code": "ESTJ-OC",
    "base": "ESTJ",
    "modifier": "OC",
    "title": {
      "th": "ผู้คุมระบบคุณภาพสูงสุด",
      "en": "Quality Controller"
    },
    "shadeLabel": {
      "th": "คิดรอบคอบ & คุมมาตรฐาน",
      "en": "Exacting & Methodical"
    },
    "tagline": {
      "th": "ตรวจเช็กขั้นตอนอย่างละเอียดถี่ถ้วนในหัว เพื่อไม่ให้เกิดความผิดพลาดในงาน",
      "en": "Audits every operational cog internally, demanding total systemic integrity."
    },
    "desc": {
      "th": "มีมาตรฐานการควบคุมคุณภาพที่เข้มงวด ตรวจสอบขั้นตอนการทำงานซ้ำๆ เพื่อให้มั่นใจว่าจะไม่มีข้อผิดพลาดเกิดขึ้น",
      "en": "Meticulous internal quality auditor who inspects operational gears until complete systemic resilience is achieved."
    },
    "strengths": {
      "th": [
        "การควบคุมคุณภาพยอดเยี่ยม",
        "ป้องกันความเสี่ยงแม่นยำ",
        "ความละเอียดรอบคอบ",
        "ยึดมั่นในความถูกต้อง"
      ],
      "en": [
        "Flawless QA standards",
        "Risk prevention",
        "Methodical thoroughness",
        "Procedural integrity"
      ]
    },
    "growth": {
      "th": "ระวังความวิตกกังวลเรื่องความผิดพลาดจนทำให้ปล่อยวางงานยาก",
      "en": "Trust trained team members to perform inspections without your redundant double-check."
    }
  },
  "ESFJ-AH": {
    "code": "ESFJ-AH",
    "base": "ESFJ",
    "modifier": "AH",
    "title": {
      "th": "หัวหน้าทีมผู้สร้างรอยยิ้ม",
      "en": "Radiant Host"
    },
    "shadeLabel": {
      "th": "มั่นใจ & เชื่อมสัมพันธ์เก่ง",
      "en": "Vibrant & Welcoming"
    },
    "tagline": {
      "th": "ดูแลทุกคนอย่างทั่วถึง จัดการทุกอย่างราบรื่นด้วยความมั่นใจและรอยยิ้ม",
      "en": "Masterfully organizes social and work gatherings, making everyone feel special."
    },
    "desc": {
      "th": "มีเสน่ห์และความมั่นใจในการสร้างบรรยากาศที่อบอุ่นและเป็นกันเอง จัดการงานกิจกรรมและดูแลผู้คนได้อย่างสมบูรณ์แบบ",
      "en": "Charismatic host and coordinator who orchestrates group harmony, making every member feel valued and energized."
    },
    "strengths": {
      "th": [
        "สร้างบรรยากาศอบอุ่น",
        "จัดการงานอีเวนต์ยอดเยี่ยม",
        "มนุษยสัมพันธ์ดีเลิศ",
        "ดูแลทุกคนอย่างทั่วถึง"
      ],
      "en": [
        "Hospitality excellence",
        "Event orchestration",
        "Exceptional charisma",
        "Inclusive attentiveness"
      ]
    },
    "growth": {
      "th": "ระวังให้ความสำคัญกับภาพลักษณ์ภายนอกจนละเลยความรู้สึกที่แท้จริงข้างใน",
      "en": "Ensure inner authenticity isn't sacrificed for superficial external harmony."
    }
  },
  "ESFJ-AC": {
    "code": "ESFJ-AC",
    "base": "ESFJ",
    "modifier": "AC",
    "title": {
      "th": "ผู้ดูแลสายสตรองไม่หวั่นไหว",
      "en": "Pragmatic Caretaker"
    },
    "shadeLabel": {
      "th": "มั่นคง & พึ่งพาได้จริง",
      "en": "Reliable & Grounded"
    },
    "tagline": {
      "th": "ช่วยเหลือทุกคนด้วยการกระทำที่เป็นรูปธรรม ไม่เสียเวลากับดราม่า",
      "en": "Delivers tangible everyday support without getting sucked into emotional politics."
    },
    "desc": {
      "th": "ดูแลทุกคนด้วยความมั่นคงและเน้นการปฏิบัติจริง ไม่เอาดราม่ามาใส่ใจ เป็นที่พึ่งที่มั่นคงและไว้ใจได้เสมอ",
      "en": "Practical, grounded helper who delivers real everyday assistance without drama or fuss."
    },
    "strengths": {
      "th": [
        "ช่วยเหลืออย่างเป็นรูปธรรม",
        "ไม่หวั่นไหวต่อดราม่า",
        "ความรับผิดชอบสูง",
        "บริหารจัดการชีวิตได้ดี"
      ],
      "en": [
        "Tangible practical support",
        "Drama immunity",
        "Rock-solid reliability",
        "Daily logistical order"
      ]
    },
    "growth": {
      "th": "เปิดใจรับฟังเมื่อคนอื่นต้องการระบายอารมณ์ แม้จะยังไม่มีทางแก้ปัญหาในทันที",
      "en": "Offer pure emotional listening even when immediate practical fixes aren't feasible."
    }
  },
  "ESFJ-OH": {
    "code": "ESFJ-OH",
    "base": "ESFJ",
    "modifier": "OH",
    "title": {
      "th": "นางฟ้าผู้แคร์ความรู้สึกทุกคน",
      "en": "Empathetic Heart"
    },
    "shadeLabel": {
      "th": "เซนส์ไว & ใส่ใจทุกรายละเอียด",
      "en": "Ultra-Harmonizer & Caring"
    },
    "tagline": {
      "th": "รับรู้ทันทีหากมีใครในกลุ่มรู้สึกไม่ดี พร้อมเข้าไปดูแลและปลอบโยน",
      "en": "Acutely registers every social nuance, striving to ensure absolute warmth and unity."
    },
    "desc": {
      "th": "มีเซนส์ในการจับความรู้สึกคนรอบข้างอย่างยอดเยี่ยม ทุ่มเทดูแลทุกคนเพื่อให้กลุ่มมีความสุขและรักกัน",
      "en": "Acutely tuned to every social ripple, pouring energy into comforting anyone who feels isolated or distressed."
    },
    "strengths": {
      "th": [
        "เซนส์ความรู้สึกแม่นยำ",
        "ปลอบโยนและดูแลเอาใจใส่",
        "สร้างความสามัคคีในกลุ่ม",
        "เสียสละเพื่อส่วนรวม"
      ],
      "en": [
        "Interpersonal antenna",
        "Empathetic comfort",
        "Group bonding",
        "Selfless devotion"
      ]
    },
    "growth": {
      "th": "ระวังคิดมากกับคำพูดหรือท่าทีเล็กๆ น้อยๆ ของคนอื่น จนทำให้ใจไม่สงบ",
      "en": "Don't over-analyze subtle shifts in tone; not every quiet mood is about you."
    }
  },
  "ESFJ-OC": {
    "code": "ESFJ-OC",
    "base": "ESFJ",
    "modifier": "OC",
    "title": {
      "th": "ผู้ประสานงานผู้ใคร่ครวญ",
      "en": "Reflective Coordinator"
    },
    "shadeLabel": {
      "th": "คิดวน & ใส่ใจคุณภาพงาน",
      "en": "Deliberate & Attentive"
    },
    "tagline": {
      "th": "ทบทวนการจัดงานและความต้องการของทุกคนเงียบๆ เพื่อให้งานออกมาสมบูรณ์แบบ",
      "en": "Privately checks every social and practical arrangement to avoid letting anyone down."
    },
    "desc": {
      "th": "คิดทบทวนการดูแลทุกคนอย่างละเอียดในใจ มีมาตรฐานสูงและพยายามทำทุกอย่างให้ราบรื่นไร้ที่ติ",
      "en": "Reflective organizer who double-checks arrangements in private to ensure no participant is overlooked."
    },
    "strengths": {
      "th": [
        "การเตรียมงานที่ไร้ที่ติ",
        "ใส่ใจความต้องการส่วนบุคคล",
        "รอบคอบในทุกรายละเอียด",
        "ความซื่อสัตย์ในหน้าที่"
      ],
      "en": [
        "Spotless event prep",
        "Attentive personal touches",
        "Methodical diligence",
        "Faithful service"
      ]
    },
    "growth": {
      "th": "อย่ากลัวความผิดพลาดจนไม่กล้าลงมือทำ จำไว้ว่าความตั้งใจดีมีค่าเสมอ",
      "en": "Let go of perfectionist anxieties; people appreciate genuine care over rigid execution."
    }
  },
  "ISTP-AH": {
    "code": "ISTP-AH",
    "base": "ISTP",
    "modifier": "AH",
    "title": {
      "th": "ช่างแก้วิกฤตผู้มั่นใจ",
      "en": "Tactical Troubleshooter"
    },
    "shadeLabel": {
      "th": "มั่นใจ & แก้ปัญหาไว",
      "en": "Skillful & Action-Ready"
    },
    "tagline": {
      "th": "เข้าควบคุมสถานการณ์คับขันทันที สื่อสารกระชับและแก้ปัญหาตรงจุด",
      "en": "Steps into chaos with cool confidence, fixing critical breakdowns in real time."
    },
    "desc": {
      "th": "มั่นใจในฝีมือและทักษะการแก้ปัญหา สื่อสารสั้นกระชับได้ใจความ นำพาผู้คนผ่านพ้นช่วงวิกฤตได้อย่างสบายๆ",
      "en": "Decisive, hands-on crisis fixer who diagnoses mechanical or system failures in seconds and coordinates rapid fixes."
    },
    "strengths": {
      "th": [
        "แก้ปัญหาวิกฤตเฉียบขาด",
        "ทักษะช่างและเครื่องมือยอดเยี่ยม",
        "สื่อสารกระชับตรงจุด",
        "ควบคุมอารมณ์ได้ดี"
      ],
      "en": [
        "Crisis diagnosis",
        "Elite technical craftsmanship",
        "Crisp direct communication",
        "Grace under pressure"
      ]
    },
    "growth": {
      "th": "อธิบายขั้นตอนให้คนอื่นเข้าใจบ้าง เพื่อให้ทีมสามารถดูแลระบบต่อได้",
      "en": "Document solutions so team members can maintain fixes without needing your emergency presence."
    }
  },
  "ISTP-AC": {
    "code": "ISTP-AC",
    "base": "ISTP",
    "modifier": "AC",
    "title": {
      "th": "สไนเปอร์สายลุยเดี่ยว",
      "en": "Lone Craftsman"
    },
    "shadeLabel": {
      "th": "นิ่งสนิท & สกิลเทพ",
      "en": "Unshakable & Independent"
    },
    "tagline": {
      "th": "เก่งในเครื่องมือและระบบ ไม่แคร์สายตาใคร ชิลกับชีวิตในแบบของตัวเอง",
      "en": "Master of mechanics and physical tools, thriving in total solitary independence."
    },
    "desc": {
      "th": "นิ่ง สุขุม และมีทักษะเฉพาะตัวสูงมาก ทำงานเดี่ยวได้ทรงพลังที่สุด ไม่สนใจกระแสสังคมและดราม่า",
      "en": "Ultimate solitary craftsman; coolly masters complex tools and software with zero appetite for corporate politics."
    },
    "strengths": {
      "th": [
        "ความชำนาญทางเทคนิคสูงสุด",
        "นิ่งสงบในทุกสถานการณ์",
        "พึ่งพาตัวเอง 100%",
        "คิดแก้ปัญหาเชิงปฏิบัติ"
      ],
      "en": [
        "Mastery of physical/digital craft",
        "Unflappable calm",
        "Total self-reliance",
        "Pragmatic problem solver"
      ]
    },
    "growth": {
      "th": "อย่าสร้างกำแพงกับคนอื่นมากเกินไป สื่อสารความคืบหน้าให้เพื่อนร่วมงานทราบ",
      "en": "Provide brief status updates so teammates aren't left guessing where deliverables stand."
    }
  },
  "ISTP-OH": {
    "code": "ISTP-OH",
    "base": "ISTP",
    "modifier": "OH",
    "title": {
      "th": "ช่างฝีมือผู้ใส่ใจ",
      "en": "Considerate Specialist"
    },
    "shadeLabel": {
      "th": "เซนส์ไว & คอยช่วยเงียบๆ",
      "en": "Observant & Helpful"
    },
    "tagline": {
      "th": "สังเกตเห็นปัญหาของคนอื่นเงียบๆ และยื่นมือเข้าช่วยแก้ด้วยการกระทำ",
      "en": "Notices when people are stuck and quietly steps in with practical technical aid."
    },
    "desc": {
      "th": "สังเกตเห็นจุดติดขัดของคนอื่นเงียบๆ และยื่นมือเข้าช่วยแก้ปัญหาด้วยการกระทำมากกว่าคำพูด แคร์คนในแบบของตัวเอง",
      "en": "Quietly observes coworkers struggling with tools or workflows and steps in with practical, zero-ego assistance."
    },
    "strengths": {
      "th": [
        "ช่วยเหลือด้วยการกระทำ",
        "สังเกตปัญหาได้ไว",
        "ฝีมือประณีตใส่ใจ",
        "รับฟังอย่างเข้าใจ"
      ],
      "en": [
        "Action-first support",
        "Rapid impediment spotting",
        "Thoughtful workmanship",
        "Attentive listening"
      ]
    },
    "growth": {
      "th": "ระวังเก็บความหงุดหงิดไว้ในใจเมื่อคนอื่นไม่เข้าใจระบบ พูดคุยอย่างใจเย็น",
      "en": "Express frustrations early before minor workflow annoyances turn into silent resentment."
    }
  },
  "ISTP-OC": {
    "code": "ISTP-OC",
    "base": "ISTP",
    "modifier": "OC",
    "title": {
      "th": "นักปรับแต่งระบบผู้พิถีพิถัน",
      "en": "Precision Mechanic"
    },
    "shadeLabel": {
      "th": "คิดลึก & มาตรฐานช่างฝีมือ",
      "en": "Meticulous & Analytical"
    },
    "tagline": {
      "th": "ตรวจเช็กกลไกและชิ้นส่วนซ้ำๆ เพื่อให้ได้การทำงานที่ลื่นไหลไร้ที่ติ",
      "en": "Obsessively tunes engines, code, or hardware until mechanical perfection is reached."
    },
    "desc": {
      "th": "คิดวิเคราะห์กลไกในหัวอย่างละเอียด ปรับแต่งชิ้นงานและระบบซ้ำๆ เพื่อให้ได้ประสิทธิภาพสูงสุดระดับมาสเตอร์พีซ",
      "en": "Perfectionist craftsman who fine-tunes machines, algorithms, or tools until maximum operational elegance is achieved."
    },
    "strengths": {
      "th": [
        "ความละเอียดในงานเทคนิค",
        "เพิ่มประสิทธิภาพสูงสุด",
        "วิเคราะห์กลไกซับซ้อน",
        "ความอดทนในการแก้บั๊ก"
      ],
      "en": [
        "Technical precision",
        "Performance optimization",
        "Mechanistic insight",
        "Dogged debugging patience"
      ]
    },
    "growth": {
      "th": "ระวังติดอยู่กับการปรับแต่งรายละเอียดเล็กๆ จนไม่ได้ปล่อยผลงานออกใช้งานจริง",
      "en": "Know when a tool is 'good enough' to deploy rather than endlessly tweaking sub-features."
    }
  },
  "ISFP-AH": {
    "code": "ISFP-AH",
    "base": "ISFP",
    "modifier": "AH",
    "title": {
      "th": "ศิลปินผู้กล้าแสดงออก",
      "en": "Expressive Creator"
    },
    "shadeLabel": {
      "th": "มั่นใจ & เปี่ยมสไตล์",
      "en": "Confident & Aesthetic"
    },
    "tagline": {
      "th": "ถ่ายทอดความงดงามและตัวตนออกมาอย่างกล้าหาญ สร้างแรงบันดาลใจให้คนอื่น",
      "en": "Channels raw emotional aesthetic into bold creations that inspire the room."
    },
    "desc": {
      "th": "กล้าแสดงออกถึงรสนิยมและความเป็นตัวเอง สื่อสารความรู้สึกผ่านผลงานศิลปะ แฟชั่น หรือดนตรีได้อย่างน่าประทับใจ",
      "en": "Charismatic visual or sensory artist who expresses distinctive aesthetic identity with boldness and charm."
    },
    "strengths": {
      "th": [
        "รสนิยมศิลปะโดดเด่น",
        "กล้าแสดงออกอย่างมีสไตล์",
        "สร้างแรงบันดาลใจด้วยผลงาน",
        "เป็นมิตรและเข้าถึงง่าย"
      ],
      "en": [
        "Exquisite aesthetic eye",
        "Bold self-expression",
        "Inspiring visual craft",
        "Warm approachability"
      ]
    },
    "growth": {
      "th": "ระวังการตัดสินใจตามอารมณ์ชั่ววูบ วางแผนการเงินและการทำงานระยะยาว",
      "en": "Anchor spontaneous creative impulses with basic budgeting and long-term planning."
    }
  },
  "ISFP-AC": {
    "code": "ISFP-AC",
    "base": "ISFP",
    "modifier": "AC",
    "title": {
      "th": "นักผจญภัยผู้รักความสงบ",
      "en": "Serene Wanderer"
    },
    "shadeLabel": {
      "th": "ชิลจริง & มีพื้นที่ส่วนตัว",
      "en": "Tranquil & Free-Spirited"
    },
    "tagline": {
      "th": "ใช้ชีวิตอยู่กับปัจจุบัน สัมผัสธรรมชาติและความสงบโดยไม่สนใจกระแสโลก",
      "en": "Lives purely in the present moment, immersed in sensory harmony and self-sufficiency."
    },
    "desc": {
      "th": "ใช้ชีวิตเรียบง่าย อยู่กับธรรมชาติและปัจจุบันอย่างมีความสุข ไม่สนใจการแข่งขันหรือแรงกดดันทางสังคม",
      "en": "Tranquil sensory soul living in total harmony with the present moment, unfazed by rat-race pressures."
    },
    "strengths": {
      "th": [
        "ความสงบสุขภายใน",
        "ดื่มด่ำกับปัจจุบันขณะ",
        "เป็นตัวของตัวเองอย่างแท้จริง",
        "ปรับตัวกับธรรมชาติเก่ง"
      ],
      "en": [
        "Inner serenity",
        "Present-moment immersion",
        "Pure authenticity",
        "Organic adaptability"
      ]
    },
    "growth": {
      "th": "อย่าละเลยการวางแผนอนาคต ตั้งเป้าหมายระยะยาวที่สอดคล้องกับคุณค่าในใจ",
      "en": "Set gentle milestones for future financial and career stability."
    }
  },
  "ISFP-OH": {
    "code": "ISFP-OH",
    "base": "ISFP",
    "modifier": "OH",
    "title": {
      "th": "ผู้สัมผัสความงามผู้ละเอียดอ่อน",
      "en": "Sensitive Artisan"
    },
    "shadeLabel": {
      "th": "เซนส์ไว & ซึมซับอารมณ์ลึก",
      "en": "Deeply Feeling & Gentle"
    },
    "tagline": {
      "th": "ไวต่อความรู้สึกและความงามรอบตัว ถ่ายทอดความอ่อนโยนผ่านทุกผลงาน",
      "en": "Profoundly receptive to emotional beauty, creating deeply touching and empathetic art."
    },
    "desc": {
      "th": "มีความอ่อนไหวต่อสิ่งแวดล้อมและอารมณ์ของผู้คนอย่างลึกซึ้ง ถ่ายทอดความอบอุ่นและความเข้าใจผ่านทุกสิ่งที่ทำ",
      "en": "Hyper-sensitive artisan tuned to beauty and interpersonal atmosphere, infusing warmth into every craft."
    },
    "strengths": {
      "th": [
        "ความอ่อนโยนและเห็นอกเห็นใจ",
        "สร้างสรรค์งานที่ซาบซึ้งใจ",
        "สัมผัสความงามในสิ่งเล็กๆ",
        "เป็นผู้ฟังที่ดี"
      ],
      "en": [
        "Gentle empathy",
        "Emotionally touching craft",
        "Noticing subtle beauty",
        "Receptive listener"
      ]
    },
    "growth": {
      "th": "ระวังการเก็บคำวิจารณ์มาทำร้ายจิตใจตัวเอง แยกผลงานออกจากคุณค่าในตัวเรา",
      "en": "Separate critique of your work from your intrinsic worth as a human being."
    }
  },
  "ISFP-OC": {
    "code": "ISFP-OC",
    "base": "ISFP",
    "modifier": "OC",
    "title": {
      "th": "ศิลปินผู้ขัดเกลาผลงานในใจ",
      "en": "Introspective Artisan"
    },
    "shadeLabel": {
      "th": "คิดลึก & ตรวจสอบตัวตน",
      "en": "Reflective & Perfectionist"
    },
    "tagline": {
      "th": "ขัดเกลาผลงานและความรู้สึกในใจเงียบๆ จนกว่าจะตรงกับความจริงแท้ในใจ",
      "en": "Endlessly refines their artistic vision in solitude until it matches their inner soul."
    },
    "desc": {
      "th": "ใคร่ครวญและขัดเกลาผลงานในพื้นที่ส่วนตัวอย่างพิถีพิถัน มีมาตรฐานความงามในใจสูงและซื่อสัตย์ต่อจิตวิญญาณตัวเอง",
      "en": "Solitary perfectionist who crafts deeply personal work, holding creations to impossibly refined internal standards."
    },
    "strengths": {
      "th": [
        "ความประณีตในผลงาน",
        "ความซื่อสัตย์ต่อจิตวิญญาณ",
        "ความคิดใคร่ครวญลึกซึ้ง",
        "ความอดทนในงานฝีมือ"
      ],
      "en": [
        "Exquisite refinement",
        "Soulful integrity",
        "Deep artistic introspection",
        "Patient craftsmanship"
      ]
    },
    "growth": {
      "th": "กล้าเปิดเผยผลงานสู่สายตาคนภายนอก อย่าเก็บไว้ดูคนเดียวเพียงเพราะคิดว่ายังไม่สมบูรณ์",
      "en": "Overcome perfectionist shyness; share your art before you feel 100% ready."
    }
  },
  "ESTP-AH": {
    "code": "ESTP-AH",
    "base": "ESTP",
    "modifier": "AH",
    "title": {
      "th": "นักเจรจาผู้คว้าโอกาส",
      "en": "Charismatic Dynamo"
    },
    "shadeLabel": {
      "th": "มั่นใจ & เสน่ห์ล้นเหลือ",
      "en": "Fearless & Magnetic"
    },
    "tagline": {
      "th": "คว้าทุกโอกาสทองตรงหน้า ดึงดูดผู้คนด้วยความกล้าและพลังงานเต็มเปี่ยม",
      "en": "Seizes immediate opportunities with daring charm, driving deals and thrills."
    },
    "desc": {
      "th": "มีเสน่ห์และพลังงานล้นเหลือ คว้าโอกาสเก่ง เจรจาต่อรองได้ยอดเยี่ยม และพาผู้คนลุยสู่เป้าหมายด้วยความสนุก",
      "en": "Magnetic, high-velocity dealmaker who turns instant opportunities into lucrative, exciting adventures for all."
    },
    "strengths": {
      "th": [
        "คว้าโอกาสได้อย่างรวดเร็ว",
        "เจรจาต่อรองเป็นเลิศ",
        "กล้าตัดสินใจในภาวะวิกฤต",
        "สร้างความสนุกสนาน"
      ],
      "en": [
        "Rapid opportunity capture",
        "Master negotiator",
        "Crisis courage",
        "Electric enthusiasm"
      ]
    },
    "growth": {
      "th": "ระวังการมองข้ามผลกระทบระยะยาว คิดหน้าคิดหลังก่อนกระโจนเข้าใส่ความเสี่ยง",
      "en": "Weigh second-order consequences before jumping into high-risk shortcuts."
    }
  },
  "ESTP-AC": {
    "code": "ESTP-AC",
    "base": "ESTP",
    "modifier": "AC",
    "title": {
      "th": "นักผจญภัยสายแกร่ง",
      "en": "Iron Maverick"
    },
    "shadeLabel": {
      "th": "ไม่กลัวใคร & ลุยทันที",
      "en": "Tough & Action-Oriented"
    },
    "tagline": {
      "th": "พุ่งชนทุกความท้าทายด้วยความมั่นใจ ไม่หวั่นไหวต่ออุปสรรคและคำขู่",
      "en": "Tackles physical and situational danger without hesitation, completely self-reliant."
    },
    "desc": {
      "th": "กล้าได้กล้าเสีย ไม่กลัวความยากลำบาก ลุยเดี่ยวชนทุกปัญหาด้วยไหวพริบและความแข็งแกร่ง",
      "en": "Fearless, independent action engine who dives straight into challenges, thriving on pressure and physical courage."
    },
    "strengths": {
      "th": [
        "ความกล้าหาญไร้ขีดจำกัด",
        "ไหวพริบเอาตัวรอดเยี่ยม",
        "ลงมือทำทันทีโดยไม่รีรอ",
        "ความแกร่งทางจิตใจ"
      ],
      "en": [
        "Boundless courage",
        "Street-smart adaptability",
        "Immediate execution",
        "Tough mental grit"
      ]
    },
    "growth": {
      "th": "ระวังความใจร้อนและการข้ามขั้นตอนจนทำให้เกิดความผิดพลาดในรายละเอียด",
      "en": "Slow down slightly to verify compliance steps before executing high-impact actions."
    }
  },
  "ESTP-OH": {
    "code": "ESTP-OH",
    "base": "ESTP",
    "modifier": "OH",
    "title": {
      "th": "สายลุยผู้ดูแลพรรคพวก",
      "en": "Protective Dynamo"
    },
    "shadeLabel": {
      "th": "ไวต่อสถานการณ์ & ปกป้องเพื่อน",
      "en": "Alert & Loyal"
    },
    "tagline": {
      "th": "ลุยเต็มที่เพื่อความสนุกของกลุ่ม และคอยระวังความปลอดภัยให้ทุกคนเสมอ",
      "en": "Action-packed energy focused on making sure everyone has fun and stays safe."
    },
    "desc": {
      "th": "ลุยเต็มที่แต่มีเรดาร์คอยระวังความปลอดภัยให้คนในกลุ่ม ปกป้องเพื่อนฝูงและทำให้ทุกคนรู้สึกอุ่นใจ",
      "en": "Dynamic protector who brings the fun while constantly scanning situational safety for friends and family."
    },
    "strengths": {
      "th": [
        "ปกป้องเพื่อนฝูงสุดตัว",
        "ระวังความปลอดภัยเก่ง",
        "สร้างความสนุกสนาน",
        "ตัดสินใจช่วยคนได้ไว"
      ],
      "en": [
        "Fierce loyalty",
        "Situational awareness",
        "High team energy",
        "Swift intervention"
      ]
    },
    "growth": {
      "th": "ระวังการแบกรับความรับผิดชอบของคนอื่นจนตัวเองเหนื่อยเกินไป",
      "en": "Let friends solve their own avoidable dilemmas rather than always jumping in as the rescuer."
    }
  },
  "ESTP-OC": {
    "code": "ESTP-OC",
    "base": "ESTP",
    "modifier": "OC",
    "title": {
      "th": "นักอ่านเกมสายยุทธวิธี",
      "en": "Tactical Realist"
    },
    "shadeLabel": {
      "th": "ประเมินจังหวะ & แม่นยำ",
      "en": "Observant & Calculating"
    },
    "tagline": {
      "th": "มองดูสถานการณ์และคำนวณจังหวะในหัว ก่อนพุ่งเข้าทำแต้มอย่างเฉียบขาด",
      "en": "Watches dynamics like a hawk, calculating risks in seconds before striking with surgical timing."
    },
    "desc": {
      "th": "อ่านเกมขาด คำนวณความเสี่ยงและจังหวะเวลาในหัวอย่างเงียบๆ ก่อนลงมือจู่โจมหรือแก้ปัญหาได้อย่างแม่นยำ",
      "en": "Calculated tactical operator who assesses risk odds in silence before striking with surgical precision."
    },
    "strengths": {
      "th": [
        "อ่านสถานการณ์แม่นยำ",
        "คำนวณจังหวะเวลาลงตัว",
        "ลงมือทำตรงเป้าหมาย",
        "ความสุขุมในการเล่นเกม"
      ],
      "en": [
        "Sharp situational calculus",
        "Impeccable timing",
        "Surgical execution",
        "Tactical poise"
      ]
    },
    "growth": {
      "th": "อย่ารอจนเสียโอกาสทอง เมื่อคำนวณแล้วจงกล้าลงมือทำทันที",
      "en": "Avoid over-hedging; pull the trigger when odds reach favorable thresholds."
    }
  },
  "ESFP-AH": {
    "code": "ESFP-AH",
    "base": "ESFP",
    "modifier": "AH",
    "title": {
      "th": "ดาวเด่นผู้สร้างรอยยิ้ม",
      "en": "Dazzling Performer"
    },
    "shadeLabel": {
      "th": "มั่นใจ & แจกความสดใส",
      "en": "Radiant & Entertaining"
    },
    "tagline": {
      "th": "ส่องสว่างทุกเวทีด้วยความมั่นใจ เปลี่ยนทุกบรรยากาศให้กลายเป็นปาร์ตี้",
      "en": "Lights up every room effortlessly, bringing uninhibited joy and entertainment."
    },
    "desc": {
      "th": "เปล่งประกายด้วยความมั่นใจและเสน่ห์ ดึงดูดทุกคนด้วยเสียงหัวเราะและความสดใส เปลี่ยนทุกวันธรรมดาให้มีชีวิตชีวา",
      "en": "Magnetic entertainer whose radiant energy and warmth transform ordinary rooms into celebratory experiences."
    },
    "strengths": {
      "th": [
        "สร้างความสุขให้ทุกคน",
        "เสน่ห์และความมั่นใจสูง",
        "ปรับตัวเข้ากับผู้คนได้ไว",
        "สร้างบรรยากาศมีชีวิตชีวา"
      ],
      "en": [
        "Spreading pure joy",
        "High stage charisma",
        "Instant rapport building",
        "Lively atmosphere creation"
      ]
    },
    "growth": {
      "th": "ระวังการใช้จ่ายตามอารมณ์และการละเลยงานเอกสารหรือภาระหน้าที่สำคัญ",
      "en": "Set automated savings and routine reminders for administrative paperwork."
    }
  },
  "ESFP-AC": {
    "code": "ESFP-AC",
    "base": "ESFP",
    "modifier": "AC",
    "title": {
      "th": "สายชิลผู้รักความสนุก",
      "en": "Carefree Adventurer"
    },
    "shadeLabel": {
      "th": "สุขนิยม & ไม่แคร์ดราม่า",
      "en": "Hedonistic & Easygoing"
    },
    "tagline": {
      "th": "สนุกกับทุกวินาทีของชีวิต ไม่เอาเรื่องเครียดมาใส่ใจ เป็นตัวของตัวเองสุดๆ",
      "en": "Drinks life to the fullest without baggage, drama, or need for social approval."
    },
    "desc": {
      "th": "ใช้ชีวิตอย่างมีความสุขและผ่อนคลาย ไม่เก็บเรื่องเครียดมาคิด ไม่ต้องการการยอมรับจากใคร เป็นตัวของตัวเอง 100%",
      "en": "Unapologetic lover of life, enjoying food, travel, and music with complete independence and zero drama."
    },
    "strengths": {
      "th": [
        "มองโลกในแง่บวกเสมอ",
        "ไม่ยึดติดกับความเครียด",
        "เป็นตัวของตัวเองอย่างแท้จริง",
        "ปรับตัวเก่งในทุกสภาพแวดล้อม"
      ],
      "en": [
        "Unshakable positivity",
        "Stress immunity",
        "Pure authenticity",
        "Easy adaptability"
      ]
    },
    "growth": {
      "th": "อย่ามองข้ามปัญหาสุขภาพหรือหน้าที่ระยะยาว เผื่อเวลาให้การพัฒนาตัวเอง",
      "en": "Balance in-the-moment indulgence with steady investments in health and skills."
    }
  },
  "ESFP-OH": {
    "code": "ESFP-OH",
    "base": "ESFP",
    "modifier": "OH",
    "title": {
      "th": "หัวใจของกลุ่มผู้แสนอบอุ่น",
      "en": "Empathetic Spotlight"
    },
    "shadeLabel": {
      "th": "เซนส์ไว & แคร์ทุกคนในวง",
      "en": "Tender & Inclusive"
    },
    "tagline": {
      "th": "สร้างเสียงหัวเราะให้ทุกคน พร้อมคอยสังเกตและดึงคนที่เงียบเข้ามาร่วมสนุก",
      "en": "Brings infectious fun while subtly ensuring nobody in the room is left out or feeling down."
    },
    "desc": {
      "th": "เป็นจุดศูนย์กลางของความสนุกที่ใส่ใจทุกคนอย่างแท้จริง คอยสังเกตว่าใครรู้สึกเหงาและดึงเข้ามาเป็นส่วนหนึ่งเสมอ",
      "en": "Warm-hearted spotlight who uses their popularity to welcome and protect the quietest people in the room."
    },
    "strengths": {
      "th": [
        "ใส่ใจความรู้สึกทุกคน",
        "สร้างความกลมเกลียวในกลุ่ม",
        "มีน้ำใจและเอื้อเฟื้อ",
        "สร้างรอยยิ้มอย่างจริงใจ"
      ],
      "en": [
        "Deeply inclusive care",
        "Group cohesion builder",
        "Generous warmth",
        "Genuine smile generator"
      ]
    },
    "growth": {
      "th": "ระวังการเหนื่อยใจจากการพยายามทำให้ทุกคนในกลุ่มแฮปปี้ตลอดเวลา",
      "en": "Don't take it personally when someone simply wants to sit quietly and not socialize."
    }
  },
  "ESFP-OC": {
    "code": "ESFP-OC",
    "base": "ESFP",
    "modifier": "OC",
    "title": {
      "th": "นักสร้างสรรค์ผู้ซ่อนความลึกซึ้ง",
      "en": "Soulful Performer"
    },
    "shadeLabel": {
      "th": "คิดลึก & มีมุมจริงจัง",
      "en": "Reflective & Expressive"
    },
    "tagline": {
      "th": "ภายนอกดูสนุกสนาน แต่ในใจมีความคิดลึกซึ้งและตรวจทานอารมณ์ตัวเองเสมอ",
      "en": "High-energy entertainer on the outside, surprisingly reflective and self-evaluative within."
    },
    "desc": {
      "th": "ภายนอกดูสนุกสนาน แต่มีมุมเงียบที่คิดทบทวนชีวิตอย่างลึกซึ้ง ตรวจทานการกระทำและความรู้สึกของตัวเองเสมอ",
      "en": "Vibrant public persona paired with a surprisingly deep, self-evaluative private reflection on art and life."
    },
    "strengths": {
      "th": [
        "ความเข้าใจมนุษย์อย่างลึกซึ้ง",
        "ถ่ายทอดอารมณ์ได้หลายมิติ",
        "ทบทวนตัวเองเพื่อพัฒนา",
        "ความจริงใจในมิตรภาพ"
      ],
      "en": [
        "Multidimensional empathy",
        "Rich emotional expression",
        "Constructive self-reflection",
        "Sincere friendship"
      ]
    },
    "growth": {
      "th": "อย่าแอบเก็บความกังวลไว้คนเดียว กล้าพูดคุยกับเพื่อนสนิทที่ไว้ใจได้",
      "en": "Confide your private fears to trusted confidantes instead of always wearing a smiling mask."
    }
  }
};

const ALL_CODES = (() => {
  const order = ['INTJ', 'INTP', 'ENTJ', 'ENTP', 'INFJ', 'INFP', 'ENFJ', 'ENFP',
                 'ISTJ', 'ISFJ', 'ESTJ', 'ESFJ', 'ISTP', 'ISFP', 'ESTP', 'ESFP'];
  const out = [];
  order.forEach(base => ['AH', 'AC', 'OH', 'OC'].forEach(v => out.push(`${base}-${v}`)));
  return out;
})();

window.PRISM_DATA = { DIMENSIONS, SPECTRA, CORE_TYPES, VARIANTS, SHADES_64, ALL_CODES };
