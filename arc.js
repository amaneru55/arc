const fse = require('fs-extra')
const path = require('path')
const os = require('os')
const { execSync } = require('child_process')
const { Command } = require('commander')
const validateProjectName = require('validate-npm-package-name')
const packageJson = require('./package.json')
const dep = require('./dep.json')
const { Print } =  require('./tool')
const fs = require('fs')
const print = new Print()

function get_args() {
  let projectName
  new Command(packageJson.name)
    .version(packageJson.version)
    .arguments('<project-name>')
    .action(name => projectName = name)
    .parse(process.argv)

  const root = path.resolve(projectName)
  const appName = path.basename(root)

  if (!validateProjectName(appName).validForNewPackages) {
    print.error(`${projectName} is not a safety name`)
    process.exit(1)
  }

  return {
    root,
    appName,
  }
}

function create_project(name, root) {
  print.info("Creating your awesome project...")
  fse.ensureDirSync(name)
  const packageJson = {
    name,
    version: '0.1.0',
    private: true,
    scripts: {
      start: "webpack serve --config webpack.dev.config.ts",
      build: "webpack --config webpack.prod.config.ts"
    }
  }
  fse.writeFileSync(
    path.join(root, 'package.json'),
    JSON.stringify(packageJson, null, 2) + os.EOL
  )
  process.chdir(root)
  copy_static_file(name, root)
  update_index_html_file_title(name, root)
  execSync('git init')
  print.info("Done.")
}

function copy_static_file(name, root) {
  fse.copySync(path.resolve(__dirname, 'static'), root)
}

function update_index_html_file_title(name, root) {
  const file = path.resolve(root, 'public/index.html')
  const newFile = fs.readFileSync(file, 'utf-8')
    .replace('${title}', name)
  fs.writeFileSync(file, newFile, 'utf-8')
}

function install_dependencies() {
  const { pro, dev } = dep
  print.info("Installing dependencies...")
  execSync("yarn add " + pro.join(' '))
  execSync("yarn add -D " + dev.join(' '))
  print.info("Done.")
}

function boostrap() {
  const {appName, root} = get_args()
  create_project(appName, root)
  install_dependencies()
  print.success("All Done!")
  print.info("Now run: ")
  print.info(`\tcd ${appName} && yarn start`)
  print.info("to start your wonderful journey.")
}

module.exports = boostrap
