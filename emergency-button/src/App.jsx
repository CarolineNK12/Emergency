import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'
import Footer from './assets/footer.jsx'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <section id="center">
        <div>
          <h1>EMERGENCY BUTTON</h1>
          <p>
            someone put the carousel here!!!!!!!!!!!
          </p>
        </div>
        <div>
          <a href="tel:+62112" className="sosbutton">
            CALL
          </a>
        </div>
      </section>
      <div className="ticks"></div>
      <section id="spacer"></section>
      <Footer />
    </>
  )
}

export default App
