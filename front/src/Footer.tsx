import * as React from 'react'
import { Link } from 'react-router-dom'
import './Footer.scss'

interface FooterProps {
}

interface FooterState {

}

class Footer extends React.Component<FooterProps, FooterState> {
  public render() {
    return (
      <div className="footer">
        <Link to="https://github.com/notesclub/notesclub">Developers</Link>
        {" · "}
        <Link to="/terms">Terms</Link>
        {" · "}
        <Link to="/privacy">Privacy</Link>
      </div>
    )
  }
}

export default Footer
