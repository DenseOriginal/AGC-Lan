import React from "react";
import { Link } from "react-router-dom"
import { LayoutMain } from "../layouts/main";

export class HomePage extends React.Component<{}> {
  render() {
    return (
      <LayoutMain>
        <p>Hello</p>
        <Link to="/login">Login</Link>
      </LayoutMain>
    )
  }
}