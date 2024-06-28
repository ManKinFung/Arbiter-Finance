import React, { useState, useEffect, useCallback } from 'react'

import {
  SwapContainer
} from './styles'

import { useContract } from '../../contexts/ContractContext'
import { useCustomWallet } from '../../contexts/WalletContext'
import useToast from '../../hooks/useToast'
import { SmallButton } from '../SmallButton'

import TokenPNG from '../../assets/images/mark.png'
import ETHPng from '../../assets/images/eth.png'
import SwapPng from '../../assets/images/swap.png'
import useToken from '../../hooks/useToken'
import ADDRESS from '../../contexts/ContractContext/address'
import { useGlobal } from '../../contexts/GlobalContext'

export const Swap = (props) => {

  const { wallet } = useCustomWallet()
  const { chainId } = useGlobal()
  const { tokenToETH, ethToToken, approveToken, refreshPages, sellToken, buyToken } = useContract()
  const { showLoading, hideLoading, toastSuccess, toastError } = useToast()

  const { myBalance, myBalanceETH, tokenApprovedAmount, symbol } = useToken()

  const [showApprove, setShowApprove] = useState(0)

  const [info, setInfo] = useState('Please input the amount')
  const [txRes, setTxRes] = useState('')

  const [isSelling, setIsSelling] = useState(true)
  const [tokenAmount, setTokenAmount] = useState('')
  const [ethAmount, setETHAmount] = useState('')

  useEffect(() => {
    setShowApprove(isSelling === true && myBalance > tokenApprovedAmount);
  }, [isSelling, myBalance, tokenApprovedAmount])

  const [tokenInputAC, setTokenInputAC] = useState(new AbortController())

  const handleTokenInput = useCallback((t) => {
    setTokenAmount(t)

    let am = parseFloat(t)

    if (t === '') {
      setETHAmount('')
      setInfo('')
    } else if (isNaN(am)) {
      setInfo(`Invalid ${symbol} Amount`)
    } else {
      tokenInputAC.abort()
      let ac = new AbortController()
      setTokenInputAC(ac)

      tokenToETH(am)
        .then(um => {
          if (ac.signal.aborted === false) {
            if ((isSelling === true && am > myBalance) || (isSelling !== true && um > myBalanceETH)) {
              setInfo(`Insufficient ${symbol} Balance`);
            } else {
              setETHAmount(um.toString())
              setInfo('')
            }
          } else {
            console.log('token -> eth: aborted')
          }
        })
        .catch(err => {
          setInfo(err.message)
          console.log(err.message)
        })
      return () => ac.abort()
    }

  }, [tokenAmount, symbol, isSelling, myBalance, myBalanceETH, tokenToETH, tokenInputAC])

  const [ethInputAC, setETHInputAC] = useState(new AbortController())

  const handleETHInput = useCallback((t) => {
    setETHAmount(t)
    const am = parseFloat(t)

    if (t === '') {
      setTokenAmount('')
      setInfo('')
    } else if (isNaN(am)) {
      setInfo('Invalid ETH Amount')
    } else {
      ethInputAC.abort()
      let ac = new AbortController()
      setETHInputAC(ac)

      ethToToken(am)
        .then(um => {
          if (ac.signal.aborted === false) {
            if ((isSelling !== true && am > myBalanceETH) || (isSelling === true && um > myBalance)) {
              setInfo('Insufficient ETH Balance')
            } else {
              setTokenAmount(um.toString())
              setInfo('')
            }
          } else {
            console.log('eth -> token: aborted')
          }
        })
        .catch(err => {
          setInfo(err.message)
          console.log(err.message)
        })
    }
  }, [ethAmount, symbol, isSelling, myBalanceETH, myBalance, ethToToken, ethInputAC])

  const handleMyBalance = useCallback(() => {
    if (isSelling) {
      handleTokenInput(myBalance.toString());
    } else {
      handleETHInput(myBalanceETH.toString());
    }
  }, [myBalance, myBalanceETH, isSelling, handleTokenInput, handleETHInput])

  const handleApproveToken = useCallback(() => {
    showLoading(`Approving ${symbol} for Router...`);

    approveToken(ADDRESS[chainId].token, ADDRESS[chainId].router)
      .then(r => {
        setTxRes(r.transactionHash)
        refreshPages()
        toastSuccess('ArbiSwap', 'Approved Successfully');
        hideLoading()
      })
      .catch(err => {
        toastError('ArbiSwap', `${err.message}`)
        hideLoading()
      })
  }, [showLoading, symbol, approveToken, refreshPages, toastSuccess, hideLoading, toastError, chainId])

  const handleSellToken = useCallback(() => {
    if (info !== '') {
      toastError('Please fix this error first', info);
      return;
    }

    showLoading(`Selling ${tokenAmount} ${symbol}...`);

    sellToken(tokenAmount)
      .then(r => {
        setTxRes(r.transactionHash);
        refreshPages();
        toastSuccess('ArbiSwap', 'Sold successfully');
        hideLoading();
      })
      .catch(err => {
        toastError('ArbiSwap', `${err.message}`);
        hideLoading();
      })
  }, [toastError, showLoading, tokenAmount, sellToken, refreshPages, toastSuccess, hideLoading, info, symbol])

  const handleBuyToken = useCallback(() => {
    if (info !== '') {
      toastError('Please fix this error first', info);
      return;
    }

    showLoading(`Buying ${symbol} by ${ethAmount} ETH...`);

    buyToken(ethAmount)
      .then(r => {
        setTxRes(r.transactionHash);
        refreshPages();
        toastSuccess('ArbiSwap', 'Bought successfully');
        hideLoading();
      })
      .catch(err => {
        toastError('ArbiSwap', `${err.message}`);
        hideLoading();
      })
  }, [info, showLoading, ethAmount, buyToken, refreshPages, toastSuccess, hideLoading, toastError, symbol])

  return (
    <SwapContainer>
      <div className='top-frame'>
        <div className='reflection-frame'>
          <div className='reflection-caption'>Buy / Sell {symbol}</div>
        </div>
        <div className='summary-frame-col info-frame'>
          <div style={{
            display: 'flex',
            flexDirection: isSelling === true ? 'column' : 'column-reverse',
            position: 'relative',
            marginTop: '20px',
            gap: '10px'
          }}>
            <div className='my-balance-amount' onClick={handleMyBalance}>{isSelling ? `My ${symbol} balance ${parseFloat(myBalance.toFixed(4))}` : `My ETH balance ${parseFloat(myBalanceETH.toFixed(4))}`}</div>
            <div className='item-input-frame'>
              <div className='item-label'>
                <img src={TokenPNG} alt='' width='24px' />
                <p>{symbol}</p>
              </div>
              <div className='item-input item-decor-1'>
                <input type='text' placeholder={tokenApprovedAmount > 10000000000000 ? 'approved: unlimited' : `approved ${tokenApprovedAmount} ${symbol}`} value={tokenAmount} onChange={e => handleTokenInput(e.target.value)} />
              </div>
            </div>

            <div className='item-input-frame'>
              <div className='button-frame' onClick={() => { setIsSelling(t => !t) }}>
                <img src={SwapPng} alt='' width='24px' />
              </div>
            </div>

            <div className='item-input-frame'>
              <div className='item-label'>
                <img src={ETHPng} alt='' width='24px' />
                <p>ETH</p>
              </div>
              <div className='item-input item-decor-2'>
                <input type='text' placeholder='approved unlimited' value={ethAmount} onChange={e => handleETHInput(e.target.value)} />
              </div>
            </div>
          </div>

          <div className='button-input-frame'>
            <div className='swap-button-frame'>
              {showApprove === true && <SmallButton caption='Approve' handleClick={handleApproveToken} />}
              <button onClick={() => isSelling === true ? handleSellToken() : handleBuyToken()}>{isSelling === true? 'Sell': 'Buy'}</button>
            </div>
          </div>
        </div>
        <div className='summary-frame-col info-frame'>
          <div className='error-frame'>{info}</div>
        </div>
        {txRes && <div className='summary-frame-col info-frame'>
          <div className='error-frame'>
            Your transaction hash: <a href={`https://andromeda-explorer.metis.io/tx/${txRes}`} rel='noreferrer' target='_blank'>{txRes.slice(0, 8)}...{txRes.slice(-6)}</a>
          </div>
        </div>}
      </div>
    </SwapContainer>
  )
}
