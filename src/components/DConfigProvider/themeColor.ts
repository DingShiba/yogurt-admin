import {theme} from 'ant-design-vue';

const {defaultAlgorithm, darkAlgorithm} = theme;

/**主题颜色*/
export const themeColor = {
    light: defaultAlgorithm,
    dark: defaultAlgorithm,
    realDark: darkAlgorithm
} as const;
export type ThemeColor = keyof typeof themeColor;

export const themeColors = [
    {
        title: '极致蓝（默认）',
        key: 'Arco Blue',
        value: '#165DFF',
    },
    {
        title: '海蔚蓝',
        key: 'blue',
        value: '#3491FA',
    },
    {
        title: '碧涛青',
        key: 'cyan',
        value: '#14C9C9',
    },
    {
        title: '仙野绿',
        key: 'green',
        value: '#00B42A',
    },
    {
        title: '活力橙',
        key: 'Orange',
        value: '#FF7D00',
    },
    {
        title: '浪漫红',
        key: 'Red',
        value: '#F53F3F',
    },
    {
        title: '暗夜紫',
        key: 'Purple',
        value: '#722ED1',
    },
    {
        title: '中性灰',
        key: 'Grey',
        value: '#86909c',
    }
] as const;









