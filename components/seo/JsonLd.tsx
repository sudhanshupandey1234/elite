import React from 'react';

/** Renders a JSON-LD structured-data script tag for SEO. */
export function JsonLd({ data }: { data: Record<string, unknown> | Record<string, unknown>[] }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

/** Organization + LocalBusiness schema for Elite Globex (Lucknow HQ). */
export function OrganizationJsonLd() {
  const siteUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  return (
    <JsonLd
      data={[
        {
          '@context': 'https://schema.org',
          '@type': 'Organization',
          name: 'Elite Globex',
          url: siteUrl,
          slogan: 'Your every problem has one solution',
          email: 'eliteglobex4794@gmail.com',
          telephone: '+91-7355223184',
          address: {
            '@type': 'PostalAddress',
            streetAddress: 'Vineet Khand 6, Gomtinagar',
            addressLocality: 'Lucknow',
            postalCode: '226010',
            addressRegion: 'Uttar Pradesh',
            addressCountry: 'IN',
          },
        },
        {
          '@context': 'https://schema.org',
          '@type': 'LocalBusiness',
          '@id': `${siteUrl}/#business`,
          name: 'Elite Globex',
          url: siteUrl,
          slogan: 'Your every problem has one solution',
          telephone: '+91-7355223184',
          email: 'eliteglobex4794@gmail.com',
          priceRange: '₹₹',
          address: {
            '@type': 'PostalAddress',
            streetAddress: 'Vineet Khand 6, Gomtinagar',
            addressLocality: 'Lucknow',
            postalCode: '226010',
            addressRegion: 'Uttar Pradesh',
            addressCountry: 'IN',
          },
          openingHoursSpecification: {
            '@type': 'OpeningHoursSpecification',
            dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
            opens: '09:30',
            closes: '19:00',
          },
        },
      ]}
    />
  );
}
