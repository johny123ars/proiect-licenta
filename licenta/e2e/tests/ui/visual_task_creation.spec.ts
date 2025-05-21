import { test } from "../../fixtures/task-manager-fixture";
import { IMPORTANCE, LABEL } from "./utils/constants";
import { faker } from "@faker-js/faker";

const title: string = faker.lorem.word();
const description: string = faker.lorem.sentence(3);

const importances = [IMPORTANCE.HIGH, IMPORTANCE.MEDIUM, IMPORTANCE.LOW];
const labels = [LABEL.HOME, LABEL.WORK, LABEL.SOCIAL, LABEL.HOBBY];

let taskIndex = 1;

for (const importance of importances) {
  for (const label of labels) {
    // Pass testInfo to the test callback
    test(`Creare task nr.${taskIndex} cu importanta: "${importance}" si etichta: "${label}"`, async ({
      taskManagerPage,
    }, testInfo) => {
      await taskManagerPage.createNewTask(
        title,
        description,
        importance,
        label
      );

      const screenshotPath = testInfo.outputPath(
        `${taskIndex}-${importance}-${label}.png`
      );

      // Captura de ecran a paginii dupa adaugarea task-ului
      await taskManagerPage.page.screenshot({
        path: screenshotPath,
        fullPage: true,
      });

      // Optional: Log the path to confirm where it's saved
      console.log(`Screenshot saved to: ${screenshotPath}`);
    });
    taskIndex++;
  }
}
