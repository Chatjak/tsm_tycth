export const theme = {
    primaryColor: '#6366f1', // Indigo
    secondaryColor: '#f5f7ff',
    successColor: '#10b981', // Emerald
    warningColor: '#f59e0b', // Amber
    dangerColor: '#ef4444',  // Red
    infoColor: '#3b82f6',    // Blue
    bgGradient: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)'
};

export const buttonStyles = {
    primary: {
        background: theme.bgGradient,
        borderColor: 'transparent',
        borderRadius: '8px',
        height: '40px',
        fontWeight: '500',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 4px 14px rgba(99, 102, 241, 0.25)'
    },
    secondary: {
        borderRadius: '8px',
        height: '40px',
        fontWeight: '500',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    }
};