import React from "react";

export default class LoginPage extends React.Component<{}> {
  render() {
    return (
      <div className="login">
        <div className="inner">
          <a href="/api/login" className="button">Login med Discord</a>
          <p>Af sikkerhedsgrunde er det kun muligt at logge ind ved hjælp af en Discord bruger. Hvis du ikke har en Discord konto opfordres du til at oprette en <a href="https://discord.com/register">her</a></p>
        </div>
      </div>
    )
  }
}