import React from "react";
import { Carousel, ListGroup } from "react-bootstrap";
import "./display.css";
const flatten = require("flat");

const Likes = (props) => {
  if (!props.likes || props.likes === "") {
    return <div></div>;
  }

  const data = props.likes;

  return (
    <ListGroup
      as="ul"
      className="col-sm-6"
      style={{ paddingLeft: "20px", paddingRight: "20px" }}
    >
      <h3 style={{ padding: "25px 25px 0px 0px" }}>What they like</h3>

      {data.map((ele, index) => (
        <ListGroup.Item key={index} action href={ele.link}>
          {ele.title}
        </ListGroup.Item>
      ))}
    </ListGroup>
  );
};
const People = (props) => {
  let data1 = [];
  let d1 = [];
  if (!props.data.skills || props.data.skills === "") {
    data1 = [];
  } else {
    data1 = [
      ...props.data.skills.map((ele) => {
        const endorsers = ele.endorsements
          ? ele.endorsements.map((e) => {
              return {
                name: e.name.split("\n")[0],
                profileLink: e.profileLink,
              };
            })
          : undefined;
        return endorsers;
      }),
    ];

    for (const ele of data1) {
      d1 = d1.concat(ele);
    }

    let d2 = {};
    for (const ele of d1) {
      d2[ele.name] = ele;
    }

    d1 = Object.values(d2);
    console.log(d1);
  }

  let data2 = [];
  if (props.data.friends !== "" && props.data.friends.length > 0) {
    data2 = [
      ...props.data.friends.map((ele) => {
        return { name: ele.name, profileLink: ele.profileLink };
      }),
    ];
  }

  let data3 = [];

  const data = [...d1, ...data2, ...data3];
  if (!data) {
    return <div></div>;
  }
  return (
    <ListGroup
      as="ul"
      className="col-sm-6"
      style={{ paddingLeft: "20px", paddingRight: "20px" }}
    >
      <h3 style={{ padding: "25px 25px 0px 0px" }}>People they know</h3>

      {data.map((ele, index) => (
        <ListGroup.Item key={index} action href={ele.profileLink}>
          {ele.name}
        </ListGroup.Item>
      ))}
    </ListGroup>
  );
};

const Skills = (props) => {
  const data = props.skills;
  if (!data || data === "") {
    return <div></div>;
  }
  return (
    <ListGroup
      as="ul"
      className="col-sm-6"
      style={{ paddingLeft: "20px", paddingRight: "20px" }}
    >
      <h3 style={{ padding: "25px 25px 0px 0px" }}>
        Top Skills{" "}
        <span style={{ fontSize: "20px", color: "gray" }}>
          (According to the person):
        </span>
      </h3>

      {data.map((ele, index) => (
        <ListGroup.Item key={index}>{ele.name}</ListGroup.Item>
      ))}
    </ListGroup>
  );
};
const Education = (props) => {
  const data = props.education;
  if (!data || data === "") {
    return <div></div>;
  }
  return (
    <ListGroup
      as="ul"
      className="col-sm-6"
      style={{ paddingLeft: "20px", paddingRight: "20px" }}
    >
      <h3 style={{ padding: "25px 25px 0px 0px" }}>Studied At:</h3>
      {data.map((ele, index) => (
        <ListGroup.Item key={index} action href={ele.link}>
          <h3>{ele.university}</h3>
          <p>{ele.degreeName}</p>
          <p>{ele.dates}</p>
        </ListGroup.Item>
      ))}
    </ListGroup>
  );
};

const Experience = (props) => {
  const data = props.experience;
  if (!data || data === "") {
    return <div></div>;
  }
  return (
    <ListGroup
      as="ul"
      className="col-sm-6"
      style={{ paddingLeft: "20px", paddingRight: "20px" }}
    >
      <h3 style={{ padding: "25px 25px 0px 0px" }}>Worked At:</h3>
      {data.map((ele, index) => (
        <ListGroup.Item key={index} action href={ele.companyPage}>
          {ele.company}
        </ListGroup.Item>
      ))}
    </ListGroup>
  );
};

const About = (props) => {
  const data = props.data;
  const dg = data.gender;
  const gender =
    dg && dg[0]
      ? dg[0].includes("Male")
        ? "Male"
        : dg[0].includes("Female")
        ? "Female"
        : "Unknown"
      : "Unknown";

  console.log(data);
  if (!data) {
    return <div></div>;
  }
  return (
    <ListGroup
      as="ul"
      className="col-sm-6"
      style={{ paddingLeft: "20px", paddingRight: "20px" }}
    >
      <h3 style={{ padding: "25px 25px 0px 0px" }}>About:</h3>
      <ListGroup.Item variant="light">
        <strong>Gender:</strong> {gender}
      </ListGroup.Item>
      <ListGroup.Item variant="light">
        <strong>Location:</strong> {data.location}
      </ListGroup.Item>
      <ListGroup.Item variant="light">
        <strong>Places Lived:</strong> {data.lived}
      </ListGroup.Item>
      {/* <ListGroup.Item>{data.relationship}</ListGroup.Item> */}
      <ListGroup.Item variant="light">
        <strong>About:</strong> {data.summary}
      </ListGroup.Item>
    </ListGroup>
  );
};

const capitalize = (name) =>
  name
    .split(" ")
    .map((word) => word[0].toUpperCase() + word.slice(1, word.length))
    .join(" ");

const Title = (props) => {
  return (
    <h1
      className="text-center"
      style={{
        backgroundColor: "#111",
        color: "white",
        padding: "25px",
        margin: "0px",
      }}
    >
      {capitalize(props.name)}
    </h1>
  );
};

class ProfilePic extends React.Component {
  parseData = (data) => {
    const n = data.posts
      .map((post) => {
        const cp = post.postActivity ? post.postActivity.caption : "";
        return { photo: post.filename, caption: cp };
      })
      .filter((ele) => (ele.photo ? true : false));
    if (data.url.length > 0) {
      n.push({ photo: data.url[0], caption: data.headline });
    }

    return (
      <Carousel>
        {n.map((ele, index) => (
          <Carousel.Item
            style={{ backgroundColor: "black" }}
            key={index}
            className="text-center"
          >
            <img
              className="d-flex"
              style={{ height: "500px" }}
              src={process.env.PUBLIC_URL + "/" + ele.photo.replace(" ", "_")}
              alt="Profile pic"
            />
            <Carousel.Caption>
              <p>{ele.caption}</p>
            </Carousel.Caption>
          </Carousel.Item>
        ))}
      </Carousel>
    );
  };
  render() {
    return <div>{this.parseData(this.props.photodata)}</div>;
  }
}

class Results extends React.Component {
  render() {
    console.log(this.props.data[0]);
    console.log(flatten(this.props.data[0]));
    const data = this.props.data[0];
    const ret = flatten(this.props.data[0]);
    return (
      <section style={{ marginBottom: "40px" }}>
        <Title name={data.name} />
        <ProfilePic
          photodata={{
            headline: data.headline,
            url: data.photos,
            posts: data.posts,
          }}
        />
        <About data={data.about} />
        <Experience experience={data.experience} />
        <Education education={data.education} />
        <Skills skills={data.skills} />
        <People
          data={{
            posts: data.posts,
            skills: data.skills,
            friends: data.friends,
          }}
        />
        <Likes likes={data.likes} />
      </section>
    );
  }
}

export { Results };
