import { test } from "../../fixtures/task-manager-fixture";
import { IMPORTANCE, LABEL } from "./utils/constants";
import { faker } from "@faker-js/faker";

// Definirea detaliilor task-ului
const taskTitle = faker.lorem.sentence(3);
const taskDescription = faker.lorem.paragraph(1);

test.describe("Verificarea validarii cerintelor", () => {
  test('verifica ca starea task-ului este "Uncomplete"', async ({
    taskManagerPage,
  }) => {
    // Crearea unui task nou
    await taskManagerPage.createNewTask(
      taskTitle,
      taskDescription,
      IMPORTANCE.HIGH,
      LABEL.HOME
    );

    // Verificarea ca task-ul are starea asteptata
    await taskManagerPage.expectTaskStatus(taskTitle, "Uncomplete");
  });

  test("verifica ca task-ul nu poate fi creat fara titlu", async ({
    taskManagerPage,
  }) => {
    // Crearea unui task nou fara titlu
    await taskManagerPage.createNewTask(
      "",
      taskDescription,
      IMPORTANCE.HIGH,
      LABEL.HOME
    );

    // Verificarea ca task-ul nu a fost creat
    await taskManagerPage.expectTaskCount(0);
  });

  test('verifica ca task-ul are importanta implicita "Medium"', async ({
    taskManagerPage,
  }) => {
    // Crearea unui task nou, fara a specifica importanta
    await taskManagerPage.fillTaskDetails(taskTitle, taskDescription);
    await taskManagerPage.selectLabel(LABEL.HOME);
    await taskManagerPage.addTask();

    // Verificarea ca task-ul are importanta asteptata
    await taskManagerPage.expectTaskDetails(
      taskTitle,
      taskDescription,
      IMPORTANCE.MEDIUM, // importanta implicita
      LABEL.HOME
    );
  });

  test("verifica ca task-ul are eticheta implicita 'Work'", async ({
    taskManagerPage,
  }) => {
    // Crearea unui task nou, fara a specifica eticheta
    await taskManagerPage.fillTaskDetails(taskTitle, taskDescription);
    await taskManagerPage.selectImportance(IMPORTANCE.HIGH);
    await taskManagerPage.addTask();

    // Verificarea ca task-ul are eticheta asteptata
    await taskManagerPage.expectTaskDetails(
      taskTitle,
      taskDescription,
      IMPORTANCE.HIGH,
      LABEL.WORK // eticheta implicita
    );
  });
});
