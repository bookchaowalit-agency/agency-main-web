import { notFound } from 'next/navigation';
import { PseoLandingPage } from '@/components/pseo-landing-page';
import { pseoProblems, getPseoProblem } from '@/lib/pseo';
import { pageMetadata } from '@/lib/site-config';

export function generateStaticParams() {
  return pseoProblems.map((item) => ({ problem: item.slug, service: item.serviceSlug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<{ problem: string; service: string }> }) {
  const { problem, service } = await params;
  const item = getPseoProblem(problem, service);
  return item ? pageMetadata(item.title, item.context, `/solutions/${item.slug}/${item.serviceSlug}`) : pageMetadata('Solution', 'ไม่พบ solution page', '/solutions');
}

export default async function ProblemServicePage({ params }: { params: Promise<{ problem: string; service: string }> }) {
  const { problem, service } = await params;
  const item = getPseoProblem(problem, service);
  if (!item) notFound();

  return <PseoLandingPage eyebrow={`PROBLEM / ${item.name.toUpperCase()}`} title={item.title} intent={item.intent} buyer={item.buyer} context={item.context} workflow={item.workflow} deliverables={item.deliverables} evidence={item.evidence} readiness={item.readiness} agencySlug="technology" canonicalPath={`/solutions/${item.slug}/${item.serviceSlug}`} relatedLinks={[
    ...item.industries.map((industry) => ({ href: `/industries/${industry}/${item.serviceSlug}`, label: `AI Automation สำหรับ ${industry}` })),
    { href: `/services/${item.serviceSlug}`, label: 'ดู AI Automation Workflow Sprint' },
  ]} />;
}
