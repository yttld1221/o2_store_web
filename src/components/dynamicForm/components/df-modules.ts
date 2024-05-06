// 动态加载组件模块
const humpToUnderline = (str) => {
  if (typeof str != "string") return;
  if (typeof str == "string" && str.length == 1) return;
  let firstStr = str.slice(0, 1);
  let exceptFirstStr = str.slice(1);
  let res = (
    firstStr + exceptFirstStr.replace(/([A-Z])/g, "-$1")
  ).toLowerCase();
  return res;
};
let modules = {};
// @ts-ignore
const FILES = import.meta.glob("./*.vue", { eager: true });
for (const [key, value] of Object.entries(FILES)) {
  //名称  因为这里拿到的是  ./DfCascader.vue ，所以需要两层处理
  let moduleName = key.slice(2);
  let name = moduleName.split(".")[0];
  let newName = humpToUnderline(name);
  //具体的内容，都是每个vue文件中返回值  value.default
  // @ts-ignore
  modules[newName] = value.default;
}

export default modules;
