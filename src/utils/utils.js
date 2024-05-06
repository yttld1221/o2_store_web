import config from './uploadConfig';
import { Base64 } from './base64';
export function random_string(len) {
  len = len || 32;
  var chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
  var maxPos = chars.length;
  var pwd = '';
  for (var i = 0; i < len; i++) {
    pwd += chars.charAt(Math.floor(Math.random() * maxPos));
  }
  return pwd;
}
export function setPreviewFileUrl(filetype, url) {
  let base = new Base64();
  let previewFile = '';
  if (process.env.NODE_ENV == 'production') {
    previewFile = config.previewFile['ip'];
  } else {
    previewFile = config.previewFile['ipDev'];
  }
  const openUrl =
    `${config.previewFile[filetype]}` +
    encodeURIComponent(base.encode(previewFile + url));
  return openUrl;
}
//生成文件上传的参数
export function getUploadFileParams(file, fileDirName) {
  function get_suffix(filename) {
    var pos = filename.lastIndexOf('.');
    var suffix = '';
    if (pos != -1) {
      suffix = filename.substring(pos);
    }
    return suffix;
  }
  if (!fileDirName) {
    fileDirName = 'map/home/';
  }
  var date = new Date(),
    month =
      (date.getMonth() + 1).toString().length === 1
        ? '0' + (date.getMonth() + 1)
        : date.getMonth() + 1,
    day =
      date.getDate().toString().length === 1
        ? '0' + date.getDate()
        : date.getDate(),
    fileUrl =
      fileDirName +
      date.getFullYear() +
      month +
      day +
      '/' +
      random_string(10) +
      date.getTime() +
      get_suffix(file.name),
    dateOver = new Date(date.getTime() + 5 * 60 * 1000),
    policyText = {
      expiration: dateOver.toISOString(), //设置该Policy的失效时间，超过这个失效时间之后，就没有办法通过这个policy上传文件了
      conditions: [
        ['content-length-range', 0, 1048576000] // 设置上传文件的大小限制
      ]
    },
    policyBase64 = Base64.encode(JSON.stringify(policyText)),
    bytes = Crypto.HMAC(Crypto.SHA1, policyBase64, process.env.ACCESSKEY, {
      asBytes: true
    }),
    signature = Crypto.util.bytesToBase64(bytes);
  return {
    key: fileUrl,
    policy: policyBase64,
    success_action_status: '200',
    OSSAccessKeyId: process.env.ACCESSID,
    signature: signature
  };
}
//金额转换
export function unitConvert(num) {
  var moneyUnits = ['元', '万元', '亿元', '万亿'];
  var dividend = 10000;
  var curentNum = num || 0;
  //转换数字
  var curentUnit = moneyUnits[0];

  function strNumSize(tempNum) {
    var stringNum = tempNum.toString();
    var index = stringNum.indexOf('.');
    var newNum = stringNum;
    if (index != -1) {
      newNum = stringNum.substring(0, index);
    }
    return newNum.length;
  }
  //转换单位
  for (var i = 0; i < 4; i++) {
    curentUnit = moneyUnits[i];
    if (strNumSize(curentNum) < 5) {
      break;
    }
    curentNum = curentNum / dividend;
  }
  var m = {
    num: 0,
    unit: ''
  };
  m.num = curentNum.toFixed(2);
  m.unit = curentUnit;
  return `${m.num}${m.unit}`;
}
//获取当前日期
export function getCurrentDate() {
  let date = new Date();
  var y = date.getFullYear();
  var m = date.getMonth() + 1;
  m = m < 10 ? '0' + m : m;
  var d = date.getDate();
  d = d < 10 ? '0' + d : d;
  return y + '-' + m + '-' + d;
}

export function textRule(rule, value, callback) {
  var reg = new RegExp('[\u4e00-\u9fa5]+$', 'g');
  if (!reg.test(value)) {
    callback(new Error('请输入中文'));
  } else {
    callback();
  }
}
export function userNameRule(rule, value, callback) {
  //console.log(value);
  var reg = new RegExp('^[a-zA-Z\u4e00-\u9fa5]+$', 'g');
  if (!reg.test(value)) {
    callback(new Error('请输入中文或英文'));
  } else {
    callback();
  }
}
export function userNameRule2(rule, value, callback) {
  var reg = new RegExp('^[a-zA-Z\u4e00-\u9fa5\\s]+$', 'g');
  if (!reg.test(value)) {
    callback(new Error('请输入中文或英文或空格'));
  } else {
    callback();
  }
}
export function descRule(rule, value, callback) {
  var reg = new RegExp(
    '[\u4e00-\u9fa5\u3002\uff1b\uff0c\uff1a\u201c\u201d\uff08\uff09\u3001\uff1f\u300a\u300b]+$',
    'g'
  );
  if (!reg.test(value)) {
    callback(new Error('请输入中文和正确的标点符号'));
  } else {
    callback();
  }
}
export function norequiredesc(rule, value, callback) {
  var reg = new RegExp(
    '[\u4e00-\u9fa5\u3002\uff1b\uff0c\uff1a\u201c\u201d\uff08\uff09\u3001\uff1f\u300a\u300b]+$',
    'g'
  );
  if (!value) {
    callback();
  } else {
    if (!reg.test(value)) {
      callback(new Error('请输入中文和正确的标点符号'));
    } else {
      callback();
    }
  }
}

