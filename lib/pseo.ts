export type PseoPageStatus = 'pilot';

type SharedPseoFields = {
  slug: string;
  name: string;
  title: string;
  intent: string;
  buyer: string;
  context: string;
  workflow: string[];
  deliverables: string[];
  evidence: string[];
  readiness: string;
  serviceSlug: string;
  status: PseoPageStatus;
};

export type PseoService = SharedPseoFields & {
  kind: 'service';
  description: string;
  agencySlug: string;
  industries: string[];
  problems: string[];
};

export type PseoIndustry = SharedPseoFields & {
  kind: 'industry';
  serviceSlug: 'ai-automation-workflow-sprint';
  problems: string[];
};

export type PseoProblem = SharedPseoFields & {
  kind: 'problem';
  serviceSlug: 'ai-automation-workflow-sprint';
  industries: string[];
};

export const pseoService: PseoService = {
  kind: 'service',
  slug: 'ai-automation-workflow-sprint',
  name: 'AI Automation Workflow Sprint',
  title: 'ทำ AI Automation ให้เห็น workflow ที่วัดผลได้',
  description: 'เริ่มจาก process เดียว วัด baseline ออกแบบจุดควบคุม และส่ง prototype ที่ทีมตรวจรับได้',
  intent: 'ต้องการเริ่มทำ AI หรือ automation กับงานจริงโดยยังควบคุมขอบเขต ความเสี่ยง และการวัดผลได้',
  buyer: 'CTO, CIO, operations lead หรือเจ้าของ process ในองค์กรที่มีงานซ้ำและข้อมูลกระจัดกระจาย',
  context: 'บริการตั้งต้นของ Technology agency สำหรับการทดลอง workflow หนึ่งเส้นทาง ไม่ใช่โครงการย้ายระบบทั้งองค์กร',
  workflow: [
    'เลือก process เดียวและระบุคนที่รับผิดชอบผลลัพธ์',
    'เก็บ baseline, input, exception และ acceptance criteria ก่อนออกแบบ',
    'ออกแบบ automation พร้อม human review, data boundary และ rollback path',
    'ส่ง prototype และ evidence handoff ให้ทีมตัดสินใจรอบถัดไป',
  ],
  deliverables: [
    'process map และ baseline ที่ตรวจย้อนกลับได้',
    'workflow design พร้อมจุดอนุมัติและกรณีที่ต้องส่งให้คนตรวจ',
    'prototype หรือ integration slice ในขอบเขตที่ตกลง',
    'acceptance checklist และคำแนะนำสำหรับ pilot ถัดไป',
  ],
  evidence: [
    'ใช้หลักคิดจาก AI Trust readiness และระบบ automation ภายในเป็น evidence anchor',
    'ผลลัพธ์ของลูกค้าต้องถูกเก็บและอนุมัติแยกก่อนนำมาอ้างเป็น case study',
    'หน้านี้ไม่อ้าง productivity outcome, SLA หรือการรับรองด้านความปลอดภัย',
  ],
  readiness: 'สถานะ pilot: ต้องยืนยัน technology lead, process owner, baseline, privacy/security review และวิธีส่งมอบก่อนเปิด inquiry',
  serviceSlug: 'ai-automation-workflow-sprint',
  agencySlug: 'technology',
  industries: ['logistics', 'recruitment', 'b2b-software', 'finance-operations', 'manufacturing', 'professional-services'],
  problems: ['manual-reporting', 'document-processing', 'fragmented-data', 'approval-bottleneck', 'repetitive-customer-ops', 'knowledge-handoff'],
  status: 'pilot',
};

