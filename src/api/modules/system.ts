import { AxiosPromise } from 'axios';
import http from '../axios';

const teacher = {
  // 角色列表
  sysRoleQueryByPage(data: any): AxiosPromise<any> {
    return http({
      url: '/sysRole/pageRole',
      method: 'POST',
      data
    });
  },
  // 角色详情
  sysRolequeryByIdFunction(data: any): AxiosPromise<any> {
    return http({
      url: '/sysRole/queryRoleById',
      method: 'GET',
      params: data
    });
  },
  // 删除角色
  sysRoledeleteById(data: any): AxiosPromise<any> {
    return http({
      url: '/sysRole/deleteById',
      method: 'GET',
      params: data
    });
  },
  // 新增角色数据
  sysRoleadd(data: any): AxiosPromise<any> {
    return http({
      url: '/sysRole/add',
      method: 'POST',
      data
    });
  },
  // 修改角色数据
  sysRoleedit(data: any): AxiosPromise<any> {
    return http({
      url: '/sysRole/edit',
      method: 'POST',
      data
    });
  },
  // 查询菜单树
  queryMenuTree(data: any): AxiosPromise<any> {
    return http({
      url: '/sysMenu/queryMenuTree',
      method: 'GET',
      params: data
    });
  },
  // 角色下拉
  roleList(data: any): AxiosPromise<any> {
    return http({
      url: '/sysRole/roleList',
      method: 'GET',
      params: data
    });
  },
  // 用户列表
  staffInfoList(data: any): AxiosPromise<any> {
    return http({
      url: '/staffInfo/pageStaffInfo',
      method: 'POST',
      data
    });
  },
  // 用户详情
  staffInfoid(data: any): AxiosPromise<any> {
    return http({
      url: '/staffInfo/queryByStaffCode',
      method: 'GET',
      params: data
    });
  },
  // 用户姓名模糊查询
  queryLikeStaffCodeByStaffName(data: any): AxiosPromise<any> {
    return http({
      url: '/staffInfo/queryLikeStaffCodeByStaffName',
      method: 'GET',
      params: data
    });
  },
  // 用户新增
  staffInfoadd(data: any): AxiosPromise<any> {
    return http({
      url: '/staffInfo/add',
      method: 'POST',
      data
    });
  },
  // 用户修改
  staffInfoedit(data: any): AxiosPromise<any> {
    return http({
      url: '/staffInfo/edit',
      method: 'POST',
      data
    });
  },
  // 校验是否为内部员工
  checkInternal(data: any): AxiosPromise<any> {
    return http({
      url: '/staffInfo/checkInternal/' + data.mobile,
      method: 'GET'
    });
  },
  // 角色变更启用状态
  rolechangeEnable(data: any): AxiosPromise<any> {
    return http({
      url: '/sysRole/changeEnable',
      method: 'GET',
      params: data
    });
  },
  // 用户变更启用状态
  userchangeEnable(data: any): AxiosPromise<any> {
    return http({
      url: '/staffInfo/changeEnable',
      method: 'GET',
      params: data
    });
  }
};
export default teacher;
