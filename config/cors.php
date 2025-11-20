<?php

return [

    // Keep API and auth endpoints; remove Sanctum CSRF endpoint (not used when not using Sanctum)
    'paths' => ['api/*', 'login', 'logout'],

    'allowed_methods' => ['*'],

    // Explicitly allow the Vite dev server origin so cookies (credentials) can be sent.
    // Add other dev origins here if needed (e.g. 'http://localhost:3000').
    'allowed_origins' => ['http://localhost:5173'],

    'allowed_origins_patterns' => [],

    // Only allow headers the frontend will use (including XSRF headers).
    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 0,

    // Enable credentials for session-based auth
    'supports_credentials' => true,

];
