import { Locator } from "@playwright/test";
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

test.describe("Stergerea task-urilor", () => {
  test("permite utilizatorului stergerea unui task existent", async ({
    taskManagerPage,
  }) => {
    // Stergerea task-ului. Metoda deleteTask verifica si ca task-ul nu mai este vizibil
    await taskManagerPage.deleteTask(taskTitle);
  });

  test("permite utilizatorului stergerea mai multor task-uri existente", async ({
    taskManagerPage,
  }) => {
    // Crearea a doua task-uri noi
    const secondTaskTitle = faker.lorem.sentence(3);
    const secondTaskDescription = faker.lorem.paragraph(1);

    await taskManagerPage.createNewTask(
      secondTaskTitle,
      secondTaskDescription,
      IMPORTANCE.MEDIUM,
      LABEL.WORK
    );

    // Verificarea ca ambele task-uri sunt vizibile
    await taskManagerPage.expectTaskToBeVisible(taskTitle);
    await taskManagerPage.expectTaskToBeVisible(secondTaskTitle);

    // Stergerea ambelor task-uri
    await taskManagerPage.deleteTask(taskTitle);
    await taskManagerPage.deleteTask(secondTaskTitle);
  });
});
