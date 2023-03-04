import { useEffect, useState } from 'react'
import { ethers } from 'ethers'
// Import ABI Code to interact with smart contract
import Lottery from './artifacts/contracts/Lottery.sol/Lottery.json'
import './App.css'

import { contractAdd,contractABI } from './utils/constants'

function App() {
  
  // States
  const [state, setState] = useState({
    provider: null,
    signer: null,
    contract: null,
    owner: null,
  })
  const [lastWinner, setLastWinner] = useState(null)
  const [account, setAccount] = useState(null)


  const connectWallet = async () => {
    try {
      const { ethereum } = window
      if (ethereum) {
        const account = await ethereum.request({
          method: 'eth_requestAccounts',
        })
        const provider = new ethers.providers.Web3Provider(ethereum)
        const signer = provider.getSigner()
        const contract = new ethers.Contract(contractAdd, contractABI, signer)
        window.ethereum.on('chainChanged',()=>{
          window.location.reload()
        })
        window.ethereum.on('accountChanged',()=>{
          window.location.reload()
        })
        setAccount(account[0])
        const owner = await contract.owner()
        setState({ provider, signer, contract, owner })
      } else {
        alert('Please install metamask')
      }
      // await getWinner()
    } catch (error) {
      console.log(error)
    }
  }

  const enterLottery = async () => {
    if (!window.ethereum) return alert('Please install Metamask')
    if (!account) return alert('Please connect your wallet.')
    const { contract } = state
    try {
      const transaction = await contract.enter({
        value: ethers.utils.parseEther('0.001'),
      })
      await transaction.wait()
      console.log('Transaction successfull')
    } catch (error) {
      console.log(error)
    }
  }

  const pickWinner = async () => {
    if (!window.ethereum) return alert('Please install Metamask')
    if (!account) return alert('Please connect your wallet.')

    const { contract } = state
    try {
      const transaction = await contract.pickWinner()
      await transaction.wait()
      console.log('Winner picked successfully')
    } catch (error) {
      console.log(error)
    }
  }

  const getWinner = async () => {
    if(!state.contract) return alert('Please connect your wallet.')
    try {
      const { contract } = state
      const winner = await contract.getLastWinner()
      setLastWinner(winner)
    } catch (error) {
      console.log(error)
    }
  }
  const getParticipants = async () => {
    try {
      const { contract } = state
      const participants = await contract.getParticipants()
      console.log(participants)
    } catch (error) {
      console.log(error)
    }
  }

  const shortAdd = (str) => {
    return str.substring(0, 6) + '....' + str.substring(str.length - 4)
  }

  useEffect(() => {
    connectWallet()
  }, [])

  useEffect(() => {
    getWinner()
  }, [])

  

console.log(state);
  return (
    <div className="App">
      <div className="App-header">
        <div style={{ display: 'flex', gap: '50px' }}>
          <button className="btn" onClick={getParticipants}>
            Get Participants
          </button>
          {!account && (
            <button className="btn" onClick={connectWallet}>
              Connect Wallet
            </button>
          )}
        </div>
        {/* DESCRIPTION  */}
        <div className="description">
          <h2>Play Lottery to Win Ethers</h2>
          <h3>Ticket Price - 1 ether</h3>
        </div>
        <div className="enter-div">
          <h2>Click Enter to participate</h2>
          <button className="btn" onClick={enterLottery}>
            Enter
          </button>
        </div>
        <div>
          {account &&
            state.owner &&
            account.toLowerCase() === state.owner.toLowerCase() && (
              <button onClick={pickWinner} className="btn">
                Pick Winner
              </button>
            )}
        </div>
        {lastWinner && (
          <div style={{ height: '300px', width: '50%' }}>
            <hr />
            <h2>Last Winner</h2>
            <hr />
            <div className="flex flex-col gap-10">{shortAdd(lastWinner)}</div>
          </div>
        )}
      </div>
    </div>
  )
}

export default App
