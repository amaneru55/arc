import path from "path";
import { Configuration, HotModuleReplacementPlugin } from "webpack";
import HtmlWebpackPlugin from "html-webpack-plugin";
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin'
import ESLintPlugin from 'eslint-webpack-plugin'
import WebpackBar from 'webpackbar'
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer'
const pathResolve = (pathUrl: string) => path.join(__dirname, pathUrl)

const config: Configuration = {
  mode: "development",
  output: {
    publicPath: "/",
  },
  entry: "./src/index.tsx",
  module: {
    rules: [
      {
        // ts | tsx | jsx 转换
        test: /\.(ts|js)x?$/i,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: [
              "@babel/preset-env",
              "@babel/preset-react",
              "@babel/preset-typescript",
            ],
          },
        },
      },
      {
        test: /\.css$/i,
        use: [
          {
            loader: 'style-loader',
          },
          {
            loader: 'css-loader',
            options: {
              sourceMap: true,
              modules: {
                mode: "local",
                auto: true,
                exportGlobals: true,
                localIdentName: "[path][name]__[local]--[hash:base64:5]",
                localIdentContext: path.resolve(__dirname, "src"),
                localIdentHashSalt: "custom",
                namedExport: true,
                exportLocalsConvention: "camelCase",
                exportOnlyLocals: false,
              }
            }
          },
        ]
      },
      {
        test: /\.scss$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'style-loader',
          },
          {
            loader: 'css-loader',
            options: {
              sourceMap: true,
              modules: {
                mode: "local",
                auto: true,
                exportGlobals: true,
                localIdentName: "[path][name]__[local]--[hash:base64:5]",
                localIdentContext: path.resolve(__dirname, "src"),
                localIdentHashSalt: "custom",
              }
            },
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: true,
            },
          },
        ],
      },
      {
        test: /\.(png|jpg|gif|wof|wof2|txt)$/,
        exclude: /node_modules/,
        type: 'asset',
      },
      {
        test: /\.svg$/,
        exclude: /node_modules/,
        use: ['@svgr/webpack'],
      },
      {
        test: /\.wasm$/,
        exclude: /node_modules/,
        include: path.resolve(__dirname, 'src'),
        use: [{
          loader: 'wasm-loader',
          options: {},
        }],
      }
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js", ".wasm"],
    alias: {
      '@': pathResolve('./src'),
      '@components': pathResolve('./src/components'),
      '@pages': pathResolve('./src/pages'),
      '@hooks': pathResolve('./src/hooks'),
      '@api': pathResolve('./src/api'),
      '@utils': pathResolve('./src/utils'),
      '@assets': pathResolve('./src/assets'),
      '@layout': pathResolve('./src/layout'),
      '@redux': pathResolve('./src/redux'),
      '@wasm': pathResolve('./src/wasm'),
      '@shared': pathResolve('./src/shared'),
    }
  },
  plugins: [
    // 复制 html
    new HtmlWebpackPlugin({
      template: "public/index.html",
    }),
    // 热更新
    new HotModuleReplacementPlugin(),
    // 类型检测
    new ForkTsCheckerWebpackPlugin({
      async: false,
    }),
    // eslint
    new ESLintPlugin({
      extensions: ["js", "jsx", "ts", "tsx"],
      exclude: ["node_modules", "wasm"],
    }),
    // 进度条
    new WebpackBar({}),
    // 打包产物分析
    new BundleAnalyzerPlugin({
      analyzerPort: 8888,
    }),
  ],
  // 抽离供应模块
  optimization: {
    splitChunks: {
      cacheGroups: {
        commons: {
          chunks: 'initial',
          minChunks: 2,
          maxInitialRequests: 5,
          minSize: 0
        },
        vendor: {
          test: /node_modules/,
          chunks: 'initial',
          name: 'vendor',
          priority: 10,
          enforce: true,
        }
      }
    }
  },
  devtool: "inline-source-map",
  // 实验性性质
  experiments: {
    // 阻塞加载 wasm
    asyncWebAssembly: true,
  },
  devServer: {
    static: path.join(__dirname, "build"),
    historyApiFallback: true,
    port: 2333,
    open: true,
    client: {
      progress: true,
      logging: 'warn'
    },
  },
  stats: {
    colors: true,
    cached: true,
    builtAt: true,
    timings: true,
  },
};

export default config;
