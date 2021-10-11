import React from 'react'
import Greeting from '@components/Greeting'

interface IAppProps {
  [key: string]: unknown;
}

const App: React.FC<IAppProps> = (): React.ReactElement => {
  return (
    <>
      <Greeting msg={"Happy Typing!"} />
    </>
  )
}

export default App
