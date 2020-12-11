import React from "react";
import Slide from '@material-ui/core/Slide';

import "./about.scss";

/* eslint-disable-next-line */
export interface AboutProps {}

export default function About(props: AboutProps) {
  return (
    <Slide direction="down" in={true} mountOnEnter unmountOnExit>
      <div>
        <h1>Welcome to about!</h1>
      </div>
    </Slide>
  );
}
