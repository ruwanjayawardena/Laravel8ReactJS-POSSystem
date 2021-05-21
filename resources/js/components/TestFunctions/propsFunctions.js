import React from 'react'

function propsFunctions() {
  if (typeof props.n2 === 'undefined') {
    props.n2 = 0
  }
  return (
    <div>
      {props.n1} + {props.n2} = {props.n1 + props.n2}
    </div>
  )
}

export default propsFunctions

