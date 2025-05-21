import { test as baseTest } from "@playwright/test";
import { TaskManagerPage } from "../pages/TaskManager";

type TaskManagerFixtures = {
  taskManagerPage: TaskManagerPage;
};

export const test = baseTest.extend<TaskManagerFixtures>({
  taskManagerPage: async ({ page }, use) => {
    // Setup fixture
    const taskManagerPage = new TaskManagerPage(page);
    await taskManagerPage.goto();
    
    // Use fixture value in the test
    await use(taskManagerPage);

    // Close the page when the test is finished
    await page.close();
  },
});

export { expect } from "@playwright/test";
