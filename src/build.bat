@ECHO OFF 
TITLE THAI NGUYEN SMARTTREES PRODUCT BUILDER AND AUTO DEPLOY

ECHO THAI NGUYEN SMARTTREES PRODUCT BUILDER AND AUTO DEPLOY
ECHO Author: VNPT THAI NGUYEN

:: GUIDE
:: This script file only working on Window OS.
:: 0. Structure folder when use this script file: 
:: Root folder
::    |_SVN folder <- batch file at here
::    |_source folder <- deploy folder here
:: 1. If the application deploy on Window OS use Window service. Please place service name is "smarttree-api-service"
:: 2. For the first time deploy, please call command: "npm install" to setup dependencies. We won't call this command everytime to improve performance.
:: Section 0: This batch file to build SmartTrees API (NodeJs) project.
ECHO ============================
ECHO Check Environment
ECHO ============================

ECHO Checking SVN command line
where svn --version >nul 2>&1 && echo SVN Command line installed || echo SVN Command line not installed. Please install it to we can update the latest source code.

ECHO Checking NodeJS Environment.

where node --version >nul 2>&1 && echo NodeJS installed || echo NodeJS not installed. Please install it first.
where npm --version >nul 2>&1 && echo NPM installed || echo NPM not installed. Please install it.

ECHO Please wait... Checking the Obfuscator tool
:: Section 1: Check obfuscator tool already install or not?
where javascript-obfuscator --version >nul 2>&1 && echo Obfuscator installed || CALL npm i -g javascript-obfuscator

ECHO ============================
ECHO Updating Source Code
ECHO ============================

CALL svn update

ECHO ============================
ECHO Builing Source Code
ECHO ============================

if not exist ".\dist" MkDir ".\dist"
:: Create structure folder project.
if not exist ".\dist\config" MkDir ".\dist\config"
if not exist ".\dist\constants" MkDir ".\dist\constants"
if not exist ".\dist\controllers" MkDir ".\dist\controllers"
if not exist ".\dist\middleware" MkDir ".\dist\middleware"
if not exist ".\dist\models" MkDir ".\dist\models"
if not exist ".\dist\networks" MkDir ".\dist\networks"
if not exist ".\dist\public" MkDir ".\dist\public"
if not exist ".\dist\public\images" MkDir ".\dist\public\images"
if not exist ".\dist\routes" MkDir ".\dist\routes"
if not exist ".\dist\services" MkDir ".\dist\services"
if not exist ".\dist\services\export" MkDir ".\dist\services\export"
if not exist ".\dist\services\export\template" MkDir ".\dist\services\export\template"
if not exist ".\dist\utils" MkDir ".\dist\utils"

copy /Y *.* .\dist
copy /Y services\export\template\tree-report-template.xlsx .\dist\services\export\template\

:: Encrypt source code (only js files)

CALL javascript-obfuscator app.js --output ./dist
CALL javascript-obfuscator checkConnection.js --output ./dist
CALL javascript-obfuscator server.js --output ./dist

CALL javascript-obfuscator ./config --output ./dist/config
CALL javascript-obfuscator ./constants --output ./dist/constants
CALL javascript-obfuscator ./controllers --output ./dist/controllers
CALL javascript-obfuscator ./middleware --output ./dist/middleware
CALL javascript-obfuscator ./models --output ./dist/models
CALL javascript-obfuscator ./networks --output ./dist/networks
CALL javascript-obfuscator ./routes --output ./dist/routes
CALL javascript-obfuscator ./services --output ./dist/services
CALL javascript-obfuscator ./utils --output ./dist/utils

ECHO ============================
ECHO Build completed!
ECHO The dist directory is ready to be deployed.
ECHO ============================

:: Section 2: Deploy system

ECHO ============================
ECHO Deploying...
ECHO ============================

:: Copy the .dist folder to deploy folder
copy /Y dist\app.js .\..\source
copy /Y dist\server.js .\..\source
copy /Y dist\package.json .\..\source


xcopy /y /e dist\config .\..\source\config\
xcopy /y /e dist\constants .\..\source\constants\
xcopy /y /e dist\controllers .\..\source\controllers\
xcopy /y /e dist\middleware .\..\source\middleware\
xcopy /y /e dist\models .\..\source\models\
xcopy /y /e dist\networks .\..\source\networks\
xcopy /y /e dist\routes .\..\source\routes\
xcopy /y /e dist\services .\..\source\services\
xcopy /y /e dist\utils .\..\source\utils\
if not exist ".\..\source\public" MkDir ".\..\source\public"
if not exist ".\..\source\public\images" MkDir ".\..\source\public\images"
if not exist ".\..\source\config.env" copy dist\config.env .\..\source\

:: Restart service: smarttree-api-service
net stop "smarttree-api-service" && net start "smarttree-api-service"

ECHO ============================
ECHO DEPLOY completed!
ECHO Please enjoy!
ECHO ============================

PAUSE
