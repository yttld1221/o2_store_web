<script setup>
const { MODE, DEV } = import.meta.env;
let sysCode = '';
if ((MODE === 'sit' || MODE === 'development') && DEV) {
  sysCode = 'top-genius-local';
} else {
  sysCode = 'top-genius';
}
const href =
  MODE === 'sit' || MODE === 'development'
    ? 'http://10.30.5.34/login'
    : 'https://i.hailiangedu.com/login';

localStorage.removeItem('bjAdminToken');
localStorage.removeItem('bjAdminMenu');
location.href = `${href}?sysCode=${sysCode}`;
</script>

<template>
  <div>跳转登录中</div>
</template>
