import { Page, expect, Locator } from "@playwright/test";

export class TaskManagerPage {
  readonly page: Page;

  // --- Locators for Task Creation Form ---
  readonly taskTitleInput: Locator;
  readonly taskDescriptionInput: Locator;
  readonly importanceSelect: Locator;
  readonly labelSelect: Locator;
  readonly addTaskButton: Locator;

  // --- Locators for Task Filtering/Sorting ---
  readonly filterSelect: Locator; // Native <select> for filtering
  readonly sortSelect: Locator; // Native <select> for sorting

  // --- Locators for Task List Container ---
  readonly taskListContainer: Locator;
  readonly taskItem: Locator;

  constructor(page: Page) {
    this.page = page;

    // --- Initialize Locators ---
    this.taskTitleInput = page.getByPlaceholder("Task Title");
    this.taskDescriptionInput = page.getByPlaceholder("Task Description");

    // The first <select> is importance, second is label
    this.importanceSelect = page.locator("form select").first();
    this.labelSelect = page.locator("form select").nth(1);

    // The "Add Task" button is type="submit" within the form
    this.addTaskButton = page.getByRole("button", {
      name: "Add Task",
      exact: true,
    });

    // Native <select> elements for filtering and sorting
    // The first <select> outside the form is filter, second is sort
    this.filterSelect = page.locator(".filter-sort select").first();
    this.sortSelect = page.locator(".filter-sort select").nth(1);

    // Task List Container
    this.taskListContainer = page.locator(".task-list");
  }

  // --- Locator Factory for a specific task item ---
  // Finds a div with class 'task-item' that contains an h3 with the exact task title.
  getTaskItem(title: string): Locator {
    return this.taskListContainer.locator(
      `.task-item:has(h3:text-is("${title}"))`
    );
  }

  // --- Navigation ---
  async goto() {
    await this.page.goto("/"); // Assuming the main page is at the root URL
  }

  // --- Actions for Task Creation ---
  async fillTaskDetails(title: string, description: string) {
    await this.taskTitleInput.fill(title);
    await this.taskDescriptionInput.fill(description);
  }

  async selectImportance(importance: string) {
    await this.importanceSelect.selectOption(importance);
  }

  async selectLabel(label: string) {
    await this.labelSelect.selectOption(label);
  }

  async addTask() {
    await this.addTaskButton.click();
    await this.page.waitForLoadState("networkidle");
  }

  async createNewTask(
    title: string,
    description: string,
    importance: string = "Medium",
    label: string = "Work"
  ) {
    await this.fillTaskDetails(title, description);
    await this.selectImportance(importance);
    await this.selectLabel(label);
    await this.addTask();
  }

  // --- Actions for Task Filtering/Sorting ---
  async filterTasks(filterOption: string) {
    await this.filterSelect.selectOption(filterOption);
  }

  async sortTasks(sortOption: "asc" | "desc") {
    await this.sortSelect.selectOption(sortOption);
  }

  // --- Actions for Task Management (using the provided HTML) ---
  // Note: The 'Complete' button changes to 'Uncomplete' with bg-fuchsia-500.
  // Assuming 'Complete' is for pending, 'Uncomplete' is for completed.
  async markTaskAsComplete(taskTitle: string) {
    const taskItem = this.getTaskItem(taskTitle);
    await taskItem
      .getByRole("button", { name: "Complete", exact: true })
      .click();
    // Wait for the button text to change or for the task status to update
    await expect(
      taskItem.getByRole("button", { name: "Uncomplete", exact: true })
    ).toBeVisible();
  }

  async markTaskAsUncomplete(taskTitle: string) {
    const taskItem = this.getTaskItem(taskTitle);
    await taskItem
      .getByRole("button", { name: "Uncomplete", exact: true })
      .click();
    // Wait for the button text to change or for the task status to update
    await expect(
      taskItem.getByRole("button", { name: "Complete", exact: true })
    ).toBeVisible();
  }

  async deleteTask(taskTitle: string) {
    const taskItem = this.getTaskItem(taskTitle);
    await taskItem.getByRole("button", { name: "Delete", exact: true }).click();
    // After deletion, assert the task item is no longer visible
    await expect(taskItem).not.toBeVisible();
  }

  async editTask(
    taskTitle: string,
    newDetails: {
      title?: string;
      description?: string;
      importance?: string;
      label?: string;
    }
  ) {
    const taskItem = this.getTaskItem(taskTitle);

    await taskItem.getByRole("button", { name: "Edit", exact: true }).click();

    if (newDetails.title) {
      await this.page
        .getByPlaceholder("Title", { exact: true })
        .fill(newDetails.title);
    }
    if (newDetails.description) {
      await this.page
        .getByPlaceholder("Description", { exact: true })
        .fill(newDetails.description);
    }
    if (newDetails.importance) {
      await taskItem.getByTestId("importance-selector").click();
      // .selectOption({ label: newDetails.importance });
    }
    if (newDetails.label) {
      await this.page
        .getByTestId("label-selector")
        .selectOption(newDetails.label);
    }

    await this.page.getByRole("button", { name: "Save", exact: true }).click();
  }

  // --- Assertions ---
  async expectTaskToBeVisible(title: string, expected: boolean = true) {
    const taskItem = this.getTaskItem(title);
    if (expected) {
      await expect(taskItem).toBeVisible();
    } else {
      await expect(taskItem).not.toBeVisible();
    }
  }

  async expectTaskDetails(
    title: string,
    expectedDescription: string,
    expectedImportance: string,
    expectedLabel: string
  ) {
    const taskItem = this.getTaskItem(title);
    await expect(taskItem.locator("p.text-sm")).toHaveText(expectedDescription);
    await expect(
      taskItem.locator('p.text-xs:has-text("Importance:")')
    ).toHaveText(`Importance: ${expectedImportance}`);
    await expect(taskItem.locator('p.text-xs:has-text("Label:")')).toHaveText(
      `Label: ${expectedLabel}`
    );
  }

  async expectTaskCount(expectedCount: number) {
    await expect(this.taskListContainer.locator(".task-item")).toHaveCount(
      expectedCount
    );
  }

  async expectTaskStatus(title: string, status: "Complete" | "Uncomplete") {
    const taskItem = this.getTaskItem(title);

    await expect(
      taskItem.getByRole("button", { name: status, exact: true })
    ).toBeVisible();
  }

  async expectAddTaskButtonIsEnabled(expected: boolean = true) {
    if (expected) {
      await expect(this.addTaskButton).toBeEnabled();
    } else {
      await expect(this.addTaskButton).toBeDisabled();
    }
  }
}
