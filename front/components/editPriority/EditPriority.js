import React, { useState } from 'react'
import RegularButton from '../CustomButtons/Button'

const EditPriority = props => {
    const [value,setValue]= useState(props.currentPriority);
  return (
    <div>
        <input value={value} width="10" maxLength={2} onChange={(e)=>{setValue(e.target.value)}} size="2"/>
        <RegularButton onClick={()=>{props.submitPriority(props.id,value)}} color="info">שמור</RegularButton>
    </div>
  )
}

export default EditPriority