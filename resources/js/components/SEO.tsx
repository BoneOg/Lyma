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
  title = "Lyma By Chef Marc - Siargao Island Fine Dining",
  description = "Nestled in the pristine shores of Siargao Island, Lyma By Chef Marc represents the essence of sustainable fine dining. Where French techniques, Spanish influences, Asian creativity, and Filipino ingredients unite in a journey through flavors that honors sustainability at the heart of every dish. Five values, one vision - crafting international fine dining with local soul.",
  keywords = "LYMA, Lyma By Chef Marc, Siargao, Siargao Philippines, Siargao Island, General Luna, sustainability, sustainable dining, French techniques, Spanish influences, Asian creativity, Filipino ingredients, journey through flavors, five values one vision, international fine dining, craftsmanship, innovation, seafood crudos, vegan options, à la carte menu, best dinner spot, best dinner place, best dinner, best food for dinner, best dinner restaurant, fine dining, luxury dining, upscale dining, romantic dinner, date night restaurant, best restaurant in Siargao, top restaurant Siargao, aesthetic restaurant, instagrammable restaurant, hidden gem restaurant, local favorite, chef's table, tasting menu, degustation, farm to table, organic dining, wine pairing, craft cocktails, mixology, tropical fine dining, island dining, luxury restaurant, world-class dining, Chef Marc, local ingredients, innovative techniques, culinary journey, pristine shores, unforgettable experience, culinary excellence",
  image = "/assets/images/hero.webp",
  url = "https://www.lymasiargao.com",
  type = "website"
}) => {
  // For Google search results - enhanced title
  const searchTitle = title.includes('Lyma') ? title : `Lyma - ${title}`;
  // For browser tab - keep it simple
  const tabTitle = title.includes('Lyma') ? 'Lyma' : `Lyma - ${title}`;
  const fullDescription = description.includes('Lyma') ? description : `${description} | Lyma Restaurant in Siargao`;

  // Enhanced structured data for better search engine understanding and sitelinks
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    "name": "LYMA",
    "alternateName": "Lyma By Chef Marc",
    "description": "Nestled in the pristine shores of Siargao Island, Lyma By Chef Marc represents the essence of sustainable fine dining. Where French techniques, Spanish influences, Asian creativity, and Filipino ingredients unite in a journey through flavors that honors sustainability at the heart of every dish. Five values, one vision - crafting international fine dining with local soul.",
    "url": "https://www.lymasiargao.com",
    "logo": "https://www.lymasiargao.com/assets/logo/lymabeige.webp",
    "image": "https://www.lymasiargao.com/assets/images/hero.webp",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "General Luna",
      "addressRegion": "Surigao del Norte",
      "addressCountry": "PH"
    },
    "telephone": "+639543846071",
    "email": "pearl@lymaculinary.com",
    "servesCuisine": ["Filipino", "French", "Spanish", "Asian", "International Fine Dining", "Sustainable Cuisine", "Tropical Cuisine", "Island Cuisine"],
    "priceRange": "$$$",
    "openingHours": "Mo-Su 14:00-22:00",
    "hasMenu": "https://www.lymasiargao.com/menu",
    "sameAs": [
      "https://www.facebook.com/lymasiargao",
      "https://www.instagram.com/lymasiargao"
    ],
    "mainEntity": {
      "@type": "WebSite",
      "name": "Lyma By Chef Marc - Siargao Island",
      "url": "https://www.lymasiargao.com",
      "potentialAction": {
        "@type": "SearchAction",
        "target": "https://www.lymasiargao.com/search?q={search_term_string}",
        "query-input": "required name=search_term_string"
      }
    },
    // Enhanced data for better sitelinks
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "LYMA Restaurant Services",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Menu",
            "url": "https://www.lymasiargao.com/menu"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Reservations",
            "url": "https://www.lymasiargao.com/reservation"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Journal",
            "url": "https://www.lymasiargao.com/journal"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Chef Marc",
            "url": "https://www.lymasiargao.com/chef"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Gallery",
            "url": "https://www.lymasiargao.com/gallery"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "About Us",
            "url": "https://www.lymasiargao.com/about"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Contact Us",
            "url": "https://www.lymasiargao.com/contact"
          }
        }
      ]
    }
  };

  return (
    <Head>
      <title>{tabTitle}</title>
      <meta name="title" content={searchTitle} />
      <meta name="description" content={fullDescription} />
      <meta name="keywords" content={keywords} />

      {/* Enhanced Open Graph for better social sharing */}
      <meta property="og:title" content={searchTitle} />
      <meta property="og:description" content={fullDescription} />
      <meta property="og:image" content={`${url}${image}`} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content="Lyma By Chef Marc - Siargao Island" />
      <meta property="og:locale" content="en_US" />

      {/* Enhanced Twitter Meta Tags */}
      <meta name="twitter:title" content={searchTitle} />
      <meta name="twitter:description" content={fullDescription} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@lymasiargao" />

      {/* Canonical URL */}
      <link rel="canonical" href={url} />

      {/* Enhanced Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData)
        }}
      />

      {/* Additional SEO meta tags for better search results */}
      <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
      <meta name="author" content="Chef Marc" />
      <meta name="geo.region" content="PH-SUN" />
      <meta name="geo.placename" content="General Luna, Siargao" />
      <meta name="geo.position" content="9.8500;126.0500" />
      <meta name="ICBM" content="9.8500, 126.0500" />

      {/* Additional meta tags for better search appearance */}
      <meta name="application-name" content="LYMA Restaurant" />
      <meta name="msapplication-TileColor" content="#3D401E" />
      <meta name="theme-color" content="#3D401E" />
    </Head>
  );
};

export default SEO;
