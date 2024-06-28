import React, { useState } from 'react'

import {
  HomeContainer,
  BackgroundImageContainer
} from './styles'

import { SideBar } from '../SideBar'
import { RightPane } from '../RightPane'
import { useWindowSize } from '../../hooks/useWindowSize'

export const Home = (props) => {
  const w = useWindowSize()

  const [sideBarVisible, setSideBarVisible] = useState(false);

  const handleSideBarShow = () => {
    if (w.width < 864) {
      setSideBarVisible(t => !t);
    }
  }

  return (
    <HomeContainer>
      <BackgroundImageContainer>
        <div className='back1'></div>
        <div className='custom'></div>
      </BackgroundImageContainer>

      <SideBar visible={sideBarVisible} close={() => setSideBarVisible(false)}/>
      <RightPane handleSideBarShow={handleSideBarShow}/>
    </HomeContainer>
  )
}
