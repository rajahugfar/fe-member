import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { memberLotteryAPI, OpenPeriod, LotteryRate, HuayConfig } from '@api/memberLotteryAPI'
import { memberLotteryResultsAPI, LotteryResultItem } from '@api/memberLotteryResultsAPI'
import { memberLotteryCheckAPI } from '@api/memberLotteryCheckAPI'
import { toast } from 'react-hot-toast'
import { FiClock, FiX, FiShoppingCart, FiArrowLeft } from 'react-icons/fi'
import { FaUser, FaSignOutAlt, FaCoins, FaMoneyBillWave } from 'react-icons/fa'
import { useLotteryState } from '@/hooks/useLotteryState'
import { useKeyboardInput } from '@/hooks/useKeyboardInput'
import { reloadCredit } from '@/utils/creditHelpers'
import { useAuthStore } from '@store/authStore'
import { useMemberStore } from '@store/memberStore'
import {
  BET_TYPES,
  checkDuplicate,
  shuffle_num_2,
  shuffle_num_3,
  tode4Permutations,
  formatNumber
} from '@/utils/lotteryHelpers'

// Components
import BetTypeSelector from '@/components/lottery/BetTypeSelector'
import InputModeSection from '@/components/lottery/InputModeSection'
import SpecialNumberOptions from '@/components/lottery/SpecialNumberOptions'
import CartSidebar from '@/components/lottery/CartSidebar'
import {
  BulkPriceModal,
  ConfirmationModal,
  SuccessModal
} from '@/components/lottery/LotteryModals'
import SavedTemplatesModal from '@/components/lottery/SavedTemplatesModal'

