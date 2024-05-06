interface FORM_DATA{
    oldPwd:string;
    pwd:string;
    confirmPwd:string;
}

export interface HEADER_DATA_TYPE{
    upPwd:boolean;
    formData:FORM_DATA;
}