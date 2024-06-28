/*
 *
 * 使用方式 import { isWscnEmail,validateURL,... } from 'utils/validate';
 * 例如：邮箱验证使用  return isWscnEmail(value)
 *
 */

/* 邮箱验证 */
export function isWscnEmail(str) {
  const reg = /^[a-z0-9](?:[-_.+]?[a-z0-9]+)*@wz\.com$/i;
  return reg.test(str.trim());
}

/* URL验证 */
export function validateURL(textval) {
  const urlregex =
    /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/;
  return urlregex.test(textval);
}

/* 小写字母 */
export function validateLowerCase(str) {
  const reg = /^[a-z]+$/;
  return reg.test(str);
}

/* 大写字母 */
export function validateUpperCase(str) {
  const reg = /^[A-Z]+$/;
  return reg.test(str);
}

/* 大小写字母 */
export function validatAlphabets(str) {
  const reg = /^[A-Za-z]+$/;
  return reg.test(str);
}

/* json 字母排序转成字符串 */
export function sortByKey(obj, flag) {
  if (!obj) {
    return {};
  }
  var newObj = {};
  var sortKeys;
  //对对象递归去null，但是递归不会排序
  if (flag) {
    sortKeys = Object.keys(obj);
  } else {
    sortKeys = Object.keys(obj).sort(function (key1, key2) {
      return key1 > key2 ? 1 : -1;
    });
  }
  sortKeys.forEach((v) => {
    if (obj[v] != null) {
      newObj[v] = obj[v];
    }
    if (
      obj[v] &&
      Object.prototype.toString.call(obj[v]) === "[object Object]"
    ) {
      newObj[v] = sortByKey(obj[v], true);
    } else if (obj[v] != null) {
      newObj[v] = obj[v];
    }
  });
  return newObj;
}
export function textRule(rule, value, callback) {
  var reg = new RegExp("[\\u4E00-\\u9FFF]+$", "g");
  if (!reg.test(value)) {
    callback(new Error("请输入中文"));
  } else {
    callback();
  }
}
export function descRule(rule, value, callback) {
  var reg = new RegExp(
    "[\\u4E00-\\u9FFF\u3002\uff1b\uff0c\uff1a\u201c\u201d\uff08\uff09\u3001\uff1f\u300a\u300b]+$",
    "g"
  );
  if (!reg.test(value)) {
    callback(new Error("请输入中文和正确的标点符号"));
  } else {
    callback();
  }
}
export function cnbRule(rule, value, callback) {
  var reg = new RegExp(
    "[\\u4E00-\\u9FFF\u3002\uff1b\uff0c\uff1a\u201c\u201d\uff08\uff09\u3001\uff1f\u300a\u300b0-9]+$",
    "g"
  );
  if (!reg.test(value)) {
    callback(new Error("请输入中文、数字、正确的标点符号"));
  } else {
    callback();
  }
}
export function codeRule(rule, value, callback) {
  var reg = new RegExp("^[0-9]*$");
  if (!reg.test(value)) {
    callback(new Error("请输入数字"));
  } else {
    callback();
  }
}

/**
 * @name 陈远超
 * @Date 2023-05-29 10:40:48
 * @introduction 最多4位数
 */
export function IntLen4Rule(rule, value, callback) {
  const IntRegLen4 = /^[1-9]\d{0,3}$/;
  var reg = IntRegLen4;
  if (!reg.test(value)) {
    callback(new Error("请输入4位数以内正整数"));
  } else {
    callback();
  }
}

//整数部分最多4位数，小数部分最多一位
export function digitalCheckRule(rule, value, callback) {
  const reg = /^[0-9]{1,4}(\.[0-9]{1,1})?$/;
  if (!reg.test(value)) {
    callback(new Error("请输入最多4位正数带一位小数"));
  } else {
    callback();
  }
}

//身份证校验(非必填)
export function validateIdCard(rule, value, callback) {
  const reg =
    /^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/;
  if (!value) {
    callback();
  } else if (!reg.test(value)) {
    callback(new Error("请输入正确的身份证号"));
  } else {
    callback();
  }
}

//身份证校验(必填)
export function validateIdCardRequired(rule, value, callback) {
  const reg =
    /^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/;
  if (!value) {
    callback(new Error("请输入身份证号"));
  } else if (!reg.test(value)) {
    callback(new Error("请输入正确的身份证号"));
  } else {
    callback();
  }
}

//手机号包括座机-
export function validateTel(rule, value, callback) {
  // eslint-disable-next-line no-useless-escape
  const reg = /^[\d\+\-]*$/;
  if (!value) {
    callback();
  } else if (value && !reg.test(value)) {
    callback(new Error("请输入正确的手机号"));
  } else {
    callback();
  }
}

//手机号包括座机-(必填)
export function validateTelRequired(rule, value, callback) {
  // eslint-disable-next-line no-useless-escape
  const reg = /^[\d\+\-]*$/;
  if (!value) {
    callback(new Error("请输入联系电话"));
  } else if (value && !reg.test(value)) {
    callback(new Error("请输入正确的手机号"));
  } else {
    callback();
  }
}

//身高（3位正整数，非必填）
export function validatorHeight(rule, value, callback) {
  const regex = /^([1-9]|[1-9][0-9]|[1-2][0-9][0-9]|300)$/;
  if (!value) {
    callback();
  } else if (!regex.test(value)) {
    callback(new Error("请输入0-300正整数!"));
  } else {
    callback();
  }
}

