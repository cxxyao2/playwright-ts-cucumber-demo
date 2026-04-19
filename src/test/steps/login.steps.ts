import { Given, Then, When } from "@cucumber/cucumber";
import { chromium, Page, Browser } from '@playwright/test';

let browser: Browser;
let page: Page;



Given('I am on the login page', async function () {
    browser = await chromium.launch({ headless: false });
    page = await browser.newPage();
    await page.goto('https://www.msn.com/en-ca', { waitUntil: 'domcontentloaded', timeout: 30000 });
});

When('User enter the username as {string}', async function (username: string) {
    console.log(`User enter the username as ${username}`);
});


When('User enter the password as {string}', async function (password: string) {
    console.log(`User enter the password as "password"`);
});


Then('Login should be successful', async function () {
    console.log('Login should be successful');
    await browser.close();
});