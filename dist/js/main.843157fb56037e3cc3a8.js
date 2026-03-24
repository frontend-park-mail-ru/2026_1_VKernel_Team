/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/css-loader/dist/cjs.js!./public/css/auth.css"
/*!*******************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./public/css/auth.css ***!
  \*******************************************************************/
(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../node_modules/css-loader/dist/runtime/sourceMaps.js */ "./node_modules/css-loader/dist/runtime/sourceMaps.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../node_modules/css-loader/dist/runtime/api.js */ "./node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, `/* ========== СТРАНИЦЫ АВТОРИЗАЦИИ ========== */
body.auth-page {
    background: linear-gradient(180deg, #2bde8c, #2bc0de);
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
}

body.auth-page #app {
    max-width: 500px;
    width: 100%;
}

/* ========== КОНТЕЙНЕРЫ ========== */
.auth-container,
.profile-container {
    background: rgba(255, 255, 255, 0.9);
    backdrop-filter: blur(10px);
    border-radius: 20px;
    box-shadow: 0 20px 60px rgba(0,0,0,0.3);
    padding: 40px;
    animation: slideUp 0.5s ease;
}

/* ========== ПОДВАЛ ФОРМ ========== */
.auth-footer {
    margin-top: 30px;
    text-align: center;
    color: #666;
    font-size: 15px;
    padding-top: 20px;
    border-top: none;
    position: relative;
}

.auth-footer::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 1px;
    background: linear-gradient(90deg, #2bde8c, #2bc0de, #2bde8c);
}

.auth-footer a {
    color: #2bc0de;
    text-decoration: none;
    font-weight: 600;
    margin-left: 5px;
}

.auth-footer a:hover {
    text-decoration: underline;
}

/* ========== ПРОФИЛЬ ========== */
.profile-card {
    margin-top: 30px;
}

.profile-info {
    background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
    padding: 30px;
    border-radius: 16px;
    margin-bottom: 30px;
}

.profile-info p {
    margin: 15px 0;
    color: #555;
    font-size: 16px;
    line-height: 1.6;
}

.profile-info strong {
    color: #333;
    font-weight: 600;
    min-width: 150px;
    display: inline-block;
}

.profile-actions {
    text-align: center;
}`, "",{"version":3,"sources":["webpack://./public/css/auth.css"],"names":[],"mappings":"AAAA,+CAA+C;AAC/C;IACI,qDAAqD;IACrD,iBAAiB;IACjB,aAAa;IACb,mBAAmB;IACnB,uBAAuB;IACvB,aAAa;AACjB;;AAEA;IACI,gBAAgB;IAChB,WAAW;AACf;;AAEA,qCAAqC;AACrC;;IAEI,oCAAoC;IACpC,2BAA2B;IAC3B,mBAAmB;IACnB,uCAAuC;IACvC,aAAa;IACb,4BAA4B;AAChC;;AAEA,sCAAsC;AACtC;IACI,gBAAgB;IAChB,kBAAkB;IAClB,WAAW;IACX,eAAe;IACf,iBAAiB;IACjB,gBAAgB;IAChB,kBAAkB;AACtB;;AAEA;IACI,WAAW;IACX,kBAAkB;IAClB,MAAM;IACN,OAAO;IACP,WAAW;IACX,WAAW;IACX,6DAA6D;AACjE;;AAEA;IACI,cAAc;IACd,qBAAqB;IACrB,gBAAgB;IAChB,gBAAgB;AACpB;;AAEA;IACI,0BAA0B;AAC9B;;AAEA,kCAAkC;AAClC;IACI,gBAAgB;AACpB;;AAEA;IACI,6DAA6D;IAC7D,aAAa;IACb,mBAAmB;IACnB,mBAAmB;AACvB;;AAEA;IACI,cAAc;IACd,WAAW;IACX,eAAe;IACf,gBAAgB;AACpB;;AAEA;IACI,WAAW;IACX,gBAAgB;IAChB,gBAAgB;IAChB,qBAAqB;AACzB;;AAEA;IACI,kBAAkB;AACtB","sourcesContent":["/* ========== СТРАНИЦЫ АВТОРИЗАЦИИ ========== */\r\nbody.auth-page {\r\n    background: linear-gradient(180deg, #2bde8c, #2bc0de);\r\n    min-height: 100vh;\r\n    display: flex;\r\n    align-items: center;\r\n    justify-content: center;\r\n    padding: 20px;\r\n}\r\n\r\nbody.auth-page #app {\r\n    max-width: 500px;\r\n    width: 100%;\r\n}\r\n\r\n/* ========== КОНТЕЙНЕРЫ ========== */\r\n.auth-container,\r\n.profile-container {\r\n    background: rgba(255, 255, 255, 0.9);\r\n    backdrop-filter: blur(10px);\r\n    border-radius: 20px;\r\n    box-shadow: 0 20px 60px rgba(0,0,0,0.3);\r\n    padding: 40px;\r\n    animation: slideUp 0.5s ease;\r\n}\r\n\r\n/* ========== ПОДВАЛ ФОРМ ========== */\r\n.auth-footer {\r\n    margin-top: 30px;\r\n    text-align: center;\r\n    color: #666;\r\n    font-size: 15px;\r\n    padding-top: 20px;\r\n    border-top: none;\r\n    position: relative;\r\n}\r\n\r\n.auth-footer::before {\r\n    content: '';\r\n    position: absolute;\r\n    top: 0;\r\n    left: 0;\r\n    width: 100%;\r\n    height: 1px;\r\n    background: linear-gradient(90deg, #2bde8c, #2bc0de, #2bde8c);\r\n}\r\n\r\n.auth-footer a {\r\n    color: #2bc0de;\r\n    text-decoration: none;\r\n    font-weight: 600;\r\n    margin-left: 5px;\r\n}\r\n\r\n.auth-footer a:hover {\r\n    text-decoration: underline;\r\n}\r\n\r\n/* ========== ПРОФИЛЬ ========== */\r\n.profile-card {\r\n    margin-top: 30px;\r\n}\r\n\r\n.profile-info {\r\n    background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);\r\n    padding: 30px;\r\n    border-radius: 16px;\r\n    margin-bottom: 30px;\r\n}\r\n\r\n.profile-info p {\r\n    margin: 15px 0;\r\n    color: #555;\r\n    font-size: 16px;\r\n    line-height: 1.6;\r\n}\r\n\r\n.profile-info strong {\r\n    color: #333;\r\n    font-weight: 600;\r\n    min-width: 150px;\r\n    display: inline-block;\r\n}\r\n\r\n.profile-actions {\r\n    text-align: center;\r\n}"],"sourceRoot":""}]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ },

/***/ "./node_modules/css-loader/dist/cjs.js!./public/css/base.css"
/*!*******************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./public/css/base.css ***!
  \*******************************************************************/
(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../node_modules/css-loader/dist/runtime/sourceMaps.js */ "./node_modules/css-loader/dist/runtime/sourceMaps.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../node_modules/css-loader/dist/runtime/api.js */ "./node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, `
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    letter-spacing: 0.05em;
}

body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
    min-height: 100vh;
    background: #f5f5f5;
    margin: 0;
    padding: 0;
}

#app {
    width: 100%;
    margin: 0 auto;
}


h1 {
    color: #333;
    font-size: 2.5em;
    margin-bottom: 10px;
    text-align: center;
    font-weight: 700;
}

h2 {
    color: #555;
    font-size: 1.8em;
    margin-bottom: 30px;
    text-align: center;
    font-weight: 600;
}

.icon {
    width: 20px;
    height: 20px;
    margin-right: 8px;
    vertical-align: middle;
}

.loading {
    position: relative;
    pointer-events: none;
    opacity: 0.7;
}

.loading::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 20px;
    height: 20px;
    margin: -10px 0 0 -10px;
    border: 3px solid rgba(255,255,255,0.3);
    border-top-color: white;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
}

@keyframes spin {
    to { transform: rotate(360deg); }
}

@keyframes slideUp {
    from {
        opacity: 0;
        transform: translateY(20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(-10px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

@keyframes fadeInError {
    from {
        opacity: 0;
        transform: translateY(-5px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

`, "",{"version":3,"sources":["webpack://./public/css/base.css"],"names":[],"mappings":";AACA;IACI,SAAS;IACT,UAAU;IACV,sBAAsB;IACtB,sBAAsB;AAC1B;;AAEA;IACI,yGAAyG;IACzG,iBAAiB;IACjB,mBAAmB;IACnB,SAAS;IACT,UAAU;AACd;;AAEA;IACI,WAAW;IACX,cAAc;AAClB;;;AAGA;IACI,WAAW;IACX,gBAAgB;IAChB,mBAAmB;IACnB,kBAAkB;IAClB,gBAAgB;AACpB;;AAEA;IACI,WAAW;IACX,gBAAgB;IAChB,mBAAmB;IACnB,kBAAkB;IAClB,gBAAgB;AACpB;;AAEA;IACI,WAAW;IACX,YAAY;IACZ,iBAAiB;IACjB,sBAAsB;AAC1B;;AAEA;IACI,kBAAkB;IAClB,oBAAoB;IACpB,YAAY;AAChB;;AAEA;IACI,WAAW;IACX,kBAAkB;IAClB,QAAQ;IACR,SAAS;IACT,WAAW;IACX,YAAY;IACZ,uBAAuB;IACvB,uCAAuC;IACvC,uBAAuB;IACvB,kBAAkB;IAClB,oCAAoC;AACxC;;AAEA;IACI,KAAK,yBAAyB,EAAE;AACpC;;AAEA;IACI;QACI,UAAU;QACV,2BAA2B;IAC/B;IACA;QACI,UAAU;QACV,wBAAwB;IAC5B;AACJ;;AAEA;IACI;QACI,UAAU;QACV,4BAA4B;IAChC;IACA;QACI,UAAU;QACV,wBAAwB;IAC5B;AACJ;;AAEA;IACI;QACI,UAAU;QACV,2BAA2B;IAC/B;IACA;QACI,UAAU;QACV,wBAAwB;IAC5B;AACJ","sourcesContent":["\r\n* {\r\n    margin: 0;\r\n    padding: 0;\r\n    box-sizing: border-box;\r\n    letter-spacing: 0.05em;\r\n}\r\n\r\nbody {\r\n    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;\r\n    min-height: 100vh;\r\n    background: #f5f5f5;\r\n    margin: 0;\r\n    padding: 0;\r\n}\r\n\r\n#app {\r\n    width: 100%;\r\n    margin: 0 auto;\r\n}\r\n\r\n\r\nh1 {\r\n    color: #333;\r\n    font-size: 2.5em;\r\n    margin-bottom: 10px;\r\n    text-align: center;\r\n    font-weight: 700;\r\n}\r\n\r\nh2 {\r\n    color: #555;\r\n    font-size: 1.8em;\r\n    margin-bottom: 30px;\r\n    text-align: center;\r\n    font-weight: 600;\r\n}\r\n\r\n.icon {\r\n    width: 20px;\r\n    height: 20px;\r\n    margin-right: 8px;\r\n    vertical-align: middle;\r\n}\r\n\r\n.loading {\r\n    position: relative;\r\n    pointer-events: none;\r\n    opacity: 0.7;\r\n}\r\n\r\n.loading::after {\r\n    content: '';\r\n    position: absolute;\r\n    top: 50%;\r\n    left: 50%;\r\n    width: 20px;\r\n    height: 20px;\r\n    margin: -10px 0 0 -10px;\r\n    border: 3px solid rgba(255,255,255,0.3);\r\n    border-top-color: white;\r\n    border-radius: 50%;\r\n    animation: spin 0.8s linear infinite;\r\n}\r\n\r\n@keyframes spin {\r\n    to { transform: rotate(360deg); }\r\n}\r\n\r\n@keyframes slideUp {\r\n    from {\r\n        opacity: 0;\r\n        transform: translateY(20px);\r\n    }\r\n    to {\r\n        opacity: 1;\r\n        transform: translateY(0);\r\n    }\r\n}\r\n\r\n@keyframes fadeIn {\r\n    from {\r\n        opacity: 0;\r\n        transform: translateY(-10px);\r\n    }\r\n    to {\r\n        opacity: 1;\r\n        transform: translateY(0);\r\n    }\r\n}\r\n\r\n@keyframes fadeInError {\r\n    from {\r\n        opacity: 0;\r\n        transform: translateY(-5px);\r\n    }\r\n    to {\r\n        opacity: 1;\r\n        transform: translateY(0);\r\n    }\r\n}\r\n\r\n"],"sourceRoot":""}]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ },

/***/ "./node_modules/css-loader/dist/cjs.js!./public/css/components.css"
/*!*************************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./public/css/components.css ***!
  \*************************************************************************/
(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../node_modules/css-loader/dist/runtime/sourceMaps.js */ "./node_modules/css-loader/dist/runtime/sourceMaps.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../node_modules/css-loader/dist/runtime/api.js */ "./node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, `/* ========== КНОПКИ ========== */
.btn {
    display: inline-block;
    padding: 15px 30px;
    border: none;
    border-radius: 12px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    text-decoration: none;
    text-align: center;
    transition: all 0.3s;
    letter-spacing: 0.5px;
}

.btn-primary {
    background: linear-gradient(135deg, #2bde8c, #2bc0de);
    color: white;
    border: none;
}

.btn-primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 15px rgba(0, 0, 0, 0.15);
    background: linear-gradient(135deg, #24b875, #1a8ca3);
}

.btn-secondary {
    background: linear-gradient(135deg, #f5f5f5 0%, #e0e0e0 100%);
    color: #666;
    box-shadow: 0 10px 20px rgba(0,0,0,0.1);
}

.btn-secondary:hover {
    transform: translateY(-2px);
    box-shadow: 0 15px 30px rgba(0,0,0,0.15);
    background: linear-gradient(135deg, #f5f5f5 0%, #e0e0e0 0%);
}

.btn-danger {
    background: linear-gradient(135deg, #ff6b6b 0%, #ee5253 100%);
    color: white;
    box-shadow: 0 10px 20px rgba(255, 107, 107, 0.3);
}

.btn-danger:hover {
    transform: translateY(-2px);
    box-shadow: 0 15px 30px rgba(255, 107, 107, 0.4);
}

.btn-block {
    display: block;
    width: 100%;
}

/* ========== КНОПКА ВЫХОДА/ВХОДА ========== */
.logout-btn {
    padding: 8px 16px;
    font-size: 14px;
    margin-left: 10px;
    border-radius: 6px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s;
}

.btn-secondary.logout-btn {
    background: #6c757d;
    color: white;
    border: none;
}

.btn-secondary.logout-btn:hover {
    background: #5a6268;
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}

.btn-danger.logout-btn {
    background: #f27683;
    color: white;
    border: none;
}

.btn-danger.logout-btn:hover {
    background: #c82333;
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}

/* ========== ФОРМЫ ========== */
.auth-form {
    margin-top: 20px;
}

.form-group {
    margin-bottom: 25px;
}

label {
    display: block;
    margin-bottom: 8px;
    color: #555;
    font-weight: 500;
    font-size: 14px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

input {
    width: 100%;
    padding: 15px 20px;
    border: 2px solid #e0e0e0;
    border-radius: 12px;
    font-size: 16px;
    transition: all 0.3s;
    background: #fafafa;
}

input:focus {
    outline: none;
    border-color: #667eea;
    background: white;
    box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.1);
}

input::placeholder {
    color: #aaa;
    font-size: 14px;
}

/* ========== ОШИБКИ ПОЛЕЙ ========== */
input.error {
    border-color: #ff6b6b !important;
    background: #fff5f5 !important;
}

.field-error {
    color: #ee5253;
    font-size: 13px;
    margin-top: 5px;
    margin-left: 5px;
    font-weight: 500;
    animation: fadeInError 0.2s ease;
}

.login-error {
    color: #ee5253;
    font-size: 14px;
    margin-bottom: 15px;
    font-weight: 500;
    animation: fadeIn 0.3s ease;
}

/* ========== АЛЕРТЫ ========== */
.alert {
    padding: 15px 20px;
    border-radius: 12px;
    margin-top: 20px;
    font-size: 14px;
    font-weight: 500;
    animation: fadeIn 0.3s ease;
    text-align: center;
}

.alert-error {
    background: #fff5f5;
    color: #ee5253;
    border: 2px solid #ff6b6b;
}

.alert-success {
    background: #f0fff4;
    color: #2ecc71;
    border: 2px solid #2ecc71;
}

/* ========== ССЫЛКИ ========== */
.auth-links {
    display: flex;
    gap: 20px;
    justify-content: center;
    margin-top: 30px;
}

.nav-link {
    color: #666;
    text-decoration: none;
    font-size: 16px;
    font-weight: 500;
    padding: 8px 16px;
    border-radius: 30px;
    transition: all 0.3s;
}

.nav-link:hover {
    color: #667eea;
    background: #f5f5f5;
}

.nav-link.active {
    color: white;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}


/* Заголовок формы с кнопкой назад */
.auth-header {
    position: relative;
    margin-bottom: 30px;
    display: flex;
    justify-content: center;
    align-items: center;
}

.auth-header h2 {
    margin: 0;
    text-align: center;
    font-size: 1.8em;
    color: #333;
}

.auth-header .back-link {
    position: absolute;
    left: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #667eea;
    text-decoration: none;
    font-size: 24px;
    font-weight: 500;
    transition: all 0.3s;
}

.auth-header .back-link:hover {
    color: #5a67d8;
    transform: translateX(-3px);
}

/* ========== ПОЛЕ ПАРОЛЯ С ГЛАЗИКОМ ========== */
/* Контейнер для выравнивания */
.password-wrapper {
    position: relative;
    width: 100%;
}

/* Ваши стили с одним изменением: padding-right */
.password-wrapper input {
    width: 100%;
    padding: 15px 50px 15px 20px; /* 50px справа, чтобы текст не заходил под глаз */
    border: 2px solid #e0e0e0;
    border-radius: 12px;
    font-size: 16px;
    transition: all 0.3s;
    background: #fafafa;
    box-sizing: border-box; /* Важно: чтобы padding не раздувал ширину */
}

/* Ваши стили для фокуса */
.password-wrapper input:focus {
    outline: none;
    border-color: #667eea;
    background: white;
    box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.1);
}

/* Стили для кнопки с картинкой */
.eye-btn {
    position: absolute;
    right: 15px; /* Отступ от правого края */
    top: 50%;
    transform: translateY(-50%);
    background: none;
    border: none;
    padding: 0;
    cursor: pointer;
    display: flex;
    align-items: center;
    opacity: 0.5;
    transition: opacity 0.3s;
}

.eye-btn:hover {
    opacity: 1;
}

.eye-btn img {
    width: 22px; /* Размер иконки под ваш шрифт 16px */
    height: auto;
    display: block;
}

/* Если у инпута рядом есть класс .error, делаем иконку краснее */
input.error + .eye-btn img {
    filter: sepia(1) saturate(5) hue-rotate(-50deg); 
    opacity: 0.8;
}
`, "",{"version":3,"sources":["webpack://./public/css/components.css"],"names":[],"mappings":"AAAA,iCAAiC;AACjC;IACI,qBAAqB;IACrB,kBAAkB;IAClB,YAAY;IACZ,mBAAmB;IACnB,eAAe;IACf,gBAAgB;IAChB,eAAe;IACf,qBAAqB;IACrB,kBAAkB;IAClB,oBAAoB;IACpB,qBAAqB;AACzB;;AAEA;IACI,qDAAqD;IACrD,YAAY;IACZ,YAAY;AAChB;;AAEA;IACI,2BAA2B;IAC3B,0CAA0C;IAC1C,qDAAqD;AACzD;;AAEA;IACI,6DAA6D;IAC7D,WAAW;IACX,uCAAuC;AAC3C;;AAEA;IACI,2BAA2B;IAC3B,wCAAwC;IACxC,2DAA2D;AAC/D;;AAEA;IACI,6DAA6D;IAC7D,YAAY;IACZ,gDAAgD;AACpD;;AAEA;IACI,2BAA2B;IAC3B,gDAAgD;AACpD;;AAEA;IACI,cAAc;IACd,WAAW;AACf;;AAEA,8CAA8C;AAC9C;IACI,iBAAiB;IACjB,eAAe;IACf,iBAAiB;IACjB,kBAAkB;IAClB,gBAAgB;IAChB,eAAe;IACf,oBAAoB;AACxB;;AAEA;IACI,mBAAmB;IACnB,YAAY;IACZ,YAAY;AAChB;;AAEA;IACI,mBAAmB;IACnB,2BAA2B;IAC3B,qCAAqC;AACzC;;AAEA;IACI,mBAAmB;IACnB,YAAY;IACZ,YAAY;AAChB;;AAEA;IACI,mBAAmB;IACnB,2BAA2B;IAC3B,qCAAqC;AACzC;;AAEA,gCAAgC;AAChC;IACI,gBAAgB;AACpB;;AAEA;IACI,mBAAmB;AACvB;;AAEA;IACI,cAAc;IACd,kBAAkB;IAClB,WAAW;IACX,gBAAgB;IAChB,eAAe;IACf,yBAAyB;IACzB,qBAAqB;AACzB;;AAEA;IACI,WAAW;IACX,kBAAkB;IAClB,yBAAyB;IACzB,mBAAmB;IACnB,eAAe;IACf,oBAAoB;IACpB,mBAAmB;AACvB;;AAEA;IACI,aAAa;IACb,qBAAqB;IACrB,iBAAiB;IACjB,8CAA8C;AAClD;;AAEA;IACI,WAAW;IACX,eAAe;AACnB;;AAEA,uCAAuC;AACvC;IACI,gCAAgC;IAChC,8BAA8B;AAClC;;AAEA;IACI,cAAc;IACd,eAAe;IACf,eAAe;IACf,gBAAgB;IAChB,gBAAgB;IAChB,gCAAgC;AACpC;;AAEA;IACI,cAAc;IACd,eAAe;IACf,mBAAmB;IACnB,gBAAgB;IAChB,2BAA2B;AAC/B;;AAEA,iCAAiC;AACjC;IACI,kBAAkB;IAClB,mBAAmB;IACnB,gBAAgB;IAChB,eAAe;IACf,gBAAgB;IAChB,2BAA2B;IAC3B,kBAAkB;AACtB;;AAEA;IACI,mBAAmB;IACnB,cAAc;IACd,yBAAyB;AAC7B;;AAEA;IACI,mBAAmB;IACnB,cAAc;IACd,yBAAyB;AAC7B;;AAEA,iCAAiC;AACjC;IACI,aAAa;IACb,SAAS;IACT,uBAAuB;IACvB,gBAAgB;AACpB;;AAEA;IACI,WAAW;IACX,qBAAqB;IACrB,eAAe;IACf,gBAAgB;IAChB,iBAAiB;IACjB,mBAAmB;IACnB,oBAAoB;AACxB;;AAEA;IACI,cAAc;IACd,mBAAmB;AACvB;;AAEA;IACI,YAAY;IACZ,6DAA6D;AACjE;;;AAGA,oCAAoC;AACpC;IACI,kBAAkB;IAClB,mBAAmB;IACnB,aAAa;IACb,uBAAuB;IACvB,mBAAmB;AACvB;;AAEA;IACI,SAAS;IACT,kBAAkB;IAClB,gBAAgB;IAChB,WAAW;AACf;;AAEA;IACI,kBAAkB;IAClB,OAAO;IACP,aAAa;IACb,mBAAmB;IACnB,uBAAuB;IACvB,cAAc;IACd,qBAAqB;IACrB,eAAe;IACf,gBAAgB;IAChB,oBAAoB;AACxB;;AAEA;IACI,cAAc;IACd,2BAA2B;AAC/B;;AAEA,iDAAiD;AACjD,+BAA+B;AAC/B;IACI,kBAAkB;IAClB,WAAW;AACf;;AAEA,iDAAiD;AACjD;IACI,WAAW;IACX,4BAA4B,EAAE,iDAAiD;IAC/E,yBAAyB;IACzB,mBAAmB;IACnB,eAAe;IACf,oBAAoB;IACpB,mBAAmB;IACnB,sBAAsB,EAAE,4CAA4C;AACxE;;AAEA,0BAA0B;AAC1B;IACI,aAAa;IACb,qBAAqB;IACrB,iBAAiB;IACjB,8CAA8C;AAClD;;AAEA,iCAAiC;AACjC;IACI,kBAAkB;IAClB,WAAW,EAAE,2BAA2B;IACxC,QAAQ;IACR,2BAA2B;IAC3B,gBAAgB;IAChB,YAAY;IACZ,UAAU;IACV,eAAe;IACf,aAAa;IACb,mBAAmB;IACnB,YAAY;IACZ,wBAAwB;AAC5B;;AAEA;IACI,UAAU;AACd;;AAEA;IACI,WAAW,EAAE,qCAAqC;IAClD,YAAY;IACZ,cAAc;AAClB;;AAEA,iEAAiE;AACjE;IACI,+CAA+C;IAC/C,YAAY;AAChB","sourcesContent":["/* ========== КНОПКИ ========== */\r\n.btn {\r\n    display: inline-block;\r\n    padding: 15px 30px;\r\n    border: none;\r\n    border-radius: 12px;\r\n    font-size: 16px;\r\n    font-weight: 600;\r\n    cursor: pointer;\r\n    text-decoration: none;\r\n    text-align: center;\r\n    transition: all 0.3s;\r\n    letter-spacing: 0.5px;\r\n}\r\n\r\n.btn-primary {\r\n    background: linear-gradient(135deg, #2bde8c, #2bc0de);\r\n    color: white;\r\n    border: none;\r\n}\r\n\r\n.btn-primary:hover {\r\n    transform: translateY(-2px);\r\n    box-shadow: 0 8px 15px rgba(0, 0, 0, 0.15);\r\n    background: linear-gradient(135deg, #24b875, #1a8ca3);\r\n}\r\n\r\n.btn-secondary {\r\n    background: linear-gradient(135deg, #f5f5f5 0%, #e0e0e0 100%);\r\n    color: #666;\r\n    box-shadow: 0 10px 20px rgba(0,0,0,0.1);\r\n}\r\n\r\n.btn-secondary:hover {\r\n    transform: translateY(-2px);\r\n    box-shadow: 0 15px 30px rgba(0,0,0,0.15);\r\n    background: linear-gradient(135deg, #f5f5f5 0%, #e0e0e0 0%);\r\n}\r\n\r\n.btn-danger {\r\n    background: linear-gradient(135deg, #ff6b6b 0%, #ee5253 100%);\r\n    color: white;\r\n    box-shadow: 0 10px 20px rgba(255, 107, 107, 0.3);\r\n}\r\n\r\n.btn-danger:hover {\r\n    transform: translateY(-2px);\r\n    box-shadow: 0 15px 30px rgba(255, 107, 107, 0.4);\r\n}\r\n\r\n.btn-block {\r\n    display: block;\r\n    width: 100%;\r\n}\r\n\r\n/* ========== КНОПКА ВЫХОДА/ВХОДА ========== */\r\n.logout-btn {\r\n    padding: 8px 16px;\r\n    font-size: 14px;\r\n    margin-left: 10px;\r\n    border-radius: 6px;\r\n    font-weight: 500;\r\n    cursor: pointer;\r\n    transition: all 0.3s;\r\n}\r\n\r\n.btn-secondary.logout-btn {\r\n    background: #6c757d;\r\n    color: white;\r\n    border: none;\r\n}\r\n\r\n.btn-secondary.logout-btn:hover {\r\n    background: #5a6268;\r\n    transform: translateY(-2px);\r\n    box-shadow: 0 4px 8px rgba(0,0,0,0.1);\r\n}\r\n\r\n.btn-danger.logout-btn {\r\n    background: #f27683;\r\n    color: white;\r\n    border: none;\r\n}\r\n\r\n.btn-danger.logout-btn:hover {\r\n    background: #c82333;\r\n    transform: translateY(-2px);\r\n    box-shadow: 0 4px 8px rgba(0,0,0,0.1);\r\n}\r\n\r\n/* ========== ФОРМЫ ========== */\r\n.auth-form {\r\n    margin-top: 20px;\r\n}\r\n\r\n.form-group {\r\n    margin-bottom: 25px;\r\n}\r\n\r\nlabel {\r\n    display: block;\r\n    margin-bottom: 8px;\r\n    color: #555;\r\n    font-weight: 500;\r\n    font-size: 14px;\r\n    text-transform: uppercase;\r\n    letter-spacing: 0.5px;\r\n}\r\n\r\ninput {\r\n    width: 100%;\r\n    padding: 15px 20px;\r\n    border: 2px solid #e0e0e0;\r\n    border-radius: 12px;\r\n    font-size: 16px;\r\n    transition: all 0.3s;\r\n    background: #fafafa;\r\n}\r\n\r\ninput:focus {\r\n    outline: none;\r\n    border-color: #667eea;\r\n    background: white;\r\n    box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.1);\r\n}\r\n\r\ninput::placeholder {\r\n    color: #aaa;\r\n    font-size: 14px;\r\n}\r\n\r\n/* ========== ОШИБКИ ПОЛЕЙ ========== */\r\ninput.error {\r\n    border-color: #ff6b6b !important;\r\n    background: #fff5f5 !important;\r\n}\r\n\r\n.field-error {\r\n    color: #ee5253;\r\n    font-size: 13px;\r\n    margin-top: 5px;\r\n    margin-left: 5px;\r\n    font-weight: 500;\r\n    animation: fadeInError 0.2s ease;\r\n}\r\n\r\n.login-error {\r\n    color: #ee5253;\r\n    font-size: 14px;\r\n    margin-bottom: 15px;\r\n    font-weight: 500;\r\n    animation: fadeIn 0.3s ease;\r\n}\r\n\r\n/* ========== АЛЕРТЫ ========== */\r\n.alert {\r\n    padding: 15px 20px;\r\n    border-radius: 12px;\r\n    margin-top: 20px;\r\n    font-size: 14px;\r\n    font-weight: 500;\r\n    animation: fadeIn 0.3s ease;\r\n    text-align: center;\r\n}\r\n\r\n.alert-error {\r\n    background: #fff5f5;\r\n    color: #ee5253;\r\n    border: 2px solid #ff6b6b;\r\n}\r\n\r\n.alert-success {\r\n    background: #f0fff4;\r\n    color: #2ecc71;\r\n    border: 2px solid #2ecc71;\r\n}\r\n\r\n/* ========== ССЫЛКИ ========== */\r\n.auth-links {\r\n    display: flex;\r\n    gap: 20px;\r\n    justify-content: center;\r\n    margin-top: 30px;\r\n}\r\n\r\n.nav-link {\r\n    color: #666;\r\n    text-decoration: none;\r\n    font-size: 16px;\r\n    font-weight: 500;\r\n    padding: 8px 16px;\r\n    border-radius: 30px;\r\n    transition: all 0.3s;\r\n}\r\n\r\n.nav-link:hover {\r\n    color: #667eea;\r\n    background: #f5f5f5;\r\n}\r\n\r\n.nav-link.active {\r\n    color: white;\r\n    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);\r\n}\r\n\r\n\r\n/* Заголовок формы с кнопкой назад */\r\n.auth-header {\r\n    position: relative;\r\n    margin-bottom: 30px;\r\n    display: flex;\r\n    justify-content: center;\r\n    align-items: center;\r\n}\r\n\r\n.auth-header h2 {\r\n    margin: 0;\r\n    text-align: center;\r\n    font-size: 1.8em;\r\n    color: #333;\r\n}\r\n\r\n.auth-header .back-link {\r\n    position: absolute;\r\n    left: 0;\r\n    display: flex;\r\n    align-items: center;\r\n    justify-content: center;\r\n    color: #667eea;\r\n    text-decoration: none;\r\n    font-size: 24px;\r\n    font-weight: 500;\r\n    transition: all 0.3s;\r\n}\r\n\r\n.auth-header .back-link:hover {\r\n    color: #5a67d8;\r\n    transform: translateX(-3px);\r\n}\r\n\r\n/* ========== ПОЛЕ ПАРОЛЯ С ГЛАЗИКОМ ========== */\r\n/* Контейнер для выравнивания */\r\n.password-wrapper {\r\n    position: relative;\r\n    width: 100%;\r\n}\r\n\r\n/* Ваши стили с одним изменением: padding-right */\r\n.password-wrapper input {\r\n    width: 100%;\r\n    padding: 15px 50px 15px 20px; /* 50px справа, чтобы текст не заходил под глаз */\r\n    border: 2px solid #e0e0e0;\r\n    border-radius: 12px;\r\n    font-size: 16px;\r\n    transition: all 0.3s;\r\n    background: #fafafa;\r\n    box-sizing: border-box; /* Важно: чтобы padding не раздувал ширину */\r\n}\r\n\r\n/* Ваши стили для фокуса */\r\n.password-wrapper input:focus {\r\n    outline: none;\r\n    border-color: #667eea;\r\n    background: white;\r\n    box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.1);\r\n}\r\n\r\n/* Стили для кнопки с картинкой */\r\n.eye-btn {\r\n    position: absolute;\r\n    right: 15px; /* Отступ от правого края */\r\n    top: 50%;\r\n    transform: translateY(-50%);\r\n    background: none;\r\n    border: none;\r\n    padding: 0;\r\n    cursor: pointer;\r\n    display: flex;\r\n    align-items: center;\r\n    opacity: 0.5;\r\n    transition: opacity 0.3s;\r\n}\r\n\r\n.eye-btn:hover {\r\n    opacity: 1;\r\n}\r\n\r\n.eye-btn img {\r\n    width: 22px; /* Размер иконки под ваш шрифт 16px */\r\n    height: auto;\r\n    display: block;\r\n}\r\n\r\n/* Если у инпута рядом есть класс .error, делаем иконку краснее */\r\ninput.error + .eye-btn img {\r\n    filter: sepia(1) saturate(5) hue-rotate(-50deg); \r\n    opacity: 0.8;\r\n}\r\n"],"sourceRoot":""}]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ },

/***/ "./node_modules/css-loader/dist/cjs.js!./public/css/main.css"
/*!*******************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./public/css/main.css ***!
  \*******************************************************************/
(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../node_modules/css-loader/dist/runtime/sourceMaps.js */ "./node_modules/css-loader/dist/runtime/sourceMaps.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../node_modules/css-loader/dist/runtime/api.js */ "./node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, `/* ========== ГЛАВНАЯ СТРАНИЦА ========== */
body .main-container {
    width: 100%;
    min-height: 100vh;
    background: #f5f5f5;
}

/* ========== ХЕДЕР ========== */
.header {
    width: 100%;
    height: 80px;
    background: #2bde8c;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 1000;
}

.header-content {
    max-width: 1350px;
    margin: 0 auto;
    padding: 10px 0;
    height: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.header-left {
    display: flex;
    gap: 5px;
    align-items: center;
}

.nav-icon {
    display: flex;
    align-items: center;
    margin-right: 10px;
}

.nav-icon .nav-link {
    color: rgb(0, 0, 0);
    text-decoration: none;
    font-weight: 500;
    padding: 5px 10px;
    display: flex;
    align-items: center;
    gap: 5px;
    border-radius: 4px;
    line-height: 1;
}

.nav-icon .nav-link:hover {
    background: rgba(255, 255, 255, 1.0);
    border-radius: 40px;
}

.nav-icon .nav-link:hover .nav-text {
    text-decoration: underline;
    text-decoration-skip-ink: none;
    text-underline-offset: 2px;
}

.nav-icon .icon {
    font-size: 20px;
    line-height: 1;
}

.header-right {
    display: flex;
    gap: 20px;
    align-items: center;
}

.place-ad-btn {
    background: #2bc0de;
    color: #ffffff;
    padding: 10px 20px;
    border-radius: 8px;
    font-weight: 600;
    border: none;
    cursor: pointer;
    transition: all 0.3s;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.place-ad-btn:hover {
    background: #24a9c7;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}

.avatar {
    width: 50px;
    height: 50px;
    border-radius: 50%;
}

.profile-icon {
    width: 40px;
    height: 40px;
    background: rgba(255, 255, 255, 0.2);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: background 0.3s;
    line-height: 1;
}

.profile-icon:hover {
    background: rgba(255, 255, 255, 0.3);
}

.profile-icon .icon {
    font-size: 24px;
    color: white;
    align-items: center;
    justify-content: center;
    line-height: 1;
    transform: translateY(-1px);
}

.nav-login {
    text-decoration: none;
}

.nav-login:hover {
    text-decoration: underline;
    text-decoration-color: white;
    text-decoration-skip-ink: none;
    text-underline-offset: 2px;
    color: white;
}

/* ========== ОСНОВНОЙ КОНТЕНТ ========== */
.main-content {
    max-width: 1400px;
    margin: 0 auto;
    padding: 100px 20px;
    margin-top: 80px;
}

.search-section {
    background: white;
    border-radius: 12px;
    padding: 20px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    margin-bottom: 5px;

    /* Фиксация */
    position: fixed;
    top: 80px;              /* сразу под хедером */
    left: 0;
    right: 0;
    z-index: 999;
    
    /*Чтобы поиск был на одной линии с контентом */
    max-width: 1400px;       /*как у main-content*/
    width: calc(100% - 80px);
    margin-left: auto;
    margin-right: auto;
}

.search-row {
    display: flex;
    align-items: center;
    gap: 20px;
    flex-wrap: wrap;
    width: 100%;
}

.brand {
    display: flex;
    align-items: center;
    min-width: 150px;
    height: 40px; /* Фиксируем высоту контейнера (как у инпута примерно) */
    position: relative; /* Чтобы логотип ориентировался на этот блок */
}

.logo {
    position: absolute; /* Логотип выходит из общего потока и не давит на соседа */
    top: 50%;
    left: -5px; /* Прижимаем к самому краю search-section, игнорируя padding */
    transform: translateY(-50%); /* Центрируем по вертикали */
    
    width: 160px;  /* Любой нужный размер */
    height: auto;
    z-index: 10;
}

.brand-name {
    font-size: 38px;
    font-weight: 700;
    color: #333;
    font-family: 'Caveat', cursive;
}

.search-wrapper {
    flex: 1;
    display: flex;
    gap: 10px;
    min-width: 300px;
}

.search-input {
    flex: 1;
    padding: 15px 20px;
    border: 2px solid #e0e0e0;
    border-radius: 8px;
    font-size: 16px;
    transition: all 0.3s;
}

.search-input:focus {
    outline: none;
    border-color: #2bde8c;
    box-shadow: 0 0 0 3px rgba(43, 222, 140, 0.1);
}

.search-btn {
    padding: 15px 30px;
    background: #2bde8c;
    color: white;
    border: none;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    white-space: nowrap;
}

.search-btn:hover {
    background: #24b875;
}

.geo {
    display: flex;
    align-items: center;
    gap: 5px;
    min-width: 100px;
    cursor: pointer;
    padding: 10px;
    border-radius: 8px;
    transition: background 0.3s;
}

.geo:hover {
    background: #f5f5f5;
}

.geo .icon {
    font-size: 20px;
}

.city {
    font-size: 16px;
    font-weight: 500;
    color: #333;
}

/* ========== СЕТКА КОНТЕНТА ========== */
.content-grid {
    display: grid;
    grid-template-columns: 9.5fr 2.5fr;
    gap: 20px;
    margin-top: 20px;
}

.main-column {
    background: white;
    border-radius: 12px;
    padding: 20px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.ad-column {
    background: #f8f9fa;
    border-radius: 12px;
    padding: 20px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    min-height: 400px;
    position: sticky;
    top: 110px;
    border: 2px dashed #2bde8c;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #666;
    font-weight: 500;
}

/* ========== КАРТОЧКИ КАТЕГОРИЙ ========== */
.cards-row {
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    gap: 20px;
}

.category-card {
    background: #E9FCF3;
    border-radius: 8px;
    padding: 0;
    height: 100px;
    transition: all 0.2s;
    cursor: pointer;
    border: 1px solid #e9ecef;
    position: relative;
}

.category-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0,0,0,0.1);
    background: #BFE4D5;
    border-color: #2bde8c;
}

.category-card img {
    position: absolute;
    bottom: 0;
    right: 0;
    width: 150px;
    height: auto;
    z-index: 1;
}

.card-title {
    font-size: 15px;
    font-weight: 500;
    color: #495057;
    text-align: left;
    position: absolute;
    top: 9px;
    left: 11px;
    margin: 0;
    padding: 0;
    z-index: 2;
}

/* ========== КАРТОЧКА ВСЕ КАТЕГОРИИ ========== */
.category-card.all-categories {
    background: #E9FCF3;
    border: 1px solid #ddd;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s;
}

.category-card.all-categories .card-title {
    display: flex;
    align-items: center;
    gap: 5px;
    color: #495057;
    font-size: 16px;
    font-weight: 500;
    position: static;
    line-height: 1.2;
}

.category-card.all-categories .card-title::after {
    content: '→';
    font-size: 25px;
    font-weight: 700;
    color: #495057;
    opacity: 0;
    transform: translateX(-5px);
    transition: opacity 0.2s, transform 0.2s;
}

.category-card.all-categories:hover {
    background: #BFE4D5;
    border-color: #2bde8c;
}

.category-card.all-categories:hover .card-title::after {
    opacity: 1;
    transform: translateX(0);
}

/* ========== РЕКОМЕНДАЦИИ ========== */
.recommendations-section {
    margin-top: 20px;
}

.recommendations-title {
    font-size: 24px;
    font-weight: 600;
    color: #333;
    text-align: left;
    margin-bottom: 10px;
}

.recommendations-row {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 10px;
}

.rec-card {
    background: white;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 4px 12px rgba(0,0,0,0.08);
    transition: transform 0.2s, box-shadow 0.2s;
    height: 300px;
    display: flex;
    flex-direction: column;
    border: 1px solid #e9ecef;
}

.rec-card:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 20px rgba(0,0,0,0.12);
}

.rec-card-image-container {
    position: relative;
    width: 100%;
    height: 60%;  /* как у .rec-card-image */
    overflow: hidden;
}

.rec-card-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    background: #f0f0f0;
}

.rec-card-content {
    height: 40%;
    padding: 10px 8px;
    display: flex;
    flex-direction: column;
    gap: 0px;
    flex: 1;
}

.rec-card-footer {
    display: grid;
    grid-template-columns: 150px 70px;  /* левая колонка тянется, правая под контент */
    gap: 10px;
    align-items: center;
    margin-top: auto;  /* прижимаем к низу */
}

.rec-card-footer-info {
    /* flex: 1;
    justify-content: space-between;
    margin-top: 5px;*/
    display: flex;
    flex-direction: column;
    gap: 4px;
    min-width: 0;
}

.rec-card-title {
    font-size: 14px;
    font-weight: 500;
    color: #333;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
    line-height: 1.3;
}

.rec-card-price {
    font-size: 16px;
    font-weight: 700;
    color: #000000;
}

.rec-card-location {
    font-size: 12px;
    color: #999;
    display: flex;
    align-items: center;
    gap: 2px;
}

.location-icon {
    font-size: 12px;
}

.rec-card-footer-actions {
    display: flex;
    flex-direction: column;
    flex-shrink: 0;
    justify-content: flex-end;
    align-items: flex-end;
}

/* Кнопка лайка в правом верхнем углу */
.rec-card-fav {
    position: absolute;
    top: 8px;
    right: 8px;
    background: rgba(255, 255, 255, 0.9);
    border: none;
    border-radius: 50%;
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 32px;
    cursor: pointer;
    box-shadow: 0 2px 8px rgba(0,0,0,0.15);
    transition: all 0.2s;
    z-index: 10;
    padding: 0;
    line-height: 1;
}

.rec-card-cart {
    background: none;
    border: none;
    font-size: 18px;
    cursor: pointer;
    padding: 4px;
    border-radius: 50%;
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s;
}

.rec-card-views {
    display: flex;
    align-items: center;
    gap: 2px;
}

.rec-card-views .num_views {
    font-size: 14px;
    color: #666;
    margin: 0;
}

.views {
    width: 30px;
    height: 30px;
    object-fit: cover;
}

.rec-card-actions .views {
    width: 14px;
    height: 14px;
    object-fit: cover;  /* чтобы фото не искажалось */
}

.rec-card-fav:hover {
    background: #fff0f0;
    transform: scale(1.1);
}

.rec-card-cart:hover {
    background: #e8f5e9;
    transform: scale(1.1);
}

/* ========== АДАПТИВНОСТЬ ========== */
@media (max-width: 1200px) {
    .header-content,
    .main-content {
        padding-left: 60px;
        padding-right: 60px;
    }
}

@media (max-width: 768px) {
    .header-content,
    .main-content {
        padding-left: 20px;
        padding-right: 20px;
    }
    
    .search-section {
        flex-direction: column;
        align-items: stretch;
    }
    
    .header-left {
        gap: 15px;
    }
    
    .nav-icon .nav-link {
        display: none;
    }
    
    .content-grid {
        grid-template-columns: 1fr;
    }
    
    .ad-column {
        display: none;
    }
}`, "",{"version":3,"sources":["webpack://./public/css/main.css"],"names":[],"mappings":"AAAA,2CAA2C;AAC3C;IACI,WAAW;IACX,iBAAiB;IACjB,mBAAmB;AACvB;;AAEA,gCAAgC;AAChC;IACI,WAAW;IACX,YAAY;IACZ,mBAAmB;IACnB,eAAe;IACf,MAAM;IACN,OAAO;IACP,QAAQ;IACR,aAAa;AACjB;;AAEA;IACI,iBAAiB;IACjB,cAAc;IACd,eAAe;IACf,YAAY;IACZ,aAAa;IACb,8BAA8B;IAC9B,mBAAmB;AACvB;;AAEA;IACI,aAAa;IACb,QAAQ;IACR,mBAAmB;AACvB;;AAEA;IACI,aAAa;IACb,mBAAmB;IACnB,kBAAkB;AACtB;;AAEA;IACI,mBAAmB;IACnB,qBAAqB;IACrB,gBAAgB;IAChB,iBAAiB;IACjB,aAAa;IACb,mBAAmB;IACnB,QAAQ;IACR,kBAAkB;IAClB,cAAc;AAClB;;AAEA;IACI,oCAAoC;IACpC,mBAAmB;AACvB;;AAEA;IACI,0BAA0B;IAC1B,8BAA8B;IAC9B,0BAA0B;AAC9B;;AAEA;IACI,eAAe;IACf,cAAc;AAClB;;AAEA;IACI,aAAa;IACb,SAAS;IACT,mBAAmB;AACvB;;AAEA;IACI,mBAAmB;IACnB,cAAc;IACd,kBAAkB;IAClB,kBAAkB;IAClB,gBAAgB;IAChB,YAAY;IACZ,eAAe;IACf,oBAAoB;IACpB,qCAAqC;AACzC;;AAEA;IACI,mBAAmB;IACnB,2BAA2B;IAC3B,uCAAuC;AAC3C;;AAEA;IACI,WAAW;IACX,YAAY;IACZ,kBAAkB;AACtB;;AAEA;IACI,WAAW;IACX,YAAY;IACZ,oCAAoC;IACpC,kBAAkB;IAClB,aAAa;IACb,mBAAmB;IACnB,uBAAuB;IACvB,eAAe;IACf,2BAA2B;IAC3B,cAAc;AAClB;;AAEA;IACI,oCAAoC;AACxC;;AAEA;IACI,eAAe;IACf,YAAY;IACZ,mBAAmB;IACnB,uBAAuB;IACvB,cAAc;IACd,2BAA2B;AAC/B;;AAEA;IACI,qBAAqB;AACzB;;AAEA;IACI,0BAA0B;IAC1B,4BAA4B;IAC5B,8BAA8B;IAC9B,0BAA0B;IAC1B,YAAY;AAChB;;AAEA,2CAA2C;AAC3C;IACI,iBAAiB;IACjB,cAAc;IACd,mBAAmB;IACnB,gBAAgB;AACpB;;AAEA;IACI,iBAAiB;IACjB,mBAAmB;IACnB,aAAa;IACb,sCAAsC;IACtC,kBAAkB;;IAElB,aAAa;IACb,eAAe;IACf,SAAS,eAAe,sBAAsB;IAC9C,OAAO;IACP,QAAQ;IACR,YAAY;;IAEZ,8CAA8C;IAC9C,iBAAiB,QAAQ,qBAAqB;IAC9C,wBAAwB;IACxB,iBAAiB;IACjB,kBAAkB;AACtB;;AAEA;IACI,aAAa;IACb,mBAAmB;IACnB,SAAS;IACT,eAAe;IACf,WAAW;AACf;;AAEA;IACI,aAAa;IACb,mBAAmB;IACnB,gBAAgB;IAChB,YAAY,EAAE,wDAAwD;IACtE,kBAAkB,EAAE,8CAA8C;AACtE;;AAEA;IACI,kBAAkB,EAAE,0DAA0D;IAC9E,QAAQ;IACR,UAAU,EAAE,8DAA8D;IAC1E,2BAA2B,EAAE,4BAA4B;;IAEzD,YAAY,GAAG,wBAAwB;IACvC,YAAY;IACZ,WAAW;AACf;;AAEA;IACI,eAAe;IACf,gBAAgB;IAChB,WAAW;IACX,8BAA8B;AAClC;;AAEA;IACI,OAAO;IACP,aAAa;IACb,SAAS;IACT,gBAAgB;AACpB;;AAEA;IACI,OAAO;IACP,kBAAkB;IAClB,yBAAyB;IACzB,kBAAkB;IAClB,eAAe;IACf,oBAAoB;AACxB;;AAEA;IACI,aAAa;IACb,qBAAqB;IACrB,6CAA6C;AACjD;;AAEA;IACI,kBAAkB;IAClB,mBAAmB;IACnB,YAAY;IACZ,YAAY;IACZ,kBAAkB;IAClB,gBAAgB;IAChB,eAAe;IACf,mBAAmB;AACvB;;AAEA;IACI,mBAAmB;AACvB;;AAEA;IACI,aAAa;IACb,mBAAmB;IACnB,QAAQ;IACR,gBAAgB;IAChB,eAAe;IACf,aAAa;IACb,kBAAkB;IAClB,2BAA2B;AAC/B;;AAEA;IACI,mBAAmB;AACvB;;AAEA;IACI,eAAe;AACnB;;AAEA;IACI,eAAe;IACf,gBAAgB;IAChB,WAAW;AACf;;AAEA,yCAAyC;AACzC;IACI,aAAa;IACb,kCAAkC;IAClC,SAAS;IACT,gBAAgB;AACpB;;AAEA;IACI,iBAAiB;IACjB,mBAAmB;IACnB,aAAa;IACb,sCAAsC;IACtC,aAAa;IACb,sBAAsB;IACtB,SAAS;AACb;;AAEA;IACI,mBAAmB;IACnB,mBAAmB;IACnB,aAAa;IACb,sCAAsC;IACtC,iBAAiB;IACjB,gBAAgB;IAChB,UAAU;IACV,0BAA0B;IAC1B,aAAa;IACb,mBAAmB;IACnB,uBAAuB;IACvB,WAAW;IACX,gBAAgB;AACpB;;AAEA,6CAA6C;AAC7C;IACI,aAAa;IACb,qCAAqC;IACrC,SAAS;AACb;;AAEA;IACI,mBAAmB;IACnB,kBAAkB;IAClB,UAAU;IACV,aAAa;IACb,oBAAoB;IACpB,eAAe;IACf,yBAAyB;IACzB,kBAAkB;AACtB;;AAEA;IACI,2BAA2B;IAC3B,qCAAqC;IACrC,mBAAmB;IACnB,qBAAqB;AACzB;;AAEA;IACI,kBAAkB;IAClB,SAAS;IACT,QAAQ;IACR,YAAY;IACZ,YAAY;IACZ,UAAU;AACd;;AAEA;IACI,eAAe;IACf,gBAAgB;IAChB,cAAc;IACd,gBAAgB;IAChB,kBAAkB;IAClB,QAAQ;IACR,UAAU;IACV,SAAS;IACT,UAAU;IACV,UAAU;AACd;;AAEA,iDAAiD;AACjD;IACI,mBAAmB;IACnB,sBAAsB;IACtB,aAAa;IACb,mBAAmB;IACnB,uBAAuB;IACvB,oBAAoB;AACxB;;AAEA;IACI,aAAa;IACb,mBAAmB;IACnB,QAAQ;IACR,cAAc;IACd,eAAe;IACf,gBAAgB;IAChB,gBAAgB;IAChB,gBAAgB;AACpB;;AAEA;IACI,YAAY;IACZ,eAAe;IACf,gBAAgB;IAChB,cAAc;IACd,UAAU;IACV,2BAA2B;IAC3B,wCAAwC;AAC5C;;AAEA;IACI,mBAAmB;IACnB,qBAAqB;AACzB;;AAEA;IACI,UAAU;IACV,wBAAwB;AAC5B;;AAEA,uCAAuC;AACvC;IACI,gBAAgB;AACpB;;AAEA;IACI,eAAe;IACf,gBAAgB;IAChB,WAAW;IACX,gBAAgB;IAChB,mBAAmB;AACvB;;AAEA;IACI,aAAa;IACb,qCAAqC;IACrC,SAAS;AACb;;AAEA;IACI,iBAAiB;IACjB,mBAAmB;IACnB,gBAAgB;IAChB,uCAAuC;IACvC,2CAA2C;IAC3C,aAAa;IACb,aAAa;IACb,sBAAsB;IACtB,yBAAyB;AAC7B;;AAEA;IACI,2BAA2B;IAC3B,uCAAuC;AAC3C;;AAEA;IACI,kBAAkB;IAClB,WAAW;IACX,WAAW,GAAG,0BAA0B;IACxC,gBAAgB;AACpB;;AAEA;IACI,WAAW;IACX,YAAY;IACZ,iBAAiB;IACjB,mBAAmB;AACvB;;AAEA;IACI,WAAW;IACX,iBAAiB;IACjB,aAAa;IACb,sBAAsB;IACtB,QAAQ;IACR,OAAO;AACX;;AAEA;IACI,aAAa;IACb,iCAAiC,GAAG,8CAA8C;IAClF,SAAS;IACT,mBAAmB;IACnB,gBAAgB,GAAG,qBAAqB;AAC5C;;AAEA;IACI;;qBAEiB;IACjB,aAAa;IACb,sBAAsB;IACtB,QAAQ;IACR,YAAY;AAChB;;AAEA;IACI,eAAe;IACf,gBAAgB;IAChB,WAAW;IACX,oBAAoB;IACpB,qBAAqB;IACrB,4BAA4B;IAC5B,gBAAgB;IAChB,uBAAuB;IACvB,gBAAgB;AACpB;;AAEA;IACI,eAAe;IACf,gBAAgB;IAChB,cAAc;AAClB;;AAEA;IACI,eAAe;IACf,WAAW;IACX,aAAa;IACb,mBAAmB;IACnB,QAAQ;AACZ;;AAEA;IACI,eAAe;AACnB;;AAEA;IACI,aAAa;IACb,sBAAsB;IACtB,cAAc;IACd,yBAAyB;IACzB,qBAAqB;AACzB;;AAEA,uCAAuC;AACvC;IACI,kBAAkB;IAClB,QAAQ;IACR,UAAU;IACV,oCAAoC;IACpC,YAAY;IACZ,kBAAkB;IAClB,WAAW;IACX,YAAY;IACZ,aAAa;IACb,mBAAmB;IACnB,uBAAuB;IACvB,eAAe;IACf,eAAe;IACf,sCAAsC;IACtC,oBAAoB;IACpB,WAAW;IACX,UAAU;IACV,cAAc;AAClB;;AAEA;IACI,gBAAgB;IAChB,YAAY;IACZ,eAAe;IACf,eAAe;IACf,YAAY;IACZ,kBAAkB;IAClB,WAAW;IACX,YAAY;IACZ,aAAa;IACb,mBAAmB;IACnB,uBAAuB;IACvB,oBAAoB;AACxB;;AAEA;IACI,aAAa;IACb,mBAAmB;IACnB,QAAQ;AACZ;;AAEA;IACI,eAAe;IACf,WAAW;IACX,SAAS;AACb;;AAEA;IACI,WAAW;IACX,YAAY;IACZ,iBAAiB;AACrB;;AAEA;IACI,WAAW;IACX,YAAY;IACZ,iBAAiB,GAAG,6BAA6B;AACrD;;AAEA;IACI,mBAAmB;IACnB,qBAAqB;AACzB;;AAEA;IACI,mBAAmB;IACnB,qBAAqB;AACzB;;AAEA,uCAAuC;AACvC;IACI;;QAEI,kBAAkB;QAClB,mBAAmB;IACvB;AACJ;;AAEA;IACI;;QAEI,kBAAkB;QAClB,mBAAmB;IACvB;;IAEA;QACI,sBAAsB;QACtB,oBAAoB;IACxB;;IAEA;QACI,SAAS;IACb;;IAEA;QACI,aAAa;IACjB;;IAEA;QACI,0BAA0B;IAC9B;;IAEA;QACI,aAAa;IACjB;AACJ","sourcesContent":["/* ========== ГЛАВНАЯ СТРАНИЦА ========== */\r\nbody .main-container {\r\n    width: 100%;\r\n    min-height: 100vh;\r\n    background: #f5f5f5;\r\n}\r\n\r\n/* ========== ХЕДЕР ========== */\r\n.header {\r\n    width: 100%;\r\n    height: 80px;\r\n    background: #2bde8c;\r\n    position: fixed;\r\n    top: 0;\r\n    left: 0;\r\n    right: 0;\r\n    z-index: 1000;\r\n}\r\n\r\n.header-content {\r\n    max-width: 1350px;\r\n    margin: 0 auto;\r\n    padding: 10px 0;\r\n    height: 100%;\r\n    display: flex;\r\n    justify-content: space-between;\r\n    align-items: center;\r\n}\r\n\r\n.header-left {\r\n    display: flex;\r\n    gap: 5px;\r\n    align-items: center;\r\n}\r\n\r\n.nav-icon {\r\n    display: flex;\r\n    align-items: center;\r\n    margin-right: 10px;\r\n}\r\n\r\n.nav-icon .nav-link {\r\n    color: rgb(0, 0, 0);\r\n    text-decoration: none;\r\n    font-weight: 500;\r\n    padding: 5px 10px;\r\n    display: flex;\r\n    align-items: center;\r\n    gap: 5px;\r\n    border-radius: 4px;\r\n    line-height: 1;\r\n}\r\n\r\n.nav-icon .nav-link:hover {\r\n    background: rgba(255, 255, 255, 1.0);\r\n    border-radius: 40px;\r\n}\r\n\r\n.nav-icon .nav-link:hover .nav-text {\r\n    text-decoration: underline;\r\n    text-decoration-skip-ink: none;\r\n    text-underline-offset: 2px;\r\n}\r\n\r\n.nav-icon .icon {\r\n    font-size: 20px;\r\n    line-height: 1;\r\n}\r\n\r\n.header-right {\r\n    display: flex;\r\n    gap: 20px;\r\n    align-items: center;\r\n}\r\n\r\n.place-ad-btn {\r\n    background: #2bc0de;\r\n    color: #ffffff;\r\n    padding: 10px 20px;\r\n    border-radius: 8px;\r\n    font-weight: 600;\r\n    border: none;\r\n    cursor: pointer;\r\n    transition: all 0.3s;\r\n    box-shadow: 0 2px 8px rgba(0,0,0,0.1);\r\n}\r\n\r\n.place-ad-btn:hover {\r\n    background: #24a9c7;\r\n    transform: translateY(-2px);\r\n    box-shadow: 0 4px 12px rgba(0,0,0,0.15);\r\n}\r\n\r\n.avatar {\r\n    width: 50px;\r\n    height: 50px;\r\n    border-radius: 50%;\r\n}\r\n\r\n.profile-icon {\r\n    width: 40px;\r\n    height: 40px;\r\n    background: rgba(255, 255, 255, 0.2);\r\n    border-radius: 50%;\r\n    display: flex;\r\n    align-items: center;\r\n    justify-content: center;\r\n    cursor: pointer;\r\n    transition: background 0.3s;\r\n    line-height: 1;\r\n}\r\n\r\n.profile-icon:hover {\r\n    background: rgba(255, 255, 255, 0.3);\r\n}\r\n\r\n.profile-icon .icon {\r\n    font-size: 24px;\r\n    color: white;\r\n    align-items: center;\r\n    justify-content: center;\r\n    line-height: 1;\r\n    transform: translateY(-1px);\r\n}\r\n\r\n.nav-login {\r\n    text-decoration: none;\r\n}\r\n\r\n.nav-login:hover {\r\n    text-decoration: underline;\r\n    text-decoration-color: white;\r\n    text-decoration-skip-ink: none;\r\n    text-underline-offset: 2px;\r\n    color: white;\r\n}\r\n\r\n/* ========== ОСНОВНОЙ КОНТЕНТ ========== */\r\n.main-content {\r\n    max-width: 1400px;\r\n    margin: 0 auto;\r\n    padding: 100px 20px;\r\n    margin-top: 80px;\r\n}\r\n\r\n.search-section {\r\n    background: white;\r\n    border-radius: 12px;\r\n    padding: 20px;\r\n    box-shadow: 0 4px 12px rgba(0,0,0,0.1);\r\n    margin-bottom: 5px;\r\n\r\n    /* Фиксация */\r\n    position: fixed;\r\n    top: 80px;              /* сразу под хедером */\r\n    left: 0;\r\n    right: 0;\r\n    z-index: 999;\r\n    \r\n    /*Чтобы поиск был на одной линии с контентом */\r\n    max-width: 1400px;       /*как у main-content*/\r\n    width: calc(100% - 80px);\r\n    margin-left: auto;\r\n    margin-right: auto;\r\n}\r\n\r\n.search-row {\r\n    display: flex;\r\n    align-items: center;\r\n    gap: 20px;\r\n    flex-wrap: wrap;\r\n    width: 100%;\r\n}\r\n\r\n.brand {\r\n    display: flex;\r\n    align-items: center;\r\n    min-width: 150px;\r\n    height: 40px; /* Фиксируем высоту контейнера (как у инпута примерно) */\r\n    position: relative; /* Чтобы логотип ориентировался на этот блок */\r\n}\r\n\r\n.logo {\r\n    position: absolute; /* Логотип выходит из общего потока и не давит на соседа */\r\n    top: 50%;\r\n    left: -5px; /* Прижимаем к самому краю search-section, игнорируя padding */\r\n    transform: translateY(-50%); /* Центрируем по вертикали */\r\n    \r\n    width: 160px;  /* Любой нужный размер */\r\n    height: auto;\r\n    z-index: 10;\r\n}\r\n\r\n.brand-name {\r\n    font-size: 38px;\r\n    font-weight: 700;\r\n    color: #333;\r\n    font-family: 'Caveat', cursive;\r\n}\r\n\r\n.search-wrapper {\r\n    flex: 1;\r\n    display: flex;\r\n    gap: 10px;\r\n    min-width: 300px;\r\n}\r\n\r\n.search-input {\r\n    flex: 1;\r\n    padding: 15px 20px;\r\n    border: 2px solid #e0e0e0;\r\n    border-radius: 8px;\r\n    font-size: 16px;\r\n    transition: all 0.3s;\r\n}\r\n\r\n.search-input:focus {\r\n    outline: none;\r\n    border-color: #2bde8c;\r\n    box-shadow: 0 0 0 3px rgba(43, 222, 140, 0.1);\r\n}\r\n\r\n.search-btn {\r\n    padding: 15px 30px;\r\n    background: #2bde8c;\r\n    color: white;\r\n    border: none;\r\n    border-radius: 8px;\r\n    font-weight: 600;\r\n    cursor: pointer;\r\n    white-space: nowrap;\r\n}\r\n\r\n.search-btn:hover {\r\n    background: #24b875;\r\n}\r\n\r\n.geo {\r\n    display: flex;\r\n    align-items: center;\r\n    gap: 5px;\r\n    min-width: 100px;\r\n    cursor: pointer;\r\n    padding: 10px;\r\n    border-radius: 8px;\r\n    transition: background 0.3s;\r\n}\r\n\r\n.geo:hover {\r\n    background: #f5f5f5;\r\n}\r\n\r\n.geo .icon {\r\n    font-size: 20px;\r\n}\r\n\r\n.city {\r\n    font-size: 16px;\r\n    font-weight: 500;\r\n    color: #333;\r\n}\r\n\r\n/* ========== СЕТКА КОНТЕНТА ========== */\r\n.content-grid {\r\n    display: grid;\r\n    grid-template-columns: 9.5fr 2.5fr;\r\n    gap: 20px;\r\n    margin-top: 20px;\r\n}\r\n\r\n.main-column {\r\n    background: white;\r\n    border-radius: 12px;\r\n    padding: 20px;\r\n    box-shadow: 0 4px 12px rgba(0,0,0,0.1);\r\n    display: flex;\r\n    flex-direction: column;\r\n    gap: 20px;\r\n}\r\n\r\n.ad-column {\r\n    background: #f8f9fa;\r\n    border-radius: 12px;\r\n    padding: 20px;\r\n    box-shadow: 0 4px 12px rgba(0,0,0,0.1);\r\n    min-height: 400px;\r\n    position: sticky;\r\n    top: 110px;\r\n    border: 2px dashed #2bde8c;\r\n    display: flex;\r\n    align-items: center;\r\n    justify-content: center;\r\n    color: #666;\r\n    font-weight: 500;\r\n}\r\n\r\n/* ========== КАРТОЧКИ КАТЕГОРИЙ ========== */\r\n.cards-row {\r\n    display: grid;\r\n    grid-template-columns: repeat(6, 1fr);\r\n    gap: 20px;\r\n}\r\n\r\n.category-card {\r\n    background: #E9FCF3;\r\n    border-radius: 8px;\r\n    padding: 0;\r\n    height: 100px;\r\n    transition: all 0.2s;\r\n    cursor: pointer;\r\n    border: 1px solid #e9ecef;\r\n    position: relative;\r\n}\r\n\r\n.category-card:hover {\r\n    transform: translateY(-2px);\r\n    box-shadow: 0 4px 8px rgba(0,0,0,0.1);\r\n    background: #BFE4D5;\r\n    border-color: #2bde8c;\r\n}\r\n\r\n.category-card img {\r\n    position: absolute;\r\n    bottom: 0;\r\n    right: 0;\r\n    width: 150px;\r\n    height: auto;\r\n    z-index: 1;\r\n}\r\n\r\n.card-title {\r\n    font-size: 15px;\r\n    font-weight: 500;\r\n    color: #495057;\r\n    text-align: left;\r\n    position: absolute;\r\n    top: 9px;\r\n    left: 11px;\r\n    margin: 0;\r\n    padding: 0;\r\n    z-index: 2;\r\n}\r\n\r\n/* ========== КАРТОЧКА ВСЕ КАТЕГОРИИ ========== */\r\n.category-card.all-categories {\r\n    background: #E9FCF3;\r\n    border: 1px solid #ddd;\r\n    display: flex;\r\n    align-items: center;\r\n    justify-content: center;\r\n    transition: all 0.2s;\r\n}\r\n\r\n.category-card.all-categories .card-title {\r\n    display: flex;\r\n    align-items: center;\r\n    gap: 5px;\r\n    color: #495057;\r\n    font-size: 16px;\r\n    font-weight: 500;\r\n    position: static;\r\n    line-height: 1.2;\r\n}\r\n\r\n.category-card.all-categories .card-title::after {\r\n    content: '→';\r\n    font-size: 25px;\r\n    font-weight: 700;\r\n    color: #495057;\r\n    opacity: 0;\r\n    transform: translateX(-5px);\r\n    transition: opacity 0.2s, transform 0.2s;\r\n}\r\n\r\n.category-card.all-categories:hover {\r\n    background: #BFE4D5;\r\n    border-color: #2bde8c;\r\n}\r\n\r\n.category-card.all-categories:hover .card-title::after {\r\n    opacity: 1;\r\n    transform: translateX(0);\r\n}\r\n\r\n/* ========== РЕКОМЕНДАЦИИ ========== */\r\n.recommendations-section {\r\n    margin-top: 20px;\r\n}\r\n\r\n.recommendations-title {\r\n    font-size: 24px;\r\n    font-weight: 600;\r\n    color: #333;\r\n    text-align: left;\r\n    margin-bottom: 10px;\r\n}\r\n\r\n.recommendations-row {\r\n    display: grid;\r\n    grid-template-columns: repeat(4, 1fr);\r\n    gap: 10px;\r\n}\r\n\r\n.rec-card {\r\n    background: white;\r\n    border-radius: 12px;\r\n    overflow: hidden;\r\n    box-shadow: 0 4px 12px rgba(0,0,0,0.08);\r\n    transition: transform 0.2s, box-shadow 0.2s;\r\n    height: 300px;\r\n    display: flex;\r\n    flex-direction: column;\r\n    border: 1px solid #e9ecef;\r\n}\r\n\r\n.rec-card:hover {\r\n    transform: translateY(-3px);\r\n    box-shadow: 0 8px 20px rgba(0,0,0,0.12);\r\n}\r\n\r\n.rec-card-image-container {\r\n    position: relative;\r\n    width: 100%;\r\n    height: 60%;  /* как у .rec-card-image */\r\n    overflow: hidden;\r\n}\r\n\r\n.rec-card-image {\r\n    width: 100%;\r\n    height: 100%;\r\n    object-fit: cover;\r\n    background: #f0f0f0;\r\n}\r\n\r\n.rec-card-content {\r\n    height: 40%;\r\n    padding: 10px 8px;\r\n    display: flex;\r\n    flex-direction: column;\r\n    gap: 0px;\r\n    flex: 1;\r\n}\r\n\r\n.rec-card-footer {\r\n    display: grid;\r\n    grid-template-columns: 150px 70px;  /* левая колонка тянется, правая под контент */\r\n    gap: 10px;\r\n    align-items: center;\r\n    margin-top: auto;  /* прижимаем к низу */\r\n}\r\n\r\n.rec-card-footer-info {\r\n    /* flex: 1;\r\n    justify-content: space-between;\r\n    margin-top: 5px;*/\r\n    display: flex;\r\n    flex-direction: column;\r\n    gap: 4px;\r\n    min-width: 0;\r\n}\r\n\r\n.rec-card-title {\r\n    font-size: 14px;\r\n    font-weight: 500;\r\n    color: #333;\r\n    display: -webkit-box;\r\n    -webkit-line-clamp: 2;\r\n    -webkit-box-orient: vertical;\r\n    overflow: hidden;\r\n    text-overflow: ellipsis;\r\n    line-height: 1.3;\r\n}\r\n\r\n.rec-card-price {\r\n    font-size: 16px;\r\n    font-weight: 700;\r\n    color: #000000;\r\n}\r\n\r\n.rec-card-location {\r\n    font-size: 12px;\r\n    color: #999;\r\n    display: flex;\r\n    align-items: center;\r\n    gap: 2px;\r\n}\r\n\r\n.location-icon {\r\n    font-size: 12px;\r\n}\r\n\r\n.rec-card-footer-actions {\r\n    display: flex;\r\n    flex-direction: column;\r\n    flex-shrink: 0;\r\n    justify-content: flex-end;\r\n    align-items: flex-end;\r\n}\r\n\r\n/* Кнопка лайка в правом верхнем углу */\r\n.rec-card-fav {\r\n    position: absolute;\r\n    top: 8px;\r\n    right: 8px;\r\n    background: rgba(255, 255, 255, 0.9);\r\n    border: none;\r\n    border-radius: 50%;\r\n    width: 32px;\r\n    height: 32px;\r\n    display: flex;\r\n    align-items: center;\r\n    justify-content: center;\r\n    font-size: 32px;\r\n    cursor: pointer;\r\n    box-shadow: 0 2px 8px rgba(0,0,0,0.15);\r\n    transition: all 0.2s;\r\n    z-index: 10;\r\n    padding: 0;\r\n    line-height: 1;\r\n}\r\n\r\n.rec-card-cart {\r\n    background: none;\r\n    border: none;\r\n    font-size: 18px;\r\n    cursor: pointer;\r\n    padding: 4px;\r\n    border-radius: 50%;\r\n    width: 32px;\r\n    height: 32px;\r\n    display: flex;\r\n    align-items: center;\r\n    justify-content: center;\r\n    transition: all 0.2s;\r\n}\r\n\r\n.rec-card-views {\r\n    display: flex;\r\n    align-items: center;\r\n    gap: 2px;\r\n}\r\n\r\n.rec-card-views .num_views {\r\n    font-size: 14px;\r\n    color: #666;\r\n    margin: 0;\r\n}\r\n\r\n.views {\r\n    width: 30px;\r\n    height: 30px;\r\n    object-fit: cover;\r\n}\r\n\r\n.rec-card-actions .views {\r\n    width: 14px;\r\n    height: 14px;\r\n    object-fit: cover;  /* чтобы фото не искажалось */\r\n}\r\n\r\n.rec-card-fav:hover {\r\n    background: #fff0f0;\r\n    transform: scale(1.1);\r\n}\r\n\r\n.rec-card-cart:hover {\r\n    background: #e8f5e9;\r\n    transform: scale(1.1);\r\n}\r\n\r\n/* ========== АДАПТИВНОСТЬ ========== */\r\n@media (max-width: 1200px) {\r\n    .header-content,\r\n    .main-content {\r\n        padding-left: 60px;\r\n        padding-right: 60px;\r\n    }\r\n}\r\n\r\n@media (max-width: 768px) {\r\n    .header-content,\r\n    .main-content {\r\n        padding-left: 20px;\r\n        padding-right: 20px;\r\n    }\r\n    \r\n    .search-section {\r\n        flex-direction: column;\r\n        align-items: stretch;\r\n    }\r\n    \r\n    .header-left {\r\n        gap: 15px;\r\n    }\r\n    \r\n    .nav-icon .nav-link {\r\n        display: none;\r\n    }\r\n    \r\n    .content-grid {\r\n        grid-template-columns: 1fr;\r\n    }\r\n    \r\n    .ad-column {\r\n        display: none;\r\n    }\r\n}"],"sourceRoot":""}]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ },

/***/ "./node_modules/css-loader/dist/runtime/api.js"
/*!*****************************************************!*\
  !*** ./node_modules/css-loader/dist/runtime/api.js ***!
  \*****************************************************/
(module) {

"use strict";


/*
  MIT License http://www.opensource.org/licenses/mit-license.php
  Author Tobias Koppers @sokra
*/
module.exports = function (cssWithMappingToString) {
  var list = [];

  // return the list of modules as css string
  list.toString = function toString() {
    return this.map(function (item) {
      var content = "";
      var needLayer = typeof item[5] !== "undefined";
      if (item[4]) {
        content += "@supports (".concat(item[4], ") {");
      }
      if (item[2]) {
        content += "@media ".concat(item[2], " {");
      }
      if (needLayer) {
        content += "@layer".concat(item[5].length > 0 ? " ".concat(item[5]) : "", " {");
      }
      content += cssWithMappingToString(item);
      if (needLayer) {
        content += "}";
      }
      if (item[2]) {
        content += "}";
      }
      if (item[4]) {
        content += "}";
      }
      return content;
    }).join("");
  };

  // import a list of modules into the list
  list.i = function i(modules, media, dedupe, supports, layer) {
    if (typeof modules === "string") {
      modules = [[null, modules, undefined]];
    }
    var alreadyImportedModules = {};
    if (dedupe) {
      for (var k = 0; k < this.length; k++) {
        var id = this[k][0];
        if (id != null) {
          alreadyImportedModules[id] = true;
        }
      }
    }
    for (var _k = 0; _k < modules.length; _k++) {
      var item = [].concat(modules[_k]);
      if (dedupe && alreadyImportedModules[item[0]]) {
        continue;
      }
      if (typeof layer !== "undefined") {
        if (typeof item[5] === "undefined") {
          item[5] = layer;
        } else {
          item[1] = "@layer".concat(item[5].length > 0 ? " ".concat(item[5]) : "", " {").concat(item[1], "}");
          item[5] = layer;
        }
      }
      if (media) {
        if (!item[2]) {
          item[2] = media;
        } else {
          item[1] = "@media ".concat(item[2], " {").concat(item[1], "}");
          item[2] = media;
        }
      }
      if (supports) {
        if (!item[4]) {
          item[4] = "".concat(supports);
        } else {
          item[1] = "@supports (".concat(item[4], ") {").concat(item[1], "}");
          item[4] = supports;
        }
      }
      list.push(item);
    }
  };
  return list;
};

/***/ },

/***/ "./node_modules/css-loader/dist/runtime/sourceMaps.js"
/*!************************************************************!*\
  !*** ./node_modules/css-loader/dist/runtime/sourceMaps.js ***!
  \************************************************************/
(module) {

"use strict";


module.exports = function (item) {
  var content = item[1];
  var cssMapping = item[3];
  if (!cssMapping) {
    return content;
  }
  if (typeof btoa === "function") {
    var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(cssMapping))));
    var data = "sourceMappingURL=data:application/json;charset=utf-8;base64,".concat(base64);
    var sourceMapping = "/*# ".concat(data, " */");
    return [content].concat([sourceMapping]).join("\n");
  }
  return [content].join("\n");
};

/***/ },

/***/ "./node_modules/handlebars/dist/handlebars.js"
/*!****************************************************!*\
  !*** ./node_modules/handlebars/dist/handlebars.js ***!
  \****************************************************/
(module) {

/**!

 @license
 handlebars v4.7.8

Copyright (C) 2011-2019 by Yehuda Katz

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

*/
(function webpackUniversalModuleDefinition(root, factory) {
	if(true)
		module.exports = factory();
	else // removed by dead control flow
{}
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __nested_webpack_require_1638__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __nested_webpack_require_1638__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__nested_webpack_require_1638__.m = modules;

/******/ 	// expose the module cache
/******/ 	__nested_webpack_require_1638__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__nested_webpack_require_1638__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __nested_webpack_require_1638__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __nested_webpack_require_2839__) {

	'use strict';

	var _interopRequireDefault = __nested_webpack_require_2839__(1)['default'];

	exports.__esModule = true;

	var _handlebarsRuntime = __nested_webpack_require_2839__(2);

	var _handlebarsRuntime2 = _interopRequireDefault(_handlebarsRuntime);

	// Compiler imports

	var _handlebarsCompilerAst = __nested_webpack_require_2839__(84);

	var _handlebarsCompilerAst2 = _interopRequireDefault(_handlebarsCompilerAst);

	var _handlebarsCompilerBase = __nested_webpack_require_2839__(85);

	var _handlebarsCompilerCompiler = __nested_webpack_require_2839__(90);

	var _handlebarsCompilerJavascriptCompiler = __nested_webpack_require_2839__(91);

	var _handlebarsCompilerJavascriptCompiler2 = _interopRequireDefault(_handlebarsCompilerJavascriptCompiler);

	var _handlebarsCompilerVisitor = __nested_webpack_require_2839__(88);

	var _handlebarsCompilerVisitor2 = _interopRequireDefault(_handlebarsCompilerVisitor);

	var _handlebarsNoConflict = __nested_webpack_require_2839__(83);

	var _handlebarsNoConflict2 = _interopRequireDefault(_handlebarsNoConflict);

	var _create = _handlebarsRuntime2['default'].create;
	function create() {
	  var hb = _create();

	  hb.compile = function (input, options) {
	    return _handlebarsCompilerCompiler.compile(input, options, hb);
	  };
	  hb.precompile = function (input, options) {
	    return _handlebarsCompilerCompiler.precompile(input, options, hb);
	  };

	  hb.AST = _handlebarsCompilerAst2['default'];
	  hb.Compiler = _handlebarsCompilerCompiler.Compiler;
	  hb.JavaScriptCompiler = _handlebarsCompilerJavascriptCompiler2['default'];
	  hb.Parser = _handlebarsCompilerBase.parser;
	  hb.parse = _handlebarsCompilerBase.parse;
	  hb.parseWithoutProcessing = _handlebarsCompilerBase.parseWithoutProcessing;

	  return hb;
	}

	var inst = create();
	inst.create = create;

	_handlebarsNoConflict2['default'](inst);

	inst.Visitor = _handlebarsCompilerVisitor2['default'];

	inst['default'] = inst;

	exports['default'] = inst;
	module.exports = exports['default'];

/***/ }),
/* 1 */
/***/ (function(module, exports) {

	"use strict";

	exports["default"] = function (obj) {
	  return obj && obj.__esModule ? obj : {
	    "default": obj
	  };
	};

	exports.__esModule = true;

/***/ }),
/* 2 */
/***/ (function(module, exports, __nested_webpack_require_5051__) {

	'use strict';

	var _interopRequireWildcard = __nested_webpack_require_5051__(3)['default'];

	var _interopRequireDefault = __nested_webpack_require_5051__(1)['default'];

	exports.__esModule = true;

	var _handlebarsBase = __nested_webpack_require_5051__(4);

	var base = _interopRequireWildcard(_handlebarsBase);

	// Each of these augment the Handlebars object. No need to setup here.
	// (This is done to easily share code between commonjs and browse envs)

	var _handlebarsSafeString = __nested_webpack_require_5051__(77);

	var _handlebarsSafeString2 = _interopRequireDefault(_handlebarsSafeString);

	var _handlebarsException = __nested_webpack_require_5051__(6);

	var _handlebarsException2 = _interopRequireDefault(_handlebarsException);

	var _handlebarsUtils = __nested_webpack_require_5051__(5);

	var Utils = _interopRequireWildcard(_handlebarsUtils);

	var _handlebarsRuntime = __nested_webpack_require_5051__(78);

	var runtime = _interopRequireWildcard(_handlebarsRuntime);

	var _handlebarsNoConflict = __nested_webpack_require_5051__(83);

	var _handlebarsNoConflict2 = _interopRequireDefault(_handlebarsNoConflict);

	// For compatibility and usage outside of module systems, make the Handlebars object a namespace
	function create() {
	  var hb = new base.HandlebarsEnvironment();

	  Utils.extend(hb, base);
	  hb.SafeString = _handlebarsSafeString2['default'];
	  hb.Exception = _handlebarsException2['default'];
	  hb.Utils = Utils;
	  hb.escapeExpression = Utils.escapeExpression;

	  hb.VM = runtime;
	  hb.template = function (spec) {
	    return runtime.template(spec, hb);
	  };

	  return hb;
	}

	var inst = create();
	inst.create = create;

	_handlebarsNoConflict2['default'](inst);

	inst['default'] = inst;

	exports['default'] = inst;
	module.exports = exports['default'];

/***/ }),
/* 3 */
/***/ (function(module, exports) {

	"use strict";

	exports["default"] = function (obj) {
	  if (obj && obj.__esModule) {
	    return obj;
	  } else {
	    var newObj = {};

	    if (obj != null) {
	      for (var key in obj) {
	        if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key];
	      }
	    }

	    newObj["default"] = obj;
	    return newObj;
	  }
	};

	exports.__esModule = true;

/***/ }),
/* 4 */
/***/ (function(module, exports, __nested_webpack_require_7277__) {

	'use strict';

	var _interopRequireDefault = __nested_webpack_require_7277__(1)['default'];

	exports.__esModule = true;
	exports.HandlebarsEnvironment = HandlebarsEnvironment;

	var _utils = __nested_webpack_require_7277__(5);

	var _exception = __nested_webpack_require_7277__(6);

	var _exception2 = _interopRequireDefault(_exception);

	var _helpers = __nested_webpack_require_7277__(10);

	var _decorators = __nested_webpack_require_7277__(70);

	var _logger = __nested_webpack_require_7277__(72);

	var _logger2 = _interopRequireDefault(_logger);

	var _internalProtoAccess = __nested_webpack_require_7277__(73);

	var VERSION = '4.7.8';
	exports.VERSION = VERSION;
	var COMPILER_REVISION = 8;
	exports.COMPILER_REVISION = COMPILER_REVISION;
	var LAST_COMPATIBLE_COMPILER_REVISION = 7;

	exports.LAST_COMPATIBLE_COMPILER_REVISION = LAST_COMPATIBLE_COMPILER_REVISION;
	var REVISION_CHANGES = {
	  1: '<= 1.0.rc.2', // 1.0.rc.2 is actually rev2 but doesn't report it
	  2: '== 1.0.0-rc.3',
	  3: '== 1.0.0-rc.4',
	  4: '== 1.x.x',
	  5: '== 2.0.0-alpha.x',
	  6: '>= 2.0.0-beta.1',
	  7: '>= 4.0.0 <4.3.0',
	  8: '>= 4.3.0'
	};

	exports.REVISION_CHANGES = REVISION_CHANGES;
	var objectType = '[object Object]';

	function HandlebarsEnvironment(helpers, partials, decorators) {
	  this.helpers = helpers || {};
	  this.partials = partials || {};
	  this.decorators = decorators || {};

	  _helpers.registerDefaultHelpers(this);
	  _decorators.registerDefaultDecorators(this);
	}

	HandlebarsEnvironment.prototype = {
	  constructor: HandlebarsEnvironment,

	  logger: _logger2['default'],
	  log: _logger2['default'].log,

	  registerHelper: function registerHelper(name, fn) {
	    if (_utils.toString.call(name) === objectType) {
	      if (fn) {
	        throw new _exception2['default']('Arg not supported with multiple helpers');
	      }
	      _utils.extend(this.helpers, name);
	    } else {
	      this.helpers[name] = fn;
	    }
	  },
	  unregisterHelper: function unregisterHelper(name) {
	    delete this.helpers[name];
	  },

	  registerPartial: function registerPartial(name, partial) {
	    if (_utils.toString.call(name) === objectType) {
	      _utils.extend(this.partials, name);
	    } else {
	      if (typeof partial === 'undefined') {
	        throw new _exception2['default']('Attempting to register a partial called "' + name + '" as undefined');
	      }
	      this.partials[name] = partial;
	    }
	  },
	  unregisterPartial: function unregisterPartial(name) {
	    delete this.partials[name];
	  },

	  registerDecorator: function registerDecorator(name, fn) {
	    if (_utils.toString.call(name) === objectType) {
	      if (fn) {
	        throw new _exception2['default']('Arg not supported with multiple decorators');
	      }
	      _utils.extend(this.decorators, name);
	    } else {
	      this.decorators[name] = fn;
	    }
	  },
	  unregisterDecorator: function unregisterDecorator(name) {
	    delete this.decorators[name];
	  },
	  /**
	   * Reset the memory of illegal property accesses that have already been logged.
	   * @deprecated should only be used in handlebars test-cases
	   */
	  resetLoggedPropertyAccesses: function resetLoggedPropertyAccesses() {
	    _internalProtoAccess.resetLoggedProperties();
	  }
	};

	var log = _logger2['default'].log;

	exports.log = log;
	exports.createFrame = _utils.createFrame;
	exports.logger = _logger2['default'];

/***/ }),
/* 5 */
/***/ (function(module, exports) {

	'use strict';

	exports.__esModule = true;
	exports.extend = extend;
	exports.indexOf = indexOf;
	exports.escapeExpression = escapeExpression;
	exports.isEmpty = isEmpty;
	exports.createFrame = createFrame;
	exports.blockParams = blockParams;
	exports.appendContextPath = appendContextPath;
	var escape = {
	  '&': '&amp;',
	  '<': '&lt;',
	  '>': '&gt;',
	  '"': '&quot;',
	  "'": '&#x27;',
	  '`': '&#x60;',
	  '=': '&#x3D;'
	};

	var badChars = /[&<>"'`=]/g,
	    possible = /[&<>"'`=]/;

	function escapeChar(chr) {
	  return escape[chr];
	}

	function extend(obj /* , ...source */) {
	  for (var i = 1; i < arguments.length; i++) {
	    for (var key in arguments[i]) {
	      if (Object.prototype.hasOwnProperty.call(arguments[i], key)) {
	        obj[key] = arguments[i][key];
	      }
	    }
	  }

	  return obj;
	}

	var toString = Object.prototype.toString;

	exports.toString = toString;
	// Sourced from lodash
	// https://github.com/bestiejs/lodash/blob/master/LICENSE.txt
	/* eslint-disable func-style */
	var isFunction = function isFunction(value) {
	  return typeof value === 'function';
	};
	// fallback for older versions of Chrome and Safari
	/* istanbul ignore next */
	if (isFunction(/x/)) {
	  exports.isFunction = isFunction = function (value) {
	    return typeof value === 'function' && toString.call(value) === '[object Function]';
	  };
	}
	exports.isFunction = isFunction;

	/* eslint-enable func-style */

	/* istanbul ignore next */
	var isArray = Array.isArray || function (value) {
	  return value && typeof value === 'object' ? toString.call(value) === '[object Array]' : false;
	};

	exports.isArray = isArray;
	// Older IE versions do not directly support indexOf so we must implement our own, sadly.

	function indexOf(array, value) {
	  for (var i = 0, len = array.length; i < len; i++) {
	    if (array[i] === value) {
	      return i;
	    }
	  }
	  return -1;
	}

	function escapeExpression(string) {
	  if (typeof string !== 'string') {
	    // don't escape SafeStrings, since they're already safe
	    if (string && string.toHTML) {
	      return string.toHTML();
	    } else if (string == null) {
	      return '';
	    } else if (!string) {
	      return string + '';
	    }

	    // Force a string conversion as this will be done by the append regardless and
	    // the regex test will do this transparently behind the scenes, causing issues if
	    // an object's to string has escaped characters in it.
	    string = '' + string;
	  }

	  if (!possible.test(string)) {
	    return string;
	  }
	  return string.replace(badChars, escapeChar);
	}

	function isEmpty(value) {
	  if (!value && value !== 0) {
	    return true;
	  } else if (isArray(value) && value.length === 0) {
	    return true;
	  } else {
	    return false;
	  }
	}

	function createFrame(object) {
	  var frame = extend({}, object);
	  frame._parent = object;
	  return frame;
	}

	function blockParams(params, ids) {
	  params.path = ids;
	  return params;
	}

	function appendContextPath(contextPath, id) {
	  return (contextPath ? contextPath + '.' : '') + id;
	}

/***/ }),
/* 6 */
/***/ (function(module, exports, __nested_webpack_require_13814__) {

	'use strict';

	var _Object$defineProperty = __nested_webpack_require_13814__(7)['default'];

	exports.__esModule = true;
	var errorProps = ['description', 'fileName', 'lineNumber', 'endLineNumber', 'message', 'name', 'number', 'stack'];

	function Exception(message, node) {
	  var loc = node && node.loc,
	      line = undefined,
	      endLineNumber = undefined,
	      column = undefined,
	      endColumn = undefined;

	  if (loc) {
	    line = loc.start.line;
	    endLineNumber = loc.end.line;
	    column = loc.start.column;
	    endColumn = loc.end.column;

	    message += ' - ' + line + ':' + column;
	  }

	  var tmp = Error.prototype.constructor.call(this, message);

	  // Unfortunately errors are not enumerable in Chrome (at least), so `for prop in tmp` doesn't work.
	  for (var idx = 0; idx < errorProps.length; idx++) {
	    this[errorProps[idx]] = tmp[errorProps[idx]];
	  }

	  /* istanbul ignore else */
	  if (Error.captureStackTrace) {
	    Error.captureStackTrace(this, Exception);
	  }

	  try {
	    if (loc) {
	      this.lineNumber = line;
	      this.endLineNumber = endLineNumber;

	      // Work around issue under safari where we can't directly set the column value
	      /* istanbul ignore next */
	      if (_Object$defineProperty) {
	        Object.defineProperty(this, 'column', {
	          value: column,
	          enumerable: true
	        });
	        Object.defineProperty(this, 'endColumn', {
	          value: endColumn,
	          enumerable: true
	        });
	      } else {
	        this.column = column;
	        this.endColumn = endColumn;
	      }
	    }
	  } catch (nop) {
	    /* Ignore if the browser is very particular */
	  }
	}

	Exception.prototype = new Error();

	exports['default'] = Exception;
	module.exports = exports['default'];

/***/ }),
/* 7 */
/***/ (function(module, exports, __nested_webpack_require_15674__) {

	module.exports = { "default": __nested_webpack_require_15674__(8), __esModule: true };

/***/ }),
/* 8 */
/***/ (function(module, exports, __nested_webpack_require_15825__) {

	var $ = __nested_webpack_require_15825__(9);
	module.exports = function defineProperty(it, key, desc){
	  return $.setDesc(it, key, desc);
	};

/***/ }),
/* 9 */
/***/ (function(module, exports) {

	var $Object = Object;
	module.exports = {
	  create:     $Object.create,
	  getProto:   $Object.getPrototypeOf,
	  isEnum:     {}.propertyIsEnumerable,
	  getDesc:    $Object.getOwnPropertyDescriptor,
	  setDesc:    $Object.defineProperty,
	  setDescs:   $Object.defineProperties,
	  getKeys:    $Object.keys,
	  getNames:   $Object.getOwnPropertyNames,
	  getSymbols: $Object.getOwnPropertySymbols,
	  each:       [].forEach
	};

/***/ }),
/* 10 */
/***/ (function(module, exports, __nested_webpack_require_16519__) {

	'use strict';

	var _interopRequireDefault = __nested_webpack_require_16519__(1)['default'];

	exports.__esModule = true;
	exports.registerDefaultHelpers = registerDefaultHelpers;
	exports.moveHelperToHooks = moveHelperToHooks;

	var _helpersBlockHelperMissing = __nested_webpack_require_16519__(11);

	var _helpersBlockHelperMissing2 = _interopRequireDefault(_helpersBlockHelperMissing);

	var _helpersEach = __nested_webpack_require_16519__(12);

	var _helpersEach2 = _interopRequireDefault(_helpersEach);

	var _helpersHelperMissing = __nested_webpack_require_16519__(65);

	var _helpersHelperMissing2 = _interopRequireDefault(_helpersHelperMissing);

	var _helpersIf = __nested_webpack_require_16519__(66);

	var _helpersIf2 = _interopRequireDefault(_helpersIf);

	var _helpersLog = __nested_webpack_require_16519__(67);

	var _helpersLog2 = _interopRequireDefault(_helpersLog);

	var _helpersLookup = __nested_webpack_require_16519__(68);

	var _helpersLookup2 = _interopRequireDefault(_helpersLookup);

	var _helpersWith = __nested_webpack_require_16519__(69);

	var _helpersWith2 = _interopRequireDefault(_helpersWith);

	function registerDefaultHelpers(instance) {
	  _helpersBlockHelperMissing2['default'](instance);
	  _helpersEach2['default'](instance);
	  _helpersHelperMissing2['default'](instance);
	  _helpersIf2['default'](instance);
	  _helpersLog2['default'](instance);
	  _helpersLookup2['default'](instance);
	  _helpersWith2['default'](instance);
	}

	function moveHelperToHooks(instance, helperName, keepHelper) {
	  if (instance.helpers[helperName]) {
	    instance.hooks[helperName] = instance.helpers[helperName];
	    if (!keepHelper) {
	      delete instance.helpers[helperName];
	    }
	  }
	}

/***/ }),
/* 11 */
/***/ (function(module, exports, __nested_webpack_require_18215__) {

	'use strict';

	exports.__esModule = true;

	var _utils = __nested_webpack_require_18215__(5);

	exports['default'] = function (instance) {
	  instance.registerHelper('blockHelperMissing', function (context, options) {
	    var inverse = options.inverse,
	        fn = options.fn;

	    if (context === true) {
	      return fn(this);
	    } else if (context === false || context == null) {
	      return inverse(this);
	    } else if (_utils.isArray(context)) {
	      if (context.length > 0) {
	        if (options.ids) {
	          options.ids = [options.name];
	        }

	        return instance.helpers.each(context, options);
	      } else {
	        return inverse(this);
	      }
	    } else {
	      if (options.data && options.ids) {
	        var data = _utils.createFrame(options.data);
	        data.contextPath = _utils.appendContextPath(options.data.contextPath, options.name);
	        options = { data: data };
	      }

	      return fn(context, options);
	    }
	  });
	};

	module.exports = exports['default'];

/***/ }),
/* 12 */
/***/ (function(module, exports, __nested_webpack_require_19312__) {

	'use strict';

	var _Symbol = __nested_webpack_require_19312__(13)['default'];

	var _Symbol$iterator = __nested_webpack_require_19312__(43)['default'];

	var _getIterator = __nested_webpack_require_19312__(55)['default'];

	var _Object$keys = __nested_webpack_require_19312__(60)['default'];

	var _interopRequireDefault = __nested_webpack_require_19312__(1)['default'];

	exports.__esModule = true;

	var _utils = __nested_webpack_require_19312__(5);

	var _exception = __nested_webpack_require_19312__(6);

	var _exception2 = _interopRequireDefault(_exception);

	exports['default'] = function (instance) {
	  instance.registerHelper('each', function (context, options) {
	    if (!options) {
	      throw new _exception2['default']('Must pass iterator to #each');
	    }

	    var fn = options.fn,
	        inverse = options.inverse,
	        i = 0,
	        ret = '',
	        data = undefined,
	        contextPath = undefined;

	    if (options.data && options.ids) {
	      contextPath = _utils.appendContextPath(options.data.contextPath, options.ids[0]) + '.';
	    }

	    if (_utils.isFunction(context)) {
	      context = context.call(this);
	    }

	    if (options.data) {
	      data = _utils.createFrame(options.data);
	    }

	    function execIteration(field, index, last) {
	      if (data) {
	        data.key = field;
	        data.index = index;
	        data.first = index === 0;
	        data.last = !!last;

	        if (contextPath) {
	          data.contextPath = contextPath + field;
	        }
	      }

	      ret = ret + fn(context[field], {
	        data: data,
	        blockParams: _utils.blockParams([context[field], field], [contextPath + field, null])
	      });
	    }

	    if (context && typeof context === 'object') {
	      if (_utils.isArray(context)) {
	        for (var j = context.length; i < j; i++) {
	          if (i in context) {
	            execIteration(i, i, i === context.length - 1);
	          }
	        }
	      } else if (typeof _Symbol === 'function' && context[_Symbol$iterator]) {
	        var newContext = [];
	        var iterator = _getIterator(context);
	        for (var it = iterator.next(); !it.done; it = iterator.next()) {
	          newContext.push(it.value);
	        }
	        context = newContext;
	        for (var j = context.length; i < j; i++) {
	          execIteration(i, i, i === context.length - 1);
	        }
	      } else {
	        (function () {
	          var priorKey = undefined;

	          _Object$keys(context).forEach(function (key) {
	            // We're running the iterations one step out of sync so we can detect
	            // the last iteration without have to scan the object twice and create
	            // an itermediate keys array.
	            if (priorKey !== undefined) {
	              execIteration(priorKey, i - 1);
	            }
	            priorKey = key;
	            i++;
	          });
	          if (priorKey !== undefined) {
	            execIteration(priorKey, i - 1, true);
	          }
	        })();
	      }
	    }

	    if (i === 0) {
	      ret = inverse(this);
	    }

	    return ret;
	  });
	};

	module.exports = exports['default'];

/***/ }),
/* 13 */
/***/ (function(module, exports, __nested_webpack_require_22468__) {

	module.exports = { "default": __nested_webpack_require_22468__(14), __esModule: true };

/***/ }),
/* 14 */
/***/ (function(module, exports, __nested_webpack_require_22621__) {

	__nested_webpack_require_22621__(15);
	__nested_webpack_require_22621__(42);
	module.exports = __nested_webpack_require_22621__(21).Symbol;

/***/ }),
/* 15 */
/***/ (function(module, exports, __nested_webpack_require_22800__) {

	'use strict';
	// ECMAScript 6 symbols shim
	var $              = __nested_webpack_require_22800__(9)
	  , global         = __nested_webpack_require_22800__(16)
	  , has            = __nested_webpack_require_22800__(17)
	  , DESCRIPTORS    = __nested_webpack_require_22800__(18)
	  , $export        = __nested_webpack_require_22800__(20)
	  , redefine       = __nested_webpack_require_22800__(24)
	  , $fails         = __nested_webpack_require_22800__(19)
	  , shared         = __nested_webpack_require_22800__(27)
	  , setToStringTag = __nested_webpack_require_22800__(28)
	  , uid            = __nested_webpack_require_22800__(30)
	  , wks            = __nested_webpack_require_22800__(29)
	  , keyOf          = __nested_webpack_require_22800__(31)
	  , $names         = __nested_webpack_require_22800__(36)
	  , enumKeys       = __nested_webpack_require_22800__(37)
	  , isArray        = __nested_webpack_require_22800__(38)
	  , anObject       = __nested_webpack_require_22800__(39)
	  , toIObject      = __nested_webpack_require_22800__(32)
	  , createDesc     = __nested_webpack_require_22800__(26)
	  , getDesc        = $.getDesc
	  , setDesc        = $.setDesc
	  , _create        = $.create
	  , getNames       = $names.get
	  , $Symbol        = global.Symbol
	  , $JSON          = global.JSON
	  , _stringify     = $JSON && $JSON.stringify
	  , setter         = false
	  , HIDDEN         = wks('_hidden')
	  , isEnum         = $.isEnum
	  , SymbolRegistry = shared('symbol-registry')
	  , AllSymbols     = shared('symbols')
	  , useNative      = typeof $Symbol == 'function'
	  , ObjectProto    = Object.prototype;

	// fallback for old Android, https://code.google.com/p/v8/issues/detail?id=687
	var setSymbolDesc = DESCRIPTORS && $fails(function(){
	  return _create(setDesc({}, 'a', {
	    get: function(){ return setDesc(this, 'a', {value: 7}).a; }
	  })).a != 7;
	}) ? function(it, key, D){
	  var protoDesc = getDesc(ObjectProto, key);
	  if(protoDesc)delete ObjectProto[key];
	  setDesc(it, key, D);
	  if(protoDesc && it !== ObjectProto)setDesc(ObjectProto, key, protoDesc);
	} : setDesc;

	var wrap = function(tag){
	  var sym = AllSymbols[tag] = _create($Symbol.prototype);
	  sym._k = tag;
	  DESCRIPTORS && setter && setSymbolDesc(ObjectProto, tag, {
	    configurable: true,
	    set: function(value){
	      if(has(this, HIDDEN) && has(this[HIDDEN], tag))this[HIDDEN][tag] = false;
	      setSymbolDesc(this, tag, createDesc(1, value));
	    }
	  });
	  return sym;
	};

	var isSymbol = function(it){
	  return typeof it == 'symbol';
	};

	var $defineProperty = function defineProperty(it, key, D){
	  if(D && has(AllSymbols, key)){
	    if(!D.enumerable){
	      if(!has(it, HIDDEN))setDesc(it, HIDDEN, createDesc(1, {}));
	      it[HIDDEN][key] = true;
	    } else {
	      if(has(it, HIDDEN) && it[HIDDEN][key])it[HIDDEN][key] = false;
	      D = _create(D, {enumerable: createDesc(0, false)});
	    } return setSymbolDesc(it, key, D);
	  } return setDesc(it, key, D);
	};
	var $defineProperties = function defineProperties(it, P){
	  anObject(it);
	  var keys = enumKeys(P = toIObject(P))
	    , i    = 0
	    , l = keys.length
	    , key;
	  while(l > i)$defineProperty(it, key = keys[i++], P[key]);
	  return it;
	};
	var $create = function create(it, P){
	  return P === undefined ? _create(it) : $defineProperties(_create(it), P);
	};
	var $propertyIsEnumerable = function propertyIsEnumerable(key){
	  var E = isEnum.call(this, key);
	  return E || !has(this, key) || !has(AllSymbols, key) || has(this, HIDDEN) && this[HIDDEN][key]
	    ? E : true;
	};
	var $getOwnPropertyDescriptor = function getOwnPropertyDescriptor(it, key){
	  var D = getDesc(it = toIObject(it), key);
	  if(D && has(AllSymbols, key) && !(has(it, HIDDEN) && it[HIDDEN][key]))D.enumerable = true;
	  return D;
	};
	var $getOwnPropertyNames = function getOwnPropertyNames(it){
	  var names  = getNames(toIObject(it))
	    , result = []
	    , i      = 0
	    , key;
	  while(names.length > i)if(!has(AllSymbols, key = names[i++]) && key != HIDDEN)result.push(key);
	  return result;
	};
	var $getOwnPropertySymbols = function getOwnPropertySymbols(it){
	  var names  = getNames(toIObject(it))
	    , result = []
	    , i      = 0
	    , key;
	  while(names.length > i)if(has(AllSymbols, key = names[i++]))result.push(AllSymbols[key]);
	  return result;
	};
	var $stringify = function stringify(it){
	  if(it === undefined || isSymbol(it))return; // IE8 returns string on undefined
	  var args = [it]
	    , i    = 1
	    , $$   = arguments
	    , replacer, $replacer;
	  while($$.length > i)args.push($$[i++]);
	  replacer = args[1];
	  if(typeof replacer == 'function')$replacer = replacer;
	  if($replacer || !isArray(replacer))replacer = function(key, value){
	    if($replacer)value = $replacer.call(this, key, value);
	    if(!isSymbol(value))return value;
	  };
	  args[1] = replacer;
	  return _stringify.apply($JSON, args);
	};
	var buggyJSON = $fails(function(){
	  var S = $Symbol();
	  // MS Edge converts symbol values to JSON as {}
	  // WebKit converts symbol values to JSON as null
	  // V8 throws on boxed symbols
	  return _stringify([S]) != '[null]' || _stringify({a: S}) != '{}' || _stringify(Object(S)) != '{}';
	});

	// 19.4.1.1 Symbol([description])
	if(!useNative){
	  $Symbol = function Symbol(){
	    if(isSymbol(this))throw TypeError('Symbol is not a constructor');
	    return wrap(uid(arguments.length > 0 ? arguments[0] : undefined));
	  };
	  redefine($Symbol.prototype, 'toString', function toString(){
	    return this._k;
	  });

	  isSymbol = function(it){
	    return it instanceof $Symbol;
	  };

	  $.create     = $create;
	  $.isEnum     = $propertyIsEnumerable;
	  $.getDesc    = $getOwnPropertyDescriptor;
	  $.setDesc    = $defineProperty;
	  $.setDescs   = $defineProperties;
	  $.getNames   = $names.get = $getOwnPropertyNames;
	  $.getSymbols = $getOwnPropertySymbols;

	  if(DESCRIPTORS && !__nested_webpack_require_22800__(41)){
	    redefine(ObjectProto, 'propertyIsEnumerable', $propertyIsEnumerable, true);
	  }
	}

	var symbolStatics = {
	  // 19.4.2.1 Symbol.for(key)
	  'for': function(key){
	    return has(SymbolRegistry, key += '')
	      ? SymbolRegistry[key]
	      : SymbolRegistry[key] = $Symbol(key);
	  },
	  // 19.4.2.5 Symbol.keyFor(sym)
	  keyFor: function keyFor(key){
	    return keyOf(SymbolRegistry, key);
	  },
	  useSetter: function(){ setter = true; },
	  useSimple: function(){ setter = false; }
	};
	// 19.4.2.2 Symbol.hasInstance
	// 19.4.2.3 Symbol.isConcatSpreadable
	// 19.4.2.4 Symbol.iterator
	// 19.4.2.6 Symbol.match
	// 19.4.2.8 Symbol.replace
	// 19.4.2.9 Symbol.search
	// 19.4.2.10 Symbol.species
	// 19.4.2.11 Symbol.split
	// 19.4.2.12 Symbol.toPrimitive
	// 19.4.2.13 Symbol.toStringTag
	// 19.4.2.14 Symbol.unscopables
	$.each.call((
	  'hasInstance,isConcatSpreadable,iterator,match,replace,search,' +
	  'species,split,toPrimitive,toStringTag,unscopables'
	).split(','), function(it){
	  var sym = wks(it);
	  symbolStatics[it] = useNative ? sym : wrap(sym);
	});

	setter = true;

	$export($export.G + $export.W, {Symbol: $Symbol});

	$export($export.S, 'Symbol', symbolStatics);

	$export($export.S + $export.F * !useNative, 'Object', {
	  // 19.1.2.2 Object.create(O [, Properties])
	  create: $create,
	  // 19.1.2.4 Object.defineProperty(O, P, Attributes)
	  defineProperty: $defineProperty,
	  // 19.1.2.3 Object.defineProperties(O, Properties)
	  defineProperties: $defineProperties,
	  // 19.1.2.6 Object.getOwnPropertyDescriptor(O, P)
	  getOwnPropertyDescriptor: $getOwnPropertyDescriptor,
	  // 19.1.2.7 Object.getOwnPropertyNames(O)
	  getOwnPropertyNames: $getOwnPropertyNames,
	  // 19.1.2.8 Object.getOwnPropertySymbols(O)
	  getOwnPropertySymbols: $getOwnPropertySymbols
	});

	// 24.3.2 JSON.stringify(value [, replacer [, space]])
	$JSON && $export($export.S + $export.F * (!useNative || buggyJSON), 'JSON', {stringify: $stringify});

	// 19.4.3.5 Symbol.prototype[@@toStringTag]
	setToStringTag($Symbol, 'Symbol');
	// 20.2.1.9 Math[@@toStringTag]
	setToStringTag(Math, 'Math', true);
	// 24.3.3 JSON[@@toStringTag]
	setToStringTag(global.JSON, 'JSON', true);

/***/ }),
/* 16 */
/***/ (function(module, exports) {

	// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
	var global = module.exports = typeof window != 'undefined' && window.Math == Math
	  ? window : typeof self != 'undefined' && self.Math == Math ? self : Function('return this')();
	if(typeof __g == 'number')__g = global; // eslint-disable-line no-undef

/***/ }),
/* 17 */
/***/ (function(module, exports) {

	var hasOwnProperty = {}.hasOwnProperty;
	module.exports = function(it, key){
	  return hasOwnProperty.call(it, key);
	};

/***/ }),
/* 18 */
/***/ (function(module, exports, __nested_webpack_require_31367__) {

	// Thank's IE8 for his funny defineProperty
	module.exports = !__nested_webpack_require_31367__(19)(function(){
	  return Object.defineProperty({}, 'a', {get: function(){ return 7; }}).a != 7;
	});

/***/ }),
/* 19 */
/***/ (function(module, exports) {

	module.exports = function(exec){
	  try {
	    return !!exec();
	  } catch(e){
	    return true;
	  }
	};

/***/ }),
/* 20 */
/***/ (function(module, exports, __nested_webpack_require_31793__) {

	var global    = __nested_webpack_require_31793__(16)
	  , core      = __nested_webpack_require_31793__(21)
	  , ctx       = __nested_webpack_require_31793__(22)
	  , PROTOTYPE = 'prototype';

	var $export = function(type, name, source){
	  var IS_FORCED = type & $export.F
	    , IS_GLOBAL = type & $export.G
	    , IS_STATIC = type & $export.S
	    , IS_PROTO  = type & $export.P
	    , IS_BIND   = type & $export.B
	    , IS_WRAP   = type & $export.W
	    , exports   = IS_GLOBAL ? core : core[name] || (core[name] = {})
	    , target    = IS_GLOBAL ? global : IS_STATIC ? global[name] : (global[name] || {})[PROTOTYPE]
	    , key, own, out;
	  if(IS_GLOBAL)source = name;
	  for(key in source){
	    // contains in native
	    own = !IS_FORCED && target && key in target;
	    if(own && key in exports)continue;
	    // export native or passed
	    out = own ? target[key] : source[key];
	    // prevent global pollution for namespaces
	    exports[key] = IS_GLOBAL && typeof target[key] != 'function' ? source[key]
	    // bind timers to global for call from export context
	    : IS_BIND && own ? ctx(out, global)
	    // wrap global constructors for prevent change them in library
	    : IS_WRAP && target[key] == out ? (function(C){
	      var F = function(param){
	        return this instanceof C ? new C(param) : C(param);
	      };
	      F[PROTOTYPE] = C[PROTOTYPE];
	      return F;
	    // make static versions for prototype methods
	    })(out) : IS_PROTO && typeof out == 'function' ? ctx(Function.call, out) : out;
	    if(IS_PROTO)(exports[PROTOTYPE] || (exports[PROTOTYPE] = {}))[key] = out;
	  }
	};
	// type bitmap
	$export.F = 1;  // forced
	$export.G = 2;  // global
	$export.S = 4;  // static
	$export.P = 8;  // proto
	$export.B = 16; // bind
	$export.W = 32; // wrap
	module.exports = $export;

/***/ }),
/* 21 */
/***/ (function(module, exports) {

	var core = module.exports = {version: '1.2.6'};
	if(typeof __e == 'number')__e = core; // eslint-disable-line no-undef

/***/ }),
/* 22 */
/***/ (function(module, exports, __nested_webpack_require_33828__) {

	// optional / simple context binding
	var aFunction = __nested_webpack_require_33828__(23);
	module.exports = function(fn, that, length){
	  aFunction(fn);
	  if(that === undefined)return fn;
	  switch(length){
	    case 1: return function(a){
	      return fn.call(that, a);
	    };
	    case 2: return function(a, b){
	      return fn.call(that, a, b);
	    };
	    case 3: return function(a, b, c){
	      return fn.call(that, a, b, c);
	    };
	  }
	  return function(/* ...args */){
	    return fn.apply(that, arguments);
	  };
	};

/***/ }),
/* 23 */
/***/ (function(module, exports) {

	module.exports = function(it){
	  if(typeof it != 'function')throw TypeError(it + ' is not a function!');
	  return it;
	};

/***/ }),
/* 24 */
/***/ (function(module, exports, __nested_webpack_require_34611__) {

	module.exports = __nested_webpack_require_34611__(25);

/***/ }),
/* 25 */
/***/ (function(module, exports, __nested_webpack_require_34731__) {

	var $          = __nested_webpack_require_34731__(9)
	  , createDesc = __nested_webpack_require_34731__(26);
	module.exports = __nested_webpack_require_34731__(18) ? function(object, key, value){
	  return $.setDesc(object, key, createDesc(1, value));
	} : function(object, key, value){
	  object[key] = value;
	  return object;
	};

/***/ }),
/* 26 */
/***/ (function(module, exports) {

	module.exports = function(bitmap, value){
	  return {
	    enumerable  : !(bitmap & 1),
	    configurable: !(bitmap & 2),
	    writable    : !(bitmap & 4),
	    value       : value
	  };
	};

/***/ }),
/* 27 */
/***/ (function(module, exports, __nested_webpack_require_35351__) {

	var global = __nested_webpack_require_35351__(16)
	  , SHARED = '__core-js_shared__'
	  , store  = global[SHARED] || (global[SHARED] = {});
	module.exports = function(key){
	  return store[key] || (store[key] = {});
	};

/***/ }),
/* 28 */
/***/ (function(module, exports, __nested_webpack_require_35636__) {

	var def = __nested_webpack_require_35636__(9).setDesc
	  , has = __nested_webpack_require_35636__(17)
	  , TAG = __nested_webpack_require_35636__(29)('toStringTag');

	module.exports = function(it, tag, stat){
	  if(it && !has(it = stat ? it : it.prototype, TAG))def(it, TAG, {configurable: true, value: tag});
	};

/***/ }),
/* 29 */
/***/ (function(module, exports, __nested_webpack_require_35990__) {

	var store  = __nested_webpack_require_35990__(27)('wks')
	  , uid    = __nested_webpack_require_35990__(30)
	  , Symbol = __nested_webpack_require_35990__(16).Symbol;
	module.exports = function(name){
	  return store[name] || (store[name] =
	    Symbol && Symbol[name] || (Symbol || uid)('Symbol.' + name));
	};

/***/ }),
/* 30 */
/***/ (function(module, exports) {

	var id = 0
	  , px = Math.random();
	module.exports = function(key){
	  return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
	};

/***/ }),
/* 31 */
/***/ (function(module, exports, __nested_webpack_require_36561__) {

	var $         = __nested_webpack_require_36561__(9)
	  , toIObject = __nested_webpack_require_36561__(32);
	module.exports = function(object, el){
	  var O      = toIObject(object)
	    , keys   = $.getKeys(O)
	    , length = keys.length
	    , index  = 0
	    , key;
	  while(length > index)if(O[key = keys[index++]] === el)return key;
	};

/***/ }),
/* 32 */
/***/ (function(module, exports, __nested_webpack_require_36954__) {

	// to indexed object, toObject with fallback for non-array-like ES3 strings
	var IObject = __nested_webpack_require_36954__(33)
	  , defined = __nested_webpack_require_36954__(35);
	module.exports = function(it){
	  return IObject(defined(it));
	};

/***/ }),
/* 33 */
/***/ (function(module, exports, __nested_webpack_require_37255__) {

	// fallback for non-array-like ES3 and non-enumerable old V8 strings
	var cof = __nested_webpack_require_37255__(34);
	module.exports = Object('z').propertyIsEnumerable(0) ? Object : function(it){
	  return cof(it) == 'String' ? it.split('') : Object(it);
	};

/***/ }),
/* 34 */
/***/ (function(module, exports) {

	var toString = {}.toString;

	module.exports = function(it){
	  return toString.call(it).slice(8, -1);
	};

/***/ }),
/* 35 */
/***/ (function(module, exports) {

	// 7.2.1 RequireObjectCoercible(argument)
	module.exports = function(it){
	  if(it == undefined)throw TypeError("Can't call method on  " + it);
	  return it;
	};

/***/ }),
/* 36 */
/***/ (function(module, exports, __nested_webpack_require_37963__) {

	// fallback for IE11 buggy Object.getOwnPropertyNames with iframe and window
	var toIObject = __nested_webpack_require_37963__(32)
	  , getNames  = __nested_webpack_require_37963__(9).getNames
	  , toString  = {}.toString;

	var windowNames = typeof window == 'object' && Object.getOwnPropertyNames
	  ? Object.getOwnPropertyNames(window) : [];

	var getWindowNames = function(it){
	  try {
	    return getNames(it);
	  } catch(e){
	    return windowNames.slice();
	  }
	};

	module.exports.get = function getOwnPropertyNames(it){
	  if(windowNames && toString.call(it) == '[object Window]')return getWindowNames(it);
	  return getNames(toIObject(it));
	};

/***/ }),
/* 37 */
/***/ (function(module, exports, __nested_webpack_require_38672__) {

	// all enumerable object keys, includes symbols
	var $ = __nested_webpack_require_38672__(9);
	module.exports = function(it){
	  var keys       = $.getKeys(it)
	    , getSymbols = $.getSymbols;
	  if(getSymbols){
	    var symbols = getSymbols(it)
	      , isEnum  = $.isEnum
	      , i       = 0
	      , key;
	    while(symbols.length > i)if(isEnum.call(it, key = symbols[i++]))keys.push(key);
	  }
	  return keys;
	};

/***/ }),
/* 38 */
/***/ (function(module, exports, __nested_webpack_require_39157__) {

	// 7.2.2 IsArray(argument)
	var cof = __nested_webpack_require_39157__(34);
	module.exports = Array.isArray || function(arg){
	  return cof(arg) == 'Array';
	};

/***/ }),
/* 39 */
/***/ (function(module, exports, __nested_webpack_require_39383__) {

	var isObject = __nested_webpack_require_39383__(40);
	module.exports = function(it){
	  if(!isObject(it))throw TypeError(it + ' is not an object!');
	  return it;
	};

/***/ }),
/* 40 */
/***/ (function(module, exports) {

	module.exports = function(it){
	  return typeof it === 'object' ? it !== null : typeof it === 'function';
	};

/***/ }),
/* 41 */
/***/ (function(module, exports) {

	module.exports = true;

/***/ }),
/* 42 */
/***/ (function(module, exports) {

	

/***/ }),
/* 43 */
/***/ (function(module, exports, __nested_webpack_require_39920__) {

	module.exports = { "default": __nested_webpack_require_39920__(44), __esModule: true };

/***/ }),
/* 44 */
/***/ (function(module, exports, __nested_webpack_require_40073__) {

	__nested_webpack_require_40073__(45);
	__nested_webpack_require_40073__(51);
	module.exports = __nested_webpack_require_40073__(29)('iterator');

/***/ }),
/* 45 */
/***/ (function(module, exports, __nested_webpack_require_40257__) {

	'use strict';
	var $at  = __nested_webpack_require_40257__(46)(true);

	// 21.1.3.27 String.prototype[@@iterator]()
	__nested_webpack_require_40257__(48)(String, 'String', function(iterated){
	  this._t = String(iterated); // target
	  this._i = 0;                // next index
	// 21.1.5.2.1 %StringIteratorPrototype%.next()
	}, function(){
	  var O     = this._t
	    , index = this._i
	    , point;
	  if(index >= O.length)return {value: undefined, done: true};
	  point = $at(O, index);
	  this._i += point.length;
	  return {value: point, done: false};
	});

/***/ }),
/* 46 */
/***/ (function(module, exports, __nested_webpack_require_40872__) {

	var toInteger = __nested_webpack_require_40872__(47)
	  , defined   = __nested_webpack_require_40872__(35);
	// true  -> String#at
	// false -> String#codePointAt
	module.exports = function(TO_STRING){
	  return function(that, pos){
	    var s = String(defined(that))
	      , i = toInteger(pos)
	      , l = s.length
	      , a, b;
	    if(i < 0 || i >= l)return TO_STRING ? '' : undefined;
	    a = s.charCodeAt(i);
	    return a < 0xd800 || a > 0xdbff || i + 1 === l || (b = s.charCodeAt(i + 1)) < 0xdc00 || b > 0xdfff
	      ? TO_STRING ? s.charAt(i) : a
	      : TO_STRING ? s.slice(i, i + 2) : (a - 0xd800 << 10) + (b - 0xdc00) + 0x10000;
	  };
	};

/***/ }),
/* 47 */
/***/ (function(module, exports) {

	// 7.1.4 ToInteger
	var ceil  = Math.ceil
	  , floor = Math.floor;
	module.exports = function(it){
	  return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
	};

/***/ }),
/* 48 */
/***/ (function(module, exports, __nested_webpack_require_41800__) {

	'use strict';
	var LIBRARY        = __nested_webpack_require_41800__(41)
	  , $export        = __nested_webpack_require_41800__(20)
	  , redefine       = __nested_webpack_require_41800__(24)
	  , hide           = __nested_webpack_require_41800__(25)
	  , has            = __nested_webpack_require_41800__(17)
	  , Iterators      = __nested_webpack_require_41800__(49)
	  , $iterCreate    = __nested_webpack_require_41800__(50)
	  , setToStringTag = __nested_webpack_require_41800__(28)
	  , getProto       = __nested_webpack_require_41800__(9).getProto
	  , ITERATOR       = __nested_webpack_require_41800__(29)('iterator')
	  , BUGGY          = !([].keys && 'next' in [].keys()) // Safari has buggy iterators w/o `next`
	  , FF_ITERATOR    = '@@iterator'
	  , KEYS           = 'keys'
	  , VALUES         = 'values';

	var returnThis = function(){ return this; };

	module.exports = function(Base, NAME, Constructor, next, DEFAULT, IS_SET, FORCED){
	  $iterCreate(Constructor, NAME, next);
	  var getMethod = function(kind){
	    if(!BUGGY && kind in proto)return proto[kind];
	    switch(kind){
	      case KEYS: return function keys(){ return new Constructor(this, kind); };
	      case VALUES: return function values(){ return new Constructor(this, kind); };
	    } return function entries(){ return new Constructor(this, kind); };
	  };
	  var TAG        = NAME + ' Iterator'
	    , DEF_VALUES = DEFAULT == VALUES
	    , VALUES_BUG = false
	    , proto      = Base.prototype
	    , $native    = proto[ITERATOR] || proto[FF_ITERATOR] || DEFAULT && proto[DEFAULT]
	    , $default   = $native || getMethod(DEFAULT)
	    , methods, key;
	  // Fix native
	  if($native){
	    var IteratorPrototype = getProto($default.call(new Base));
	    // Set @@toStringTag to native iterators
	    setToStringTag(IteratorPrototype, TAG, true);
	    // FF fix
	    if(!LIBRARY && has(proto, FF_ITERATOR))hide(IteratorPrototype, ITERATOR, returnThis);
	    // fix Array#{values, @@iterator}.name in V8 / FF
	    if(DEF_VALUES && $native.name !== VALUES){
	      VALUES_BUG = true;
	      $default = function values(){ return $native.call(this); };
	    }
	  }
	  // Define iterator
	  if((!LIBRARY || FORCED) && (BUGGY || VALUES_BUG || !proto[ITERATOR])){
	    hide(proto, ITERATOR, $default);
	  }
	  // Plug for library
	  Iterators[NAME] = $default;
	  Iterators[TAG]  = returnThis;
	  if(DEFAULT){
	    methods = {
	      values:  DEF_VALUES  ? $default : getMethod(VALUES),
	      keys:    IS_SET      ? $default : getMethod(KEYS),
	      entries: !DEF_VALUES ? $default : getMethod('entries')
	    };
	    if(FORCED)for(key in methods){
	      if(!(key in proto))redefine(proto, key, methods[key]);
	    } else $export($export.P + $export.F * (BUGGY || VALUES_BUG), NAME, methods);
	  }
	  return methods;
	};

/***/ }),
/* 49 */
/***/ (function(module, exports) {

	module.exports = {};

/***/ }),
/* 50 */
/***/ (function(module, exports, __nested_webpack_require_44627__) {

	'use strict';
	var $              = __nested_webpack_require_44627__(9)
	  , descriptor     = __nested_webpack_require_44627__(26)
	  , setToStringTag = __nested_webpack_require_44627__(28)
	  , IteratorPrototype = {};

	// 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
	__nested_webpack_require_44627__(25)(IteratorPrototype, __nested_webpack_require_44627__(29)('iterator'), function(){ return this; });

	module.exports = function(Constructor, NAME, next){
	  Constructor.prototype = $.create(IteratorPrototype, {next: descriptor(1, next)});
	  setToStringTag(Constructor, NAME + ' Iterator');
	};

/***/ }),
/* 51 */
/***/ (function(module, exports, __nested_webpack_require_45240__) {

	__nested_webpack_require_45240__(52);
	var Iterators = __nested_webpack_require_45240__(49);
	Iterators.NodeList = Iterators.HTMLCollection = Iterators.Array;

/***/ }),
/* 52 */
/***/ (function(module, exports, __nested_webpack_require_45451__) {

	'use strict';
	var addToUnscopables = __nested_webpack_require_45451__(53)
	  , step             = __nested_webpack_require_45451__(54)
	  , Iterators        = __nested_webpack_require_45451__(49)
	  , toIObject        = __nested_webpack_require_45451__(32);

	// 22.1.3.4 Array.prototype.entries()
	// 22.1.3.13 Array.prototype.keys()
	// 22.1.3.29 Array.prototype.values()
	// 22.1.3.30 Array.prototype[@@iterator]()
	module.exports = __nested_webpack_require_45451__(48)(Array, 'Array', function(iterated, kind){
	  this._t = toIObject(iterated); // target
	  this._i = 0;                   // next index
	  this._k = kind;                // kind
	// 22.1.5.2.1 %ArrayIteratorPrototype%.next()
	}, function(){
	  var O     = this._t
	    , kind  = this._k
	    , index = this._i++;
	  if(!O || index >= O.length){
	    this._t = undefined;
	    return step(1);
	  }
	  if(kind == 'keys'  )return step(0, index);
	  if(kind == 'values')return step(0, O[index]);
	  return step(0, [index, O[index]]);
	}, 'values');

	// argumentsList[@@iterator] is %ArrayProto_values% (9.4.4.6, 9.4.4.7)
	Iterators.Arguments = Iterators.Array;

	addToUnscopables('keys');
	addToUnscopables('values');
	addToUnscopables('entries');

/***/ }),
/* 53 */
/***/ (function(module, exports) {

	module.exports = function(){ /* empty */ };

/***/ }),
/* 54 */
/***/ (function(module, exports) {

	module.exports = function(done, value){
	  return {value: value, done: !!done};
	};

/***/ }),
/* 55 */
/***/ (function(module, exports, __nested_webpack_require_46923__) {

	module.exports = { "default": __nested_webpack_require_46923__(56), __esModule: true };

/***/ }),
/* 56 */
/***/ (function(module, exports, __nested_webpack_require_47076__) {

	__nested_webpack_require_47076__(51);
	__nested_webpack_require_47076__(45);
	module.exports = __nested_webpack_require_47076__(57);

/***/ }),
/* 57 */
/***/ (function(module, exports, __nested_webpack_require_47248__) {

	var anObject = __nested_webpack_require_47248__(39)
	  , get      = __nested_webpack_require_47248__(58);
	module.exports = __nested_webpack_require_47248__(21).getIterator = function(it){
	  var iterFn = get(it);
	  if(typeof iterFn != 'function')throw TypeError(it + ' is not iterable!');
	  return anObject(iterFn.call(it));
	};

/***/ }),
/* 58 */
/***/ (function(module, exports, __nested_webpack_require_47619__) {

	var classof   = __nested_webpack_require_47619__(59)
	  , ITERATOR  = __nested_webpack_require_47619__(29)('iterator')
	  , Iterators = __nested_webpack_require_47619__(49);
	module.exports = __nested_webpack_require_47619__(21).getIteratorMethod = function(it){
	  if(it != undefined)return it[ITERATOR]
	    || it['@@iterator']
	    || Iterators[classof(it)];
	};

/***/ }),
/* 59 */
/***/ (function(module, exports, __nested_webpack_require_48011__) {

	// getting tag from 19.1.3.6 Object.prototype.toString()
	var cof = __nested_webpack_require_48011__(34)
	  , TAG = __nested_webpack_require_48011__(29)('toStringTag')
	  // ES3 wrong here
	  , ARG = cof(function(){ return arguments; }()) == 'Arguments';

	module.exports = function(it){
	  var O, T, B;
	  return it === undefined ? 'Undefined' : it === null ? 'Null'
	    // @@toStringTag case
	    : typeof (T = (O = Object(it))[TAG]) == 'string' ? T
	    // builtinTag case
	    : ARG ? cof(O)
	    // ES3 arguments fallback
	    : (B = cof(O)) == 'Object' && typeof O.callee == 'function' ? 'Arguments' : B;
	};

/***/ }),
/* 60 */
/***/ (function(module, exports, __nested_webpack_require_48679__) {

	module.exports = { "default": __nested_webpack_require_48679__(61), __esModule: true };

/***/ }),
/* 61 */
/***/ (function(module, exports, __nested_webpack_require_48832__) {

	__nested_webpack_require_48832__(62);
	module.exports = __nested_webpack_require_48832__(21).Object.keys;

/***/ }),
/* 62 */
/***/ (function(module, exports, __nested_webpack_require_48990__) {

	// 19.1.2.14 Object.keys(O)
	var toObject = __nested_webpack_require_48990__(63);

	__nested_webpack_require_48990__(64)('keys', function($keys){
	  return function keys(it){
	    return $keys(toObject(it));
	  };
	});

/***/ }),
/* 63 */
/***/ (function(module, exports, __nested_webpack_require_49261__) {

	// 7.1.13 ToObject(argument)
	var defined = __nested_webpack_require_49261__(35);
	module.exports = function(it){
	  return Object(defined(it));
	};

/***/ }),
/* 64 */
/***/ (function(module, exports, __nested_webpack_require_49475__) {

	// most Object methods by ES6 should accept primitives
	var $export = __nested_webpack_require_49475__(20)
	  , core    = __nested_webpack_require_49475__(21)
	  , fails   = __nested_webpack_require_49475__(19);
	module.exports = function(KEY, exec){
	  var fn  = (core.Object || {})[KEY] || Object[KEY]
	    , exp = {};
	  exp[KEY] = exec(fn);
	  $export($export.S + $export.F * fails(function(){ fn(1); }), 'Object', exp);
	};

/***/ }),
/* 65 */
/***/ (function(module, exports, __nested_webpack_require_49943__) {

	'use strict';

	var _interopRequireDefault = __nested_webpack_require_49943__(1)['default'];

	exports.__esModule = true;

	var _exception = __nested_webpack_require_49943__(6);

	var _exception2 = _interopRequireDefault(_exception);

	exports['default'] = function (instance) {
	  instance.registerHelper('helperMissing', function () /* [args, ]options */{
	    if (arguments.length === 1) {
	      // A missing field in a {{foo}} construct.
	      return undefined;
	    } else {
	      // Someone is actually trying to call something, blow up.
	      throw new _exception2['default']('Missing helper: "' + arguments[arguments.length - 1].name + '"');
	    }
	  });
	};

	module.exports = exports['default'];

/***/ }),
/* 66 */
/***/ (function(module, exports, __nested_webpack_require_50706__) {

	'use strict';

	var _interopRequireDefault = __nested_webpack_require_50706__(1)['default'];

	exports.__esModule = true;

	var _utils = __nested_webpack_require_50706__(5);

	var _exception = __nested_webpack_require_50706__(6);

	var _exception2 = _interopRequireDefault(_exception);

	exports['default'] = function (instance) {
	  instance.registerHelper('if', function (conditional, options) {
	    if (arguments.length != 2) {
	      throw new _exception2['default']('#if requires exactly one argument');
	    }
	    if (_utils.isFunction(conditional)) {
	      conditional = conditional.call(this);
	    }

	    // Default behavior is to render the positive path if the value is truthy and not empty.
	    // The `includeZero` option may be set to treat the condtional as purely not empty based on the
	    // behavior of isEmpty. Effectively this determines if 0 is handled by the positive path or negative.
	    if (!options.hash.includeZero && !conditional || _utils.isEmpty(conditional)) {
	      return options.inverse(this);
	    } else {
	      return options.fn(this);
	    }
	  });

	  instance.registerHelper('unless', function (conditional, options) {
	    if (arguments.length != 2) {
	      throw new _exception2['default']('#unless requires exactly one argument');
	    }
	    return instance.helpers['if'].call(this, conditional, {
	      fn: options.inverse,
	      inverse: options.fn,
	      hash: options.hash
	    });
	  });
	};

	module.exports = exports['default'];

/***/ }),
/* 67 */
/***/ (function(module, exports) {

	'use strict';

	exports.__esModule = true;

	exports['default'] = function (instance) {
	  instance.registerHelper('log', function () /* message, options */{
	    var args = [undefined],
	        options = arguments[arguments.length - 1];
	    for (var i = 0; i < arguments.length - 1; i++) {
	      args.push(arguments[i]);
	    }

	    var level = 1;
	    if (options.hash.level != null) {
	      level = options.hash.level;
	    } else if (options.data && options.data.level != null) {
	      level = options.data.level;
	    }
	    args[0] = level;

	    instance.log.apply(instance, args);
	  });
	};

	module.exports = exports['default'];

/***/ }),
/* 68 */
/***/ (function(module, exports) {

	'use strict';

	exports.__esModule = true;

	exports['default'] = function (instance) {
	  instance.registerHelper('lookup', function (obj, field, options) {
	    if (!obj) {
	      // Note for 5.0: Change to "obj == null" in 5.0
	      return obj;
	    }
	    return options.lookupProperty(obj, field);
	  });
	};

	module.exports = exports['default'];

/***/ }),
/* 69 */
/***/ (function(module, exports, __nested_webpack_require_53352__) {

	'use strict';

	var _interopRequireDefault = __nested_webpack_require_53352__(1)['default'];

	exports.__esModule = true;

	var _utils = __nested_webpack_require_53352__(5);

	var _exception = __nested_webpack_require_53352__(6);

	var _exception2 = _interopRequireDefault(_exception);

	exports['default'] = function (instance) {
	  instance.registerHelper('with', function (context, options) {
	    if (arguments.length != 2) {
	      throw new _exception2['default']('#with requires exactly one argument');
	    }
	    if (_utils.isFunction(context)) {
	      context = context.call(this);
	    }

	    var fn = options.fn;

	    if (!_utils.isEmpty(context)) {
	      var data = options.data;
	      if (options.data && options.ids) {
	        data = _utils.createFrame(options.data);
	        data.contextPath = _utils.appendContextPath(options.data.contextPath, options.ids[0]);
	      }

	      return fn(context, {
	        data: data,
	        blockParams: _utils.blockParams([context], [data && data.contextPath])
	      });
	    } else {
	      return options.inverse(this);
	    }
	  });
	};

	module.exports = exports['default'];

/***/ }),
/* 70 */
/***/ (function(module, exports, __nested_webpack_require_54534__) {

	'use strict';

	var _interopRequireDefault = __nested_webpack_require_54534__(1)['default'];

	exports.__esModule = true;
	exports.registerDefaultDecorators = registerDefaultDecorators;

	var _decoratorsInline = __nested_webpack_require_54534__(71);

	var _decoratorsInline2 = _interopRequireDefault(_decoratorsInline);

	function registerDefaultDecorators(instance) {
	  _decoratorsInline2['default'](instance);
	}

/***/ }),
/* 71 */
/***/ (function(module, exports, __nested_webpack_require_55002__) {

	'use strict';

	exports.__esModule = true;

	var _utils = __nested_webpack_require_55002__(5);

	exports['default'] = function (instance) {
	  instance.registerDecorator('inline', function (fn, props, container, options) {
	    var ret = fn;
	    if (!props.partials) {
	      props.partials = {};
	      ret = function (context, options) {
	        // Create a new partials stack frame prior to exec.
	        var original = container.partials;
	        container.partials = _utils.extend({}, original, props.partials);
	        var ret = fn(context, options);
	        container.partials = original;
	        return ret;
	      };
	    }

	    props.partials[options.args[0]] = options.fn;

	    return ret;
	  });
	};

	module.exports = exports['default'];

/***/ }),
/* 72 */
/***/ (function(module, exports, __nested_webpack_require_55827__) {

	'use strict';

	exports.__esModule = true;

	var _utils = __nested_webpack_require_55827__(5);

	var logger = {
	  methodMap: ['debug', 'info', 'warn', 'error'],
	  level: 'info',

	  // Maps a given level value to the `methodMap` indexes above.
	  lookupLevel: function lookupLevel(level) {
	    if (typeof level === 'string') {
	      var levelMap = _utils.indexOf(logger.methodMap, level.toLowerCase());
	      if (levelMap >= 0) {
	        level = levelMap;
	      } else {
	        level = parseInt(level, 10);
	      }
	    }

	    return level;
	  },

	  // Can be overridden in the host environment
	  log: function log(level) {
	    level = logger.lookupLevel(level);

	    if (typeof console !== 'undefined' && logger.lookupLevel(logger.level) <= level) {
	      var method = logger.methodMap[level];
	      // eslint-disable-next-line no-console
	      if (!console[method]) {
	        method = 'log';
	      }

	      for (var _len = arguments.length, message = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
	        message[_key - 1] = arguments[_key];
	      }

	      console[method].apply(console, message); // eslint-disable-line no-console
	    }
	  }
	};

	exports['default'] = logger;
	module.exports = exports['default'];

/***/ }),
/* 73 */
/***/ (function(module, exports, __nested_webpack_require_57154__) {

	'use strict';

	var _Object$create = __nested_webpack_require_57154__(74)['default'];

	var _Object$keys = __nested_webpack_require_57154__(60)['default'];

	var _interopRequireDefault = __nested_webpack_require_57154__(1)['default'];

	exports.__esModule = true;
	exports.createProtoAccessControl = createProtoAccessControl;
	exports.resultIsAllowed = resultIsAllowed;
	exports.resetLoggedProperties = resetLoggedProperties;

	var _createNewLookupObject = __nested_webpack_require_57154__(76);

	var _logger = __nested_webpack_require_57154__(72);

	var _logger2 = _interopRequireDefault(_logger);

	var loggedProperties = _Object$create(null);

	function createProtoAccessControl(runtimeOptions) {
	  var defaultMethodWhiteList = _Object$create(null);
	  defaultMethodWhiteList['constructor'] = false;
	  defaultMethodWhiteList['__defineGetter__'] = false;
	  defaultMethodWhiteList['__defineSetter__'] = false;
	  defaultMethodWhiteList['__lookupGetter__'] = false;

	  var defaultPropertyWhiteList = _Object$create(null);
	  // eslint-disable-next-line no-proto
	  defaultPropertyWhiteList['__proto__'] = false;

	  return {
	    properties: {
	      whitelist: _createNewLookupObject.createNewLookupObject(defaultPropertyWhiteList, runtimeOptions.allowedProtoProperties),
	      defaultValue: runtimeOptions.allowProtoPropertiesByDefault
	    },
	    methods: {
	      whitelist: _createNewLookupObject.createNewLookupObject(defaultMethodWhiteList, runtimeOptions.allowedProtoMethods),
	      defaultValue: runtimeOptions.allowProtoMethodsByDefault
	    }
	  };
	}

	function resultIsAllowed(result, protoAccessControl, propertyName) {
	  if (typeof result === 'function') {
	    return checkWhiteList(protoAccessControl.methods, propertyName);
	  } else {
	    return checkWhiteList(protoAccessControl.properties, propertyName);
	  }
	}

	function checkWhiteList(protoAccessControlForType, propertyName) {
	  if (protoAccessControlForType.whitelist[propertyName] !== undefined) {
	    return protoAccessControlForType.whitelist[propertyName] === true;
	  }
	  if (protoAccessControlForType.defaultValue !== undefined) {
	    return protoAccessControlForType.defaultValue;
	  }
	  logUnexpecedPropertyAccessOnce(propertyName);
	  return false;
	}

	function logUnexpecedPropertyAccessOnce(propertyName) {
	  if (loggedProperties[propertyName] !== true) {
	    loggedProperties[propertyName] = true;
	    _logger2['default'].log('error', 'Handlebars: Access has been denied to resolve the property "' + propertyName + '" because it is not an "own property" of its parent.\n' + 'You can add a runtime option to disable the check or this warning:\n' + 'See https://handlebarsjs.com/api-reference/runtime-options.html#options-to-control-prototype-access for details');
	  }
	}

	function resetLoggedProperties() {
	  _Object$keys(loggedProperties).forEach(function (propertyName) {
	    delete loggedProperties[propertyName];
	  });
	}

/***/ }),
/* 74 */
/***/ (function(module, exports, __nested_webpack_require_60104__) {

	module.exports = { "default": __nested_webpack_require_60104__(75), __esModule: true };

/***/ }),
/* 75 */
/***/ (function(module, exports, __nested_webpack_require_60257__) {

	var $ = __nested_webpack_require_60257__(9);
	module.exports = function create(P, D){
	  return $.create(P, D);
	};

/***/ }),
/* 76 */
/***/ (function(module, exports, __nested_webpack_require_60438__) {

	'use strict';

	var _Object$create = __nested_webpack_require_60438__(74)['default'];

	exports.__esModule = true;
	exports.createNewLookupObject = createNewLookupObject;

	var _utils = __nested_webpack_require_60438__(5);

	/**
	 * Create a new object with "null"-prototype to avoid truthy results on prototype properties.
	 * The resulting object can be used with "object[property]" to check if a property exists
	 * @param {...object} sources a varargs parameter of source objects that will be merged
	 * @returns {object}
	 */

	function createNewLookupObject() {
	  for (var _len = arguments.length, sources = Array(_len), _key = 0; _key < _len; _key++) {
	    sources[_key] = arguments[_key];
	  }

	  return _utils.extend.apply(undefined, [_Object$create(null)].concat(sources));
	}

/***/ }),
/* 77 */
/***/ (function(module, exports) {

	// Build out our basic SafeString type
	'use strict';

	exports.__esModule = true;
	function SafeString(string) {
	  this.string = string;
	}

	SafeString.prototype.toString = SafeString.prototype.toHTML = function () {
	  return '' + this.string;
	};

	exports['default'] = SafeString;
	module.exports = exports['default'];

/***/ }),
/* 78 */
/***/ (function(module, exports, __nested_webpack_require_61662__) {

	'use strict';

	var _Object$seal = __nested_webpack_require_61662__(79)['default'];

	var _Object$keys = __nested_webpack_require_61662__(60)['default'];

	var _interopRequireWildcard = __nested_webpack_require_61662__(3)['default'];

	var _interopRequireDefault = __nested_webpack_require_61662__(1)['default'];

	exports.__esModule = true;
	exports.checkRevision = checkRevision;
	exports.template = template;
	exports.wrapProgram = wrapProgram;
	exports.resolvePartial = resolvePartial;
	exports.invokePartial = invokePartial;
	exports.noop = noop;

	var _utils = __nested_webpack_require_61662__(5);

	var Utils = _interopRequireWildcard(_utils);

	var _exception = __nested_webpack_require_61662__(6);

	var _exception2 = _interopRequireDefault(_exception);

	var _base = __nested_webpack_require_61662__(4);

	var _helpers = __nested_webpack_require_61662__(10);

	var _internalWrapHelper = __nested_webpack_require_61662__(82);

	var _internalProtoAccess = __nested_webpack_require_61662__(73);

	function checkRevision(compilerInfo) {
	  var compilerRevision = compilerInfo && compilerInfo[0] || 1,
	      currentRevision = _base.COMPILER_REVISION;

	  if (compilerRevision >= _base.LAST_COMPATIBLE_COMPILER_REVISION && compilerRevision <= _base.COMPILER_REVISION) {
	    return;
	  }

	  if (compilerRevision < _base.LAST_COMPATIBLE_COMPILER_REVISION) {
	    var runtimeVersions = _base.REVISION_CHANGES[currentRevision],
	        compilerVersions = _base.REVISION_CHANGES[compilerRevision];
	    throw new _exception2['default']('Template was precompiled with an older version of Handlebars than the current runtime. ' + 'Please update your precompiler to a newer version (' + runtimeVersions + ') or downgrade your runtime to an older version (' + compilerVersions + ').');
	  } else {
	    // Use the embedded version info since the runtime doesn't know about this revision yet
	    throw new _exception2['default']('Template was precompiled with a newer version of Handlebars than the current runtime. ' + 'Please update your runtime to a newer version (' + compilerInfo[1] + ').');
	  }
	}

	function template(templateSpec, env) {
	  /* istanbul ignore next */
	  if (!env) {
	    throw new _exception2['default']('No environment passed to template');
	  }
	  if (!templateSpec || !templateSpec.main) {
	    throw new _exception2['default']('Unknown template object: ' + typeof templateSpec);
	  }

	  templateSpec.main.decorator = templateSpec.main_d;

	  // Note: Using env.VM references rather than local var references throughout this section to allow
	  // for external users to override these as pseudo-supported APIs.
	  env.VM.checkRevision(templateSpec.compiler);

	  // backwards compatibility for precompiled templates with compiler-version 7 (<4.3.0)
	  var templateWasPrecompiledWithCompilerV7 = templateSpec.compiler && templateSpec.compiler[0] === 7;

	  function invokePartialWrapper(partial, context, options) {
	    if (options.hash) {
	      context = Utils.extend({}, context, options.hash);
	      if (options.ids) {
	        options.ids[0] = true;
	      }
	    }
	    partial = env.VM.resolvePartial.call(this, partial, context, options);

	    var extendedOptions = Utils.extend({}, options, {
	      hooks: this.hooks,
	      protoAccessControl: this.protoAccessControl
	    });

	    var result = env.VM.invokePartial.call(this, partial, context, extendedOptions);

	    if (result == null && env.compile) {
	      options.partials[options.name] = env.compile(partial, templateSpec.compilerOptions, env);
	      result = options.partials[options.name](context, extendedOptions);
	    }
	    if (result != null) {
	      if (options.indent) {
	        var lines = result.split('\n');
	        for (var i = 0, l = lines.length; i < l; i++) {
	          if (!lines[i] && i + 1 === l) {
	            break;
	          }

	          lines[i] = options.indent + lines[i];
	        }
	        result = lines.join('\n');
	      }
	      return result;
	    } else {
	      throw new _exception2['default']('The partial ' + options.name + ' could not be compiled when running in runtime-only mode');
	    }
	  }

	  // Just add water
	  var container = {
	    strict: function strict(obj, name, loc) {
	      if (!obj || !(name in obj)) {
	        throw new _exception2['default']('"' + name + '" not defined in ' + obj, {
	          loc: loc
	        });
	      }
	      return container.lookupProperty(obj, name);
	    },
	    lookupProperty: function lookupProperty(parent, propertyName) {
	      var result = parent[propertyName];
	      if (result == null) {
	        return result;
	      }
	      if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
	        return result;
	      }

	      if (_internalProtoAccess.resultIsAllowed(result, container.protoAccessControl, propertyName)) {
	        return result;
	      }
	      return undefined;
	    },
	    lookup: function lookup(depths, name) {
	      var len = depths.length;
	      for (var i = 0; i < len; i++) {
	        var result = depths[i] && container.lookupProperty(depths[i], name);
	        if (result != null) {
	          return depths[i][name];
	        }
	      }
	    },
	    lambda: function lambda(current, context) {
	      return typeof current === 'function' ? current.call(context) : current;
	    },

	    escapeExpression: Utils.escapeExpression,
	    invokePartial: invokePartialWrapper,

	    fn: function fn(i) {
	      var ret = templateSpec[i];
	      ret.decorator = templateSpec[i + '_d'];
	      return ret;
	    },

	    programs: [],
	    program: function program(i, data, declaredBlockParams, blockParams, depths) {
	      var programWrapper = this.programs[i],
	          fn = this.fn(i);
	      if (data || depths || blockParams || declaredBlockParams) {
	        programWrapper = wrapProgram(this, i, fn, data, declaredBlockParams, blockParams, depths);
	      } else if (!programWrapper) {
	        programWrapper = this.programs[i] = wrapProgram(this, i, fn);
	      }
	      return programWrapper;
	    },

	    data: function data(value, depth) {
	      while (value && depth--) {
	        value = value._parent;
	      }
	      return value;
	    },
	    mergeIfNeeded: function mergeIfNeeded(param, common) {
	      var obj = param || common;

	      if (param && common && param !== common) {
	        obj = Utils.extend({}, common, param);
	      }

	      return obj;
	    },
	    // An empty object to use as replacement for null-contexts
	    nullContext: _Object$seal({}),

	    noop: env.VM.noop,
	    compilerInfo: templateSpec.compiler
	  };

	  function ret(context) {
	    var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

	    var data = options.data;

	    ret._setup(options);
	    if (!options.partial && templateSpec.useData) {
	      data = initData(context, data);
	    }
	    var depths = undefined,
	        blockParams = templateSpec.useBlockParams ? [] : undefined;
	    if (templateSpec.useDepths) {
	      if (options.depths) {
	        depths = context != options.depths[0] ? [context].concat(options.depths) : options.depths;
	      } else {
	        depths = [context];
	      }
	    }

	    function main(context /*, options*/) {
	      return '' + templateSpec.main(container, context, container.helpers, container.partials, data, blockParams, depths);
	    }

	    main = executeDecorators(templateSpec.main, main, container, options.depths || [], data, blockParams);
	    return main(context, options);
	  }

	  ret.isTop = true;

	  ret._setup = function (options) {
	    if (!options.partial) {
	      var mergedHelpers = Utils.extend({}, env.helpers, options.helpers);
	      wrapHelpersToPassLookupProperty(mergedHelpers, container);
	      container.helpers = mergedHelpers;

	      if (templateSpec.usePartial) {
	        // Use mergeIfNeeded here to prevent compiling global partials multiple times
	        container.partials = container.mergeIfNeeded(options.partials, env.partials);
	      }
	      if (templateSpec.usePartial || templateSpec.useDecorators) {
	        container.decorators = Utils.extend({}, env.decorators, options.decorators);
	      }

	      container.hooks = {};
	      container.protoAccessControl = _internalProtoAccess.createProtoAccessControl(options);

	      var keepHelperInHelpers = options.allowCallsToHelperMissing || templateWasPrecompiledWithCompilerV7;
	      _helpers.moveHelperToHooks(container, 'helperMissing', keepHelperInHelpers);
	      _helpers.moveHelperToHooks(container, 'blockHelperMissing', keepHelperInHelpers);
	    } else {
	      container.protoAccessControl = options.protoAccessControl; // internal option
	      container.helpers = options.helpers;
	      container.partials = options.partials;
	      container.decorators = options.decorators;
	      container.hooks = options.hooks;
	    }
	  };

	  ret._child = function (i, data, blockParams, depths) {
	    if (templateSpec.useBlockParams && !blockParams) {
	      throw new _exception2['default']('must pass block params');
	    }
	    if (templateSpec.useDepths && !depths) {
	      throw new _exception2['default']('must pass parent depths');
	    }

	    return wrapProgram(container, i, templateSpec[i], data, 0, blockParams, depths);
	  };
	  return ret;
	}

	function wrapProgram(container, i, fn, data, declaredBlockParams, blockParams, depths) {
	  function prog(context) {
	    var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

	    var currentDepths = depths;
	    if (depths && context != depths[0] && !(context === container.nullContext && depths[0] === null)) {
	      currentDepths = [context].concat(depths);
	    }

	    return fn(container, context, container.helpers, container.partials, options.data || data, blockParams && [options.blockParams].concat(blockParams), currentDepths);
	  }

	  prog = executeDecorators(fn, prog, container, depths, data, blockParams);

	  prog.program = i;
	  prog.depth = depths ? depths.length : 0;
	  prog.blockParams = declaredBlockParams || 0;
	  return prog;
	}

	/**
	 * This is currently part of the official API, therefore implementation details should not be changed.
	 */

	function resolvePartial(partial, context, options) {
	  if (!partial) {
	    if (options.name === '@partial-block') {
	      partial = options.data['partial-block'];
	    } else {
	      partial = options.partials[options.name];
	    }
	  } else if (!partial.call && !options.name) {
	    // This is a dynamic partial that returned a string
	    options.name = partial;
	    partial = options.partials[partial];
	  }
	  return partial;
	}

	function invokePartial(partial, context, options) {
	  // Use the current closure context to save the partial-block if this partial
	  var currentPartialBlock = options.data && options.data['partial-block'];
	  options.partial = true;
	  if (options.ids) {
	    options.data.contextPath = options.ids[0] || options.data.contextPath;
	  }

	  var partialBlock = undefined;
	  if (options.fn && options.fn !== noop) {
	    (function () {
	      options.data = _base.createFrame(options.data);
	      // Wrapper function to get access to currentPartialBlock from the closure
	      var fn = options.fn;
	      partialBlock = options.data['partial-block'] = function partialBlockWrapper(context) {
	        var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

	        // Restore the partial-block from the closure for the execution of the block
	        // i.e. the part inside the block of the partial call.
	        options.data = _base.createFrame(options.data);
	        options.data['partial-block'] = currentPartialBlock;
	        return fn(context, options);
	      };
	      if (fn.partials) {
	        options.partials = Utils.extend({}, options.partials, fn.partials);
	      }
	    })();
	  }

	  if (partial === undefined && partialBlock) {
	    partial = partialBlock;
	  }

	  if (partial === undefined) {
	    throw new _exception2['default']('The partial ' + options.name + ' could not be found');
	  } else if (partial instanceof Function) {
	    return partial(context, options);
	  }
	}

	function noop() {
	  return '';
	}

	function initData(context, data) {
	  if (!data || !('root' in data)) {
	    data = data ? _base.createFrame(data) : {};
	    data.root = context;
	  }
	  return data;
	}

	function executeDecorators(fn, prog, container, depths, data, blockParams) {
	  if (fn.decorator) {
	    var props = {};
	    prog = fn.decorator(prog, props, container, depths && depths[0], data, blockParams, depths);
	    Utils.extend(prog, props);
	  }
	  return prog;
	}

	function wrapHelpersToPassLookupProperty(mergedHelpers, container) {
	  _Object$keys(mergedHelpers).forEach(function (helperName) {
	    var helper = mergedHelpers[helperName];
	    mergedHelpers[helperName] = passLookupPropertyOption(helper, container);
	  });
	}

	function passLookupPropertyOption(helper, container) {
	  var lookupProperty = container.lookupProperty;
	  return _internalWrapHelper.wrapHelper(helper, function (options) {
	    return Utils.extend({ lookupProperty: lookupProperty }, options);
	  });
	}

/***/ }),
/* 79 */
/***/ (function(module, exports, __nested_webpack_require_74814__) {

	module.exports = { "default": __nested_webpack_require_74814__(80), __esModule: true };

/***/ }),
/* 80 */
/***/ (function(module, exports, __nested_webpack_require_74967__) {

	__nested_webpack_require_74967__(81);
	module.exports = __nested_webpack_require_74967__(21).Object.seal;

/***/ }),
/* 81 */
/***/ (function(module, exports, __nested_webpack_require_75125__) {

	// 19.1.2.17 Object.seal(O)
	var isObject = __nested_webpack_require_75125__(40);

	__nested_webpack_require_75125__(64)('seal', function($seal){
	  return function seal(it){
	    return $seal && isObject(it) ? $seal(it) : it;
	  };
	});

/***/ }),
/* 82 */
/***/ (function(module, exports) {

	'use strict';

	exports.__esModule = true;
	exports.wrapHelper = wrapHelper;

	function wrapHelper(helper, transformOptionsFn) {
	  if (typeof helper !== 'function') {
	    // This should not happen, but apparently it does in https://github.com/wycats/handlebars.js/issues/1639
	    // We try to make the wrapper least-invasive by not wrapping it, if the helper is not a function.
	    return helper;
	  }
	  var wrapper = function wrapper() /* dynamic arguments */{
	    var options = arguments[arguments.length - 1];
	    arguments[arguments.length - 1] = transformOptionsFn(options);
	    return helper.apply(this, arguments);
	  };
	  return wrapper;
	}

/***/ }),
/* 83 */
/***/ (function(module, exports) {

	/* global globalThis */
	'use strict';

	exports.__esModule = true;

	exports['default'] = function (Handlebars) {
	  /* istanbul ignore next */
	  // https://mathiasbynens.be/notes/globalthis
	  (function () {
	    if (typeof globalThis === 'object') return;
	    Object.prototype.__defineGetter__('__magic__', function () {
	      return this;
	    });
	    __magic__.globalThis = __magic__; // eslint-disable-line no-undef
	    delete Object.prototype.__magic__;
	  })();

	  var $Handlebars = globalThis.Handlebars;

	  /* istanbul ignore next */
	  Handlebars.noConflict = function () {
	    if (globalThis.Handlebars === Handlebars) {
	      globalThis.Handlebars = $Handlebars;
	    }
	    return Handlebars;
	  };
	};

	module.exports = exports['default'];

/***/ }),
/* 84 */
/***/ (function(module, exports) {

	'use strict';

	exports.__esModule = true;
	var AST = {
	  // Public API used to evaluate derived attributes regarding AST nodes
	  helpers: {
	    // a mustache is definitely a helper if:
	    // * it is an eligible helper, and
	    // * it has at least one parameter or hash segment
	    helperExpression: function helperExpression(node) {
	      return node.type === 'SubExpression' || (node.type === 'MustacheStatement' || node.type === 'BlockStatement') && !!(node.params && node.params.length || node.hash);
	    },

	    scopedId: function scopedId(path) {
	      return (/^\.|this\b/.test(path.original)
	      );
	    },

	    // an ID is simple if it only has one part, and that part is not
	    // `..` or `this`.
	    simpleId: function simpleId(path) {
	      return path.parts.length === 1 && !AST.helpers.scopedId(path) && !path.depth;
	    }
	  }
	};

	// Must be exported as an object rather than the root of the module as the jison lexer
	// must modify the object to operate properly.
	exports['default'] = AST;
	module.exports = exports['default'];

/***/ }),
/* 85 */
/***/ (function(module, exports, __nested_webpack_require_78078__) {

	'use strict';

	var _interopRequireDefault = __nested_webpack_require_78078__(1)['default'];

	var _interopRequireWildcard = __nested_webpack_require_78078__(3)['default'];

	exports.__esModule = true;
	exports.parseWithoutProcessing = parseWithoutProcessing;
	exports.parse = parse;

	var _parser = __nested_webpack_require_78078__(86);

	var _parser2 = _interopRequireDefault(_parser);

	var _whitespaceControl = __nested_webpack_require_78078__(87);

	var _whitespaceControl2 = _interopRequireDefault(_whitespaceControl);

	var _helpers = __nested_webpack_require_78078__(89);

	var Helpers = _interopRequireWildcard(_helpers);

	var _utils = __nested_webpack_require_78078__(5);

	exports.parser = _parser2['default'];

	var yy = {};
	_utils.extend(yy, Helpers);

	function parseWithoutProcessing(input, options) {
	  // Just return if an already-compiled AST was passed in.
	  if (input.type === 'Program') {
	    return input;
	  }

	  _parser2['default'].yy = yy;

	  // Altering the shared object here, but this is ok as parser is a sync operation
	  yy.locInfo = function (locInfo) {
	    return new yy.SourceLocation(options && options.srcName, locInfo);
	  };

	  var ast = _parser2['default'].parse(input);

	  return ast;
	}

	function parse(input, options) {
	  var ast = parseWithoutProcessing(input, options);
	  var strip = new _whitespaceControl2['default'](options);

	  return strip.accept(ast);
	}

/***/ }),
/* 86 */
/***/ (function(module, exports) {

	// File ignored in coverage tests via setting in .istanbul.yml
	/* Jison generated parser */
	"use strict";

	exports.__esModule = true;
	var handlebars = (function () {
	    var parser = { trace: function trace() {},
	        yy: {},
	        symbols_: { "error": 2, "root": 3, "program": 4, "EOF": 5, "program_repetition0": 6, "statement": 7, "mustache": 8, "block": 9, "rawBlock": 10, "partial": 11, "partialBlock": 12, "content": 13, "COMMENT": 14, "CONTENT": 15, "openRawBlock": 16, "rawBlock_repetition0": 17, "END_RAW_BLOCK": 18, "OPEN_RAW_BLOCK": 19, "helperName": 20, "openRawBlock_repetition0": 21, "openRawBlock_option0": 22, "CLOSE_RAW_BLOCK": 23, "openBlock": 24, "block_option0": 25, "closeBlock": 26, "openInverse": 27, "block_option1": 28, "OPEN_BLOCK": 29, "openBlock_repetition0": 30, "openBlock_option0": 31, "openBlock_option1": 32, "CLOSE": 33, "OPEN_INVERSE": 34, "openInverse_repetition0": 35, "openInverse_option0": 36, "openInverse_option1": 37, "openInverseChain": 38, "OPEN_INVERSE_CHAIN": 39, "openInverseChain_repetition0": 40, "openInverseChain_option0": 41, "openInverseChain_option1": 42, "inverseAndProgram": 43, "INVERSE": 44, "inverseChain": 45, "inverseChain_option0": 46, "OPEN_ENDBLOCK": 47, "OPEN": 48, "mustache_repetition0": 49, "mustache_option0": 50, "OPEN_UNESCAPED": 51, "mustache_repetition1": 52, "mustache_option1": 53, "CLOSE_UNESCAPED": 54, "OPEN_PARTIAL": 55, "partialName": 56, "partial_repetition0": 57, "partial_option0": 58, "openPartialBlock": 59, "OPEN_PARTIAL_BLOCK": 60, "openPartialBlock_repetition0": 61, "openPartialBlock_option0": 62, "param": 63, "sexpr": 64, "OPEN_SEXPR": 65, "sexpr_repetition0": 66, "sexpr_option0": 67, "CLOSE_SEXPR": 68, "hash": 69, "hash_repetition_plus0": 70, "hashSegment": 71, "ID": 72, "EQUALS": 73, "blockParams": 74, "OPEN_BLOCK_PARAMS": 75, "blockParams_repetition_plus0": 76, "CLOSE_BLOCK_PARAMS": 77, "path": 78, "dataName": 79, "STRING": 80, "NUMBER": 81, "BOOLEAN": 82, "UNDEFINED": 83, "NULL": 84, "DATA": 85, "pathSegments": 86, "SEP": 87, "$accept": 0, "$end": 1 },
	        terminals_: { 2: "error", 5: "EOF", 14: "COMMENT", 15: "CONTENT", 18: "END_RAW_BLOCK", 19: "OPEN_RAW_BLOCK", 23: "CLOSE_RAW_BLOCK", 29: "OPEN_BLOCK", 33: "CLOSE", 34: "OPEN_INVERSE", 39: "OPEN_INVERSE_CHAIN", 44: "INVERSE", 47: "OPEN_ENDBLOCK", 48: "OPEN", 51: "OPEN_UNESCAPED", 54: "CLOSE_UNESCAPED", 55: "OPEN_PARTIAL", 60: "OPEN_PARTIAL_BLOCK", 65: "OPEN_SEXPR", 68: "CLOSE_SEXPR", 72: "ID", 73: "EQUALS", 75: "OPEN_BLOCK_PARAMS", 77: "CLOSE_BLOCK_PARAMS", 80: "STRING", 81: "NUMBER", 82: "BOOLEAN", 83: "UNDEFINED", 84: "NULL", 85: "DATA", 87: "SEP" },
	        productions_: [0, [3, 2], [4, 1], [7, 1], [7, 1], [7, 1], [7, 1], [7, 1], [7, 1], [7, 1], [13, 1], [10, 3], [16, 5], [9, 4], [9, 4], [24, 6], [27, 6], [38, 6], [43, 2], [45, 3], [45, 1], [26, 3], [8, 5], [8, 5], [11, 5], [12, 3], [59, 5], [63, 1], [63, 1], [64, 5], [69, 1], [71, 3], [74, 3], [20, 1], [20, 1], [20, 1], [20, 1], [20, 1], [20, 1], [20, 1], [56, 1], [56, 1], [79, 2], [78, 1], [86, 3], [86, 1], [6, 0], [6, 2], [17, 0], [17, 2], [21, 0], [21, 2], [22, 0], [22, 1], [25, 0], [25, 1], [28, 0], [28, 1], [30, 0], [30, 2], [31, 0], [31, 1], [32, 0], [32, 1], [35, 0], [35, 2], [36, 0], [36, 1], [37, 0], [37, 1], [40, 0], [40, 2], [41, 0], [41, 1], [42, 0], [42, 1], [46, 0], [46, 1], [49, 0], [49, 2], [50, 0], [50, 1], [52, 0], [52, 2], [53, 0], [53, 1], [57, 0], [57, 2], [58, 0], [58, 1], [61, 0], [61, 2], [62, 0], [62, 1], [66, 0], [66, 2], [67, 0], [67, 1], [70, 1], [70, 2], [76, 1], [76, 2]],
	        performAction: function anonymous(yytext, yyleng, yylineno, yy, yystate, $$, _$) {

	            var $0 = $$.length - 1;
	            switch (yystate) {
	                case 1:
	                    return $$[$0 - 1];
	                    // removed by dead control flow

	                case 2:
	                    this.$ = yy.prepareProgram($$[$0]);
	                    break;
	                case 3:
	                    this.$ = $$[$0];
	                    break;
	                case 4:
	                    this.$ = $$[$0];
	                    break;
	                case 5:
	                    this.$ = $$[$0];
	                    break;
	                case 6:
	                    this.$ = $$[$0];
	                    break;
	                case 7:
	                    this.$ = $$[$0];
	                    break;
	                case 8:
	                    this.$ = $$[$0];
	                    break;
	                case 9:
	                    this.$ = {
	                        type: 'CommentStatement',
	                        value: yy.stripComment($$[$0]),
	                        strip: yy.stripFlags($$[$0], $$[$0]),
	                        loc: yy.locInfo(this._$)
	                    };

	                    break;
	                case 10:
	                    this.$ = {
	                        type: 'ContentStatement',
	                        original: $$[$0],
	                        value: $$[$0],
	                        loc: yy.locInfo(this._$)
	                    };

	                    break;
	                case 11:
	                    this.$ = yy.prepareRawBlock($$[$0 - 2], $$[$0 - 1], $$[$0], this._$);
	                    break;
	                case 12:
	                    this.$ = { path: $$[$0 - 3], params: $$[$0 - 2], hash: $$[$0 - 1] };
	                    break;
	                case 13:
	                    this.$ = yy.prepareBlock($$[$0 - 3], $$[$0 - 2], $$[$0 - 1], $$[$0], false, this._$);
	                    break;
	                case 14:
	                    this.$ = yy.prepareBlock($$[$0 - 3], $$[$0 - 2], $$[$0 - 1], $$[$0], true, this._$);
	                    break;
	                case 15:
	                    this.$ = { open: $$[$0 - 5], path: $$[$0 - 4], params: $$[$0 - 3], hash: $$[$0 - 2], blockParams: $$[$0 - 1], strip: yy.stripFlags($$[$0 - 5], $$[$0]) };
	                    break;
	                case 16:
	                    this.$ = { path: $$[$0 - 4], params: $$[$0 - 3], hash: $$[$0 - 2], blockParams: $$[$0 - 1], strip: yy.stripFlags($$[$0 - 5], $$[$0]) };
	                    break;
	                case 17:
	                    this.$ = { path: $$[$0 - 4], params: $$[$0 - 3], hash: $$[$0 - 2], blockParams: $$[$0 - 1], strip: yy.stripFlags($$[$0 - 5], $$[$0]) };
	                    break;
	                case 18:
	                    this.$ = { strip: yy.stripFlags($$[$0 - 1], $$[$0 - 1]), program: $$[$0] };
	                    break;
	                case 19:
	                    var inverse = yy.prepareBlock($$[$0 - 2], $$[$0 - 1], $$[$0], $$[$0], false, this._$),
	                        program = yy.prepareProgram([inverse], $$[$0 - 1].loc);
	                    program.chained = true;

	                    this.$ = { strip: $$[$0 - 2].strip, program: program, chain: true };

	                    break;
	                case 20:
	                    this.$ = $$[$0];
	                    break;
	                case 21:
	                    this.$ = { path: $$[$0 - 1], strip: yy.stripFlags($$[$0 - 2], $$[$0]) };
	                    break;
	                case 22:
	                    this.$ = yy.prepareMustache($$[$0 - 3], $$[$0 - 2], $$[$0 - 1], $$[$0 - 4], yy.stripFlags($$[$0 - 4], $$[$0]), this._$);
	                    break;
	                case 23:
	                    this.$ = yy.prepareMustache($$[$0 - 3], $$[$0 - 2], $$[$0 - 1], $$[$0 - 4], yy.stripFlags($$[$0 - 4], $$[$0]), this._$);
	                    break;
	                case 24:
	                    this.$ = {
	                        type: 'PartialStatement',
	                        name: $$[$0 - 3],
	                        params: $$[$0 - 2],
	                        hash: $$[$0 - 1],
	                        indent: '',
	                        strip: yy.stripFlags($$[$0 - 4], $$[$0]),
	                        loc: yy.locInfo(this._$)
	                    };

	                    break;
	                case 25:
	                    this.$ = yy.preparePartialBlock($$[$0 - 2], $$[$0 - 1], $$[$0], this._$);
	                    break;
	                case 26:
	                    this.$ = { path: $$[$0 - 3], params: $$[$0 - 2], hash: $$[$0 - 1], strip: yy.stripFlags($$[$0 - 4], $$[$0]) };
	                    break;
	                case 27:
	                    this.$ = $$[$0];
	                    break;
	                case 28:
	                    this.$ = $$[$0];
	                    break;
	                case 29:
	                    this.$ = {
	                        type: 'SubExpression',
	                        path: $$[$0 - 3],
	                        params: $$[$0 - 2],
	                        hash: $$[$0 - 1],
	                        loc: yy.locInfo(this._$)
	                    };

	                    break;
	                case 30:
	                    this.$ = { type: 'Hash', pairs: $$[$0], loc: yy.locInfo(this._$) };
	                    break;
	                case 31:
	                    this.$ = { type: 'HashPair', key: yy.id($$[$0 - 2]), value: $$[$0], loc: yy.locInfo(this._$) };
	                    break;
	                case 32:
	                    this.$ = yy.id($$[$0 - 1]);
	                    break;
	                case 33:
	                    this.$ = $$[$0];
	                    break;
	                case 34:
	                    this.$ = $$[$0];
	                    break;
	                case 35:
	                    this.$ = { type: 'StringLiteral', value: $$[$0], original: $$[$0], loc: yy.locInfo(this._$) };
	                    break;
	                case 36:
	                    this.$ = { type: 'NumberLiteral', value: Number($$[$0]), original: Number($$[$0]), loc: yy.locInfo(this._$) };
	                    break;
	                case 37:
	                    this.$ = { type: 'BooleanLiteral', value: $$[$0] === 'true', original: $$[$0] === 'true', loc: yy.locInfo(this._$) };
	                    break;
	                case 38:
	                    this.$ = { type: 'UndefinedLiteral', original: undefined, value: undefined, loc: yy.locInfo(this._$) };
	                    break;
	                case 39:
	                    this.$ = { type: 'NullLiteral', original: null, value: null, loc: yy.locInfo(this._$) };
	                    break;
	                case 40:
	                    this.$ = $$[$0];
	                    break;
	                case 41:
	                    this.$ = $$[$0];
	                    break;
	                case 42:
	                    this.$ = yy.preparePath(true, $$[$0], this._$);
	                    break;
	                case 43:
	                    this.$ = yy.preparePath(false, $$[$0], this._$);
	                    break;
	                case 44:
	                    $$[$0 - 2].push({ part: yy.id($$[$0]), original: $$[$0], separator: $$[$0 - 1] });this.$ = $$[$0 - 2];
	                    break;
	                case 45:
	                    this.$ = [{ part: yy.id($$[$0]), original: $$[$0] }];
	                    break;
	                case 46:
	                    this.$ = [];
	                    break;
	                case 47:
	                    $$[$0 - 1].push($$[$0]);
	                    break;
	                case 48:
	                    this.$ = [];
	                    break;
	                case 49:
	                    $$[$0 - 1].push($$[$0]);
	                    break;
	                case 50:
	                    this.$ = [];
	                    break;
	                case 51:
	                    $$[$0 - 1].push($$[$0]);
	                    break;
	                case 58:
	                    this.$ = [];
	                    break;
	                case 59:
	                    $$[$0 - 1].push($$[$0]);
	                    break;
	                case 64:
	                    this.$ = [];
	                    break;
	                case 65:
	                    $$[$0 - 1].push($$[$0]);
	                    break;
	                case 70:
	                    this.$ = [];
	                    break;
	                case 71:
	                    $$[$0 - 1].push($$[$0]);
	                    break;
	                case 78:
	                    this.$ = [];
	                    break;
	                case 79:
	                    $$[$0 - 1].push($$[$0]);
	                    break;
	                case 82:
	                    this.$ = [];
	                    break;
	                case 83:
	                    $$[$0 - 1].push($$[$0]);
	                    break;
	                case 86:
	                    this.$ = [];
	                    break;
	                case 87:
	                    $$[$0 - 1].push($$[$0]);
	                    break;
	                case 90:
	                    this.$ = [];
	                    break;
	                case 91:
	                    $$[$0 - 1].push($$[$0]);
	                    break;
	                case 94:
	                    this.$ = [];
	                    break;
	                case 95:
	                    $$[$0 - 1].push($$[$0]);
	                    break;
	                case 98:
	                    this.$ = [$$[$0]];
	                    break;
	                case 99:
	                    $$[$0 - 1].push($$[$0]);
	                    break;
	                case 100:
	                    this.$ = [$$[$0]];
	                    break;
	                case 101:
	                    $$[$0 - 1].push($$[$0]);
	                    break;
	            }
	        },
	        table: [{ 3: 1, 4: 2, 5: [2, 46], 6: 3, 14: [2, 46], 15: [2, 46], 19: [2, 46], 29: [2, 46], 34: [2, 46], 48: [2, 46], 51: [2, 46], 55: [2, 46], 60: [2, 46] }, { 1: [3] }, { 5: [1, 4] }, { 5: [2, 2], 7: 5, 8: 6, 9: 7, 10: 8, 11: 9, 12: 10, 13: 11, 14: [1, 12], 15: [1, 20], 16: 17, 19: [1, 23], 24: 15, 27: 16, 29: [1, 21], 34: [1, 22], 39: [2, 2], 44: [2, 2], 47: [2, 2], 48: [1, 13], 51: [1, 14], 55: [1, 18], 59: 19, 60: [1, 24] }, { 1: [2, 1] }, { 5: [2, 47], 14: [2, 47], 15: [2, 47], 19: [2, 47], 29: [2, 47], 34: [2, 47], 39: [2, 47], 44: [2, 47], 47: [2, 47], 48: [2, 47], 51: [2, 47], 55: [2, 47], 60: [2, 47] }, { 5: [2, 3], 14: [2, 3], 15: [2, 3], 19: [2, 3], 29: [2, 3], 34: [2, 3], 39: [2, 3], 44: [2, 3], 47: [2, 3], 48: [2, 3], 51: [2, 3], 55: [2, 3], 60: [2, 3] }, { 5: [2, 4], 14: [2, 4], 15: [2, 4], 19: [2, 4], 29: [2, 4], 34: [2, 4], 39: [2, 4], 44: [2, 4], 47: [2, 4], 48: [2, 4], 51: [2, 4], 55: [2, 4], 60: [2, 4] }, { 5: [2, 5], 14: [2, 5], 15: [2, 5], 19: [2, 5], 29: [2, 5], 34: [2, 5], 39: [2, 5], 44: [2, 5], 47: [2, 5], 48: [2, 5], 51: [2, 5], 55: [2, 5], 60: [2, 5] }, { 5: [2, 6], 14: [2, 6], 15: [2, 6], 19: [2, 6], 29: [2, 6], 34: [2, 6], 39: [2, 6], 44: [2, 6], 47: [2, 6], 48: [2, 6], 51: [2, 6], 55: [2, 6], 60: [2, 6] }, { 5: [2, 7], 14: [2, 7], 15: [2, 7], 19: [2, 7], 29: [2, 7], 34: [2, 7], 39: [2, 7], 44: [2, 7], 47: [2, 7], 48: [2, 7], 51: [2, 7], 55: [2, 7], 60: [2, 7] }, { 5: [2, 8], 14: [2, 8], 15: [2, 8], 19: [2, 8], 29: [2, 8], 34: [2, 8], 39: [2, 8], 44: [2, 8], 47: [2, 8], 48: [2, 8], 51: [2, 8], 55: [2, 8], 60: [2, 8] }, { 5: [2, 9], 14: [2, 9], 15: [2, 9], 19: [2, 9], 29: [2, 9], 34: [2, 9], 39: [2, 9], 44: [2, 9], 47: [2, 9], 48: [2, 9], 51: [2, 9], 55: [2, 9], 60: [2, 9] }, { 20: 25, 72: [1, 35], 78: 26, 79: 27, 80: [1, 28], 81: [1, 29], 82: [1, 30], 83: [1, 31], 84: [1, 32], 85: [1, 34], 86: 33 }, { 20: 36, 72: [1, 35], 78: 26, 79: 27, 80: [1, 28], 81: [1, 29], 82: [1, 30], 83: [1, 31], 84: [1, 32], 85: [1, 34], 86: 33 }, { 4: 37, 6: 3, 14: [2, 46], 15: [2, 46], 19: [2, 46], 29: [2, 46], 34: [2, 46], 39: [2, 46], 44: [2, 46], 47: [2, 46], 48: [2, 46], 51: [2, 46], 55: [2, 46], 60: [2, 46] }, { 4: 38, 6: 3, 14: [2, 46], 15: [2, 46], 19: [2, 46], 29: [2, 46], 34: [2, 46], 44: [2, 46], 47: [2, 46], 48: [2, 46], 51: [2, 46], 55: [2, 46], 60: [2, 46] }, { 15: [2, 48], 17: 39, 18: [2, 48] }, { 20: 41, 56: 40, 64: 42, 65: [1, 43], 72: [1, 35], 78: 26, 79: 27, 80: [1, 28], 81: [1, 29], 82: [1, 30], 83: [1, 31], 84: [1, 32], 85: [1, 34], 86: 33 }, { 4: 44, 6: 3, 14: [2, 46], 15: [2, 46], 19: [2, 46], 29: [2, 46], 34: [2, 46], 47: [2, 46], 48: [2, 46], 51: [2, 46], 55: [2, 46], 60: [2, 46] }, { 5: [2, 10], 14: [2, 10], 15: [2, 10], 18: [2, 10], 19: [2, 10], 29: [2, 10], 34: [2, 10], 39: [2, 10], 44: [2, 10], 47: [2, 10], 48: [2, 10], 51: [2, 10], 55: [2, 10], 60: [2, 10] }, { 20: 45, 72: [1, 35], 78: 26, 79: 27, 80: [1, 28], 81: [1, 29], 82: [1, 30], 83: [1, 31], 84: [1, 32], 85: [1, 34], 86: 33 }, { 20: 46, 72: [1, 35], 78: 26, 79: 27, 80: [1, 28], 81: [1, 29], 82: [1, 30], 83: [1, 31], 84: [1, 32], 85: [1, 34], 86: 33 }, { 20: 47, 72: [1, 35], 78: 26, 79: 27, 80: [1, 28], 81: [1, 29], 82: [1, 30], 83: [1, 31], 84: [1, 32], 85: [1, 34], 86: 33 }, { 20: 41, 56: 48, 64: 42, 65: [1, 43], 72: [1, 35], 78: 26, 79: 27, 80: [1, 28], 81: [1, 29], 82: [1, 30], 83: [1, 31], 84: [1, 32], 85: [1, 34], 86: 33 }, { 33: [2, 78], 49: 49, 65: [2, 78], 72: [2, 78], 80: [2, 78], 81: [2, 78], 82: [2, 78], 83: [2, 78], 84: [2, 78], 85: [2, 78] }, { 23: [2, 33], 33: [2, 33], 54: [2, 33], 65: [2, 33], 68: [2, 33], 72: [2, 33], 75: [2, 33], 80: [2, 33], 81: [2, 33], 82: [2, 33], 83: [2, 33], 84: [2, 33], 85: [2, 33] }, { 23: [2, 34], 33: [2, 34], 54: [2, 34], 65: [2, 34], 68: [2, 34], 72: [2, 34], 75: [2, 34], 80: [2, 34], 81: [2, 34], 82: [2, 34], 83: [2, 34], 84: [2, 34], 85: [2, 34] }, { 23: [2, 35], 33: [2, 35], 54: [2, 35], 65: [2, 35], 68: [2, 35], 72: [2, 35], 75: [2, 35], 80: [2, 35], 81: [2, 35], 82: [2, 35], 83: [2, 35], 84: [2, 35], 85: [2, 35] }, { 23: [2, 36], 33: [2, 36], 54: [2, 36], 65: [2, 36], 68: [2, 36], 72: [2, 36], 75: [2, 36], 80: [2, 36], 81: [2, 36], 82: [2, 36], 83: [2, 36], 84: [2, 36], 85: [2, 36] }, { 23: [2, 37], 33: [2, 37], 54: [2, 37], 65: [2, 37], 68: [2, 37], 72: [2, 37], 75: [2, 37], 80: [2, 37], 81: [2, 37], 82: [2, 37], 83: [2, 37], 84: [2, 37], 85: [2, 37] }, { 23: [2, 38], 33: [2, 38], 54: [2, 38], 65: [2, 38], 68: [2, 38], 72: [2, 38], 75: [2, 38], 80: [2, 38], 81: [2, 38], 82: [2, 38], 83: [2, 38], 84: [2, 38], 85: [2, 38] }, { 23: [2, 39], 33: [2, 39], 54: [2, 39], 65: [2, 39], 68: [2, 39], 72: [2, 39], 75: [2, 39], 80: [2, 39], 81: [2, 39], 82: [2, 39], 83: [2, 39], 84: [2, 39], 85: [2, 39] }, { 23: [2, 43], 33: [2, 43], 54: [2, 43], 65: [2, 43], 68: [2, 43], 72: [2, 43], 75: [2, 43], 80: [2, 43], 81: [2, 43], 82: [2, 43], 83: [2, 43], 84: [2, 43], 85: [2, 43], 87: [1, 50] }, { 72: [1, 35], 86: 51 }, { 23: [2, 45], 33: [2, 45], 54: [2, 45], 65: [2, 45], 68: [2, 45], 72: [2, 45], 75: [2, 45], 80: [2, 45], 81: [2, 45], 82: [2, 45], 83: [2, 45], 84: [2, 45], 85: [2, 45], 87: [2, 45] }, { 52: 52, 54: [2, 82], 65: [2, 82], 72: [2, 82], 80: [2, 82], 81: [2, 82], 82: [2, 82], 83: [2, 82], 84: [2, 82], 85: [2, 82] }, { 25: 53, 38: 55, 39: [1, 57], 43: 56, 44: [1, 58], 45: 54, 47: [2, 54] }, { 28: 59, 43: 60, 44: [1, 58], 47: [2, 56] }, { 13: 62, 15: [1, 20], 18: [1, 61] }, { 33: [2, 86], 57: 63, 65: [2, 86], 72: [2, 86], 80: [2, 86], 81: [2, 86], 82: [2, 86], 83: [2, 86], 84: [2, 86], 85: [2, 86] }, { 33: [2, 40], 65: [2, 40], 72: [2, 40], 80: [2, 40], 81: [2, 40], 82: [2, 40], 83: [2, 40], 84: [2, 40], 85: [2, 40] }, { 33: [2, 41], 65: [2, 41], 72: [2, 41], 80: [2, 41], 81: [2, 41], 82: [2, 41], 83: [2, 41], 84: [2, 41], 85: [2, 41] }, { 20: 64, 72: [1, 35], 78: 26, 79: 27, 80: [1, 28], 81: [1, 29], 82: [1, 30], 83: [1, 31], 84: [1, 32], 85: [1, 34], 86: 33 }, { 26: 65, 47: [1, 66] }, { 30: 67, 33: [2, 58], 65: [2, 58], 72: [2, 58], 75: [2, 58], 80: [2, 58], 81: [2, 58], 82: [2, 58], 83: [2, 58], 84: [2, 58], 85: [2, 58] }, { 33: [2, 64], 35: 68, 65: [2, 64], 72: [2, 64], 75: [2, 64], 80: [2, 64], 81: [2, 64], 82: [2, 64], 83: [2, 64], 84: [2, 64], 85: [2, 64] }, { 21: 69, 23: [2, 50], 65: [2, 50], 72: [2, 50], 80: [2, 50], 81: [2, 50], 82: [2, 50], 83: [2, 50], 84: [2, 50], 85: [2, 50] }, { 33: [2, 90], 61: 70, 65: [2, 90], 72: [2, 90], 80: [2, 90], 81: [2, 90], 82: [2, 90], 83: [2, 90], 84: [2, 90], 85: [2, 90] }, { 20: 74, 33: [2, 80], 50: 71, 63: 72, 64: 75, 65: [1, 43], 69: 73, 70: 76, 71: 77, 72: [1, 78], 78: 26, 79: 27, 80: [1, 28], 81: [1, 29], 82: [1, 30], 83: [1, 31], 84: [1, 32], 85: [1, 34], 86: 33 }, { 72: [1, 79] }, { 23: [2, 42], 33: [2, 42], 54: [2, 42], 65: [2, 42], 68: [2, 42], 72: [2, 42], 75: [2, 42], 80: [2, 42], 81: [2, 42], 82: [2, 42], 83: [2, 42], 84: [2, 42], 85: [2, 42], 87: [1, 50] }, { 20: 74, 53: 80, 54: [2, 84], 63: 81, 64: 75, 65: [1, 43], 69: 82, 70: 76, 71: 77, 72: [1, 78], 78: 26, 79: 27, 80: [1, 28], 81: [1, 29], 82: [1, 30], 83: [1, 31], 84: [1, 32], 85: [1, 34], 86: 33 }, { 26: 83, 47: [1, 66] }, { 47: [2, 55] }, { 4: 84, 6: 3, 14: [2, 46], 15: [2, 46], 19: [2, 46], 29: [2, 46], 34: [2, 46], 39: [2, 46], 44: [2, 46], 47: [2, 46], 48: [2, 46], 51: [2, 46], 55: [2, 46], 60: [2, 46] }, { 47: [2, 20] }, { 20: 85, 72: [1, 35], 78: 26, 79: 27, 80: [1, 28], 81: [1, 29], 82: [1, 30], 83: [1, 31], 84: [1, 32], 85: [1, 34], 86: 33 }, { 4: 86, 6: 3, 14: [2, 46], 15: [2, 46], 19: [2, 46], 29: [2, 46], 34: [2, 46], 47: [2, 46], 48: [2, 46], 51: [2, 46], 55: [2, 46], 60: [2, 46] }, { 26: 87, 47: [1, 66] }, { 47: [2, 57] }, { 5: [2, 11], 14: [2, 11], 15: [2, 11], 19: [2, 11], 29: [2, 11], 34: [2, 11], 39: [2, 11], 44: [2, 11], 47: [2, 11], 48: [2, 11], 51: [2, 11], 55: [2, 11], 60: [2, 11] }, { 15: [2, 49], 18: [2, 49] }, { 20: 74, 33: [2, 88], 58: 88, 63: 89, 64: 75, 65: [1, 43], 69: 90, 70: 76, 71: 77, 72: [1, 78], 78: 26, 79: 27, 80: [1, 28], 81: [1, 29], 82: [1, 30], 83: [1, 31], 84: [1, 32], 85: [1, 34], 86: 33 }, { 65: [2, 94], 66: 91, 68: [2, 94], 72: [2, 94], 80: [2, 94], 81: [2, 94], 82: [2, 94], 83: [2, 94], 84: [2, 94], 85: [2, 94] }, { 5: [2, 25], 14: [2, 25], 15: [2, 25], 19: [2, 25], 29: [2, 25], 34: [2, 25], 39: [2, 25], 44: [2, 25], 47: [2, 25], 48: [2, 25], 51: [2, 25], 55: [2, 25], 60: [2, 25] }, { 20: 92, 72: [1, 35], 78: 26, 79: 27, 80: [1, 28], 81: [1, 29], 82: [1, 30], 83: [1, 31], 84: [1, 32], 85: [1, 34], 86: 33 }, { 20: 74, 31: 93, 33: [2, 60], 63: 94, 64: 75, 65: [1, 43], 69: 95, 70: 76, 71: 77, 72: [1, 78], 75: [2, 60], 78: 26, 79: 27, 80: [1, 28], 81: [1, 29], 82: [1, 30], 83: [1, 31], 84: [1, 32], 85: [1, 34], 86: 33 }, { 20: 74, 33: [2, 66], 36: 96, 63: 97, 64: 75, 65: [1, 43], 69: 98, 70: 76, 71: 77, 72: [1, 78], 75: [2, 66], 78: 26, 79: 27, 80: [1, 28], 81: [1, 29], 82: [1, 30], 83: [1, 31], 84: [1, 32], 85: [1, 34], 86: 33 }, { 20: 74, 22: 99, 23: [2, 52], 63: 100, 64: 75, 65: [1, 43], 69: 101, 70: 76, 71: 77, 72: [1, 78], 78: 26, 79: 27, 80: [1, 28], 81: [1, 29], 82: [1, 30], 83: [1, 31], 84: [1, 32], 85: [1, 34], 86: 33 }, { 20: 74, 33: [2, 92], 62: 102, 63: 103, 64: 75, 65: [1, 43], 69: 104, 70: 76, 71: 77, 72: [1, 78], 78: 26, 79: 27, 80: [1, 28], 81: [1, 29], 82: [1, 30], 83: [1, 31], 84: [1, 32], 85: [1, 34], 86: 33 }, { 33: [1, 105] }, { 33: [2, 79], 65: [2, 79], 72: [2, 79], 80: [2, 79], 81: [2, 79], 82: [2, 79], 83: [2, 79], 84: [2, 79], 85: [2, 79] }, { 33: [2, 81] }, { 23: [2, 27], 33: [2, 27], 54: [2, 27], 65: [2, 27], 68: [2, 27], 72: [2, 27], 75: [2, 27], 80: [2, 27], 81: [2, 27], 82: [2, 27], 83: [2, 27], 84: [2, 27], 85: [2, 27] }, { 23: [2, 28], 33: [2, 28], 54: [2, 28], 65: [2, 28], 68: [2, 28], 72: [2, 28], 75: [2, 28], 80: [2, 28], 81: [2, 28], 82: [2, 28], 83: [2, 28], 84: [2, 28], 85: [2, 28] }, { 23: [2, 30], 33: [2, 30], 54: [2, 30], 68: [2, 30], 71: 106, 72: [1, 107], 75: [2, 30] }, { 23: [2, 98], 33: [2, 98], 54: [2, 98], 68: [2, 98], 72: [2, 98], 75: [2, 98] }, { 23: [2, 45], 33: [2, 45], 54: [2, 45], 65: [2, 45], 68: [2, 45], 72: [2, 45], 73: [1, 108], 75: [2, 45], 80: [2, 45], 81: [2, 45], 82: [2, 45], 83: [2, 45], 84: [2, 45], 85: [2, 45], 87: [2, 45] }, { 23: [2, 44], 33: [2, 44], 54: [2, 44], 65: [2, 44], 68: [2, 44], 72: [2, 44], 75: [2, 44], 80: [2, 44], 81: [2, 44], 82: [2, 44], 83: [2, 44], 84: [2, 44], 85: [2, 44], 87: [2, 44] }, { 54: [1, 109] }, { 54: [2, 83], 65: [2, 83], 72: [2, 83], 80: [2, 83], 81: [2, 83], 82: [2, 83], 83: [2, 83], 84: [2, 83], 85: [2, 83] }, { 54: [2, 85] }, { 5: [2, 13], 14: [2, 13], 15: [2, 13], 19: [2, 13], 29: [2, 13], 34: [2, 13], 39: [2, 13], 44: [2, 13], 47: [2, 13], 48: [2, 13], 51: [2, 13], 55: [2, 13], 60: [2, 13] }, { 38: 55, 39: [1, 57], 43: 56, 44: [1, 58], 45: 111, 46: 110, 47: [2, 76] }, { 33: [2, 70], 40: 112, 65: [2, 70], 72: [2, 70], 75: [2, 70], 80: [2, 70], 81: [2, 70], 82: [2, 70], 83: [2, 70], 84: [2, 70], 85: [2, 70] }, { 47: [2, 18] }, { 5: [2, 14], 14: [2, 14], 15: [2, 14], 19: [2, 14], 29: [2, 14], 34: [2, 14], 39: [2, 14], 44: [2, 14], 47: [2, 14], 48: [2, 14], 51: [2, 14], 55: [2, 14], 60: [2, 14] }, { 33: [1, 113] }, { 33: [2, 87], 65: [2, 87], 72: [2, 87], 80: [2, 87], 81: [2, 87], 82: [2, 87], 83: [2, 87], 84: [2, 87], 85: [2, 87] }, { 33: [2, 89] }, { 20: 74, 63: 115, 64: 75, 65: [1, 43], 67: 114, 68: [2, 96], 69: 116, 70: 76, 71: 77, 72: [1, 78], 78: 26, 79: 27, 80: [1, 28], 81: [1, 29], 82: [1, 30], 83: [1, 31], 84: [1, 32], 85: [1, 34], 86: 33 }, { 33: [1, 117] }, { 32: 118, 33: [2, 62], 74: 119, 75: [1, 120] }, { 33: [2, 59], 65: [2, 59], 72: [2, 59], 75: [2, 59], 80: [2, 59], 81: [2, 59], 82: [2, 59], 83: [2, 59], 84: [2, 59], 85: [2, 59] }, { 33: [2, 61], 75: [2, 61] }, { 33: [2, 68], 37: 121, 74: 122, 75: [1, 120] }, { 33: [2, 65], 65: [2, 65], 72: [2, 65], 75: [2, 65], 80: [2, 65], 81: [2, 65], 82: [2, 65], 83: [2, 65], 84: [2, 65], 85: [2, 65] }, { 33: [2, 67], 75: [2, 67] }, { 23: [1, 123] }, { 23: [2, 51], 65: [2, 51], 72: [2, 51], 80: [2, 51], 81: [2, 51], 82: [2, 51], 83: [2, 51], 84: [2, 51], 85: [2, 51] }, { 23: [2, 53] }, { 33: [1, 124] }, { 33: [2, 91], 65: [2, 91], 72: [2, 91], 80: [2, 91], 81: [2, 91], 82: [2, 91], 83: [2, 91], 84: [2, 91], 85: [2, 91] }, { 33: [2, 93] }, { 5: [2, 22], 14: [2, 22], 15: [2, 22], 19: [2, 22], 29: [2, 22], 34: [2, 22], 39: [2, 22], 44: [2, 22], 47: [2, 22], 48: [2, 22], 51: [2, 22], 55: [2, 22], 60: [2, 22] }, { 23: [2, 99], 33: [2, 99], 54: [2, 99], 68: [2, 99], 72: [2, 99], 75: [2, 99] }, { 73: [1, 108] }, { 20: 74, 63: 125, 64: 75, 65: [1, 43], 72: [1, 35], 78: 26, 79: 27, 80: [1, 28], 81: [1, 29], 82: [1, 30], 83: [1, 31], 84: [1, 32], 85: [1, 34], 86: 33 }, { 5: [2, 23], 14: [2, 23], 15: [2, 23], 19: [2, 23], 29: [2, 23], 34: [2, 23], 39: [2, 23], 44: [2, 23], 47: [2, 23], 48: [2, 23], 51: [2, 23], 55: [2, 23], 60: [2, 23] }, { 47: [2, 19] }, { 47: [2, 77] }, { 20: 74, 33: [2, 72], 41: 126, 63: 127, 64: 75, 65: [1, 43], 69: 128, 70: 76, 71: 77, 72: [1, 78], 75: [2, 72], 78: 26, 79: 27, 80: [1, 28], 81: [1, 29], 82: [1, 30], 83: [1, 31], 84: [1, 32], 85: [1, 34], 86: 33 }, { 5: [2, 24], 14: [2, 24], 15: [2, 24], 19: [2, 24], 29: [2, 24], 34: [2, 24], 39: [2, 24], 44: [2, 24], 47: [2, 24], 48: [2, 24], 51: [2, 24], 55: [2, 24], 60: [2, 24] }, { 68: [1, 129] }, { 65: [2, 95], 68: [2, 95], 72: [2, 95], 80: [2, 95], 81: [2, 95], 82: [2, 95], 83: [2, 95], 84: [2, 95], 85: [2, 95] }, { 68: [2, 97] }, { 5: [2, 21], 14: [2, 21], 15: [2, 21], 19: [2, 21], 29: [2, 21], 34: [2, 21], 39: [2, 21], 44: [2, 21], 47: [2, 21], 48: [2, 21], 51: [2, 21], 55: [2, 21], 60: [2, 21] }, { 33: [1, 130] }, { 33: [2, 63] }, { 72: [1, 132], 76: 131 }, { 33: [1, 133] }, { 33: [2, 69] }, { 15: [2, 12], 18: [2, 12] }, { 14: [2, 26], 15: [2, 26], 19: [2, 26], 29: [2, 26], 34: [2, 26], 47: [2, 26], 48: [2, 26], 51: [2, 26], 55: [2, 26], 60: [2, 26] }, { 23: [2, 31], 33: [2, 31], 54: [2, 31], 68: [2, 31], 72: [2, 31], 75: [2, 31] }, { 33: [2, 74], 42: 134, 74: 135, 75: [1, 120] }, { 33: [2, 71], 65: [2, 71], 72: [2, 71], 75: [2, 71], 80: [2, 71], 81: [2, 71], 82: [2, 71], 83: [2, 71], 84: [2, 71], 85: [2, 71] }, { 33: [2, 73], 75: [2, 73] }, { 23: [2, 29], 33: [2, 29], 54: [2, 29], 65: [2, 29], 68: [2, 29], 72: [2, 29], 75: [2, 29], 80: [2, 29], 81: [2, 29], 82: [2, 29], 83: [2, 29], 84: [2, 29], 85: [2, 29] }, { 14: [2, 15], 15: [2, 15], 19: [2, 15], 29: [2, 15], 34: [2, 15], 39: [2, 15], 44: [2, 15], 47: [2, 15], 48: [2, 15], 51: [2, 15], 55: [2, 15], 60: [2, 15] }, { 72: [1, 137], 77: [1, 136] }, { 72: [2, 100], 77: [2, 100] }, { 14: [2, 16], 15: [2, 16], 19: [2, 16], 29: [2, 16], 34: [2, 16], 44: [2, 16], 47: [2, 16], 48: [2, 16], 51: [2, 16], 55: [2, 16], 60: [2, 16] }, { 33: [1, 138] }, { 33: [2, 75] }, { 33: [2, 32] }, { 72: [2, 101], 77: [2, 101] }, { 14: [2, 17], 15: [2, 17], 19: [2, 17], 29: [2, 17], 34: [2, 17], 39: [2, 17], 44: [2, 17], 47: [2, 17], 48: [2, 17], 51: [2, 17], 55: [2, 17], 60: [2, 17] }],
	        defaultActions: { 4: [2, 1], 54: [2, 55], 56: [2, 20], 60: [2, 57], 73: [2, 81], 82: [2, 85], 86: [2, 18], 90: [2, 89], 101: [2, 53], 104: [2, 93], 110: [2, 19], 111: [2, 77], 116: [2, 97], 119: [2, 63], 122: [2, 69], 135: [2, 75], 136: [2, 32] },
	        parseError: function parseError(str, hash) {
	            throw new Error(str);
	        },
	        parse: function parse(input) {
	            var self = this,
	                stack = [0],
	                vstack = [null],
	                lstack = [],
	                table = this.table,
	                yytext = "",
	                yylineno = 0,
	                yyleng = 0,
	                recovering = 0,
	                TERROR = 2,
	                EOF = 1;
	            this.lexer.setInput(input);
	            this.lexer.yy = this.yy;
	            this.yy.lexer = this.lexer;
	            this.yy.parser = this;
	            if (typeof this.lexer.yylloc == "undefined") this.lexer.yylloc = {};
	            var yyloc = this.lexer.yylloc;
	            lstack.push(yyloc);
	            var ranges = this.lexer.options && this.lexer.options.ranges;
	            if (typeof this.yy.parseError === "function") this.parseError = this.yy.parseError;
	            function popStack(n) {
	                stack.length = stack.length - 2 * n;
	                vstack.length = vstack.length - n;
	                lstack.length = lstack.length - n;
	            }
	            function lex() {
	                var token;
	                token = self.lexer.lex() || 1;
	                if (typeof token !== "number") {
	                    token = self.symbols_[token] || token;
	                }
	                return token;
	            }
	            var symbol,
	                preErrorSymbol,
	                state,
	                action,
	                a,
	                r,
	                yyval = {},
	                p,
	                len,
	                newState,
	                expected;
	            while (true) {
	                state = stack[stack.length - 1];
	                if (this.defaultActions[state]) {
	                    action = this.defaultActions[state];
	                } else {
	                    if (symbol === null || typeof symbol == "undefined") {
	                        symbol = lex();
	                    }
	                    action = table[state] && table[state][symbol];
	                }
	                if (typeof action === "undefined" || !action.length || !action[0]) {
	                    var errStr = "";
	                    if (!recovering) {
	                        expected = [];
	                        for (p in table[state]) if (this.terminals_[p] && p > 2) {
	                            expected.push("'" + this.terminals_[p] + "'");
	                        }
	                        if (this.lexer.showPosition) {
	                            errStr = "Parse error on line " + (yylineno + 1) + ":\n" + this.lexer.showPosition() + "\nExpecting " + expected.join(", ") + ", got '" + (this.terminals_[symbol] || symbol) + "'";
	                        } else {
	                            errStr = "Parse error on line " + (yylineno + 1) + ": Unexpected " + (symbol == 1 ? "end of input" : "'" + (this.terminals_[symbol] || symbol) + "'");
	                        }
	                        this.parseError(errStr, { text: this.lexer.match, token: this.terminals_[symbol] || symbol, line: this.lexer.yylineno, loc: yyloc, expected: expected });
	                    }
	                }
	                if (action[0] instanceof Array && action.length > 1) {
	                    throw new Error("Parse Error: multiple actions possible at state: " + state + ", token: " + symbol);
	                }
	                switch (action[0]) {
	                    case 1:
	                        stack.push(symbol);
	                        vstack.push(this.lexer.yytext);
	                        lstack.push(this.lexer.yylloc);
	                        stack.push(action[1]);
	                        symbol = null;
	                        if (!preErrorSymbol) {
	                            yyleng = this.lexer.yyleng;
	                            yytext = this.lexer.yytext;
	                            yylineno = this.lexer.yylineno;
	                            yyloc = this.lexer.yylloc;
	                            if (recovering > 0) recovering--;
	                        } else {
	                            symbol = preErrorSymbol;
	                            preErrorSymbol = null;
	                        }
	                        break;
	                    case 2:
	                        len = this.productions_[action[1]][1];
	                        yyval.$ = vstack[vstack.length - len];
	                        yyval._$ = { first_line: lstack[lstack.length - (len || 1)].first_line, last_line: lstack[lstack.length - 1].last_line, first_column: lstack[lstack.length - (len || 1)].first_column, last_column: lstack[lstack.length - 1].last_column };
	                        if (ranges) {
	                            yyval._$.range = [lstack[lstack.length - (len || 1)].range[0], lstack[lstack.length - 1].range[1]];
	                        }
	                        r = this.performAction.call(yyval, yytext, yyleng, yylineno, this.yy, action[1], vstack, lstack);
	                        if (typeof r !== "undefined") {
	                            return r;
	                        }
	                        if (len) {
	                            stack = stack.slice(0, -1 * len * 2);
	                            vstack = vstack.slice(0, -1 * len);
	                            lstack = lstack.slice(0, -1 * len);
	                        }
	                        stack.push(this.productions_[action[1]][0]);
	                        vstack.push(yyval.$);
	                        lstack.push(yyval._$);
	                        newState = table[stack[stack.length - 2]][stack[stack.length - 1]];
	                        stack.push(newState);
	                        break;
	                    case 3:
	                        return true;
	                }
	            }
	            return true;
	        }
	    };
	    /* Jison generated lexer */
	    var lexer = (function () {
	        var lexer = { EOF: 1,
	            parseError: function parseError(str, hash) {
	                if (this.yy.parser) {
	                    this.yy.parser.parseError(str, hash);
	                } else {
	                    throw new Error(str);
	                }
	            },
	            setInput: function setInput(input) {
	                this._input = input;
	                this._more = this._less = this.done = false;
	                this.yylineno = this.yyleng = 0;
	                this.yytext = this.matched = this.match = '';
	                this.conditionStack = ['INITIAL'];
	                this.yylloc = { first_line: 1, first_column: 0, last_line: 1, last_column: 0 };
	                if (this.options.ranges) this.yylloc.range = [0, 0];
	                this.offset = 0;
	                return this;
	            },
	            input: function input() {
	                var ch = this._input[0];
	                this.yytext += ch;
	                this.yyleng++;
	                this.offset++;
	                this.match += ch;
	                this.matched += ch;
	                var lines = ch.match(/(?:\r\n?|\n).*/g);
	                if (lines) {
	                    this.yylineno++;
	                    this.yylloc.last_line++;
	                } else {
	                    this.yylloc.last_column++;
	                }
	                if (this.options.ranges) this.yylloc.range[1]++;

	                this._input = this._input.slice(1);
	                return ch;
	            },
	            unput: function unput(ch) {
	                var len = ch.length;
	                var lines = ch.split(/(?:\r\n?|\n)/g);

	                this._input = ch + this._input;
	                this.yytext = this.yytext.substr(0, this.yytext.length - len - 1);
	                //this.yyleng -= len;
	                this.offset -= len;
	                var oldLines = this.match.split(/(?:\r\n?|\n)/g);
	                this.match = this.match.substr(0, this.match.length - 1);
	                this.matched = this.matched.substr(0, this.matched.length - 1);

	                if (lines.length - 1) this.yylineno -= lines.length - 1;
	                var r = this.yylloc.range;

	                this.yylloc = { first_line: this.yylloc.first_line,
	                    last_line: this.yylineno + 1,
	                    first_column: this.yylloc.first_column,
	                    last_column: lines ? (lines.length === oldLines.length ? this.yylloc.first_column : 0) + oldLines[oldLines.length - lines.length].length - lines[0].length : this.yylloc.first_column - len
	                };

	                if (this.options.ranges) {
	                    this.yylloc.range = [r[0], r[0] + this.yyleng - len];
	                }
	                return this;
	            },
	            more: function more() {
	                this._more = true;
	                return this;
	            },
	            less: function less(n) {
	                this.unput(this.match.slice(n));
	            },
	            pastInput: function pastInput() {
	                var past = this.matched.substr(0, this.matched.length - this.match.length);
	                return (past.length > 20 ? '...' : '') + past.substr(-20).replace(/\n/g, "");
	            },
	            upcomingInput: function upcomingInput() {
	                var next = this.match;
	                if (next.length < 20) {
	                    next += this._input.substr(0, 20 - next.length);
	                }
	                return (next.substr(0, 20) + (next.length > 20 ? '...' : '')).replace(/\n/g, "");
	            },
	            showPosition: function showPosition() {
	                var pre = this.pastInput();
	                var c = new Array(pre.length + 1).join("-");
	                return pre + this.upcomingInput() + "\n" + c + "^";
	            },
	            next: function next() {
	                if (this.done) {
	                    return this.EOF;
	                }
	                if (!this._input) this.done = true;

	                var token, match, tempMatch, index, col, lines;
	                if (!this._more) {
	                    this.yytext = '';
	                    this.match = '';
	                }
	                var rules = this._currentRules();
	                for (var i = 0; i < rules.length; i++) {
	                    tempMatch = this._input.match(this.rules[rules[i]]);
	                    if (tempMatch && (!match || tempMatch[0].length > match[0].length)) {
	                        match = tempMatch;
	                        index = i;
	                        if (!this.options.flex) break;
	                    }
	                }
	                if (match) {
	                    lines = match[0].match(/(?:\r\n?|\n).*/g);
	                    if (lines) this.yylineno += lines.length;
	                    this.yylloc = { first_line: this.yylloc.last_line,
	                        last_line: this.yylineno + 1,
	                        first_column: this.yylloc.last_column,
	                        last_column: lines ? lines[lines.length - 1].length - lines[lines.length - 1].match(/\r?\n?/)[0].length : this.yylloc.last_column + match[0].length };
	                    this.yytext += match[0];
	                    this.match += match[0];
	                    this.matches = match;
	                    this.yyleng = this.yytext.length;
	                    if (this.options.ranges) {
	                        this.yylloc.range = [this.offset, this.offset += this.yyleng];
	                    }
	                    this._more = false;
	                    this._input = this._input.slice(match[0].length);
	                    this.matched += match[0];
	                    token = this.performAction.call(this, this.yy, this, rules[index], this.conditionStack[this.conditionStack.length - 1]);
	                    if (this.done && this._input) this.done = false;
	                    if (token) return token;else return;
	                }
	                if (this._input === "") {
	                    return this.EOF;
	                } else {
	                    return this.parseError('Lexical error on line ' + (this.yylineno + 1) + '. Unrecognized text.\n' + this.showPosition(), { text: "", token: null, line: this.yylineno });
	                }
	            },
	            lex: function lex() {
	                var r = this.next();
	                if (typeof r !== 'undefined') {
	                    return r;
	                } else {
	                    return this.lex();
	                }
	            },
	            begin: function begin(condition) {
	                this.conditionStack.push(condition);
	            },
	            popState: function popState() {
	                return this.conditionStack.pop();
	            },
	            _currentRules: function _currentRules() {
	                return this.conditions[this.conditionStack[this.conditionStack.length - 1]].rules;
	            },
	            topState: function topState() {
	                return this.conditionStack[this.conditionStack.length - 2];
	            },
	            pushState: function begin(condition) {
	                this.begin(condition);
	            } };
	        lexer.options = {};
	        lexer.performAction = function anonymous(yy, yy_, $avoiding_name_collisions, YY_START) {

	            function strip(start, end) {
	                return yy_.yytext = yy_.yytext.substring(start, yy_.yyleng - end + start);
	            }

	            var YYSTATE = YY_START;
	            switch ($avoiding_name_collisions) {
	                case 0:
	                    if (yy_.yytext.slice(-2) === "\\\\") {
	                        strip(0, 1);
	                        this.begin("mu");
	                    } else if (yy_.yytext.slice(-1) === "\\") {
	                        strip(0, 1);
	                        this.begin("emu");
	                    } else {
	                        this.begin("mu");
	                    }
	                    if (yy_.yytext) return 15;

	                    break;
	                case 1:
	                    return 15;
	                    // removed by dead control flow

	                case 2:
	                    this.popState();
	                    return 15;

	                    // removed by dead control flow

	                case 3:
	                    this.begin('raw');return 15;
	                    // removed by dead control flow

	                case 4:
	                    this.popState();
	                    // Should be using `this.topState()` below, but it currently
	                    // returns the second top instead of the first top. Opened an
	                    // issue about it at https://github.com/zaach/jison/issues/291
	                    if (this.conditionStack[this.conditionStack.length - 1] === 'raw') {
	                        return 15;
	                    } else {
	                        strip(5, 9);
	                        return 'END_RAW_BLOCK';
	                    }

	                    // removed by dead control flow

	                case 5:
	                    return 15;
	                    // removed by dead control flow

	                case 6:
	                    this.popState();
	                    return 14;

	                    // removed by dead control flow

	                case 7:
	                    return 65;
	                    // removed by dead control flow

	                case 8:
	                    return 68;
	                    // removed by dead control flow

	                case 9:
	                    return 19;
	                    // removed by dead control flow

	                case 10:
	                    this.popState();
	                    this.begin('raw');
	                    return 23;

	                    // removed by dead control flow

	                case 11:
	                    return 55;
	                    // removed by dead control flow

	                case 12:
	                    return 60;
	                    // removed by dead control flow

	                case 13:
	                    return 29;
	                    // removed by dead control flow

	                case 14:
	                    return 47;
	                    // removed by dead control flow

	                case 15:
	                    this.popState();return 44;
	                    // removed by dead control flow

	                case 16:
	                    this.popState();return 44;
	                    // removed by dead control flow

	                case 17:
	                    return 34;
	                    // removed by dead control flow

	                case 18:
	                    return 39;
	                    // removed by dead control flow

	                case 19:
	                    return 51;
	                    // removed by dead control flow

	                case 20:
	                    return 48;
	                    // removed by dead control flow

	                case 21:
	                    this.unput(yy_.yytext);
	                    this.popState();
	                    this.begin('com');

	                    break;
	                case 22:
	                    this.popState();
	                    return 14;

	                    // removed by dead control flow

	                case 23:
	                    return 48;
	                    // removed by dead control flow

	                case 24:
	                    return 73;
	                    // removed by dead control flow

	                case 25:
	                    return 72;
	                    // removed by dead control flow

	                case 26:
	                    return 72;
	                    // removed by dead control flow

	                case 27:
	                    return 87;
	                    // removed by dead control flow

	                case 28:
	                    // ignore whitespace
	                    break;
	                case 29:
	                    this.popState();return 54;
	                    // removed by dead control flow

	                case 30:
	                    this.popState();return 33;
	                    // removed by dead control flow

	                case 31:
	                    yy_.yytext = strip(1, 2).replace(/\\"/g, '"');return 80;
	                    // removed by dead control flow

	                case 32:
	                    yy_.yytext = strip(1, 2).replace(/\\'/g, "'");return 80;
	                    // removed by dead control flow

	                case 33:
	                    return 85;
	                    // removed by dead control flow

	                case 34:
	                    return 82;
	                    // removed by dead control flow

	                case 35:
	                    return 82;
	                    // removed by dead control flow

	                case 36:
	                    return 83;
	                    // removed by dead control flow

	                case 37:
	                    return 84;
	                    // removed by dead control flow

	                case 38:
	                    return 81;
	                    // removed by dead control flow

	                case 39:
	                    return 75;
	                    // removed by dead control flow

	                case 40:
	                    return 77;
	                    // removed by dead control flow

	                case 41:
	                    return 72;
	                    // removed by dead control flow

	                case 42:
	                    yy_.yytext = yy_.yytext.replace(/\\([\\\]])/g, '$1');return 72;
	                    // removed by dead control flow

	                case 43:
	                    return 'INVALID';
	                    // removed by dead control flow

	                case 44:
	                    return 5;
	                    // removed by dead control flow

	            }
	        };
	        lexer.rules = [/^(?:[^\x00]*?(?=(\{\{)))/, /^(?:[^\x00]+)/, /^(?:[^\x00]{2,}?(?=(\{\{|\\\{\{|\\\\\{\{|$)))/, /^(?:\{\{\{\{(?=[^/]))/, /^(?:\{\{\{\{\/[^\s!"#%-,\.\/;->@\[-\^`\{-~]+(?=[=}\s\/.])\}\}\}\})/, /^(?:[^\x00]+?(?=(\{\{\{\{)))/, /^(?:[\s\S]*?--(~)?\}\})/, /^(?:\()/, /^(?:\))/, /^(?:\{\{\{\{)/, /^(?:\}\}\}\})/, /^(?:\{\{(~)?>)/, /^(?:\{\{(~)?#>)/, /^(?:\{\{(~)?#\*?)/, /^(?:\{\{(~)?\/)/, /^(?:\{\{(~)?\^\s*(~)?\}\})/, /^(?:\{\{(~)?\s*else\s*(~)?\}\})/, /^(?:\{\{(~)?\^)/, /^(?:\{\{(~)?\s*else\b)/, /^(?:\{\{(~)?\{)/, /^(?:\{\{(~)?&)/, /^(?:\{\{(~)?!--)/, /^(?:\{\{(~)?![\s\S]*?\}\})/, /^(?:\{\{(~)?\*?)/, /^(?:=)/, /^(?:\.\.)/, /^(?:\.(?=([=~}\s\/.)|])))/, /^(?:[\/.])/, /^(?:\s+)/, /^(?:\}(~)?\}\})/, /^(?:(~)?\}\})/, /^(?:"(\\["]|[^"])*")/, /^(?:'(\\[']|[^'])*')/, /^(?:@)/, /^(?:true(?=([~}\s)])))/, /^(?:false(?=([~}\s)])))/, /^(?:undefined(?=([~}\s)])))/, /^(?:null(?=([~}\s)])))/, /^(?:-?[0-9]+(?:\.[0-9]+)?(?=([~}\s)])))/, /^(?:as\s+\|)/, /^(?:\|)/, /^(?:([^\s!"#%-,\.\/;->@\[-\^`\{-~]+(?=([=~}\s\/.)|]))))/, /^(?:\[(\\\]|[^\]])*\])/, /^(?:.)/, /^(?:$)/];
	        lexer.conditions = { "mu": { "rules": [7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44], "inclusive": false }, "emu": { "rules": [2], "inclusive": false }, "com": { "rules": [6], "inclusive": false }, "raw": { "rules": [3, 4, 5], "inclusive": false }, "INITIAL": { "rules": [0, 1, 44], "inclusive": true } };
	        return lexer;
	    })();
	    parser.lexer = lexer;
	    function Parser() {
	        this.yy = {};
	    }Parser.prototype = parser;parser.Parser = Parser;
	    return new Parser();
	})();exports["default"] = handlebars;
	module.exports = exports["default"];

/***/ }),
/* 87 */
/***/ (function(module, exports, __nested_webpack_require_129022__) {

	'use strict';

	var _interopRequireDefault = __nested_webpack_require_129022__(1)['default'];

	exports.__esModule = true;

	var _visitor = __nested_webpack_require_129022__(88);

	var _visitor2 = _interopRequireDefault(_visitor);

	function WhitespaceControl() {
	  var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

	  this.options = options;
	}
	WhitespaceControl.prototype = new _visitor2['default']();

	WhitespaceControl.prototype.Program = function (program) {
	  var doStandalone = !this.options.ignoreStandalone;

	  var isRoot = !this.isRootSeen;
	  this.isRootSeen = true;

	  var body = program.body;
	  for (var i = 0, l = body.length; i < l; i++) {
	    var current = body[i],
	        strip = this.accept(current);

	    if (!strip) {
	      continue;
	    }

	    var _isPrevWhitespace = isPrevWhitespace(body, i, isRoot),
	        _isNextWhitespace = isNextWhitespace(body, i, isRoot),
	        openStandalone = strip.openStandalone && _isPrevWhitespace,
	        closeStandalone = strip.closeStandalone && _isNextWhitespace,
	        inlineStandalone = strip.inlineStandalone && _isPrevWhitespace && _isNextWhitespace;

	    if (strip.close) {
	      omitRight(body, i, true);
	    }
	    if (strip.open) {
	      omitLeft(body, i, true);
	    }

	    if (doStandalone && inlineStandalone) {
	      omitRight(body, i);

	      if (omitLeft(body, i)) {
	        // If we are on a standalone node, save the indent info for partials
	        if (current.type === 'PartialStatement') {
	          // Pull out the whitespace from the final line
	          current.indent = /([ \t]+$)/.exec(body[i - 1].original)[1];
	        }
	      }
	    }
	    if (doStandalone && openStandalone) {
	      omitRight((current.program || current.inverse).body);

	      // Strip out the previous content node if it's whitespace only
	      omitLeft(body, i);
	    }
	    if (doStandalone && closeStandalone) {
	      // Always strip the next node
	      omitRight(body, i);

	      omitLeft((current.inverse || current.program).body);
	    }
	  }

	  return program;
	};

	WhitespaceControl.prototype.BlockStatement = WhitespaceControl.prototype.DecoratorBlock = WhitespaceControl.prototype.PartialBlockStatement = function (block) {
	  this.accept(block.program);
	  this.accept(block.inverse);

	  // Find the inverse program that is involed with whitespace stripping.
	  var program = block.program || block.inverse,
	      inverse = block.program && block.inverse,
	      firstInverse = inverse,
	      lastInverse = inverse;

	  if (inverse && inverse.chained) {
	    firstInverse = inverse.body[0].program;

	    // Walk the inverse chain to find the last inverse that is actually in the chain.
	    while (lastInverse.chained) {
	      lastInverse = lastInverse.body[lastInverse.body.length - 1].program;
	    }
	  }

	  var strip = {
	    open: block.openStrip.open,
	    close: block.closeStrip.close,

	    // Determine the standalone candiacy. Basically flag our content as being possibly standalone
	    // so our parent can determine if we actually are standalone
	    openStandalone: isNextWhitespace(program.body),
	    closeStandalone: isPrevWhitespace((firstInverse || program).body)
	  };

	  if (block.openStrip.close) {
	    omitRight(program.body, null, true);
	  }

	  if (inverse) {
	    var inverseStrip = block.inverseStrip;

	    if (inverseStrip.open) {
	      omitLeft(program.body, null, true);
	    }

	    if (inverseStrip.close) {
	      omitRight(firstInverse.body, null, true);
	    }
	    if (block.closeStrip.open) {
	      omitLeft(lastInverse.body, null, true);
	    }

	    // Find standalone else statments
	    if (!this.options.ignoreStandalone && isPrevWhitespace(program.body) && isNextWhitespace(firstInverse.body)) {
	      omitLeft(program.body);
	      omitRight(firstInverse.body);
	    }
	  } else if (block.closeStrip.open) {
	    omitLeft(program.body, null, true);
	  }

	  return strip;
	};

	WhitespaceControl.prototype.Decorator = WhitespaceControl.prototype.MustacheStatement = function (mustache) {
	  return mustache.strip;
	};

	WhitespaceControl.prototype.PartialStatement = WhitespaceControl.prototype.CommentStatement = function (node) {
	  /* istanbul ignore next */
	  var strip = node.strip || {};
	  return {
	    inlineStandalone: true,
	    open: strip.open,
	    close: strip.close
	  };
	};

	function isPrevWhitespace(body, i, isRoot) {
	  if (i === undefined) {
	    i = body.length;
	  }

	  // Nodes that end with newlines are considered whitespace (but are special
	  // cased for strip operations)
	  var prev = body[i - 1],
	      sibling = body[i - 2];
	  if (!prev) {
	    return isRoot;
	  }

	  if (prev.type === 'ContentStatement') {
	    return (sibling || !isRoot ? /\r?\n\s*?$/ : /(^|\r?\n)\s*?$/).test(prev.original);
	  }
	}
	function isNextWhitespace(body, i, isRoot) {
	  if (i === undefined) {
	    i = -1;
	  }

	  var next = body[i + 1],
	      sibling = body[i + 2];
	  if (!next) {
	    return isRoot;
	  }

	  if (next.type === 'ContentStatement') {
	    return (sibling || !isRoot ? /^\s*?\r?\n/ : /^\s*?(\r?\n|$)/).test(next.original);
	  }
	}

	// Marks the node to the right of the position as omitted.
	// I.e. {{foo}}' ' will mark the ' ' node as omitted.
	//
	// If i is undefined, then the first child will be marked as such.
	//
	// If mulitple is truthy then all whitespace will be stripped out until non-whitespace
	// content is met.
	function omitRight(body, i, multiple) {
	  var current = body[i == null ? 0 : i + 1];
	  if (!current || current.type !== 'ContentStatement' || !multiple && current.rightStripped) {
	    return;
	  }

	  var original = current.value;
	  current.value = current.value.replace(multiple ? /^\s+/ : /^[ \t]*\r?\n?/, '');
	  current.rightStripped = current.value !== original;
	}

	// Marks the node to the left of the position as omitted.
	// I.e. ' '{{foo}} will mark the ' ' node as omitted.
	//
	// If i is undefined then the last child will be marked as such.
	//
	// If mulitple is truthy then all whitespace will be stripped out until non-whitespace
	// content is met.
	function omitLeft(body, i, multiple) {
	  var current = body[i == null ? body.length - 1 : i - 1];
	  if (!current || current.type !== 'ContentStatement' || !multiple && current.leftStripped) {
	    return;
	  }

	  // We omit the last node if it's whitespace only and not preceded by a non-content node.
	  var original = current.value;
	  current.value = current.value.replace(multiple ? /\s+$/ : /[ \t]+$/, '');
	  current.leftStripped = current.value !== original;
	  return current.leftStripped;
	}

	exports['default'] = WhitespaceControl;
	module.exports = exports['default'];

/***/ }),
/* 88 */
/***/ (function(module, exports, __nested_webpack_require_135807__) {

	'use strict';

	var _interopRequireDefault = __nested_webpack_require_135807__(1)['default'];

	exports.__esModule = true;

	var _exception = __nested_webpack_require_135807__(6);

	var _exception2 = _interopRequireDefault(_exception);

	function Visitor() {
	  this.parents = [];
	}

	Visitor.prototype = {
	  constructor: Visitor,
	  mutating: false,

	  // Visits a given value. If mutating, will replace the value if necessary.
	  acceptKey: function acceptKey(node, name) {
	    var value = this.accept(node[name]);
	    if (this.mutating) {
	      // Hacky sanity check: This may have a few false positives for type for the helper
	      // methods but will generally do the right thing without a lot of overhead.
	      if (value && !Visitor.prototype[value.type]) {
	        throw new _exception2['default']('Unexpected node type "' + value.type + '" found when accepting ' + name + ' on ' + node.type);
	      }
	      node[name] = value;
	    }
	  },

	  // Performs an accept operation with added sanity check to ensure
	  // required keys are not removed.
	  acceptRequired: function acceptRequired(node, name) {
	    this.acceptKey(node, name);

	    if (!node[name]) {
	      throw new _exception2['default'](node.type + ' requires ' + name);
	    }
	  },

	  // Traverses a given array. If mutating, empty respnses will be removed
	  // for child elements.
	  acceptArray: function acceptArray(array) {
	    for (var i = 0, l = array.length; i < l; i++) {
	      this.acceptKey(array, i);

	      if (!array[i]) {
	        array.splice(i, 1);
	        i--;
	        l--;
	      }
	    }
	  },

	  accept: function accept(object) {
	    if (!object) {
	      return;
	    }

	    /* istanbul ignore next: Sanity code */
	    if (!this[object.type]) {
	      throw new _exception2['default']('Unknown type: ' + object.type, object);
	    }

	    if (this.current) {
	      this.parents.unshift(this.current);
	    }
	    this.current = object;

	    var ret = this[object.type](object);

	    this.current = this.parents.shift();

	    if (!this.mutating || ret) {
	      return ret;
	    } else if (ret !== false) {
	      return object;
	    }
	  },

	  Program: function Program(program) {
	    this.acceptArray(program.body);
	  },

	  MustacheStatement: visitSubExpression,
	  Decorator: visitSubExpression,

	  BlockStatement: visitBlock,
	  DecoratorBlock: visitBlock,

	  PartialStatement: visitPartial,
	  PartialBlockStatement: function PartialBlockStatement(partial) {
	    visitPartial.call(this, partial);

	    this.acceptKey(partial, 'program');
	  },

	  ContentStatement: function ContentStatement() /* content */{},
	  CommentStatement: function CommentStatement() /* comment */{},

	  SubExpression: visitSubExpression,

	  PathExpression: function PathExpression() /* path */{},

	  StringLiteral: function StringLiteral() /* string */{},
	  NumberLiteral: function NumberLiteral() /* number */{},
	  BooleanLiteral: function BooleanLiteral() /* bool */{},
	  UndefinedLiteral: function UndefinedLiteral() /* literal */{},
	  NullLiteral: function NullLiteral() /* literal */{},

	  Hash: function Hash(hash) {
	    this.acceptArray(hash.pairs);
	  },
	  HashPair: function HashPair(pair) {
	    this.acceptRequired(pair, 'value');
	  }
	};

	function visitSubExpression(mustache) {
	  this.acceptRequired(mustache, 'path');
	  this.acceptArray(mustache.params);
	  this.acceptKey(mustache, 'hash');
	}
	function visitBlock(block) {
	  visitSubExpression.call(this, block);

	  this.acceptKey(block, 'program');
	  this.acceptKey(block, 'inverse');
	}
	function visitPartial(partial) {
	  this.acceptRequired(partial, 'name');
	  this.acceptArray(partial.params);
	  this.acceptKey(partial, 'hash');
	}

	exports['default'] = Visitor;
	module.exports = exports['default'];

/***/ }),
/* 89 */
/***/ (function(module, exports, __nested_webpack_require_139663__) {

	'use strict';

	var _interopRequireDefault = __nested_webpack_require_139663__(1)['default'];

	exports.__esModule = true;
	exports.SourceLocation = SourceLocation;
	exports.id = id;
	exports.stripFlags = stripFlags;
	exports.stripComment = stripComment;
	exports.preparePath = preparePath;
	exports.prepareMustache = prepareMustache;
	exports.prepareRawBlock = prepareRawBlock;
	exports.prepareBlock = prepareBlock;
	exports.prepareProgram = prepareProgram;
	exports.preparePartialBlock = preparePartialBlock;

	var _exception = __nested_webpack_require_139663__(6);

	var _exception2 = _interopRequireDefault(_exception);

	function validateClose(open, close) {
	  close = close.path ? close.path.original : close;

	  if (open.path.original !== close) {
	    var errorNode = { loc: open.path.loc };

	    throw new _exception2['default'](open.path.original + " doesn't match " + close, errorNode);
	  }
	}

	function SourceLocation(source, locInfo) {
	  this.source = source;
	  this.start = {
	    line: locInfo.first_line,
	    column: locInfo.first_column
	  };
	  this.end = {
	    line: locInfo.last_line,
	    column: locInfo.last_column
	  };
	}

	function id(token) {
	  if (/^\[.*\]$/.test(token)) {
	    return token.substring(1, token.length - 1);
	  } else {
	    return token;
	  }
	}

	function stripFlags(open, close) {
	  return {
	    open: open.charAt(2) === '~',
	    close: close.charAt(close.length - 3) === '~'
	  };
	}

	function stripComment(comment) {
	  return comment.replace(/^\{\{~?!-?-?/, '').replace(/-?-?~?\}\}$/, '');
	}

	function preparePath(data, parts, loc) {
	  loc = this.locInfo(loc);

	  var original = data ? '@' : '',
	      dig = [],
	      depth = 0;

	  for (var i = 0, l = parts.length; i < l; i++) {
	    var part = parts[i].part,

	    // If we have [] syntax then we do not treat path references as operators,
	    // i.e. foo.[this] resolves to approximately context.foo['this']
	    isLiteral = parts[i].original !== part;
	    original += (parts[i].separator || '') + part;

	    if (!isLiteral && (part === '..' || part === '.' || part === 'this')) {
	      if (dig.length > 0) {
	        throw new _exception2['default']('Invalid path: ' + original, { loc: loc });
	      } else if (part === '..') {
	        depth++;
	      }
	    } else {
	      dig.push(part);
	    }
	  }

	  return {
	    type: 'PathExpression',
	    data: data,
	    depth: depth,
	    parts: dig,
	    original: original,
	    loc: loc
	  };
	}

	function prepareMustache(path, params, hash, open, strip, locInfo) {
	  // Must use charAt to support IE pre-10
	  var escapeFlag = open.charAt(3) || open.charAt(2),
	      escaped = escapeFlag !== '{' && escapeFlag !== '&';

	  var decorator = /\*/.test(open);
	  return {
	    type: decorator ? 'Decorator' : 'MustacheStatement',
	    path: path,
	    params: params,
	    hash: hash,
	    escaped: escaped,
	    strip: strip,
	    loc: this.locInfo(locInfo)
	  };
	}

	function prepareRawBlock(openRawBlock, contents, close, locInfo) {
	  validateClose(openRawBlock, close);

	  locInfo = this.locInfo(locInfo);
	  var program = {
	    type: 'Program',
	    body: contents,
	    strip: {},
	    loc: locInfo
	  };

	  return {
	    type: 'BlockStatement',
	    path: openRawBlock.path,
	    params: openRawBlock.params,
	    hash: openRawBlock.hash,
	    program: program,
	    openStrip: {},
	    inverseStrip: {},
	    closeStrip: {},
	    loc: locInfo
	  };
	}

	function prepareBlock(openBlock, program, inverseAndProgram, close, inverted, locInfo) {
	  if (close && close.path) {
	    validateClose(openBlock, close);
	  }

	  var decorator = /\*/.test(openBlock.open);

	  program.blockParams = openBlock.blockParams;

	  var inverse = undefined,
	      inverseStrip = undefined;

	  if (inverseAndProgram) {
	    if (decorator) {
	      throw new _exception2['default']('Unexpected inverse block on decorator', inverseAndProgram);
	    }

	    if (inverseAndProgram.chain) {
	      inverseAndProgram.program.body[0].closeStrip = close.strip;
	    }

	    inverseStrip = inverseAndProgram.strip;
	    inverse = inverseAndProgram.program;
	  }

	  if (inverted) {
	    inverted = inverse;
	    inverse = program;
	    program = inverted;
	  }

	  return {
	    type: decorator ? 'DecoratorBlock' : 'BlockStatement',
	    path: openBlock.path,
	    params: openBlock.params,
	    hash: openBlock.hash,
	    program: program,
	    inverse: inverse,
	    openStrip: openBlock.strip,
	    inverseStrip: inverseStrip,
	    closeStrip: close && close.strip,
	    loc: this.locInfo(locInfo)
	  };
	}

	function prepareProgram(statements, loc) {
	  if (!loc && statements.length) {
	    var firstLoc = statements[0].loc,
	        lastLoc = statements[statements.length - 1].loc;

	    /* istanbul ignore else */
	    if (firstLoc && lastLoc) {
	      loc = {
	        source: firstLoc.source,
	        start: {
	          line: firstLoc.start.line,
	          column: firstLoc.start.column
	        },
	        end: {
	          line: lastLoc.end.line,
	          column: lastLoc.end.column
	        }
	      };
	    }
	  }

	  return {
	    type: 'Program',
	    body: statements,
	    strip: {},
	    loc: loc
	  };
	}

	function preparePartialBlock(open, program, close, locInfo) {
	  validateClose(open, close);

	  return {
	    type: 'PartialBlockStatement',
	    name: open.path,
	    params: open.params,
	    hash: open.hash,
	    program: program,
	    openStrip: open.strip,
	    closeStrip: close && close.strip,
	    loc: this.locInfo(locInfo)
	  };
	}

/***/ }),
/* 90 */
/***/ (function(module, exports, __nested_webpack_require_145258__) {

	/* eslint-disable new-cap */

	'use strict';

	var _Object$create = __nested_webpack_require_145258__(74)['default'];

	var _interopRequireDefault = __nested_webpack_require_145258__(1)['default'];

	exports.__esModule = true;
	exports.Compiler = Compiler;
	exports.precompile = precompile;
	exports.compile = compile;

	var _exception = __nested_webpack_require_145258__(6);

	var _exception2 = _interopRequireDefault(_exception);

	var _utils = __nested_webpack_require_145258__(5);

	var _ast = __nested_webpack_require_145258__(84);

	var _ast2 = _interopRequireDefault(_ast);

	var slice = [].slice;

	function Compiler() {}

	// the foundHelper register will disambiguate helper lookup from finding a
	// function in a context. This is necessary for mustache compatibility, which
	// requires that context functions in blocks are evaluated by blockHelperMissing,
	// and then proceed as if the resulting value was provided to blockHelperMissing.

	Compiler.prototype = {
	  compiler: Compiler,

	  equals: function equals(other) {
	    var len = this.opcodes.length;
	    if (other.opcodes.length !== len) {
	      return false;
	    }

	    for (var i = 0; i < len; i++) {
	      var opcode = this.opcodes[i],
	          otherOpcode = other.opcodes[i];
	      if (opcode.opcode !== otherOpcode.opcode || !argEquals(opcode.args, otherOpcode.args)) {
	        return false;
	      }
	    }

	    // We know that length is the same between the two arrays because they are directly tied
	    // to the opcode behavior above.
	    len = this.children.length;
	    for (var i = 0; i < len; i++) {
	      if (!this.children[i].equals(other.children[i])) {
	        return false;
	      }
	    }

	    return true;
	  },

	  guid: 0,

	  compile: function compile(program, options) {
	    this.sourceNode = [];
	    this.opcodes = [];
	    this.children = [];
	    this.options = options;
	    this.stringParams = options.stringParams;
	    this.trackIds = options.trackIds;

	    options.blockParams = options.blockParams || [];

	    options.knownHelpers = _utils.extend(_Object$create(null), {
	      helperMissing: true,
	      blockHelperMissing: true,
	      each: true,
	      'if': true,
	      unless: true,
	      'with': true,
	      log: true,
	      lookup: true
	    }, options.knownHelpers);

	    return this.accept(program);
	  },

	  compileProgram: function compileProgram(program) {
	    var childCompiler = new this.compiler(),
	        // eslint-disable-line new-cap
	    result = childCompiler.compile(program, this.options),
	        guid = this.guid++;

	    this.usePartial = this.usePartial || result.usePartial;

	    this.children[guid] = result;
	    this.useDepths = this.useDepths || result.useDepths;

	    return guid;
	  },

	  accept: function accept(node) {
	    /* istanbul ignore next: Sanity code */
	    if (!this[node.type]) {
	      throw new _exception2['default']('Unknown type: ' + node.type, node);
	    }

	    this.sourceNode.unshift(node);
	    var ret = this[node.type](node);
	    this.sourceNode.shift();
	    return ret;
	  },

	  Program: function Program(program) {
	    this.options.blockParams.unshift(program.blockParams);

	    var body = program.body,
	        bodyLength = body.length;
	    for (var i = 0; i < bodyLength; i++) {
	      this.accept(body[i]);
	    }

	    this.options.blockParams.shift();

	    this.isSimple = bodyLength === 1;
	    this.blockParams = program.blockParams ? program.blockParams.length : 0;

	    return this;
	  },

	  BlockStatement: function BlockStatement(block) {
	    transformLiteralToPath(block);

	    var program = block.program,
	        inverse = block.inverse;

	    program = program && this.compileProgram(program);
	    inverse = inverse && this.compileProgram(inverse);

	    var type = this.classifySexpr(block);

	    if (type === 'helper') {
	      this.helperSexpr(block, program, inverse);
	    } else if (type === 'simple') {
	      this.simpleSexpr(block);

	      // now that the simple mustache is resolved, we need to
	      // evaluate it by executing `blockHelperMissing`
	      this.opcode('pushProgram', program);
	      this.opcode('pushProgram', inverse);
	      this.opcode('emptyHash');
	      this.opcode('blockValue', block.path.original);
	    } else {
	      this.ambiguousSexpr(block, program, inverse);

	      // now that the simple mustache is resolved, we need to
	      // evaluate it by executing `blockHelperMissing`
	      this.opcode('pushProgram', program);
	      this.opcode('pushProgram', inverse);
	      this.opcode('emptyHash');
	      this.opcode('ambiguousBlockValue');
	    }

	    this.opcode('append');
	  },

	  DecoratorBlock: function DecoratorBlock(decorator) {
	    var program = decorator.program && this.compileProgram(decorator.program);
	    var params = this.setupFullMustacheParams(decorator, program, undefined),
	        path = decorator.path;

	    this.useDecorators = true;
	    this.opcode('registerDecorator', params.length, path.original);
	  },

	  PartialStatement: function PartialStatement(partial) {
	    this.usePartial = true;

	    var program = partial.program;
	    if (program) {
	      program = this.compileProgram(partial.program);
	    }

	    var params = partial.params;
	    if (params.length > 1) {
	      throw new _exception2['default']('Unsupported number of partial arguments: ' + params.length, partial);
	    } else if (!params.length) {
	      if (this.options.explicitPartialContext) {
	        this.opcode('pushLiteral', 'undefined');
	      } else {
	        params.push({ type: 'PathExpression', parts: [], depth: 0 });
	      }
	    }

	    var partialName = partial.name.original,
	        isDynamic = partial.name.type === 'SubExpression';
	    if (isDynamic) {
	      this.accept(partial.name);
	    }

	    this.setupFullMustacheParams(partial, program, undefined, true);

	    var indent = partial.indent || '';
	    if (this.options.preventIndent && indent) {
	      this.opcode('appendContent', indent);
	      indent = '';
	    }

	    this.opcode('invokePartial', isDynamic, partialName, indent);
	    this.opcode('append');
	  },
	  PartialBlockStatement: function PartialBlockStatement(partialBlock) {
	    this.PartialStatement(partialBlock);
	  },

	  MustacheStatement: function MustacheStatement(mustache) {
	    this.SubExpression(mustache);

	    if (mustache.escaped && !this.options.noEscape) {
	      this.opcode('appendEscaped');
	    } else {
	      this.opcode('append');
	    }
	  },
	  Decorator: function Decorator(decorator) {
	    this.DecoratorBlock(decorator);
	  },

	  ContentStatement: function ContentStatement(content) {
	    if (content.value) {
	      this.opcode('appendContent', content.value);
	    }
	  },

	  CommentStatement: function CommentStatement() {},

	  SubExpression: function SubExpression(sexpr) {
	    transformLiteralToPath(sexpr);
	    var type = this.classifySexpr(sexpr);

	    if (type === 'simple') {
	      this.simpleSexpr(sexpr);
	    } else if (type === 'helper') {
	      this.helperSexpr(sexpr);
	    } else {
	      this.ambiguousSexpr(sexpr);
	    }
	  },
	  ambiguousSexpr: function ambiguousSexpr(sexpr, program, inverse) {
	    var path = sexpr.path,
	        name = path.parts[0],
	        isBlock = program != null || inverse != null;

	    this.opcode('getContext', path.depth);

	    this.opcode('pushProgram', program);
	    this.opcode('pushProgram', inverse);

	    path.strict = true;
	    this.accept(path);

	    this.opcode('invokeAmbiguous', name, isBlock);
	  },

	  simpleSexpr: function simpleSexpr(sexpr) {
	    var path = sexpr.path;
	    path.strict = true;
	    this.accept(path);
	    this.opcode('resolvePossibleLambda');
	  },

	  helperSexpr: function helperSexpr(sexpr, program, inverse) {
	    var params = this.setupFullMustacheParams(sexpr, program, inverse),
	        path = sexpr.path,
	        name = path.parts[0];

	    if (this.options.knownHelpers[name]) {
	      this.opcode('invokeKnownHelper', params.length, name);
	    } else if (this.options.knownHelpersOnly) {
	      throw new _exception2['default']('You specified knownHelpersOnly, but used the unknown helper ' + name, sexpr);
	    } else {
	      path.strict = true;
	      path.falsy = true;

	      this.accept(path);
	      this.opcode('invokeHelper', params.length, path.original, _ast2['default'].helpers.simpleId(path));
	    }
	  },

	  PathExpression: function PathExpression(path) {
	    this.addDepth(path.depth);
	    this.opcode('getContext', path.depth);

	    var name = path.parts[0],
	        scoped = _ast2['default'].helpers.scopedId(path),
	        blockParamId = !path.depth && !scoped && this.blockParamIndex(name);

	    if (blockParamId) {
	      this.opcode('lookupBlockParam', blockParamId, path.parts);
	    } else if (!name) {
	      // Context reference, i.e. `{{foo .}}` or `{{foo ..}}`
	      this.opcode('pushContext');
	    } else if (path.data) {
	      this.options.data = true;
	      this.opcode('lookupData', path.depth, path.parts, path.strict);
	    } else {
	      this.opcode('lookupOnContext', path.parts, path.falsy, path.strict, scoped);
	    }
	  },

	  StringLiteral: function StringLiteral(string) {
	    this.opcode('pushString', string.value);
	  },

	  NumberLiteral: function NumberLiteral(number) {
	    this.opcode('pushLiteral', number.value);
	  },

	  BooleanLiteral: function BooleanLiteral(bool) {
	    this.opcode('pushLiteral', bool.value);
	  },

	  UndefinedLiteral: function UndefinedLiteral() {
	    this.opcode('pushLiteral', 'undefined');
	  },

	  NullLiteral: function NullLiteral() {
	    this.opcode('pushLiteral', 'null');
	  },

	  Hash: function Hash(hash) {
	    var pairs = hash.pairs,
	        i = 0,
	        l = pairs.length;

	    this.opcode('pushHash');

	    for (; i < l; i++) {
	      this.pushParam(pairs[i].value);
	    }
	    while (i--) {
	      this.opcode('assignToHash', pairs[i].key);
	    }
	    this.opcode('popHash');
	  },

	  // HELPERS
	  opcode: function opcode(name) {
	    this.opcodes.push({
	      opcode: name,
	      args: slice.call(arguments, 1),
	      loc: this.sourceNode[0].loc
	    });
	  },

	  addDepth: function addDepth(depth) {
	    if (!depth) {
	      return;
	    }

	    this.useDepths = true;
	  },

	  classifySexpr: function classifySexpr(sexpr) {
	    var isSimple = _ast2['default'].helpers.simpleId(sexpr.path);

	    var isBlockParam = isSimple && !!this.blockParamIndex(sexpr.path.parts[0]);

	    // a mustache is an eligible helper if:
	    // * its id is simple (a single part, not `this` or `..`)
	    var isHelper = !isBlockParam && _ast2['default'].helpers.helperExpression(sexpr);

	    // if a mustache is an eligible helper but not a definite
	    // helper, it is ambiguous, and will be resolved in a later
	    // pass or at runtime.
	    var isEligible = !isBlockParam && (isHelper || isSimple);

	    // if ambiguous, we can possibly resolve the ambiguity now
	    // An eligible helper is one that does not have a complex path, i.e. `this.foo`, `../foo` etc.
	    if (isEligible && !isHelper) {
	      var _name = sexpr.path.parts[0],
	          options = this.options;
	      if (options.knownHelpers[_name]) {
	        isHelper = true;
	      } else if (options.knownHelpersOnly) {
	        isEligible = false;
	      }
	    }

	    if (isHelper) {
	      return 'helper';
	    } else if (isEligible) {
	      return 'ambiguous';
	    } else {
	      return 'simple';
	    }
	  },

	  pushParams: function pushParams(params) {
	    for (var i = 0, l = params.length; i < l; i++) {
	      this.pushParam(params[i]);
	    }
	  },

	  pushParam: function pushParam(val) {
	    var value = val.value != null ? val.value : val.original || '';

	    if (this.stringParams) {
	      if (value.replace) {
	        value = value.replace(/^(\.?\.\/)*/g, '').replace(/\//g, '.');
	      }

	      if (val.depth) {
	        this.addDepth(val.depth);
	      }
	      this.opcode('getContext', val.depth || 0);
	      this.opcode('pushStringParam', value, val.type);

	      if (val.type === 'SubExpression') {
	        // SubExpressions get evaluated and passed in
	        // in string params mode.
	        this.accept(val);
	      }
	    } else {
	      if (this.trackIds) {
	        var blockParamIndex = undefined;
	        if (val.parts && !_ast2['default'].helpers.scopedId(val) && !val.depth) {
	          blockParamIndex = this.blockParamIndex(val.parts[0]);
	        }
	        if (blockParamIndex) {
	          var blockParamChild = val.parts.slice(1).join('.');
	          this.opcode('pushId', 'BlockParam', blockParamIndex, blockParamChild);
	        } else {
	          value = val.original || value;
	          if (value.replace) {
	            value = value.replace(/^this(?:\.|$)/, '').replace(/^\.\//, '').replace(/^\.$/, '');
	          }

	          this.opcode('pushId', val.type, value);
	        }
	      }
	      this.accept(val);
	    }
	  },

	  setupFullMustacheParams: function setupFullMustacheParams(sexpr, program, inverse, omitEmpty) {
	    var params = sexpr.params;
	    this.pushParams(params);

	    this.opcode('pushProgram', program);
	    this.opcode('pushProgram', inverse);

	    if (sexpr.hash) {
	      this.accept(sexpr.hash);
	    } else {
	      this.opcode('emptyHash', omitEmpty);
	    }

	    return params;
	  },

	  blockParamIndex: function blockParamIndex(name) {
	    for (var depth = 0, len = this.options.blockParams.length; depth < len; depth++) {
	      var blockParams = this.options.blockParams[depth],
	          param = blockParams && _utils.indexOf(blockParams, name);
	      if (blockParams && param >= 0) {
	        return [depth, param];
	      }
	    }
	  }
	};

	function precompile(input, options, env) {
	  if (input == null || typeof input !== 'string' && input.type !== 'Program') {
	    throw new _exception2['default']('You must pass a string or Handlebars AST to Handlebars.precompile. You passed ' + input);
	  }

	  options = options || {};
	  if (!('data' in options)) {
	    options.data = true;
	  }
	  if (options.compat) {
	    options.useDepths = true;
	  }

	  var ast = env.parse(input, options),
	      environment = new env.Compiler().compile(ast, options);
	  return new env.JavaScriptCompiler().compile(environment, options);
	}

	function compile(input, options, env) {
	  if (options === undefined) options = {};

	  if (input == null || typeof input !== 'string' && input.type !== 'Program') {
	    throw new _exception2['default']('You must pass a string or Handlebars AST to Handlebars.compile. You passed ' + input);
	  }

	  options = _utils.extend({}, options);
	  if (!('data' in options)) {
	    options.data = true;
	  }
	  if (options.compat) {
	    options.useDepths = true;
	  }

	  var compiled = undefined;

	  function compileInput() {
	    var ast = env.parse(input, options),
	        environment = new env.Compiler().compile(ast, options),
	        templateSpec = new env.JavaScriptCompiler().compile(environment, options, undefined, true);
	    return env.template(templateSpec);
	  }

	  // Template is only compiled on first use and cached after that point.
	  function ret(context, execOptions) {
	    if (!compiled) {
	      compiled = compileInput();
	    }
	    return compiled.call(this, context, execOptions);
	  }
	  ret._setup = function (setupOptions) {
	    if (!compiled) {
	      compiled = compileInput();
	    }
	    return compiled._setup(setupOptions);
	  };
	  ret._child = function (i, data, blockParams, depths) {
	    if (!compiled) {
	      compiled = compileInput();
	    }
	    return compiled._child(i, data, blockParams, depths);
	  };
	  return ret;
	}

	function argEquals(a, b) {
	  if (a === b) {
	    return true;
	  }

	  if (_utils.isArray(a) && _utils.isArray(b) && a.length === b.length) {
	    for (var i = 0; i < a.length; i++) {
	      if (!argEquals(a[i], b[i])) {
	        return false;
	      }
	    }
	    return true;
	  }
	}

	function transformLiteralToPath(sexpr) {
	  if (!sexpr.path.parts) {
	    var literal = sexpr.path;
	    // Casting to string here to make false and 0 literal values play nicely with the rest
	    // of the system.
	    sexpr.path = {
	      type: 'PathExpression',
	      data: false,
	      depth: 0,
	      parts: [literal.original + ''],
	      original: literal.original + '',
	      loc: literal.loc
	    };
	  }
	}

/***/ }),
/* 91 */
/***/ (function(module, exports, __nested_webpack_require_161675__) {

	'use strict';

	var _Object$keys = __nested_webpack_require_161675__(60)['default'];

	var _interopRequireDefault = __nested_webpack_require_161675__(1)['default'];

	exports.__esModule = true;

	var _base = __nested_webpack_require_161675__(4);

	var _exception = __nested_webpack_require_161675__(6);

	var _exception2 = _interopRequireDefault(_exception);

	var _utils = __nested_webpack_require_161675__(5);

	var _codeGen = __nested_webpack_require_161675__(92);

	var _codeGen2 = _interopRequireDefault(_codeGen);

	function Literal(value) {
	  this.value = value;
	}

	function JavaScriptCompiler() {}

	JavaScriptCompiler.prototype = {
	  // PUBLIC API: You can override these methods in a subclass to provide
	  // alternative compiled forms for name lookup and buffering semantics
	  nameLookup: function nameLookup(parent, name /*,  type */) {
	    return this.internalNameLookup(parent, name);
	  },
	  depthedLookup: function depthedLookup(name) {
	    return [this.aliasable('container.lookup'), '(depths, ', JSON.stringify(name), ')'];
	  },

	  compilerInfo: function compilerInfo() {
	    var revision = _base.COMPILER_REVISION,
	        versions = _base.REVISION_CHANGES[revision];
	    return [revision, versions];
	  },

	  appendToBuffer: function appendToBuffer(source, location, explicit) {
	    // Force a source as this simplifies the merge logic.
	    if (!_utils.isArray(source)) {
	      source = [source];
	    }
	    source = this.source.wrap(source, location);

	    if (this.environment.isSimple) {
	      return ['return ', source, ';'];
	    } else if (explicit) {
	      // This is a case where the buffer operation occurs as a child of another
	      // construct, generally braces. We have to explicitly output these buffer
	      // operations to ensure that the emitted code goes in the correct location.
	      return ['buffer += ', source, ';'];
	    } else {
	      source.appendToBuffer = true;
	      return source;
	    }
	  },

	  initializeBuffer: function initializeBuffer() {
	    return this.quotedString('');
	  },
	  // END PUBLIC API
	  internalNameLookup: function internalNameLookup(parent, name) {
	    this.lookupPropertyFunctionIsUsed = true;
	    return ['lookupProperty(', parent, ',', JSON.stringify(name), ')'];
	  },

	  lookupPropertyFunctionIsUsed: false,

	  compile: function compile(environment, options, context, asObject) {
	    this.environment = environment;
	    this.options = options;
	    this.stringParams = this.options.stringParams;
	    this.trackIds = this.options.trackIds;
	    this.precompile = !asObject;

	    this.name = this.environment.name;
	    this.isChild = !!context;
	    this.context = context || {
	      decorators: [],
	      programs: [],
	      environments: []
	    };

	    this.preamble();

	    this.stackSlot = 0;
	    this.stackVars = [];
	    this.aliases = {};
	    this.registers = { list: [] };
	    this.hashes = [];
	    this.compileStack = [];
	    this.inlineStack = [];
	    this.blockParams = [];

	    this.compileChildren(environment, options);

	    this.useDepths = this.useDepths || environment.useDepths || environment.useDecorators || this.options.compat;
	    this.useBlockParams = this.useBlockParams || environment.useBlockParams;

	    var opcodes = environment.opcodes,
	        opcode = undefined,
	        firstLoc = undefined,
	        i = undefined,
	        l = undefined;

	    for (i = 0, l = opcodes.length; i < l; i++) {
	      opcode = opcodes[i];

	      this.source.currentLocation = opcode.loc;
	      firstLoc = firstLoc || opcode.loc;
	      this[opcode.opcode].apply(this, opcode.args);
	    }

	    // Flush any trailing content that might be pending.
	    this.source.currentLocation = firstLoc;
	    this.pushSource('');

	    /* istanbul ignore next */
	    if (this.stackSlot || this.inlineStack.length || this.compileStack.length) {
	      throw new _exception2['default']('Compile completed with content left on stack');
	    }

	    if (!this.decorators.isEmpty()) {
	      this.useDecorators = true;

	      this.decorators.prepend(['var decorators = container.decorators, ', this.lookupPropertyFunctionVarDeclaration(), ';\n']);
	      this.decorators.push('return fn;');

	      if (asObject) {
	        this.decorators = Function.apply(this, ['fn', 'props', 'container', 'depth0', 'data', 'blockParams', 'depths', this.decorators.merge()]);
	      } else {
	        this.decorators.prepend('function(fn, props, container, depth0, data, blockParams, depths) {\n');
	        this.decorators.push('}\n');
	        this.decorators = this.decorators.merge();
	      }
	    } else {
	      this.decorators = undefined;
	    }

	    var fn = this.createFunctionContext(asObject);
	    if (!this.isChild) {
	      var ret = {
	        compiler: this.compilerInfo(),
	        main: fn
	      };

	      if (this.decorators) {
	        ret.main_d = this.decorators; // eslint-disable-line camelcase
	        ret.useDecorators = true;
	      }

	      var _context = this.context;
	      var programs = _context.programs;
	      var decorators = _context.decorators;

	      for (i = 0, l = programs.length; i < l; i++) {
	        if (programs[i]) {
	          ret[i] = programs[i];
	          if (decorators[i]) {
	            ret[i + '_d'] = decorators[i];
	            ret.useDecorators = true;
	          }
	        }
	      }

	      if (this.environment.usePartial) {
	        ret.usePartial = true;
	      }
	      if (this.options.data) {
	        ret.useData = true;
	      }
	      if (this.useDepths) {
	        ret.useDepths = true;
	      }
	      if (this.useBlockParams) {
	        ret.useBlockParams = true;
	      }
	      if (this.options.compat) {
	        ret.compat = true;
	      }

	      if (!asObject) {
	        ret.compiler = JSON.stringify(ret.compiler);

	        this.source.currentLocation = { start: { line: 1, column: 0 } };
	        ret = this.objectLiteral(ret);

	        if (options.srcName) {
	          ret = ret.toStringWithSourceMap({ file: options.destName });
	          ret.map = ret.map && ret.map.toString();
	        } else {
	          ret = ret.toString();
	        }
	      } else {
	        ret.compilerOptions = this.options;
	      }

	      return ret;
	    } else {
	      return fn;
	    }
	  },

	  preamble: function preamble() {
	    // track the last context pushed into place to allow skipping the
	    // getContext opcode when it would be a noop
	    this.lastContext = 0;
	    this.source = new _codeGen2['default'](this.options.srcName);
	    this.decorators = new _codeGen2['default'](this.options.srcName);
	  },

	  createFunctionContext: function createFunctionContext(asObject) {
	    // istanbul ignore next

	    var _this = this;

	    var varDeclarations = '';

	    var locals = this.stackVars.concat(this.registers.list);
	    if (locals.length > 0) {
	      varDeclarations += ', ' + locals.join(', ');
	    }

	    // Generate minimizer alias mappings
	    //
	    // When using true SourceNodes, this will update all references to the given alias
	    // as the source nodes are reused in situ. For the non-source node compilation mode,
	    // aliases will not be used, but this case is already being run on the client and
	    // we aren't concern about minimizing the template size.
	    var aliasCount = 0;
	    _Object$keys(this.aliases).forEach(function (alias) {
	      var node = _this.aliases[alias];
	      if (node.children && node.referenceCount > 1) {
	        varDeclarations += ', alias' + ++aliasCount + '=' + alias;
	        node.children[0] = 'alias' + aliasCount;
	      }
	    });

	    if (this.lookupPropertyFunctionIsUsed) {
	      varDeclarations += ', ' + this.lookupPropertyFunctionVarDeclaration();
	    }

	    var params = ['container', 'depth0', 'helpers', 'partials', 'data'];

	    if (this.useBlockParams || this.useDepths) {
	      params.push('blockParams');
	    }
	    if (this.useDepths) {
	      params.push('depths');
	    }

	    // Perform a second pass over the output to merge content when possible
	    var source = this.mergeSource(varDeclarations);

	    if (asObject) {
	      params.push(source);

	      return Function.apply(this, params);
	    } else {
	      return this.source.wrap(['function(', params.join(','), ') {\n  ', source, '}']);
	    }
	  },
	  mergeSource: function mergeSource(varDeclarations) {
	    var isSimple = this.environment.isSimple,
	        appendOnly = !this.forceBuffer,
	        appendFirst = undefined,
	        sourceSeen = undefined,
	        bufferStart = undefined,
	        bufferEnd = undefined;
	    this.source.each(function (line) {
	      if (line.appendToBuffer) {
	        if (bufferStart) {
	          line.prepend('  + ');
	        } else {
	          bufferStart = line;
	        }
	        bufferEnd = line;
	      } else {
	        if (bufferStart) {
	          if (!sourceSeen) {
	            appendFirst = true;
	          } else {
	            bufferStart.prepend('buffer += ');
	          }
	          bufferEnd.add(';');
	          bufferStart = bufferEnd = undefined;
	        }

	        sourceSeen = true;
	        if (!isSimple) {
	          appendOnly = false;
	        }
	      }
	    });

	    if (appendOnly) {
	      if (bufferStart) {
	        bufferStart.prepend('return ');
	        bufferEnd.add(';');
	      } else if (!sourceSeen) {
	        this.source.push('return "";');
	      }
	    } else {
	      varDeclarations += ', buffer = ' + (appendFirst ? '' : this.initializeBuffer());

	      if (bufferStart) {
	        bufferStart.prepend('return buffer + ');
	        bufferEnd.add(';');
	      } else {
	        this.source.push('return buffer;');
	      }
	    }

	    if (varDeclarations) {
	      this.source.prepend('var ' + varDeclarations.substring(2) + (appendFirst ? '' : ';\n'));
	    }

	    return this.source.merge();
	  },

	  lookupPropertyFunctionVarDeclaration: function lookupPropertyFunctionVarDeclaration() {
	    return '\n      lookupProperty = container.lookupProperty || function(parent, propertyName) {\n        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {\n          return parent[propertyName];\n        }\n        return undefined\n    }\n    '.trim();
	  },

	  // [blockValue]
	  //
	  // On stack, before: hash, inverse, program, value
	  // On stack, after: return value of blockHelperMissing
	  //
	  // The purpose of this opcode is to take a block of the form
	  // `{{#this.foo}}...{{/this.foo}}`, resolve the value of `foo`, and
	  // replace it on the stack with the result of properly
	  // invoking blockHelperMissing.
	  blockValue: function blockValue(name) {
	    var blockHelperMissing = this.aliasable('container.hooks.blockHelperMissing'),
	        params = [this.contextName(0)];
	    this.setupHelperArgs(name, 0, params);

	    var blockName = this.popStack();
	    params.splice(1, 0, blockName);

	    this.push(this.source.functionCall(blockHelperMissing, 'call', params));
	  },

	  // [ambiguousBlockValue]
	  //
	  // On stack, before: hash, inverse, program, value
	  // Compiler value, before: lastHelper=value of last found helper, if any
	  // On stack, after, if no lastHelper: same as [blockValue]
	  // On stack, after, if lastHelper: value
	  ambiguousBlockValue: function ambiguousBlockValue() {
	    // We're being a bit cheeky and reusing the options value from the prior exec
	    var blockHelperMissing = this.aliasable('container.hooks.blockHelperMissing'),
	        params = [this.contextName(0)];
	    this.setupHelperArgs('', 0, params, true);

	    this.flushInline();

	    var current = this.topStack();
	    params.splice(1, 0, current);

	    this.pushSource(['if (!', this.lastHelper, ') { ', current, ' = ', this.source.functionCall(blockHelperMissing, 'call', params), '}']);
	  },

	  // [appendContent]
	  //
	  // On stack, before: ...
	  // On stack, after: ...
	  //
	  // Appends the string value of `content` to the current buffer
	  appendContent: function appendContent(content) {
	    if (this.pendingContent) {
	      content = this.pendingContent + content;
	    } else {
	      this.pendingLocation = this.source.currentLocation;
	    }

	    this.pendingContent = content;
	  },

	  // [append]
	  //
	  // On stack, before: value, ...
	  // On stack, after: ...
	  //
	  // Coerces `value` to a String and appends it to the current buffer.
	  //
	  // If `value` is truthy, or 0, it is coerced into a string and appended
	  // Otherwise, the empty string is appended
	  append: function append() {
	    if (this.isInline()) {
	      this.replaceStack(function (current) {
	        return [' != null ? ', current, ' : ""'];
	      });

	      this.pushSource(this.appendToBuffer(this.popStack()));
	    } else {
	      var local = this.popStack();
	      this.pushSource(['if (', local, ' != null) { ', this.appendToBuffer(local, undefined, true), ' }']);
	      if (this.environment.isSimple) {
	        this.pushSource(['else { ', this.appendToBuffer("''", undefined, true), ' }']);
	      }
	    }
	  },

	  // [appendEscaped]
	  //
	  // On stack, before: value, ...
	  // On stack, after: ...
	  //
	  // Escape `value` and append it to the buffer
	  appendEscaped: function appendEscaped() {
	    this.pushSource(this.appendToBuffer([this.aliasable('container.escapeExpression'), '(', this.popStack(), ')']));
	  },

	  // [getContext]
	  //
	  // On stack, before: ...
	  // On stack, after: ...
	  // Compiler value, after: lastContext=depth
	  //
	  // Set the value of the `lastContext` compiler value to the depth
	  getContext: function getContext(depth) {
	    this.lastContext = depth;
	  },

	  // [pushContext]
	  //
	  // On stack, before: ...
	  // On stack, after: currentContext, ...
	  //
	  // Pushes the value of the current context onto the stack.
	  pushContext: function pushContext() {
	    this.pushStackLiteral(this.contextName(this.lastContext));
	  },

	  // [lookupOnContext]
	  //
	  // On stack, before: ...
	  // On stack, after: currentContext[name], ...
	  //
	  // Looks up the value of `name` on the current context and pushes
	  // it onto the stack.
	  lookupOnContext: function lookupOnContext(parts, falsy, strict, scoped) {
	    var i = 0;

	    if (!scoped && this.options.compat && !this.lastContext) {
	      // The depthed query is expected to handle the undefined logic for the root level that
	      // is implemented below, so we evaluate that directly in compat mode
	      this.push(this.depthedLookup(parts[i++]));
	    } else {
	      this.pushContext();
	    }

	    this.resolvePath('context', parts, i, falsy, strict);
	  },

	  // [lookupBlockParam]
	  //
	  // On stack, before: ...
	  // On stack, after: blockParam[name], ...
	  //
	  // Looks up the value of `parts` on the given block param and pushes
	  // it onto the stack.
	  lookupBlockParam: function lookupBlockParam(blockParamId, parts) {
	    this.useBlockParams = true;

	    this.push(['blockParams[', blockParamId[0], '][', blockParamId[1], ']']);
	    this.resolvePath('context', parts, 1);
	  },

	  // [lookupData]
	  //
	  // On stack, before: ...
	  // On stack, after: data, ...
	  //
	  // Push the data lookup operator
	  lookupData: function lookupData(depth, parts, strict) {
	    if (!depth) {
	      this.pushStackLiteral('data');
	    } else {
	      this.pushStackLiteral('container.data(data, ' + depth + ')');
	    }

	    this.resolvePath('data', parts, 0, true, strict);
	  },

	  resolvePath: function resolvePath(type, parts, i, falsy, strict) {
	    // istanbul ignore next

	    var _this2 = this;

	    if (this.options.strict || this.options.assumeObjects) {
	      this.push(strictLookup(this.options.strict && strict, this, parts, i, type));
	      return;
	    }

	    var len = parts.length;
	    for (; i < len; i++) {
	      /* eslint-disable no-loop-func */
	      this.replaceStack(function (current) {
	        var lookup = _this2.nameLookup(current, parts[i], type);
	        // We want to ensure that zero and false are handled properly if the context (falsy flag)
	        // needs to have the special handling for these values.
	        if (!falsy) {
	          return [' != null ? ', lookup, ' : ', current];
	        } else {
	          // Otherwise we can use generic falsy handling
	          return [' && ', lookup];
	        }
	      });
	      /* eslint-enable no-loop-func */
	    }
	  },

	  // [resolvePossibleLambda]
	  //
	  // On stack, before: value, ...
	  // On stack, after: resolved value, ...
	  //
	  // If the `value` is a lambda, replace it on the stack by
	  // the return value of the lambda
	  resolvePossibleLambda: function resolvePossibleLambda() {
	    this.push([this.aliasable('container.lambda'), '(', this.popStack(), ', ', this.contextName(0), ')']);
	  },

	  // [pushStringParam]
	  //
	  // On stack, before: ...
	  // On stack, after: string, currentContext, ...
	  //
	  // This opcode is designed for use in string mode, which
	  // provides the string value of a parameter along with its
	  // depth rather than resolving it immediately.
	  pushStringParam: function pushStringParam(string, type) {
	    this.pushContext();
	    this.pushString(type);

	    // If it's a subexpression, the string result
	    // will be pushed after this opcode.
	    if (type !== 'SubExpression') {
	      if (typeof string === 'string') {
	        this.pushString(string);
	      } else {
	        this.pushStackLiteral(string);
	      }
	    }
	  },

	  emptyHash: function emptyHash(omitEmpty) {
	    if (this.trackIds) {
	      this.push('{}'); // hashIds
	    }
	    if (this.stringParams) {
	      this.push('{}'); // hashContexts
	      this.push('{}'); // hashTypes
	    }
	    this.pushStackLiteral(omitEmpty ? 'undefined' : '{}');
	  },
	  pushHash: function pushHash() {
	    if (this.hash) {
	      this.hashes.push(this.hash);
	    }
	    this.hash = { values: {}, types: [], contexts: [], ids: [] };
	  },
	  popHash: function popHash() {
	    var hash = this.hash;
	    this.hash = this.hashes.pop();

	    if (this.trackIds) {
	      this.push(this.objectLiteral(hash.ids));
	    }
	    if (this.stringParams) {
	      this.push(this.objectLiteral(hash.contexts));
	      this.push(this.objectLiteral(hash.types));
	    }

	    this.push(this.objectLiteral(hash.values));
	  },

	  // [pushString]
	  //
	  // On stack, before: ...
	  // On stack, after: quotedString(string), ...
	  //
	  // Push a quoted version of `string` onto the stack
	  pushString: function pushString(string) {
	    this.pushStackLiteral(this.quotedString(string));
	  },

	  // [pushLiteral]
	  //
	  // On stack, before: ...
	  // On stack, after: value, ...
	  //
	  // Pushes a value onto the stack. This operation prevents
	  // the compiler from creating a temporary variable to hold
	  // it.
	  pushLiteral: function pushLiteral(value) {
	    this.pushStackLiteral(value);
	  },

	  // [pushProgram]
	  //
	  // On stack, before: ...
	  // On stack, after: program(guid), ...
	  //
	  // Push a program expression onto the stack. This takes
	  // a compile-time guid and converts it into a runtime-accessible
	  // expression.
	  pushProgram: function pushProgram(guid) {
	    if (guid != null) {
	      this.pushStackLiteral(this.programExpression(guid));
	    } else {
	      this.pushStackLiteral(null);
	    }
	  },

	  // [registerDecorator]
	  //
	  // On stack, before: hash, program, params..., ...
	  // On stack, after: ...
	  //
	  // Pops off the decorator's parameters, invokes the decorator,
	  // and inserts the decorator into the decorators list.
	  registerDecorator: function registerDecorator(paramSize, name) {
	    var foundDecorator = this.nameLookup('decorators', name, 'decorator'),
	        options = this.setupHelperArgs(name, paramSize);

	    this.decorators.push(['fn = ', this.decorators.functionCall(foundDecorator, '', ['fn', 'props', 'container', options]), ' || fn;']);
	  },

	  // [invokeHelper]
	  //
	  // On stack, before: hash, inverse, program, params..., ...
	  // On stack, after: result of helper invocation
	  //
	  // Pops off the helper's parameters, invokes the helper,
	  // and pushes the helper's return value onto the stack.
	  //
	  // If the helper is not found, `helperMissing` is called.
	  invokeHelper: function invokeHelper(paramSize, name, isSimple) {
	    var nonHelper = this.popStack(),
	        helper = this.setupHelper(paramSize, name);

	    var possibleFunctionCalls = [];

	    if (isSimple) {
	      // direct call to helper
	      possibleFunctionCalls.push(helper.name);
	    }
	    // call a function from the input object
	    possibleFunctionCalls.push(nonHelper);
	    if (!this.options.strict) {
	      possibleFunctionCalls.push(this.aliasable('container.hooks.helperMissing'));
	    }

	    var functionLookupCode = ['(', this.itemsSeparatedBy(possibleFunctionCalls, '||'), ')'];
	    var functionCall = this.source.functionCall(functionLookupCode, 'call', helper.callParams);
	    this.push(functionCall);
	  },

	  itemsSeparatedBy: function itemsSeparatedBy(items, separator) {
	    var result = [];
	    result.push(items[0]);
	    for (var i = 1; i < items.length; i++) {
	      result.push(separator, items[i]);
	    }
	    return result;
	  },
	  // [invokeKnownHelper]
	  //
	  // On stack, before: hash, inverse, program, params..., ...
	  // On stack, after: result of helper invocation
	  //
	  // This operation is used when the helper is known to exist,
	  // so a `helperMissing` fallback is not required.
	  invokeKnownHelper: function invokeKnownHelper(paramSize, name) {
	    var helper = this.setupHelper(paramSize, name);
	    this.push(this.source.functionCall(helper.name, 'call', helper.callParams));
	  },

	  // [invokeAmbiguous]
	  //
	  // On stack, before: hash, inverse, program, params..., ...
	  // On stack, after: result of disambiguation
	  //
	  // This operation is used when an expression like `{{foo}}`
	  // is provided, but we don't know at compile-time whether it
	  // is a helper or a path.
	  //
	  // This operation emits more code than the other options,
	  // and can be avoided by passing the `knownHelpers` and
	  // `knownHelpersOnly` flags at compile-time.
	  invokeAmbiguous: function invokeAmbiguous(name, helperCall) {
	    this.useRegister('helper');

	    var nonHelper = this.popStack();

	    this.emptyHash();
	    var helper = this.setupHelper(0, name, helperCall);

	    var helperName = this.lastHelper = this.nameLookup('helpers', name, 'helper');

	    var lookup = ['(', '(helper = ', helperName, ' || ', nonHelper, ')'];
	    if (!this.options.strict) {
	      lookup[0] = '(helper = ';
	      lookup.push(' != null ? helper : ', this.aliasable('container.hooks.helperMissing'));
	    }

	    this.push(['(', lookup, helper.paramsInit ? ['),(', helper.paramsInit] : [], '),', '(typeof helper === ', this.aliasable('"function"'), ' ? ', this.source.functionCall('helper', 'call', helper.callParams), ' : helper))']);
	  },

	  // [invokePartial]
	  //
	  // On stack, before: context, ...
	  // On stack after: result of partial invocation
	  //
	  // This operation pops off a context, invokes a partial with that context,
	  // and pushes the result of the invocation back.
	  invokePartial: function invokePartial(isDynamic, name, indent) {
	    var params = [],
	        options = this.setupParams(name, 1, params);

	    if (isDynamic) {
	      name = this.popStack();
	      delete options.name;
	    }

	    if (indent) {
	      options.indent = JSON.stringify(indent);
	    }
	    options.helpers = 'helpers';
	    options.partials = 'partials';
	    options.decorators = 'container.decorators';

	    if (!isDynamic) {
	      params.unshift(this.nameLookup('partials', name, 'partial'));
	    } else {
	      params.unshift(name);
	    }

	    if (this.options.compat) {
	      options.depths = 'depths';
	    }
	    options = this.objectLiteral(options);
	    params.push(options);

	    this.push(this.source.functionCall('container.invokePartial', '', params));
	  },

	  // [assignToHash]
	  //
	  // On stack, before: value, ..., hash, ...
	  // On stack, after: ..., hash, ...
	  //
	  // Pops a value off the stack and assigns it to the current hash
	  assignToHash: function assignToHash(key) {
	    var value = this.popStack(),
	        context = undefined,
	        type = undefined,
	        id = undefined;

	    if (this.trackIds) {
	      id = this.popStack();
	    }
	    if (this.stringParams) {
	      type = this.popStack();
	      context = this.popStack();
	    }

	    var hash = this.hash;
	    if (context) {
	      hash.contexts[key] = context;
	    }
	    if (type) {
	      hash.types[key] = type;
	    }
	    if (id) {
	      hash.ids[key] = id;
	    }
	    hash.values[key] = value;
	  },

	  pushId: function pushId(type, name, child) {
	    if (type === 'BlockParam') {
	      this.pushStackLiteral('blockParams[' + name[0] + '].path[' + name[1] + ']' + (child ? ' + ' + JSON.stringify('.' + child) : ''));
	    } else if (type === 'PathExpression') {
	      this.pushString(name);
	    } else if (type === 'SubExpression') {
	      this.pushStackLiteral('true');
	    } else {
	      this.pushStackLiteral('null');
	    }
	  },

	  // HELPERS

	  compiler: JavaScriptCompiler,

	  compileChildren: function compileChildren(environment, options) {
	    var children = environment.children,
	        child = undefined,
	        compiler = undefined;

	    for (var i = 0, l = children.length; i < l; i++) {
	      child = children[i];
	      compiler = new this.compiler(); // eslint-disable-line new-cap

	      var existing = this.matchExistingProgram(child);

	      if (existing == null) {
	        this.context.programs.push(''); // Placeholder to prevent name conflicts for nested children
	        var index = this.context.programs.length;
	        child.index = index;
	        child.name = 'program' + index;
	        this.context.programs[index] = compiler.compile(child, options, this.context, !this.precompile);
	        this.context.decorators[index] = compiler.decorators;
	        this.context.environments[index] = child;

	        this.useDepths = this.useDepths || compiler.useDepths;
	        this.useBlockParams = this.useBlockParams || compiler.useBlockParams;
	        child.useDepths = this.useDepths;
	        child.useBlockParams = this.useBlockParams;
	      } else {
	        child.index = existing.index;
	        child.name = 'program' + existing.index;

	        this.useDepths = this.useDepths || existing.useDepths;
	        this.useBlockParams = this.useBlockParams || existing.useBlockParams;
	      }
	    }
	  },
	  matchExistingProgram: function matchExistingProgram(child) {
	    for (var i = 0, len = this.context.environments.length; i < len; i++) {
	      var environment = this.context.environments[i];
	      if (environment && environment.equals(child)) {
	        return environment;
	      }
	    }
	  },

	  programExpression: function programExpression(guid) {
	    var child = this.environment.children[guid],
	        programParams = [child.index, 'data', child.blockParams];

	    if (this.useBlockParams || this.useDepths) {
	      programParams.push('blockParams');
	    }
	    if (this.useDepths) {
	      programParams.push('depths');
	    }

	    return 'container.program(' + programParams.join(', ') + ')';
	  },

	  useRegister: function useRegister(name) {
	    if (!this.registers[name]) {
	      this.registers[name] = true;
	      this.registers.list.push(name);
	    }
	  },

	  push: function push(expr) {
	    if (!(expr instanceof Literal)) {
	      expr = this.source.wrap(expr);
	    }

	    this.inlineStack.push(expr);
	    return expr;
	  },

	  pushStackLiteral: function pushStackLiteral(item) {
	    this.push(new Literal(item));
	  },

	  pushSource: function pushSource(source) {
	    if (this.pendingContent) {
	      this.source.push(this.appendToBuffer(this.source.quotedString(this.pendingContent), this.pendingLocation));
	      this.pendingContent = undefined;
	    }

	    if (source) {
	      this.source.push(source);
	    }
	  },

	  replaceStack: function replaceStack(callback) {
	    var prefix = ['('],
	        stack = undefined,
	        createdStack = undefined,
	        usedLiteral = undefined;

	    /* istanbul ignore next */
	    if (!this.isInline()) {
	      throw new _exception2['default']('replaceStack on non-inline');
	    }

	    // We want to merge the inline statement into the replacement statement via ','
	    var top = this.popStack(true);

	    if (top instanceof Literal) {
	      // Literals do not need to be inlined
	      stack = [top.value];
	      prefix = ['(', stack];
	      usedLiteral = true;
	    } else {
	      // Get or create the current stack name for use by the inline
	      createdStack = true;
	      var _name = this.incrStack();

	      prefix = ['((', this.push(_name), ' = ', top, ')'];
	      stack = this.topStack();
	    }

	    var item = callback.call(this, stack);

	    if (!usedLiteral) {
	      this.popStack();
	    }
	    if (createdStack) {
	      this.stackSlot--;
	    }
	    this.push(prefix.concat(item, ')'));
	  },

	  incrStack: function incrStack() {
	    this.stackSlot++;
	    if (this.stackSlot > this.stackVars.length) {
	      this.stackVars.push('stack' + this.stackSlot);
	    }
	    return this.topStackName();
	  },
	  topStackName: function topStackName() {
	    return 'stack' + this.stackSlot;
	  },
	  flushInline: function flushInline() {
	    var inlineStack = this.inlineStack;
	    this.inlineStack = [];
	    for (var i = 0, len = inlineStack.length; i < len; i++) {
	      var entry = inlineStack[i];
	      /* istanbul ignore if */
	      if (entry instanceof Literal) {
	        this.compileStack.push(entry);
	      } else {
	        var stack = this.incrStack();
	        this.pushSource([stack, ' = ', entry, ';']);
	        this.compileStack.push(stack);
	      }
	    }
	  },
	  isInline: function isInline() {
	    return this.inlineStack.length;
	  },

	  popStack: function popStack(wrapped) {
	    var inline = this.isInline(),
	        item = (inline ? this.inlineStack : this.compileStack).pop();

	    if (!wrapped && item instanceof Literal) {
	      return item.value;
	    } else {
	      if (!inline) {
	        /* istanbul ignore next */
	        if (!this.stackSlot) {
	          throw new _exception2['default']('Invalid stack pop');
	        }
	        this.stackSlot--;
	      }
	      return item;
	    }
	  },

	  topStack: function topStack() {
	    var stack = this.isInline() ? this.inlineStack : this.compileStack,
	        item = stack[stack.length - 1];

	    /* istanbul ignore if */
	    if (item instanceof Literal) {
	      return item.value;
	    } else {
	      return item;
	    }
	  },

	  contextName: function contextName(context) {
	    if (this.useDepths && context) {
	      return 'depths[' + context + ']';
	    } else {
	      return 'depth' + context;
	    }
	  },

	  quotedString: function quotedString(str) {
	    return this.source.quotedString(str);
	  },

	  objectLiteral: function objectLiteral(obj) {
	    return this.source.objectLiteral(obj);
	  },

	  aliasable: function aliasable(name) {
	    var ret = this.aliases[name];
	    if (ret) {
	      ret.referenceCount++;
	      return ret;
	    }

	    ret = this.aliases[name] = this.source.wrap(name);
	    ret.aliasable = true;
	    ret.referenceCount = 1;

	    return ret;
	  },

	  setupHelper: function setupHelper(paramSize, name, blockHelper) {
	    var params = [],
	        paramsInit = this.setupHelperArgs(name, paramSize, params, blockHelper);
	    var foundHelper = this.nameLookup('helpers', name, 'helper'),
	        callContext = this.aliasable(this.contextName(0) + ' != null ? ' + this.contextName(0) + ' : (container.nullContext || {})');

	    return {
	      params: params,
	      paramsInit: paramsInit,
	      name: foundHelper,
	      callParams: [callContext].concat(params)
	    };
	  },

	  setupParams: function setupParams(helper, paramSize, params) {
	    var options = {},
	        contexts = [],
	        types = [],
	        ids = [],
	        objectArgs = !params,
	        param = undefined;

	    if (objectArgs) {
	      params = [];
	    }

	    options.name = this.quotedString(helper);
	    options.hash = this.popStack();

	    if (this.trackIds) {
	      options.hashIds = this.popStack();
	    }
	    if (this.stringParams) {
	      options.hashTypes = this.popStack();
	      options.hashContexts = this.popStack();
	    }

	    var inverse = this.popStack(),
	        program = this.popStack();

	    // Avoid setting fn and inverse if neither are set. This allows
	    // helpers to do a check for `if (options.fn)`
	    if (program || inverse) {
	      options.fn = program || 'container.noop';
	      options.inverse = inverse || 'container.noop';
	    }

	    // The parameters go on to the stack in order (making sure that they are evaluated in order)
	    // so we need to pop them off the stack in reverse order
	    var i = paramSize;
	    while (i--) {
	      param = this.popStack();
	      params[i] = param;

	      if (this.trackIds) {
	        ids[i] = this.popStack();
	      }
	      if (this.stringParams) {
	        types[i] = this.popStack();
	        contexts[i] = this.popStack();
	      }
	    }

	    if (objectArgs) {
	      options.args = this.source.generateArray(params);
	    }

	    if (this.trackIds) {
	      options.ids = this.source.generateArray(ids);
	    }
	    if (this.stringParams) {
	      options.types = this.source.generateArray(types);
	      options.contexts = this.source.generateArray(contexts);
	    }

	    if (this.options.data) {
	      options.data = 'data';
	    }
	    if (this.useBlockParams) {
	      options.blockParams = 'blockParams';
	    }
	    return options;
	  },

	  setupHelperArgs: function setupHelperArgs(helper, paramSize, params, useRegister) {
	    var options = this.setupParams(helper, paramSize, params);
	    options.loc = JSON.stringify(this.source.currentLocation);
	    options = this.objectLiteral(options);
	    if (useRegister) {
	      this.useRegister('options');
	      params.push('options');
	      return ['options=', options];
	    } else if (params) {
	      params.push(options);
	      return '';
	    } else {
	      return options;
	    }
	  }
	};

	(function () {
	  var reservedWords = ('break else new var' + ' case finally return void' + ' catch for switch while' + ' continue function this with' + ' default if throw' + ' delete in try' + ' do instanceof typeof' + ' abstract enum int short' + ' boolean export interface static' + ' byte extends long super' + ' char final native synchronized' + ' class float package throws' + ' const goto private transient' + ' debugger implements protected volatile' + ' double import public let yield await' + ' null true false').split(' ');

	  var compilerWords = JavaScriptCompiler.RESERVED_WORDS = {};

	  for (var i = 0, l = reservedWords.length; i < l; i++) {
	    compilerWords[reservedWords[i]] = true;
	  }
	})();

	/**
	 * @deprecated May be removed in the next major version
	 */
	JavaScriptCompiler.isValidJavaScriptVariableName = function (name) {
	  return !JavaScriptCompiler.RESERVED_WORDS[name] && /^[a-zA-Z_$][0-9a-zA-Z_$]*$/.test(name);
	};

	function strictLookup(requireTerminal, compiler, parts, i, type) {
	  var stack = compiler.popStack(),
	      len = parts.length;
	  if (requireTerminal) {
	    len--;
	  }

	  for (; i < len; i++) {
	    stack = compiler.nameLookup(stack, parts[i], type);
	  }

	  if (requireTerminal) {
	    return [compiler.aliasable('container.strict'), '(', stack, ', ', compiler.quotedString(parts[i]), ', ', JSON.stringify(compiler.source.currentLocation), ' )'];
	  } else {
	    return stack;
	  }
	}

	exports['default'] = JavaScriptCompiler;
	module.exports = exports['default'];

/***/ }),
/* 92 */
/***/ (function(module, exports, __nested_webpack_require_197611__) {

	/* global define, require */
	'use strict';

	var _Object$keys = __nested_webpack_require_197611__(60)['default'];

	exports.__esModule = true;

	var _utils = __nested_webpack_require_197611__(5);

	var SourceNode = undefined;

	try {
	  /* istanbul ignore next */
	  if (false) // removed by dead control flow
{ var SourceMap; }
	} catch (err) {}
	/* NOP */

	/* istanbul ignore if: tested but not covered in istanbul due to dist build  */
	if (!SourceNode) {
	  SourceNode = function (line, column, srcFile, chunks) {
	    this.src = '';
	    if (chunks) {
	      this.add(chunks);
	    }
	  };
	  /* istanbul ignore next */
	  SourceNode.prototype = {
	    add: function add(chunks) {
	      if (_utils.isArray(chunks)) {
	        chunks = chunks.join('');
	      }
	      this.src += chunks;
	    },
	    prepend: function prepend(chunks) {
	      if (_utils.isArray(chunks)) {
	        chunks = chunks.join('');
	      }
	      this.src = chunks + this.src;
	    },
	    toStringWithSourceMap: function toStringWithSourceMap() {
	      return { code: this.toString() };
	    },
	    toString: function toString() {
	      return this.src;
	    }
	  };
	}

	function castChunk(chunk, codeGen, loc) {
	  if (_utils.isArray(chunk)) {
	    var ret = [];

	    for (var i = 0, len = chunk.length; i < len; i++) {
	      ret.push(codeGen.wrap(chunk[i], loc));
	    }
	    return ret;
	  } else if (typeof chunk === 'boolean' || typeof chunk === 'number') {
	    // Handle primitives that the SourceNode will throw up on
	    return chunk + '';
	  }
	  return chunk;
	}

	function CodeGen(srcFile) {
	  this.srcFile = srcFile;
	  this.source = [];
	}

	CodeGen.prototype = {
	  isEmpty: function isEmpty() {
	    return !this.source.length;
	  },
	  prepend: function prepend(source, loc) {
	    this.source.unshift(this.wrap(source, loc));
	  },
	  push: function push(source, loc) {
	    this.source.push(this.wrap(source, loc));
	  },

	  merge: function merge() {
	    var source = this.empty();
	    this.each(function (line) {
	      source.add(['  ', line, '\n']);
	    });
	    return source;
	  },

	  each: function each(iter) {
	    for (var i = 0, len = this.source.length; i < len; i++) {
	      iter(this.source[i]);
	    }
	  },

	  empty: function empty() {
	    var loc = this.currentLocation || { start: {} };
	    return new SourceNode(loc.start.line, loc.start.column, this.srcFile);
	  },
	  wrap: function wrap(chunk) {
	    var loc = arguments.length <= 1 || arguments[1] === undefined ? this.currentLocation || { start: {} } : arguments[1];

	    if (chunk instanceof SourceNode) {
	      return chunk;
	    }

	    chunk = castChunk(chunk, this, loc);

	    return new SourceNode(loc.start.line, loc.start.column, this.srcFile, chunk);
	  },

	  functionCall: function functionCall(fn, type, params) {
	    params = this.generateList(params);
	    return this.wrap([fn, type ? '.' + type + '(' : '(', params, ')']);
	  },

	  quotedString: function quotedString(str) {
	    return '"' + (str + '').replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, '\\n').replace(/\r/g, '\\r').replace(/\u2028/g, '\\u2028') // Per Ecma-262 7.3 + 7.8.4
	    .replace(/\u2029/g, '\\u2029') + '"';
	  },

	  objectLiteral: function objectLiteral(obj) {
	    // istanbul ignore next

	    var _this = this;

	    var pairs = [];

	    _Object$keys(obj).forEach(function (key) {
	      var value = castChunk(obj[key], _this);
	      if (value !== 'undefined') {
	        pairs.push([_this.quotedString(key), ':', value]);
	      }
	    });

	    var ret = this.generateList(pairs);
	    ret.prepend('{');
	    ret.add('}');
	    return ret;
	  },

	  generateList: function generateList(entries) {
	    var ret = this.empty();

	    for (var i = 0, len = entries.length; i < len; i++) {
	      if (i) {
	        ret.add(',');
	      }

	      ret.add(castChunk(entries[i], this));
	    }

	    return ret;
	  },

	  generateArray: function generateArray(entries) {
	    var ret = this.generateList(entries);
	    ret.prepend('[');
	    ret.add(']');

	    return ret;
	  }
	};

	exports['default'] = CodeGen;
	module.exports = exports['default'];

/***/ })
/******/ ])
});
;

/***/ },

/***/ "./public/css/auth.css"
/*!*****************************!*\
  !*** ./public/css/auth.css ***!
  \*****************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/styleDomAPI.js */ "./node_modules/style-loader/dist/runtime/styleDomAPI.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/insertBySelector.js */ "./node_modules/style-loader/dist/runtime/insertBySelector.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js */ "./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/insertStyleElement.js */ "./node_modules/style-loader/dist/runtime/insertStyleElement.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/styleTagTransform.js */ "./node_modules/style-loader/dist/runtime/styleTagTransform.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_auth_css__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! !!../../node_modules/css-loader/dist/cjs.js!./auth.css */ "./node_modules/css-loader/dist/cjs.js!./public/css/auth.css");

      
      
      
      
      
      
      
      
      

var options = {};

options.styleTagTransform = (_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default());
options.setAttributes = (_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default());
options.insert = _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default().bind(null, "head");
options.domAPI = (_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default());
options.insertStyleElement = (_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default());

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_auth_css__WEBPACK_IMPORTED_MODULE_6__["default"], options);




       /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_auth_css__WEBPACK_IMPORTED_MODULE_6__["default"] && _node_modules_css_loader_dist_cjs_js_auth_css__WEBPACK_IMPORTED_MODULE_6__["default"].locals ? _node_modules_css_loader_dist_cjs_js_auth_css__WEBPACK_IMPORTED_MODULE_6__["default"].locals : undefined);


/***/ },

/***/ "./public/css/base.css"
/*!*****************************!*\
  !*** ./public/css/base.css ***!
  \*****************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/styleDomAPI.js */ "./node_modules/style-loader/dist/runtime/styleDomAPI.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/insertBySelector.js */ "./node_modules/style-loader/dist/runtime/insertBySelector.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js */ "./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/insertStyleElement.js */ "./node_modules/style-loader/dist/runtime/insertStyleElement.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/styleTagTransform.js */ "./node_modules/style-loader/dist/runtime/styleTagTransform.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_base_css__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! !!../../node_modules/css-loader/dist/cjs.js!./base.css */ "./node_modules/css-loader/dist/cjs.js!./public/css/base.css");

      
      
      
      
      
      
      
      
      

var options = {};

options.styleTagTransform = (_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default());
options.setAttributes = (_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default());
options.insert = _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default().bind(null, "head");
options.domAPI = (_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default());
options.insertStyleElement = (_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default());

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_base_css__WEBPACK_IMPORTED_MODULE_6__["default"], options);




       /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_base_css__WEBPACK_IMPORTED_MODULE_6__["default"] && _node_modules_css_loader_dist_cjs_js_base_css__WEBPACK_IMPORTED_MODULE_6__["default"].locals ? _node_modules_css_loader_dist_cjs_js_base_css__WEBPACK_IMPORTED_MODULE_6__["default"].locals : undefined);


/***/ },

/***/ "./public/css/components.css"
/*!***********************************!*\
  !*** ./public/css/components.css ***!
  \***********************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/styleDomAPI.js */ "./node_modules/style-loader/dist/runtime/styleDomAPI.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/insertBySelector.js */ "./node_modules/style-loader/dist/runtime/insertBySelector.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js */ "./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/insertStyleElement.js */ "./node_modules/style-loader/dist/runtime/insertStyleElement.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/styleTagTransform.js */ "./node_modules/style-loader/dist/runtime/styleTagTransform.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_components_css__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! !!../../node_modules/css-loader/dist/cjs.js!./components.css */ "./node_modules/css-loader/dist/cjs.js!./public/css/components.css");

      
      
      
      
      
      
      
      
      

var options = {};

options.styleTagTransform = (_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default());
options.setAttributes = (_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default());
options.insert = _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default().bind(null, "head");
options.domAPI = (_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default());
options.insertStyleElement = (_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default());

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_components_css__WEBPACK_IMPORTED_MODULE_6__["default"], options);




       /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_components_css__WEBPACK_IMPORTED_MODULE_6__["default"] && _node_modules_css_loader_dist_cjs_js_components_css__WEBPACK_IMPORTED_MODULE_6__["default"].locals ? _node_modules_css_loader_dist_cjs_js_components_css__WEBPACK_IMPORTED_MODULE_6__["default"].locals : undefined);


/***/ },

/***/ "./public/css/main.css"
/*!*****************************!*\
  !*** ./public/css/main.css ***!
  \*****************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/styleDomAPI.js */ "./node_modules/style-loader/dist/runtime/styleDomAPI.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/insertBySelector.js */ "./node_modules/style-loader/dist/runtime/insertBySelector.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js */ "./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/insertStyleElement.js */ "./node_modules/style-loader/dist/runtime/insertStyleElement.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/styleTagTransform.js */ "./node_modules/style-loader/dist/runtime/styleTagTransform.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_main_css__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! !!../../node_modules/css-loader/dist/cjs.js!./main.css */ "./node_modules/css-loader/dist/cjs.js!./public/css/main.css");

      
      
      
      
      
      
      
      
      

var options = {};

options.styleTagTransform = (_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default());
options.setAttributes = (_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default());
options.insert = _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default().bind(null, "head");
options.domAPI = (_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default());
options.insertStyleElement = (_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default());

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_main_css__WEBPACK_IMPORTED_MODULE_6__["default"], options);




       /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_main_css__WEBPACK_IMPORTED_MODULE_6__["default"] && _node_modules_css_loader_dist_cjs_js_main_css__WEBPACK_IMPORTED_MODULE_6__["default"].locals ? _node_modules_css_loader_dist_cjs_js_main_css__WEBPACK_IMPORTED_MODULE_6__["default"].locals : undefined);


/***/ },

/***/ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js"
/*!****************************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js ***!
  \****************************************************************************/
(module) {

"use strict";


var stylesInDOM = [];
function getIndexByIdentifier(identifier) {
  var result = -1;
  for (var i = 0; i < stylesInDOM.length; i++) {
    if (stylesInDOM[i].identifier === identifier) {
      result = i;
      break;
    }
  }
  return result;
}
function modulesToDom(list, options) {
  var idCountMap = {};
  var identifiers = [];
  for (var i = 0; i < list.length; i++) {
    var item = list[i];
    var id = options.base ? item[0] + options.base : item[0];
    var count = idCountMap[id] || 0;
    var identifier = "".concat(id, " ").concat(count);
    idCountMap[id] = count + 1;
    var indexByIdentifier = getIndexByIdentifier(identifier);
    var obj = {
      css: item[1],
      media: item[2],
      sourceMap: item[3],
      supports: item[4],
      layer: item[5]
    };
    if (indexByIdentifier !== -1) {
      stylesInDOM[indexByIdentifier].references++;
      stylesInDOM[indexByIdentifier].updater(obj);
    } else {
      var updater = addElementStyle(obj, options);
      options.byIndex = i;
      stylesInDOM.splice(i, 0, {
        identifier: identifier,
        updater: updater,
        references: 1
      });
    }
    identifiers.push(identifier);
  }
  return identifiers;
}
function addElementStyle(obj, options) {
  var api = options.domAPI(options);
  api.update(obj);
  var updater = function updater(newObj) {
    if (newObj) {
      if (newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap && newObj.supports === obj.supports && newObj.layer === obj.layer) {
        return;
      }
      api.update(obj = newObj);
    } else {
      api.remove();
    }
  };
  return updater;
}
module.exports = function (list, options) {
  options = options || {};
  list = list || [];
  var lastIdentifiers = modulesToDom(list, options);
  return function update(newList) {
    newList = newList || [];
    for (var i = 0; i < lastIdentifiers.length; i++) {
      var identifier = lastIdentifiers[i];
      var index = getIndexByIdentifier(identifier);
      stylesInDOM[index].references--;
    }
    var newLastIdentifiers = modulesToDom(newList, options);
    for (var _i = 0; _i < lastIdentifiers.length; _i++) {
      var _identifier = lastIdentifiers[_i];
      var _index = getIndexByIdentifier(_identifier);
      if (stylesInDOM[_index].references === 0) {
        stylesInDOM[_index].updater();
        stylesInDOM.splice(_index, 1);
      }
    }
    lastIdentifiers = newLastIdentifiers;
  };
};

/***/ },

/***/ "./node_modules/style-loader/dist/runtime/insertBySelector.js"
/*!********************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/insertBySelector.js ***!
  \********************************************************************/
(module) {

"use strict";


var memo = {};

/* istanbul ignore next  */
function getTarget(target) {
  if (typeof memo[target] === "undefined") {
    var styleTarget = document.querySelector(target);

    // Special case to return head of iframe instead of iframe itself
    if (window.HTMLIFrameElement && styleTarget instanceof window.HTMLIFrameElement) {
      try {
        // This will throw an exception if access to iframe is blocked
        // due to cross-origin restrictions
        styleTarget = styleTarget.contentDocument.head;
      } catch (e) {
        // istanbul ignore next
        styleTarget = null;
      }
    }
    memo[target] = styleTarget;
  }
  return memo[target];
}

/* istanbul ignore next  */
function insertBySelector(insert, style) {
  var target = getTarget(insert);
  if (!target) {
    throw new Error("Couldn't find a style target. This probably means that the value for the 'insert' parameter is invalid.");
  }
  target.appendChild(style);
}
module.exports = insertBySelector;

/***/ },

/***/ "./node_modules/style-loader/dist/runtime/insertStyleElement.js"
/*!**********************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/insertStyleElement.js ***!
  \**********************************************************************/
(module) {

"use strict";


/* istanbul ignore next  */
function insertStyleElement(options) {
  var element = document.createElement("style");
  options.setAttributes(element, options.attributes);
  options.insert(element, options.options);
  return element;
}
module.exports = insertStyleElement;

/***/ },

/***/ "./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js"
/*!**********************************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js ***!
  \**********************************************************************************/
(module, __unused_webpack_exports, __webpack_require__) {

"use strict";


/* istanbul ignore next  */
function setAttributesWithoutAttributes(styleElement) {
  var nonce =  true ? __webpack_require__.nc : 0;
  if (nonce) {
    styleElement.setAttribute("nonce", nonce);
  }
}
module.exports = setAttributesWithoutAttributes;

/***/ },

/***/ "./node_modules/style-loader/dist/runtime/styleDomAPI.js"
/*!***************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/styleDomAPI.js ***!
  \***************************************************************/
(module) {

"use strict";


/* istanbul ignore next  */
function apply(styleElement, options, obj) {
  var css = "";
  if (obj.supports) {
    css += "@supports (".concat(obj.supports, ") {");
  }
  if (obj.media) {
    css += "@media ".concat(obj.media, " {");
  }
  var needLayer = typeof obj.layer !== "undefined";
  if (needLayer) {
    css += "@layer".concat(obj.layer.length > 0 ? " ".concat(obj.layer) : "", " {");
  }
  css += obj.css;
  if (needLayer) {
    css += "}";
  }
  if (obj.media) {
    css += "}";
  }
  if (obj.supports) {
    css += "}";
  }
  var sourceMap = obj.sourceMap;
  if (sourceMap && typeof btoa !== "undefined") {
    css += "\n/*# sourceMappingURL=data:application/json;base64,".concat(btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))), " */");
  }

  // For old IE
  /* istanbul ignore if  */
  options.styleTagTransform(css, styleElement, options.options);
}
function removeStyleElement(styleElement) {
  // istanbul ignore if
  if (styleElement.parentNode === null) {
    return false;
  }
  styleElement.parentNode.removeChild(styleElement);
}

/* istanbul ignore next  */
function domAPI(options) {
  if (typeof document === "undefined") {
    return {
      update: function update() {},
      remove: function remove() {}
    };
  }
  var styleElement = options.insertStyleElement(options);
  return {
    update: function update(obj) {
      apply(styleElement, options, obj);
    },
    remove: function remove() {
      removeStyleElement(styleElement);
    }
  };
}
module.exports = domAPI;

/***/ },

/***/ "./node_modules/style-loader/dist/runtime/styleTagTransform.js"
/*!*********************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/styleTagTransform.js ***!
  \*********************************************************************/
(module) {

"use strict";


/* istanbul ignore next  */
function styleTagTransform(css, styleElement) {
  if (styleElement.styleSheet) {
    styleElement.styleSheet.cssText = css;
  } else {
    while (styleElement.firstChild) {
      styleElement.removeChild(styleElement.firstChild);
    }
    styleElement.appendChild(document.createTextNode(css));
  }
}
module.exports = styleTagTransform;

/***/ },

/***/ "./src/js/api/apiClient.ts"
/*!*********************************!*\
  !*** ./src/js/api/apiClient.ts ***!
  \*********************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   API_ENDPOINTS: () => (/* binding */ API_ENDPOINTS),
/* harmony export */   apiClient: () => (/* binding */ apiClient)
/* harmony export */ });
/* harmony import */ var _core_config__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @/core/config */ "./src/js/core/config.ts");

const API_URL = _core_config__WEBPACK_IMPORTED_MODULE_0__.CONFIG.API.API_URL;
const API_ENDPOINTS = {
    AUTH: {
        REGISTER: '/auth/register',
        LOGIN: '/auth/login',
        LOGOUT: '/auth/logout',
    },
    ADS: {
        GET_ALL: '/ads',
        GET_BY_ID: (id) => `/ads/${id}`,
        CREATE: '/ads',
        UPDATE: (id) => `/ads/${id}`,
        DELETE: (id) => `/ads/${id}`,
        SEARCH: '/ads/search',
    },
    USERS: {
        PROFILE: '/users/profile',
        GET_BY_ID: (id) => `/users/${id}`,
    },
    CATEGORIES: {
        GET_ALL: '/categories',
    },
    FAVORITES: {
        GET_ALL: '/favorites',
        ADD: (id) => `/favorites/${id}`,
        REMOVE: (id) => `/favorites/${id}`,
        CHECK: (id) => `/favorites/${id}/check`,
    },
};
/**
* Основной объект для отправки запросов на сервер
* Содержит методы для GET, POST, PUT, DELETE запросов
*
* @param {string} endpoint - адрес, куда отправляем запрос (например, '/auth/login')
* @param {string} method - метод HTTP запроса (GET, POST, PUT, DELETE)
* @param {Object} body - данные, которые отправляем на сервер (для POST/PUT)
* @param {Object} customHeaders - дополнительные заголовки, если нужны
* @returns {Promise<Object>} - ответ от сервера в виде объекта {success, data, error}
*
* @example
* // Пример вызова:
* const result = await apiClient.request('/auth/login', 'POST', {
*   email: 'user@mail.ru',
*   password: '12345678'
* });
*/
const apiClient = {
    /**
     * Универсальный метод для выполнения HTTP-запросов
     * @param {string} endpoint - Эндпоинт API
     * @param {string} [method='GET'] - HTTP метод
     * @param {Object|null} [body=null] - Тело запроса
     * @param {Object} [customHeaders={}] - Дополнительные заголовки
     * @returns {Promise<Object>} Результат запроса с полями success, data, error, status
     */
    async request(endpoint, method = 'GET', body = null, customHeaders = {}) {
        const headers = {
            'Content-Type': 'application/json',
            ...customHeaders,
        };
        const config = {
            method,
            headers,
            credentials: 'include',
        };
        if (body) {
            config.body = JSON.stringify(body);
        }
        try {
            const response = await fetch(`${API_URL}${endpoint}`, config);
            let data;
            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
                try {
                    data = await response.json();
                }
                catch (e) {
                    data = { message: 'Ошибка парсинга ответа сервера' };
                }
            }
            else {
                const text = await response.text();
                data = { message: text };
            }
            if (response.ok) {
                return { success: true, data };
            }
            return {
                success: false,
                error: data.message || data.error || 'Произошла неизвестная ошибка',
                data: data,
                status: response.status,
            };
        }
        catch (error) {
            return {
                success: false,
                error: 'Не удалось соединиться с сервером',
                status: 0,
            };
        }
    },
    /**
     * Выполняет GET-запрос
     * @param {string} endpoint - Эндпоинт API
     * @param {Object} [headers={}] - Дополнительные заголовки
     * @returns {Promise<Object>} Результат запроса
     */
    get(endpoint, headers = {}) {
        return this.request(endpoint, 'GET', null, headers);
    },
    /**
     * Выполняет POST-запрос
     * @param {string} endpoint - Эндпоинт API
     * @param {Object} body - Тело запроса
     * @param {Object} [headers={}] - Дополнительные заголовки
     * @returns {Promise<Object>} Результат запроса
     */
    post(endpoint, body, headers = {}) {
        return this.request(endpoint, 'POST', body, headers);
    },
    /**
     * Выполняет PUT-запрос
     * @param {string} endpoint - Эндпоинт API
     * @param {Object} body - Тело запроса
     * @param {Object} [headers={}] - Дополнительные заголовки
     * @returns {Promise<Object>} Результат запроса
     */
    put(endpoint, body, headers = {}) {
        return this.request(endpoint, 'PUT', body, headers);
    },
    /**
     * Выполняет DELETE-запрос
     * @param {string} endpoint - Эндпоинт API
     * @param {Object} [headers={}] - Дополнительные заголовки
     * @returns {Promise<Object>} Результат запроса
     */
    delete(endpoint, headers = {}) {
        return this.request(endpoint, 'DELETE', null, headers);
    },
};



/***/ },

/***/ "./src/js/app.ts"
/*!***********************!*\
  !*** ./src/js/app.ts ***!
  \***********************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   App: () => (/* binding */ App)
/* harmony export */ });
/* harmony import */ var handlebars__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! handlebars */ "./node_modules/handlebars/dist/handlebars.js");
/* harmony import */ var handlebars__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(handlebars__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _services_authService__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @/services/authService */ "./src/js/services/authService.ts");
/* harmony import */ var _validators_authValidator__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @/validators/authValidator */ "./src/js/validators/authValidator.ts");
/* harmony import */ var _api_apiClient__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @/api/apiClient */ "./src/js/api/apiClient.ts");
/* harmony import */ var _core_config__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @/core/config */ "./src/js/core/config.ts");
/**
* Главный файл приложения
* Здесь вся логика: роутинг (переходы между страницами),
* отрисовка страниц, обработка кликов и т.д.
*
* @module app
*/





/**
* Главный объект приложения
* Содержит все методы для работы с интерфейсом
*
* @property {Object} templates - тут хранятся скомпилированные шаблоны Handlebars
* @property {string} currentView - название текущей страницы (main-page, login и т.д.)
* @property {boolean} isAuthenticated - залогинен ли пользователь
* @property {Object} user - данные текущего пользователя
*/
const App = {
    templates: {},
    currentView: 'main-page',
    isAuthenticated: false,
    user: null,
    UI_CONSTANTS: {
        DEFAULT_AVATAR: '/images/default-avatar.jpg',
        DEFAULT_AD_IMAGE: '/images/default-ad.jpg',
        EYE_OPEN: '/images/icons/Eye.jpeg',
        EYE_CLOSED: '/images/icons/Eye-off.jpeg',
        LOADER_HTML: '<div class="loader"></div>',
    },
    /**
    * Инициализация приложения - запускается при загрузке страницы
    * Загружает шаблоны, проверяет авторизацию, настраивает обработчики
    * @async
    */
    async init() {
        await this.loadTemplates();
        await this.checkAuth();
        this.setupGlobalHandlers();
        this.router();
        window.addEventListener('popstate', () => this.router());
    },
    async loadTemplates() {
        const templateNames = [
            'auth-links',
            'login-forms',
            'register-form',
            'user-profile',
            'main-page',
            'not-found',
        ];
        for (const name of templateNames) {
            const response = await fetch(`/templates/${name}.hbs`);
            const source = await response.text();
            this.templates[name] = handlebars__WEBPACK_IMPORTED_MODULE_0___default().compile(source);
        }
        handlebars__WEBPACK_IMPORTED_MODULE_0___default().registerHelper('formatPrice', (price) => {
            return price === 0 ? 'Бесплатно' : price + ' ₽';
        });
        handlebars__WEBPACK_IMPORTED_MODULE_0___default().registerHelper('ifAuthenticated', function (options) {
            return App.isAuthenticated ? options.fn(this) : options.inverse(this);
        });
        handlebars__WEBPACK_IMPORTED_MODULE_0___default().registerHelper('user', () => this.user);
    },
    /**
    * Проверка авторизации пользователя
    * Смотрит в localStorage и обновляет this.isAuthenticated и this.user
    */
    async checkAuth() {
        const result = await _services_authService__WEBPACK_IMPORTED_MODULE_1__.AuthService.check();
        this.isAuthenticated = result.isAuthenticated;
        this.user = result.user;
    },
    /**
    * Роутер - определяет, какую страницу показать по URL
    * Смотрит на window.location.pathname и вызывает нужный метод
    */
    async router() {
        const path = window.location.pathname;
        if (!this.isAuthenticated && ['/profile'].includes(path)) {
            this.navigateTo('/login');
            return;
        }
        switch (path) {
            case '/':
            case '/index.html':
                this.renderMain();
                break;
            case '/login':
                this.showLogin();
                break;
            case '/register':
                this.showRegister();
                break;
            case '/profile':
                this.showProfile();
                break;
            default:
                this.renderNotFound();
        }
    },
    navigateTo(path) {
        window.history.pushState({}, '', path);
        this.router();
    },
    async renderMain() {
        // Убираем специальный класс для страниц авторизации
        document.body.classList.remove('auth-page');
        // Получаем контейнер, куда будем рендерить
        const app = document.getElementById('app');
        if (!app)
            return;
        // Загружаем все объявления с сервера
        const adsResult = await _api_apiClient__WEBPACK_IMPORTED_MODULE_3__.apiClient.get(_api_apiClient__WEBPACK_IMPORTED_MODULE_3__.API_ENDPOINTS.ADS.GET_ALL, {});
        const ads = adsResult.success ? adsResult.data : [];
        // Форматируем каждое объявление для отображения
        const formattedAds = ads.map((ad) => this.formatAdCard(ad));
        const template = this.templates['main-page'];
        if (!template)
            return;
        // Рендерим главную страницу с данными
        app.innerHTML = template({
            isAuthenticated: this.isAuthenticated,
            user: this.user,
            recommendations: formattedAds,
        });
        this.attachMainEventListeners();
    },
    formatAdCard(ad) {
        let imageUrl = this.UI_CONSTANTS.DEFAULT_AD_IMAGE;
        // Проверяем: если путь уже начинается с http/https, используем его,
        // иначе подклеиваем базовый URL нашего бэкенда/хранилища.
        if (ad.photos && ad.photos.length > 0) {
            const photoPath = ad.photos[0];
            imageUrl = photoPath.startsWith('http')
                ? photoPath
                : `${_core_config__WEBPACK_IMPORTED_MODULE_4__.CONFIG.API.BASE_URL}${photoPath}`;
        }
        return {
            ...ad,
            formattedPrice: ad.price === 0 ? 'Бесплатно' : ad.price + ' ₽',
            mainPhoto: imageUrl,
            image: imageUrl,
            views: ad.views_count || 0,
            createdDate: ad.created_at ? new Date(ad.created_at).toLocaleDateString('ru-RU') : '',
        };
    },
    renderNotFound() {
        const app = document.getElementById('app');
        if (!app)
            return;
        const template = this.templates['not-found'];
        if (!template)
            return;
        app.innerHTML = template();
    },
    attachMainEventListeners() {
        const profileIcon = document.querySelector('.profile-icon');
        profileIcon?.addEventListener('click', (e) => {
            e.preventDefault();
            this.navigateTo(this.isAuthenticated ? '/profile' : '/login');
        });
        const placeAdBtn = document.querySelector('.place-ad-btn');
        if (placeAdBtn) {
            placeAdBtn.disabled = true;
            placeAdBtn.title = 'Функция временно недоступна';
        }
        document.querySelectorAll('.ad-card').forEach((card) => {
            card.addEventListener('click', () => {
                const adId = card.dataset.id;
                // TODO: использовать adId позже
                console.log('Ad clicked:', adId);
            });
        });
    },
    /**
    * Обработчик вызывается один раз при старте приложения
    * и навешивается один раз на весь документ
    */
    setupGlobalHandlers() {
        document.addEventListener('click', (e) => {
            const target = e.target;
            const navElement = target.closest('[data-nav]');
            if (navElement) {
                e.preventDefault();
                const path = navElement.dataset.nav;
                if (path)
                    this.navigateTo(path);
                return;
            }
            const actionElement = target.closest('[data-action]');
            if (actionElement) {
                e.preventDefault();
                const action = actionElement.dataset.action;
                if (action === 'logout') {
                    this.logout();
                }
                return;
            }
        });
    },
    /**
    * Инициализация кнопок показа/скрытия пароля
    * Ищет на странице поля пароля и вешает на них обработчики
    */
    initPasswordToggles() {
        const elements = {
            password: {
                input: document.querySelector('#password'),
                toggle: document.querySelector('#togglePassword'),
                eye: document.querySelector('#eyeIcon'),
            },
            confirm: {
                input: document.querySelector('#confirm-password'),
                toggle: document.querySelector('#toggleConfirmPassword'),
                eye: document.querySelector('#eyeIconConfirm'),
            },
        };
        Object.values(elements).forEach(({ input, toggle, eye }) => {
            if (input && toggle && eye) {
                toggle.addEventListener('click', () => {
                    const isPassword = input.type === 'password';
                    input.type = isPassword ? 'text' : 'password';
                    eye.src = isPassword ? this.UI_CONSTANTS.EYE_OPEN : this.UI_CONSTANTS.EYE_CLOSED;
                });
            }
        });
    },
    showProfile() {
        document.body.classList.add('auth-page');
        const app = document.getElementById('app');
        if (!app)
            return;
        const template = this.templates['user-profile'];
        if (!template)
            return;
        app.innerHTML = template({
            email: this.user?.email || 'Неизвестно',
            name: this.user?.name || this.user?.email?.split('@')[0] || 'Пользователь',
            registeredAt: this.user?.created_at
                ? new Date(this.user.created_at).toLocaleDateString('ru-RU')
                : 'неизвестно',
            avatar: this.UI_CONSTANTS.DEFAULT_AVATAR,
        });
    },
    /**
    * Отображение страницы входа
    * @param {string} error - текст ошибки (если есть)
    * @param {Object} formData - сохранённые данные формы (email)
    */
    showLogin(error, formData) {
        this.currentView = 'login';
        document.body.classList.add('auth-page');
        const app = document.getElementById('app');
        if (!app)
            return;
        const template = this.templates['login-forms'];
        if (!template)
            return;
        app.innerHTML = template({
            error: error,
            email: formData?.email || '',
        });
        this.attachLoginHandler();
        this.initPasswordToggles();
    },
    /**
    * Отображение страницы регистрации
    * @param {string} error - текст ошибки (если есть)
    * @param {boolean} success - успешна ли регистрация
    * @param {Object} formData - сохранённые данные формы
    */
    showRegister(error, success, formData) {
        this.currentView = 'register';
        document.body.classList.add('auth-page');
        const app = document.getElementById('app');
        if (!app)
            return;
        const template = this.templates['register-form'];
        if (!template)
            return;
        app.innerHTML = template({
            error: error,
            success: success,
            name: formData?.name || '',
            email: formData?.email || '',
        });
        this.attachRegisterHandler();
        this.initPasswordToggles();
    },
    /**
    * Обработка отправки формы входа
    * @param {Event} e - событие отправки формы
    * @async
    */
    async handleLoginSubmit(e) {
        e.preventDefault();
        const emailInput = document.getElementById('email');
        const passwordInput = document.getElementById('password');
        const email = emailInput?.value.trim() || '';
        const password = passwordInput?.value || '';
        const validation = _validators_authValidator__WEBPACK_IMPORTED_MODULE_2__.AuthValidator.validateLogin(email, password);
        this.clearFieldErrors();
        this.clearLoginError();
        if (!validation.isValid) {
            // Исправлено: передаем строки, а не пробелы
            this.showFieldErrors({ email: 'Неверный email', password: 'Неверный пароль' });
            this.showLoginError('Неверный email или пароль');
            return;
        }
        this.showLoading(true);
        const result = await _services_authService__WEBPACK_IMPORTED_MODULE_1__.AuthService.login({ email, password });
        this.showLoading(false);
        if (result.success) {
            this.isAuthenticated = true;
            this.user = result.data;
            this.showSuccessMessage('Вход выполнен!');
            this.navigateTo('/');
            return;
        }
        if (result.fieldErrors) {
            this.showFieldErrors(result.fieldErrors);
        }
        else {
            this.showFieldErrors({ email: 'Неверный email', password: 'Неверный пароль' });
        }
        this.showLoginError(result.error || 'Неверный email или пароль');
    },
    /**
    * Обработка отправки формы регистрации
    * @param {Event} e - событие отправки формы
    * @async
    */
    async handleRegisterSubmit(e) {
        e.preventDefault();
        const nameInput = document.getElementById('name');
        const emailInput = document.getElementById('email');
        const passwordInput = document.getElementById('password');
        const confirmInput = document.getElementById('confirm-password');
        const name = nameInput?.value.trim() || '';
        const email = emailInput?.value.trim() || '';
        const password = passwordInput?.value || '';
        const confirmPassword = confirmInput?.value || '';
        const validation = _validators_authValidator__WEBPACK_IMPORTED_MODULE_2__.AuthValidator.validateRegister(name, email, password, confirmPassword);
        this.clearFieldErrors();
        this.clearMessages();
        if (!validation.isValid) {
            const errors = validation.fieldErrors;
            this.showFieldErrors(errors);
            return;
        }
        this.showLoading(true);
        const result = await _services_authService__WEBPACK_IMPORTED_MODULE_1__.AuthService.register({ name, email, password });
        this.showLoading(false);
        if (!result.success && result.fieldErrors) {
            this.showFieldErrors(result.fieldErrors);
            return;
        }
        if (!result.success) {
            this.showGeneralError(result.error || 'Ошибка при регистрации');
            return;
        }
        this.isAuthenticated = true;
        this.user = result.data;
        this.showSuccessMessage('Регистрация успешна!');
        this.navigateTo('/');
    },
    attachLoginHandler() {
        const form = document.getElementById('login-forms');
        if (!form)
            return;
        if (this._loginHandler) {
            form.removeEventListener('submit', this._loginHandler);
        }
        this._loginHandler = this.handleLoginSubmit.bind(this);
        form.addEventListener('submit', this._loginHandler);
    },
    attachRegisterHandler() {
        const form = document.getElementById('register-form');
        if (!form)
            return;
        if (this._registerHandler) {
            form.removeEventListener('submit', this._registerHandler);
        }
        this._registerHandler = this.handleRegisterSubmit.bind(this);
        form.addEventListener('submit', this._registerHandler);
    },
    _loginHandler: null,
    _registerHandler: null,
    clearLoginError() {
        document.querySelectorAll('.login-error, .alert-error').forEach(el => el.remove());
        ['email', 'password'].forEach(id => {
            const el = document.getElementById(id);
            if (el)
                el.classList.remove('error');
        });
    },
    showLoginError(message) {
        this.clearLoginError();
        ['email', 'password'].forEach(id => {
            const el = document.getElementById(id);
            if (el)
                el.classList.add('error');
        });
        const form = document.getElementById('login-forms');
        if (!form)
            return;
        const errorDiv = document.createElement('div');
        errorDiv.className = 'login-error alert alert-error';
        errorDiv.textContent = message;
        form.parentNode?.insertBefore(errorDiv, form);
    },
    clearFieldErrors() {
        document.querySelectorAll('.field-error').forEach(el => el.remove());
        document.querySelectorAll('.error').forEach(el => el.classList.remove('error'));
    },
    clearMessages() {
        document.querySelectorAll('.alert').forEach(el => el.remove());
    },
    // Исправлен тип параметра
    showFieldErrors(fieldErrors) {
        this.clearFieldErrors();
        Object.entries(fieldErrors).forEach(([field, error]) => {
            if (!error)
                return;
            const inputId = field === 'confirmPassword' ? 'confirm-password' : field;
            const input = document.getElementById(inputId);
            if (input) {
                input.classList.add('error');
                const errorDiv = document.createElement('div');
                errorDiv.className = 'field-error';
                errorDiv.textContent = error;
                const wrapper = input.closest('.password-wrapper');
                if (wrapper) {
                    wrapper.after(errorDiv);
                }
                else {
                    input.parentNode?.appendChild(errorDiv);
                }
            }
        });
    },
    showSuccessMessage(message) {
        const form = document.getElementById('register-form') || document.getElementById('login-forms');
        if (!form)
            return;
        const successDiv = document.createElement('div');
        successDiv.className = 'alert alert-success';
        successDiv.textContent = message;
        form.appendChild(successDiv);
        setTimeout(() => successDiv.remove(), 3000);
    },
    showGeneralError(message) {
        const form = document.getElementById('register-form') || document.getElementById('login-forms');
        if (!form)
            return;
        const errorDiv = document.createElement('div');
        errorDiv.className = 'alert alert-error';
        errorDiv.textContent = message;
        form.appendChild(errorDiv);
    },
    showLoading(show) {
        const loader = document.getElementById('global-loader');
        if (!show) {
            loader?.remove();
            return;
        }
        if (!loader) {
            const newLoader = document.createElement('div');
            newLoader.id = 'global-loader';
            newLoader.className = 'loader-overlay';
            newLoader.innerHTML = this.UI_CONSTANTS.LOADER_HTML;
            document.body.appendChild(newLoader);
        }
    },
    async logout() {
        this.showLoading(true);
        await _services_authService__WEBPACK_IMPORTED_MODULE_1__.AuthService.logout();
        this.showLoading(false);
        await this.checkAuth();
        if (window.location.pathname !== '/') {
            this.navigateTo('/');
            return;
        }
        this.renderMain();
    },
    formatDate(dateString) {
        return dateString ? new Date(dateString).toLocaleDateString('ru-RU', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        }) : '';
    },
};



/***/ },

/***/ "./src/js/core/config.ts"
/*!*******************************!*\
  !*** ./src/js/core/config.ts ***!
  \*******************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   CONFIG: () => (/* binding */ CONFIG)
/* harmony export */ });
/**
* Файл с настройками приложения
* Здесь хранятся все важные константы: адреса сервера, название сайта и т.д.
*
* @module config
*/
/**
* Объект с конфигурацией всего приложения
*
* @property {Object} API - настройки для связи с сервером
* @property {string} API.BASE_URL - базовый URL сервера (без /api/v1)
* @property {string} API.API_URL - полный URL для API запросов
* @property {Object} APP - настройки самого приложения
* @property {string} APP.NAME - название сайта
* @property {string} APP.VERSION - версия приложения
*/
// Определяем, где запущен фронтенд
const _isLocal = typeof window !== 'undefined' && (window.location.hostname === 'localhost' ||
    window.location.hostname === '127.0.0.1');
const CONFIG = {
    API: {
        // BASE_URL всегда указывает на реальный бэкенд.
        BASE_URL: 'http://clover-go.ru:8000',
        // Локально -> стучимся на относительный '/api/v1' (запросы перехватит Node.js)
        // На проде -> стучимся напрямую к бэкенду на порт 8000
        API_URL: _isLocal ? '/api/v1' : 'http://clover-go.ru:8000/api/v1',
    },
    // Другие константы конфигурации можно добавить сюда же
    APP: {
        NAME: 'Клевер',
        VERSION: '1.0.0',
    },
};



/***/ },

/***/ "./src/js/services/adsServices.ts"
/*!****************************************!*\
  !*** ./src/js/services/adsServices.ts ***!
  \****************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   AdsService: () => (/* binding */ AdsService)
/* harmony export */ });
/* harmony import */ var _core_config__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @/core/config */ "./src/js/core/config.ts");
/**
* Сервис для работы с объявлениями
* Здесь все функции, которые связаны с получением и отображением объявлений
*
* @module adsServices
*/

/**
 * Объект с методами для работы с объявлениями
 * Умеет получать все объявления, одно объявление по ID,
 * и форматировать их для отображения на странице
 */
const AdsService = {
    API_URL: _core_config__WEBPACK_IMPORTED_MODULE_0__.CONFIG.API.API_URL,
    /**
     * Получает все объявления с сервера
     * @async
     * @returns {Promise<Object>} - объект с полем success и либо ads (массив объявлений), либо error
     *
     * @example
     * // Пример использования:
     * const result = await AdsService.getAllAds();
     * if (result.success) {
     *   console.log('Объявления:', result.ads);
     * } else {
     *   console.error('Ошибка:', result.error);
     * }
     */
    async getAllAds() {
        try {
            const response = await fetch(`${this.API_URL}/ads`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (!response.ok) {
                throw new Error('Ошибка загрузки объявлений');
            }
            const data = await response.json();
            return {
                success: true,
                data: data,
            };
        }
        catch (error) {
            return {
                success: false,
                error: 'Не удалось загрузить объявления',
            };
        }
    },
    /**
     * Получает одно конкретное объявление по его ID
     * @async
     * @param {number|string} id - идентификатор объявления
     * @returns {Promise<Object>} - объект с объявлением или ошибкой
     *
     * @example
     * const result = await AdsService.getAdById(123);
     * if (result.success) {
     *   console.log('Объявление:', result.ad);
     * }
     */
    async getAdById(id) {
        try {
            const response = await fetch(`${this.API_URL}/ads/${id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (!response.ok) {
                throw new Error('Объявление не найдено');
            }
            const data = await response.json();
            return {
                success: true,
                data: data,
            };
        }
        catch (error) {
            return {
                success: false,
                error: 'Не удалось загрузить объявление',
            };
        }
    },
    /**
     * Подготовливает объявление для отображения на карточке
     * Форматирует цену, дату, добавляет полный путь к картинке
     *
     * @param {Object} ad - сырое объявление с сервера
     * @returns {Object} - отформатированное объявление для шаблона
     *
     */
    formatAdCard(ad) {
        const firstPhoto = ad.photos?.[0] || '';
        let imageUrl = '/images/placeholder.jpg';
        if (firstPhoto) {
            imageUrl = firstPhoto.startsWith('http')
                ? firstPhoto
                : `${_core_config__WEBPACK_IMPORTED_MODULE_0__.CONFIG.API.BASE_URL}${firstPhoto}`;
        }
        return {
            id: ad.id,
            title: ad.title,
            description: ad.description?.substring(0, 100) + '...',
            price: ad.price.toLocaleString('ru-RU') + ' ₽',
            location: ad.location || 'Не указано',
            image: imageUrl,
            views: ad.views_count || 0,
            favorites: ad.favorites_count || 0,
            date: ad.created_at ? new Date(ad.created_at).toLocaleDateString('ru-RU') : '',
        };
    },
};



/***/ },

/***/ "./src/js/services/authService.ts"
/*!****************************************!*\
  !*** ./src/js/services/authService.ts ***!
  \****************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   AuthService: () => (/* binding */ AuthService)
/* harmony export */ });
/* harmony import */ var _api_apiClient__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @/api/apiClient */ "./src/js/api/apiClient.ts");
/**
 * Сервис для работы с авторизацией
 *
 * @module authService
 */

const HTTP_STATUS = {
    UNAUTHORIZED: 401,
    BAD_REQUEST: 400,
};
// Словарь ошибок
const AuthErrorMap = {
    'invalid input': 'Некорректный ввод',
    'wrong email or password': 'Неверный email или пароль',
    'password too short': 'Пароль должен быть не менее 8 символов',
    'user not found': 'Пользователь не найден',
    'user already exists': 'Этот email уже занят',
    'internal error': 'Внутренняя ошибка сервера',
    'too short': 'Пароль должен быть не менее 8 символов',
    'no digit': 'Пароль должен содержать хотя бы одну цифру',
    'no letter': 'Пароль должен содержать хотя бы одну букву',
    'special characters not allowed': 'Пароль может содержать только латинские буквы и цифры',
    'invalid email format': 'Некорректный формат email',
    'invalid credentials': 'Неверный email или пароль',
    'password must be at least 8 characters long': 'Пароль должен быть не менее 8 символов',
    'password must contain at least one digit': 'Пароль должен содержать хотя бы одну цифру',
    'password must contain at least one latin letter': 'Пароль должен содержать хотя бы одну букву',
    'password contains forbidden characters': 'Пароль может содержать только латинские буквы и цифры',
    'name cannot be empty': 'Имя не может быть пустым',
    'name contains invalid characters': 'Имя содержит недопустимые символы',
};
/**
 * Объект реализующий авторизацию
 */
const AuthService = {
    /**
     * Регистрация нового пользователя
     * @async
     * @param {Object} userData - данные пользователя
     * @param {string} userData.name - имя пользователя
     * @param {string} userData.email - email
     * @param {string} userData.password - пароль
     * @returns {Promise<Object>} - результат регистрации
     *
     */
    async register(userData) {
        const result = await _api_apiClient__WEBPACK_IMPORTED_MODULE_0__.apiClient.post(_api_apiClient__WEBPACK_IMPORTED_MODULE_0__.API_ENDPOINTS.AUTH.REGISTER, {
            name: userData.name || userData.username,
            email: userData.email,
            password: userData.password,
        });
        if (result.success) {
            return {
                success: true,
                data: result.data,
                error: null,
            };
        }
        if (result.status === HTTP_STATUS.BAD_REQUEST && result.data) {
            const fieldErrors = {};
            const data = result.data;
            if (data.email) {
                fieldErrors.email = AuthErrorMap[data.email] || data.email;
            }
            if (data.password) {
                fieldErrors.password = AuthErrorMap[data.password] || data.password;
            }
            if (data.name) {
                fieldErrors.name = AuthErrorMap[data.name] || data.name;
            }
            return {
                success: false,
                error: 'Ошибка в полях',
                fieldErrors: fieldErrors,
                status: result.status,
            };
        }
        const translatedError = result.error ? (AuthErrorMap[result.error] || result.error) : 'Ошибка';
        return {
            success: false,
            error: translatedError,
            status: result.status,
        };
    },
    /**
     * Вход в систему
     * @async
     * @param {Object} credentials - учётные данные
     * @param {string} credentials.email - email
     * @param {string} credentials.password - пароль
     * @returns {Promise<Object>} - результат входа
     */
    async login(credentials) {
        const result = await _api_apiClient__WEBPACK_IMPORTED_MODULE_0__.apiClient.post(_api_apiClient__WEBPACK_IMPORTED_MODULE_0__.API_ENDPOINTS.AUTH.LOGIN, {
            email: credentials.email,
            password: credentials.password,
        });
        if (result.success) {
            return {
                success: true,
                data: result.data,
                error: null,
            };
        }
        if (result.status === HTTP_STATUS.UNAUTHORIZED) {
            return {
                success: false,
                error: 'Неверный email или пароль',
                fieldErrors: {
                    email: 'Неверный email',
                    password: 'Неверный пароль',
                },
                status: result.status,
            };
        }
        const translatedError = result.error ? (AuthErrorMap[result.error] || result.error) : 'Ошибка';
        return {
            success: false,
            error: translatedError,
            status: result.status,
        };
    },
    async logout() {
        await _api_apiClient__WEBPACK_IMPORTED_MODULE_0__.apiClient.post(_api_apiClient__WEBPACK_IMPORTED_MODULE_0__.API_ENDPOINTS.AUTH.LOGOUT, {});
    },
    async check() {
        const result = await _api_apiClient__WEBPACK_IMPORTED_MODULE_0__.apiClient.post(_api_apiClient__WEBPACK_IMPORTED_MODULE_0__.API_ENDPOINTS.AUTH.LOGIN, {});
        return {
            isAuthenticated: result.success,
            user: result.success ? result.data : null,
        };
    },
};



/***/ },

/***/ "./src/js/utils/storage.ts"
/*!*********************************!*\
  !*** ./src/js/utils/storage.ts ***!
  \*********************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Storage: () => (/* binding */ Storage)
/* harmony export */ });
/**
 * Модуль для работы с локальным хранилищем браузера (localStorage)
 * Здесь сохраняем данные пользователя и проверяем авторизацию
 *
 * @module storage
 */
/**
 * Объект с методами для сохранения и получения данных
 * Использует localStorage для долговременного хранения
 */
const Storage = {
    setItem(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        }
        catch (e) {
            console.error('Ошибка сохранения в localStorage:', e);
        }
    },
    getItem(key) {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : null;
        }
        catch (e) {
            return null;
        }
    },
    removeItem(key) {
        localStorage.removeItem(key);
    },
    clear() {
        localStorage.clear();
    },
    setUserPreferences(prefs) {
        this.setItem('user_preferences', prefs);
    },
    getUserPreferences() {
        return this.getItem('user_preferences') || {};
    },
    setUser: undefined,
    getUser: undefined,
    removeUser: undefined,
    isAuthenticated: undefined,
    logout: undefined,
};



/***/ },

/***/ "./src/js/validators/authValidator.ts"
/*!********************************************!*\
  !*** ./src/js/validators/authValidator.ts ***!
  \********************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   AuthValidator: () => (/* binding */ AuthValidator)
/* harmony export */ });
/**
 * Валидатор для форм авторизации
 * Проверяет, правильно ли пользователь заполнил поля:
 * - email должен быть настоящим
 * - пароль достаточно сложный
 * - имя содержит только допустимые символы
 *
 * @module authValidator
 */
const AuthValidator = {
    USERNAME_REGEX: /^[a-zA-Z0-9_]+$/,
    EMAIL_REGEX: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    LETTER_REGEX: /[a-zA-Z]/,
    DIGIT_REGEX: /[0-9]/,
    FORBIDDEN_REGEX: /[^a-zA-Z0-9_]/,
    USERNAME_MIN_LENGTH: 3,
    PASSWORD_MIN_LENGTH: 8,
    validateUsername(username) {
        if (!username)
            return false;
        return username.length >= this.USERNAME_MIN_LENGTH && this.USERNAME_REGEX.test(username);
    },
    validateEmail(email) {
        if (!email)
            return false;
        return this.EMAIL_REGEX.test(email.toLowerCase());
    },
    validatePassword(password) {
        if (!password) {
            return {
                isValid: false,
                error: 'Пароль обязателен',
            };
        }
        if (password.length < this.PASSWORD_MIN_LENGTH) {
            return {
                isValid: false,
                error: `Пароль должен быть не менее ${this.PASSWORD_MIN_LENGTH} символов`,
            };
        }
        const hasLetter = this.LETTER_REGEX.test(password);
        const hasDigit = this.DIGIT_REGEX.test(password);
        const hasForbidden = this.FORBIDDEN_REGEX.test(password);
        if (hasForbidden) {
            return {
                isValid: false,
                error: 'Пароль может содержать только латинские буквы, цифры и нижнее подчёркивание',
            };
        }
        if (!hasLetter && !hasDigit) {
            return {
                isValid: false,
                error: 'Пароль должен содержать хотя бы одну букву и одну цифру',
            };
        }
        if (!hasLetter) {
            return {
                isValid: false,
                error: 'Пароль должен содержать хотя бы одну букву',
            };
        }
        if (!hasDigit) {
            return {
                isValid: false,
                error: 'Пароль должен содержать хотя бы одну цифру',
            };
        }
        return {
            isValid: true,
            error: null,
        };
    },
    validateLogin(email, password) {
        if (!email || !password) {
            return {
                isValid: false,
                error: 'Заполните поля',
            };
        }
        if (!this.validateEmail(email)) {
            return {
                isValid: false,
                error: 'Неверный email или пароль',
            };
        }
        return {
            isValid: true,
            error: null,
        };
    },
    validateRegister(name, email, password, confirmPassword) {
        const fieldErrors = {
            name: null,
            email: null,
            password: null,
            confirmPassword: null,
        };
        if (!name) {
            fieldErrors.name = 'Имя обязательно';
        }
        else if (!this.validateUsername(name)) {
            fieldErrors.name = `Имя может содержать только латиницу, цифры и _, минимум ${this.USERNAME_MIN_LENGTH} символа`;
        }
        if (!email) {
            fieldErrors.email = 'Email обязателен';
        }
        else if (!this.validateEmail(email)) {
            fieldErrors.email = 'Некорректный email. Пример: ivanov@iv.ru';
        }
        const passwordValidation = this.validatePassword(password);
        if (!passwordValidation.isValid) {
            fieldErrors.password = passwordValidation.error;
        }
        if (password !== confirmPassword) {
            fieldErrors.confirmPassword = 'Пароли не совпадают';
        }
        const hasErrors = Object.values(fieldErrors).some(error => error !== null);
        return {
            isValid: !hasErrors,
            fieldErrors: fieldErrors,
            errors: Object.values(fieldErrors).filter(e => e !== null),
        };
    },
};



/***/ }

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			id: moduleId,
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		if (!(moduleId in __webpack_modules__)) {
/******/ 			delete __webpack_module_cache__[moduleId];
/******/ 			var e = new Error("Cannot find module '" + moduleId + "'");
/******/ 			e.code = 'MODULE_NOT_FOUND';
/******/ 			throw e;
/******/ 		}
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/nonce */
/******/ 	(() => {
/******/ 		__webpack_require__.nc = undefined;
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be in strict mode.
(() => {
"use strict";
/*!************************!*\
  !*** ./src/js/main.ts ***!
  \************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _public_css_base_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../public/css/base.css */ "./public/css/base.css");
/* harmony import */ var _public_css_components_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../public/css/components.css */ "./public/css/components.css");
/* harmony import */ var _public_css_auth_css__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../public/css/auth.css */ "./public/css/auth.css");
/* harmony import */ var _public_css_main_css__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../public/css/main.css */ "./public/css/main.css");
/* harmony import */ var _utils_storage__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @/utils/storage */ "./src/js/utils/storage.ts");
/* harmony import */ var _validators_authValidator__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @/validators/authValidator */ "./src/js/validators/authValidator.ts");
/* harmony import */ var _services_authService__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @/services/authService */ "./src/js/services/authService.ts");
/* harmony import */ var _services_adsServices__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @/services/adsServices */ "./src/js/services/adsServices.ts");
/* harmony import */ var _api_apiClient__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @/api/apiClient */ "./src/js/api/apiClient.ts");
/* harmony import */ var _app__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./app */ "./src/js/app.ts");
/**
 * Точка входа в приложение
 *
 * @module main
 */










// Инициализация приложения после загрузки всех модулей
// Откладываем запуск приложения до момента,
// когда весь HTML будет построен и готов к работе
document.addEventListener('DOMContentLoaded', () => _app__WEBPACK_IMPORTED_MODULE_9__.App.init());

})();

/******/ })()
;
//# sourceMappingURL=main.843157fb56037e3cc3a8.js.map