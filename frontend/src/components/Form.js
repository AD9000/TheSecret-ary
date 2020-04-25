import React from "react";
import { Button, Form } from "react-bootstrap";
import { Redirect } from "react-router";
import { Results } from "./Display";
import { Header } from "./Header";

// const recvd = [
//   {
//     _id: "5e955479886de30ea9ce9d69",
//     name: "atharv damle",
//     headline:
//       "Projects Subcommittee Team Member at UNSW Computer Science and Engineering Society (CSESoc)",
//     about: {
//       location: "Sydney, New South Wales, Australia ",
//       summary: "GitHub: https://www.github.com/AD9000 ",
//       gender: ["Gender\nMale"],
//       relationship: [
//         "No relationship info to show",
//         "No family members to show",
//       ],
//       lived: ["No places to show"],
//     },
//     experience: [
//       {
//         company: "Optus",
//         companyPage: "https://www.linkedin.com/company/optus/",
//         positions: [
//           {
//             title: "Solution Designer",
//             timeline: {
//               startAndEnd: "Feb 2020 – Present",
//               duration: "3 mos",
//             },
//             location: "Sydney, Australia",
//           },
//         ],
//       },
//       {
//         company: "UNSW",
//         companyPage: "https://www.linkedin.com/company/csesoc/",
//         positions: [
//           {
//             title: "Projects Subcommittee Team Member",
//             timeline: {
//               startAndEnd: "May 2019 – Present",
//               duration: "1 yr",
//             },
//             location: "Sydney, Australia",
//           },
//         ],
//       },
//       {
//         company: "BLUEsat",
//         companyPage: "https://www.linkedin.com/company/bluesat-unsw/",
//         positions: [
//           {
//             title: "OWRS Software Developer",
//             timeline: {
//               startAndEnd: "Feb 2019 – Apr 2020",
//               duration: "1 yr 3 mos",
//             },
//             location: "Sydney, Australia",
//           },
//         ],
//       },
//       {
//         company: "Platute",
//         companyPage: "https://www.linkedin.com/company/platute/",
//         positions: [
//           {
//             title: "Full Stack Development Intern",
//             timeline: {
//               startAndEnd: "Dec 2019 – Jan 2020",
//               duration: "2 mos",
//             },
//           },
//         ],
//       },
//       {
//         company: "UNSW",
//         companyPage:
//           "https://www.linkedin.com/company/unsw-leadership-program/",
//         positions: [
//           {
//             title: "Member",
//             timeline: {
//               startAndEnd: "Jul 2018 – Dec 2019",
//               duration: "1 yr 6 mos",
//             },
//             location: "Sydney, Australia",
//           },
//         ],
//       },
//       {
//         company: "Domino's",
//         companyPage: "https://www.linkedin.com/company/domino's-pizza/",
//         positions: [
//           {
//             title: "Delivery Expert",
//             timeline: {
//               startAndEnd: "Mar 2019 – Jun 2019",
//               duration: "4 mos",
//             },
//           },
//         ],
//       },
//       {
//         company: "ThoughtWorks",
//         companyPage: "https://www.linkedin.com/company/thoughtworks-level-up/",
//         positions: [
//           {
//             title: "Project Member",
//             timeline: {
//               startAndEnd: "Mar 2019 – May 2019",
//               duration: "3 mos",
//             },
//             location: "Sydney, Australia",
//           },
//         ],
//       },
//     ],
//     education: [
//       {
//         university: "UNSW",
//         link: "https://www.linkedin.com/school/10245/?legacySchoolId=10245",
//         degreeName: "Bachelor of Engineering - BE",
//         field: "Software Engineering",
//         dates: "2018 – 2022",
//       },
//       {
//         university: "Smt. Sulochanadevi Singhania School",
//         link:
//           "https://www.linkedin.com/search/results/all/?keywords=Smt.%20Sulochanadevi%20Singhania%20School",
//         degreeName: "ISC",
//         dates: "2008 – 2018",
//       },
//     ],
//     otherWorkDetails: [
//       "No workplaces to show",
//       "No schools/universities to show",
//     ],
//     skills: [
//       {
//         name: "Java",
//         verified: false,
//         endorsements: [
//           {
//             profileLink: "https://www.linkedin.com/in/lasindushanildesilva/",
//             name: "Lasindu Shanil de Silva \nout of network\n 3rd+",
//             headline:
//               "Passionately preparing towards a career in Computer Security by excelling in Computer Science",
//           },
//         ],
//       },
//       {
//         name: "C (Programming Language)",
//         verified: true,
//         endorsements: [
//           {
//             profileLink:
//               "https://www.linkedin.com/in/arshdeep-singh-bhogal-029b4417b/",
//             name: "Arshdeep Singh Bhogal \nout of network\n 3rd+",
//             headline: "Student at UNSW",
//           },
//         ],
//       },
//       {
//         name: "JavaScript",
//         verified: true,
//         endorsements: [
//           {
//             profileLink: "https://www.linkedin.com/in/lasindushanildesilva/",
//             name: "Lasindu Shanil de Silva \nout of network\n 3rd+",
//             headline:
//               "Passionately preparing towards a career in Computer Security by excelling in Computer Science",
//           },
//         ],
//       },
//     ],
//     posts: [
//       {
//         imgurl:
//           "https://scontent.fmel7-1.fna.fbcdn.net/v/t1.0-1/13754570_302169356785874_1821286952517831286_n.jpg?_nc_cat=110&_nc_sid=dbb9e7&_nc_ohc=RITt7vhSQysAX9tvtIm&_nc_ht=scontent.fmel7-1.fna&oh=ec9a5eb3520cd154b1a4608737f44bb2&oe=5EB93C7D",
//         filename: "atharv damle/profilepics/profilepic1.jpg",
//       },
//       {
//         imgurl:
//           "https://scontent.fmel7-1.fna.fbcdn.net/v/t1.0-9/s960x960/48407296_772317576437714_244839236388257792_o.jpg?_nc_cat=106&_nc_sid=dd9801&_nc_ohc=lyFxiZ5UiTUAX_mzwHW&_nc_ht=scontent.fmel7-1.fna&_nc_tp=7&oh=c29dc7c2bf9ca6e8a35fa65a365654cc&oe=5EBB8C98",
//         filename: "atharv damle/coverpics/coverpic1.jpg",
//         postActivity: {
//           caption: null,
//           reacts: [
//             {
//               type: "Like",
//               user: {
//                 name: "Jeremy John George",
//                 profileLink:
//                   "https://www.facebook.com/jeremyjohn.george.1?fref=pb&__tn__=%2Cd-a-R&eid=ARDJlh9uPzCHHZlcg7orbmljz7ByA-Xfk8dcQwmDdUT2DDP8a9XTyQYNiSzHKv3Vq6Skm2a0Amwrnj18&hc_location=profile_browser",
//               },
//             },
//             {
//               type: "Like",
//               user: {
//                 name: "Aditya Shenoy",
//                 profileLink:
//                   "https://www.facebook.com/aditya.shenoy.52?fref=pb&__tn__=%2Cd-a-R&eid=ARAkaDo2a6AYv4z8hiZYc7OUA_ndAD8lDjwaqWWnDaPKL9RmxPRrX5ZHHCY1BAuWWDG8N8FrghUEVNo8&hc_location=profile_browser",
//               },
//             },
//             {
//               type: "Like",
//               user: {
//                 name: "Smit Dobaria",
//                 profileLink:
//                   "https://www.facebook.com/smit.dobaria.1234567890?fref=pb&__tn__=%2Cd-a-R&eid=ARD6-dvP8Txv-n11pMlB2QoU-iXFoIZv6q8PFYnvn51n4eRB9vfZ14MPP00bZyJab51KMdTiYAfuDyyK&hc_location=profile_browser",
//               },
//             },
//             {
//               type: "Like",
//               user: {
//                 name: "Piyush Gupta",
//                 profileLink:
//                   "https://www.facebook.com/hpiyushgg?fref=pb&__tn__=%2Cd-a-R&eid=ARBnNhKQIy2Dsf_yNtz_qB2Bz5og1FWzKCPWxED4dyvWJ92pfWoK-arKvGm5EdY-UAv2EXBSUCpIbo8d&hc_location=profile_browser",
//               },
//             },
//             {
//               type: "Like",
//               user: {
//                 name: "Samuel XuYakun",
//                 profileLink:
//                   "https://www.facebook.com/ruolinxyk?fref=pb&__tn__=%2Cd-a-R&eid=ARAuVrKgthCQ1eolBzqhv7Qczhy1klsjFYL6gaaZ_x9C6IMwYz6ZO4os1l69cvKNgGBvXA8vHh_xdnaL&hc_location=profile_browser",
//               },
//             },
//             {
//               type: "Like",
//               user: {
//                 name: "Kshitiz Saini",
//                 profileLink:
//                   "https://www.facebook.com/kshitiz.saini.33?fref=pb&__tn__=%2Cd-a-R&eid=ARCr0WMuNO5OUQzIGpftb0MLXg49S71GkEM5hAGbRVrGHm_Z1lGTNyzaUfgrRm1FAGz1Lzgfro_JJ_L9&hc_location=profile_browser",
//               },
//             },
//             {
//               type: "Like",
//               user: {
//                 name: "Nishant Pdv",
//                 profileLink:
//                   "https://www.facebook.com/nishant.pandav?fref=pb&__tn__=%2Cd-a-R&eid=ARCBhBCt2aPGHahAm4BWOhV9vEAOSN94YkSfntbWU1OiyQsKXxHShYMw7sC2oEI8IrOzJBvYkiRd4FXz&hc_location=profile_browser",
//               },
//             },
//             {
//               type: "Like",
//               user: {
//                 name: "Sarwar Hossain",
//                 profileLink:
//                   "https://www.facebook.com/sarwarhos312?fref=pb&__tn__=%2Cd-a-R&eid=ARBmkEo0FU5BST_YLaleXrGFFH5nR-hfnTagw2Lq3dve_MBa9zRPbqQYJSRBYP1XSbW388Q6wB52ZSBQ&hc_location=profile_browser",
//               },
//             },
//             {
//               user: {
//                 name: "Andrew Nguyen",
//                 profileLink:
//                   "https://www.facebook.com/andrew.nguyen.752?fref=pb&eid=ARDvMXxSgNOyYhGZ5-RBV14qF-dQGB1BoDEPZV4YDqKLhrmDXyAmcQNMCqX1KnIzxTB-NM193VYB_Fj4&hc_location=profile_browser",
//               },
//             },
//           ],
//           comments: [],
//         },
//       },
//     ],
//     photos: ["atharv damle/photos/profilePic.jpg"],
//     friends: [],
//     likes: [
//       {
//         link:
//           "https://www.facebook.com/SubtleUnswDating/?fref=profile_friend_list&hc_location=profile_browser",
//         title: "Subtle UNSW Dating",
//         type: "Youth organisation",
//       },
//       {
//         link:
//           "https://www.facebook.com/linkedinmemes/?fref=profile_friend_list&hc_location=profile_browser",
//         title: "LinkedIn Memes for Career Minded Teens",
//         type: "Interest",
//       },
//       {
//         link:
//           "https://www.facebook.com/UNSWCLOUD/?fref=profile_friend_list&hc_location=profile_browser",
//         title: "UNSW CLOUD",
//         type: "Computer & Internet website",
//       },
//       {
//         link:
//           "https://www.facebook.com/theunswtimes/?fref=profile_friend_list&hc_location=profile_browser",
//         title: "The UNSW Times",
//         type: "Community",
//       },
//       {
//         link:
//           "https://www.facebook.com/bakeology0/?fref=profile_friend_list&hc_location=profile_browser",
//         title: "Bakeology",
//         type: "Restaurant",
//       },
//       {
//         link:
//           "https://www.facebook.com/hackathonsaustralia/?fref=profile_friend_list&hc_location=profile_browser",
//         title: "Hackathons Australia",
//         type: "Community organisation",
//       },
//       {
//         link:
//           "https://www.facebook.com/ChessMemes2371/?fref=profile_friend_list&hc_location=profile_browser",
//         title: "Chess Memes",
//         type: "Sport league",
//       },
//       {
//         link:
//           "https://www.facebook.com/ThisShouldNotHaveBeenPosted/?fref=profile_friend_list&hc_location=profile_browser",
//         title:
//           "Screenshots of messages that probably shouldn’t have been posted",
//         type: "Education",
//       },
//       {
//         link:
//           "https://www.facebook.com/ooteensmemes/?fref=profile_friend_list&hc_location=profile_browser",
//         title: "Programming Memes for Object-oriented Teens",
//         type: "Community",
//       },
//       {
//         link:
//           "https://www.facebook.com/ProgrammersMemes/?fref=profile_friend_list&hc_location=profile_browser",
//         title: "Programmer Memes",
//         type: "Software",
//       },
//       {
//         link:
//           "https://www.facebook.com/DataSoc/?fref=profile_friend_list&hc_location=profile_browser",
//         title: "UNSW Data Science Society",
//         type: "College & University",
//       },
//       {
//         link:
//           "https://www.facebook.com/hackathon/?fref=profile_friend_list&hc_location=profile_browser",
//         title: "Hackathon",
//         type: "Product/service",
//       },
//       {
//         link:
//           "https://www.facebook.com/csesoc/?fref=profile_friend_list&hc_location=profile_browser",
//         title: "CSESoc UNSW",
//         type: "College & University",
//       },
//       {
//         link:
//           "https://www.facebook.com/pages/Smt-Sulochanadevi-Singhania-School/105944209446569?fref=profile_friend_list&hc_location=profile_browser",
//         title: "Smt. Sulochanadevi Singhania School",
//         type: "Public school",
//       },
//       {
//         link:
//           "https://www.facebook.com/unswavsoc/?fref=profile_friend_list&hc_location=profile_browser",
//         title: "UNSW Aviation Society",
//         type: "Non-profit organisation",
//       },
//       {
//         link:
//           "https://www.facebook.com/unswsecsoc/?fref=profile_friend_list&hc_location=profile_browser",
//         title: "The Security Society of UNSW",
//         type: "Community organisation",
//       },
//       {
//         link:
//           "https://www.facebook.com/sharewithoscar/?fref=profile_friend_list&hc_location=profile_browser",
//         title: "Share with Oscar",
//         type: "Car park/garage",
//       },
//       {
//         link:
//           "https://www.facebook.com/UNSWoptometryclinic/?fref=profile_friend_list&hc_location=profile_browser",
//         title: "UNSW Optometry Clinic",
//         type: "Optometrist",
//       },
//       {
//         link:
//           "https://www.facebook.com/hoorayfreefood/?fref=profile_friend_list&hc_location=profile_browser",
//         title: "Free Food",
//         type: "Community",
//       },
//       {
//         link:
//           "https://www.facebook.com/UNSWCareers/?fref=profile_friend_list&hc_location=profile_browser",
//         title: "UNSW Careers",
//         type: "Career counsellor",
//       },
//       {
//         link:
//           "https://www.facebook.com/ArcUNSW/?fref=profile_friend_list&hc_location=profile_browser",
//         title: "Arc - UNSW Student Life",
//         type: "College & University",
//       },
//       {
//         link:
//           "https://www.facebook.com/unsw/?fref=profile_friend_list&hc_location=profile_browser",
//         title: "UNSW",
//         type: "School",
//       },
//       {
//         link:
//           "https://www.facebook.com/Samarpan-Kitchens-UK-173504590023477/?fref=profile_friend_list&hc_location=profile_browser",
//         title: "Samarpan Kitchens UK",
//         type: "Charitable organisation",
//       },
//       {
//         link:
//           "https://www.facebook.com/saikoplus/?fref=profile_friend_list&hc_location=profile_browser",
//         title: "Saiko+",
//         type: "App Page",
//       },
//       {
//         link:
//           "https://www.facebook.com/chichorapan/?fref=profile_friend_list&hc_location=profile_browser",
//         title: "Chichorapan",
//         type: "Just for fun",
//       },
//       {
//         link:
//           "https://www.facebook.com/mccsaarc/?fref=profile_friend_list&hc_location=profile_browser",
//         title: "MCC SAARC Summit 2019",
//         type: "Event",
//       },
//       {
//         link:
//           "https://www.facebook.com/goal/?fref=profile_friend_list&hc_location=profile_browser",
//         title: "Goal.com",
//         type: "Sport",
//       },
//       {
//         link:
//           "https://www.facebook.com/mensxp/?fref=profile_friend_list&hc_location=profile_browser",
//         title: "MensXP",
//         type: "News and media website",
//       },
//       {
//         link:
//           "https://www.facebook.com/killwished/?fref=profile_friend_list&hc_location=profile_browser",
//         title: "KillWish",
//         type: "Public figure",
//       },
//       {
//         link:
//           "https://www.facebook.com/1000lifehacks/?fref=profile_friend_list&hc_location=profile_browser",
//         title: "1000 Life Hacks",
//         type: "Community",
//       },
//       {
//         link:
//           "https://www.facebook.com/ListPosts/?fref=profile_friend_list&hc_location=profile_browser",
//         title: "List Posts",
//         type: "Just for fun",
//       },
//       {
//         link:
//           "https://www.facebook.com/GustaManOfficial/?fref=profile_friend_list&hc_location=profile_browser",
//         title: "GustaMan",
//         type: "Media",
//       },
//       {
//         link:
//           "https://www.facebook.com/pages/Jumping-All-Over-the-World-song/108514595839474?fref=profile_friend_list&hc_location=profile_browser",
//         title: "Jumping All Over the World (song)",
//         type: "Local business",
//       },
//       {
//         link:
//           "https://www.facebook.com/SarcasmLol/?fref=profile_friend_list&hc_location=profile_browser",
//         title: "Sarcasm",
//         type: "Video creator",
//       },
//       {
//         link:
//           "https://www.facebook.com/weebthings/?fref=profile_friend_list&hc_location=profile_browser",
//         title: "I Freaking Love Anime",
//         type: "TV genre",
//       },
//       {
//         link:
//           "https://www.facebook.com/OYBForever/?fref=profile_friend_list&hc_location=profile_browser",
//         title: "Oh Yes Bitch, I'll Offend You",
//         type: "Comedian",
//       },
//       {
//         link:
//           "https://www.facebook.com/FreshBoxMediaOfficial/?fref=profile_friend_list&hc_location=profile_browser",
//         title: "FreshBox Media",
//         type: "Advertising agency",
//       },
//       {
//         link:
//           "https://www.facebook.com/supercars16byhritikmathur/?fref=profile_friend_list&hc_location=profile_browser",
//         title: "SuperCars",
//         type: "Cars",
//       },
//       {
//         link:
//           "https://www.facebook.com/MSDhoni/?fref=profile_friend_list&hc_location=profile_browser",
//         title: "MS Dhoni",
//         type: "Athlete",
//       },
//       {
//         link:
//           "https://www.facebook.com/IITJEEhelp/?fref=profile_friend_list&hc_location=profile_browser",
//         title: "Embibe - IIT JEE",
//         type: "Higher education",
//       },
//       {
//         link:
//           "https://www.facebook.com/braindare/?fref=profile_friend_list&hc_location=profile_browser",
//         title: "Brain Dare",
//         type: "Entertainment website",
//       },
//       {
//         link:
//           "https://www.facebook.com/Sportskeeda/?fref=profile_friend_list&hc_location=profile_browser",
//         title: "Sportskeeda",
//         type: "News and media website",
//       },
//       {
//         link:
//           "https://www.facebook.com/Newsandentertainmentofficial/?fref=profile_friend_list&hc_location=profile_browser",
//         title: "News & Entertainment",
//         type: "Media/news company",
//       },
//       {
//         link:
//           "https://www.facebook.com/ComedyShortsGamerPage/?fref=profile_friend_list&hc_location=profile_browser",
//         title: "ComedyShortsGamer",
//         type: "Video creator",
//       },
//       {
//         link:
//           "https://www.facebook.com/ClashofClans/?fref=profile_friend_list&hc_location=profile_browser",
//         title: "Clash of Clans",
//         type: "Games/toys",
//       },
//       {
//         link:
//           "https://www.facebook.com/smosh/?fref=profile_friend_list&hc_location=profile_browser",
//         title: "Smosh",
//         type: "Comedian",
//       },
//       {
//         link:
//           "https://www.facebook.com/robertdowneyjr/?fref=profile_friend_list&hc_location=profile_browser",
//         title: "Robert Downey Jr",
//         type: "Artist",
//       },
//       {
//         link:
//           "https://www.facebook.com/SmoshGames/?fref=profile_friend_list&hc_location=profile_browser",
//         title: "Smosh Games",
//         type: "Gaming video creator",
//       },
//       {
//         link:
//           "https://www.facebook.com/saLe.DoSt.kO.tHaNKs.bOlTa.HaI/?fref=profile_friend_list&hc_location=profile_browser",
//         title: "Saale Dost Ko Thanks Bolta hai",
//         type: "Public figure",
//       },
//       {
//         link:
//           "https://www.facebook.com/DudePerfect/?fref=profile_friend_list&hc_location=profile_browser",
//         title: "Dude Perfect",
//         type: "Public figure",
//       },
//       {
//         link:
//           "https://www.facebook.com/starbucksbandracafe/?fref=profile_friend_list&hc_location=profile_browser",
//         title: "Starbucks Cafe India",
//         type: "Community",
//       },
//       {
//         link:
//           "https://www.facebook.com/sabqtiyapahai/?fref=profile_friend_list&hc_location=profile_browser",
//         title: "TVF Qtiyapa",
//         type: "Entertainment website",
//       },
//       {
//         link:
//           "https://www.facebook.com/CircleofCricket.India/?fref=profile_friend_list&hc_location=profile_browser",
//         title: "Circle of Cricket India",
//         type: "News and media website",
//       },
//       {
//         link:
//           "https://www.facebook.com/IndiaBakchod/?fref=profile_friend_list&hc_location=profile_browser",
//         title: "All India Bakchod",
//         type: "Public figure",
//       },
//       {
//         link:
//           "https://www.facebook.com/SarcasticIndian.Inc/?fref=profile_friend_list&hc_location=profile_browser",
//         title: "The Sarcastic Indian",
//         type: "Just for fun",
//       },
//       {
//         link:
//           "https://www.facebook.com/BillGates/?fref=profile_friend_list&hc_location=profile_browser",
//         title: "Bill Gates",
//         type: "Public figure",
//       },
//       {
//         link:
//           "https://www.facebook.com/TheRVCJMedia/?fref=profile_friend_list&hc_location=profile_browser",
//         title: "RVCJ Media",
//         type: "Entertainment website",
//       },
//       {
//         link:
//           "https://www.facebook.com/laughingcolours/?fref=profile_friend_list&hc_location=profile_browser",
//         title: "Laughing Colours",
//         type: "Media/news company",
//       },
//       {
//         link:
//           "https://www.facebook.com/TaylorSwift/?fref=profile_friend_list&hc_location=profile_browser",
//         title: "Taylor Swift",
//         type: "Musician/band",
//       },
//       {
//         link:
//           "https://www.facebook.com/TwoandaHalfMen/?fref=profile_friend_list&hc_location=profile_browser",
//         title: "Two and a Half Men",
//         type: "TV programme",
//       },
//       {
//         link:
//           "https://www.facebook.com/Castle/?fref=profile_friend_list&hc_location=profile_browser",
//         title: "Castle",
//         type: "TV programme",
//       },
//       {
//         link:
//           "https://www.facebook.com/KungFuPanda/?fref=profile_friend_list&hc_location=profile_browser",
//         title: "Kung Fu Panda",
//         type: "Interest",
//       },
//       {
//         link:
//           "https://www.facebook.com/CadburyDairyMilkAustralia/?fref=profile_friend_list&hc_location=profile_browser",
//         title: "Cadbury Dairy Milk",
//         type: "Product/service",
//       },
//     ],
//     contactInfo: [
//       {
//         name: "Atharv’s Profile",
//         link: "https://www.linkedin.com/in/atharv-damle",
//         details: "linkedin.com/in/atharv-damle",
//       },
//       ["No contact info to show"],
//     ],
//     otherDetails: {
//       bio: ["No additional details to show"],
//       quotes: ["No favourite quotes to show"],
//     },
//   },
// ];

class NameForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // success: true,
      name: "",
      whitelist: ["atharv damle", "andrew nguyen", "max wo", "kshitiz saini"],
    };
    console.log(this.props);
  }
  handleInput = (e) => {
    console.log(this.props.history);
    console.log(e);
    this.setState({ name: document.querySelector("input").value });
  };
  handleClick = (e) => this.handleSubmit();
  handleSubmit = (e) => {
    e.preventDefault();
    if (this.state.name && this.state.name.length > 0) {
      this.setState({ errors: null });
      if (this.state.whitelist.includes(this.state.name.toLowerCase())) {
        this.makeRequest();
      } else {
        this.setState({ redirect: true });
      }
    } else {
      console.log("no name");
      this.setState({ errors: "Enter a name first!" });
    }
  };

  makeRequest = () => {
    console.log("making request");
    fetch("/data", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: this.state.name }),
    })
      .then((res) => res.json())
      .then((r) => {
        this.setState({ data: r, success: true });
        console.log(r);
      });
  };
  render() {
    return this.state.redirect ? (
      <Redirect to="/pageNotFound" />
    ) : this.state.success ? (
      <Results data={this.state.data} />
    ) : (
      <section>
        <Header />
        <Form
          className="text-center"
          style={{ height: "100%" }}
          onSubmit={this.handleSubmit}
        >
          <Form.Group>
            <h4>Enter a name</h4>
            <input onChange={this.handleInput} style={{ margin: "1rem" }} />
            <div style={{ color: "red" }}>{this.state.errors}</div>
            <Button type="submit">Submit</Button>
          </Form.Group>
        </Form>
      </section>
    );
  }
}

export { NameForm };