export const pseoIndustries: PseoIndustry[] = [
  {
    kind: 'industry', slug: 'logistics', name: 'Logistics', title: 'AI Automation สำหรับงาน Logistics',
    intent: 'ต้องการลดงานประสานงานและรายงานของทีม logistics โดยเริ่มจาก process ที่เห็นข้อมูลและ exception ชัดเจน',
    buyer: 'COO, logistics manager, fleet/warehouse lead และ operations analyst',
    context: 'งาน logistics มีข้อมูลจาก order, shipment, warehouse และคนหน้างานที่ไม่อยู่ในจังหวะเดียวกัน จึงต้องเริ่มจาก handoff ที่กำหนดขอบเขตได้',
    workflow: ['เลือก flow เช่น สรุปสถานะ shipment หรือ exception queue', 'แยก source of truth กับข้อมูลที่ต้องให้คนยืนยัน', 'ทำ prototype สำหรับสรุปและ route งานผิดปกติ', 'วัดเวลา handoff และความครบของ evidence ก่อนขยาย'],
    deliverables: ['process map ของ order-to-exception flow', 'field mapping และ exception taxonomy', 'prototype summary/triage พร้อม human review', 'acceptance checklist สำหรับ operations lead'],
    evidence: ['ใช้ข้อมูลตัวอย่างที่ได้รับอนุญาตหรือ synthetic data เท่านั้น', 'ไม่อ้างว่ามี fleet, warehouse หรือ integration กับผู้ให้บริการรายใดแล้ว', 'การวัดผลจริงต้องเกิดใน environment ของผู้ว่าจ้างและผ่าน consent'],
    readiness: 'เหมาะสำหรับ discovery เมื่อมี process owner, ตัวอย่างข้อมูลที่เปิดเผยได้ และเกณฑ์ความถูกต้องของ exception',
    serviceSlug: 'ai-automation-workflow-sprint', problems: ['manual-reporting', 'fragmented-data'], status: 'pilot',
  },
  {
    kind: 'industry', slug: 'recruitment', name: 'Recruitment', title: 'AI Automation สำหรับงาน Recruitment',
    intent: 'ต้องการลดงานคัดกรองและ handoff ใน recruitment โดยรักษา consent และ human decision ไว้ชัดเจน',
    buyer: 'เจ้าของ recruitment process, hiring manager, talent operations lead หรือ founder ของบริษัทจัดหาคน',
    context: 'ข้อมูลผู้สมัครมีความเป็นส่วนตัวและการตัดสินใจมีผลต่อคน จึงเหมาะกับ automation ที่ช่วยจัดระเบียบหลักฐานและส่งต่อให้คนตัดสินใจ',
    workflow: ['กำหนด role scorecard และข้อมูลที่อนุญาตให้ใช้', 'จัดโครงสร้าง evidence จากเอกสารหรือบันทึกที่ได้รับ consent', 'สร้าง shortlist handoff ที่บอก gap และ confidence อย่างชัดเจน', 'ทดสอบ false positive/negative กับ reviewer ก่อนใช้งานจริง'],
    deliverables: ['role scorecard และ field contract', 'candidate evidence template โดยไม่สร้างฐานข้อมูลข้าม purpose', 'review queue พร้อมเหตุผลที่ตรวจได้', 'consent, retention และ reviewer checklist'],
    evidence: ['ไม่ใช้ candidate data จริงในเว็บไซต์หรือ fixture', 'ผลลัพธ์การจ้างงานต้องมีหลักฐานและ permission แยกก่อนอ้าง', 'ระบบไม่ตัดสินใจแทน hiring manager'],
    readiness: 'ต้องมี consent/retention boundary, recruitment owner และ reviewer ที่อนุมัติเกณฑ์ก่อนเปิด inquiry',
    serviceSlug: 'ai-automation-workflow-sprint', problems: ['document-processing', 'approval-bottleneck'], status: 'pilot',
  },
  {
    kind: 'industry', slug: 'b2b-software', name: 'B2B Software', title: 'AI Automation สำหรับทีม B2B Software',
    intent: 'ต้องการทำให้ workflow ภายในทีม software มีข้อมูลและ acceptance ที่พร้อมทดลอง automation',
    buyer: 'CTO, product lead, engineering manager หรือ operations lead ของทีม B2B software',
    context: 'ทีม software มักมี ticket, document, product signal และ customer feedback หลายแหล่ง จึงต้องเริ่มจาก workflow เดียวที่มี owner และ outcome ชัด',
    workflow: ['เลือก workflow เช่น support triage, release note หรือ incident handoff', 'นิยาม source, confidence และ escalation rule', 'เชื่อมข้อมูลเฉพาะที่จำเป็นใน prototype', 'ทดสอบกับ reviewer และบันทึก failure mode ก่อน pilot'],
    deliverables: ['workflow contract และ acceptance examples', 'source-to-output mapping', 'prototype ที่มี traceable handoff', 'evaluation set ขนาดเล็กและ rollback note'],
    evidence: ['อ้างได้เฉพาะ repository-owned methods และ demo ที่ระบุชัดว่าเป็น demo', 'ไม่อ้างการลด ticket time หรือ SLA โดยไม่มีผลวัดจริง', 'ระบบ production และสิทธิ์เข้าถึงยังอยู่นอก pilot นี้'],
    readiness: 'เหมาะเมื่อมี process owner, representative examples และผู้ตรวจรับที่พร้อมทดสอบ output อย่างสม่ำเสมอ',
    serviceSlug: 'ai-automation-workflow-sprint', problems: ['knowledge-handoff', 'repetitive-customer-ops'], status: 'pilot',
  },
  {
    kind: 'industry', slug: 'finance-operations', name: 'Finance Operations', title: 'AI Automation สำหรับ Finance Operations',
    intent: 'ต้องการลดงานรายงานและกระทบยอดที่ทำซ้ำ โดยแยกตัวเลขจริง สมมติฐาน และรายการที่ต้องอนุมัติ',
    buyer: 'CFO, finance operations lead, controller หรือเจ้าของ reporting process',
    context: 'ข้อมูลการเงินมีความเสี่ยงด้านความถูกต้องและสิทธิ์ จึงควรเริ่มจาก reporting workflow ที่มี source และ reviewer ชัดเจน ไม่ให้ระบบอนุมัติแทนคน',
    workflow: ['ทำ inventory ของ source และ version ของตัวเลข', 'ระบุ reconciliation rule และรายการ exception', 'สร้าง draft report พร้อม citation ไปยัง source', 'ให้ finance reviewer ตรวจและบันทึก acceptance'],
    deliverables: ['reporting map และ data dictionary', 'exception/reconciliation checklist', 'draft report prototype พร้อม reviewer gate', 'control และ rollback note'],
    evidence: ['ไม่รับหรือแสดงข้อมูลการเงินจริงใน public repo', 'ไม่ให้คำแนะนำการลงทุนหรือรับรองความถูกต้องของบัญชี', 'ตัวเลขผลลัพธ์จริงต้องผ่าน owner และ audit boundary ของผู้ว่าจ้าง'],
    readiness: 'ต้องมี finance owner, source ที่อนุญาต, reviewer และ retention rule ก่อนเริ่มงานที่มีข้อมูลจริง',
    serviceSlug: 'ai-automation-workflow-sprint', problems: ['manual-reporting', 'approval-bottleneck'], status: 'pilot',
  },
  {
    kind: 'industry', slug: 'manufacturing', name: 'Manufacturing', title: 'AI Automation สำหรับงาน Manufacturing',
    intent: 'ต้องการเริ่ม automation จากงานรายงานหรือ handoff ในโรงงานโดยไม่ข้าม safety และ acceptance boundary',
    buyer: 'COO, plant manager, production planner, quality lead หรือ industrial operations owner',
    context: 'งานโรงงานมีข้อจำกัดด้านหน้างาน, downtime, quality และความปลอดภัย จึงควรเริ่มจาก information workflow ที่ไม่ควบคุมเครื่องจักรโดยตรง',
    workflow: ['เลือก information flow เช่น production summary หรือ quality exception', 'แยกข้อมูลจาก machine/control system กับข้อมูลเพื่อการตัดสินใจ', 'สร้าง prototype สำหรับสรุปและ route exception', 'ให้หน้างานตรวจ acceptance และ failure mode'],
    deliverables: ['current-state map และ field glossary', 'exception taxonomy ที่ทีมหน้างานใช้ร่วมกัน', 'read-only prototype สำหรับรายงานหรือ handoff', 'deployment boundary และ human sign-off checklist'],
    evidence: ['ไม่อ้างการควบคุมเครื่องจักรหรือการรับรอง safety', 'ใช้ synthetic/sample data ในการสาธิต', 'integration จริงต้องผ่าน site authorization และผู้เชี่ยวชาญที่เหมาะสม'],
    readiness: 'เริ่มได้เมื่อมี plant/process owner, site boundary, sample data ที่อนุญาต และ reviewer ด้าน safety/quality',
    serviceSlug: 'ai-automation-workflow-sprint', problems: ['manual-reporting', 'fragmented-data'], status: 'pilot',
  },
  {
    kind: 'industry', slug: 'professional-services', name: 'Professional Services', title: 'AI Automation สำหรับ Professional Services',
    intent: 'ต้องการลดเวลางานเอกสารและ handoff ของทีมที่ส่งมอบความรู้ โดยคง review และ client confidentiality',
    buyer: 'practice lead, managing partner, delivery lead หรือ operations manager',
    context: 'ทีมบริการวิชาชีพต้องส่งมอบงานจากเอกสาร บันทึกประชุม และ knowledge หลายชุด ความเสี่ยงหลักคือข้อมูลผิดบริบทและเปิดเผยเกินสิทธิ์',
    workflow: ['เลือก deliverable หรือ handoff เดียวที่มีรูปแบบซ้ำ', 'กำหนด source ที่อนุญาตและข้อมูลที่ต้อง redaction', 'สร้าง draft ที่มี source note และ reviewer checklist', 'วัด rework และเวลาตรวจโดยไม่อ้างผลลัพธ์เกินหลักฐาน'],
    deliverables: ['deliverable template และ source contract', 'redaction/permission checklist', 'drafting prototype พร้อม review queue', 'handoff guide และ rollback path'],
    evidence: ['ไม่ใช้เอกสาร client จริงใน public website', 'ไม่อ้างความลับทางวิชาชีพ ใบอนุญาต หรือผลลัพธ์ client', 'ทุก output ต้องมีผู้เชี่ยวชาญตรวจตามขอบเขต'],
    readiness: 'เหมาะเมื่อมี owner, approved sample, confidentiality boundary และ reviewer ที่พร้อมรับผิดชอบ output',
    serviceSlug: 'ai-automation-workflow-sprint', problems: ['document-processing', 'knowledge-handoff'], status: 'pilot',
  },
];

