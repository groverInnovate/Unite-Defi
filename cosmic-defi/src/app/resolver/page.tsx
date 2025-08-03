'use client'

import React, { useState, useEffect, useCallback} from 'react'
import { motion } from 'framer-motion'
import { 
  Scale, 
  Clock, 
  Copy,
  Shield,
  AlertCircle,
  ExternalLink
} from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { ResolverOrder, OrderStatus } from '@/types/resolverTypes'
import * as Sdk from "@1inch/cross-chain-sdk"
import { orderService } from '@/services/OrderService'
import { ethers } from 'ethers'
import {ABI} from '../../constants/ResolverABI.js'
import {bytecode} from '../../constants/ResolverBytecode.js'

const { Address } = Sdk

const CHAIN_CONFIG = {
  sepolia: {
    chainId: 11155111,
    name: 'Sepolia',
    color: 'text-blue-400',
    bg: 'bg-blue-400/20',
    explorer: 'https://sepolia.etherscan.io',
    rpcUrl: 'https://rpc.sepolia.org',
    lop: '0x9B77eE6D1A29DfE03d7AFDD6a0472266e2D0b193',
    factory: '0x6a9D2E325827B7958DA84DDC7e3473A8fc5164B7'
  },
  monad: {
    chainId: 41454,
    name: 'Monad',
    color: 'text-purple-400',
    bg: 'bg-purple-400/20',
    explorer: 'https://testnet-explorer.monad.xyz',
    rpcUrl: 'https://testnet-rpc.monad.xyz',
    lop: '0xd946F0bc4292a5b83894df44fc931e7852d728ff',
    factory: '0xBdcBec40daC2643b0193D1bc0B0Acbd580B0A446'
  }
}

type ChainInfo = {
  name: string;
  color: string;
  bg: string;
  explorer: string;
};

const SUPPORTED_CHAINS: { [key: number]: ChainInfo } = {
  1: { name: 'Ethereum', color: 'text-blue-400', bg: 'bg-blue-500/20', explorer: 'https://etherscan.io' },
  11155111: { name: 'Sepolia', color: 'text-blue-300', bg: 'bg-blue-400/20', explorer: 'https://sepolia.etherscan.io' },
  41454: { name: 'Monad', color: 'text-purple-400', bg: 'bg-purple-500/20', explorer: 'https://testnet-explorer.monad.xyz' },
}

