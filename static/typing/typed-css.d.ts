// css 模块声明
declare module '*.module.css' {
  const content: { [key: string]: any }
  export = content
}

// scss 模块声明
declare module '*.module.scss' {
  const content: {[key: string]: any}
  export = content
}
// less 模块声明
declare module '*.module.less' {
  const content: { [key: string]: any }
  export default content
}
