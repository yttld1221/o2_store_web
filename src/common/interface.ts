export interface ANY_OBJ {
    [proppName: string]: any;
}

export interface LIST_DATA_TYPE {
    router?: any;
    route?: any;
    pageInfo: {
        pageSize: number;
        pageNum: number;
    }
    total: number;
    tableData: Array<ANY_OBJ>;
}

export interface STATUS {
    label: string;
    value: number;
    color: string;
}