const formatAddress = (address: string) => {
  if (!address) return 'N/A'
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

function toSdkOrder(dbOrder: ResolverOrder): Sdk.CrossChainOrder {
  const timeLocks = Sdk.TimeLocks.new({
    srcWithdrawal: BigInt(dbOrder.timeLocks.srcWithdrawal),
    srcPublicWithdrawal: BigInt(dbOrder.timeLocks.srcPublicWithdrawal),
    srcCancellation: BigInt(dbOrder.timeLocks.srcCancellation),
    srcPublicCancellation: BigInt(dbOrder.timeLocks.srcPublicCancellation),
    dstWithdrawal: BigInt(dbOrder.timeLocks.dstWithdrawal),
    dstPublicWithdrawal: BigInt(dbOrder.timeLocks.dstPublicWithdrawal),
    dstCancellation: BigInt(dbOrder.timeLocks.dstCancellation),
  })

  const hashLock = Sdk.HashLock.forSingleFill(dbOrder.secret)

  return Sdk.CrossChainOrder.new(
    new Address(dbOrder.srcChainId == 11155111 ? CHAIN_CONFIG.sepolia.factory : CHAIN_CONFIG.monad.factory),
    {
      salt: BigInt(dbOrder.salt),
      maker: new Address(dbOrder.maker),
      makingAmount: BigInt(dbOrder.makingAmount),
      takingAmount: BigInt(dbOrder.takingAmount),
      makerAsset: new Address(dbOrder.makerAsset),
      takerAsset: new Address(dbOrder.takerAsset),
    },
    {
      hashLock,
      timeLocks,
      srcChainId: Sdk.NetworkEnum.ETHEREUM,
      dstChainId: Sdk.NetworkEnum.MONAD,
      srcSafetyDeposit: BigInt(dbOrder.Safety_deposit),
      dstSafetyDeposit: BigInt(dbOrder.Safety_deposit),
    },
    {
      auction: new Sdk.AuctionDetails({
        initialRateBump: 0,
        points: [],
        duration: 120n,
        startTime: BigInt(dbOrder.timestamp),
      }),
      whitelist: [{ address: new Address(dbOrder.resolverAddress), allowFrom: 0n }],
      resolvingStartTime: 0n,
    },
    {
      nonce: BigInt(dbOrder.nonce),
      allowPartialFills: false,
      allowMultipleFills: false,
    }
  )
}

class ResolverClient {
  private readonly iface = new ethers.Interface(ABI)

  constructor(
    public readonly srcAddress: string,
    public readonly dstAddress: string
  ) {}

  public deploySrc(
    chainId: number,
    order: Sdk.CrossChainOrder,
    signature: string,
    takerTraits: Sdk.TakerTraits,
    amount: bigint
  ): ethers.ContractTransaction {
    const {r, yParityAndS: vs} = ethers.Signature.from(signature)
    const {args, trait} = takerTraits.encode()
    const immutables = order.toSrcImmutables(chainId, new Address(this.srcAddress), amount, order.escrowExtension.hashLockInfo)

    return {
      to: this.srcAddress,
      data: this.iface.encodeFunctionData('deploySrc', [
        immutables.build(),
        order.build(),
        r,
        vs,
        amount,
        trait,
        args
      ]),
      value: order.escrowExtension.srcSafetyDeposit
    } as ethers.ContractTransaction
  }

  public deployDst(immutables: Sdk.Immutables): ethers.ContractTransaction {
    return {
      to: this.dstAddress,
      data: this.iface.encodeFunctionData('deployDst', [
        immutables.build(),
        immutables.timeLocks.toSrcTimeLocks().privateCancellation
      ]),
      value: immutables.safetyDeposit
    } as ethers.ContractTransaction
  }

  public withdraw(
    side: 'src' | 'dst',
    escrow: string,
    secret: string,
    immutables: Sdk.Immutables
  ): ethers.ContractTransaction {
    return {
      to: side === 'src' ? this.srcAddress : this.dstAddress,
      data: this.iface.encodeFunctionData('withdraw', [escrow, secret, immutables.build()])
    } as ethers.ContractTransaction
  }
}

function ResolverPage() {
  const [orders, setOrders] = useState<ResolverOrder[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [deployingResolver, setDeployingResolver] = useState<{ sepolia: boolean; monad: boolean }>({ sepolia: false, monad: false })
  const [deployedContracts, setDeployedContracts] = useState<{ sepolia: string | null; monad: string | null }>({ sepolia: null, monad: null })
  const [escrowAddresses, setEscrowAddresses] = useState<{ [orderHash: string]: { src?: string; dst?: string } }>({})
  const [operatingOrders, setOperatingOrders] = useState<{ [orderHash: string]: { deploySrc: boolean; deployDst: boolean; withdrawSrc: boolean; withdrawDst: boolean } }>({})
  const [currentChain, setCurrentChain] = useState<string>('')
  const [toastMessage, setToastMessage] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  useEffect(() => {
    loadOrders()
    detectNetwork()
  }, [])

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToastMessage({ message, type })
    setTimeout(() => setToastMessage(null), 3000)
  }

  const detectNetwork = async () => {
    if (window.ethereum) {
      try {
        const chainId = await window.ethereum.request({ method: 'eth_chainId' })
        const chainIdNum = parseInt(chainId, 16)
        setCurrentChain(chainIdNum.toString())
      } catch (error) {
        console.error('Error detecting network:', error)
      }
    }
  }

  const switchNetwork = async (targetChain: 'sepolia' | 'monad') => {
    if (!window.ethereum) {
      showToast('MetaMask is not installed', 'error')
      return false
    }
    const config = CHAIN_CONFIG[targetChain]
    
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${config.chainId.toString(16)}` }]
      })
      
      setCurrentChain(config.chainId.toString())
      showToast(`Switched to ${config.name}`, 'success')
      return true
    } catch (switchError: any) {
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [{
              chainId: `0x${config.chainId.toString(16)}`,
              chainName: config.name,
              rpcUrls: [config.rpcUrl],
              blockExplorerUrls: [config.explorer]
            }]
          })
          
          setCurrentChain(config.chainId.toString())
          showToast(`Added and switched to ${config.name}`, 'success')
          return true
        } catch (addError) {
          console.error('Error adding network:', addError)
          showToast(`Failed to add ${config.name} network`, 'error')
          return false
        }
      } else {
        console.error('Error switching network:', switchError)
        showToast(`Failed to switch to ${config.name}`, 'error')
        return false
      }
    }
  }

  const loadOrders = async () => {
    try {
      setIsLoading(true)
      const rawOrders = await orderService.getAllOrders()
      setOrders(rawOrders)
    } catch (e) {
      console.error('Error loading orders:', e)
      showToast('Failed to load orders', 'error')
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusColor = (status: string | OrderStatus) => {
    const statusStr = typeof status === 'string' ? status.toUpperCase() : status
    
    switch (statusStr) {
      case 'PENDING': case OrderStatus.PENDING: return 'text-yellow-400 bg-yellow-400/20'
      case 'AWAITING_ESCROW': case OrderStatus.AWAITING_ESCROW: return 'text-blue-400 bg-blue-400/20'
      case 'ESCROWED': case OrderStatus.ESCROWED: return 'text-purple-400 bg-purple-400/20'
      case 'FILLED': case OrderStatus.FILLED: return 'text-aurora-green bg-aurora-green/20'
      case 'EXPIRED': case OrderStatus.EXPIRED: return 'text-crimson-red bg-crimson-red/20'
      case 'CANCELLED': case OrderStatus.CANCELLED: return 'text-stardust-gray bg-stardust-gray/20'
      default: return 'text-stardust-gray bg-stardust-gray/20'
    }
  }

  const formatAmount = (amount: string, decimals: number = 18) => {
    try { return ethers.formatUnits(amount, decimals) } catch { return amount }
  }

  const getProviderAndSigner = useCallback(async () => {
    if (!window.ethereum) throw new Error("MetaMask is not installed.");
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    return { provider, signer };
  }, []);

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text)
      showToast(`${label} copied to clipboard!`)
    } catch (error) {
      console.error(`Failed to copy ${label}`)
      showToast(`Failed to copy ${label}`, 'error')
    }
  }

  const deployResolverContract = async (chain: 'sepolia' | 'monad') => {
    setDeployingResolver(prev => ({ ...prev, [chain]: true }))

    try {
      const switched = await switchNetwork(chain)
      if (!switched) return;

      const config = CHAIN_CONFIG[chain]
      const { signer } = await getProviderAndSigner()
      
      const factory = new ethers.ContractFactory(ABI, bytecode, signer)
      const contract = await factory.deploy(config.factory, config.lop, await signer.getAddress())
      
      await contract.waitForDeployment()
      const contractAddress = await contract.getAddress()
      
      setDeployedContracts(prev => ({ ...prev, [chain]: contractAddress }))
      showToast(`${config.name} resolver contract deployed successfully!`)
      
    } catch (error: any) {
      console.error(`Error deploying ${chain} resolver contract:`, error)
      showToast(`Failed to deploy ${chain} resolver contract: ${error.message}`, 'error')
    } finally {
      setDeployingResolver(prev => ({ ...prev, [chain]: false }))
    }
  }

  const executeResolverOperation = async (orderHash: string, operation: 'deploySrc' | 'deployDst' | 'withdrawSrc' | 'withdrawDst') => {
    if (!deployedContracts.sepolia || !deployedContracts.monad) {
      showToast('Resolver contracts not deployed on both chains', 'error'); return;
    }

    const order = orders.find(o => o.orderHash === orderHash)
    if (!order) {
      showToast('Order not found', 'error'); return;
    }

    setOperatingOrders(prev => ({ ...prev, [orderHash]: { ...prev[orderHash], [operation]: true } }))

    try {
      let targetChain: 'sepolia' | 'monad'
      const srcChainId = CHAIN_CONFIG.sepolia.chainId;
      const dstChainId = CHAIN_CONFIG.monad.chainId;

      switch (operation) {
        case 'deploySrc': case 'withdrawSrc': targetChain = 'sepolia'; break;
        case 'deployDst': case 'withdrawDst': targetChain = 'monad'; break;
      }

      const switched = await switchNetwork(targetChain); if (!switched) return;

      const { signer } = await getProviderAndSigner()
      const sdkOrder = toSdkOrder(order)
      const resolverContract = new ResolverClient(deployedContracts.sepolia!, deployedContracts.monad!);
      const currentEscrows = escrowAddresses[orderHash] || {};

      switch (operation) {
        case 'deploySrc': {
          const fillAmount = BigInt(order.makingAmount)
          const signature = order.signature;
          if (!signature) throw new Error("Signature not found for this order.");
          
          const takerTraits = Sdk.TakerTraits.default().setAmountMode(Sdk.AmountMode.maker).setAmountThreshold(BigInt(order.takingAmount))
          const txRequest = resolverContract.deploySrc(srcChainId, sdkOrder, signature, takerTraits, fillAmount)
          
          const tx = await signer.sendTransaction(txRequest)
          const receipt = await tx.wait();
          if (!receipt) throw new Error("Transaction failed, no receipt found.");
          
          showToast('Source escrow deployed successfully!')

          const srcFactory = new ethers.Contract(CHAIN_CONFIG.sepolia.factory, ['function getSourceImpl() view returns (address)', 'function getSrcEscrowAddress(tuple(bytes32,bytes32,address,address,address,uint256,uint256,tuple(uint32,uint32,uint32,uint32,uint32,uint32,uint32)),address) view returns (address)'], signer)
          const ESCROW_SRC_IMPLEMENTATION = await srcFactory.getSourceImpl()
          const srcImmutables = sdkOrder.toSrcImmutables(srcChainId, new Address(resolverContract.srcAddress), fillAmount, sdkOrder.escrowExtension.hashLockInfo)
          const srcEscrowAddress = await srcFactory.getSrcEscrowAddress(srcImmutables.build(), ESCROW_SRC_IMPLEMENTATION)
          
          setEscrowAddresses(prev => ({ ...prev, [orderHash]: { ...prev[orderHash], src: srcEscrowAddress } }));
          setOrders(prev => prev.map(o => o.orderHash === orderHash ? { ...o, status: OrderStatus.ESCROWED } : o));
          break
        }
          
        case 'deployDst': {
          const srcImmutables = sdkOrder.toSrcImmutables(srcChainId, new Address(resolverContract.srcAddress), BigInt(order.makingAmount), sdkOrder.escrowExtension.hashLockInfo)
          
          // FIXED: Use the static .new() factory method instead of the private constructor.
          const dstImmutables = srcImmutables
            .withComplement(Sdk.DstImmutablesComplement.new({
                maker: new Address(order.maker),
                amount: BigInt(order.takingAmount),
                token: new Address(order.takerAsset),
                safetyDeposit: BigInt(order.Safety_deposit),
            }))
            .withTaker(new Address(resolverContract.dstAddress))
          
          const txRequest = resolverContract.deployDst(dstImmutables)
          const tx = await signer.sendTransaction(txRequest)
          const receipt = await tx.wait()
          if (!receipt || !receipt.blockNumber) throw new Error("Transaction failed, no receipt or block number found.");
          
          showToast('Destination escrow deployed successfully!')
          
          const dstFactory = new ethers.Contract(CHAIN_CONFIG.monad.factory, ['function getDestinationImpl() view returns (address)', 'function getDstEscrowAddress(tuple(bytes32,bytes32,address,address,address,uint256,uint256,tuple(uint32,uint32,uint32,uint32,uint32,uint32,uint32)),tuple(uint256,uint256),uint256,address,address) view returns (address)'], signer)
          
          const block = await signer.provider.getBlock(receipt.blockNumber)
          if (!block) throw new Error("Could not fetch block data for the transaction.");
          
          const dstDeployedAt = BigInt(block.timestamp)
          const ESCROW_DST_IMPLEMENTATION = await dstFactory.getDestinationImpl()
          const dstEscrowAddress = await dstFactory.getDstEscrowAddress(srcImmutables.build(), { srcChainId: BigInt(srcChainId), dstChainId: BigInt(dstChainId) }, dstDeployedAt, resolverContract.dstAddress, ESCROW_DST_IMPLEMENTATION)
          
          setEscrowAddresses(prev => ({ ...prev, [orderHash]: { ...prev[orderHash], dst: dstEscrowAddress } }));
          setOrders(prev => prev.map(o => o.orderHash === orderHash ? { ...o, status: OrderStatus.ESCROWED } : o));
          break
        }
          
        case 'withdrawSrc': {
          if (!currentEscrows.src) throw new Error('Source escrow has not been deployed or its address is missing.');
          
          const srcImmutables = sdkOrder.toSrcImmutables(srcChainId, new Address(resolverContract.srcAddress), BigInt(order.makingAmount), sdkOrder.escrowExtension.hashLockInfo)
          const txRequest = resolverContract.withdraw('src', currentEscrows.src, order.secret, srcImmutables)
          const tx = await signer.sendTransaction(txRequest)
          await tx.wait()
          showToast('Successfully withdrew from source escrow!')
          break
        }
          
        case 'withdrawDst': {
          if (!currentEscrows.dst) throw new Error('Destination escrow has not been deployed or its address is missing.');
          
          const srcImmutables = sdkOrder.toSrcImmutables(srcChainId, new Address(resolverContract.srcAddress), BigInt(order.makingAmount), sdkOrder.escrowExtension.hashLockInfo)

          // FIXED: Use the static .new() factory method here as well.
          const dstImmutables = srcImmutables
            .withComplement(Sdk.DstImmutablesComplement.new({
                maker: new Address(order.maker),
                amount: BigInt(order.takingAmount),
                token: new Address(order.takerAsset),
                safetyDeposit: BigInt(order.Safety_deposit),
            }))
            .withTaker(new Address(resolverContract.dstAddress))
          
          const dstFactory = new ethers.Contract(CHAIN_CONFIG.monad.factory, ['function getDeploymentTimestamp(address) view returns (uint256)'], signer)
          const dstDeployedAt = await dstFactory.getDeploymentTimestamp(currentEscrows.dst)
          const txRequest = resolverContract.withdraw('dst', currentEscrows.dst, order.secret, dstImmutables.withDeployedAt(dstDeployedAt))
          const tx = await signer.sendTransaction(txRequest)
          await tx.wait()
          
          setOrders(prev => prev.map(o => o.orderHash === orderHash ? { ...o, status: OrderStatus.FILLED } : o));
          showToast('Successfully withdrew from destination escrow! Order completed.')
          break
        }
      }
      
    } catch (error: any) {
      console.error(`Error executing ${operation}:`, error)
      showToast(`Error executing ${operation}: ${error.message}`, 'error')
    } finally {
      setOperatingOrders(prev => ({ ...prev, [orderHash]: { ...prev[orderHash], [operation]: false } }))
    }
  }
  
  return (
    <div className="min-h-screen pt-20 pb-10">
      {toastMessage && (
        <motion.div initial={{ opacity: 0, y: -50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -50 }} className={`fixed top-4 right-4 z-50 px-4 py-2 rounded-lg text-white ${ toastMessage.type === 'success' ? 'bg-green-500' : 'bg-red-500' }`}>
          {toastMessage.message}
        </motion.div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Scale className="w-8 h-8 text-cosmic-purple mr-3" />
            <h1 className="text-4xl font-bold text-cosmic-white">Resolver Dashboard</h1>
          </div>
          <p className="text-xl text-stardust-gray max-w-3xl mx-auto">All cross-chain swap orders</p>
          {currentChain && (
            <div className="mt-4 flex items-center justify-center">
              <div className="px-3 py-1 bg-meteor-gray/20 rounded-full text-sm text-stardust-gray">
                Current Network: {SUPPORTED_CHAINS[parseInt(currentChain)]?.name || `Chain ${currentChain}`}
              </div>
            </div>
          )}
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card className="p-6 mb-8">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-cosmic-white mb-2">Deploy Resolver Contracts</h2>
              <p className="text-stardust-gray">Deploy resolver contracts on both chains to facilitate cross-chain swaps</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-4 bg-meteor-gray/20 rounded-lg border border-meteor-gray/50">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                    <h3 className="text-lg font-semibold text-cosmic-white">Sepolia Testnet</h3>
                  </div>
                  <span className="text-xs text-blue-400 bg-blue-400/20 px-2 py-1 rounded-full">Chain ID: 11155111</span>
                </div>
                <div className="space-y-3">
                  <div className="text-sm text-stardust-gray">
                    <p>Deploy resolver contract on Sepolia testnet to handle source chain operations.</p>
                    <p className="mt-1 text-xs">Factory: {formatAddress(CHAIN_CONFIG.sepolia.factory)}</p>
                    <p className="text-xs">LOP: {formatAddress(CHAIN_CONFIG.sepolia.lop)}</p>
                  </div>
                  <button onClick={() => deployResolverContract('sepolia')} disabled={deployingResolver.sepolia} className="w-full px-4 py-3 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-500/50 text-white rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2">
                    {deployingResolver.sepolia ? (<><div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div><span>Deploying...</span></>) : (<><Scale className="w-4 h-4" /><span>Deploy on Sepolia</span></>)}
                  </button>
                  {deployedContracts.sepolia && (<div className="mt-3 p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg"><div className="flex items-center justify-between"><span className="text-xs text-blue-400 font-medium">Contract Address:</span><div className="flex items-center space-x-2"><button onClick={() => copyToClipboard(deployedContracts.sepolia!, 'Sepolia Contract')} className="text-xs text-blue-400 hover:underline font-mono">{formatAddress(deployedContracts.sepolia!)}</button><button onClick={() => window.open(`${CHAIN_CONFIG.sepolia.explorer}/address/${deployedContracts.sepolia}`, '_blank')} className="text-blue-400 hover:text-blue-300"><ExternalLink className="w-3 h-3" /></button></div></div></div>)}
                </div>
              </div>
              <div className="p-4 bg-meteor-gray/20 rounded-lg border border-meteor-gray/50">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-purple-400 rounded-full"></div>
                    <h3 className="text-lg font-semibold text-cosmic-white">Monad Testnet</h3>
                  </div>
                  <span className="text-xs text-purple-400 bg-purple-400/20 px-2 py-1 rounded-full">Chain ID: 41454</span>
                </div>
                <div className="space-y-3">
                  <div className="text-sm text-stardust-gray">
                    <p>Deploy resolver contract on Monad testnet to handle destination chain operations.</p>
                    <p className="mt-1 text-xs">Factory: {formatAddress(CHAIN_CONFIG.monad.factory)}</p>
                    <p className="text-xs">LOP: {formatAddress(CHAIN_CONFIG.monad.lop)}</p>
                  </div>
                  <button onClick={() => deployResolverContract('monad')} disabled={deployingResolver.monad} className="w-full px-4 py-3 bg-purple-500 hover:bg-purple-600 disabled:bg-purple-500/50 text-white rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2">
                    {deployingResolver.monad ? (<><div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div><span>Deploying...</span></>) : (<><Scale className="w-4 h-4" /><span>Deploy on Monad</span></>)}
                  </button>
                  {deployedContracts.monad && (<div className="mt-3 p-3 bg-purple-500/10 border border-purple-500/30 rounded-lg"><div className="flex items-center justify-between"><span className="text-xs text-purple-400 font-medium">Contract Address:</span><div className="flex items-center space-x-2"><button onClick={() => copyToClipboard(deployedContracts.monad!, 'Monad Contract')} className="text-xs text-purple-400 hover:underline font-mono">{formatAddress(deployedContracts.monad!)}</button><button onClick={() => window.open(`${CHAIN_CONFIG.monad.explorer}/address/${deployedContracts.monad}`, '_blank')} className="text-purple-400 hover:text-purple-300"><ExternalLink className="w-3 h-3" /></button></div></div></div>)}
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {isLoading ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center justify-center py-20">
            <div className="text-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cosmic-purple mx-auto mb-4"></div><p className="text-stardust-gray">Loading orders...</p></div>
          </motion.div>
        ) : orders.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
            <Scale className="w-16 h-16 text-stardust-gray mx-auto mb-4 opacity-50" /><h3 className="text-xl font-semibold text-cosmic-white mb-2">No Orders Found</h3><p className="text-stardust-gray">No cross-chain swap orders available at the moment.</p>
          </motion.div>
        ) : (
          <div className="space-y-6">
            {orders.map((order, index) => (
              <motion.div key={order.orderHash || index} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}>
                <Card className="p-6 hover:border-cosmic-purple/50 transition-all duration-300">
                  <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex items-center space-x-3 mb-2 sm:mb-0">
                        {order.status && <div className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>{order.status.toString().toUpperCase().replace('_', ' ')}</div>}
                        <div className="text-sm text-stardust-gray flex items-center space-x-1"><Clock className="w-3 h-3" /><span>{order.timestamp ? new Date(Number(order.timestamp) * 1000).toLocaleDateString() : 'N/A'}</span></div>
                      </div>
                      <div className="flex items-center space-x-2"><span className="text-xs text-cosmic-white font-mono">{order.orderHash ? formatAddress(order.orderHash) : 'No Hash'}</span><button onClick={() => copyToClipboard(order.orderHash || '', 'Order Hash')} className="text-stardust-gray hover:text-cosmic-white"><Copy className="w-3 h-3" /></button></div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-meteor-gray/20 rounded-lg">
                      <div>
                        <h4 className="text-sm font-medium text-cosmic-white mb-2">From (Source Chain)</h4>
                        <p className="text-sm text-stardust-gray">Maker: {formatAddress(order.maker || '')}</p><p className="text-sm text-stardust-gray">Amount: {formatAmount(order.makingAmount || '0')}</p><p className="text-sm text-stardust-gray">Token: {order.fromTokenSymbol || formatAddress(order.makerAsset || '')}</p><p className="text-sm text-stardust-gray">Chain: {SUPPORTED_CHAINS[order.srcChainId]?.name || order.srcChainId || 'N/A'}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-cosmic-white mb-2">To (Destination Chain)</h4>
                        <p className="text-sm text-stardust-gray">Receiver: {formatAddress(order.maker || '')}</p><p className="text-sm text-stardust-gray">Amount: {formatAmount(order.takingAmount || '0')}</p><p className="text-sm text-stardust-gray">Token: {order.toTokenSymbol || formatAddress(order.takerAsset || '')}</p><p className="text-sm text-stardust-gray">Chain: {SUPPORTED_CHAINS[order.dstChainId]?.name || order.dstChainId || 'N/A'}</p>
                      </div>
                    </div>

                    {deployedContracts.sepolia && deployedContracts.monad && (
                      <div className="p-4 bg-cosmic-purple/5 border border-cosmic-purple/20 rounded-lg">
                        <h4 className="text-sm font-medium text-cosmic-white mb-3 flex items-center"><Shield className="w-4 h-4 mr-2" />Resolver Operations</h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                          <button onClick={() => executeResolverOperation(order.orderHash, 'deploySrc')} disabled={!order.orderHash || operatingOrders[order.orderHash]?.deploySrc} className="px-3 py-2 bg-blue-500/20 hover:bg-blue-500/30 disabled:bg-blue-500/10 border border-blue-500/30 text-blue-400 rounded-lg text-xs transition-colors duration-200 flex items-center justify-center space-x-1">{operatingOrders[order.orderHash]?.deploySrc ? <div className="animate-spin rounded-full h-3 w-3 border-b border-blue-400"></div> : <span>Deploy Src</span>}</button>
                          <button onClick={() => executeResolverOperation(order.orderHash, 'deployDst')} disabled={!order.orderHash || operatingOrders[order.orderHash]?.deployDst} className="px-3 py-2 bg-purple-500/20 hover:bg-purple-500/30 disabled:bg-purple-500/10 border border-purple-500/30 text-purple-400 rounded-lg text-xs transition-colors duration-200 flex items-center justify-center space-x-1">{operatingOrders[order.orderHash]?.deployDst ? <div className="animate-spin rounded-full h-3 w-3 border-b border-purple-400"></div> : <span>Deploy Dst</span>}</button>
                          <button onClick={() => executeResolverOperation(order.orderHash, 'withdrawSrc')} disabled={!order.orderHash || operatingOrders[order.orderHash]?.withdrawSrc} className="px-3 py-2 bg-green-500/20 hover:bg-green-500/30 disabled:bg-green-500/10 border border-green-500/30 text-green-400 rounded-lg text-xs transition-colors duration-200 flex items-center justify-center space-x-1">{operatingOrders[order.orderHash]?.withdrawSrc ? <div className="animate-spin rounded-full h-3 w-3 border-b border-green-400"></div> : <span>Withdraw Src</span>}</button>
                          <button onClick={() => executeResolverOperation(order.orderHash, 'withdrawDst')} disabled={!order.orderHash || operatingOrders[order.orderHash]?.withdrawDst} className="px-3 py-2 bg-orange-500/20 hover:bg-orange-500/30 disabled:bg-orange-500/10 border border-orange-500/30 text-orange-400 rounded-lg text-xs transition-colors duration-200 flex items-center justify-center space-x-1">{operatingOrders[order.orderHash]?.withdrawDst ? <div className="animate-spin rounded-full h-3 w-3 border-b border-orange-400"></div> : <span>Withdraw Dst</span>}</button>
                        </div>
                        <div className="mt-3 text-xs text-stardust-gray"><p className="flex items-center"><AlertCircle className="w-3 h-3 mr-1" />Network will automatically switch when executing operations</p></div>
                      </div>
                    )}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-stardust-gray">
                      <div className="space-y-1"><div><span className="text-cosmic-white">Salt:</span> {order.salt || 'N/A'}</div><div><span className="text-cosmic-white">Nonce:</span> {order.nonce || 'N/A'}</div><div><span className="text-cosmic-white">Secret:</span> {order.secret ? formatAddress(order.secret) : 'N/A'}</div></div>
                      <div className="space-y-1"><div><span className="text-cosmic-white">Safety Deposit:</span> {formatAmount(order.Safety_deposit || '0')} ETH</div><div><span className="text-cosmic-white">Resolver:</span> {formatAddress(order.resolverAddress || '')}</div>{order.timeLocks && <div><span className="text-cosmic-white">Src Withdrawal:</span> {new Date(parseInt(order.timeLocks.srcWithdrawal) * 1000).toLocaleString()}</div>}</div>
                    </div>
                    {order.timeLocks && (<details className="mt-4"><summary className="cursor-pointer text-sm text-cosmic-purple hover:text-cosmic-purple/80 mb-2">View Time Locks Details</summary><div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-3 bg-meteor-gray/10 rounded-lg text-xs text-stardust-gray"><div><h5 className="text-cosmic-white font-medium mb-2">Source Chain Time Locks</h5><div className="space-y-1"><div>Withdrawal: {new Date(parseInt(order.timeLocks.srcWithdrawal) * 1000).toLocaleString()}</div><div>Public Withdrawal: {new Date(parseInt(order.timeLocks.srcPublicWithdrawal) * 1000).toLocaleString()}</div><div>Cancellation: {new Date(parseInt(order.timeLocks.srcCancellation) * 1000).toLocaleString()}</div><div>Public Cancellation: {new Date(parseInt(order.timeLocks.srcPublicCancellation) * 1000).toLocaleString()}</div></div></div><div><h5 className="text-cosmic-white font-medium mb-2">Destination Chain Time Locks</h5><div className="space-y-1"><div>Withdrawal: {new Date(parseInt(order.timeLocks.dstWithdrawal) * 1000).toLocaleString()}</div><div>Public Withdrawal: {new Date(parseInt(order.timeLocks.dstPublicWithdrawal) * 1000).toLocaleString()}</div><div>Cancellation: {new Date(parseInt(order.timeLocks.dstCancellation) * 1000).toLocaleString()}</div></div></div></div></details>)}
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default ResolverPage
