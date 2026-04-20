import { BeforeAll, AfterAll } from '@cucumber/cucumber';
import { Browser, chromium, Page } from '@playwright/test';
import { pageFixture } from './pageFixture';

let browser: Browser;
let page: Page;

BeforeAll(async function () {
    browser = await chromium.launch({ headless: false });
    page = await browser.newPage();
    pageFixture.page = page;

});

AfterAll(async function () {
    await pageFixture.page.close();
    await browser.close();

    console.log('AfterAll');
});