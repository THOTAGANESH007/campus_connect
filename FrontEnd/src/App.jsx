import { useState } from 'react'

import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <h1 className='text-5xl text-red-200'>Hello World</h1>
    </>
  )
}

export default App
