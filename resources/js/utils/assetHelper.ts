/**
 * Asset Helper Utilities
 * Provides functions to generate proper asset URLs for both local and production environments
 */

/**
 * Get the base URL for the application
 * Uses Laravel's APP_URL from meta tag or falls back to current origin
 * Enhanced for shared hosting environments like Hostinger
 */
export const getBaseUrl = (): string => {
    const hostname = window.location.hostname;
    const protocol = window.location.protocol;
    
    // Priority 1: Check if we're in local development
    const isLocalhost = hostname === 'localhost' || 
                       hostname === '127.0.0.1' || 
                       hostname.startsWith('192.168.') || 
                       hostname.startsWith('10.') ||
                       hostname.endsWith('.local');
    
    if (isLocalhost) {
        console.log('🏠 Local development detected, using current origin:', window.location.origin);
        return window.location.origin;
    }
    
    // Priority 2: Check for shared hosting patterns (Hostinger, cPanel, etc.)
    const isSharedHosting = hostname.includes('.hostinger.') || 
                           hostname.includes('.cpanel.') ||
                           hostname.includes('.000webhost.') ||
                           hostname.match(/^\d+\.\d+\.\d+\.\d+$/); // IP address
    
    if (isSharedHosting) {
        console.log('🌐 Shared hosting detected, using current origin:', window.location.origin);
        return window.location.origin;
    }
    
    // Priority 3: Check for specific production domains
    if (hostname === 'admin.johnjess.com') {
        console.log('🚀 Production admin domain detected:', 'https://admin.johnjess.com');
        return 'https://admin.johnjess.com';
    }
    
    if (hostname === 'johnjess.com') {
        console.log('🚀 Production main domain detected, using admin subdomain:', 'https://admin.johnjess.com');
        return 'https://admin.johnjess.com';  // Redirect to admin subdomain for API calls
    }
    
    // Priority 4: Try to get the app URL from meta tag set by Laravel (most reliable for production)
    const appUrlMeta = document.head.querySelector('meta[name="app-url"]') as HTMLMetaElement;
    if (appUrlMeta && appUrlMeta.content) {
        const metaUrl = appUrlMeta.content.replace(/\/$/, ''); // Remove trailing slash
        console.log('🌐 Using APP_URL from meta tag:', metaUrl);
        return metaUrl;
    }
    
    // Priority 5: Fallback to current origin with proper protocol
    const fallbackUrl = `${protocol}//${hostname}${window.location.port ? ':' + window.location.port : ''}`;
    console.log('🔄 Fallback to current origin:', fallbackUrl);
    return fallbackUrl;
};

/**
 * Generate a proper storage URL for uploaded files
 * @param path - The storage path (e.g., 'incident_reports/images/filename.jpg')
 * @param useAlternativeRoute - Whether to use the alternative Laravel route for file serving
 * @returns Full URL to the file
 */
export const getStorageUrl = (path: string, useAlternativeRoute: boolean = false): string => {
    if (!path) {
        console.warn('⚠️ getStorageUrl: Empty path provided');
        return '';
    }
    
    const baseUrl = getBaseUrl();
    // Remove leading slash if present to avoid double slashes
    const cleanPath = path.startsWith('/') ? path.substring(1) : path;
    
    // Check if we should use alternative route (for shared hosting)
    if (useAlternativeRoute) {
        const alternativeUrl = `${baseUrl}/api/storage-direct/${cleanPath}`;
        console.log('🔄 Using alternative direct storage route:', { 
            path, 
            cleanPath, 
            alternativeUrl 
        });
        return alternativeUrl;
    }
    
    const fullUrl = `${baseUrl}/storage/${cleanPath}`;
    console.log('📁 Generated storage URL:', { 
        path, 
        cleanPath, 
        baseUrl, 
        fullUrl,
        hostname: window.location.hostname,
        port: window.location.port,
        useAlternativeRoute
    });
    
    return fullUrl;
};

/**
 * Generate a proper asset URL for static assets
 * @param path - The asset path (e.g., 'images/logo.png')
 * @returns Full URL to the asset
 */
export const getAssetUrl = (path: string): string => {
    if (!path) return '';
    
    const baseUrl = getBaseUrl();
    const cleanPath = path.startsWith('/') ? path.substring(1) : path;
    
    return `${baseUrl}/${cleanPath}`;
};

/**
 * Check if an image URL is accessible
 * @param url - The image URL to check
 * @returns Promise that resolves to true if image loads, false otherwise
 */
export const checkImageExists = (url: string): Promise<boolean> => {
    return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => resolve(true);
        img.onerror = () => resolve(false);
        img.src = url;
    });
};

/**
 * Get a fallback image URL for broken images
 * @returns Data URL for a placeholder image
 */
export const getFallbackImageUrl = (): string => {
    return 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><rect width="100" height="100" fill="%23f3f4f6"/><text x="50" y="55" text-anchor="middle" fill="%236b7280" font-size="10">Image Error</text></svg>';
};

