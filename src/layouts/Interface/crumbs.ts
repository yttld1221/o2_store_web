// 面包屑的data类型
interface CrumbsDataType {
    router?: any,
    route?: any,
    routerList: Array<ROUTER_LIST>
    children: any,
    jumpRouter: (path: string) => void
}

// 面包屑需要的路由列表
interface ROUTER_LIST {
    path: string,
    title: string,
}

// 路由对象
interface ROUTER_OBJECT {
    path?: string;
    name?: string;
    redirect?: string;
    component?: () => void;
    meta?: {
        title?: string
    }
    children?: ROUTER_OBJECT[];
}