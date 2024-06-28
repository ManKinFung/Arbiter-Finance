import React from 'react'
import {
  MobileMenuContainer
} from './styles'

import { SmallButton } from '../../SmallButton';

export const MobileMenu = (props) => {
  const { items } = props;

  return (
    <MobileMenuContainer>
      <SmallButton caption='$ARBITER' handleClick={() => { }} />

      <div className='menu-frame'>
        {
          items.map(t => {
            return (<div key={t.id} className='menu-item' onClick={t.handler}>{t.name}</div>)
          })
        }
      </div>
    </MobileMenuContainer>
  )
}
