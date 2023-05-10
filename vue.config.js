const path = require("path");
// 开启gzip压缩，按需引用
const CompressionWebpackPlugin = require("compression-webpack-plugin");
// 开启gzip压缩，按需写入
const productionGzipExtensions = /\.(js|css|json|txt|html|icon|svg)(\?>*)?$/i;
// 打包分析
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer");
// 是否是生产环境
const isProduction = ["production", "prod"].includes(process.env.NODE_ENV);
const webpack = require("webpack");

const { postcss } = require("./src/config/pxtorem");
function resolve(dir) {
  return path.join(__dirname, dir);
}
// console.log(process.env.VUE_APP_ENV);

// 配置预解析的内容
const sourcePrefetch = {
  // dns预解析
  dns: [],
  // 字体预解析
  fonts: [],
};

const cdn = {
  // 忽略打包的第三方库
  externals: {
    // jquery: "jQuery",
    // echarts: "echarts",
    // moment: "moment",
  },
};
console.log("process.env.NODE_ENV", process.env.VUE_APP_ENV);
const Timestamp = new Date().getTime();
module.exports = {
  // publicPath: "./",
  publicPath: process.env.NODE_ENV === "production" ? "/carweb/v3/" : "./",
  // publicPath: "/carweb/v3/",
  //将构建好的文件输出到哪里 当运行 vue-cli-service build 时生成的生产环境构建文件的目录。注意目标目录在构建之前会被清除 (构建时传入 --no-clean 可关闭该行为)。
  outputDir: "dist",
  //放置生成的静态资源(js、css、img、fonts)的目录。
  assetsDir: "static",
  // 指定生成的 index.html 的输出路径
  indexPath: "index.html",
  filenameHashing: true,
  // 如果你希望让 lint 错误在开发时直接显示在浏览器中，你可以使用 lintOnSave: 'error'。这会强制 eslint-loader 将 lint 错误输出为编译错误，同时也意味着 lint 错误将会导致编译失败。
  lintOnSave: false,

  //是否使用包含运行时编译器的 Vue 构建版本。设置为 true 后你就可以在 Vue 组件中使用 template 选项了，但是这会让你的应用额外增加 10kb 左右。
  runtimeCompiler: false,

  // 默认情况下 babel-loader 会忽略所有 node_modules 中的文件。如果你想要通过 Babel 显式转译一个依赖，可以在这个选项中列出来。
  transpileDependencies: [],

  //如果你不需要生产环境的 source map，可以将其设置为 false 以加速生产环境构建。
  productionSourceMap: false,
  chainWebpack: (config) => {
    // 配置别名
    config.resolve.alias.set("@", resolve("src"));
    // 修复热更新失效
    config.resolve.symlinks(true);
    config.plugin("html").tap((args) => {
      // 修复路由懒加载的报错
      args[0].chunksSortMode = "none";
      // 预解析
      args[0].sourcePrefetch = sourcePrefetch;
      return args;
    });
    // 压缩图片(建议使用cnpm安装该插件)
    // config.module
    //   .rule("images") // 这里换svg 即可0.0
    //   .use("image-webpack-loader")
    //   .loader("image-webpack-loader")
    //   .options({
    //     quality: "65-80",
    //   })
    //   .end();

    if (isProduction) {
      // 去除预加载的 prefetch
      config.plugins.delete("preload");
      config.plugins.delete("prefetch");
      // 打包分析, 打包后会自动生成一个report.html文件
      // config.plugin("webpack-report").use(BundleAnalyzerPlugin, [{ analyzerMode: "static" }]);
    }
    if (process.env.use_analyzer) {
      config.plugin("webpack-bundle-analyzer").use(require("webpack-bundle-analyzer").BundleAnalyzerPlugin);
    }
  },

  // 调整webpack配置
  configureWebpack: (config) => {
    config.externals = cdn.externals;
    if (isProduction) {
      // 开启gzip压缩
      config.plugins.push(
        new CompressionWebpackPlugin({
          filename: "[path].gz[query]",
          algorithm: "gzip",
          test: productionGzipExtensions,
          threshold: 10240,
          minRatio: 0.8,
        })
      );
      config.plugins.push(
        new webpack.ProvidePlugin({
          $: "jquery",
          jquery: "jquery",
          jQuery: "jquery",
          "window.jQuery": "jquery",
        })
      );
      // 取消webpack警告性能的提示
      config.performance = {};
    }
    // 打包分离js
    config.optimization = {
      splitChunks: {
        chunks: "async",
        minChunks: 2,
        minSize: 100000,
        cacheGroups: {
          base: {
            name: "base",
            minChunks: 1,
            test: /[\\/]node_modules[\\/]vue[\\/]|[\\/]node_modules[\\/]vue-router[\\/]|[\\/]node_modules[\\/]vuex[\\/]|[\\/]node_modules[\\/]axios[\\/]/,
            chunks: "initial",
            priority: -3,
          },
          i18n: {
            name: "vue-i18n",
            test: /[\\/]node_modules[\\/]vue-i18n[\\/]/,
            chunks: "initial",
            minChunks: 1,
            priority: -4,
            reuseExistingChunk: true,
            enforce: true,
          },
        },
      },
    };
    config.optimization.runtimeChunk = {
      name: "manifest",
    };
  },
  //是否为 Babel 或 TypeScript 使用 thread-loader。该选项在系统的 CPU 有多于一个内核时自动启用，仅作用于生产构建。
  parallel: require("os").cpus().length > 1,
  // 代理配置
  devServer: {
    host: "0.0.0.0",
    port: 8081, // 端口号
    https: false, // https:{type:Boolean}
    open: false, // 配置自动启动浏览器  open: 'Google Chrome'-默认启动谷歌

    // 配置多个代理

    proxy: {
      "/": {
        // targer: baseUrl.serverUrl,
        // target: process.env.VUE_APP_ENV,
        target: "http://test.basegps.com",
        // target: "http://task.domilink.cn:8088",
        // target: "http://192.168.1.238:8080",
        // target: "http://web1-server",
        // target: "https://www.domilink.com/",
        // target: "http://192.168.1.188:8080/", //本地测试锅波
        changeOrigin: true,
        pathRewrite: { "^/": "" },
      },
    },
  },
  // css配置相关
  css: {
    // 使用dart-sass时需要打开
    loaderOptions: {
      postcss: {
        plugins: [postcss],
      },
      sass: {
        implementation: require("sass"), // This line must in sass option
      },
    },
  },
  // PWA插件相关配置
  pwa: {},
  // 第三方插件配置
  pluginOptions: {},
};
