import React, { useState, useEffect, useCallback } from 'react'

import {
  AccountContainer
} from './styles'

import { AccountItemInfo } from './AccountItemInfo'
import { AccountItemInfo2 } from './AccountItemInfo2'
import { useContract } from '../../contexts/ContractContext'
import { useCustomWallet } from '../../contexts/WalletContext'
import { useGlobal } from '../../contexts/GlobalContext'
import useToast from '../../hooks/useToast'
import { SmallButton } from '../SmallButton'
import useToken from '../../hooks/useToken'

export const Account = (props) => {

  const { stringFormat } = useGlobal()
  const { tokenPrice, lastRebased, timeTick, myBalance, myBalanceUSD, maxTokenPerWallet, exempt, ethPrice, rebasePeriod, rebaseRate, symbol } = useToken()

  const [remainingTime, setRemainingTime] = useState('')

  const [apyNow, setAPYNow] = useState(0)
  const [dailyROI, setDailyROI] = useState(0)
  const [nextRewardAmount, setNextRewardAmount] = useState(0)
  const [nextRewardAmountUSD, setNextRewardAmountUSD] = useState(0)
  const [nextRewardPercentage, setNextRewardPercentage] = useState(0)

  const [reward1Day, setReward1Day] = useState(0)
  const [reward1DayUSD, setReward1DayUSD] = useState(0)
  const [reward5Day, setReward5Day] = useState(0)
  const [reward5DayUSD, setReward5DayUSD] = useState(0)

  const [rewardRate5Days, setRewardRate5Days] = useState(0)

  useEffect(() => {
    setNextRewardAmountUSD(tokenPrice * nextRewardAmount);
  }, [nextRewardAmount, tokenPrice])

  useEffect(() => {
    setReward1DayUSD(tokenPrice * reward1Day);
  }, [reward1Day, tokenPrice])

  useEffect(() => {
    setReward5DayUSD(tokenPrice * reward5Day);
  }, [reward5Day, tokenPrice])

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

        let _rebaseRate = 0;
        // if (now > initRebasedOrg + 7 * 365 * 24 * 86400) {
        //   _rebaseRate = 2;
        // } else if (now >= initRebasedOrg + (15 * 365 * 24 * 86400 / 10)) {
        //   _rebaseRate = 14;
        // } else if (now >= initRebasedOrg + 365 * 24 * 86400) {
        //   _rebaseRate = 211;
        // } else
        {
          _rebaseRate = rebaseRate * 10000000;
        }

        let rebaseTimesPerDay = 96;
        if (rebasePeriod > 0) {
          rebaseTimesPerDay = 86400 / rebasePeriod;
        }

        let exp = 1 + _rebaseRate / 10000000;
        setAPYNow((Math.pow(exp, rebaseTimesPerDay * 365) - 1) * 100);
        setDailyROI((Math.pow(exp, rebaseTimesPerDay) - 1) * 100);

        setNextRewardAmount(myBalance * (exp - 1));
        setNextRewardPercentage((exp - 1) * 100);

        setReward1Day((Math.pow(exp, rebaseTimesPerDay) - 1) * myBalance);
        setReward5Day((Math.pow(exp, rebaseTimesPerDay * 5) - 1) * myBalance);

        setRewardRate5Days((Math.pow(exp, rebaseTimesPerDay * 5) - 1) * 100)

        setTimeout(() => recursive_run(ac), 1000);
      }
    }

    recursive_run(ac);

    return () => ac.abort();
  }, [timeTick, lastRebased, rebasePeriod, rebaseRate, myBalance])

  return (
    <AccountContainer>
      <div className='top-frame'>
        <div className='summary-frame'>
          <div className='p3-frame info-frame'>
            <AccountItemInfo label='Your Balance' text={`$${stringFormat(myBalanceUSD.toFixed(2))}`} detail={`${stringFormat(myBalance.toFixed(2))} ${symbol}`} ww='30%' />
          </div>
          <div className='p3-frame info-frame'>
            < AccountItemInfo label='APY' text={`${stringFormat(apyNow.toFixed(2))}%`} detail={`Daily ROI ${stringFormat(dailyROI.toFixed(2))}%`} ww='30%' />
          </div>
          <div className='p3-frame info-frame'>
            <AccountItemInfo label='Next Rebase' text={`${remainingTime}`} detail='You will earn money soon' ww='30%' />
          </div>
        </div>

        <div className='summary-frame-col info-frame'>
          <AccountItemInfo2 label='Max wallet limit' detail={exempt === true ? 'INFINITE' : `${stringFormat(maxTokenPerWallet.toFixed(2))} ${symbol}`} />
        </div>

        <div className='summary-frame-col info-frame'>
          <AccountItemInfo2 label={`Current ${symbol} Price`} detail={`$${stringFormat(tokenPrice.toFixed(4))}`} />
          <AccountItemInfo2 label='Next Reward Amount' detail={`${stringFormat(nextRewardAmount.toFixed(2))} ${symbol}`} />
          <AccountItemInfo2 label='Next Reward Amount USD' detail={`$${stringFormat(nextRewardAmountUSD.toFixed(2))}`} />
          <AccountItemInfo2 label='Next Reward Yield' detail={`${parseFloat(stringFormat(nextRewardPercentage.toFixed(5)))}%`} />
          <AccountItemInfo2 label='ROI(1-Day Rate) USD' detail={`$${stringFormat(reward1DayUSD.toFixed(4))}`} />
          <AccountItemInfo2 label='ROI(5-Day Rate)' detail={`${parseFloat(stringFormat(rewardRate5Days.toFixed(4)))}%`} />
          <AccountItemInfo2 label='ROI(5-Day Rate) USD' detail={`$${stringFormat(reward5DayUSD.toFixed(4))}`} />
        </div>
      </div>
    </AccountContainer>
  )
}
