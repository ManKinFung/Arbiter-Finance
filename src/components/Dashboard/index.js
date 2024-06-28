import React, { useEffect, useState } from 'react'

import {
  DashboardContainer
} from './styles'

import { DashboardItemInfo } from './DashboardItemInfo'
import { useContract } from '../../contexts/ContractContext'
import { useGlobal } from '../../contexts/GlobalContext'
import ADDRESS from '../../contexts/ContractContext/address'
import useToken from '../../hooks/useToken'

export const Dashboard = (props) => {
  const { stringFormat } = useGlobal()
  const { symbol, tokenPrice, circulatingSupply, total, marketCap, lastRebased, timeTick, treasury, treasuryUSD, 
    poolBalance, poolBalanceUSD, buyback, buybackBalanceUSD, firePitAddress, firePitBalance, firePitBalanceUSD, firePitPercentage, 
    rebaseRate, rebasePeriod} = useToken()

  const [remainingTime, setRemainingTime] = useState(0)

  useEffect(() => {
    let ac = new AbortController();

    const recursive_run = (ac) => {
      if (ac.signal.aborted === false) {
        let now1 = (new Date()).getTime() / 1000;
        let now = ~~now1;

        let torg = (now - timeTick) + lastRebased;
        let period = rebasePeriod;
        let tt = (torg + period - 1) / period;
        let t1 = ~~tt;
        tt = t1 * period - torg;

        // console.log('-----------', timeTick, tt);

        t1 = tt / 60;
        let minutes = ~~t1;
        let seconds = tt - minutes * 60;

        setRemainingTime(`00:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`)

        setTimeout(() => recursive_run(ac), 1000);
      }
    }

    recursive_run(ac);

    return () => ac.abort();
  }, [timeTick, lastRebased, rebasePeriod])

  return (
    <DashboardContainer>
      <div className='top-frame'>
        <div className='summary-frame info-frame'>
          <DashboardItemInfo label='Price' detail={`$${stringFormat(tokenPrice.toFixed(4))}`} ww='30%' />
          <DashboardItemInfo label='Market Cap' detail={`$${stringFormat(marketCap.toFixed(2))}`} ww='30%' />
          <DashboardItemInfo label='Circulating Supply' detail={`${stringFormat(circulatingSupply.toFixed(2))}`} ww='30%' />
          <DashboardItemInfo label='Backed Liquidity' detail='100%' ww='30%' />
          <DashboardItemInfo label='Next Rebase' detail={remainingTime} ww='30%' />
          <DashboardItemInfo label='Total Supply' detail={`${stringFormat(total.toFixed(2))}`} ww='30%' />
        </div>

        <div className='summary-frame'>
          <div className='p2-frame info-frame'>
            <DashboardItemInfo label='Price' detail={`$${stringFormat(tokenPrice.toFixed(4))}`} ww='auto' />
          </div>
          <div className='p2-frame info-frame'>
            <DashboardItemInfo label='Market Value of Treasury Asset' detail={`$${stringFormat(treasuryUSD.toFixed(2))}`} ww='auto' />
          </div>
          <div className='p2-frame info-frame'>
            <DashboardItemInfo label='Pool Value' detail={`$${stringFormat(poolBalanceUSD.toFixed(2))}`} ww='auto' />
          </div>
          <div className='p2-frame info-frame'>
            <DashboardItemInfo label='Buyback Value' detail={`$${stringFormat(buybackBalanceUSD.toFixed(2))}`} ww='auto' />
          </div>

          <div className='p3-frame info-frame'>
            <DashboardItemInfo label='# Value of FirePit' detail={`${stringFormat(firePitBalance.toFixed(2))} ${symbol}`} ww='auto' />
          </div>
          <div className='p3-frame info-frame'>
            <DashboardItemInfo label='$ Value of FirePit' detail={`$${stringFormat(firePitBalanceUSD.toFixed(2))}`} ww='auto' />
          </div>
          <div className='p3-frame info-frame'>
            <DashboardItemInfo label='% FirePit : Supply' detail={`${stringFormat(firePitPercentage.toFixed(2))}%`} ww='auto' />
          </div>
        </div>
      </div>
    </DashboardContainer>
  )
}
