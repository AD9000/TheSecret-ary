const puppeteer = require("puppeteer");

const login = async (page) => {
  const username = process.env["uname"];
  const password = process.env["pass"];
  page.evaluate(
    (username, password) => {
      inputs = document.getElementsByClassName("login_form_input_box");
      inputs[0].value = username;
      inputs[1].value = password;

      document.getElementsByClassName("login_form_login_button")[0].click();
    },
    username,
    password
  );
};

const findPerson = async (page, person) => {
  page.evaluate((person) => {
    const searchArea = document.querySelector('[role="search"]');

    // Fill search box input
    searchArea.getElementsByTagName("input")[2].value = person;

    // Search
    searchArea.getElementsByTagName("button")[0].click();
  }, person);
};

const scrapeFb = async () => {
  const browser = await puppeteer.launch({ headless: false });
  try {
    // Single page is enough
    const page = await browser.newPage();
    await page.setRequestInterception(true);
    page.on("request", (interceptedRequest) => {
      if (interceptedRequest.resourceType() == "stylesheet")
        interceptedRequest.abort();
      else interceptedRequest.continue();
    });

    page.on("dialog", async (dialog) => {
      console.log(dialog.message());
      await dialog.dismiss();
    });

    await page.goto("https://facebook.com");
    await login(page);
    page.waitFor(5000);
    await findPerson(page, "atharv damle");
  } catch (e) {
    console.log(e);
    console.log("oops");
  } finally {
    // browser.close()
  }
};

(async () => {
  await scrapeFb();
})();

export { scrapeFb };
