import { createStore, createLogger} from 'vuex'
import * as getters from './getters'
import * as actions from "./actions";
import mutations from "./mutations";
const debug = process.env.NODE_ENV !== "production";
interface MODULES {
    [key: string]: any;
}

// const modulesList = require.context("./modules", false, /\.ts$/); 
const modulesList = import.meta.glob("./modules/*.ts", { eager: true })

const modules: MODULES = {}
for (const key in modulesList) {
    const moduleName: string = key.replace(/^\.\/modules\/(.*)\.\w+$/, '$1') //取文件名
    const value: any = modulesList[key] //取文件的内容
    modules[moduleName] = value.default //赋值
}
// modulesList.keys().forEach((modulePath:any) => {
//     const moduleName: string = modulePath.replace(/^\.\/(.*)\.\w+$/, '$1') //取文件名
//     const value: any = modulesList(modulePath) //取文件的内容
//     modules[moduleName] = value.default //赋值
// })

//export default Store
export default createStore({
    modules,
    getters,
    actions,
    mutations,
    strict: debug,
    plugins: debug ? [createLogger()] : []
});