import React, { useState, useEffect, useCallback } from 'react'

import {
  PresaleContainer
} from './styles'

import {
  CopySVG
} from '../SvgIcons'

import MetisPNG from '../../assets/images/METIS.png'

import { useContract } from '../../contexts/ContractContext'
import { useCustomWallet } from '../../contexts/WalletContext'
import { useGlobal } from '../../contexts/GlobalContext'
import useToast from '../../hooks/useToast'
import { SmallButton } from '../SmallButton'
import { HistoryItem } from './HistoryItem'

export const Presale = (props) => {

  const { wallet } = useCustomWallet()
  // const { stringFormat } = useGlobal()
  const { showLoading, hideLoading, toastSuccess, toastError } = useToast();

  const { reloadCounter, getMultiSigners, getTotalWithdrawableAmount, getAllHistoryItem, wethBalanceOf,
    getDepositorCount, getTotalDepositAmount, getAmountToWithdraw, isPresaleWithdrawable, getWithdrawDestination,
    getMinDepositAmount, getMaxDepositAmount,
    presaleDeposit, presaleWithdrawRequest, presaleSignWithdraw, presaleWithdraw } = useContract()

  const { copyToClipboard } = useGlobal()

  const [signers, setSigners] = useState([])
  const [isSigner, setIsSigner] = useState(false)
  const [withdrawableAmount, setWithdrawableAmount] = useState(0)
  const [history, setHistory] = useState([])
  const [filterResult, setFilterResult] = useState([])
  const [depositorCount, setDepositorCount] = useState(0)
  const [totalDepositAmount, setTotalDepositAmount] = useState(0)
  const [amountToWithdraw, setAmountToWithdraw] = useState(0)
  const [addressToWithdraw, setAddressToWithdraw] = useState('')
  const [isWithdrawable, setIsWithdrawable] = useState(false)
  const [myETHBalance, setMyETHBalance] = useState(0)

  const [withdrawAmountInput, setWithdrawAmountInput] = useState('')
  const [withdrawAddressInput, setWithdrawAddressInput] = useState('')

  const [depositAmount, setDepositAmount] = useState('')
  const [minDepositAmount, setMinDepositAmount] = useState(0)
  const [maxDepositAmount, setMaxDepositAmount] = useState(0)

  const [searchText, setSearchText] = useState('')

  useEffect(() => {
    let ac = new AbortController();

    getMultiSigners()
      .then(r => {
        if (ac.signal.aborted === false) {
          let ret = r.filter(t => t.address.toLowerCase() === wallet.address.toLowerCase());
          setIsSigner(ret.length > 0);
          setSigners(r)
        }
      })
      .catch(err => {
        console.log(`${err.message}`)
      })

    getTotalWithdrawableAmount()
      .then(r => {
        if (ac.signal.aborted === false) {
          setWithdrawableAmount(r)
        }
      })
      .catch(err => {
        console.log(`${err.message}`)
      })

    getAllHistoryItem()
      .then(r => {
        if (ac.signal.aborted === false) {
          setHistory(r)
        }
      })
      .catch(err => {
        console.log(`${err.message}`)
      })

    getDepositorCount()
      .then(r => {
        if (ac.signal.aborted === false) {
          setDepositorCount(r)
        }
      })
      .catch(err => {
        console.log(`${err.message}`)
      })

    getTotalDepositAmount()
      .then(r => {
        if (ac.signal.aborted === false) {
          setTotalDepositAmount(r)
        }
      })
      .catch(err => {
        console.log(`${err.message}`)
      })

    getAmountToWithdraw()
      .then(r => {
        if (ac.signal.aborted === false) {
          setAmountToWithdraw(r)
        }
      })
      .catch(err => {
        console.log(`${err.message}`)
      })

    isPresaleWithdrawable()
      .then(r => {
        if (ac.signal.aborted === false) {
          setIsWithdrawable(r)
        }
      })
      .catch(err => {
        console.log(`${err.message}`)
      })

    getWithdrawDestination()
      .then(r => {
        if (ac.signal.aborted === false) {
          setAddressToWithdraw(r)
        }
      })
      .catch(err => {
        console.log(`${err.message}`)
      })

    wethBalanceOf(wallet.address)
      .then(r => {
        if (ac.signal.aborted === false) {
          setMyETHBalance(r)
        }
      })
      .catch(err => {
        console.log(`${err.message}`)
      })

    getMinDepositAmount(wallet.address)
      .then(r => {
        if (ac.signal.aborted === false) {
          setMinDepositAmount(r)
        }
      })
      .catch(err => {
        console.log(`${err.message}`)
      })

    getMaxDepositAmount(wallet.address)
      .then(r => {
        if (ac.signal.aborted === false) {
          setMaxDepositAmount(r)
        }
      })
      .catch(err => {
        console.log(`${err.message}`)
      })

    return () => ac.abort();
  }, [reloadCounter, getMultiSigners, getTotalWithdrawableAmount, getAllHistoryItem, getDepositorCount,
    getTotalDepositAmount, getAmountToWithdraw, isPresaleWithdrawable, getWithdrawDestination, wethBalanceOf,
    getMinDepositAmount, getMaxDepositAmount, wallet.address])

  useEffect(() => {
    if (searchText === '') {
      setFilterResult(history);
    } else {
      if (history.length === 0) {
        setFilterResult([]);
      } else {
        setFilterResult(history.filter(t => {
          return t.blockNumber.toString().includes(searchText) || t.depositor.toLowerCase().includes(searchText.toLowerCase()) || t.amount.toString().includes(searchText) || t.tokenAddress.toLowerCase().includes(searchText.toLowerCase())
        }));
      }
    }
  }, [searchText, history])

  const handleDeposit = useCallback(() => {
    if (depositAmount === '' || parseFloat(depositAmount) === 0.0 || isNaN(parseFloat(depositAmount))) {
      toastError('Presale', 'Please input values');
      return;
    }

    if (parseFloat(depositAmount) > myETHBalance) {
      toastError('Presale', 'No fund in my wallet');
      return;
    }

    showLoading(`Depositing ${depositAmount} METIS...`);
    presaleDeposit(depositAmount)
      .then(() => {
        hideLoading();
        toastSuccess('Presale', 'Deposited successfully');
      })
      .catch(e => {
        hideLoading();
        toastError('Presale', `${e.message}`);
      })
  }, [depositAmount, myETHBalance, presaleDeposit, toastError, showLoading, hideLoading, toastSuccess])

  const handleNewRequest = useCallback(() => {
    if (withdrawAddressInput === '' || parseFloat(withdrawAmountInput) === 0.0) {
      toastError('Presale', 'Please input values');
      return;
    }

    showLoading(`New withdraw request ${withdrawAmountInput} METIS to "${withdrawAddressInput.slice(0, 6) + "..." + withdrawAddressInput.slice(-4)}"...`);
    presaleWithdrawRequest(withdrawAddressInput, withdrawAmountInput)
      .then(() => {
        hideLoading();
        toastSuccess('Presale', 'Requested successfully');
      })
      .catch(e => {
        hideLoading();
        toastError('Presale', `${e.message}`);
      })
  }, [withdrawAddressInput, withdrawAmountInput, presaleWithdrawRequest, toastError, showLoading, hideLoading, toastSuccess])

  const handleSign = useCallback(() => {
    showLoading(`Signing multi-sign withdraw...`);
    presaleSignWithdraw()
      .then(() => {
        hideLoading();
        toastSuccess('Presale', 'Signed successfully');
      })
      .catch(e => {
        hideLoading();
        toastError('Presale', `${e.message}`);
      })
  }, [presaleSignWithdraw, toastError, showLoading, hideLoading, toastSuccess])

  const handleWithdraw = useCallback(() => {
    showLoading(`Withdrawing by multi-sign...`);
    presaleWithdraw()
      .then(() => {
        hideLoading();
        toastSuccess('Presale', 'Withdrawn successfully');
      })
      .catch(e => {
        hideLoading();
        toastError('Presale', `${e.message}`);
      })
  }, [presaleWithdraw, toastError, showLoading, hideLoading, toastSuccess])

  const handleWithdrawAmountInput = (t) => {
    if (t === '') {
      setWithdrawAmountInput('');
      return;
    }

    let flVal = parseFloat(t);
    if (isNaN(flVal)) {
      setWithdrawAmountInput('');
    } else if (flVal > withdrawableAmount) {
      setWithdrawAmountInput(withdrawableAmount.toString());
    } else {
      setWithdrawAmountInput(t);
    }
  }

  return (
    <PresaleContainer>
      <div className='top-frame'>
        {
          isSigner === true ?
            <div className='multi-sign-frame info-frame'>
              <div className='title-bar'>Multi-Sign</div>
              <div className='new-request-frame'>
                <div className='address-input-frame width-address'>
                  <input type='text' value={withdrawAddressInput} onChange={e => setWithdrawAddressInput(e.target.value)} />
                  <div className='withdraw-address' >
                    {addressToWithdraw.slice(0, 6) + '...' + addressToWithdraw.slice(-6)}
                    <div className='address-unit copy-address' onClick={() => copyToClipboard(addressToWithdraw)}>
                      <CopySVG width='16px' />
                    </div>
                  </div>
                </div>
                <div className='amount-input-frame width-amount'>
                  <input type='text' value={withdrawAmountInput} placeholder={`max. ${withdrawableAmount.toFixed(4)}`} onChange={e => handleWithdrawAmountInput(e.target.value)} />
                  <div className='withdraw-amount margin-top-xx' >
                    {amountToWithdraw.toFixed(4)}
                    <div className='metis-unit'>
                      <img src={MetisPNG} width='20px' />
                    </div>
                  </div>
                </div>
                <div className='button-frame'>
                  <SmallButton caption='New Request' handleClick={handleNewRequest} />
                </div>
              </div>
              <div className='sign-withdraw-frame'>
                <div className='signer-list-frame'>
                  {
                    signers.map((t, id) => {
                      return <div key={id} className='signer-item'>
                        {
                          t.signed === 1 ?
                            <div className='fa fa-check-square-o initiator'></div>
                            :
                            t.signed === 2 ?
                              <div className='fa fa-check-square-o'></div>
                              :
                              <div className='fa fa-square-o'></div>
                        }
                        {
                          t.signed === 1 ?
                            <div className='signer-address initiator'>{t.address.slice(0, 6) + '...' + t.address.slice(-6)}</div>
                            :
                            <div className='signer-address'>{t.address.slice(0, 6) + '...' + t.address.slice(-6)}</div>
                        }
                        <div className='copy-address' onClick={() => copyToClipboard(t.address)}>
                          <CopySVG width='16px' />
                        </div>
                      </div>
                    })
                  }
                </div>
                {
                  amountToWithdraw > 0 && (signers.find(t => t.address.toLowerCase() === wallet.address.toLowerCase())?.signed === 0) ?
                    <div className='button-frame-1'>
                      <SmallButton caption='Sign' handleClick={handleSign} />
                    </div>
                    :
                    <></>
                }
                {
                  isWithdrawable === true ? <div className='button-frame-1'>
                    <SmallButton caption='Withdraw' handleClick={handleWithdraw} />
                  </div>
                    :
                    <></>
                }
              </div>
            </div>
            :
            <></>
        }
        <div className='contribute-frame info-frame'>
          <div className='deposit-input-amount'>
            <input type='text' value={depositAmount} onChange={e => setDepositAmount(e.target.value)} />
            <div className='my-eth-balance'>{myETHBalance.toFixed(3)} METIS in my wallet</div>
            <div className='deposit-amount-limit'>min. {minDepositAmount.toFixed(2)} METIS, max. {maxDepositAmount.toFixed(2)} METIS</div>
          </div>
          <SmallButton caption='Deposit' handleClick={handleDeposit} />
        </div>
        <div className='history-frame info-frame'>
          <div className='title-bar'>History</div>
          <div className='history-info-frame'>
            <div className='history-item'>
              <div className='label'>History count</div>
              <div className='value'>{history.length}</div>
            </div>
            <div className='history-item'>
              <div className='label'>Depositor count</div>
              <div className='value'>{depositorCount}</div>
            </div>
            <div className='history-item'>
              <div className='label'>Total Deposit</div>
              <div className='value'>
                <img src={MetisPNG} width='28px' />
                {totalDepositAmount.toFixed(2)} METIS
              </div>
            </div>
          </div>
          <div className='search-frame'>
            <input type='text' placeholder='Please input search text...' value={searchText} onChange={e => setSearchText(e.target.value)} />
          </div>
          <div className='history-items'>
            {
              filterResult.map((t, id) => {
                return <HistoryItem key={id} item={t} />
              })
            }
          </div>
        </div>
      </div>
    </PresaleContainer>
  )
}
