const puppeteer = require("puppeteer");
const { setDefaultOptions } = require("expect-puppeteer");
const fs = require("fs");
const { containsText } = require("./utils");
const fsPromises = fs.promises;

const baseURL = process.env.BASE_URL || "http://localhost:3000";

const onPageConsole = (msg) =>
  Promise.all(msg.args().map((event) => event.jsonValue())).then((eventJson) =>
    console.log(`<LOG::page console ${msg.type()}>`, ...eventJson)
  );

describe("US-01 - Create and list reservations - E2E", () => {
  let page;
  let browser;

  beforeAll(async () => {
    await fsPromises.mkdir("./.screenshots", { recursive: true });
    setDefaultOptions({ timeout: 1000 });
    browser = await puppeteer.launch();
  });

  beforeEach(async () => {
    page = await browser.newPage();
    page.on("console", onPageConsole);
    await page.setViewport({ width: 1920, height: 1080 });
    await page.goto(`${baseURL}/reservations/new`, { waitUntil: "load" });
  });

  afterAll(async () => {
    await browser.close();
  });

  describe("/reservations/new page", () => {
    test("filling and submitting form creates a new reservation and then displays the dashboard for the reservation date", async () => {
      await page.type("input[name=first_name]", "James");
      await page.type("input[name=last_name]", "Smith");
      await page.type("input[name=mobile_number]", "800-555-1212");
      await page.type("input[name=reservation_date]", "10/06/2024");
      await page.type("input[name=reservation_time]", "13:30 PM");
      await page.type("input[name=people]", "2");

      await page.screenshot({
        path: ".screenshots/us-01-submit-before.png",
        fullPage: true,
      });

      await Promise.all([
        page.click("[type=submit]"),
        page.waitForNavigation({ waitUntil: "networkidle0" }),
      ]);
      await page.waitForSelector("#reservations");
      await page.screenshot({
        path: ".screenshots/us-01-submit-after.png",
        fullPage: true,
      });
      const containsFree = await containsText(
        page,
        `#res-header`,
        "2024-10-06"
      );

      expect(containsFree).toBe(true);
      const containsJohn = await containsText(page, `#reservations`, "james");
      expect(containsJohn).toBe(true);
    });

    test("canceling form returns to previous page", async () => {
      await page.goto(`${baseURL}/dashboard`, { waitUntil: "networkidle0" });
      await page.goto(`${baseURL}/reservations/new`, {
        waitUntil: "networkidle0",
      });

      const [cancelButton] = await page.$x(
        "//button[contains(translate(., 'ACDEFGHIJKLMNOPQRSTUVWXYZ', 'acdefghijklmnopqrstuvwxyz'), 'cancel')]"
      );

      if (!cancelButton) {
        throw new Error("button containing cancel not found.");
      }

      await page.screenshot({
        path: ".screenshots/us-01-cancel-before.png",
        fullPage: true,
      });

      await Promise.all([
        cancelButton.click(),
        page.waitForNavigation({ waitUntil: "networkidle0" }),
      ]);

      await page.screenshot({
        path: ".screenshots/us-01-cancel-after.png",
        fullPage: true,
      });

      expect(page.url()).toContain("/dashboard");
    });
  });
});
