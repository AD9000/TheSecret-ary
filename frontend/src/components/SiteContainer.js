import React from "react";
import { Header } from "./Header";
import { NameForm } from "./Form";

const SiteContainer = () => {
  return (
    <section
      className="pagination-centered align-middle"
      style={{ height: "100%" }}
    >
      <NameForm />
    </section>
  );
};

export { SiteContainer };
