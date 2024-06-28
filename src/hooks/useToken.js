import { useCallback, useEffect, useState } from 'react'
import { useContract } from '../contexts/ContractContext';
import { useGlobal } from '../contexts/GlobalContext';
import ADDRESS from '../contexts/ContractContext/address'
import { useCustomWallet } from '../contexts/WalletContext';

const useToken = () => {
    const { reloadCounter, tokenPriceToUSDC, getCirculatingSupply, totalSupply, lastRebasedTime,
        treasuryReceiver, buyBackReceiver, firePit, getPoolBalance, getRebaseRate, getRebasePeriod,
        wethBalanceByUSDC, balanceOf, tokenSymbol, getMaxTokenPerWallet, isFeeExempt, ethPriceToUSDC, getETHBalance,
        getTokenApprovedAmount } = useContract()

    const { wallet } = useCustomWallet()

    const { chainId } = useGlobal()

    const [symbol, setSymbol] = useState('')
    const [tokenPrice, setTokenPrice] = useState(0)
    const [circulatingSupply, setCirculatingSupply] = useState(0)
    const [total, setTotal] = useState(0)
    const [marketCap, setMarketCap] = useState(0)
    const [lastRebased, setLastRebased] = useState(0)
    const [timeTick, setTimeTick] = useState(0)
    const [treasury, setTreasury] = useState('')
    const [treasuryUSD, setTreasuryUSD] = useState(0)
    const [poolBalance, setPoolBalance] = useState(0)
    const [poolBalanceUSD, setPoolBalanceUSD] = useState(0)

    const [buyback, setBuyback] = useState('')
    const [buybackBalanceUSD, setBuybackBalanceUSD] = useState(0)

    const [firePitAddress, setFirePitAddress] = useState('')
    const [firePitBalance, setFirePitBalance] = useState(0)
    const [firePitBalanceUSD, setFirePitBalanceUSD] = useState(0)
    const [firePitPercentage, setFirePitPercentage] = useState(0)
    const [rebaseRate, setRebaseRate] = useState(0)
    const [rebasePeriod, setRebasePeriod] = useState(0)

    const [myBalance, setMyBalance] = useState(0)
    const [myBalanceUSD, setMyBalanceUSD] = useState(0)
    const [myBalanceETH, setMyBalanceETH] = useState(0)
    const [maxTokenPerWallet, setMaxTokenPerWallet] = useState(0)
    const [exempt, setExempt] = useState(false)

    const [ethPrice, setETHPrice] = useState(0)

    const [tokenApprovedAmount, setTokenApprovedAmount] = useState(0)

    useEffect(() => {
        let ac = new AbortController();

        tokenSymbol()
            .then(r => {
                if (ac.signal.aborted === false) {
                    setSymbol(r)
                }
            })
            .catch(err => {
                console.log(err.message)
            })

        tokenPriceToUSDC(1)
            .then(r => {
                if (ac.signal.aborted === false) {
                    setTokenPrice(r)
                }
            })
            .catch(err => {
                console.log(`${err.message}`)
            })

        getCirculatingSupply()
            .then(r => {
                if (ac.signal.aborted === false) {
                    setCirculatingSupply(r)
                }
            })
            .catch(err => {
                console.log(`${err.message}`)
            })

        totalSupply()
            .then(r => {
                if (ac.signal.aborted === false) {
                    setTotal(r)
                }
            })
            .catch(err => {
                console.log(`${err.message}`)
            })

        lastRebasedTime()
            .then(r => {
                if (ac.signal.aborted === false) {
                    let now1 = (new Date()).getTime() / 1000;
                    let now = ~~now1;

                    setLastRebased(now - r)
                    setTimeTick(now)
                }
            })
            .catch(err => {
                console.log(`${err.message}`)
            })

        treasuryReceiver()
            .then(r => {
                if (ac.signal.aborted === false) {
                    setTreasury(r)
                }
            })
            .catch(err => {
                console.log(`${err.message}`)
            })

        buyBackReceiver()
            .then(r => {
                if (ac.signal.aborted === false) {
                    setBuyback(r)
                }
            })
            .catch(err => {
                console.log(`${err.message}`)
            })

        firePit()
            .then(r => {
                if (ac.signal.aborted === false) {
                    setFirePitAddress(r)
                }
            })
            .catch(err => {
                console.log(`${err.message}`)
            })

        getPoolBalance()
            .then(r => {
                if (ac.signal.aborted === false) {
                    setPoolBalance(r);
                }
            })
            .catch(err => {
                console.log(`${err.message}`)
            })

        getRebaseRate()
            .then(r => {
                if (ac.signal.aborted === false) {
                    setRebaseRate(r);
                }
            })
            .catch(err => {
                console.log(`${err.message}`)
            })

        getRebasePeriod()
            .then(r => {
                if (ac.signal.aborted === false) {
                    setRebasePeriod(r);
                }
            })
            .catch(err => {
                console.log(`${err.message}`)
            })

        balanceOf(ADDRESS[chainId].token, wallet.address)
            .then(r => {
                if (ac.signal.aborted === false) {
                    setMyBalance(r)
                }
            })
            .catch(err => {
                console.log(`${err.message}`)
            })

        getMaxTokenPerWallet()
            .then(r => {
                if (ac.signal.aborted === false) {
                    setMaxTokenPerWallet(r);
                }
            })
            .catch(err => {
                console.log(`${err.message}`)
            })

        isFeeExempt(wallet.address)
            .then(r => {
                if (ac.signal.aborted === false) {
                    setExempt(r)
                }
            })
            .catch(err => {
                console.log(`${err.message}`)
            })

        ethPriceToUSDC(1)
            .then(r => {
                if (ac.signal.aborted === false) {
                    setETHPrice(r)
                }
            })
            .catch(err => {
                console.log(`${err.message}`)
            })

        getETHBalance(wallet.address)
            .then(r => {
                if (ac.signal.aborted === false) {
                    setMyBalanceETH(r)
                }
            })
            .catch(err => {
                console.log(`${err.message}`)
            })

        getTokenApprovedAmount(ADDRESS[chainId].token, wallet.address, ADDRESS[chainId].router)
            .then(r => {
                if (ac.signal.aborted === false) {
                    setTokenApprovedAmount(r)
                }
            })
            .catch(err => {
                console.log(`${err.message}`)
            })

        return () => ac.abort();
    }, [reloadCounter, tokenPriceToUSDC, getCirculatingSupply, totalSupply, lastRebasedTime,
        treasuryReceiver, buyBackReceiver, firePit, getPoolBalance, getRebaseRate, getRebasePeriod,
        getMaxTokenPerWallet, isFeeExempt, ethPriceToUSDC, getETHBalance, getTokenApprovedAmount,
        balanceOf, wallet.address, chainId])

    useEffect(() => {
        let ac = new AbortController();
        if (treasury !== '') {
            wethBalanceByUSDC(treasury)
                .then(r => {
                    if (ac.signal.aborted === false) {
                        setTreasuryUSD(r)
                    }
                })
                .catch(err => {
                    console.log(`${err.message}`)
                })

            // balanceOf(treasury)
            //   .then(r => {
            //     if (ac.signal.aborted === false) {
            //       setTreasuryBalance(r)
            //     }
            //   })
            //   .catch(err => {
            //     console.log(`${err.message}`)
            //   })
        }

        return () => ac.abort();
    }, [treasury, wethBalanceByUSDC])

    useEffect(() => {
        let ac = new AbortController();

        if (buyback !== '') {
            wethBalanceByUSDC(buyback)
                .then(r => {
                    if (ac.signal.aborted === false) {
                        setBuybackBalanceUSD(r)
                    }
                })
                .catch(err => {
                    console.log(`${err.message}`)
                })
        }

        return () => ac.abort();
    }, [buyback, wethBalanceByUSDC])

    useEffect(() => {
        let ac = new AbortController();
        if (firePitAddress !== '') {
            balanceOf(ADDRESS[chainId].token, firePitAddress)
                .then(r => {
                    if (ac.signal.aborted === false) {
                        setFirePitBalance(r)
                    }
                })
                .catch(err => {
                    console.log(`${err.message}`)
                })
        }

        return () => ac.abort();
    }, [firePitAddress, balanceOf, chainId])


    useEffect(() => {
        setMarketCap(tokenPrice * circulatingSupply);
    }, [tokenPrice, circulatingSupply])

    // useEffect(() => {
    //   setTreasuryUSD(tokenPrice * treasuryBalance);
    // }, [tokenPrice, treasuryBalance])

    useEffect(() => {
        setFirePitBalanceUSD(tokenPrice * firePitBalance);
    }, [tokenPrice, firePitBalance])

    useEffect(() => {
        setPoolBalanceUSD(tokenPrice * poolBalance);
    }, [tokenPrice, poolBalance])

    useEffect(() => {
        if (total > 0) {
            setFirePitPercentage(firePitBalance * 100 / total);
        } else {
            setFirePitPercentage(0);
        }
    }, [firePitBalance, total])

    useEffect(() => {
        setMyBalanceUSD(tokenPrice * myBalance);
    }, [myBalance, tokenPrice])

    return {
        symbol, tokenPrice, circulatingSupply, total, marketCap, lastRebased, timeTick, treasury, treasuryUSD,
        poolBalance, poolBalanceUSD, buyback, buybackBalanceUSD, firePitAddress, firePitBalance, firePitBalanceUSD, firePitPercentage,
        rebaseRate, rebasePeriod,
        myBalance, myBalanceUSD, maxTokenPerWallet, exempt, ethPrice, myBalanceETH,
        tokenApprovedAmount
    }
}

export default useToken
