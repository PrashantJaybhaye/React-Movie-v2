// Authentication utility functions

/**
 * Validates email format
 * @param {string} email - Email to validate
 * @returns {boolean} - True if email is valid
 */
export const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

/**
 * Validates password strength
 * @param {string} password - Password to validate
 * @returns {object} - Validation result with isValid and requirements
 */
export const validatePassword = (password) => {
    const requirements = {
        minLength: password.length >= 8,
        hasUpperCase: /[A-Z]/.test(password),
        hasLowerCase: /[a-z]/.test(password),
        hasNumber: /\d/.test(password),
        hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    };

    const isValid = requirements.minLength && 
                   requirements.hasUpperCase && 
                   requirements.hasLowerCase && 
                   requirements.hasNumber;

    return {
        isValid,
        requirements,
        strength: calculatePasswordStrength(requirements)
    };
};

/**
 * Calculates password strength score
 * @param {object} requirements - Password requirements object
 * @returns {string} - Strength level (weak, medium, strong)
 */
const calculatePasswordStrength = (requirements) => {
    const score = Object.values(requirements).filter(Boolean).length;
    
    if (score <= 2) return 'weak';
    if (score <= 4) return 'medium';
    return 'strong';
};

/**
 * Formats user display name
 * @param {object} user - User object
 * @returns {string} - Formatted display name
 */
export const getDisplayName = (user) => {
    if (!user) return 'Guest';
    return user.name || user.email?.split('@')[0] || 'User';
};

/**
 * Gets user initials for avatar
 * @param {object} user - User object
 * @returns {string} - User initials
 */
export const getUserInitials = (user) => {
    if (!user) return 'G';
    
    if (user.name) {
        const names = user.name.split(' ');
        if (names.length >= 2) {
            return `${names[0][0]}${names[1][0]}`.toUpperCase();
        }
        return names[0][0].toUpperCase();
    }
    
    return user.email?.[0].toUpperCase() || 'U';
};

/**
 * Formats date for display
 * @param {string} dateString - ISO date string
 * @returns {string} - Formatted date
 */
export const formatDate = (dateString) => {
    try {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    } catch (error) {
        return 'Unknown';
    }
};

/**
 * Generates a secure random password
 * @param {number} length - Password length (default: 12)
 * @returns {string} - Generated password
 */
export const generateSecurePassword = (length = 12) => {
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers = '0123456789';
    const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?';
    
    const allChars = lowercase + uppercase + numbers + symbols;
    let password = '';
    
    // Ensure at least one character from each category
    password += lowercase[Math.floor(Math.random() * lowercase.length)];
    password += uppercase[Math.floor(Math.random() * uppercase.length)];
    password += numbers[Math.floor(Math.random() * numbers.length)];
    password += symbols[Math.floor(Math.random() * symbols.length)];
    
    // Fill the rest randomly
    for (let i = 4; i < length; i++) {
        password += allChars[Math.floor(Math.random() * allChars.length)];
    }
    
    // Shuffle the password
    return password.split('').sort(() => Math.random() - 0.5).join('');
};
