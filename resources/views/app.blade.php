<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="csrf-token" content="{{ csrf_token() }}">
        
        <!-- Comprehensive Favicon Configuration - Using all favicon files -->
        
        <!-- Standard favicon -->
        <link rel="icon" type="image/x-icon" href="/favicon/favicon.ico">
        <link rel="shortcut icon" href="/favicon/favicon.ico">
        
        <!-- PNG favicons for different sizes -->
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon/favicon-16x16.png">
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon/favicon-32x32.png">
        
        <!-- Android Chrome icons -->
        <link rel="icon" type="image/png" sizes="192x192" href="/favicon/android-chrome-192x192.png">
        <link rel="icon" type="image/png" sizes="512x512" href="/favicon/android-chrome-512x512.png">
        
        <!-- Apple touch icon -->
        <link rel="apple-touch-icon" sizes="180x180" href="/favicon/apple-touch-icon.png">
        
        <!-- Web App Manifest for PWA support -->
        <link rel="manifest" href="/favicon/site.webmanifest">
        
        <!-- Theme color for mobile browsers -->
        <meta name="theme-color" content="#3D401E">
        
        <!-- Basic SEO Meta Tags -->
        <meta name="description" content="Nestled in the pristine shores of Siargao Island, Lyma By Chef Marc represents the essence of sustainable fine dining. Where French techniques, Spanish influences, Asian creativity, and Filipino ingredients unite in a journey through flavors that honors sustainability at the heart of every dish. Five values, one vision - crafting international fine dining with local soul.">
        <meta name="keywords" content="LYMA, Lyma By Chef Marc, Siargao, Siargao Philippines, Siargao Island, General Luna, sustainability, sustainable dining, French techniques, Spanish influences, Asian creativity, Filipino ingredients, journey through flavors, five values one vision, international fine dining, craftsmanship, innovation, seafood crudos, vegan options, à la carte menu, best dinner spot, best dinner place, best dinner, best food for dinner, best dinner restaurant, fine dining, luxury dining, upscale dining, romantic dinner, date night restaurant, best restaurant in Siargao, top restaurant Siargao, aesthetic restaurant, instagrammable restaurant, hidden gem restaurant, local favorite, chef's table, tasting menu, degustation, farm to table, organic dining, wine pairing, craft cocktails, mixology, tropical fine dining, island dining, luxury restaurant, world-class dining, Chef Marc, local ingredients, innovative techniques, culinary journey, pristine shores, unforgettable experience, culinary excellence">
        <meta name="author" content="Chef Marc Silvestre Carbó">
        <meta name="robots" content="index, follow">
        
        <!-- Open Graph Meta Tags -->
        <meta property="og:title" content="Lyma By Chef Marc - Where Sustainability Meets Culinary Excellence">
        <meta property="og:description" content="Nestled in the pristine shores of Siargao Island, Lyma By Chef Marc represents the essence of sustainable fine dining. Where French techniques, Spanish influences, Asian creativity, and Filipino ingredients unite in a journey through flavors that honors sustainability at the heart of every dish. Five values, one vision - crafting international fine dining with local soul.">
        <meta property="og:type" content="website">
        <meta property="og:url" content="https://www.lymasiargao.com">
        <meta property="og:image" content="https://www.lymasiargao.com/assets/images/hero.webp">
        <meta property="og:site_name" content="Lyma By Chef Marc - Siargao Island">
        
        <!-- Twitter Meta Tags -->
        <meta name="twitter:card" content="summary_large_image">
        <meta name="twitter:title" content="Lyma By Chef Marc - Where Sustainability Meets Culinary Excellence">
        <meta name="twitter:description" content="Nestled in the pristine shores of Siargao Island, Lyma By Chef Marc represents the essence of sustainable fine dining. Where French techniques, Spanish influences, Asian creativity, and Filipino ingredients unite in a journey through flavors that honors sustainability at the heart of every dish. Five values, one vision - crafting international fine dining with local soul.">
        <meta name="twitter:image" content="https://www.lymasiargao.com/assets/images/hero.webp">
        
        <!-- Performance Optimizations -->
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link rel="dns-prefetch" href="//lymasiargao.com">
        
        <!-- Preload critical resources -->
        <link rel="preload" href="/assets/images/hero.webp" as="image" type="image/webp">
        <link rel="preload" href="/assets/font/LexendGiga-Regular.ttf" as="font" type="font/ttf" crossorigin>
        
        <!-- Dynamic title that will be overridden by Inertia -->
        <title>Lyma</title>
        
        @routes
        @viteReactRefresh
        @vite(['resources/js/app.tsx'])
        @inertiaHead
    </head>
    <body class="font-sans antialiased">
        @inertia
    </body>
</html>
