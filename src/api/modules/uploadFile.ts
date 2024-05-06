import { AxiosPromise } from "axios";
import uploadAxios from "../uploadAxios";

const uploadFile={
    // 文件上传
  fileUpload(data: any): AxiosPromise<any> {
    //console.log(import.meta.env.MODE)
    return uploadAxios({
      url:import.meta.env.MODE=="production"?'/fast-file/fileWithout/uploadGroup/group2':'/fast-file/fileWithout/uploadGroup/group1',
      method: "POST",
      data,
    });
  },
}
export default uploadFile;