//体重校验（3位正整数，非必填）
export function validatorWeight(rule, value, callback) {
  const regex = /^([1-9]|[1-9][0-9]|[1-2][0-9][0-9]|300)(\.\d{1,2})?$/;
  if (!value) {
    callback();
  } else if (!regex.test(value)) {
    callback(new Error("请输入0-300的数!"));
  } else {
    callback();
  }
}

//身高（3位正整数，必填）
export function validatorHeightRequired(rule, value, callback) {
  const regex = /^([1-9]|[1-9][0-9]|[1-2][0-9][0-9]|300)$/;
  if (!value) {
    callback("请输入身高");
  } else if (!regex.test(value)) {
    callback(new Error("请输入0-300正整数!"));
  } else {
    callback();
  }
}

//体重校验（3位正整数，必填）
export function validatorWeightRequired(rule, value, callback) {
  //const regex = /^([1-9]|[1-9][0-9]|[1-2][0-9][0-9]|300)(\.\d{1,2})?$/;
  const regex = /^([1-9]|[1-9][0-9]|[1-2][0-9][0-9]|300)$/;
  if (!value) {
    callback("请输入体重");
  } else if (!regex.test(value)) {
    //callback(new Error("请输入0-300的数!"));
    callback(new Error("请输入0-300正整数!"));
  } else {
    callback();
  }
}

//比例校验（0-100）
export function validatorRatio(rule, value, callback) {
  const regex = /^([0-9]{1,2}|100)$/;
  if (!value) {
    callback("请设置对应比例");
  } else if (!regex.test(value)) {
    callback(new Error("请输入0-100正整数!"));
  } else {
    callback();
  }
}

//通过身份证获取出生年月
export function getBirthdateFromIdCardNum(idCardNum) {
  if (!idCardNum) return;
  const birthrateStr = idCardNum.substring(6, 14);
  const year = birthrateStr.substring(0, 4);
  const month = birthrateStr.substring(4, 6);
  const day = birthrateStr.substring(6, 8);
  return `${year}-${month}-${day}`;
}


//输入中文或英文
export function validateChineseOrEnglish(rule, value, callback) {
  const regex = /^[\u4e00-\u9fa5a-zA-Z]+$/;
  if (!value) {
    callback();
  } else if (!regex.test(value)) {
    callback(new Error("请输入中文或者英文"));
  } else {
    callback();
  }
}

export function validateBigEnglish(rule, value, callback) {
  const regex = /^[A-Z]+$/;
  if (!value) {
    callback();
  } else if (!regex.test(value)) {
    callback(new Error("请输入大写字母"));
  } else {
    callback();
  }
}

//手机号校验
export function phoneRule(rule, value, callback) {
  const regex = /^1[23456789]\d{9}$/;
  if (!value) {
    callback();
  } else if (!regex.test(value)) {
    callback(new Error("请输入正确的手机号"));
  } else {
    callback();
  }
}

//获取菜单
export function getMenu(level) {
  let obj = {
    1: [
      {
        label: "欢迎",
        path: "/home",
        childNode: [],
        icon: "hy",
      },
      {
        label: "朋友圈管理",
        path: "/postManage/list",
        childNode: [],
        icon: "pyq",
      },
      {
        label: "小程序用户管理",
        path: "/wechatUser/list",
        childNode: [],
        icon: "xcxyh",
      },
      {
        label: "活动管理",
        path: "/activityManage",
        childNode: [
          {
            label: "活动分类管理",
            path: "/activityManage/activityType/list",
            childNode: [],
          },
          {
            label: "活动管理",
            path: "/activityManage/activityList/list",
            childNode: [],
          },
          {
            label: "分部活动审核",
            path: "/activityManage/auditActivity/list",
            childNode: [],
          },
          {
            label: "订单管理",
            path: "/activityManage/orderManage/list",
            childNode: [],
          },
          {
            label: "商家管理",
            path: "/activityManage/businessManage/list",
            childNode: [],
          },
        ],
        icon: "hdgl",
      },
      {
        label: "财务管理",
        path: "/financeManage",
        childNode: [
          {
            label: "提现管理",
            path: "/financeManage/withdrawManage/list",
            childNode: [],
          },
        ],
        icon: "cwgl",
      },
      {
        label: "学校管理",
        path: "/schoolManage/list",
        childNode: [],
        icon: "xxgl",
      },
      {
        label: "管理页面",
        path: "/systemManage/personalInfo",
        childNode: [
          {
            label: "个人信息",
            path: "/systemManage/personalInfo",
            childNode: [],
          },
          {
            label: "首页菜单管理",
            path: "/systemManage/homeMenu",
            childNode: [],
          },
        ],
        icon: "gl",
      },
    ],
    2: [{
      label: "欢迎",
      path: "/home",
      childNode: [],
      icon: "hy",
    },
    {
      label: "订单列表",
      path: "/merchantManage/merchantOrder/list",
      childNode: [],
      icon: "dd",
    },
    {
      label: "活动列表",
      path: "/merchantManage/merchantActivity/list",
      childNode: [],
      icon: "hdgl",
    }, {
      label: "管理页面",
      path: "/systemManage/personalInfo",
      childNode: [
        {
          label: "个人信息",
          path: "/systemManage/personalInfo",
          childNode: [],
        },
      ],
      icon: "gl",
    },]
  }
  return obj[level]
}



