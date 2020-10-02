import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'
import * as serviceWorker from './serviceWorker'
import '../node_modules/bootstrap/dist/css/bootstrap.min.css'
import ReCAPTCHA from "react-google-recaptcha"
import { recaptchaRef } from './utils/recaptchaRef'
// const captchaOnChange = (value: string | null) => {
//   console.log("Captcha value:", value);
// }

ReactDOM.render(
  <ReCAPTCHA
    ref={recaptchaRef}
    size="invisible"
    sitekey={process.env.REACT_APP_NOTESCLUB_RECAPTCHA_KEY as string}
    // onChange={captchaOnChange}
  >
    <App />
  </ReCAPTCHA>, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
