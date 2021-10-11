import path from "path";
import { Configuration } from "webpack";
import HtmlWebpackPlugin from "html-webpack-plugin";
import ForkTsCheckerWebpackPlugin from "fork-ts-checker-webpack-plugin";
import ESLintPlugin from "eslint-webpack-plugin";
import { CleanWebpackPlugin } from "clean-webpack-plugin";
import CompressionWebpackPlugin from 'compression-webpack-plugin'
const pathResolve = (pathUrl: string) => path.join(__dirname, pathUrl)

const config: Configuration = {
  mode: "production",
  entry: "./src/index.tsx",
  output: {
    path: path.resolve(__dirname, "build"),
    filename: "[name].[contenthash].js",
    publicPath: "",
  },
  module: {
    rules: [
      {
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
        exclude: /node_modules/,
        use: [
          {
            loader: 'style-loader',
          },
          {
            loader: 'css-loader',
            options: {
              sourceMap: false,
              modules: {
                mode: "local",
                auto: true,
                exportGlobals: true,
                localIdentName: "[path][name]__[local]--[hash:base64:5]",
                localIdentContext: path.resolve(__dirname, "src"),
                localIdentHashSalt: "custom",
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
              sourceMap: false,
              modules: {
                mode: "local",
                auto: true,
                exportGlobals: true,
                localIdentName: "[path][name]__[local]--[hash:base64:5]",
                localIdentContext: path.resolve(__dirname, "src"),
                localIdentHashSalt: "custom",
              }
            }
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: false,
            }
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
      },
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
    new HtmlWebpackPlugin({
      template: "public/index.html",
    }),
    new ForkTsCheckerWebpackPlugin({
      async: false,
    }),
    new ESLintPlugin({
      extensions: ["js", "jsx", "ts", "tsx"],
    }),
    // 代码压缩
    new CompressionWebpackPlugin({
      algorithm: 'gzip',
      test: new RegExp(
        '\\.(' +
        ['js', 'css'].join('|') +
        ')$'
      ),
      threshold: 1024,
      minRatio: 0.8
    }),
    // 清除旧的构建文件
    new CleanWebpackPlugin(),
  ],
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
  experiments: {
    asyncWebAssembly: true,
  }
};

export default config;
