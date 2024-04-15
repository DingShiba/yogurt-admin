import router from '@/router/index'

/**
 * 退回home菜单,无home菜单,默认去login
 * 要求vue-router版本3.5.0以上*/
export const routerBackToHome = () => {
    const _routes = router.getRoutes()
    const _filArr = _routes.filter((item: any) => item.meta.isHome == true)
    const currentRoute:any = router.currentRoute
    if (_filArr.length > 0 && currentRoute.path != _filArr[0].path) {
        router.push({
            path: _filArr[0].path
        });
    } else {
        router.push({
            path: "/login"
        });
    }
}