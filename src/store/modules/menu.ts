interface MENU {
    name: string;
    path: string;
    icon?: string;
    children?: MENU[]; //定义数组类型1
}
interface STATE {
    menus: Array<MENU>;//定义数组类型2
    crumbs:[];
}

const state: STATE = {
    menus: [],
    crumbs:[],
}
const mutations = {
    SET_MENU: (state: any, data: any) => {
        state.menu = data
    },
    SET_CRUMBS: (state: any, data: any) => {
        if(data.state){
            state.crumbs = data.list
        }else{
            state.crumbs=[]
        }
    }
}
const action = {}

export default {
    namespace: true,
    state,
    mutations,
    action
}