import React, { useState, useEffect } from 'react';
import { getStorageUrlWithFallback, checkImageExists } from '../utils/assetHelper';

interface EnhancedImageProps {
    src: string;
    alt: string;
    className?: string;
    onError?: () => void;
    showLoadingState?: boolean;
    fallbackContent?: React.ReactNode;
}

/**
 * Enhanced Image component with better error handling and fallback support
 * Specifically designed to handle production storage issues
 */
const EnhancedImage: React.FC<EnhancedImageProps> = ({
    src,
    alt,
    className = '',
    onError,
    showLoadingState = true,
    fallbackContent
}) => {
    const [loadingState, setLoadingState] = useState<'loading' | 'success' | 'error'>('loading');
    const [currentSrc, setCurrentSrc] = useState<string>('');
    const { url, fallbackUrl, onError: handleError } = getStorageUrlWithFallback(src);

    useEffect(() => {
        if (!src) {
            setLoadingState('error');
            return;
        }

        setLoadingState('loading');
        setCurrentSrc(url);

        // Pre-check if image exists to avoid showing broken images
        checkImageExists(url).then((exists) => {
            if (!exists) {
                console.warn('Image does not exist, using fallback:', url);
                setCurrentSrc(fallbackUrl);
                setLoadingState('error');
                if (onError) onError();
            } else {
                setLoadingState('success');
            }
        });
    }, [src, url, fallbackUrl, onError]);

    const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
        console.error('Image failed to load:', {
            originalSrc: src,
            attemptedUrl: currentSrc,
            fallbackUrl
        });

        setLoadingState('error');
        handleError(e);
        if (onError) onError();
    };

    const handleImageLoad = () => {
        setLoadingState('success');
    };

    // Show loading state
    if (showLoadingState && loadingState === 'loading') {
        return (
            <div className={`flex items-center justify-center bg-gray-100 ${className}`}>
                <div className="flex flex-col items-center p-4">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-400 mb-2"></div>
                    <span className="text-xs text-gray-500">Loading...</span>
                </div>
            </div>
        );
    }

    // Show custom fallback content if provided and image failed
    if (loadingState === 'error' && fallbackContent) {
        return <div className={className}>{fallbackContent}</div>;
    }

    // Show the image (either original or fallback)
    return (
        <img
            src={currentSrc}
            alt={alt}
            className={className}
            onError={handleImageError}
            onLoad={handleImageLoad}
            loading="lazy"
        />
    );
};

export default EnhancedImage;