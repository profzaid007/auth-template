/**
 * An Array of routes that can be used for authentication
 * These routes dont need authentication
 * @type{string[]}
 */



export const publicRoutes =[
    "/",
    "/auth/new-verification"
];



/**
 * An Array of routes that can be used for authentication
 * These routes will redirect logged in users to /settings
 * @type{string[]}
 */

export const authRoutes =[
    "/auth/login",
    "/auth/register",
    "/auth/error"
];


/**
 *The Prefix for API Authentication Routes
 * Routes tht start with this prefix are used for API authentication purposes
 * @type{}
 */ 

export const apiAuthPrefix = "api/auth";

/**
 * The default redirect path after logging in
 * @type{string}
 */

export const DEFAULT_LOGIN_REDIRECT= "/settings";