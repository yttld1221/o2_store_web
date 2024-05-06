import system from '../api/modules/system.ts';
let list = [];
system.queryAllGrade({}).then(res => {
  //console.log(res);
  res.forEach(el => {
    let arr = el.supDictionaryVoList.map(item => {
      return {
        label: item.dictionaryValueZh,
        value: item.dictionaryKey
      };
    });
    list.push({
      label: el.dictionaryValueZh,
      value: el.dictionaryKey,
      children: arr
    });
  });
});

const getGrade = sphaseKey => {
  if (sphaseKey) {
    for (let item of list) {
      if (sphaseKey === item.value) {
        return [
          {
            label: '全部',
            value: ''
          },
          ...item.children
        ];
      }
    }
  } else {
    return [
      {
        label: '全部',
        value: ''
      }
    ];
  }
};
const getSchoolType = val => {
  const schoolType = [
    {
      label: '自主办学',
      value: '1'
    },
    {
      label: '托管学校',
      value: '2'
    }
  ];
  for (let item of schoolType) {
    if (val == item.value) {
      return item.label;
    }
  }
};
const quickGrade = () => {
  return list;
};
export { getGrade, getSchoolType, quickGrade };
