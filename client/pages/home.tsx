import React from "react";
import { Link } from "react-router-dom"

export class HomePage extends React.Component<{}> {
  render() {
    return (
      <>
        <p>Hello</p>
        <Link to="/login">Login</Link>
      </>
    )
  }
}