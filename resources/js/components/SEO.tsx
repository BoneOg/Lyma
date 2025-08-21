import React from 'react';
import { Head } from '@inertiajs/react';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: string;
}

const SEO: React.FC<SEOProps> = ({
  title = "Lyma",
  description = "Experience exceptional fine dining at Lyma in General Luna, Siargao. Chef Marc's culinary masterpiece featuring local ingredients transformed through tradition and innovation.",
  keywords = "Lyma, fine dining, Siargao, General Luna, Chef Marc, restaurant, Filipino cuisine, tropical dining, luxury restaurant, island dining",
  image = "/assets/images/hero.webp",
  url = "https://www.lymasiargao.com",
  type = "website"
}) => {
  const fullTitle = title.includes('Lyma') ? title : `Lyma - ${title}`;
  const fullDescription = description.includes('Lyma') ? description : `${description} | Lyma Restaurant in Siargao`;
  
  // Structured data for better search engine understanding
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    "name": "Lyma Restaurant",
    "description": "Fine dining restaurant in General Luna, Siargao featuring Chef Marc's culinary masterpiece",
    "url": "https://www.lymasiargao.com",
    "logo": "https://www.lymasiargao.com/assets/logo/lymabeige.webp",
    "image": "https://www.lymasiargao.com/assets/images/hero.webp",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "General Luna",
      "addressRegion": "Surigao del Norte",
      "addressCountry": "PH"
    },
    "telephone": "+63-XXX-XXX-XXXX",
    "email": "info@lymasiargao.com",
    "servesCuisine": ["Filipino", "Fine Dining", "Tropical Cuisine"],
    "priceRange": "$$$",
    "openingHours": "Mo-Su 18:00-22:00",
    "hasMenu": "https://www.lymasiargao.com/menu",
    "sameAs": [
      "https://www.facebook.com/lymasiargao",
      "https://www.instagram.com/lymasiargao"
    ],
    "mainEntity": {
      "@type": "WebSite",
      "name": "Lyma Restaurant Siargao",
      "url": "https://www.lymasiargao.com",
      "potentialAction": {
        "@type": "SearchAction",
        "target": "https://www.lymasiargao.com/search?q={search_term_string}",
        "query-input": "required name=search_term_string"
      }
    }
  };
  
  return (
    <Head>
      <title>{fullTitle}</title>
      <meta name="title" content={fullTitle} />
      <meta name="description" content={fullDescription} />
      <meta name="keywords" content={keywords} />
      
      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={fullDescription} />
      <meta property="og:image" content={`${url}${image}`} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content="Lyma Restaurant Siargao" />
      
      {/* Twitter */}
      <meta property="twitter:title" content={fullTitle} />
      <meta property="twitter:description" content={fullDescription} />
      <meta property="twitter:image" content={`${url}${image}`} />
      <meta property="twitter:card" content="summary_large_image" />
      
      {/* Canonical URL */}
      <link rel="canonical" href={url} />
      
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData)
        }}
      />
      
      {/* Additional SEO meta tags */}
      <meta name="robots" content="index, follow" />
      <meta name="author" content="Lyma Restaurant Siargao" />
      <meta name="geo.region" content="PH-SUN" />
      <meta name="geo.placename" content="General Luna, Siargao" />
      <meta name="geo.position" content="9.8500;126.0500" />
      <meta name="ICBM" content="9.8500, 126.0500" />
    </Head>
  );
};

export default SEO;