const LotteryBetting: React.FC = () => {
  const { periodId } = useParams<{ periodId: string }>()
  const navigate = useNavigate()
  const { logout, member } = useMemberStore()
  const { refreshUser } = useAuthStore()

  // Data States
  const [period, setPeriod] = useState<OpenPeriod | null>(null)
  const [rates, setRates] = useState<LotteryRate[]>([])
  const [huayConfigs, setHuayConfigs] = useState<HuayConfig[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  // Closed Period States
  const [isClosed, setIsClosed] = useState(false)
  const [lotteryResult, setLotteryResult] = useState<LotteryResultItem | null>(null)

  // Success State
  const [successPoyId, setSuccessPoyId] = useState('')
  const [successNote, setSuccessNote] = useState('')
  const [successCart, setSuccessCart] = useState<typeof cart>([])
  const [successTotalAmount, setSuccessTotalAmount] = useState(0)
  const [successTotalPotentialWin, setSuccessTotalPotentialWin] = useState(0)

  // Mobile Cart Drawer State
  const [showMobileCart, setShowMobileCart] = useState(false)

  // Saved Templates Modal State
  const [showTemplatesModal, setShowTemplatesModal] = useState(false)

  // Rules Modal State
  const [showRulesModal, setShowRulesModal] = useState(false)
  const [rulesDetail, setRulesDetail] = useState<string>('')
  const [rulesLoading, setRulesLoading] = useState(false)

  // Lottery State Hook
  const lotteryState = useLotteryState(periodId)

  const {
    selectedBetTypes,
    toggleBetType,
    setSelectedBetTypes,
    inputMode,
    setInputMode,
    numberInput,
    setNumberInput,
    cart,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    shuffleEnabled,
    setShuffleEnabled,
    searchQuery,
    setSearchQuery,
    showBulkPriceModal,
    setShowBulkPriceModal,
    showConfirmModal,
    setShowConfirmModal,
    showSuccessModal,
    setShowSuccessModal
  } = lotteryState

  // Get current bet type config (use first selected for keyboard input)
  const currentConfig = selectedBetTypes.length > 0 ? BET_TYPES[selectedBetTypes[0]] : BET_TYPES['teng_bon_3']

  // Physical Keyboard Support
  useKeyboardInput({
    enabled: inputMode === 'keyboard' && !showBulkPriceModal && !showConfirmModal && !showSuccessModal,
    maxLength: currentConfig?.digitCount || 3,
    onComplete: handleAddNumber,
    currentValue: numberInput,
    setValue: setNumberInput
  })

  // Load Data
  useEffect(() => {
    loadData()
  }, [periodId])

  const loadData = async () => {
    if (!periodId) {
      navigate('/member/lottery')
      return
    }

    setLoading(true)
    try {
      const periods = await memberLotteryAPI.getOpenPeriods()
      const foundPeriod = periods.find((p: OpenPeriod) => p.id === periodId)

      if (!foundPeriod) {
        toast.error('ไม่พบงวดหวยนี้')
        navigate('/member/lottery')
        return
      }

      setPeriod(foundPeriod)

      // Check if period is closed
      const now = new Date()
      const closeTime = new Date(foundPeriod.closeTime)
      if (now > closeTime) {
        setIsClosed(true)
        // Load lottery result
        try {
          const resultDate = foundPeriod.periodDate || foundPeriod.drawTime || foundPeriod.closeTime
          const dateStr = new Date(resultDate).toISOString().split('T')[0]
          const resultsResponse = await memberLotteryResultsAPI.getResults({ date: dateStr })
          const result = resultsResponse.data?.lotteries?.find(
            (l: LotteryResultItem) => l.huayCode === foundPeriod.huayCode
          )
          if (result) {
            setLotteryResult(result)
          }
        } catch (err) {
          console.error('Failed to load lottery result:', err)
        }
        setLoading(false)
        return
      }

      // Load huay config (default configs only, type=1 for payout)
      const configsData = await memberLotteryAPI.getHuayConfig(foundPeriod.lotteryId, 1)
      const defaultConfigs = configsData.filter(c => c.default === 1 && c.status === 1)
      setHuayConfigs(defaultConfigs)

      // Transform configs to rates format for backward compatibility
      const ratesData: LotteryRate[] = defaultConfigs.map(config => ({
        id: String(config.id),
        bet_type: config.optionType,
        multiply: config.multiply,
        min_bet: config.minPrice,
        max_bet: config.maxPrice,
        max_per_number: config.maxPricePerNum,
        is_active: config.status === 1
      }))
      setRates(ratesData)

      // Set default bet type to teng_bon_3 (3ตัวบน) if available, otherwise use first available
      if (ratesData && ratesData.length > 0) {
        const preferredBetType = ratesData.find(r => r.bet_type === 'teng_bon_3')
        setSelectedBetTypes([preferredBetType ? 'teng_bon_3' : ratesData[0].bet_type])
      }
    } catch (error) {
      console.error('Load error:', error)
      toast.error('โหลดข้อมูลไม่สำเร็จ')
    } finally {
      setLoading(false)
    }
  }

  // Helper function to add number to cart for a specific bet type
  async function addNumberForBetType(number: string, betType: string): Promise<number> {
    const rate = rates.find(r => r.bet_type === betType)
    if (!rate) return 0

    const config = BET_TYPES[betType]
    if (!config) return 0

    // Prepare numbers to add
    let numbersToAdd: string[] = [number]

    // Apply shuffle if enabled
    if (shuffleEnabled) {
      if (betType === 'tode_4') {
        numbersToAdd = tode4Permutations(number)
      } else if (betType === 'teng_bon_3' || betType === 'tode_3') {
        numbersToAdd = shuffle_num_3(number)
      } else if (betType === 'teng_bon_2' || betType === 'teng_lang_2') {
        numbersToAdd = shuffle_num_2(number)
      }
    }

    let addedCount = 0

    // Add all numbers to cart with multiply check
    for (const num of numbersToAdd) {
      // Check duplicate for each
      if (!checkDuplicate(num, betType, cart)) {
        try {
          // Check multiply for this number
          const checkResult = await memberLotteryCheckAPI.checkMultiply({
            huayId: period?.lotteryId || 1,
            stockType: period?.huayCode?.startsWith('g') ? 'g' : 's',
            huayOption: betType,
            poyNumber: num,
            multiply: rate.multiply,
            value: 1
          })

          // Use actual multiply and set initial amount to rate min_bet
          addToCart({
            bet_type: betType,
            bet_type_label: config.label,
            number: num,
            amount: rate.min_bet || 1,
            payout_rate: checkResult.multiply,
            huayName: period?.huayName,
            isSpecialNumber: checkResult.isSpecialNumber,
            soldAmount: checkResult.soldAmount,
            remainingAmount: checkResult.remainingAmount,
            maxSaleAmount: checkResult.maxSaleAmount,
            checkResult: checkResult.result
          })
          addedCount++

          // Show condition message if available
          if (checkResult.codition && checkResult.result !== 1) {
            toast(`${num}: ${checkResult.codition}`, { duration: 3000, icon: 'ℹ️' })
          }
        } catch (error) {
          console.error('Check multiply error:', error)
          // Fallback to default rate if API fails
          addToCart({
            bet_type: betType,
            bet_type_label: config.label,
            number: num,
            amount: 1,
            payout_rate: rate.multiply,
            huayName: period?.huayName
          })
          addedCount++
        }
      }
    }

    return addedCount
  }

  // Handle Add Number with multiply check
  async function handleAddNumber(number: string) {
    if (!number) return

    if (selectedBetTypes.length === 0) {
      toast.error('กรุณาเลือกประเภทการแทง')
      return
    }

    let totalAdded = 0

    // Add for all selected bet types
    for (const betType of selectedBetTypes) {
      const rate = rates.find(r => r.bet_type === betType)
      if (!rate) continue

      // Check duplicate
      if (checkDuplicate(number, betType, cart)) continue

      const added = await addNumberForBetType(number, betType)
      totalAdded += added
    }

    if (totalAdded > 1) {
      toast.success(`เพิ่ม ${totalAdded} รายการลงตะกร้าแล้ว`)
    } else if (totalAdded === 1) {
      toast.success(`เพิ่ม ${number} ลงตะกร้าแล้ว`)
    } else {
      toast.error('เลขนี้มีในตะกร้าแล้ว')
    }
  }

  // Handle Add Multiple Numbers (from special options)
  const handleAddNumbers = (numbers: string[]) => {
    if (selectedBetTypes.length === 0) return

    let addedCount = 0

    // Add for all selected bet types
    for (const betType of selectedBetTypes) {
      const rate = rates.find(r => r.bet_type === betType)
      if (!rate) continue

      const config = BET_TYPES[betType]
      if (!config) continue

      numbers.forEach(number => {
        if (!checkDuplicate(number, betType, cart)) {
          addToCart({
            bet_type: betType,
            bet_type_label: config.label,
            number,
            amount: 0,
            payout_rate: rate.multiply,
            huayName: period?.huayName
          })
          addedCount++
        }
      })
    }

    if (addedCount > 0) {
      toast.success(`เพิ่ม ${addedCount} เลขลงตะกร้าแล้ว`)
    }
  }

  // Handle Bulk Price
  const handleApplyBulkPrice = (price: number) => {
    cart.forEach(item => {
      updateCartItem(item.id, { amount: price })
    })
    toast.success(`ใส่ราคา ${price} บาท ทุกรายการแล้ว`)
  }

  // Handle Submit
  const handleSubmit = () => {
    if (cart.length === 0) {
      toast.error('กรุณาเพิ่มรายการแทงก่อน')
      return
    }

    // Check all items have amount
    const hasEmptyAmount = cart.some(item => item.amount <= 0)
    if (hasEmptyAmount) {
      toast.error('กรุณาใส่ราคาให้ครบทุกรายการ')
      return
    }

    // Show confirmation
    setShowConfirmModal(true)
  }

  // Handle Confirm
  const handleConfirm = async (note: string) => {
    if (!periodId || !period) return

    setShowConfirmModal(false)
    setSubmitting(true)

    try {
      const response = await memberLotteryAPI.placeBulkBets({
        stockId: parseInt(periodId),
        bets: cart.map(item => ({
          betType: item.bet_type,
          number: item.number,
          amount: item.amount
        })),
        note: note
      })

      // Success - Store cart data before clearing
      const currentTotalAmount = cart.reduce((sum, item) => sum + item.amount, 0)
      const currentTotalPotentialWin = cart.reduce((sum, item) => sum + item.potential_win, 0)
      
      setSuccessPoyId(response.poyId || 'N/A')
      setSuccessNote(note)
      setSuccessCart([...cart]) // Store cart snapshot
      setSuccessTotalAmount(currentTotalAmount)
      setSuccessTotalPotentialWin(currentTotalPotentialWin)
      setShowSuccessModal(true)
      clearCart() // ล้างตะกร้าหลังส่งสำเร็จ

      // Reload credit across the app
      reloadCredit()

      // Refresh user data immediately to update credit
      await refreshUser()

      toast.success('แทงหวยสำเร็จ!')
    } catch (error: any) {
      console.error('Submit error:', error)
      toast.error(error.response?.data?.message || 'แทงหวยไม่สำเร็จ')
    } finally {
      setSubmitting(false)
    }
  }

  // Handle Success Actions
  const handleViewHistory = () => {
    navigate('/member/lottery/history')
  }

  const handleBetAgain = () => {
    setShowSuccessModal(false)
    setSuccessCart([])
  }

  // Handle Show Rules
  const handleShowRules = async () => {
    if (!period?.huayCode) return

    setShowRulesModal(true)
    setRulesLoading(true)

    try {
      const rules = await memberLotteryAPI.getLotteryRules(period.huayCode)
      setRulesDetail(rules.detail || '')
    } catch (error) {
      console.error('Failed to load rules:', error)
      setRulesDetail('')
    } finally {
      setRulesLoading(false)
    }
  }

  // Handle Load Template
  const handleLoadTemplate = (items: { betType: string; number: string; amount: number }[]) => {
    let addedCount = 0
    items.forEach(item => {
      // หา config จาก BET_TYPES หรือสร้าง default
      const config = BET_TYPES[item.betType] || {
        id: item.betType,
        label: item.betType,
        digitCount: item.number.length
      }

      const rate = rates.find(r => r.bet_type === item.betType)
      // ใช้ rate ที่หาได้ หรือใช้ default multiply = 1
      const multiply = rate?.multiply || 1

      // เช็ค duplicate กับ cart ปัจจุบัน
      if (!checkDuplicate(item.number, item.betType, cart)) {
        addToCart({
          bet_type: item.betType,
          bet_type_label: config.label,
          number: item.number,
          amount: item.amount,
          payout_rate: multiply,
          huayName: period?.huayName
        })
        addedCount++
      }
    })
    if (addedCount > 0) {
      toast.success(`โหลด ${addedCount} รายการลงตะกร้าแล้ว`)
    } else {
      toast.error('เลขทั้งหมดมีในตะกร้าแล้ว')
    }
  }

  // Loading State
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-yellow-400 border-r-4 border-r-transparent mx-auto mb-4"></div>
          <p className="text-white text-xl font-semibold">กำลังโหลด...</p>
        </div>
      </div>
    )
  }

  if (!period) {
    return null
  }

  // Show lottery result if period is closed
  if (isClosed) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
        <div className="container mx-auto px-4 py-8">
          <button
            onClick={() => navigate('/member/lottery')}
            className="flex items-center gap-2 text-white hover:text-yellow-400 mb-6 transition-colors text-sm font-semibold bg-gray-700/50 hover:bg-gray-700 px-3 py-2 rounded-lg"
          >
            <FiArrowLeft className="text-base" />
            <span>กลับไปเลือกหวย</span>
          </button>

          <div className="bg-gray-800/90 rounded-xl p-6 border border-gray-700 shadow-2xl max-w-2xl mx-auto">
            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold text-white mb-2">{period.huayName}</h1>
              <p className="text-yellow-300 text-lg">{period.periodName}</p>
              <div className="mt-4 inline-block bg-red-500/20 text-red-400 px-4 py-2 rounded-lg">
                <FiClock className="inline-block mr-2" />
                ปิดรับแทงแล้ว
              </div>
            </div>

            {lotteryResult ? (
              <div className="space-y-4">
                <h2 className="text-xl font-bold text-center text-yellow-400 mb-4">ผลหวย</h2>

                <div className="grid grid-cols-2 gap-4">
                  {lotteryResult.result3Up && (
                    <div className="bg-gray-700/50 p-4 rounded-lg text-center">
                      <p className="text-gray-400 text-sm mb-1">3ตัวบน</p>
                      <p className="text-3xl font-bold text-yellow-400">{lotteryResult.result3Up}</p>
                    </div>
                  )}
                  {lotteryResult.result2Up && (
                    <div className="bg-gray-700/50 p-4 rounded-lg text-center">
                      <p className="text-gray-400 text-sm mb-1">2ตัวบน</p>
                      <p className="text-3xl font-bold text-yellow-400">{lotteryResult.result2Up}</p>
                    </div>
                  )}
                  {lotteryResult.result2Low && (
                    <div className="bg-gray-700/50 p-4 rounded-lg text-center">
                      <p className="text-gray-400 text-sm mb-1">2ตัวล่าง</p>
                      <p className="text-3xl font-bold text-yellow-400">{lotteryResult.result2Low}</p>
                    </div>
                  )}
                  {lotteryResult.result4Up && (
                    <div className="bg-gray-700/50 p-4 rounded-lg text-center">
                      <p className="text-gray-400 text-sm mb-1">4ตัวบน</p>
                      <p className="text-3xl font-bold text-yellow-400">{lotteryResult.result4Up}</p>
                    </div>
                  )}
                  {lotteryResult.result3Front && (
                    <div className="bg-gray-700/50 p-4 rounded-lg text-center">
                      <p className="text-gray-400 text-sm mb-1">3ตัวหน้า</p>
                      <p className="text-3xl font-bold text-yellow-400">{lotteryResult.result3Front}</p>
                    </div>
                  )}
                  {lotteryResult.result3Down && (
                    <div className="bg-gray-700/50 p-4 rounded-lg text-center">
                      <p className="text-gray-400 text-sm mb-1">3ตัวล่าง</p>
                      <p className="text-3xl font-bold text-yellow-400">{lotteryResult.result3Down}</p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-400 py-8">
                <p>รอประกาศผล...</p>
              </div>
            )}

            <div className="mt-6 text-center">
              <Link
                to="/member/lottery/history"
                className="inline-block bg-yellow-600 hover:bg-yellow-700 text-white px-6 py-3 rounded-lg font-semibold"
              >
                ดูประวัติการแทง
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const totalAmount = cart.reduce((sum, item) => sum + item.amount, 0)
  const totalPotentialWin = cart.reduce((sum, item) => sum + item.potential_win, 0)

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('th-TH', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount)
  }

  const handleLogout = async () => {
    try {
      logout()
      navigate('/login')
      toast.success('ออกจากระบบสำเร็จ')
    } catch (error) {
      console.error('Logout error:', error)
      toast.error('เกิดข้อผิดพลาดในการออกจากระบบ')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-72 h-72 bg-yellow-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
      </div>

      <div className="container mx-auto px-4 py-4 pb-24 lg:pb-4 relative z-10">
        {/* Lottery Info */}
        <div className="mb-4 backdrop-blur-md bg-gray-800/90 rounded-xl p-3 border border-gray-700 shadow-2xl">
          <div className="flex items-center gap-2 mb-3">
            <button
              onClick={() => navigate('/member/lottery')}
              className="flex items-center gap-2 text-white hover:text-yellow-400 transition-colors text-sm font-semibold bg-gray-700/50 hover:bg-gray-700 px-3 py-2 rounded-lg"
            >
              <FiArrowLeft className="text-base" />
              <span>กลับไปเลือกหวย</span>
            </button>
            <button
              onClick={() => setShowTemplatesModal(true)}
              className="flex items-center gap-2 text-white hover:text-green-400 transition-colors text-sm font-semibold bg-green-600/50 hover:bg-green-600 px-3 py-2 rounded-lg"
            >
              <span>โพยที่บันทึกไว้</span>
            </button>
            <button
              onClick={handleShowRules}
              className="flex items-center gap-2 text-white hover:text-yellow-400 transition-colors text-sm font-semibold bg-yellow-600/50 hover:bg-yellow-600 px-3 py-2 rounded-lg"
            >
              <span>📋 กติกา</span>
            </button>
          </div>

          <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-3">
            <div>
              <h1 className="text-2xl font-bold text-white mb-1 drop-shadow-lg">{period.huayName}</h1>
              <p className="text-yellow-300 text-base font-semibold">{period.periodName}</p>
            </div>

            <div className="text-left md:text-right">
              <div className="flex items-center gap-2 text-yellow-300 mb-1">
                <FiClock className="text-lg animate-pulse" />
                <span className="text-base font-bold">
                  ปิดรับ: {new Date(period.closeTime).toLocaleTimeString('th-TH', {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              </div>
              <div className="text-white/80 text-xs">
                {period.drawTime ? new Date(period.drawTime).toLocaleDateString('th-TH', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                }) : '-'}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Main Betting Area */}
          <div className="lg:col-span-8 space-y-3">
            {/* Bet Type Selector */}
            <BetTypeSelector
              selectedBetTypes={selectedBetTypes}
              onToggle={toggleBetType}
              rates={rates}
            />

            {/* Special Number Options */}
            <SpecialNumberOptions
              selectedBetTypes={selectedBetTypes}
              onAddNumbers={handleAddNumbers}
              shuffleEnabled={shuffleEnabled}
              setShuffleEnabled={setShuffleEnabled}
            />

            {/* Input Mode Section */}
            <InputModeSection
              inputMode={inputMode}
              setInputMode={setInputMode}
              selectedBetTypes={selectedBetTypes}
              numberInput={numberInput}
              setNumberInput={setNumberInput}
              onAddNumber={handleAddNumber}
              cart={cart}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
            />
          </div>

          {/* Cart Sidebar - Desktop Only */}
          <div className="hidden lg:block lg:col-span-4">
            <CartSidebar
              cart={cart}
              onUpdateAmount={(id, amount) => updateCartItem(id, { amount })}
              onRemoveItem={removeFromCart}
              onClearCart={clearCart}
              onUndoLast={lotteryState.undoLastAdd}
              onBulkPrice={() => setShowBulkPriceModal(true)}
              onSubmit={handleSubmit}
              submitting={submitting}
            />
          </div>
        </div>

        {/* Mobile Cart Button */}
        {cart.length > 0 && (
          <button
            onClick={() => setShowMobileCart(true)}
            className="lg:hidden fixed bottom-4 right-4 z-40 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white rounded-full px-6 py-4 shadow-2xl flex items-center gap-3 font-bold text-base animate-bounce"
          >
            <FiShoppingCart className="text-xl" />
            <span>รายการแทง ({cart.length})</span>
            <span className="bg-white text-yellow-600 px-3 py-1 rounded-full text-sm">
              {formatNumber(totalAmount)}฿
            </span>
          </button>
        )}

        {/* Mobile Cart Drawer */}
        {showMobileCart && (
          <>
            {/* Backdrop */}
            <div
              className="lg:hidden fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
              onClick={() => setShowMobileCart(false)}
            />

            {/* Drawer */}
            <div className="lg:hidden fixed inset-y-0 right-0 w-full sm:w-96 bg-gradient-to-b from-gray-900 to-gray-800 z-50 shadow-2xl overflow-y-auto p-4 border-l border-gray-700">
              <div className="h-full flex flex-col">
                {/* Close Button */}
                <button
                  onClick={() => setShowMobileCart(false)}
                  className="self-end mb-2 text-white bg-gray-700 hover:bg-gray-600 rounded-full p-2 shadow-lg"
                >
                  <FiX className="text-xl" />
                </button>

                {/* Cart Content */}
                <div className="flex-1 min-h-0">
                  <CartSidebar
                    cart={cart}
                    onUpdateAmount={(id, amount) => updateCartItem(id, { amount })}
                    onRemoveItem={removeFromCart}
                    onClearCart={clearCart}
                    onUndoLast={lotteryState.undoLastAdd}
                    onBulkPrice={() => setShowBulkPriceModal(true)}
                    onSubmit={() => {
                      handleSubmit()
                      setShowMobileCart(false)
                    }}
                    submitting={submitting}
                  />
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Modals */}
      <BulkPriceModal
        show={showBulkPriceModal}
        onClose={() => setShowBulkPriceModal(false)}
        onApply={handleApplyBulkPrice}
      />

      <ConfirmationModal
        show={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={handleConfirm}
        cart={cart}
        periodName={period.periodName || ''}
        huayName={period.huayName || ''}
      />

      <SuccessModal
        show={showSuccessModal}
        onClose={() => {
          setShowSuccessModal(false)
          setSuccessCart([])
        }}
        poyId={successPoyId}
        cart={successCart}
        totalAmount={successTotalAmount}
        totalPotentialWin={successTotalPotentialWin}
        periodName={period.periodName || ''}
        huayName={period.huayName || ''}
        note={successNote}
        onViewHistory={handleViewHistory}
        onBetAgain={handleBetAgain}
      />

      <SavedTemplatesModal
        isOpen={showTemplatesModal}
        onClose={() => setShowTemplatesModal(false)}
        onLoadTemplate={handleLoadTemplate}
        currentBets={cart.map(item => ({
          betType: item.bet_type,
          number: item.number,
          amount: item.amount
        }))}
      />

      {/* Rules Modal */}
      {showRulesModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl max-w-2xl w-full p-6 max-h-[80vh] overflow-y-auto border border-yellow-500/30 shadow-2xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <span className="text-2xl">📋</span>
                กติกา {period?.huayName}
              </h3>
              <button
                onClick={() => setShowRulesModal(false)}
                className="text-gray-400 hover:text-white transition-colors p-1"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Detail Section */}
            <div className="prose prose-sm prose-invert max-w-none mb-6">
              {rulesLoading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-yellow-400"></div>
                </div>
              ) : rulesDetail ? (
                <div
                  className="text-gray-300 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: rulesDetail }}
                />
              ) : (
                <p className="text-gray-500 text-center py-4">ไม่มีกติกา</p>
              )}
            </div>

            {/* Payout Rate Table */}
            {huayConfigs.length > 0 && (
              <div>
                <h4 className="text-lg font-bold text-yellow-400 mb-3 flex items-center gap-2">
                  <span>💰</span>
                  อัตราจ่าย
                </h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-gray-700/50">
                        <th className="px-3 py-2 text-left text-gray-300 font-semibold">ประเภท</th>
                        <th className="px-3 py-2 text-center text-gray-300 font-semibold">จ่าย</th>
                        <th className="px-3 py-2 text-center text-gray-300 font-semibold">ต่ำสุด</th>
                        <th className="px-3 py-2 text-center text-gray-300 font-semibold">สูงสุด</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(() => {
                        const betTypeLabels: { [key: string]: string } = {
                          'teng_bon_4': '4ตัวบน',
                          'tode_4': '4ตัวโต๊ด',
                          'teng_bon_3': '3ตัวบน',
                          'teng_lang_3': '3ตัวล่าง',
                          'tode_3': '3ตัวโต๊ด',
                          'teng_bon_2': '2ตัวบน',
                          'teng_lang_2': '2ตัวล่าง',
                          'teng_bon_1': 'วิ่งบน',
                          'teng_lang_1': 'วิ่งล่าง'
                        }

                        // Sort order: 4 digit -> 3 digit -> 2 digit -> 1 digit
                        const sortOrder: { [key: string]: number } = {
                          'teng_bon_4': 1,
                          'tode_4': 2,
                          'teng_bon_3': 3,
                          'teng_lang_3': 4,
                          'tode_3': 5,
                          'teng_bon_2': 6,
                          'teng_lang_2': 7,
                          'teng_bon_1': 8,
                          'teng_lang_1': 9
                        }

                        const sortedConfigs = [...huayConfigs].sort((a, b) => {
                          const orderA = sortOrder[a.optionType] || 99
                          const orderB = sortOrder[b.optionType] || 99
                          return orderA - orderB
                        })

                        return sortedConfigs.map((config) => (
                          <tr key={config.id} className="border-t border-gray-700/50 hover:bg-gray-700/30">
                            <td className="px-3 py-2 text-white">{betTypeLabels[config.optionType] || config.optionType}</td>
                            <td className="px-3 py-2 text-center text-yellow-400 font-bold">{config.multiply}</td>
                            <td className="px-3 py-2 text-center text-gray-300">{config.minPrice}</td>
                            <td className="px-3 py-2 text-center text-gray-300">{config.maxPrice}</td>
                          </tr>
                        ))
                      })()}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default LotteryBetting
