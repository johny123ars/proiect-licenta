# Proiect de Testare Automatizată - Task Manager & API

Bun venit în repository-ul proiectului de testare automatizată! Acest proiect demonstrează capabilitățile de automatizare a testelor End-to-End (E2E) și API, utilizând framework-ul modern Playwright. El a fost conceput pentru a asigura calitatea unei aplicații simple de gestionare a sarcinilor (Task Manager) și a valida funcționalitatea unui API public.

## Prezentarea Proiectului

Acest repository conține soluția de testare automatizată, nu aplicația Task Manager în sine. Proiectul de testare este structurat pentru a fi robust, mentenabil și eficient, incorporând bune practici precum Page Object Model (POM) și generarea dinamică a datelor de test cu `faker-js`. Rapoartele detaliate sunt generate folosind Allure, oferind o vizualizare clară a rezultatelor execuțiilor.

## Aplicația Testată: Task Manager

Aplicația `Task Manager` este o aplicație React simplă pentru gestionarea sarcinilor. Aceasta permite utilizatorilor să:
* **Adauge** sarcini noi.
* **Șteargă** sarcini existente.
* **Editeze** detalii ale sarcinilor.
* **Marcheze** sarcini ca fiind **complete/incomplete**.
* **Filtreze** sarcinile după etichetă (Label).
* **Sorteze** sarcinile după importanță (Importance).

Detalii ale unei sarcini:
* **Titlu** (string) - obligatoriu, trebuie să înceapă cu literă mare.
* **Descriere** (string) - opțional.
* **Importanță** (High, Medium, Low) - obligatoriu, implicit Medium.
* **Etichetă** (Work, Social, Home, Hobby) - opțional, implicit Work.
* **Stare (Completeness)** (boolean) - implicit `false`.

**Notă:** Testele API sunt realizate pe un serviciu public extern (ex: `https://dummyjson.com`), nu pe un API al aplicației Task Manager.

---

## Ghid de Pornire Rapidă

Pentru a rula testele și a vizualiza rapoartele, trebuie să urmați câțiva pași simpli. Asigurați-vă că aveți Node.js (versiunea LTS recomandată) și npm (incluse cu Node.js) instalate pe sistemul dumneavoastră.

### 1. Pornirea Aplicației Testate (Task Manager)

Înainte de a rula testele E2E, este esențial ca aplicația `Task Manager` să fie pornită și accesibilă la `http://localhost:5173`.

1.  **Clonați repository-ul aplicației `Task Manager`**:
    ```bash
    git clone https://github.com/johny123ars/proiect-licenta
    ```
    *Dacă aplicația Task Manager este în același repository cu testele și este localizată într-un sub-director (ex: `app/`), atunci ignorați pasul de clonare și doar navigați în directorul ei.*
2.  **Navigați în directorul aplicației:**
    ```bash
    cd licenta/proiect/licenta
    ```
3.  **Instalați dependențele aplicației:**
    ```bash
    npm install
    ```
4.  **Porniți aplicația:**
    ```bash
    npm run dev
    ```
    Aplicația ar trebui să fie acum accesibilă în browser la `http://localhost:5173`. Lăsați acest proces să ruleze într-un terminal separat.

### 2. Configurație și Rularea Proiectului de Testare Automatizată
    Această comandă va instala Playwright, `allure-playwright` și `faker-js`, alături de alte dependențe necesare.
4.  **Instalați driverele Playwright pentru browsere:**
    ```bash
    npx playwright install
    ```
    Aceasta va descărca browserele (Chromium, Firefox, WebKit) necesare pentru rularea testelor.

### 3. Rularea Testelor

Proiectul este configurat pentru a rula teste E2E (UI) și teste API. Puteți rula toate testele sau selectiv.

* **Rularea Tuturor Testelor (E2E UI și API):**
    ```bash
    npx playwright test --reporter=line,allure-playwright
    ```
    *Această comandă va executa testele pe Chromium, Firefox și API, și va genera datele brute pentru raportul Allure în directorul `allure-results/`.*

* **Rularea Testelor pe un Browser/Proiect Specific:**
    * **Doar teste E2E pe Chromium:**
        ```bash
        npx playwright test --project=chromium --workers=1 --reporter=line,allure-playwright
        ```
    * **Doar teste E2E pe Firefox:**
        ```bash
        npx playwright test --project=firefox --workers=1 --reporter=line,allure-playwright
        ```
    * **Doar teste API:**
        ```bash
        npx playwright test --project=api --workers=1 --reporter=line,allure-playwright
        ```

* **Rularea unui Singur Fișier de Test (ex: un test UI de login):**
    ```bash
    npx playwright test e2e/tests/ui/login.spec.ts --headed
    ```

### 4. Generarea și Vizualizarea Rapoartelor Allure

După rularea testelor, puteți genera un raport HTML interactiv pentru o analiză detaliată.

1.  **Generați raportul HTML Allure:**
    ```bash
    allure generate allure-results --clean -o allure-report
    ```
    *Flag-ul `--clean` este important; el șterge rezultatele din rulările anterioare pentru a asigura un raport proaspăt.*
2.  **Deschideți raportul Allure în browser:**
    ```bash
    allure open allure-report
    ```
    Aceasta va lansa automat raportul interactiv în browserul dumneavoastră implicit, oferind o perspectivă detaliată asupra execuției testelor, a eșecurilor, a duratelor și a altor metrici relevante.

---

## Structura Proiectului de Testare

Proiectul este organizat conform bunelor practici, pentru a asigura scalabilitate și mentenabilitate:

* `e2e/tests/api/`: Fișierele de test pentru validarea funcționalităților API.
* `e2e/tests/ui/`: Fișierele de test E2E pentru interfața utilizator a aplicației Task Manager.
* `e2e/pages/`: Implementarea Page Object Model (POM) pentru abstracția interacțiunilor UI.
* `e2e/utils/`: Funcții utilitare și helper-e reutilizabile în cadrul testelor.
* `playwright.config.ts`: Fișierul de configurare principal Playwright, unde sunt definite browserele, reporterii (inclusiv Allure), și alte setări.
* `package.json`: Gestionează dependențele și scripturile npm ale proiectului.
* `allure-results/`: Directorul care conține rezultatele brute (`.json`) generate de Allure după fiecare rulare.
* `allure-report/`: Directorul care conține raportul HTML interactiv generat de Allure.

---
