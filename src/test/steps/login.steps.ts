import { Given, Then, When, setDefaultTimeout } from "@cucumber/cucumber";
import { pageFixture } from "../../hooks/pageFixture";
import { expect } from "playwright/test";

setDefaultTimeout(60 * 1000 * 3);

Given('I am on the login page', async function () {
    await pageFixture.page.goto('https://www.msn.com/en-ca', { waitUntil: 'domcontentloaded', timeout: 30000 });

});

When('User enter the username as {string}', async function (username: string) {
    await expect(pageFixture.page.locator('input[type="search"]').first()).toBeVisible();
    console.log(`User enter the username as ${username}`);
});


When('User enter the password as {string}', async function (password: string) {
    console.log(`User enter the password as "password"`);
});


Then('Login should be successful', async function () {
    console.log('Login should be successful');
});