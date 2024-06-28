import React from 'react'

import {
  Route,
  Routes,
  useLocation
} from 'react-router-dom'

import {
  RightPaneContainer
} from './styles'

import { TransitionGroup } from 'react-transition-group'
import { SmallButton } from '../SmallButton'
import { MobileMenu } from './MobileMenu'
import { Dashboard } from '../Dashboard'
import { Account } from '../Account'
import { Swap } from '../Swap'

import ADDRESSES from '../../contexts/ContractContext/address'

import useToast from '../../hooks/useToast'
import { useCustomWallet } from '../../contexts/WalletContext'
import { CSSTransition } from 'react-transition-group'
import { useGlobal } from '../../contexts/GlobalContext'

export const RightPane = (props) => {

  const { handleSideBarShow } = props;

  const location = useLocation();
  const { chainId } = useGlobal()

  const { connectWallet, disconnectWallet, wallet } = useCustomWallet();
  const { toastError } = useToast();

  const handleBuyToken = () => {
    window.open(`https://app.sushi.com/swap?inputCurrency=ETH&outputCurrency=${ADDRESSES[chainId].token}&chainId=${chainId}`, '_blank')
  }

  const handleAddTokenToWallet = async () => {
    if (window.ethereum === undefined) {
      toastError('Add token', 'Not defined Metamask')
      return;
    }

    const tokenAddress = ADDRESSES[chainId].token;
    const tokenSymbol = '$ARBITER';
    const tokenDecimals = 5;
    const tokenImage = '';

    try {
      // wasAdded is a boolean. Like any RPC method, an error may be thrown.
      // const wasAdded = 
      await window.ethereum.request({
        method: 'wallet_watchAsset',
        params: {
          type: 'ERC20', // Initially only supports ERC20, but eventually more!
          options: {
            address: tokenAddress, // The address that the token is at.
            symbol: tokenSymbol, // A ticker symbol or shorthand, up to 5 chars.
            decimals: tokenDecimals, // The number of decimals in the token
            image: tokenImage, // A string url of the token logo
          },
        },
      });

      // if (wasAdded) {
      //   await toastSuccess('Metamask', 'Token added')
      // } else {
      //   await toastError('Metamask', 'Already exists')
      // }
    } catch (error) {
      await toastError('Metamask', `${error.message}`)
    }
  }

  const menuItems = [
    { id: 0, name: 'Buy on SUSHI', handler: () => { handleBuyToken() } },
    { id: 1, name: 'Add To MetaMask', handler: () => { handleAddTokenToWallet() } },
  ]

  const isLoggedIn = () => {
    return wallet.address !== '';
  }

  return (
    <RightPaneContainer>
      <div className='background-effect'>
        <div className='radial-gradient'></div>
      </div>
      <div className='section-frame'>
        <div className='button-frame'>
          <div className='left-pane-button-frame'>
            <div className='left-pane-button' onClick={handleSideBarShow}>
              <div className='mid-bar'></div>
            </div>
          </div>
          <div className='another-small-group'>
            <MobileMenu items={menuItems} />
          </div>
          <SmallButton caption={isLoggedIn() ? `Logout ${wallet.address.slice(0, 6) + '...' + wallet.address.slice(-5)}` : 'Connect Wallet'}
            handleClick={() => isLoggedIn() ? disconnectWallet() : connectWallet()} />
        </div>
      </div>
      <div className='route-frame'>
        <TransitionGroup>
          <CSSTransition
            timeout={500}
            classNames='fade'
            key={location.key}
          >
            <div className='route-transition-element'>
              {
                isLoggedIn()? 
                <Routes location={location}>
                <Route exact path='/' element={<Dashboard />}></Route>
                <Route exact path='/dashboard' element={<Dashboard />}></Route>
                <Route exact path='/account' element={<Account />}></Route>
                <Route exact path='/arbiswap' element={<Swap />}></Route>
              </Routes>
              :
              <div className='wallet-connect-frame'>Please connect to the wallet</div>
              }
            </div>
          </CSSTransition>
        </TransitionGroup>
      </div>
    </RightPaneContainer>
  )
}
