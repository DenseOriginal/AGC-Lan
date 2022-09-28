import React from 'react'
import { isStaff } from '../helpers/staff';
import "../styles/components/header.scss"

interface UIState {
}

interface Props {
}

export class Header extends React.Component<Props, UIState> {

  state: UIState = {
  }

  render() {
	const user = window.user;

	return (
	  <>
			{user && !user.setup_finished && <span className="setup-banner">
				<div className="inner">
				Vi mangler stadig lidt information omkring dig, <a href="/profile/setup">Klik her</a> for at færdig gøre din bruger
				</div>
			</span>}

			<header>

				<div className="logo">
				<a href="/">
					<img className="logo-img" height="28" src="/images/logo/pill.png" alt="AG Lan logo" />
				</a>
				</div>

				<nav className="large">
				<a href="/faq">Information</a>
				<a href="/kalender">Kalender</a>
				<a href="/lan/list" id="lan">Lan</a>

				<a href="/staff">Staff</a>

				{user ?
					<>
						<div className="spacer"></div>
						<div className="dropdown-container">
						<a className="user" href="/profile">
							<img className="avatar" height="28" src={user.picture_url} alt="Profile image" />
							<p><span>{ removeDiscriminator(user.username) }</span></p>
						</a>

						<div className="dropdown">
							<a href="/logout" className="flex-space-between">Log ud <i className="fas fa-sign-out-alt"></i></a>
						</div>
						</div>
					</>
					: <>
						<div className="spacer"></div>
						<a className="user" href="/login">Login</a>
					</>
				}
				</nav>

				<nav className="small">
				<input type="checkbox" name="is-open" id="is-open" />
				<div className="container">
					<div className="inner">

					<a href="/faq">Information</a>
					<a href="/kalender">Kalender</a>
					<a href="/lan/list">Lan</a>

					{isStaff(user) && <a href="/staff">Staff</a>}

					<div className="spacer"></div>

					{user &&
						<a className="user" href="/profile">
						<img className="avatar" height="28" src={user.picture_url} alt="Profile image" />
						<p>{ user.username }</p>
						</a>
					}
					{!user && <a className="user" href="/login">Login</a>}

					<label htmlFor="is-open" className="close"><i className="fas fa-chevron-up"></i></label>
					</div>
				</div>

				<a className="open-nav"><label htmlFor="is-open">
					<span>Menu</span>
					<i className="fas fa-bars"></i>
				</label></a>
				</nav>
			</header>
	  </>
	)
  }
}

const removeDiscriminator = (str: string) =>
	/#\d{4}$/.test(str) ? str.slice(0, -5) : str;