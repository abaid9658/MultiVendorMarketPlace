/** @type {import('tailwindcss').Config} */
export default {
    content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                // Core brand
                'primary': '#0B1220',          // deep navy ink — sidebar, headings
                'primary-container': '#101A2E', // sidebar surface
                'on-primary': '#FFFFFF',
                'on-primary-container': '#94A3C7',

                // Accent — electric indigo (replaces flat blue)
                'secondary': '#4F46E5',
                'secondary-container': '#EEF0FF',
                'on-secondary': '#FFFFFF',
                'on-secondary-container': '#3730A3',
                'secondary-fixed': '#E0E1FF',
                'secondary-fixed-dim': '#A5A8FF',
                'on-secondary-fixed': '#1E1B4B',
                'on-secondary-fixed-variant': '#312E81',

                // Tertiary — used sparingly for highlight chips
                'tertiary': '#0E7490',
                'tertiary-container': '#101A2E',
                'on-tertiary': '#FFFFFF',
                'on-tertiary-container': '#94A3C7',
                'tertiary-fixed': '#CFFAFE',
                'tertiary-fixed-dim': '#67E8F9',
                'on-tertiary-fixed': '#083344',
                'on-tertiary-fixed-variant': '#155E75',

                // Surfaces
                'surface': '#F6F7FB',
                'surface-dim': '#E2E5EE',
                'surface-bright': '#FFFFFF',
                'surface-container-lowest': '#FFFFFF',
                'surface-container-low': '#F8F9FC',
                'surface-container': '#F0F2F8',
                'surface-container-high': '#E7EAF2',
                'surface-container-highest': '#DEE2ED',
                'on-surface': '#161B2E',
                'on-surface-variant': '#5B6378',
                'inverse-surface': '#1E2333',
                'inverse-on-surface': '#F1F2F8',

                // Outline / borders
                'outline': '#8A91A8',
                'outline-variant': '#DCDFEA',

                // Status
                'error': '#DC2626',
                'error-container': '#FEE2E2',
                'on-error': '#FFFFFF',
                'on-error-container': '#7F1D1D',

                // Dark mode
                'dark-surface': '#0D1117',
                'dark-surface-container': '#161B27',
                'dark-surface-container-low': '#11151F',
            },
            borderRadius: {
                DEFAULT: '8px',
                sm: '6px',
                lg: '12px',
                xl: '16px',
                '2xl': '20px',
                full: '999px',
            },
            spacing: {
                xs: '4px',
                sm: '8px',
                md: '16px',
                lg: '24px',
                xl: '32px',
                '2xl': '48px',
                unit: '4px',
                gutter: '24px',
                margin: '24px',
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
                mono: ['"JetBrains Mono"', 'monospace'],
            },
            fontSize: {
                'code-sm': ['12px', { lineHeight: '16px', fontWeight: '500', letterSpacing: '0' }],
                'body-sm': ['12.5px', { lineHeight: '18px', fontWeight: '400' }],
                'body-md': ['14px', { lineHeight: '21px', fontWeight: '400' }],
                'body-lg': ['16px', { lineHeight: '25px', fontWeight: '400' }],
                'label-md': ['11px', { lineHeight: '14px', letterSpacing: '0.06em', fontWeight: '700' }],
                'headline-sm': ['19px', { lineHeight: '26px', letterSpacing: '-0.01em', fontWeight: '700' }],
                'headline-md': ['25px', { lineHeight: '32px', letterSpacing: '-0.02em', fontWeight: '700' }],
                'headline-lg': ['34px', { lineHeight: '40px', letterSpacing: '-0.025em', fontWeight: '800' }],
            },
            boxShadow: {
                'soft': '0 1px 2px 0 rgba(16,24,53,0.04), 0 1px 1px 0 rgba(16,24,53,0.03)',
                'card': '0 1px 3px 0 rgba(16,24,53,0.06), 0 1px 2px -1px rgba(16,24,53,0.04)',
                'card-hover': '0 8px 24px -4px rgba(79,70,229,0.12), 0 2px 8px -2px rgba(16,24,53,0.06)',
                'elevated': '0 20px 60px -12px rgba(11,18,32,0.20)',
                'glow-indigo': '0 0 0 1px rgba(79,70,229,0.08), 0 4px 16px rgba(79,70,229,0.16)',
            },
            animation: {
                'fade-in': 'fadeIn 0.4s ease-out',
                'slide-in': 'slideIn 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
                'pulse-subtle': 'pulseSubtle 2.4s ease-in-out infinite',
                'scale-in': 'scaleIn 0.2s ease-out',
                'shimmer': 'shimmer 2.5s linear infinite',
            },
            keyframes: {
                fadeIn: { from: { opacity: 0, transform: 'translateY(10px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
                slideIn: { from: { opacity: 0, transform: 'translateX(-16px)' }, to: { opacity: 1, transform: 'translateX(0)' } },
                scaleIn: { from: { opacity: 0, transform: 'scale(0.96)' }, to: { opacity: 1, transform: 'scale(1)' } },
                pulseSubtle: { '0%, 100%': { opacity: 1 }, '50%': { opacity: 0.6 } },
                shimmer: { '0%': { backgroundPosition: '-700px 0' }, '100%': { backgroundPosition: '700px 0' } },
            },
        },
    },
    plugins: [],
}