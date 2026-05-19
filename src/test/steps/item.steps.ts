import { When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';

When(/^User select '([^']+)' from itemlist dropdown$/, async function (itemName: string) {
  await this.page.getByTestId('itemlist-dropdown').click();
  await this.page.getByRole('option', { name: itemName }).click();
});

When(/^User click add button$/, async function () {
  await this.page.getByRole('button', { name: /add/i }).click();
});

Then(/^"([^"]+)" appears in the shopping cart$/, async function (itemName: string) {
  const shoppingCart = this.page.getByTestId('shopping-cart');

  await expect(shoppingCart.getByText(itemName)).toBeVisible();
});