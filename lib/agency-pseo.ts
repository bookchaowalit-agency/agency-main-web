import { agencies, type AgencyVertical } from '@/lib/agency-portfolio';

export type AgencyPseoService = {
  kind: 'service';
  slug: string;
  name: string;
  title: string;
  description: string;
  intent: string;
  buyer: string;
  context: string;
  workflow: string[];
  deliverables: string[];
  evidence: string[];
  readiness: string;
  serviceSlug: string;
  agencySlug: string;
  status: 'pilot';
};

type ServiceBlueprint = Omit<AgencyPseoService, 'kind' | 'slug' | 'name' | 'buyer' | 'serviceSlug' | 'agencySlug' | 'status'> & {
  serviceSlug: string;
};

const blueprints: Record<AgencyVertical['slug'], ServiceBlueprint> = {
  talent: {
    serviceSlug: 'technical-recruitment-pilot',
    title: 'Technical Recruitment สำหรับทีมที่ต้องการคนสำคัญ',
    description: 'เริ่มจาก role scorecard และ evidence pack เพื่อให้การคัดเลือก senior technical talent ตรวจสอบได้',
    intent: 'ต้องการหาคน backend, data หรือ AI ที่ตรงกับงานจริง โดยไม่ตัดสินจาก CV เพียงอย่างเดียว',
    context: 'เริ่มจาก search pilot หนึ่งตำแหน่งที่มี scorecard, consent และ hiring owner ชัดเจน ไม่ใช่ marketplace หรือฐานข้อมูลผู้สมัคร',
    workflow: ['กำหนด role scorecard, must-have และ evidence ที่ยอมรับได้', 'เก็บข้อมูลผู้สมัครเท่าที่ได้รับ consent และตรวจความครบของหลักฐาน', 'ทำ shortlist 5–8 รายพร้อม gap และคำถามสำหรับ interview', 'ส่ง evidence pack ให้ hiring manager ตัดสินใจและบันทึก feedback'],
    deliverables: ['role scorecard และ candidate evidence template', 'consented shortlist พร้อมเหตุผลที่ตรวจได้', 'interview handoff และ open-question register', 'consent, retention และ reviewer checklist'],
    evidence: ['ไม่มี candidate data จริงใน public website หรือ fixture', 'ไม่อ้าง placement, hiring outcome หรือเครือข่ายผู้สมัครที่ยังไม่มีหลักฐาน', 'การตัดสินใจรับคนยังเป็นของ hiring manager'],
    readiness: 'ต้องมี talent owner, role brief, consent/retention boundary และ reviewer ก่อนเปิด inquiry',
  },
  'cyber-security': {
    serviceSlug: 'security-readiness-assessment',
    title: 'Security Readiness Assessment สำหรับระบบที่ต้องลดความเสี่ยง',
    description: 'ทบทวนระบบหนึ่งขอบเขต จัดลำดับความเสี่ยง และส่ง remediation map ที่ตรวจซ้ำได้',
    intent: 'ต้องการรู้ว่าความเสี่ยงของระบบดิจิทัลหรือ cyber-physical อยู่ตรงไหนและควรแก้อะไรก่อน',
    context: 'เริ่มจาก authorized scope และหลักฐานที่ตรวจได้ ไม่ใช่ managed security, 24/7 response หรือการทดสอบระบบโดยไม่มี permission',
    workflow: ['ยืนยัน asset, authorization และขอบเขตการตรวจ', 'รวบรวม control, evidence และ known exception', 'จัดลำดับ impact, likelihood และ remediation owner', 'ส่ง remediation map พร้อมวิธีทบทวนซ้ำ'],
    deliverables: ['scope และ authorization record', 'risk/control/evidence map', 'prioritized remediation backlog', 'readout สำหรับ CISO/CIO และ review checklist'],
    evidence: ['ไม่เปิดเผย threat data หรือ system details บน public website', 'ไม่อ้าง certification, penetration test หรือ 24/7 monitoring', 'ผลการประเมินจริงต้องมาจาก authorized environment และผู้มีคุณสมบัติเหมาะสม'],
    readiness: 'ต้องมี security lead, system owner, written authorization และวิธีจัดการข้อมูลลับก่อนเริ่มงาน',
  },
  technology: {
    serviceSlug: 'ai-automation-workflow-sprint',
    title: 'ทำ AI Automation ให้เห็น workflow ที่วัดผลได้',
    description: 'เริ่มจาก process เดียว วัด baseline ออกแบบจุดควบคุม และส่ง prototype ที่ทีมตรวจรับได้',
    intent: 'ต้องการเริ่มทำ AI หรือ automation กับงานจริงโดยยังควบคุมขอบเขต ความเสี่ยง และการวัดผลได้',
    context: 'บริการตั้งต้นของ Technology agency สำหรับการทดลอง workflow หนึ่งเส้นทาง ไม่ใช่โครงการย้ายระบบทั้งองค์กร',
    workflow: ['เลือก process เดียวและระบุคนที่รับผิดชอบผลลัพธ์', 'เก็บ baseline, input, exception และ acceptance criteria ก่อนออกแบบ', 'ออกแบบ automation พร้อม human review, data boundary และ rollback path', 'ส่ง prototype และ evidence handoff ให้ทีมตัดสินใจรอบถัดไป'],
    deliverables: ['process map และ baseline ที่ตรวจย้อนกลับได้', 'workflow design พร้อมจุดอนุมัติและกรณีที่ต้องส่งให้คนตรวจ', 'prototype หรือ integration slice ในขอบเขตที่ตกลง', 'acceptance checklist และคำแนะนำสำหรับ pilot ถัดไป'],
    evidence: ['ใช้หลักคิดจาก AI Trust readiness และระบบ automation ภายในเป็น evidence anchor', 'ผลลัพธ์ของลูกค้าต้องถูกเก็บและอนุมัติแยกก่อนนำมาอ้างเป็น case study', 'หน้านี้ไม่อ้าง productivity outcome, SLA หรือการรับรองด้านความปลอดภัย'],
    readiness: 'สถานะ pilot: ต้องยืนยัน technology lead, process owner, baseline, privacy/security review และวิธีส่งมอบก่อนเปิด inquiry',
  },
  'governance-risk': {
    serviceSlug: 'ai-governance-readiness-review',
    title: 'AI Governance Readiness Review สำหรับ use case ที่ต้องตรวจสอบได้',
    description: 'ทบทวน AI, privacy หรือ security use case เดียว แล้วจัดทำ control และ evidence map',
    intent: 'ต้องการแปลงกฎและความเสี่ยงของ AI หรือข้อมูลให้เป็น control, owner และ evidence ที่ติดตามได้',
    context: 'เริ่มจาก use case เดียวและแยก advisory ออกจาก assurance เพื่อให้บทบาทและความเป็นอิสระชัดเจน',
    workflow: ['เลือก use case และผู้รับผิดชอบการตัดสินใจ', 'ทำ inventory ของ data, model, vendor และ policy ที่เกี่ยวข้อง', 'แปลง gap เป็น control, owner, evidence และ review cadence', 'ส่ง readiness map ให้ผู้บริหารตัดสินใจเรื่อง remediation'],
    deliverables: ['use-case boundary และ responsibility map', 'control/evidence register', 'gap และ remediation plan', 'review cadence และ decision record template'],
    evidence: ['ไม่อ้าง legal advice, assurance opinion หรือ regulatory approval', 'ไม่ใส่ข้อมูลส่วนบุคคลหรือ private AI logs ใน public content', 'ข้อกำหนดจริงต้องตรวจตาม jurisdiction และผู้เชี่ยวชาญที่รับผิดชอบ'],
    readiness: 'ต้องมี governance lead, use-case owner, privacy/security reviewer และ retention rule ก่อนเปิด inquiry',
  },
  'transactions-corporate-finance': {
    serviceSlug: 'technical-commercial-diligence',
    title: 'Technical & Commercial Diligence สำหรับการตัดสินใจธุรกรรม',
    description: 'ตรวจระบบหรือความเสี่ยงหนึ่งด้าน โดยแยก fact, assumption, gap และคำถามที่ต้องปิด',
    intent: 'ต้องการเข้าใจ technology, operations หรือ commercial risk ก่อนซื้อขาย ระดมทุน หรือปรับโครงสร้าง',
    context: 'เริ่มจาก diligence scope ที่แคบและ evidence room ที่ได้รับอนุญาต โดยใช้ qualified partner เมื่อเรื่องอยู่นอกขอบเขต',
    workflow: ['กำหนด transaction question และ materiality threshold', 'ตรวจ source, assumption, dependency และ missing evidence', 'จัด risk register พร้อม owner และคำถามที่ต้องปิด', 'ส่ง diligence memo ที่แยก fact กับ interpretation ชัดเจน'],
    deliverables: ['diligence scope และ request list', 'fact/assumption/gap register', 'risk and dependency map', 'decision memo และ follow-up questions'],
    evidence: ['ไม่อ้าง valuation, investment advice หรือการรับประกันดีล', 'ไม่เปิดเผย transaction records หรือข้อมูลบริษัทใน public page', 'งานกฎหมาย บัญชี และการเงินใช้ผู้เชี่ยวชาญที่มีคุณสมบัติเหมาะสม'],
    readiness: 'ต้องมี transaction lead, finance/technical reviewer, confidentiality boundary และ partner handoff ก่อนเริ่มงาน',
  },
  'industrial-infrastructure': {
    serviceSlug: 'asset-project-discovery',
    title: 'Asset & Project Discovery สำหรับงานอุตสาหกรรมและโครงสร้างพื้นฐาน',
    description: 'ทำ integration, risk และ acceptance map ก่อนตัดสินใจลงทุนหรือเริ่มติดตั้ง',
    intent: 'ต้องการเห็น dependency, project risk และเกณฑ์ตรวจรับของ asset หรือโครงการกายภาพก่อนลงมือ',
    context: 'เริ่มจาก discovery และ information workflow ที่มี field owner ชัดเจน ไม่อ้างการปฏิบัติงานภาคสนามแทนผู้มีอำนาจ',
    workflow: ['กำหนด asset, site และ project boundary', 'ทำ map ของ interface, dependency, risk และ acceptance', 'แยกข้อมูลที่ต้องตรวจหน้างานจากข้อมูลเพื่อการตัดสินใจ', 'ส่ง project discovery pack ให้ sponsor และ field partner'],
    deliverables: ['asset/project map', 'integration และ dependency register', 'risk/acceptance checklist', 'field handoff และ decision record'],
    evidence: ['ไม่อ้าง uptime, safety outcome หรือ site authorization ที่ยังไม่มี', 'ไม่ใช้ข้อมูลโรงงานหรือโครงสร้างพื้นฐานจริงใน public repo', 'งาน engineering และ field delivery ต้องมีผู้เชี่ยวชาญและผู้รับผิดชอบหน้างาน'],
    readiness: 'ต้องมี industrial lead, authorized site access, field reviewer และ delivery partner ก่อนเปิด inquiry',
  },
  'science-deep-tech': {
    serviceSlug: 'deep-tech-commercialization-map',
    title: 'Deep-Tech Commercialization Map สำหรับเทคโนโลยีที่ต้องพิสูจน์ตลาด',
    description: 'ประเมินเทคโนโลยีหนึ่งรายการ พร้อมแผน IP, partner, product และ evidence ที่ต้องเพิ่ม',
    intent: 'ต้องการเชื่อมงานวิจัยกับ IP, product, partner และตลาดโดยแยกสิ่งที่พิสูจน์แล้วออกจากสมมติฐาน',
    context: 'เริ่มจาก technical review และ commercialization map ก่อนลงทุนหรือสร้าง venture ไม่ใช่การรับรองผลวิจัย',
    workflow: ['กำหนด technology claim และ intended use', 'ตรวจ evidence, maturity, dependency และ IP question', 'ทำ partner, product และ market hypothesis map', 'จัดลำดับ experiment และ evidence ที่ต้องเพิ่ม'],
    deliverables: ['technical claim/evidence register', 'IP และ dependency question map', 'partner/product hypothesis map', 'commercialization next-step plan'],
    evidence: ['ไม่อ้าง scientific validation, patent ownership หรือ market traction โดยไม่มีหลักฐาน', 'ไม่เก็บ confidential research หรือ unpublished IP ใน public repo', 'การรับรองทางเทคนิคและกฎหมายทรัพย์สินทางปัญญาต้องใช้ผู้เชี่ยวชาญที่เหมาะสม'],
    readiness: 'ต้องมี science/technology lead, evidence owner, IP boundary และ research reviewer ก่อนเปิด inquiry',
  },
  legal: {
    serviceSlug: 'legal-capability-map',
    title: 'Legal Capability Map สำหรับระบบและธุรกรรมที่ต้องมี partner handoff',
    description: 'วางขอบเขต legal work และ partner handoff สำหรับงานที่ต้องใช้ผู้มีใบอนุญาต',
    intent: 'ต้องการรู้ว่าประเด็นสิทธิ หน้าที่ และความเสี่ยงทางกฎหมายใดต้องส่งต่อให้ผู้ประกอบวิชาชีพ',
    context: 'หน้าเป็น future capability และการจัดขอบเขตงาน ไม่ใช่สำนักงานกฎหมายหรือคำแนะนำทางกฎหมาย',
    workflow: ['ทำ issue inventory และ jurisdiction question', 'แยก operational fact ออกจาก legal interpretation', 'กำหนด partner handoff และ evidence ที่ต้องเตรียม', 'จัด decision record สำหรับการคุยกับผู้มีใบอนุญาต'],
    deliverables: ['legal issue boundary', 'fact/evidence request list', 'qualified-partner handoff brief', 'decision and follow-up register'],
    evidence: ['ไม่ให้คำแนะนำทางกฎหมายหรืออ้าง privilege', 'ไม่อ้างใบอนุญาตหรือความสัมพันธ์กับสำนักงานใด', 'ไม่รับข้อมูลคดีหรือเอกสารลับผ่าน public website'],
    readiness: 'ต้องมี legal lead ที่มีคุณสมบัติ, jurisdiction, conflict check และ partner ที่รับช่วงได้ก่อนเปิด inquiry',
  },
  'investment-asset-management': {
    serviceSlug: 'investment-operating-model',
    title: 'Investment Operating Model สำหรับการตัดสินใจทุนและ portfolio',
    description: 'วางกรอบ portfolio diligence, decision record และ operating model ก่อนรับหรือจัดการทุน',
    intent: 'ต้องการจัดโครงสร้าง thesis, risk, governance และ portfolio operations ให้ตรวจสอบได้',
    context: 'เป็น future capability สำหรับ operating model ยังไม่มีการชักชวนลงทุนหรือจัดการเงินของบุคคลอื่น',
    workflow: ['กำหนด investment question และ decision rights', 'จัด thesis, risk, evidence และ monitoring assumption', 'ออกแบบ portfolio operating cadence และ escalation', 'ส่ง decision record ให้ capital owner ตรวจ'],
    deliverables: ['investment decision boundary', 'thesis/risk/evidence register', 'portfolio operating cadence', 'governance และ review template'],
    evidence: ['ไม่อ้างผลตอบแทน, AUM, track record หรือการชักชวนลงทุน', 'ไม่รับข้อมูลบัญชีหรือ portfolio ส่วนบุคคลใน public site', 'กิจกรรมที่อยู่ภายใต้กฎกำกับต้องส่งต่อผู้มีใบอนุญาต'],
    readiness: 'ต้องมี investment lead, compliance/legal reviewer, capital boundary และ partner authorization ก่อนเปิด inquiry',
  },
  healthcare: {
    serviceSlug: 'health-medtech-readiness-map',
    title: 'Health & Medtech Readiness Map สำหรับระบบที่มีความเสี่ยงสูง',
    description: 'วางแผนระบบและ evidence boundary ผ่านผู้เชี่ยวชาญที่มีคุณสมบัติและใบอนุญาตเหมาะสม',
    intent: 'ต้องการจัดระบบ คน ข้อมูล และ evidence ของ health หรือ medtech use case ก่อนพัฒนาและขอคำปรึกษาเฉพาะทาง',
    context: 'เป็น future capability สำหรับ readiness map ไม่ใช่บริการทางการแพทย์ การวินิจฉัย หรือการรับข้อมูลสุขภาพ',
    workflow: ['กำหนด use case, care context และผู้รับผิดชอบ', 'แยก health data, safety, privacy และ clinical question', 'ทำ evidence และ specialist handoff map', 'จัด readiness backlog ก่อนเริ่ม pilot ที่ได้รับอนุญาต'],
    deliverables: ['use-case และ data boundary', 'risk/evidence register', 'clinical, privacy และ security handoff brief', 'readiness backlog และ sign-off checklist'],
    evidence: ['ไม่ให้คำแนะนำทางการแพทย์หรืออ้าง clinical outcome', 'ไม่เก็บ health data หรือ patient information ใน public site', 'งาน regulated ต้องมีผู้เชี่ยวชาญและการอนุญาตตามกฎหมาย'],
    readiness: 'ต้องมี healthcare lead, qualified clinical/privacy reviewer, consent และ secure data boundary ก่อนเปิด inquiry',
  },
  'real-estate': {
    serviceSlug: 'property-data-operations-strategy',
    title: 'Property Data & Operations Strategy สำหรับเจ้าของสินทรัพย์',
    description: 'วาง data, operations และ asset decision map สำหรับ portfolio อสังหาริมทรัพย์',
    intent: 'ต้องการเชื่อมข้อมูลทำเล สินทรัพย์ และการดำเนินงานให้ตัดสินใจ property ได้เป็นระบบ',
    context: 'เป็น future capability สำหรับ strategy และ operating model ยังไม่ใช่นายหน้าและไม่รับประกันผลตอบแทน',
    workflow: ['กำหนด asset portfolio และ decision ที่ต้องการตอบ', 'ทำ inventory ของ location, property และ operating data', 'แยก source, assumption, constraint และ owner', 'ส่ง asset decision map ให้ owner เลือก pilot'],
    deliverables: ['property data inventory', 'asset/operations decision map', 'data quality และ owner register', 'pilot scope และ review cadence'],
    evidence: ['ไม่อ้าง valuation, occupancy, yield หรือ market data ที่ไม่ได้ตรวจ', 'ไม่เก็บข้อมูลผู้เช่าหรือเอกสารสิทธิ์ใน public repo', 'งานนายหน้า กฎหมาย และการประเมินใช้ผู้มีคุณสมบัติเหมาะสม'],
    readiness: 'ต้องมี property owner, data permission, legal/privacy reviewer และ operations lead ก่อนเปิด inquiry',
  },
  energy: {
    serviceSlug: 'energy-project-development-map',
    title: 'Energy Project Development Map สำหรับโครงการพลังงาน',
    description: 'วาง project, permit, grid, financing และ operating evidence boundary ก่อนพัฒนา asset',
    intent: 'ต้องการเห็น economics, permit, grid และ operating risk ของโครงการพลังงานก่อนใช้ทุน',
    context: 'เป็น future capability สำหรับ project map ไม่ใช่ผู้ผลิตพลังงาน ผู้รับประกัน economics หรือผู้ให้คำแนะนำการลงทุน',
    workflow: ['กำหนด project, geography และ decision gate', 'ทำ map ของ permit, grid, capital และ operating dependency', 'แยก evidence จริงจาก assumption และ missing diligence', 'ส่ง development map ให้ project sponsor และ qualified partner'],
    deliverables: ['project development boundary', 'permit/grid/capital dependency map', 'risk and evidence register', 'next-stage diligence plan'],
    evidence: ['ไม่อ้าง permit, capacity, PPA, IRR หรือ project pipeline ที่ยังไม่มีหลักฐาน', 'ไม่เปิดเผยโครงการหรือข้อมูลที่เป็นความลับใน public content', 'engineering, legal และ financing ต้องผ่าน partner ที่เหมาะสม'],
    readiness: 'ต้องมี energy lead, regulatory/engineering reviewer, project evidence และ permit boundary ก่อนเปิด inquiry',
  },
  'defense-aerospace': {
    serviceSlug: 'critical-systems-assurance-map',
    title: 'Critical-Systems Assurance Map สำหรับงานกลาโหมและอวกาศ',
    description: 'วาง assurance, security และ authorization boundary ภายใต้ข้อกำหนดที่อนุญาต',
    intent: 'ต้องการจัดโครงสร้าง assurance และ security boundary ของระบบสำคัญก่อนเริ่มงานที่ต้อง authorization',
    context: 'เป็น future capability สำหรับ assurance map ยังไม่มีงานจัดหาอาวุธ ภารกิจลับ หรือการเข้าถึงระบบโดยไม่มี authorization',
    workflow: ['ยืนยัน mission/system scope และ authorization', 'ทำ assurance claim, dependency และ evidence map', 'กำหนด security, export และ supplier boundary', 'ส่ง review pack ให้ critical-system owner และ authorized partner'],
    deliverables: ['system/mission boundary', 'assurance และ evidence register', 'security/export/authorization question map', 'authorized handoff plan'],
    evidence: ['ไม่อ้าง clearance, defense contract, mission outcome หรือ compliance approval', 'ไม่รับข้อมูลลับหรือ technical detail ที่มีข้อจำกัดการส่งออกผ่าน public site', 'งานจริงต้องอยู่ภายใต้ authorization และผู้เชี่ยวชาญเฉพาะทาง'],
    readiness: 'ต้องมี critical-systems lead, authorization/security reviewer, data/export boundary และ partner approval ก่อนเปิด inquiry',
  },
  'insurance-risk-transfer': {
    serviceSlug: 'risk-transfer-readiness-map',
    title: 'Risk-Transfer Readiness Map สำหรับความเสี่ยงที่ต้องจัดโครงสร้าง',
    description: 'วาง data, exposure และ partner handoff สำหรับงานที่ต้องใช้ผู้มีใบอนุญาต',
    intent: 'ต้องการทำให้ exposure และ risk data พร้อมสำหรับการเลือกวิธีรับหรือโอนความเสี่ยง',
    context: 'เป็น future capability สำหรับ readiness และ data map ไม่ใช่ผู้รับประกัน นายหน้า หรือผู้ให้คำแนะนำด้านการลงทุน',
    workflow: ['กำหนด risk event, exposure และ decision owner', 'ตรวจ data quality, uncertainty และ evidence ที่ใช้ได้', 'ทำ transfer option และ qualified-partner question map', 'ส่ง readiness pack ให้ risk owner, broker หรือ insurer ตรวจ'],
    deliverables: ['exposure/data boundary', 'risk evidence และ uncertainty register', 'partner handoff brief', 'review cadence และ decision record'],
    evidence: ['ไม่อ้าง premium, coverage, claim outcome หรือใบอนุญาต', 'ไม่รับข้อมูล policy หรือ personal risk ผ่าน public website', 'การจัดจำหน่ายและคำแนะนำที่ regulated ต้องส่งต่อผู้มีใบอนุญาต'],
    readiness: 'ต้องมี risk-transfer lead, licensed reviewer/partner, data consent และ retention boundary ก่อนเปิด inquiry',
  },
};

export const agencyPseoServices: AgencyPseoService[] = agencies.map((agency) => {
  const blueprint = blueprints[agency.slug];
  return {
    kind: 'service',
    slug: blueprint.serviceSlug,
    name: agency.offer,
    title: blueprint.title,
    description: blueprint.description,
    intent: blueprint.intent,
    buyer: agency.buyer,
    context: blueprint.context,
    workflow: blueprint.workflow,
    deliverables: blueprint.deliverables,
    evidence: blueprint.evidence,
    readiness: blueprint.readiness,
    serviceSlug: blueprint.serviceSlug,
    agencySlug: agency.slug,
    status: 'pilot',
  };
});

export function getAgencyPseoService(slug: string) {
  return agencyPseoServices.find((service) => service.slug === slug);
}

export const agencyPseoServicePaths = agencyPseoServices.map((service) => `/services/${service.slug}`);
