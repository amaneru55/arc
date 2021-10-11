import React from 'react'
import style from './style.module.scss'

interface IProps {
  msg?: string;
  [key: string]: unknown;
}

const Greeting: React.FC<IProps> = (
  {
    msg = 'Greeting!'
  }
): React.ReactElement => {
  return (
    <div className={[style.container].join(' ')}>
      <p>{msg}</p>
    </div>
  )
}

export default Greeting
