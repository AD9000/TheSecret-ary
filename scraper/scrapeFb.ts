import * as puppeteer from "puppeteer";
const fs = require("fs");
import * as secret from "./secret.json";

const login = async (page) => {
  const username = process.env["uname"] || secret.fbEmail;
  const password = process.env["pass"] || secret.fbPass;
  await page.evaluate(
    (username, password) => {
      const inputs = Array.from(
        document.getElementsByClassName(
          "login_form_input_box"
        ) as HTMLCollectionOf<HTMLInputElement>
      );
      inputs[0].value = username;
      inputs[1].value = password;
      (document.getElementsByClassName(
        "login_form_login_button"
      )[0] as HTMLButtonElement).click();
    },
    username,
    password
  );
};

const sleep = (time: number) => {
  return new Promise((resolve) => setTimeout(resolve, time));
};

const searchForPeople = async (page, person) => {
  //   await page.waitForSelector('[role="search"]');
  await page.evaluate((person) => {
    const searchArea = document.querySelector('[role="search"]');

    // Fill search box input
    searchArea.getElementsByTagName("input")[2].value = person;

    // Search
    (searchArea.getElementsByTagName("button")[0]
      .parentElement as HTMLFormElement).submit();
  }, person);
};

const getElementByText = () => {};

const getProfiles = async (page, name: string) => {
  const profiles = await page.evaluate((name: string) => {
    const atags = Array.from(document.getElementsByTagName("a"));
    const matcher = new RegExp(name, "i");
    return atags
      .filter((tag) => matcher.test(tag.innerHTML))
      .map((tag) => tag.href);
  }, name);

  return profiles;
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

/**
 * There might be two places the profile pic is. One is the spotlight.
 * If it is in the spotlight, then you can keep going to check for more pics
 * Otherwise it is in a photoContainer
 * @param page
 * @param dirname
 */
interface evalRet {
  imgURLs: string[];
  count: number;
}

enum ReactType {
  LIKE = "LIKE",
  LOVE = "LOVE",
  HAHA = "HAHA",
  WOW = "WOW",
  SAD = "SAD",
}

interface User {
  name: string; // Could be a link but I cant scrape in depth :(
  profileLink: string; // But I can always store the link :)
}

interface Friend extends User {
  // Link to something about them
  associatedWith: {
    summary: string;
    link: string;
  };
}

interface React {
  type: ReactType;
  user: User;
}

interface Timestamp {
  dateCreated: string;
  displayText: string;
}

interface Comment {
  user: User;
  timestamp: Timestamp;
  text: string;
}

// Could use this if I scrape replies in the future
interface Conversation {
  comment: Comment;
  reacts: React[];
  replies: Comment[];
}

interface PostActivity {
  caption: string;
  reacts: React[];
  comments: Comment[];
}

interface Likes {
  // Things you like/follow
  title: string;
  link: string;
  type: string;
}

interface Post {
  imgurl: string;
  filename: string;
  postActivity?: PostActivity;
}

// Gets the picture comments and likes from photoUfiContainer.
const parseCommentsAndReacts = async (page: puppeteer.Page) => {
  const caption = await page.evaluate(() => {
    return (document
      .getElementsByClassName("photoUfiContainer")[0]
      .getElementsByClassName("hasCaption")[0] as HTMLSpanElement)?.innerText;
  });

  // Parse comments
  const comments = await page.$$eval(
    '.photoUfiContainer div[aria-label="Comment"]',
    (comments: HTMLDivElement[]) => {
      const getCommentData = (comment: HTMLDivElement): Comment => {
        const commentData = comment.getElementsByTagName("a");

        // Get the user data
        const name = commentData[1].innerText;
        const profileLink = commentData[1].href;
        // Comment timestamp
        const timestampData = commentData[
          commentData.length - 1
        ].getElementsByTagName("abbr")[0];
        const dateCreated = timestampData.getAttribute("data-tooltip-content");
        const displayText = timestampData.getAttribute("aria-label");

        // comment text
        const text = commentData[1].parentElement.getElementsByTagName(
          "span"
        )[0].innerText;

        const singleComment: Comment = {
          user: { name, profileLink },
          timestamp: { dateCreated, displayText },
          text,
        };
        return singleComment;
      };

      const postComments: Comment[] = [];
      for (const comment of comments) {
        const singleComment = getCommentData(comment);

        // Replies (not going to do it now. Not as important atm)
        postComments.push(singleComment);
      }

      return postComments;
    }
  );
  const postReacts: React[] = [];

  // Click into the first one
  await page.evaluate(() => {
    Array.from(
      document
        .getElementsByClassName("photoUfiContainer")[0]
        .querySelector('span[aria-label="See who reacted to this"]')
        .getElementsByTagName("a")
    )[0].click();
  });

  await page.waitFor(4000);

  const reactTypeCount = await page.evaluate(() => {
    const reactOptions = Array.from(
      document.querySelectorAll('ul[role="tablist"]')
    ).filter((listOptions) => {
      const elementTester = new RegExp("^[0-9 ]+$");
      const options = Array.from(listOptions.getElementsByTagName("li"));
      for (const option of options) {
        if (elementTester.test(option.innerText)) {
          return true;
        }
      }
      return false;
    });

    // Add custom id for easy lookups
    reactOptions[0].setAttribute("id", "reactOptionList");

    return reactOptions[0].getElementsByTagName("li").length;
  });

  const start = reactTypeCount > 1 ? 1 : 0;

  for (let i = start; i < reactTypeCount; i++) {
    // Click on it
    await page.evaluate((index) => {
      Array.from(
        document.getElementById("reactOptionList").getElementsByTagName("li")
      )[index].click();
    }, i);
    await page.waitFor(4000);

    // Scrape
    const typeReacts = await page.evaluate(
      (reactIndex, ReactType) => {
        const typeReacts: React[] = [];
        const reactTypes = Array.from(
          document.getElementById("reactOptionList").getElementsByTagName("li")
        );

        const labels = Array.from(
          reactTypes[reactIndex].getElementsByTagName("span")
        ).map((ele) => ele.getAttribute("aria-label"));
        let t: ReactType;
        for (const label of labels) {
          if (!label) {
            continue;
          }
          const words = label.split(" ");
          if (
            ReactType.includes(
              words[words.length - 1].toUpperCase() as ReactType
            )
          ) {
            t = <ReactType>words[words.length - 1];
          }
        }
        const type = t;

        const reactors = Array.from(
          document
            .querySelectorAll('ul[id^="reaction_profile_browser"]')
            [reactIndex].getElementsByTagName("li")
        );

        for (const reactor of reactors) {
          const link = reactor.getElementsByTagName("a")[0];
          const name = link.title;
          const profileLink = link.href;
          typeReacts.push({ type, user: { name, profileLink } });
        }
        return typeReacts;
      },
      i,
      Object.values(ReactType)
    );

    postReacts.push(...typeReacts);
  }
  // Go back
  await page.$$eval("a", (links: HTMLAnchorElement[]) => {
    links.filter((ele) => ele.innerText == "Close")[2].click();
  });

  const postActivity: PostActivity = {
    caption,
    reacts: postReacts,
    comments,
  };
  return postActivity;
};

const getProfilePics = async (
  page: puppeteer.Page,
  dirname: string,
  browser: puppeteer.Browser
) => {
  const posts: Post[] = [];
  const imgurls: string[] = [];

  await page.$eval("a.profilePicThumb", (ele: HTMLAnchorElement) => {
    ele.click();
  });

  await page.waitFor(2000);

  // Check if there's a spotlight
  const hasSpotlight = await page.evaluate(() => {
    return document.querySelector("img.spotlight") ? true : false;
  });

  if (hasSpotlight) {
    // find the count
    await page.$eval("a.next", (next: HTMLAnchorElement) => next.click());
    await page.waitFor(1000);
    const count = await page.$eval(
      "#fbPhotoSnowliftPositionAndCount",
      (count: HTMLSpanElement) => {
        const rawText = count.innerHTML;
        if (rawText.length > 0) {
          return Number(rawText.split("&nbsp;")[2]);
        } else {
          return 1;
        }
      }
    );

    await page.goBack();
    await page.waitFor(1000);

    // get all the pictures in the spotlight
    for (let i = 0; i < count; i++) {
      // Get the current picture
      const imgurl = await page.$eval(
        "img.spotlight",
        (spotlight: HTMLImageElement) => spotlight.src
      );
      imgurls.push(imgurl);

      // Download the image
      const newpage = await browser.newPage();
      await downloadImage(newpage, imgurl, dirname, `profilepic${i + 1}.jpg`);

      const filename = dirname + "/" + `profilepic${i + 1}.jpg`;

      await page.waitFor(1000);

      const postActivity = await parseCommentsAndReacts(page);

      posts.push({ imgurl, filename, postActivity });

      // Go to next picture
      await page.$eval("a.next", (next: HTMLAnchorElement) => next.click());
      await page.waitFor(1000);
    }

    // Go back
    for (let i = 0; i < count + 1; i++) {
      await page.goBack();
    }
  } else {
    // Since there was no spotlight, all we need is to get the profile pic (which may be blank. There should only be one)
    const imgurl = await page.$$eval(
      "img",
      (images: HTMLImageElement[]) => images[images.length - 1].src
    );
    imgurls.push(imgurl);

    const newpage = await browser.newPage();
    await downloadImage(newpage, imgurl, dirname, `profilepic1.jpg`);

    // const postActivity = await parseCommentsAndReacts(page);

    posts.push({
      imgurl,
      filename: dirname + "/profilepic1.jpg",
    });

    await page.$eval('div[role="presentation"] a', (link: HTMLAnchorElement) =>
      link.click()
    );
    await page.waitFor(2000);
  }

  return posts;
};

const getCoverPics = async (
  page: puppeteer.Page,
  dirname: string,
  browser: puppeteer.Browser
) => {
  const posts: Post[] = [];
  const imgurls: string[] = [];

  await page.$eval("a.coverImage", (ele: HTMLAnchorElement) => {
    ele.click();
  });

  await page.waitFor(5000);

  // Check if there's a spotlight
  const hasSpotlight = await page.evaluate(() => {
    return document.querySelector("img.spotlight") ? true : false;
  });

  if (hasSpotlight) {
    await page.$eval("a.next", (next: HTMLAnchorElement) => next.click());
    await page.waitFor(1000);
    // find the count
    const count = await page.$eval(
      "#fbPhotoSnowliftPositionAndCount",
      (count: HTMLSpanElement) => {
        const rawText = count.innerHTML;
        if (rawText.length > 0) {
          return Number(rawText.split("&nbsp;")[2]);
        } else {
          return 1;
        }
      }
    );

    console.log(count);

    if (count !== 1) {
      await page.goBack();
      await page.waitFor(1000);
    }
    // get all the pictures in the spotlight
    for (let i = 0; i < count; i++) {
      // Get the current picture
      const imgurl = await page.$eval(
        "img.spotlight",
        (spotlight: HTMLImageElement) => spotlight.src
      );
      imgurls.push(imgurl);

      // Download the image
      const newpage = await browser.newPage();
      await downloadImage(newpage, imgurl, dirname, `coverpic${i + 1}.jpg`);
      const filename = dirname + "/" + `coverpic${i + 1}.jpg`;

      await page.waitFor(1000);

      // When I say closer, I mean they talk more, unless...
      const postActivity = await parseCommentsAndReacts(page);

      posts.push({ imgurl, filename, postActivity });

      // Go to next picture
      await page.$eval("a.next", (next: HTMLAnchorElement) => next.click());
      await page.waitFor(1000);
    }

    // Go back
    const goBackCount = count === 1 ? 1 : count + 1;
    for (let i = 0; i < goBackCount; i++) {
      await page.goBack();
    }
  } else {
    // Since there was no spotlight, all we need is to get the profile pic (which may be blank. There should only be one)
    const imgurl = await page.$$eval(
      "img",
      (images: HTMLImageElement[]) => images[images.length - 1].src
    );
    imgurls.push(imgurl);

    const newpage = await browser.newPage();
    await downloadImage(newpage, imgurl, dirname, `coverpic1.jpg`);

    const postActivity = await parseCommentsAndReacts(page);

    posts.push({ imgurl, filename: dirname + "/coverpic1.jpg", postActivity });

    await page.goBack();
  }

  return posts;
};

const scrapeAbout = async (page: puppeteer.Page, aboutLink: string) => {
  await page.goto(aboutLink, { waitUntil: ["networkidle2"] });
  await page.waitFor(2000);
  // Click on each link
  await page.$$eval(
    '#pagelet_timeline_medley_about div[role="tablist"] a',
    (list: HTMLAnchorElement[]) => {
      list[1].click();
    }
  );

  // Waiting...
  await page.waitFor(3000);

  // Grab and scrape
  const eduwork = await page.evaluate(() => {
    const eduworkData: string[] = [];
    const pagelet = document.getElementById("pagelet_eduwork");
    const list = Array.from(
      pagelet.querySelectorAll<HTMLLIElement>("ul.fbProfileEditExperiences li")
    );
    for (const data of list) {
      eduworkData.push(data.innerText);
    }
    return eduworkData;
  });

  await page.$$eval(
    '#pagelet_timeline_medley_about div[role="tablist"] a',
    (list: HTMLAnchorElement[]) => {
      list[2].click();
    }
  );

  // Waiting...
  await page.waitFor(2000);

  const lived = await page.evaluate(() => {
    const livedData: string[] = [];
    const pagelet = document.getElementById("pagelet_hometown");
    const list = Array.from(
      pagelet.querySelectorAll<HTMLLIElement>("ul.fbProfileEditExperiences li")
    );
    for (const data of list) {
      livedData.push(data.innerText);
    }
    return livedData;
  });

  await page.$$eval(
    '#pagelet_timeline_medley_about div[role="tablist"] a',
    (list: HTMLAnchorElement[]) => {
      list[3].click();
    }
  );

  // Waiting...
  await page.waitFor(2000);

  const contactAndBasic = await page.evaluate(() => {
    const contactData: string[] = [];
    const pageletContact = document.getElementById("pagelet_contact");
    const listContact = Array.from(
      pageletContact.querySelectorAll<HTMLLIElement>(
        "ul.fbProfileEditExperiences li"
      )
    );
    for (const data of listContact) {
      contactData.push(data.innerText);
    }

    const basicData: string[] = [];
    const pageletBasic = document.getElementById("pagelet_basic");
    const listBasic = Array.from(
      pageletBasic.querySelectorAll<HTMLLIElement>(
        "ul.fbProfileEditExperiences li"
      )
    );
    for (const data of listBasic) {
      basicData.push(data.innerText);
    }
    return { contact: contactData, basicInfo: basicData };
  });

  await page.$$eval(
    '#pagelet_timeline_medley_about div[role="tablist"] a',
    (list: HTMLAnchorElement[]) => {
      list[4].click();
    }
  );

  // Waiting...
  await page.waitFor(2000);

  const relationship = await page.evaluate(() => {
    const relationshipData: string[] = [];
    const pagelet = document.getElementById("pagelet_relationships");
    const list = Array.from(
      pagelet.querySelectorAll<HTMLLIElement>("ul.fbProfileEditExperiences li")
    );
    for (const data of list) {
      relationshipData.push(data.innerText);
    }
    return relationshipData;
  });

  await page.$$eval(
    '#pagelet_timeline_medley_about div[role="tablist"] a',
    (list: HTMLAnchorElement[]) => {
      list[5].click();
    }
  );

  // Waiting...
  await page.waitFor(2000);

  const details = await page.evaluate(() => {
    const bioData: string[] = [];
    const pageletBio = document.getElementById("pagelet_bio");
    const listBio = Array.from(
      pageletBio.querySelectorAll<HTMLLIElement>(
        "ul.fbProfileEditExperiences li"
      )
    );
    for (const data of listBio) {
      bioData.push(data.innerText);
    }

    const quotesData: string[] = [];
    const pageletquotes = document.getElementById("pagelet_quotes");
    const listquotes = Array.from(
      pageletquotes.querySelectorAll<HTMLLIElement>(
        "ul.fbProfileEditExperiences li"
      )
    );
    for (const data of listquotes) {
      quotesData.push(data.innerText);
    }
    return { bio: bioData, quotes: quotesData };
  });

  await page.close();

  return { eduwork, lived, contactAndBasic, relationship, details };
};

const capitalize = (name: string) =>
  name
    .split(" ")
    .map((word) => word[0].toUpperCase() + word.slice(1, word.length))
    .join(" ");

const scrollDeep = async (page: puppeteer.Page, name: string) => {
  const fname = capitalize(name);

  while (
    !(await page.evaluate((name) => {
      return Array.from(document.querySelectorAll("h3"))
        .map((ele) => ele.innerText)
        .includes("More About " + name);
    }, fname))
  ) {
    await page.evaluate(() => {
      window.scrollBy(0, window.outerHeight * 2);
    });

    await page.waitFor(500);
  }
};

const scrapeFriends = async (
  page: puppeteer.Page,
  name: string,
  friendsLink: string
) => {
  await page.goto(friendsLink, { waitUntil: ["networkidle2"] });
  await page.waitFor(2000);

  const checkFriends = await page.$$eval(
    "div#pagelet_timeline_medley_friends div",
    (divs: HTMLDivElement[]) => {
      for (const div of divs) {
        if (div.innerText === "No friends to show") {
          return false;
        }
      }
      return true;
    }
  );

  // Generate all the friends
  if (!checkFriends) {
    await page.close();
    return [];
  }

  await scrollDeep(page, name);

  await page.waitFor(2000);

  // Get all the unordered lists and parse them
  const friends = await page.$$eval(
    '#pagelet_timeline_medley_friends div[id^="pagelet_timeline_app_collection_"] > ul > li',
    (friendElements: HTMLLIElement[]) => {
      try {
        const friends: Friend[] = [];

        for (const friendElement of friendElements) {
          // Link and name
          const link = friendElement.querySelector("a");
          const profileLink = link.href;
          const name = link.querySelector("img").getAttribute("aria-label");

          const fact = friendElement.querySelector("li");

          const summary = fact?.innerText;
          const factLinks = fact?.getElementsByTagName("a");
          let fl: HTMLAnchorElement;
          if (factLinks && factLinks.length) {
            if (factLinks.length > 1) {
              fl = factLinks[1];
            } else {
              fl = factLinks[0];
            }
          }
          const factLink = fl?.href;

          friends.push({
            profileLink,
            name,
            associatedWith: { summary, link: factLink },
          });
        }

        return friends;
      } catch (err) {
        console.log(err);
      }
    }
  );

  await page.close();

  return friends;
};

const scrapeLikes = async (
  page: puppeteer.Page,
  name: string,
  likesLink: string
) => {
  await page.goto(likesLink, { waitUntil: ["networkidle2"] });
  await page.waitFor(2000);

  // Scroll down to likes area
  while (
    !(await page.evaluate(() => {
      if (document.querySelector("#pagelet_timeline_medley_likes")) {
        return true;
      } else {
        return false;
      }
    }))
  ) {
    await page.evaluate(() => {
      window.scrollBy(0, window.outerHeight * 2);
    });
    await page.waitFor(1000);
  }

  await page.evaluate(() => {
    window.scrollBy(0, window.outerHeight);
  });
  await page.waitFor(2500);

  // Clicking see more
  await page.$eval(
    '#pagelet_timeline_medley_likes a[data-referrer="timeline_collections_overview_see_all"]',
    (ele: HTMLAnchorElement) => ele.click()
  );
  await page.waitFor(5000);

  // Scroll and generate all of them
  let scrollHeight = -100;
  while (
    (await page.evaluate(() => document.body.scrollHeight)) > scrollHeight
  ) {
    scrollHeight = await page.evaluate(() => document.body.scrollHeight);
    await page.evaluate(() => {
      window.scrollBy(0, window.outerHeight * 2);
    });

    await page.waitFor(1000);
  }

  // Scrape!
  const likes = await page.$$eval(
    '#pagelet_timeline_medley_likes div[id^="pagelet_timeline_app_collection_"] > ul > li',
    (likeElements: HTMLLIElement[]) => {
      const likes: Likes[] = [];

      for (const likeElement of likeElements) {
        // Link and name
        const linkTag = likeElement.querySelector("a");
        const link = linkTag.href;

        const data = likeElement.innerText.split("\n");
        const title = data[0];
        const type = data.length == 3 ? data[1] : null;

        likes.push({
          link,
          title,
          type,
        });
      }

      return likes;
    }
  );

  await page.close();
  return likes;
};

const scrapeTimeline = async (
  page: puppeteer.Page,
  browser: puppeteer.Browser,
  name: string
) => {
  const hrefs = await page.$$eval(
    "#fbTimelineHeadline ul li a",
    (elements: HTMLAnchorElement[]) => {
      return elements.map((anchor) => anchor.href);
    }
  );

  const aboutPage = await browser.newPage();
  const aboutpr = scrapeAbout(aboutPage, hrefs[1]);

  const friendsPage = await browser.newPage();
  const friendspr = scrapeFriends(friendsPage, name, hrefs[2]);

  const likesPage = await browser.newPage();
  const likespr = scrapeLikes(likesPage, name, hrefs[1]);

  const [about, friends, likes] = await Promise.all([
    aboutpr,
    friendspr,
    likespr,
  ]);
  return { about, friends, likes };
};

const scrapeProfile = async (
  page,
  profile: string,
  dirname: string,
  browser: puppeteer.Browser,
  name: string
) => {
  await page.goto(profile, { waitUntil: ["networkidle2"] });
  await sleep(5000);
  if (!fs.existsSync(dirname + "/profilepics")) {
    fs.mkdirSync(dirname + "/profilepics", { recursive: true });
  }
  const posts = await getProfilePics(page, dirname + "/profilepics", browser);
  console.log("posts", JSON.stringify(posts));

  await page.waitFor(3000);

  if (!fs.existsSync(dirname + "/coverpics")) {
    fs.mkdirSync(dirname + "/coverpics", { recursive: true });
  }
  const morePosts = await getCoverPics(page, dirname + "/coverpics", browser);
  console.log("more posts...", JSON.stringify(morePosts));

  await page.waitFor(3000);

  const data = await scrapeTimeline(page, browser, name);
  console.log(JSON.stringify(data));

  const allPosts = [...posts, ...morePosts];

  return { allPosts, data };
};

const scrapeFb = async ({
  name,
  link,
}: {
  name: string;
  link?: string;
}): Promise<FacebookData> => {
  const browser = await puppeteer.launch({ headless: false });
  try {
    // Single page is enough
    const page = await browser.newPage();

    page.on("dialog", async (dialog) => {
      console.log(dialog.message());
      await dialog.dismiss();
    });

    await page.goto("https://facebook.com");
    await login(page);
    await page.waitFor(15000);
    // await closeDialog

    if (!link) {
      await searchForPeople(page, name);
      await sleep(5000);
      const profiles = await getProfiles(page, name);

      for (const profile of profiles) {
        console.log(profile);
      }
      if (!fs.existsSync(name)) {
        fs.mkdirSync(name, { recursive: true });
      }

      await sleep(1000);
      const { allPosts, data } = await scrapeProfile(
        page,
        profiles[0],
        name,
        browser,
        name
      );

      console.log("done");
      return { name, allPosts, data };
    } else {
      // This won't work when you loop through profiles
      if (!fs.existsSync(name)) {
        fs.mkdirSync(name, { recursive: true });
      }

      await sleep(1000);
      const { allPosts, data } = await scrapeProfile(
        page,
        link,
        name,
        browser,
        name
      );

      console.log("done");
      return { name, allPosts, data };
    }
  } catch (e) {
    console.log(e);
    console.log("oops");
  } finally {
    await browser.close();
  }
};

interface FacebookData {
  name: string;
  data: {
    about: {
      eduwork: string[];
      lived: string[];
      contactAndBasic: {
        contact: string[];
        basicInfo: string[];
      };
      relationship: string[];
      details: {
        bio: string[];
        quotes: string[];
      };
    };
    friends: Friend[];
    likes: Likes[];
  };
  allPosts: Post[];
}

export { scrapeFb, FacebookData, Friend, Likes };
