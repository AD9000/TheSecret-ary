import * as puppeteer from "puppeteer";
const fs = require("fs");
const flatten = require("flat");

const goToSignInPage = async (page: puppeteer.Page) => {
  await page.evaluate(() => {
    const xpath = '//a[contains(., "Sign in")]';
    const result = document.evaluate(
      xpath,
      document,
      null,
      XPathResult.ANY_TYPE,
      null
    );
    (result.iterateNext() as HTMLAnchorElement).click();
  });
};

const login = async (page) => {
  const username = process.env["uname"] || "camilewilliams5@outlook.com";
  const password = process.env["pass"] || "C8Mp3KNWgDhCKCb";
  await page.evaluate(
    (username, password) => {
      const ubox = <HTMLInputElement>document.getElementById("username");
      const pass = <HTMLInputElement>document.getElementById("password");

      ubox.value = username;
      pass.value = password;

      const xpath = '//button[contains(., "Sign in")]';
      const result = document.evaluate(
        xpath,
        document,
        null,
        XPathResult.ANY_TYPE,
        null
      );
      (result.iterateNext() as HTMLButtonElement).click();
    },
    username,
    password
  );
};
const scrapeAbout = async (page: puppeteer.Page) => {
  await page.$eval("section.pv-about-section a", (seeMore: HTMLAnchorElement) =>
    seeMore.click()
  );

  await page.waitFor(2000);

  return await page.$eval(
    "section.pv-about-section p",
    (about: HTMLParagraphElement) => about.innerText
  );
};

interface Position {
  title: string;
  timeline: {
    startAndEnd: string;
    duration: string;
  };
  location: string;
}

interface Experience {
  company: string;
  companyPage: string;
  positions: Position[];
}

const scrapeExperience = async (page: puppeteer.Page) => {
  while (
    !(await page.evaluate(() => {
      const element = document.querySelector("section.education-section");
      return element ? true : false;
    }))
  ) {
    await page.evaluate(() => {
      window.scrollBy(0, window.outerHeight);
    });
    await page.waitFor(1000);
  }

  await page.evaluate(() => {
    window.scrollBy(0, window.outerHeight);
  });
  await page.waitFor(1000);

  // See more
  await page.evaluate(() => {
    document
      .querySelector<HTMLButtonElement>(
        "section.experience-section button.pv-profile-section__see-more-inline"
      )
      ?.click();
  });
  await page.waitFor(1000);

  const experiences = await page.$$eval(
    "section.experience-section ul.pv-profile-section__section-info > li",
    (experiences: HTMLLIElement[]) => {
      const exps: Experience[] = [];
      for (const experience of experiences) {
        const positionGroup = Array.from(
          experience.querySelectorAll("ul.pv-entity__position-group li")
        );
        if (positionGroup && positionGroup.length > 0) {
          const company = experience.querySelector("h3").innerText;
          const companyPage = experience.querySelector("a").href;
          const positions: Position[] = [];
          for (const positionElement of positionGroup) {
            const title = positionElement.querySelectorAll<HTMLSpanElement>(
              "div.pv-entity__role-details-container h3 span"
            )[1].innerText;

            console.log("title", title);

            const startAndEnd = positionElement.querySelectorAll<
              HTMLHeadingElement
            >("h4.pv-entity__date-range span")[1].innerText;
            console.log(startAndEnd);
            const duration = positionElement.querySelector<HTMLSpanElement>(
              "span.pv-entity__bullet-item-v2"
            ).innerText;
            console.log(duration);
            const location = positionElement.querySelectorAll<
              HTMLHeadingElement
            >("h4.pv-entity__location span")[1]?.innerText;
            console.log(location);
            positions.push({
              title,
              timeline: { startAndEnd, duration },
              location,
            });
          }
          exps.push({ company, companyPage, positions });
        } else {
          const title = experience.querySelector("h3").innerText;
          console.log(title);
          const company = experience
            .querySelector<HTMLParagraphElement>("p.pv-entity__secondary-title")
            .innerText.split(" ")[0];

          console.log(company);

          const companyPage = experience.querySelector("a").href;

          console.log(companyPage);

          const startAndEnd = experience.querySelectorAll<HTMLHeadingElement>(
            "h4.pv-entity__date-range span"
          )[1].innerText;
          console.log(startAndEnd);
          const duration = experience.querySelector<HTMLSpanElement>(
            "span.pv-entity__bullet-item-v2"
          ).innerText;
          console.log(duration);
          const location = experience.querySelectorAll<HTMLHeadingElement>(
            "h4.pv-entity__location span"
          )[1]?.innerText;
          console.log(location);

          const position = experience.querySelector<HTMLSpanElement>(
            "span.pv-entity__secondary-title"
          )?.innerText;
          console.log(position);

          exps.push({
            company,
            companyPage,
            positions: [
              { title, timeline: { startAndEnd, duration }, location },
            ],
          });
        }
      }
      return exps;
    }
  );
  return experiences;
};

interface Education {
  university: string;
  link: string;
  degreeName: string;
  field: string;
  dates: string;
}

