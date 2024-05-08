import { defineConfig, loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';
import { svgBuilder } from './src/icons/index';
import postcsspxtoviewport from 'postcss-px-to-viewport-8-plugin';
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers';
import Icons from 'unplugin-icons/vite';
import IconsResolver from 'unplugin-icons/resolver';
import ElementPlus from 'unplugin-element-plus/vite';

// import viteSentry from 'vite-plugin-sentry';

// https://vitejs.dev/config/
// const sentryConfig = {
//   url: 'https://10.153.2.51:9000/',
//   authToken: 'c60081a838df4ba59e91221c1b7a51d474f06b67fb844801829e7ec95df91245', //sentry授权令牌
//   org: 'sentry',
//   project: 'edu-supervise-admin',
//   release: '1.0.0',
//   setCommits: {
//     auto: true
//   },
//   sourceMaps: {
//     include: ['./dist/assets'],
//     ignore: ['node_modules'],
//     urlPrefix: '~/assets'
//   }
// };

export default ({ mode }) => {
  const env = loadEnv(mode, process.cwd());
  return defineConfig({
    base: env.VITE_BASE_URL, //访问路径
    plugins: [
      vue(),
      svgBuilder('./src/icons/svg/'),
      AutoImport({
        imports: ['vue', 'vue-router'], // 自动导入vue、vue-router、pinia相关API
        resolvers: [
          ElementPlusResolver(),
          // 自动导入图标组件
          IconsResolver({
            prefix: 'Icon'
          })
        ]
      }),
      Components({
        resolvers: [
          // 自动注册图标组件
          IconsResolver({
            enabledCollections: ['ep']
          }),
          ElementPlusResolver({
            importStyle: 'sass',
            directives: true,
            version: '2.4.4'
          })
        ]
      }),
      // 图标导入
      Icons({
        compiler: 'vue3',
        autoInstall: true
      }),
      ElementPlus()
      // ['production'].includes(env.NODE_ENV) ? viteSentry(sentryConfig) : null
    ],
    server: {
      host: '0.0.0.0',
      port: 8089,
      proxy: {
        '/admin': {
          target: 'https://api2.allinnb.com/admin', //测试
          changeOrigin: true,
          rewrite: path => path.replace(/^\/admin/, '')
        }
      }
    },
    css: {
      postcss: {
        plugins: [
          postcsspxtoviewport({
            unitToConvert: 'rpx', // 要转化的单位
            viewportWidth: 1920, // UI设计稿的宽度
            unitPrecision: 3, // 转换后的精度，即小数点位数
            propList: ['*'], // 指定转换的css属性的单位，*代表全部css属性的单位都进行转换
            viewportUnit: 'vw', // 指定需要转换成的视窗单位，默认vw
            fontViewportUnit: 'vw', // 指定字体需要转换成的视窗单位，默认vw
            selectorBlackList: [], // 指定不转换为视窗单位的类名，
            minPixelValue: 1, // 默认值1，小于或等于1px则不进行转换
            mediaQuery: true, // 是否在媒体查询的css代码中也进行转换，默认false
            replace: true, // 是否转换后直接更换属性值
            // exclude: [/node_modules/], // 设置忽略文件，用正则做目录名匹配
            exclude: [],
            landscape: false // 是否处理横屏情况
          })
        ]
      }
    },
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src')
      },
      extensions: ['.js', '.vue', '.json', '.scss', '.ts', '*']
    },
    build: {
      // 打包配置
      assetsDir: 'static', //路径
      sourcemap: ['production'].includes(env.NODE_ENV),
      rollupOptions: {
        input: {
          // 入口文件
          main: resolve(__dirname, 'index.html')
          // 其他入口
          // nested: resolve(__dirname, 'xxxx.index')
        },
        output: {
          entryFileNames: `static/[name].js`,
          chunkFileNames: `static/[name].js`,
          assetFileNames: `static/[name].[ext]`
        }
      }
    }
  });
};
