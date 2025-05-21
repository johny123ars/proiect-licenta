import { test } from "../../fixtures/task-manager-fixture";
import { IMPORTANCE, LABEL } from "./utils/constants";
import { faker } from "@faker-js/faker";

test.describe("Crearea task-urilor", () => {
  test.describe("Scenarii pozitive", () => {
    test("permite utilizatorului crearea unui task nou", async ({
      taskManagerPage,
    }) => {
      // Definirea detaliilor task-ului
      const taskTitle = faker.lorem.sentence(3);
      const taskDescription = faker.lorem.paragraph(1);

      // Crearea unui task nou
      await taskManagerPage.createNewTask(
        taskTitle,
        taskDescription,
        IMPORTANCE.HIGH,
        LABEL.HOME
      );

      // Verificarea ca task-ul a fost adaugat, este vizibil si are detaliile corecte
      await taskManagerPage.expectTaskToBeVisible(taskTitle);
      await taskManagerPage.expectTaskCount(1);
      await taskManagerPage.expectTaskDetails(
        taskTitle,
        taskDescription,
        IMPORTANCE.HIGH,
        LABEL.HOME
      );

      // Verificarea ca task-ul este marcat ca nefinalizat
      await taskManagerPage.expectTaskStatus(taskTitle, "Uncomplete");
    });

    test("permite utilizatorului crearea mai multor task-uri noi", async ({
      taskManagerPage,
    }) => {
      // Bucla pentru a crea 3 task-uri
      for (let i = 0; i < 3; i++) {
        // Definirea detaliilor task-ului
        const taskTitle = faker.lorem.sentence(3);
        const taskDescription = faker.lorem.paragraph(1);

        // Crearea unui task nou
        await taskManagerPage.createNewTask(
          taskTitle,
          taskDescription,
          IMPORTANCE.MEDIUM,
          LABEL.WORK
        );

        // Verificarea ca task-urile sunt vizibile si au detaliile corecte
        await taskManagerPage.expectTaskToBeVisible(taskTitle);
        await taskManagerPage.expectTaskDetails(
          taskTitle,
          taskDescription,
          IMPORTANCE.MEDIUM,
          LABEL.WORK
        );
      }

      // Verificarea ca numarul total de task-uri este corect
      await taskManagerPage.expectTaskCount(3);
    });

    for (const titleLength of [1, 20, 50]) {
      test(`utilizatorul poate crea un task cu lungimea titlului de ${titleLength} caracter(e)`, async ({
        taskManagerPage,
      }) => {
        const taskTitle = faker.string.alpha(titleLength);

        // Crearea unui task nou
        await taskManagerPage.fillTaskDetails(taskTitle, "");
        await taskManagerPage.addTask(); // Adaugarea task-ului

        // Verificarea ca task-ul a fost adaugat, este vizibil si are detaliile corecte
        await taskManagerPage.expectTaskToBeVisible(taskTitle);
        await taskManagerPage.expectTaskCount(1);
        await taskManagerPage.expectTaskDetails(
          taskTitle,
          "",
          IMPORTANCE.MEDIUM,
          LABEL.WORK
        );
      });
    }
  });

  test.describe("Scenarii negative", () => {
    test("nu permite utilizatorului crearea unui task cu titlu gol", async ({
      taskManagerPage,
    }) => {
      // Definirea detaliilor task-ului
      const taskTitle = "";
      const taskDescription = faker.lorem.paragraph(1);

      // Crearea unui task nou
      await taskManagerPage.createNewTask(
        taskTitle,
        taskDescription,
        IMPORTANCE.HIGH,
        LABEL.HOME
      );

      // Verificarea ca task-ul nu a fost adaugat
      await taskManagerPage.expectTaskCount(0);
    });
  });
});