const scrollUntilSelector = async (page: puppeteer.Page, selector: string) => {
  while (
    !(await page.evaluate((selector) => {
      const element = document.querySelector(selector);
      return element ? true : false;
    }, selector))
  ) {
    await page.evaluate(() => {
      window.scrollBy(0, window.outerHeight);
    });
    await page.waitFor(1000);
  }
};

const scrapeEducation = async (page: puppeteer.Page) => {
  await scrollUntilSelector(page, "section.education-section");

  // See more
  await page.evaluate(() => {
    document
      .querySelector<HTMLButtonElement>(
        "section.education-section button.pv-profile-section__see-more-inline"
      )
      ?.click();
  });
  await page.waitFor(1000);

  const education = await page.$$eval(
    "section.education-section ul.pv-profile-section__section-info li",
    (education: HTMLLIElement[]) => {
      const edus: Education[] = [];
      for (const edu of education) {
        const university = edu.querySelector("h3").innerText;
        const degreeName = edu.querySelectorAll<HTMLHeadingElement>(
          "p.pv-entity__degree-name span"
        )[1].innerText;
        const field = edu.querySelectorAll<HTMLHeadingElement>(
          "p.pv-entity__fos span"
        )[1]?.innerText;

        const link = edu.querySelector("a").href;

        const dates = edu.querySelectorAll<HTMLHeadingElement>(
          "p.pv-entity__dates span"
        )[1]?.innerText;

        edus.push({
          university,
          link,
          degreeName,
          field,
          dates,
        });
      }
      return edus;
    }
  );
  return education;
};

interface Contact {
  name: string;
  link: string;
  details: string;
}

const scrapeContactInfo = async (page: puppeteer.Page) => {
  await page.$eval(
    "ul.pv-top-card--list-bullet a",
    (contactInfo: HTMLAnchorElement) => contactInfo.click()
  );
  await page.waitFor(4000);

  const contacts = await page.$$eval(
    "section.pv-contact-info__contact-type",
    (contactElements: HTMLDivElement[]) => {
      const contacts: Contact[] = [];
      for (const contactElement of contactElements) {
        const name = contactElement.querySelector("header").innerText;
        const link = contactElement.querySelector("a")?.href;
        const ul = contactElement.querySelector<HTMLDivElement>("ul");

        const details = ul
          ? ul.innerText
          : document.querySelector<HTMLDivElement>(
              "div.pv-contact-info__ci-container"
            ).innerText;

        contacts.push({ name, link, details });
      }
      return contacts;
    }
  );

  // Close modal
  await page.$eval(
    "button.artdeco-modal__dismiss",
    (button: HTMLButtonElement) => button.click()
  );

  await page.waitFor(1000);

  return contacts;
};

interface SkillDetails {
  name: string;
  verified: Boolean;
}

interface SkillEndorsements {
  profileLink: string;
  name: string;
  headline: string;
}

interface Skill extends SkillDetails {
  endorsements: SkillEndorsements[];
}

interface SkillDetailsReturn {
  skillsDetails: SkillDetails[];
  count: number;
}

const scrapeSkills = async (page: puppeteer.Page) => {
  await scrollUntilSelector(page, "section.pv-skill-categories-section");

  await page.waitFor(1000);

  // See more
  await page.evaluate(() => {
    document
      .querySelector<HTMLButtonElement>(
        "button.pv-skills-section__additional-skills"
      )
      ?.click();
  });
  await page.waitFor(3000);

  const { skillsDetails, count } = await page.$$eval(
    "ol.pv-skill-categories-section__top-skills > li",
    (skillElements: HTMLLIElement[]): SkillDetailsReturn => {
      const skillsDetails = [];
      for (const skillElement of skillElements) {
        console.log(
          "name: ",
          skillElement.querySelector<HTMLSpanElement>(
            "span.pv-skill-category-entity__name-text"
          )
        );
        const name = skillElement.querySelector<HTMLSpanElement>(
          "span.pv-skill-category-entity__name-text"
        ).innerText;
        let verified = false;
        if (skillElement.querySelector("div.pv-skill-entity__verified-icon")) {
          verified = true;
        }

        skillsDetails.push({ name, verified });
      }
      return { skillsDetails, count: skillElements.length };
    }
  );

  const skillEndorsements: SkillEndorsements[][] = [];
  for (let i = 0; i < count; i++) {
    const endorsed = await page.$$eval(
      "section.pv-skill-categories-section ol.pv-skill-categories-section__top-skills > li",
      (skillElements: HTMLLIElement[], index: number) => {
        const endorsers = skillElements[index].querySelector("a");
        if (endorsers) {
          endorsers.click();
          return true;
        } else {
          return false;
        }
      },
      i
    );

    if (!endorsed) {
      skillEndorsements.push([]);
      continue;
    }

    await page.waitFor(2000);

    const endorsements = await page.$$eval(
      "li.pv-endorsement-entity",
      (endorsementElements: HTMLLIElement[]) => {
        const endorsements: SkillEndorsements[] = [];
        for (const endorsementElement of endorsementElements) {
          const profileLink = endorsementElement.querySelector("a").href;
          const name = endorsementElement.querySelector<HTMLDivElement>(
            "div.pv-endorsement-entity__name"
          ).innerText;
          const headline = endorsementElement.querySelector<HTMLDivElement>(
            "div.pv-endorsement-entity__headline"
          )?.innerText;

          endorsements.push({ profileLink, name, headline });
        }
        return endorsements;
      }
    );

    skillEndorsements.push(endorsements);

    // Close modal
    await page.$eval(
      "button.artdeco-modal__dismiss",
      (button: HTMLButtonElement) => button.click()
    );

    await page.waitFor(1000);
  }

  const skills: Skill[] = skillsDetails.map((skillDetails, index) => {
    return { ...skillDetails, endorsements: skillEndorsements[index] };
  });

  return skills;
};