export const pseoProblems: PseoProblem[] = [
  {
    kind: 'problem', slug: 'manual-reporting', name: 'Manual Reporting', title: 'ลดงานรายงานที่ต้องทำซ้ำด้วย AI Automation',
    intent: 'มีทีมที่เสียเวลา copy, merge และสรุปรายงานซ้ำ แต่ยังต้องตรวจ source และอนุมัติผลลัพธ์ได้',
    buyer: 'operations lead, finance/reporting owner, project manager หรือทีมที่ต้องส่งรายงานเป็นรอบ',
    context: 'ปัญหาไม่ใช่แค่การเขียนรายงาน แต่คือ source, version, exception และคนอนุมัติยังเชื่อมกันไม่ครบ',
    workflow: ['วาด source-to-report flow และนับจุด copy/merge', 'กำหนด field ที่คำนวณได้กับ field ที่ต้องให้คนตรวจ', 'ทำ draft report ที่ชี้กลับ source', 'วัดเวลาและรายการแก้ไขในรอบทดลอง'],
    deliverables: ['reporting map และ field dictionary', 'draft generation prototype', 'citation และ reviewer checklist', 'baseline/acceptance record สำหรับรอบถัดไป'],
    evidence: ['ไม่มีตัวเลขประหยัดเวลาที่อ้างล่วงหน้า', 'ใช้ sample หรือ synthetic data จนกว่าจะมีขอบเขตข้อมูลที่อนุมัติ', 'การรับรองรายงานยังเป็นหน้าที่ของ owner'],
    readiness: 'ต้องมีตัวอย่างรายงานที่เปิดเผยได้ source owner และเกณฑ์ว่ารายงาน “ถูกต้องพอส่งต่อ” คืออะไร',
    serviceSlug: 'ai-automation-workflow-sprint', industries: ['logistics', 'finance-operations', 'manufacturing'], status: 'pilot',
  },
  {
    kind: 'problem', slug: 'document-processing', name: 'Document Processing', title: 'จัดการงานเอกสารซ้ำโดยมีคนตรวจรับ',
    intent: 'มีเอกสารหลายรูปแบบที่ต้องอ่าน ดึง field และส่งต่อ แต่ยังไม่พร้อมปล่อยให้ระบบตัดสินใจเอง',
    buyer: 'operations, recruitment, delivery หรือ compliance owner ที่มี document-heavy workflow',
    context: 'คุณค่าหลักอยู่ที่การจัดโครงสร้างและทำให้ gap เห็นชัด ไม่ใช่การซ่อน uncertainty ของ extraction',
    workflow: ['จัดกลุ่มเอกสารและ field ที่ต้องการ', 'กำหนด confidence และกรณีส่งให้คนตรวจ', 'สร้าง extraction + handoff prototype', 'ประเมินตัวอย่างผิดพลาดและปรับ acceptance'],
    deliverables: ['document schema และ field rules', 'review queue พร้อม confidence', 'redaction/retention checklist', 'evaluation set และ known failure modes'],
    evidence: ['ไม่ประมวลผลเอกสารส่วนบุคคลจริงใน repo นี้', 'ผล accuracy ต้องวัดกับชุดข้อมูลที่เจ้าของอนุญาต', 'ระบบไม่ควรลบหรือแก้เอกสารต้นฉบับโดยอัตโนมัติ'],
    readiness: 'ต้องมี sample ที่อนุญาต, data owner, retention rule และ reviewer ที่นิยาม false positive/negative ได้',
    serviceSlug: 'ai-automation-workflow-sprint', industries: ['recruitment', 'professional-services'], status: 'pilot',
  },
  {
    kind: 'problem', slug: 'fragmented-data', name: 'Fragmented Data', title: 'เชื่อมข้อมูลกระจัดกระจายให้ทีมตัดสินใจได้',
    intent: 'ข้อมูลอยู่หลายไฟล์หรือหลายระบบจนคนต้องรวมเองก่อนเห็นสถานะหรือ exception',
    buyer: 'operations analyst, product/engineering lead, COO หรือ data owner',
    context: 'เริ่มจากการทำ contract และ read-only view ก่อนเปลี่ยนระบบต้นทาง เพื่อลดความเสี่ยงจากข้อมูลไม่ตรงกัน',
    workflow: ['ระบุ source, owner และความถี่อัปเดต', 'ทำ canonical field และ conflict rule', 'สร้าง read-only summary หรือ exception view', 'ตรวจ freshness และ lineage กับเจ้าของข้อมูล'],
    deliverables: ['source inventory และ data contract', 'mapping/conflict matrix', 'read-only prototype พร้อม freshness note', 'handoff และ rollback guide'],
    evidence: ['ไม่สร้าง source of truth ใหม่โดยไม่มี owner', 'ไม่อ้าง real-time หรือ completeness โดยไม่วัด', 'ข้อมูล private ต้องอยู่ในระบบของผู้ว่าจ้างและไม่เข้า public repo'],
    readiness: 'ต้องมี data owner, access boundary, sample ที่อนุญาต และนิยาม freshness ที่ยอมรับได้',
    serviceSlug: 'ai-automation-workflow-sprint', industries: ['logistics', 'manufacturing'], status: 'pilot',
  },
  {
    kind: 'problem', slug: 'approval-bottleneck', name: 'Approval Bottleneck', title: 'ทำให้ approval workflow เห็นข้อมูลครบก่อนตัดสินใจ',
    intent: 'งานค้างเพราะผู้อนุมัติต้องไล่หาหลักฐานและข้อยกเว้นจากหลายที่',
    buyer: 'process owner, finance lead, hiring manager, compliance lead หรือ project sponsor',
    context: 'automation ควรเตรียม evidence และ route งาน ไม่ควรข้ามผู้มีอำนาจอนุมัติหรือเปลี่ยน policy เอง',
    workflow: ['ระบุ approval decision และ required evidence', 'จัดโครงสร้าง request, exception และ owner', 'สร้าง approval packet ที่ตรวจ source ได้', 'ทดสอบ missing data และ escalation path'],
    deliverables: ['decision/evidence matrix', 'approval packet prototype', 'exception and escalation rules', 'acceptance และ audit handoff checklist'],
    evidence: ['ไม่อ้างว่า automation อนุมัติแทนคน', 'policy และ authority ต้องมาจากเจ้าของกระบวนการ', 'ไม่มีข้อมูลธุรกรรมหรือบุคคลจริงใน public content'],
    readiness: 'ต้องมีผู้มีอำนาจอนุมัติ, policy ที่ใช้อยู่ และตัวอย่าง decision ที่ redact แล้ว',
    serviceSlug: 'ai-automation-workflow-sprint', industries: ['recruitment', 'finance-operations'], status: 'pilot',
  },
  {
    kind: 'problem', slug: 'repetitive-customer-ops', name: 'Repetitive Customer Operations', title: 'ลดงาน customer operations ที่วนซ้ำโดยมี escalation',
    intent: 'ทีม support หรือ customer ops ตอบคำถามเดิมและจัดประเภทเคสซ้ำ แต่เคสเสี่ยงต้องส่งให้คนดู',
    buyer: 'customer operations lead, support manager, product operations หรือ service owner',
    context: 'เริ่มจาก classification, drafting และ routing ที่มี source note ไม่เริ่มจาก bot ที่ตอบได้ทุกเรื่อง',
    workflow: ['จัดกลุ่มคำถามและ define escalation', 'เลือก knowledge source ที่อนุญาต', 'ทำ draft/recommendation พร้อม confidence', 'review เคสยากและวัด rework'],
    deliverables: ['intent taxonomy และ escalation map', 'draft response/routing prototype', 'knowledge source checklist', 'evaluation examples และ rollback note'],
    evidence: ['ไม่อ้าง resolution rate หรือ SLA โดยไม่มีผลวัด', 'ไม่เปิดเผยบทสนทนาลูกค้าหรือข้อมูลส่วนบุคคล', 'ผู้ปฏิบัติงานยังเป็นผู้รับผิดชอบการตอบและ escalation'],
    readiness: 'ต้องมี owner, approved knowledge source, privacy review และเกณฑ์เคสที่ห้ามตอบอัตโนมัติ',
    serviceSlug: 'ai-automation-workflow-sprint', industries: ['b2b-software'], status: 'pilot',
  },
  {
    kind: 'problem', slug: 'knowledge-handoff', name: 'Knowledge Handoff', title: 'ลดความรู้ตกหล่นระหว่างทีมและรอบส่งมอบ',
    intent: 'ความรู้กระจายอยู่ในเอกสาร ticket หรือคน ทำให้ทีมถัดไปเริ่มใหม่และตรวจบริบทซ้ำ',
    buyer: 'engineering manager, delivery lead, practice lead, operations manager หรือ project owner',
    context: 'automation ควรทำให้ handoff มีโครงสร้างและชี้ source ได้ โดยให้เจ้าของความรู้ตรวจเนื้อหาก่อนส่งต่อ',
    workflow: ['กำหนด handoff event และ required context', 'จัด source, decision และ open question', 'สร้าง handoff packet ที่มี owner และ timestamp', 'ทดลองกับ reviewer และบันทึก gap ที่ยังต้องปิด'],
    deliverables: ['handoff schema และ template', 'source-linked summary prototype', 'open-question/owner register', 'review และ retention checklist'],
    evidence: ['ไม่อ้างว่า summary ครบถ้วนโดยไม่ตรวจ', 'ข้อมูล client, candidate และ incident ไม่เข้ามาใน public repo', 'ผู้เชี่ยวชาญยังรับผิดชอบการยืนยันบริบท'],
    readiness: 'ต้องมี process owner, approved examples และ reviewer ที่ตัดสินได้ว่า context ใดจำเป็นต่อการส่งต่อ',
    serviceSlug: 'ai-automation-workflow-sprint', industries: ['b2b-software', 'professional-services'], status: 'pilot',
  },
];

export function getPseoService(slug: string) {
  return slug === pseoService.slug ? pseoService : undefined;
}

export function getPseoIndustry(industrySlug: string, serviceSlug: string) {
  return pseoIndustries.find((item) => item.slug === industrySlug && item.serviceSlug === serviceSlug);
}

export function getPseoProblem(problemSlug: string, serviceSlug: string) {
  return pseoProblems.find((item) => item.slug === problemSlug && item.serviceSlug === serviceSlug);
}

export const pseoPilotPaths = [
  `/services/${pseoService.slug}`,
  ...pseoIndustries.map((item) => `/industries/${item.slug}/${item.serviceSlug}`),
  ...pseoProblems.map((item) => `/solutions/${item.slug}/${item.serviceSlug}`),
] as const;
