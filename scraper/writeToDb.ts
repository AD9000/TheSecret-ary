import { scrapeFb, FacebookData, Friend, Likes } from "./scrapeFb";
import {
  scrapeLinkedin,
  LinkedinData,
  Education,
  Experience,
} from "./scrapeLinkedIn";
import db from "./dbApi";
const fs = require("fs");

const mergeData2 = (
  name: string,
  fbdata: FacebookData,
  linkedInData: LinkedinData
) => {
  if (fbdata && linkedInData) {
    return {
      name: fbdata.name,
      headline: linkedInData.about.headline,
      about: {
        location: linkedInData.about.location,
        summary: linkedInData.about.about,
        gender: fbdata.data.about.contactAndBasic.basicInfo,
        relationship: fbdata.data.about.relationship,
        lived: fbdata.data.about.lived,
      },
      experience: linkedInData.experience,
      education: linkedInData.education,
      otherWorkDetails: [...fbdata.data.about.eduwork],
      skills: linkedInData.skills,
      posts: fbdata.allPosts,
      photos: [linkedInData.about.photofile],
      friends: fbdata.data.friends,
      likes: fbdata.data.likes,
      contactInfo: [
        ...linkedInData.about.contactInfo,
        fbdata.data.about.contactAndBasic.contact,
      ],
      otherDetails: fbdata.data.about.details,
    };
  } else if (fbdata) {
    return {
      name: fbdata.name,
      headline: "",
      about: {
        location: "",
        summary: "",
        gender: fbdata.data.about.contactAndBasic.basicInfo,
        relationship: fbdata.data.about.relationship,
        lived: fbdata.data.about.lived,
      },
      experience: "",
      education: "",
      otherWorkDetails: [...fbdata.data.about.eduwork],
      skills: "",
      posts: fbdata.allPosts,
      photos: [],
      friends: fbdata.data.friends,
      likes: fbdata.data.likes,
      contactInfo: [fbdata.data.about.contactAndBasic.contact],
      otherDetails: fbdata.data.about.details,
    };
  } else if (linkedInData) {
    return {
      name,
      headline: linkedInData.about.headline,
      about: {
        location: linkedInData.about.location,
        summary: linkedInData.about.about,
        gender: "",
        relationship: "",
        lived: "",
      },
      experience: linkedInData.experience,
      education: linkedInData.education,
      otherWorkDetails: [],
      skills: linkedInData.skills,
      posts: [],
      photos: [linkedInData.about.photofile],
      friends: "",
      likes: "",
      contactInfo: [...linkedInData.about.contactInfo],
      otherDetails: {},
    };
  }
};

(async () => {
  const scrapedFb = await scrapeFb({
    name: "atharv damle",
  });
  console.log(JSON.stringify(scrapedFb));

  const data = mergeData2("atharv damle", scrapedFb, undefined);
  console.log(JSON.stringify(data));

  db.addData(data).then(() => process.exit(0));
})();
