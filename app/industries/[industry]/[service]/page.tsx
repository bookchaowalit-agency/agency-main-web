import { notFound } from 'next/navigation';
import { PseoLandingPage } from '@/components/pseo-landing-page';
import { pseoIndustries, getPseoIndustry } from '@/lib/pseo';
import { pageMetadata } from '@/lib/site-config';

export function generateStaticParams() {
  return pseoIndustries.map((item) => ({ industry: item.slug, service: item.serviceSlug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<{ industry: string; service: string }> }) {
  const { industry, service } = await params;
  const item = getPseoIndustry(industry, service);
  return item ? pageMetadata(item.title, item.context, `/industries/${item.slug}/${item.serviceSlug}`) : pageMetadata('Industry', 'ไม่พบ industry page', '/industries');
}

export default async function IndustryServicePage({ params }: { params: Promise<{ industry: string; service: string }> }) {
  const { industry, service } = await params;
  const item = getPseoIndustry(industry, service);
  if (!item) notFound();

  return <PseoLandingPage eyebrow={`INDUSTRY / ${item.name.toUpperCase()}`} title={item.title} intent={item.intent} buyer={item.buyer} context={item.context} workflow={item.workflow} deliverables={item.deliverables} evidence={item.evidence} readiness={item.readiness} agencySlug="technology" canonicalPath={`/industries/${item.slug}/${item.serviceSlug}`} relatedLinks={[
    ...item.problems.map((problem) => ({ href: `/solutions/${problem}/${item.serviceSlug}`, label: `แก้ปัญหา ${problem}` })),
    { href: `/services/${item.serviceSlug}`, label: 'ดู AI Automation Workflow Sprint' },
  ]} />;
}
