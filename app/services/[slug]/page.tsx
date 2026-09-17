import { notFound } from 'next/navigation';
import { PseoLandingPage } from '@/components/pseo-landing-page';
import { agencyPseoServices, getAgencyPseoService } from '@/lib/agency-pseo';
import { pageMetadata } from '@/lib/site-config';

export function generateStaticParams() {
  return agencyPseoServices.map((service) => ({ slug: service.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const service = getAgencyPseoService(slug);
  return service ? pageMetadata(service.title, service.description, `/services/${service.slug}`) : pageMetadata('Service', 'ไม่พบ service', '/services');
}

export default async function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const service = getAgencyPseoService(slug);
  if (!service) notFound();

  const relatedLinks = service.agencySlug === 'technology'
    ? [
        { href: '/industries', label: 'ดูตามอุตสาหกรรม' },
        { href: '/solutions', label: 'ดูตามปัญหา' },
      ]
    : [
        { href: `/agencies/${service.agencySlug}`, label: `ดู ${service.name}` },
        { href: '/services', label: 'ดู service ทั้งหมด' },
      ];

  return <PseoLandingPage eyebrow={`SERVICE / ${service.name.toUpperCase()}`} title={service.title} intent={service.intent} buyer={service.buyer} context={service.context} workflow={service.workflow} deliverables={service.deliverables} evidence={service.evidence} readiness={service.readiness} agencySlug={service.agencySlug} canonicalPath={`/services/${service.slug}`} relatedLinks={relatedLinks} />;
}