const downloadImage = async (
  page: puppeteer.Page,
  imgURL: string,
  dirname: string,
  filename: string
) => {
  const source = await page.goto(imgURL, { waitUntil: ["networkidle2"] });
  fs.writeFile(dirname + "/" + filename, await source.buffer(), function (
    err: Error
  ) {
    if (err) {
      return console.log(err);
    }
  });
  await page.close();
};

const capitalize = (name: string) =>
  name
    .split(" ")
    .map((word) => word[0].toUpperCase() + word.slice(1, word.length))
    .join(" ");

const scrapeProfile = async (
  page: puppeteer.Page,
  link: string,
  name: string,
  browser: puppeteer.Browser,
  dirname: string
): Promise<LinkedinData> => {
  await page.goto(link);
  await page.waitFor(5000);

  const profilePic = await page.$eval(
    `img[alt="${capitalize(name)}"]`,
    (img: HTMLImageElement) => img.src
  );

  const pictures = dirname + "/photos";
  if (!fs.existsSync(pictures)) {
    fs.mkdirSync(pictures);
  }
  const newPage = await browser.newPage();
  downloadImage(newPage, profilePic, pictures, "profilePic.jpg");
  const photofile = pictures + "/profilePic.jpg";

  const headline = await page.$eval(
    "ul.pv-top-card--list",
    (element) => element.parentElement.querySelector("h2")?.innerText
  );

  console.log("headline", headline);

  const location = await page.$eval(
    "ul.pv-top-card--list-bullet li",
    (element: HTMLLIElement) => element.innerText
  );

  console.log("location...", location);

  // Look at the contact info
  const contactInfo = await scrapeContactInfo(page);
  console.log(contactInfo);
  const about = await scrapeAbout(page);
  console.log("about...", about);
  // await scrapeFeatured()
  const experience = await scrapeExperience(page);
  console.log("experience...", flatten(experience));
  const education = await scrapeEducation(page);
  console.log("education...", education);
  const skills = await scrapeSkills(page);
  console.log("skills: ", skills);

  return {
    about: { name, headline, photofile, location, contactInfo, about },
    experience,
    education,
    skills,
  };
};

const searchProfile = async (page: puppeteer.Page, person: string) => {
  let query = "";
  for (const part of person.split(" ")) {
    query += part + "+";
  }
  await page.goto(
    "https://www.linkedin.com/search/results/all/?keywords=" +
      encodeURIComponent(query.slice(0, -1))
  );

  await page.waitFor(2000);
};

const findPerson = async (page: puppeteer.Page, person: string) => {
  await searchProfile(page, person);

  const link = await page.$eval(
    "ul.search-results__list li a",
    (link: HTMLAnchorElement) => link.href
  );
  return link;
};

const scrapeLinkedin = async ({
  name,
  link,
}: {
  name: string;
  link?: string;
}): Promise<LinkedinData> => {
  const browser = await puppeteer.launch({ headless: false });
  try {
    // Single page is enough
    const page = await browser.newPage();
    const dirname = name;
    if (!fs.existsSync(name)) {
      fs.mkdirSync(name);
    }
    if (!link) {
      await page.goto("https://www.linkedin.com/");
      await goToSignInPage(page);
      await page.waitFor(1000);
      await login(page);
      await page.waitFor(7000);
      const profileLink = await findPerson(page, name);
      await page.waitFor(1000);
      // Ideally you would have multiple links, loop through them, then
      // match data to fb and other data you have on the person
      return await scrapeProfile(page, profileLink, name, browser, dirname);
    } else {
      return await scrapeProfile(page, link, name, browser, dirname);
    }
  } catch (e) {
    console.log(e);
    console.log("oops");
  } finally {
    await browser.close();
  }
};

interface LinkedinData {
  about: {
    name: string;
    headline: string;
    photofile: string;
    location: string;
    contactInfo: Contact[];
    about: string;
  };
  experience: Experience[];
  education: Education[];
  skills: Skill[];
}

export {
  scrapeLinkedin,
  LinkedinData,
  Skill,
  SkillEndorsements,
  Contact,
  Education,
  Experience,
  Position,
};
