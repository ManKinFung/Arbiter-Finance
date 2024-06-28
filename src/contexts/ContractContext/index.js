import { createContext, useContext, useState, useEffect, useCallback, useMemo } from "react"
import { useCustomWallet } from "../WalletContext"
import ERC20_abi from './abi/ERC20.json'
import ArbiterCoin_abi from './abi/ArbiterCoin.json'
import IPancakeSwapRouter from './abi/IPancakeSwapRouter.json'
import IPancakeSwapPair from './abi/IPancakeSwapPair.json'

import walletConfig from '../WalletContext/config'
import ADDRESS from './address'

import BigNumber from 'bignumber.js'
import { useGlobal } from "../GlobalContext"

const Web3 = require("web3")

export const ContractContext = createContext();

export const ContractProvider = (props) => {

    const { wallet } = useCustomWallet()
    const { chainId } = useGlobal()

    const [reloadCounter, setReloadCounter] = useState(0)
    const web3Provider = useMemo(() => {return new Web3(walletConfig[chainId].rpcUrls[0])}, [chainId])

    useEffect(() => {
        let ac = new AbortController();

        const reload = () => {
            setReloadCounter(t => { return t + 1 });
        }

        let tmr = setInterval(() => {
            if (ac.signal.aborted === false) {
                window.web3 && reload();
            }
        }, 60000);

        return () => {
            ac.abort();
            clearInterval(tmr);
        }
    }, [])

    useEffect(() => {
        setReloadCounter(t => { return t + 1 });
    }, [wallet])

    const refreshPages = () => {
        setReloadCounter(t => { return t + 1 });
    }

    const makeTx = useCallback(async (addr, tx, gasPlus) => {
        const web3 = window.web3;
        web3.eth.getGasPrice()
        tx.estimateGas({ from: wallet.address })

        const [gasPrice, gasCost] = await Promise.all([
            web3.eth.getGasPrice(),
            tx.estimateGas({ from: wallet.address }),
        ]);
        const data = tx.encodeABI();
        const txData = {
            from: wallet.address,
            to: addr,
            data,
            gas: gasCost + (gasPlus !== undefined? gasPlus: 0),
            gasPrice
        };
        const receipt = await web3.eth.sendTransaction(txData);
        return receipt;
    }, [wallet.address])

    const makeTxWithNativeCurrency = useCallback(async (addr, tx, nativeCurrencyAmount, gasPlus) => {
        const web3 = window.web3;

        const [gasPrice, gasCost] = await Promise.all([
            web3.eth.getGasPrice(),
            tx.estimateGas({
                value: nativeCurrencyAmount,
                from: wallet.address
            }),
        ]);
        const data = tx.encodeABI();
        const txData = {
            from: wallet.address,
            to: addr,
            value: nativeCurrencyAmount,
            data,
            gas: gasCost + (gasPlus !== undefined? gasPlus: 0),
            gasPrice
        };
        const receipt = await web3.eth.sendTransaction(txData);
        return receipt;
    }, [wallet.address])

    const A2D = useCallback(async (addr, amount) => {
        const web3 = web3Provider;
        const erc20 = new web3.eth.Contract(ERC20_abi.abi, addr);

        let tval = await erc20.methods.decimals().call();
        let tt = new BigNumber(amount).div(new BigNumber(`1e${tval}`));
        tt = tt.toFixed(10, BigNumber.ROUND_DOWN);
        return parseFloat(tt);
    }, [web3Provider])

    const D2A = useCallback(async (addr, amount) => {
        const web3 = web3Provider;
        const toBN = web3.utils.toBN;
        const erc20 = new web3.eth.Contract(ERC20_abi.abi, addr);
        let tval = await erc20.methods.decimals().call();
        tval = new BigNumber(amount).times(new BigNumber(`1e${tval}`))
        return toBN(tval.toFixed(0));
    }, [web3Provider])

    const balanceOf = useCallback(async (token, address) => {
        if (address === '') {
            throw new Error('balanceOf: not connected to the wallet');
        }

        const web3 = web3Provider;

        const tokenContract = new web3.eth.Contract(ERC20_abi.abi, token);
        let ret = await tokenContract.methods.balanceOf(address).call();

        return await A2D(token, ret);
    }, [A2D, web3Provider])

    const getTokenApprovedAmount = useCallback(async (token, owner, spender) => {
        const web3 = web3Provider;

        const tokenContract = new web3.eth.Contract(ERC20_abi.abi, token);
        let ret = await tokenContract.methods.allowance(owner, spender).call();

        return await A2D(token, ret);
    }, [A2D, web3Provider])

    const approveToken = useCallback(async (token, spender) => {
        const web3 = window.web3;

        const tokenContract = new web3.eth.Contract(ERC20_abi.abi, token);
        let tx = await makeTx(token, tokenContract.methods.approve(spender, '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff'));

        return tx;
    }, [makeTx])

    const transferOwnership = useCallback(async (ownable, newOwner) => {
        const web3 = window.web3;

        const ownableContract = new web3.eth.Contract(ArbiterCoin_abi.abi, ownable);
        let tx = await makeTx(ownable, 
            ownableContract.methods.transferOwnership(newOwner));

        return tx;
    }, [makeTx])

    const tokenSymbol = useCallback(async () => {
        const web3 = web3Provider;

        const tokenContract = new web3.eth.Contract(ArbiterCoin_abi.abi, ADDRESS[chainId].token)
        const ret = await tokenContract.methods.symbol().call()
        return ret
    }, [chainId, web3Provider])

    const tokenPriceToUSDC = useCallback(async (amount) => {
        const web3 = web3Provider;

        let tval;
        const tokenContract = new web3.eth.Contract(ArbiterCoin_abi.abi, ADDRESS[chainId].token)
        let routerAddress = await tokenContract.methods.router().call()
        const router = new web3.eth.Contract(IPancakeSwapRouter.abi, routerAddress)
        const wethAddress = await router.methods.WETH().call()

        let realVal = await D2A(ADDRESS[chainId].token, amount)

        let t2 = await router.methods.getAmountsOut(realVal, [ADDRESS[chainId].token, wethAddress, ADDRESS[chainId].usdc]).call()

        return await A2D(ADDRESS[chainId].usdc, t2[t2.length - 1])
    }, [D2A, chainId, A2D, web3Provider])

    const totalSupply = useCallback(async () => {
        const web3 = web3Provider
        const tokenContract = new web3.eth.Contract(ArbiterCoin_abi.abi, ADDRESS[chainId].token)
        const ret = await tokenContract.methods.totalSupply().call()

        return await A2D(ADDRESS[chainId].token, ret);
    }, [A2D, chainId, web3Provider])

    const firePit = useCallback(async () => {
        const web3 = web3Provider
        const tokenContract = new web3.eth.Contract(ArbiterCoin_abi.abi, ADDRESS[chainId].token)
        const ret = await tokenContract.methods.firePit().call()

        return ret;
    }, [web3Provider, chainId])

    const getCirculatingSupply = useCallback(async () => {
        let ts = await totalSupply()
        let faddress = await firePit()
        let fb = await balanceOf(ADDRESS[chainId].token, faddress)

        return parseFloat(BigNumber(ts).minus(BigNumber(fb)).toFixed(4))
    }, [totalSupply, firePit, chainId, balanceOf])

    const lastRebasedTime = useCallback(async () => {
        const web3 = web3Provider
        const tokenContract = new web3.eth.Contract(ArbiterCoin_abi.abi, ADDRESS[chainId].token)
        const ret = await tokenContract.methods._lastRebasedTime().call()
        return parseInt(ret)
    }, [web3Provider, chainId])

    const treasuryReceiver = useCallback(async () => {
        const web3 = web3Provider
        const tokenContract = new web3.eth.Contract(ArbiterCoin_abi.abi, ADDRESS[chainId].token)
        const ret = await tokenContract.methods.treasuryReceiver().call()

        return ret
    }, [web3Provider, chainId])

    const buyBackReceiver = useCallback(async () => {
        const web3 = web3Provider
        const tokenContract = new web3.eth.Contract(ArbiterCoin_abi.abi, ADDRESS[chainId].token)
        const ret = await tokenContract.methods.BuyBackReceiver().call()

        return ret
    }, [web3Provider, chainId])

    const getPoolBalance = useCallback(async () => {
        const web3 = web3Provider

        let tval

        const tokenContract = new web3.eth.Contract(ArbiterCoin_abi.abi, ADDRESS[chainId].token)
        let pairAddress = await tokenContract.methods.pairAddress().call()
        const pair = new web3.eth.Contract(IPancakeSwapPair.abi, pairAddress)
        tval = await pair.methods.getReserves().call()
        const token0 = await pair.methods.token0().call()

        return await A2D(ADDRESS[chainId].token, token0.toLowerCase() === ADDRESS[chainId].token.toLowerCase()? tval.reserve0: tval.reserve1)
    }, [web3Provider, A2D, chainId])

    const getRebaseRate = useCallback(async () => {
        const web3 = web3Provider
        const tokenContract = new web3.eth.Contract(ArbiterCoin_abi.abi, ADDRESS[chainId].token)
        const ret = '1500'

        const rd = await tokenContract.methods.RATE_DECIMALS().call()

        return parseInt(ret) / Math.pow(10, parseInt(rd.toString()))
    }, [web3Provider, chainId])

    const getRebasePeriod = useCallback(async () => {
        return 15 * 60 // 15 minutes
    }, [])

    const wethBalanceByUSDC = useCallback(async (account) => {
        const web3 = web3Provider

        const tokenContract = new web3.eth.Contract(ArbiterCoin_abi.abi, ADDRESS[chainId].token)
        let routerAddress = await tokenContract.methods.router().call()
        const router = new web3.eth.Contract(IPancakeSwapRouter.abi, routerAddress)

        const wethAddress = await router.methods.WETH().call()

        let balance = await web3.eth.getBalance(account)

        let tval = await router.methods.getAmountsOut(balance, [wethAddress, ADDRESS[chainId].usdc]).call()

        return await A2D(ADDRESS[chainId].usdc, tval[tval.length - 1])
    }, [web3Provider, A2D, chainId])

    const getETHBalance = useCallback(async (account) => {
        const web3 = web3Provider
        let balance = await web3.eth.getBalance(account)
        return parseFloat(web3.utils.fromWei(balance))
    }, [web3Provider])

    const getMaxTokenPerWallet = useCallback(async () => {
        const web3 = web3Provider
        const tokenContract = new web3.eth.Contract(ArbiterCoin_abi.abi, ADDRESS[chainId].token)

        const per = await tokenContract.methods._walletPercentage().call()
        const total = await tokenContract.methods.totalSupply().call()

        return (await A2D(ADDRESS[chainId].token, total)) * parseInt(per.toString()) / 100
    }, [web3Provider, chainId, A2D])

    const isFeeExempt = useCallback(async (account) => {
        const web3 = web3Provider
        const tokenContract = new web3.eth.Contract(ArbiterCoin_abi.abi, ADDRESS[chainId].token)

        return await tokenContract.methods.checkFeeExempt(account).call()
    }, [web3Provider, chainId, A2D])

    const ethPriceToUSDC = useCallback(async (amount) => {
        const web3 = web3Provider;

        let tval;
        const tokenContract = new web3.eth.Contract(ArbiterCoin_abi.abi, ADDRESS[chainId].token)
        let routerAddress = await tokenContract.methods.router().call()

        const router = new web3.eth.Contract(IPancakeSwapRouter.abi, routerAddress)
        const wethAddress = await router.methods.WETH().call()

        let realVal = web3.utils.toWei(amount.toString())

        tval = await router.methods.getAmountsOut(realVal, [wethAddress, ADDRESS[chainId].usdc]).call()

        return await A2D(ADDRESS[chainId].usdc, tval[tval.length - 1])
    }, [web3Provider, chainId, A2D])

    const tokenToETH = useCallback(async (amount) => {
        const web3 = web3Provider;

        const tokenContract = new web3.eth.Contract(ArbiterCoin_abi.abi, ADDRESS[chainId].token)
        let routerAddress = await tokenContract.methods.router().call()
        const router = new web3.eth.Contract(IPancakeSwapRouter.abi, routerAddress)
        const wethAddress = await router.methods.WETH().call()

        let realVal = await D2A(ADDRESS[chainId].token, amount)

        let t2 = await router.methods.getAmountsOut(realVal, [ADDRESS[chainId].token, wethAddress]).call()

        return await A2D(wethAddress, t2[t2.length - 1])
    }, [D2A, chainId, A2D, web3Provider])

    const ethToToken = useCallback(async (amount) => {
        const web3 = web3Provider;

        const tokenContract = new web3.eth.Contract(ArbiterCoin_abi.abi, ADDRESS[chainId].token)
        let routerAddress = await tokenContract.methods.router().call()
        const router = new web3.eth.Contract(IPancakeSwapRouter.abi, routerAddress)
        const wethAddress = await router.methods.WETH().call()

        let realVal = await D2A(wethAddress, amount)

        let t2 = await router.methods.getAmountsOut(realVal, [wethAddress, ADDRESS[chainId].token]).call()

        return await A2D(ADDRESS[chainId].token, t2[t2.length - 1])
    }, [D2A, chainId, A2D, web3Provider])

    const sellToken = useCallback(async (tokenAmount) => {
        const web3 = window.web3

        const tokenContract = new web3.eth.Contract(ArbiterCoin_abi.abi, ADDRESS[chainId].token)
        let routerAddress = await tokenContract.methods.router().call()

        const router = new web3.eth.Contract(IPancakeSwapRouter.abi, routerAddress)
        const wethAddress = await router.methods.WETH().call()

        let amount = await D2A(ADDRESS[chainId].token, tokenAmount)

        let tx = await makeTx(routerAddress, router.methods.swapExactTokensForETHSupportingFeeOnTransferTokens(
            amount,
            0,
            [ADDRESS[chainId].token, wethAddress],
            wallet.address,
            0xffffffff)
        );

        return tx;
    }, [chainId, makeTx, D2A, wallet.address])

    const buyToken = useCallback(async (ethAmount) => {
        const web3 = window.web3

        const tokenContract = new web3.eth.Contract(ArbiterCoin_abi.abi, ADDRESS[chainId].token)
        let routerAddress = await tokenContract.methods.router().call()

        const router = new web3.eth.Contract(IPancakeSwapRouter.abi, routerAddress);
        const wethAddress = await router.methods.WETH().call()

        let amount = web3.utils.toWei(ethAmount.toString())

        let tx = await makeTxWithNativeCurrency(routerAddress,
            router.methods.swapExactETHForTokensSupportingFeeOnTransferTokens(0, [wethAddress, ADDRESS[chainId].token], wallet.address, 0xffffffff),
            amount
        )

        return tx
    }, [chainId, wallet.address, makeTxWithNativeCurrency])

    return (
        <ContractContext.Provider value={{
            reloadCounter, refreshPages, makeTx, makeTxWithNativeCurrency,
            A2D, D2A, balanceOf, getTokenApprovedAmount, approveToken, 
            transferOwnership, tokenSymbol, 
            tokenPriceToUSDC, totalSupply, firePit, getCirculatingSupply, lastRebasedTime,
            treasuryReceiver, buyBackReceiver, getPoolBalance, getRebaseRate,
            getRebasePeriod, wethBalanceByUSDC,
            getMaxTokenPerWallet, isFeeExempt, ethPriceToUSDC, getETHBalance,
            tokenToETH, ethToToken,
            sellToken, buyToken
        }}>
            {props.children}
        </ContractContext.Provider>
    )
}

export const useContract = () => {
    const contractManager = useContext(ContractContext)
    return contractManager || [{}, async () => { }]
}
