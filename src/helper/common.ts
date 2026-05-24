import { expect, type Page, type FrameLocator } from '@playwright/test';

type LocatorContainer = Page | FrameLocator;

export async function waitForStableCount(
    container: LocatorContainer,
    selector: string,
    {
        intervals = [500],
        timeout = 10_000,
        stableTimes = 3,
    }: {
        intervals?: number[];
        timeout?: number;
        stableTimes?: number;
    } = {}
): Promise<number> {
    const locator = container.locator(selector);

    let finalCount = 0;
    let previousCount = -1;
    let stableTimesCount = 0;

    await expect(async () => {
        const currentCount = await locator.count();

        if (currentCount === previousCount) {
            stableTimesCount++;
        } else {
            previousCount = currentCount;
            stableTimesCount = 0;
        }

        finalCount = currentCount;

        expect(stableTimesCount).toBeGreaterThanOrEqual(stableTimes);
    }).toPass({
        intervals,
        timeout,
    });

    return finalCount;
}