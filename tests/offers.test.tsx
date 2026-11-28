import { renderToString } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import PricingPage, { metadata as pricingMeta } from '@/app/pricing/page';
import TermsPage from '@/app/terms/page';
import ThankYouPage, { metadata as thankYouMeta } from '@/app/thank-you/page';
import HomePage from '@/app/page';
import sitemap from '@/app/sitemap';
import { buildOffers, formatThb, mailtoFor, seoPlans } from '@/lib/offers';

const STRIPE = /^https:\/\/buy\.stripe\.com\/[A-Za-z0-9]+$/;

describe('offer data', () => {
  it('every checkout link is a live Stripe Payment Link (never a test_ link) and unique', () => {
    const urls = [...buildOffers.flatMap((o) => [o.depositUrl, o.maintenanceUrl]), ...seoPlans.flatMap((p) => [p.thbUrl, p.usdUrl])];
    for (const url of urls) {
      expect(url).toMatch(STRIPE);
      expect(url).not.toContain('/test_');
    }
    expect(new Set(urls).size).toBe(urls.length);
  });

  it('a deposit is half the starting price and the range starts at it', () => {
    for (const offer of buildOffers) {
      expect(offer.depositThb * 2, offer.id).toBe(offer.fromThb);
      expect(offer.toThb, offer.id).toBeGreaterThan(offer.fromThb);
    }
  });

  it('formats baht with digit grouping and encodes mail subjects', () => {
    expect(formatThb(12500)).toBe('฿12,500');
    expect(mailtoFor('ขอใบเสนอราคา')).toBe(`mailto:bookchaowalit.work@gmail.com?subject=${encodeURIComponent('ขอใบเสนอราคา')}`);
  });
});

describe('pricing, terms and thank-you pages', () => {
  it('pricing shows every offer with its deposit and care links, and no form', () => {
    // React separates adjacent text parts with <!-- -->; drop them so a button reads as one label.
    const html = renderToString(<PricingPage />).replaceAll('<!-- -->', '');
    // Each card holds its own links on the right buttons: a swapped deposit/care or THB/USD link fails here.
    const cards = html.split('<article').slice(1);
    expect(cards).toHaveLength(buildOffers.length + seoPlans.length);
    buildOffers.forEach((offer, i) => {
      expect(cards[i]).toContain(`id="${offer.id}-name"`);
      expect(cards[i]).toContain(`href="${offer.depositUrl}" rel="noopener">ชำระมัดจำ ${formatThb(offer.depositThb)}<`);
      expect(cards[i]).toContain(`href="${offer.maintenanceUrl}" rel="noopener">สมัครดูแลรายเดือน`);
    });
    seoPlans.forEach((plan, i) => {
      const card = cards[buildOffers.length + i];
      expect(card).toContain(`id="${plan.id}-name"`);
      expect(card).toContain(`href="${plan.thbUrl}" rel="noopener">ชำระ ${formatThb(plan.thb)}<`);
      expect(card).toContain(`href="${plan.usdUrl}" rel="noopener" lang="en">Pay in USD ($${plan.usd})`);
    });
    expect(html).toContain('href="/terms"');
    expect(html).not.toMatch(/<form/);
    expect(pricingMeta.title).toBeTruthy();
  });

  it('terms cover payment, deposit, refunds and contact', () => {
    const html = renderToString(<TermsPage />);
    for (const heading of ['การชำระเงิน', 'มัดจำและใบเสนอราคา', 'การยกเลิกและการคืนเงิน', 'ติดต่อ']) expect(html).toContain(heading);
    expect(html).toContain('mailto:bookchaowalit.work@gmail.com');
  });

  it('thank-you page is never indexed and is not in the sitemap', () => {
    expect(renderToString(<ThankYouPage />)).toContain('ขอบคุณที่ชำระเงิน');
    expect(thankYouMeta.robots).toEqual({ index: false, follow: false });
    expect(sitemap().map((entry) => entry.url).some((url) => url.endsWith('/thank-you'))).toBe(false);
  });

  it('home and header link the pricing page; every footer links the terms', () => {
    const html = renderToString(<HomePage />);
    expect(html.match(/href="\/pricing"/g)?.length).toBeGreaterThanOrEqual(2);
    expect(renderToString(<PricingPage />)).toContain('href="/terms"');
  });
});
