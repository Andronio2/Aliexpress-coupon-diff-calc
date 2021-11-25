// ==UserScript==
// @name         Aliexpress coupon diff calc
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Вычисляет разность купона и текущей цены
// @author       Andronio
// @homepage     https://github.com/Andronio2/Aliexpress-coupon-diff-calc
// @supportURL   https://github.com/Andronio2/Aliexpress-coupon-diff-calc/issues
// @updateURL    https://github.com/Andronio2/Aliexpress-coupon-diff-calc/raw/main/Aliexpress%20coupon%20diff%20calc.user.js
// @downloadURL  https://github.com/Andronio2/Aliexpress-coupon-diff-calc/raw/main/Aliexpress%20coupon%20diff%20calc.user.js
// @match        https://www.aliexpress.com/item/*
// @match        https://www.aliexpress.ru/item/*
// @match        https://aliexpress.ru/item/*
// @icon         https://www.google.com/s2/favicons?domain=aliexpress.com
// @grant        none
// @run-at       document-idle
// ==/UserScript==

(function() {
    'use strict';

    const fixCouponPrice = '';

    let fixed = fixCouponPrice !== '';

    let mainWindow = document.createElement('div');
    mainWindow.className = 'coupon_diff_calc-window-main';
    mainWindow.innerHTML = `
<input type="text" id="coupon_diff_calc-input">
<p id="coupon_diff_calc-output">0</p>
`;
    let styles = `
.coupon_diff_calc-window-main {
position: fixed;
top: 0;
left: 10px;
background: white;
box-shadow: 1px -1px 4px 1px;
width: 200px;
height: 75px;
padding: 10px 20px;
z-index: 100;
}

#coupon_diff_calc-input {
border: solid black 2px;
border-radius: 5px;
padding: 5px;
width: 100%;
font-size: 15px;
margin-bottom: 5px;
}

#coupon_diff_calc-output {
font-size: 15px;
}
`;
    let styleSheet = document.createElement("style");
    styleSheet.type = "text/css";
    styleSheet.innerText = styles;
    document.head.append(styleSheet)
    document.body.append(mainWindow);
    const input = document.getElementById('coupon_diff_calc-input');
    if (!fixed) {
        let restoreValue = localStorage.getItem('coupon_diff_calc-value');
        if (restoreValue) input.value = restoreValue;
        input.addEventListener('change', () => {
            localStorage.setItem('coupon_diff_calc-value', input.value);
        });
    } else {
        input.value = fixCouponPrice;
    }


    setInterval(() => {
        let price = document.querySelector('.product-price-value,  .product-price-current');
        if (!price) price = document.querySelector('.uniform-banner-box-price, .Product_UniformBanner__uniformBannerBoxPrice__o5qwb');
        if (!price) {
            console.log('не нашел цену');
            return;
        }
        let itemPrice = price.textContent.match(/\d{1,3}\s\d{3},\d{2}|\d{1,3},\d{3}\.\d{2}|\d{1,3}[\.,]\d{2}/);
        if (itemPrice && itemPrice.length === 0) {
            console.log('цена товара не верная');
            return;
        }
        itemPrice = +itemPrice[0].replace(/(\d{1,3})\s(\d{3},\d{2})/, '$1$2').replace(/(\d{1,3}),(\d{3}\.\d{2})/, '$1$2').replace(',','.');
        if (isNaN(itemPrice)) {
            console.log('цена товара не верная2');
            return;
        }
        const output = document.getElementById('coupon_diff_calc-output');
        const input = document.getElementById('coupon_diff_calc-input');
        if (!output || !input) {
            console.log('нет вывода');
            return;
        }
        let couponPrice = +input.value.replace(',','.');
        if (isNaN(couponPrice)) {
            console.log('ввели не число');
            return;
        }
        output.textContent = `${couponPrice} - ${itemPrice} = ${(couponPrice - itemPrice).toFixed(2)}`;

    }, 500);
})();
