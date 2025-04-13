/**
 * Bearer token regex
 *
 * Matches a Bearer token in the following format:
 * Bearer <access_token>.<refresh_token>.<signature>
 *
 * Where:
 * - <access_token> is a string consisting of letters, numbers, hyphens and underscores
 * - <refresh_token> is a string consisting of letters, numbers, hyphens and underscores
 * - <signature> is a string consisting of letters, numbers, hyphens, underscores and forward slashes
 */
export const BEARER_TOKEN_REGEX = /^Bearer [A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_.+/=]*$/

/**
 * JWT regex
 *
 * Matches a JWT in the following format:
 * <header>.<payload>.<signature>
 *
 * Where:
 * - <header> is a string consisting of letters, numbers, hyphens and underscores
 * - <payload> is a string consisting of letters, numbers, hyphens and underscores
 * - <signature> is a string consisting of letters, numbers, hyphens, underscores and forward slashes
 */
export const JWT_REGEX = /[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_.+/=]*$/

/**
 * Username regex
 *
 * Matches a username in the following format:
 * [A-Za-z0-9_]{4,15}
 *
 * Where:
 * - The username must be between 4 and 15 characters long
 * - The username can only contain letters, numbers, and underscores
 * - The username cannot be entirely numbers
 */
export const USERNAME_REGEX = /^(?!^\d+$)[A-Za-z0-9_]{4,15}$/

/**
 * Password regex
 *
 * Matches a password in the following format:
 * (?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z])(?=.*\d)
 *
 * Where:
 * - The password must contain at least one special character (!, @, #, $, etc.)
 * - The password must contain at least one lowercase letter
 * - The password must contain at least one uppercase letter
 * - The password must contain at least one number
 */
export const PASSWORD_REGEX = /(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/
