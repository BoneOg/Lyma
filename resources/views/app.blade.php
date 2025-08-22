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
        <meta name="description" content="Nestled in the pristine shores of Siargao Island, Lyma By Chef Marc represents the essence of tropical fine dining. Every dish tells a story of local ingredients transformed through innovative techniques, creating an unforgettable culinary journey. Where tropical dreams meet culinary excellence with craft cocktails and premium wine cellar.">
        <meta name="keywords" content="LYMA, Lyma By Chef Marc, Siargao, Siargao Philippines, Siargao Island, General Luna, best dinner spot, best dinner place, best dinner, best food for dinner, best dinner restaurant, fine dining, luxury dining, upscale dining, romantic dinner, date night restaurant, best restaurant in Siargao, top restaurant Siargao, aesthetic restaurant, instagrammable restaurant, hidden gem restaurant, local favorite, chef's table, tasting menu, degustation, farm to table, organic dining, sustainable dining, wine pairing, craft cocktails, mixology, tropical fine dining, Filipino cuisine, island dining, luxury restaurant, world-class dining, Chef Marc, local ingredients, innovative techniques, culinary journey, pristine shores, unforgettable experience, tropical dreams, culinary excellence">
        <meta name="author" content="Chef Marc">
        <meta name="robots" content="index, follow">
        
        <!-- Open Graph Meta Tags -->
        <meta property="og:title" content="Lyma By Chef Marc - Where Tropical Dreams Meet Culinary Excellence">
        <meta property="og:description" content="Nestled in the pristine shores of Siargao Island, Lyma By Chef Marc represents the essence of tropical fine dining. Every dish tells a story of local ingredients transformed through innovative techniques, creating an unforgettable culinary journey. Where tropical dreams meet culinary excellence with craft cocktails and premium wine cellar.">
        <meta property="og:type" content="website">
        <meta property="og:url" content="https://www.lymasiargao.com">
        <meta property="og:image" content="https://www.lymasiargao.com/assets/images/hero.webp">
        <meta property="og:site_name" content="Lyma By Chef Marc - Siargao Island">
        
        <!-- Twitter Meta Tags -->
        <meta name="twitter:card" content="summary_large_image">
        <meta name="twitter:title" content="Lyma By Chef Marc - Where Tropical Dreams Meet Culinary Excellence">
        <meta name="twitter:description" content="Nestled in the pristine shores of Siargao Island, Lyma By Chef Marc represents the essence of tropical fine dining. Every dish tells a story of local ingredients transformed through innovative techniques, creating an unforgettable culinary journey. Where tropical dreams meet culinary excellence with craft cocktails and premium wine cellar.">
        <meta name="twitter:image" content="https://www.lymasiargao.com/assets/images/hero.webp">
        
        <!-- Canonical URL -->
        <link rel="canonical" href="https://www.lymasiargao.com">
        
        <!-- Dynamic title that will be overridden by Inertia -->
        <title>Lyma By Chef Marc - Where Tropical Dreams Meet Culinary Excellence | Siargao Island Fine Dining</title>
        
        @routes
        @viteReactRefresh
        @vite(['resources/js/app.tsx'])
        @inertiaHead
    </head>
    <body class="font-sans antialiased">
        @inertia
    </body>
</html>