/**
 * Preload an image and return a promise that resolves when loaded
 * @param url - The image URL to preload
 * @returns Promise that resolves to the image element or rejects on error
 */
export const preloadImage = (url: string): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = () => reject(new Error(`Failed to load image: ${url}`));
        img.src = url;
    });
};

/**
 * Get storage URL with fallback and error handling
 * @param path - The storage path
 * @returns Object with url and a method to handle errors
 */
export const getStorageUrlWithFallback = (path: string) => {
    const hostname = window.location.hostname;
    const isProduction = !hostname.includes('localhost') && !hostname.includes('127.0.0.1') && !hostname.includes('192.168.');
    
    // For production (shared hosting), use the working alternative route by default
    const url = isProduction ? getStorageUrl(path, true) : getStorageUrl(path);
    const fallbackUrl = getFallbackImageUrl();
    
    return {
        url,
        fallbackUrl,
        onError: (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
            console.error('Image load error:', { 
                path, 
                url, 
                currentSrc: e.currentTarget.src,
                naturalWidth: e.currentTarget.naturalWidth,
                naturalHeight: e.currentTarget.naturalHeight,
                error: e 
            });
            
            // If we're not already using the alternative route, try it
            if (!e.currentTarget.src.includes('/api/storage-direct/')) {
                const alternativeUrl = getStorageUrl(path, true);
                console.log('🔄 Trying alternative serving route:', alternativeUrl);
                e.currentTarget.src = alternativeUrl;
                return;
            }
            
            // If alternative route also failed, try the regular storage URL
            if (!e.currentTarget.src.includes('/storage/') || e.currentTarget.src.includes('/api/storage-direct/')) {
                const regularUrl = getStorageUrl(path, false);
                if (e.currentTarget.src !== regularUrl) {
                    console.log('🔄 Trying regular storage URL:', regularUrl);
                    e.currentTarget.src = regularUrl;
                    return;
                }
            }
            
            // If both methods failed, use fallback
            if (e.currentTarget.src !== fallbackUrl) {
                console.log('❌ Using fallback image');
                e.currentTarget.src = fallbackUrl;
            }
        }
    };
};

/**
 * Debug function to check asset configuration
 * Call this in browser console to debug asset issues
 */
export const debugAssetConfig = () => {
    console.group('🔍 Asset Helper Debug Info');
    console.log('🌐 Current hostname:', window.location.hostname);
    console.log('🌐 Current port:', window.location.port);
    console.log('🌐 Current origin:', window.location.origin);
    console.log('🌐 Current protocol:', window.location.protocol);
    console.log('🎯 Base URL:', getBaseUrl());
    
    // Check environment detection
    const hostname = window.location.hostname;
    const isLocalhost = hostname === 'localhost' || 
                       hostname === '127.0.0.1' || 
                       hostname.startsWith('192.168.') || 
                       hostname.startsWith('10.') ||
                       hostname.endsWith('.local');
    console.log('🏠 Is localhost:', isLocalhost);
    
    // Check meta tags
    const appUrlMeta = document.head.querySelector('meta[name="app-url"]') as HTMLMetaElement;
    console.log('📋 App URL meta tag:', appUrlMeta?.content || '❌ Not found');
    
    const csrfMeta = document.head.querySelector('meta[name="csrf-token"]') as HTMLMetaElement;
    console.log('🔒 CSRF token:', csrfMeta?.content ? '✅ Present' : '❌ Missing');
    
    // Test sample URLs
    const samplePaths = [
        'incident_reports/images/0f0M2gIZUYzMZfQEI8l23ht9Jy2xXwXkfBnGHTo2.png',
        'incident_reports/documents/sample.pdf'
    ];
    
    console.group('📁 Sample Storage URLs:');
    samplePaths.forEach(path => {
        const url = getStorageUrl(path);
        console.log(`📄 ${path}`);
        console.log(`🔗 → ${url}`);
        console.log('---');
    });
    console.groupEnd();
    
    // Test actual file access
    console.group('🧪 Storage Directory Tests:');
    fetch(getBaseUrl() + '/storage/')
        .then(response => {
            console.log('📂 /storage/ directory:', response.ok ? '✅ Accessible' : `❌ ${response.status}`);
        })
        .catch(error => {
            console.log('📂 /storage/ directory: ❌ Error -', error.message);
        });
    
    fetch(getBaseUrl() + '/storage/incident_reports/')
        .then(response => {
            console.log('📂 /storage/incident_reports/ directory:', response.ok ? '✅ Accessible' : `❌ ${response.status}`);
        })
        .catch(error => {
            console.log('📂 /storage/incident_reports/ directory: ❌ Error -', error.message);
        });
    console.groupEnd();
    
    console.groupEnd();
};

// Make debugAssetConfig available globally for easy access in console
if (typeof window !== 'undefined') {
    (window as any).debugAssetConfig = debugAssetConfig;
}