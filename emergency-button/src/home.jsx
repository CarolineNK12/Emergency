import { useState } from 'react'
import './App.css'

function Home() {
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
        <section id="spacer"></section>
        <div>
          <a href="tel:+62112" className="sosbutton">
            CALL
          </a>
        </div>
      </section>
      <div className="ticks"></div>
      <section id="spacer"></section>
    </>
  )
}

export default Home
