import React, { createContext, useCallback, useContext, useEffect, useState } from "react"
import copyText from 'copy-text-to-clipboard'
import { create as ipfsHttpClient } from 'ipfs-http-client'
import axios from 'axios';

import walletConfig from '../WalletContext/config'

export const GlobalContext = createContext()

const ipfs = ipfsHttpClient('https://ipfs.infura.io:5001/api/v0')

export const GlobalProvider = ({ children }) => {

  const [chainIndex, setChainIndex] = useState(2)
  const [chainId, setChainId] = useState(42161)
  // const [rpcUrl, setRpcUrl] = useState('')

  useEffect(() => {
    let keys = Object.keys(walletConfig)
    setChainId(parseInt(walletConfig[keys[chainIndex]].chainId, 16))
    // setRpcUrl(walletConfig[keys[chainIndex]].rpcUrls[0])
  }, [chainIndex])

  const addFileToIPFS = async (file) => {
    return ipfs.add(file);
  }

  const getIPFSUrl = (hash) => {
    return `https://ipfs.io/ipfs/${hash}`;
  }

  const copyToClipboard = (text) => {
    copyText(text);
  }

  const refreshPage = () => {
    window.location.reload();
  }

  const stringFormat = (x) => {
    let t = x.toString();
    let decimalPosition = t.indexOf('.');
    if (decimalPosition < 0) decimalPosition = t.length;
    
    if (decimalPosition > 0) {
      let i;
      for (i = decimalPosition - 3; i > 0; i -= 3) {
        t = t.slice(0, i) + ',' + t.slice(i);
      }
    }
    return t;
  }

  const invokeServer = useCallback(async (method, url, data) => {
    if (method === 'post') {
      return axios.post(`${url}`, data)
    } else if (method === 'get') {
      return axios.get(`${url}`)
    }
  }, [])

  const numberFromStringComma = useCallback((t) => {
    t = t.replace(/,/g,'')
    t = t.replace(/_/g,'')
    return t
  }, [])

  return (
    <React.StrictMode>
      <GlobalContext.Provider value={{ addFileToIPFS, getIPFSUrl, copyToClipboard, refreshPage, invokeServer, stringFormat, numberFromStringComma, chainId, setChainIndex}}>
        {children}
      </GlobalContext.Provider>
    </React.StrictMode>
  )
}

export const useGlobal = () => {
  const globalManager = useContext(GlobalContext)
  return globalManager || [{}, async () => { }]
}
