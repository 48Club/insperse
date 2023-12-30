import type { Config } from 'tailwindcss'

const config: Config = {
    content: [
        './pages/**/*.{js,ts,jsx,tsx,mdx}',
        './components/**/*.{js,ts,jsx,tsx,mdx}',
        './app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            backgroundImage: {
                'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
                'gradient-conic':
                    'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
            },
            fontSize: {
                'xs': '.75rem',     // 12px
                'sm': '.875rem',    // 14px
                'base': '1.25rem',  // 20px
                'lg': '1.5rem',     // 24px
                'xl': '1.875rem',   // 30px
                '2xl': '2.25rem',   // 36px
                '3xl': '3rem',      // 48px
                '4xl': '3.75rem',   // 60px
                '5xl': '4.5rem',    // 72px
                '6xl': '6rem',      // 96px
            },
        }
    },
    plugins: [],
}
export default config