export function scoreRule(rule, value, callback) {
  var reg = new RegExp('^[0-9./]+$', 'g');
  if (!value) {
    callback();
  } else {
    if (!reg.test(value)) {
      callback(new Error('请输入数字 . /'));
    } else {
      callback();
    }
  }
}

export function cnbRule(rule, value, callback) {
  var reg = new RegExp(
    '[\u4e00-\u9fa5\u3002\uff1b\uff0c\uff1a\u201c\u201d\uff08\uff09\u3001\uff1f\u300a\u300b0-9]+$',
    'g'
  );
  if (!reg.test(value)) {
    callback(new Error('请输入中文、数字、正确的标点符号'));
  } else {
    callback();
  }
}
export function codeRule(rule, value, callback) {
  var reg = new RegExp('^[0-9]*$');
  if (!reg.test(value)) {
    callback(new Error('请输入数字'));
  } else {
    callback();
  }
}
export function codeRule2(rule, value, callback) {
  var reg = new RegExp('[a-zA-Z0-9]+$', 'g');
  if (!reg.test(value)) {
    callback(new Error('请输入数字、英文'));
  } else {
    callback();
  }
}
export function codeRule3(rule, value, callback) {
  var reg =
    /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[~!@#$%^&*/()|_+`\-={}:";'<>?,.\/]).{8,64}$/;
  if (!reg.test(value)) {
    callback(new Error('密码至少8位，含数字、英文字母、特殊符号'));
  } else {
    callback();
  }
}
export function staffCodeRule(rule, value, callback) {
  var reg = new RegExp('^[0-9]*$');
  if (!reg.test(value)) {
    callback(new Error('工号格式错误'));
  } else {
    if (value.length != 8) {
      callback(new Error('工号格式错误'));
    } else {
      callback();
    }
  }
}
export function phoneRule(rule, value, callback) {
  var reg = new RegExp('^[0-9]*$');
  if (!reg.test(value)) {
    callback(new Error('请输入数字'));
  } else {
    let regs = /^[1][3,4,5,6,7,8,9][0-9]{9}$/;
    if (!regs.test(value)) {
      callback(new Error('手机号码格式不正确'));
    } else {
      callback();
    }
  }
}
export function passWordRule(rule, value, callback) {
  if (value.length < 6) {
    callback(new Error('新密码至少为6位字符'));
  } else {
    callback();
  }
}

export function urlEncode(param, key, encode) {
  if (param == null) return '';
  var paramStr = '';
  var t = typeof param;
  if (t == 'string' || t == 'number' || t == 'boolean') {
    paramStr +=
      '&' +
      key +
      '=' +
      (encode == null || encode ? encodeURIComponent(param) : param);
  } else {
    for (var i in param) {
      var k =
        key == null
          ? i
          : key + (param instanceof Array ? '[' + i + ']' : '.' + i);
      paramStr += urlEncode(param[i], k, encode);
    }
  }
  return paramStr;
}

export function validNode(rule, value, callback) {
  //console.log(889, value);
  if (value[value.length - 1].approverType == 6) {
    callback();
  } else {
    callback(new Error('流程节点未归档'));
  }
}
export function setTree(arr) {
  let newArr = [];
  arr.forEach(item => {
    let index = newArr.findIndex(
      el => el.sphaseStudying == item.sphaseStudying
    );
    if (index < 0) {
      newArr.push({
        ...item,
        label: item.sphaseStudying_zn,
        type: 'xd',
        children: []
      });
    }
  });
  //console.log(newArr);
  newArr.forEach(item => {
    arr.forEach(item1 => {
      if (item.sphaseStudying == item1.sphaseStudying) {
        let index = item.children.findIndex(el => el.grade == item1.grade);
        if (index < 0) {
          item.children.push({
            ...item1,
            label: item1.grade_zn,
            type: 'grade',
            children: []
          });
        }
      }
    });
  });
  //console.log(newArr);
  newArr.forEach(item => {
    item.children.forEach(item1 => {
      arr.forEach(item2 => {
        if (
          item1.sphaseStudying == item2.sphaseStudying &&
          item1.grade == item2.grade
        ) {
          item1.children.push({
            ...item2,
            label: item2.className,
            type: 'class'
          });
        }
      });
    });
  });
  //console.log(newArr);
  return newArr;
}

export function getClassTree(arr, type) {
  let newArr = [];
  arr.forEach(item => {
    let index = newArr.findIndex(
      el => el.sphaseStudying == item.sphaseStudying
    );
    if (index < 0) {
      newArr.push({
        ...item,
        id: item.sphaseStudying,
        label: item.sphaseStudying_zn,
        type: 'xd',
        children: []
      });
    }
  });
  //console.log(newArr);
  newArr.forEach(item => {
    arr.forEach(item1 => {
      if (item.sphaseStudying == item1.sphaseStudying) {
        let index = item.children.findIndex(el => el.grade == item1.grade);
        if (index < 0) {
          item.children.push({
            ...item1,
            label: item1.grade_zn,
            id: item1.grade,
            type: 'grade',
            children: []
          });
        }
      }
    });
  });
  //console.log(newArr);
  if (type == 'class') {
    newArr.forEach(item => {
      item.children.forEach(item1 => {
        arr.forEach(item2 => {
          if (
            item1.sphaseStudying == item2.sphaseStudying &&
            item1.grade == item2.grade
          ) {
            item1.children.push({
              ...item2,
              label: item2.className,
              type: 'class'
            });
          }
        });
      });
    });
    //console.log(newArr);
  }
  return newArr;
}
export function getIncludeList() {
  // 'testStudentsList', 'regularStudentsList', 'predictionList'
  return [];
}

//判断文件最大值，单位 M
export const isMax = (file, size) => {
  return Math.ceil(file.size / 1024 / 1024) < size;
};

//判断文件校验格式是否为空
export const isValid = (file, acceptArr) => {
  if (acceptArr.length === 0) {
    return true;
  }
  if (file.raw?.type) {
    let type = file.raw?.type.split('/')[1]
      ? '.' + file.raw.type.split('/')[1]
      : '';
    return acceptArr.includes(type);
  }
  if (file.name) {
    const fileSuffix = file.name
      .substring(file.name.lastIndexOf('.'))
      .toLowerCase();
    return acceptArr.includes(fileSuffix);
  }
  return true;
};

// Blob 文件下载
export function downloadFileWithUrl(blob, fileName = '拔尖人才平台文件') {
  // 创建一个临时的 Blob URL
  const url = window.URL.createObjectURL(blob)
  // 创建一个 <a> 标签用于触发下载
  const link = document.createElement('a')
  link.href = url
  link.download = fileName // 设置下载的文件名
  document.body.appendChild(link)
  // 触发下载
  link.click()
  // 清理临时 URL
  URL.revokeObjectURL(url)
  // 移除 <a> 标签
  document.body.removeChild(link)
}

// a标签链接地址下载
export function downloadFileWithLink(url, fileName = '拔尖人才平台文件') {
  const link = document.createElement('a')
  link.href = url
  link.download = fileName // 设置下载的文件名
  document.body.appendChild(link)
  // 触发下载
  link.click()
  // 清理临时 URL
  URL.revokeObjectURL(url)
  // 移除 <a> 标签
  setTimeout(() => {
    document.body.removeChild(link)
  }, 1000)

}

//深拷贝
export function deepClone(target) {
  let newObj; // 定义一个变量，准备接新副本对象
  // 如果当前需要深拷贝的是一个引用类型对象
  if (typeof target === "object") {
    if (Array.isArray(target)) {
      // 如果是一个数组
      newObj = []; // 将newObj赋值为一个数组，并遍历
      for (let i in target) {
        // 递归克隆数组中的每一项
        newObj.push(deepClone(target[i]));
      }
      // 判断如果当前的值是null;直接赋值为null
    } else if (target === null) {
      newObj = null;
      // 判断如果当前的值是一个正则表达式对象，直接赋值
    } else if (target.constructor === RegExp) {
      newObj = target;
    } else {
      // 否则是普通对象，直接for in循环递归遍历复制对象中每个属性值
      newObj = {};
      for (let i in target) {
        newObj[i] = deepClone(target[i]);
      }
    }
    // 如果不是对象而是原始数据类型，那么直接赋值
  } else {
    newObj = target;
  }
  // 返回最终结果
  return newObj;
}

