<?php

use Illuminate\Http\Request;

if (!function_exists('storage_url')) {
    /**
     * Generate a URL for the given storage path.
     *
     * @param string $path
     * @return string
     */
    function storage_url($path)
    {
        return asset('storage/' . $path);
    }
}

if (!function_exists('get_asset_url')) {
    /**
     * Generate a proper asset URL that works in both local and production
     *
     * @param string $path
     * @return string
     */
    function get_asset_url($path)
    {
        $baseUrl = config('app.url', request()->getSchemeAndHttpHost());
        return rtrim($baseUrl, '/') . '/' . ltrim($path, '/');
    }
}