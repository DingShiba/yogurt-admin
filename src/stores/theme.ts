import {defineStore} from "pinia";
import {reactive} from 'vue'
import {themeColor, themeColors, type ThemeColor} from "@/components/DConfigProvider/themeColor";
type ThemeConfig={
    theme:ThemeColor,
    colorPrimary:string
}
const defaultConfig:ThemeConfig={
    theme:"dark",
    colorPrimary:themeColors[0].value
}
export const useThemeStore = defineStore(
    "theme",
    () => {
        const themeConfig = reactive({
            algorithm: themeColor[defaultConfig.theme],
            token: {
                colorPrimary: defaultConfig.colorPrimary,
            },
            //  组件定制
            /* components: {
                 Radio: {
                     colorPrimary: '#00b96b',
                 },
             }*/
        })

        function setAlgorithm(value: ThemeColor) {
            themeConfig.algorithm = themeColor[value];
        }

        /** 设置主题色 */
        function setColorPrimary(color: string) {
            themeConfig.token.colorPrimary = color;
        }
        return {
            themeConfig,
            setAlgorithm,
            setColorPrimary
        }
    }
)