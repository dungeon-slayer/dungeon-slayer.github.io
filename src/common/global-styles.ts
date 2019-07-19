import { injectGlobal } from 'styled-components'

// tslint:disable-next-line
injectGlobal`
  html {
    height: auto;
  }

  body {
    background-color: rgba(119, 199, 199, 0.4);
    height: 100%;
    color: #033649;
    font-family: Courier, 'Lucida Sans Typewriter', 'Lucida Typewriter', monospace; 
    letter-spacing: -0.5px;
  }

  #root {
    height: 100%;
  }
`
