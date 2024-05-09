/**
 * 主题风格*/
export const themeStyle = [
    {
        label: '亮色主题风格',
        value: 'light',
    },
    {
        label: '暗色主题风格',
        value: 'dark',
    },
    {
        label: '暗黑模式',
        value: 'realDark',
    },
] as const;
export type ThemeStyle = keyof typeof themeStyle;