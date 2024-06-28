import React, { useCallback, useEffect, useRef, useState } from 'react'
import {
  SideBarContainer
} from './styles'

import LogoPNG from '../../assets/images/mark.png'
import ADDRESSES from '../../contexts/ContractContext/address'
import walletConfig from '../../contexts/WalletContext/config'

import {
  DashboardSVG,
  AccountSVG,
  SwapSVG,
  PresaleSVG,
  DocsSVG,
  TwitterSVG,
  TelegramSVG,
  LaunchPadSVG
} from '../SvgIcons'

import { MenuItem } from './MenuItem'
import { useCustomWallet } from '../../contexts/WalletContext'
import { useWindowSize } from '../../hooks/useWindowSize'
import { useGlobal } from '../../contexts/GlobalContext'

export const SideBar = (props) => {

  const w = useWindowSize();
  const { visible, close } = props;
  const { chainId } = useGlobal()

  const thisInst = useRef();

  const { wallet } = useCustomWallet();
  const [selectMenu, setSelectMenu] = useState(0);

  const isLoggedIn = () => {
    return wallet.address !== '';
  }

  const handleClick = (t) => {
    setSelectMenu(t);

    if (w.width < 864) {
      close && close();
    }
  }

  const handleClickOutside = useCallback((e) => {
    const outSideMenu = !thisInst.current?.contains(e.target)

    if (outSideMenu && w.width < 864 && thisInst.current?.offsetLeft === 0) {
      close && close();
    }
  }, [close, w.width])

  useEffect(() => {
    window.addEventListener('click', handleClickOutside)
    return () => window.removeEventListener('click', handleClickOutside)
  }, [handleClickOutside])

  return (
    <SideBarContainer show={visible === true? '1': '0'} ref={thisInst}>
      <div className='logo-frame'>
        <img src={LogoPNG} alt='' width='80px' />
      </div>
      {
        isLoggedIn() === true ? <a href={`${walletConfig[chainId].blockUrls[0]}address/${wallet.address}`} rel='noreferrer' className='account-frame' target='_blank'>{wallet.address.slice(0, 6) + '...' + wallet.address.slice(-5)}</a> : <></>
      }

      <MenuItem icon={<DashboardSVG width='20px' height='20px' />} text='Dashboard' link='/dashboard' handleClick={() => handleClick(1)} selected={selectMenu === 1}/>
      <MenuItem icon={<AccountSVG width='20px' height='20px' />} text='Account' link='/account' handleClick={() => handleClick(2)} selected={selectMenu === 2}/>
      <MenuItem icon={<SwapSVG width='17px' height='19px' />} text='ArbiSwap' link='/arbiswap' handleClick={() => handleClick(3)} selected={selectMenu === 3}/>
      <MenuItem icon={<SwapSVG width='17px' height='19px' />} text='SushiSwap' link={`https://app.sushi.com/swap?inputCurrency=ETH&outputCurrency=${ADDRESSES[chainId].token}&chainId=${chainId}`} external handleClick={() => handleClick(4)} selected={selectMenu === 4}/>
      <MenuItem icon={<DocsSVG width='16px' height='19px' />} text='Docs' link='https://arbiter-finance.gitbook.io/arbiter-finance/' external handleClick={() => handleClick(5)} selected={selectMenu === 5}/>

      <div className='footer-frame'>
        <MenuItem icon={<TwitterSVG width='28px' height='28px' />} link='https://twitter.com/' external small handleClick={() => handleClick(0)}/>
        <MenuItem icon={<TelegramSVG width='24px' height='24px' />} link='https://t.me/ArbiterOfficial' external small handleClick={() => handleClick(0)}/>
      </div>
    </SideBarContainer>
  )
}
