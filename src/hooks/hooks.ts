import { Before, After, AfterAll, Status, AfterStep } from '@cucumber/cucumber';
import { Browser, BrowserContext, chromium, Page } from '@playwright/test';
import { pageFixture } from './pageFixture';

let browser: Browser;
let context: BrowserContext;

Before(async function () {
    browser = await chromium.launch({ headless: false });

});


Before(async function () {
    context = await browser.newContext();
    const page = await browser.newPage();
    pageFixture.page = page;

});

// AfterStep(async function ({ pickle, result }) {
//     const img = await pageFixture.page.screenshot({ path: `./screenshots/${pickle.name}` + `-${new Date().getTime()}.png` });
//     await this.attach(img, 'image/png');
// });


After(async function ({ pickle, result }) {
    if (result?.status === Status.FAILED) {
        console.log(`Scenario Failed: ${pickle.name}`);
        // screenshot, pickle.name = scenario.name
        const img = await pageFixture.page.screenshot({ path: `./screenshots/${pickle.name}` + `-${new Date().getTime()}.png` });
        await this.attach(img, 'image/png');
    }
    else {
        console.log(`Scenario Passed: ${pickle.name}`);
    }


    await pageFixture.page.close();
    await context.close();
});

AfterAll(async function () {
    await browser.close();
});