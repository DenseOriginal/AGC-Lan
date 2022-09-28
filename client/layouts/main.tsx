import React from 'react'
import { Header } from '../components/header'
import "../styles/layout.main.scss"

interface UIState {
}

interface Props {
  children: React.ReactNode
}

export class LayoutMain extends React.Component<Props, UIState> {

  state: UIState = {
  }

  render() {
    return (
      <>
        <Header />

        <main className="page">
          <div className="inner">
            {this.props.children}
          </div>
        </main>
      </>
    )
  }
}
