import { expect, Locator } from "@playwright/test";
import { test } from "../../fixtures/task-manager-fixture";
import { IMPORTANCE, LABEL } from "./utils/constants";
import { faker } from "@faker-js/faker";

let task: Locator;

const taskTitle = faker.lorem.sentence(3);
const taskDescription = faker.lorem.paragraph(1);

test.beforeEach(
  "Crearea unui task pentru a fi editat",
  async ({ taskManagerPage }) => {
    // Crearea unui task nou
    await taskManagerPage.createNewTask(
      taskTitle,
      taskDescription,
      IMPORTANCE.HIGH,
      LABEL.HOME
    );

    // Verificarea ca task-ul a fost adaugat, este vizibil
    await taskManagerPage.expectTaskToBeVisible(taskTitle);

    // Stocarea task-ului in variabila pentru a fi utilizat in testele ulterioare
    task = taskManagerPage.getTaskItem(taskTitle);
  }
);

test.describe("Editarea task-urilor", () => {
  test("permite utilizatorului editarea titlului unui task existent", async ({
    taskManagerPage,
  }) => {
    // Definirea unui nou titlu pentru task
    const newTitle = faker.lorem.sentence(3);

    await taskManagerPage.editTask(taskTitle, { title: newTitle });

    // Verificarea ca task-ul a fost editat si are titlul corect
    await taskManagerPage.expectTaskToBeVisible(newTitle);
  });

  test("permite utilizatorului editarea descrierii unui task existent", async ({
    taskManagerPage,
  }) => {
    // Definirea unei noi descrieri pentru task
    const newDescription = faker.lorem.paragraph(1);

    await taskManagerPage.editTask(taskTitle, { description: newDescription });

    const editedTask = taskManagerPage.getTaskItem(taskTitle);

    // Verificarea ca task-ul a fost editat si are descrierea corecta
    await expect(editedTask.locator("p.text-sm")).toHaveText(newDescription);
  });
});
