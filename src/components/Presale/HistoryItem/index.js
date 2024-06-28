import React, { useEffect, useState } from 'react'

import {
  HistoryItemContainer
} from './styles'

import {
  CopySVG
} from '../../SvgIcons'

import METISPNG from '../../../assets/images/METIS.png'
import { useGlobal } from '../../../contexts/GlobalContext'

export const HistoryItem = (props) => {

  // item = { amount, blockNumber, depositor, timestamp, tokenAddress }

  const { copyToClipboard } = useGlobal()
  const { item } = props;
  const [when, setWhen] = useState('')
  const [blockNumber, setBlockNumber] = useState(0)
  const [depositor, setDepositor] = useState('')
  const [amount, setAmount] = useState(0)
  const [tokenAddress, setTokenAddress] = useState(0)

  useEffect(() => {
    setBlockNumber(item.blockNumber)
    let date = new Date(item.timestamp * 1000);

    let ds = date.toString();
    let dsRet = ds.split(' ');
    setWhen(`${dsRet[3]} ${dsRet[4]} ${dsRet[0]} ${dsRet[1]} ${dsRet[2]}`);
    setDepositor(item.depositor)
    setAmount(item.amount)
    setTokenAddress(item.tokenAddress)
  }, [item])

  const handleCopyAddress = (addr) => {
    copyToClipboard(addr);
  }

  return (
    <HistoryItemContainer>
      <div className='item-frame-1'>
        <div className='block-number'>
          <a href={`https://andromeda-explorer.metis.io/block/${blockNumber}/transactions`} rel='noreferrer' target='_blank'>
            {blockNumber}
          </a>
        </div>
        <div className='block-timestamp'>{when}</div>
      </div>
      <div className='item-frame-1'>
        <div className='depositor'>
          {depositor}
          <div className='copy-address' onClick={() => handleCopyAddress(depositor)}>
            <CopySVG width='18px' />
          </div>
        </div>
        <div className='deposit-amount'>
          <img src={METISPNG} alt='' width='24px' />
          {amount} METIS
        </div>
      </div>
      {
        tokenAddress !== '0x0000000000000000000000000000000000000000' ?
          <div className='token-address'>
            For {tokenAddress}
            <div className='copy-address' onClick={() => handleCopyAddress(tokenAddress)}>
              <CopySVG width='18px' />
            </div>
          </div>
          :
          <></>
      }
    </HistoryItemContainer>
  )
}
