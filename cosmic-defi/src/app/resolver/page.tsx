'use client'
import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Scale, 
  Search, 
  Filter, 
  ChevronDown, 
  Clock, 
  ExternalLink, 
  Zap, 
  Shield, 
  Network,
  ArrowRightLeft,
  Eye,
  Copy,
  CheckCircle,
  AlertCircle,
  Loader,
  RefreshCw,
  Info
} from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { ResolverOrder, OrderStatus } from '@/types/resolverTypes'
import { mockOrderService } from '@/services/mockOrderService'
import toast from 'react-hot-toast'

// Chain configurations
const SUPPORTED_CHAINS = {
  1: { name: 'Ethereum', color: 'text-blue-400', bg: 'bg-blue-500/20', explorer: 'https://etherscan.io' },
  11155111: { name: 'Sepolia', color: 'text-blue-300', bg: 'bg-blue-400/20', explorer: 'https://sepolia.etherscan.io' },
  41454: { name: 'Monad', color: 'text-purple-400', bg: 'bg-purple-500/20', explorer: 'https://testnet-explorer.monad.xyz' },
}

export default function ResolverPage() {
  const [orders, setOrders] = useState<ResolverOrder[]>([])
  const [filteredOrders, setFilteredOrders] = useState<ResolverOrder[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all')
  const [deployingContracts, setDeployingContracts] = useState<{ [orderHash: string]: { src: boolean; dest: boolean } }>({})
  const [withdrawing, setWithdrawing] = useState<{ [orderHash: string]: { src: boolean; dest: boolean } }>({})

  // Load orders on component mount
  useEffect(() => {
    loadOrders()
  }, [])

  // Filter orders based on search and status
  useEffect(() => {
    let filtered = orders

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(order => 
        order.orderHash.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.maker.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.fromTokenSymbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.toTokenSymbol.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(order => order.status === statusFilter)
    }

    setFilteredOrders(filtered)
  }, [orders, searchTerm, statusFilter])

  const loadOrders = async () => {
    try {
      setIsLoading(true)
      // TODO: Replace with actual API call when MongoDB is integrated
      const allOrders = await mockOrderService.getAllOrders()
      setOrders(allOrders)
    } catch (error) {
      console.error('Error loading orders:', error)
      toast.error('Failed to load orders')
    } finally {
      setIsLoading(false)
    }
  }

  const deploySrcContract = async (order: ResolverOrder) => {
    if (!order.orderHash) return

    setDeployingContracts(prev => ({
      ...prev,
      [order.orderHash]: { ...prev[order.orderHash], src: true }
    }))

    try {
      toast.loading('Deploying source escrow contract...', { duration: 3000 })
      
      // Simulate contract deployment
      await new Promise(resolve => setTimeout(resolve, 2500))
      
      // Generate mock contract address
      const contractAddress = `0x${Math.random().toString(16).substring(2, 42)}`
      
      // TODO: Replace with actual contract deployment when backend is ready
      await mockOrderService.updateOrder(order.orderHash, {
        srcContractDeployed: true,
        srcContractAddress: contractAddress
      })
      
      // Update local state
      setOrders(prev => prev.map(o => 
        o.orderHash === order.orderHash 
          ? { ...o, srcContractDeployed: true, srcContractAddress: contractAddress }
          : o
      ))
      
      toast.success('Source escrow contract deployed successfully!')
      
    } catch (error) {
      console.error('Error deploying source contract:', error)
      toast.error('Failed to deploy source contract')
    } finally {
      setDeployingContracts(prev => ({
        ...prev,
        [order.orderHash]: { ...prev[order.orderHash], src: false }
      }))
    }
  }

  const deployDestContract = async (order: ResolverOrder) => {
    if (!order.orderHash) return

    setDeployingContracts(prev => ({
      ...prev,
      [order.orderHash]: { ...prev[order.orderHash], dest: true }
    }))

    try {
      toast.loading('Deploying destination escrow contract...', { duration: 3000 })
      
      // Simulate contract deployment
      await new Promise(resolve => setTimeout(resolve, 2500))
      
      // Generate mock contract address
      const contractAddress = `0x${Math.random().toString(16).substring(2, 42)}`
      
      // TODO: Replace with actual contract deployment when backend is ready
      await mockOrderService.updateOrder(order.orderHash, {
        destContractDeployed: true,
        destContractAddress: contractAddress
      })
      
      // Update local state
      setOrders(prev => prev.map(o => 
        o.orderHash === order.orderHash 
          ? { ...o, destContractDeployed: true, destContractAddress: contractAddress }
          : o
      ))
      
      toast.success('Destination escrow contract deployed successfully!')
      
    } catch (error) {
      console.error('Error deploying destination contract:', error)
      toast.error('Failed to deploy destination contract')
    } finally {
      setDeployingContracts(prev => ({
        ...prev,
        [order.orderHash]: { ...prev[order.orderHash], dest: false }
      }))
    }
  }

  const withdrawSrc = async (order: ResolverOrder) => {
    if (!order.orderHash) return

    setWithdrawing(prev => ({
      ...prev,
      [order.orderHash]: { ...prev[order.orderHash], src: true }
    }))

    try {
      toast.loading('Withdrawing from source escrow...', { duration: 3000 })
      
      // Simulate withdrawal
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // TODO: Replace with actual withdrawal when backend is ready
      toast.success('Successfully withdrawn from source escrow!')
      
    } catch (error) {
      console.error('Error withdrawing from source:', error)
      toast.error('Failed to withdraw from source escrow')
    } finally {
      setWithdrawing(prev => ({
        ...prev,
        [order.orderHash]: { ...prev[order.orderHash], src: false }
      }))
    }
  }

  const withdrawDest = async (order: ResolverOrder) => {
    if (!order.orderHash) return

    setWithdrawing(prev => ({
      ...prev,
      [order.orderHash]: { ...prev[order.orderHash], dest: true }
    }))

    try {
      toast.loading('Withdrawing from destination escrow...', { duration: 3000 })
      
      // Simulate withdrawal
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // TODO: Replace with actual withdrawal and status update when backend is ready
      await mockOrderService.updateOrder(order.orderHash, {
        status: OrderStatus.FILLED
      })
      
      // Update local state
      setOrders(prev => prev.map(o => 
        o.orderHash === order.orderHash 
          ? { ...o, status: OrderStatus.FILLED }
          : o
      ))
      
      toast.success('Successfully withdrawn from destination escrow!')
      
    } catch (error) {
      console.error('Error withdrawing from destination:', error)
      toast.error('Failed to withdraw from destination escrow')
    } finally {
      setWithdrawing(prev => ({
        ...prev,
        [order.orderHash]: { ...prev[order.orderHash], dest: false }
      }))
    }
  }

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text)
      toast.success(`${label} copied to clipboard!`)
    } catch (error) {
      toast.error(`Failed to copy ${label}`)
    }
  }

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.PENDING: return 'text-yellow-400 bg-yellow-400/20'
      case OrderStatus.AWAITING_ESCROW: return 'text-blue-400 bg-blue-400/20'
      case OrderStatus.ESCROWED: return 'text-purple-400 bg-purple-400/20'
      case OrderStatus.FILLED: return 'text-aurora-green bg-aurora-green/20'
      case OrderStatus.EXPIRED: return 'text-crimson-red bg-crimson-red/20'
      case OrderStatus.CANCELLED: return 'text-stardust-gray bg-stardust-gray/20'
      default: return 'text-stardust-gray bg-stardust-gray/20'
    }
  }

  const formatAmount = (amount: string, decimals: number = 18) => {
    const value = parseFloat(amount) / Math.pow(10, decimals)
    return value.toFixed(6)
  }

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  return (
    <div className="min-h-screen pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center mb-4">
            <Scale className="w-8 h-8 text-cosmic-purple mr-3" />
            <h1 className="text-4xl font-bold text-cosmic-white">
              Resolver Dashboard
            </h1>
          </div>
          <p className="text-xl text-stardust-gray max-w-3xl mx-auto">
            Manage cross-chain swap orders, deploy escrow contracts, and facilitate secure token transfers across blockchain networks.
          </p>
          
          {/* Development Notice */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-6 p-4 bg-cosmic-purple/10 border border-cosmic-purple/30 rounded-lg max-w-2xl mx-auto"
          >
            <div className="flex items-center justify-center space-x-2 text-cosmic-purple">
              <Info className="w-5 h-5" />
              <span className="text-sm font-medium">
                Currently using mock data - MongoDB integration pending
              </span>
            </div>
          </motion.div>
        </motion.div>

        {/* Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="p-6 mb-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              {/* Search */}
              <div className="flex-1 max-w-md">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-stardust-gray w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search orders by hash, maker, or tokens..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-asteroid-gray border border-meteor-gray rounded-lg text-cosmic-white placeholder-stardust-gray focus:border-cosmic-purple focus:outline-none transition-colors"
                  />
                </div>
              </div>

              {/* Filter */}
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-stardust-gray w-4 h-4" />
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value as OrderStatus | 'all')}
                    className="pl-10 pr-8 py-2 bg-asteroid-gray border border-meteor-gray rounded-lg text-cosmic-white focus:border-cosmic-purple focus:outline-none appearance-none cursor-pointer transition-colors"
                  >
                    <option value="all">All Status</option>
                    <option value={OrderStatus.PENDING}>Pending</option>
                    <option value={OrderStatus.AWAITING_ESCROW}>Awaiting Escrow</option>
                    <option value={OrderStatus.ESCROWED}>Escrowed</option>
                    <option value={OrderStatus.FILLED}>Filled</option>
                    <option value={OrderStatus.EXPIRED}>Expired</option>
                    <option value={OrderStatus.CANCELLED}>Cancelled</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-stardust-gray w-4 h-4" />
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={loadOrders}
                  className="flex items-center space-x-2 hover:border-cosmic-purple/50 transition-colors"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Refresh</span>
                </Button>
              </div>
            </div>

            {/* Stats */}
            <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-3 bg-meteor-gray/20 rounded-lg">
                <div className="text-2xl font-bold text-cosmic-white">{orders.length}</div>
                <div className="text-sm text-stardust-gray">Total Orders</div>
              </div>
              <div className="text-center p-3 bg-meteor-gray/20 rounded-lg">
                <div className="text-2xl font-bold text-yellow-400">
                  {orders.filter(o => o.status === OrderStatus.PENDING).length}
                </div>
                <div className="text-sm text-stardust-gray">Pending</div>
              </div>
              <div className="text-center p-3 bg-meteor-gray/20 rounded-lg">
                <div className="text-2xl font-bold text-purple-400">
                  {orders.filter(o => o.status === OrderStatus.ESCROWED).length}
                </div>
                <div className="text-sm text-stardust-gray">Escrowed</div>
              </div>
              <div className="text-center p-3 bg-meteor-gray/20 rounded-lg">
                <div className="text-2xl font-bold text-aurora-green">
                  {orders.filter(o => o.status === OrderStatus.FILLED).length}
                </div>
                <div className="text-sm text-stardust-gray">Completed</div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Orders List */}
        {isLoading ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center justify-center py-20"
          >
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cosmic-purple mx-auto mb-4"></div>
              <p className="text-stardust-gray">Loading orders...</p>
            </div>
          </motion.div>
        ) : filteredOrders.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <Scale className="w-16 h-16 text-stardust-gray mx-auto mb-4 opacity-50" />
            <h3 className="text-xl font-semibold text-cosmic-white mb-2">No Orders Found</h3>
            <p className="text-stardust-gray">
              {searchTerm || statusFilter !== 'all' 
                ? 'Try adjusting your search or filter criteria.' 
                : 'No cross-chain swap orders available at the moment.'}
            </p>
          </motion.div>
        ) : (
          <div className="space-y-6">
            {filteredOrders.map((order, index) => (
              <motion.div
                key={order.orderHash}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-6 hover:border-cosmic-purple/50 transition-all duration-300 group">
                  <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                    {/* Order Details */}
                    <div className="xl:col-span-2 space-y-4">
                      {/* Header */}
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center space-x-3 mb-2 sm:mb-0">
                          <div className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                            {order.status.toUpperCase().replace('_', ' ')}
                          </div>
                          <div className="text-sm text-stardust-gray flex items-center space-x-1">
                            <Clock className="w-3 h-3" />
                            <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(order.orderHash, 'Order Hash')}
                            className="text-xs hover:text-cosmic-purple transition-colors"
                          >
                            <Copy className="w-3 h-3 mr-1" />
                            {formatAddress(order.orderHash)}
                          </Button>
                        </div>
                      </div>

                      {/* Swap Details */}
                      <div className="flex items-center space-x-4 p-4 bg-meteor-gray/20 rounded-lg group-hover:bg-meteor-gray/30 transition-colors">
                        <div className="text-center">
                          <div className={`inline-block px-3 py-1 rounded-full text-xs font-medium mb-2 ${SUPPORTED_CHAINS[order.sourceChainId as keyof typeof SUPPORTED_CHAINS]?.bg || 'bg-stardust-gray/20'}`}>
                            <span className={SUPPORTED_CHAINS[order.sourceChainId as keyof typeof SUPPORTED_CHAINS]?.color || 'text-stardust-gray'}>
                              {SUPPORTED_CHAINS[order.sourceChainId as keyof typeof SUPPORTED_CHAINS]?.name || `Chain ${order.sourceChainId}`}
                            </span>
                          </div>
                          <div className="text-sm text-cosmic-white font-medium">
                            {formatAmount(order.makingAmount)} {order.fromTokenSymbol}
                          </div>
                          <div className="text-xs text-stardust-gray">
                            From: {formatAddress(order.maker)}
                          </div>
                        </div>

                        <div className="flex-1 flex items-center justify-center">
                          <ArrowRightLeft className="w-5 h-5 text-cosmic-purple" />
                        </div>

                        <div className="text-center">
                          <div className={`inline-block px-3 py-1 rounded-full text-xs font-medium mb-2 ${SUPPORTED_CHAINS[order.destinationChainId as keyof typeof SUPPORTED_CHAINS]?.bg || 'bg-stardust-gray/20'}`}>
                            <span className={SUPPORTED_CHAINS[order.destinationChainId as keyof typeof SUPPORTED_CHAINS]?.color || 'text-stardust-gray'}>
                              {SUPPORTED_CHAINS[order.destinationChainId as keyof typeof SUPPORTED_CHAINS]?.name || `Chain ${order.destinationChainId}`}
                            </span>
                          </div>
                          <div className="text-sm text-cosmic-white font-medium">
                            {formatAmount(order.takingAmount)} {order.toTokenSymbol}
                          </div>
                          <div className="text-xs text-stardust-gray">
                            To: {formatAddress(order.receiver)}
                          </div>
                        </div>
                      </div>

                      {/* Secret Hash */}
                      {order.hashLock && (
                        <div className="p-3 bg-cosmic-purple/10 border border-cosmic-purple/30 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center space-x-2">
                              <Shield className="w-4 h-4 text-cosmic-purple" />
                              <span className="text-sm font-medium text-cosmic-purple">Secret Hash</span>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => copyToClipboard(order.hashLock, 'Secret Hash')}
                              className="p-1 hover:text-cosmic-purple transition-colors"
                            >
                              <Copy className="w-3 h-3" />
                            </Button>
                          </div>
                          <div className="font-mono text-xs text-cosmic-white break-all">
                            {order.hashLock}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="space-y-4">
                      <h4 className="text-sm font-medium text-cosmic-white flex items-center">
                        <Zap className="w-4 h-4 mr-2 text-cosmic-purple" />
                        Resolver Actions
                      </h4>

                      {/* Deploy Contracts */}
                      <div className="space-y-3">
                        <div className="text-xs text-stardust-gray uppercase tracking-wide font-medium">
                          Deploy Escrow Contracts
                        </div>
                        
                        <div className="grid grid-cols-2 gap-2">
                          <Button
                            variant={order.srcContractDeployed ? "ghost" : "primary"}
                            size="sm"
                            onClick={() => deploySrcContract(order)}
                            disabled={order.srcContractDeployed || deployingContracts[order.orderHash]?.src}
                            className="flex items-center space-x-2 text-xs transition-all duration-200"
                          >
                            {deployingContracts[order.orderHash]?.src ? (
                              <Loader className="w-3 h-3 animate-spin" />
                            ) : order.srcContractDeployed ? (
                              <CheckCircle className="w-3 h-3" />
                            ) : (
                              <Network className="w-3 h-3" />
                            )}
                            <span>Deploy Src</span>
                          </Button>

                          <Button
                            variant={order.destContractDeployed ? "ghost" : "primary"}
                            size="sm"
                            onClick={() => deployDestContract(order)}
                            disabled={order.destContractDeployed || deployingContracts[order.orderHash]?.dest}
                            className="flex items-center space-x-2 text-xs transition-all duration-200"
                          >
                            {deployingContracts[order.orderHash]?.dest ? (
                              <Loader className="w-3 h-3 animate-spin" />
                            ) : order.destContractDeployed ? (
                              <CheckCircle className="w-3 h-3" />
                            ) : (
                              <Network className="w-3 h-3" />
                            )}
                            <span>Deploy Dest</span>
                          </Button>
                        </div>

                        {/* Contract Addresses */}
                        {(order.srcContractAddress || order.destContractAddress) && (
                          <div className="space-y-2 mt-3">
                            {order.srcContractAddress && (
                              <div className="text-xs">
                                <span className="text-stardust-gray">Src Contract: </span>
                                <button
                                  onClick={() => copyToClipboard(order.srcContractAddress!, 'Source Contract')}
                                  className="text-aurora-green hover:underline font-mono transition-colors"
                                >
                                  {formatAddress(order.srcContractAddress)}
                                </button>
                              </div>
                            )}
                            {order.destContractAddress && (
                              <div className="text-xs">
                                <span className="text-stardust-gray">Dest Contract: </span>
                                <button
                                  onClick={() => copyToClipboard(order.destContractAddress!, 'Destination Contract')}
                                  className="text-aurora-green hover:underline font-mono transition-colors"
                                >
                                  {formatAddress(order.destContractAddress)}
                                </button>
                              </div>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Withdraw Actions */}
                      {(order.srcContractDeployed && order.destContractDeployed) && (
                        <div className="space-y-3">
                          <div className="text-xs text-stardust-gray uppercase tracking-wide font-medium">
                            Withdraw from Escrow
                          </div>
                          
                          <div className="grid grid-cols-2 gap-2">
                            <Button
                              variant="secondary"
                              size="sm"
                              onClick={() => withdrawSrc(order)}
                              disabled={withdrawing[order.orderHash]?.src}
                              className="flex items-center space-x-2 text-xs hover:border-cosmic-purple/50 transition-all duration-200"
                            >
                              {withdrawing[order.orderHash]?.src ? (
                                <Loader className="w-3 h-3 animate-spin" />
                              ) : (
                                <ArrowRightLeft className="w-3 h-3" />
                              )}
                              <span>Withdraw Src</span>
                            </Button>

                            <Button
                              variant="secondary"
                              size="sm"
                              onClick={() => withdrawDest(order)}
                              disabled={withdrawing[order.orderHash]?.dest || order.status === OrderStatus.FILLED}
                              className="flex items-center space-x-2 text-xs hover:border-cosmic-purple/50 transition-all duration-200"
                            >
                              {withdrawing[order.orderHash]?.dest ? (
                                <Loader className="w-3 h-3 animate-spin" />
                              ) : (
                                <ArrowRightLeft className="w-3 h-3" />
                              )}
                              <span>Withdraw Dest</span>
                            </Button>
                          </div>
                        </div>
                      )}

                      {/* Order Info */}
                      <div className="pt-4 border-t border-meteor-gray/50">
                        <div className="text-xs text-stardust-gray space-y-1">
                          <div>Created: {new Date(order.createdAt).toLocaleString()}</div>
                          <div>Expires: {new Date(order.expiry).toLocaleString()}</div>
                          {order.quoteId && <div>Quote: {order.quoteId}</div>}
                          {/* TODO: Add more fields when MongoDB integration is complete */}
                        </div>
                      </div>
                    </div>
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
