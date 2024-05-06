// const req = require.context("./modules", false, /\.ts$/);
const req = import.meta.glob("./modules/*.ts", { eager: true })// 定义一个api的对象
interface ApiObj {
    [key: string]: any;
}
const api: ApiObj = {}
for (const key in req) {
    const name: string = key.replace(/^\.\/modules\/(.*)\.\w+$/, '$1') //取文件名
    const value: any = req[key] //取文件的内容
    api[name] = value.default //赋值
}

// req.keys().forEach((key: any) => {
//     const name: string = key.substring(2, key.length - 3);
//     api[name] = req(key).default;
// });
const API = api

export default API