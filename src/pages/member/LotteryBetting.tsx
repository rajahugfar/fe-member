import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { memberLotteryAPI, OpenPeriod, LotteryRate, HuayConfig } from '@api/memberLotteryAPI'
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

  // Success State
  const [successPoyId, setSuccessPoyId] = useState('')
  const [successNote, setSuccessNote] = useState('')
  const [successCart, setSuccessCart] = useState<typeof cart>([])
  const [successTotalAmount, setSuccessTotalAmount] = useState(0)
  const [successTotalPotentialWin, setSuccessTotalPotentialWin] = useState(0)

  // Mobile Cart Drawer State
  const [showMobileCart, setShowMobileCart] = useState(false)

  // Lottery State Hook
  const lotteryState = useLotteryState(periodId)

  const {
    selectedBetType,
    setSelectedBetType,
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

  // Get current bet type config
  const currentConfig = BET_TYPES[selectedBetType]

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
        setSelectedBetType(preferredBetType ? 'teng_bon_3' : ratesData[0].bet_type)
      }
    } catch (error) {
      console.error('Load error:', error)
      toast.error('โหลดข้อมูลไม่สำเร็จ')
    } finally {
      setLoading(false)
    }
  }

  // Handle Add Number with multiply check
  async function handleAddNumber(number: string) {
    if (!number) return

    const rate = rates.find(r => r.bet_type === selectedBetType)
    if (!rate) {
      toast.error('ไม่พบอัตราจ่าย')
      return
    }

    // Check duplicate
    if (checkDuplicate(number, selectedBetType, cart)) {
      toast.error('เลขนี้มีในตะกร้าแล้ว')
      return
    }

    const config = BET_TYPES[selectedBetType]
    if (!config) return

    // Prepare numbers to add
    let numbersToAdd: string[] = [number]

    // Apply shuffle if enabled
    if (shuffleEnabled) {
      if (selectedBetType === '4tode') {
        numbersToAdd = tode4Permutations(number)
      } else if (selectedBetType === '3top' || selectedBetType === '3tode') {
        numbersToAdd = shuffle_num_3(number)
      } else if (selectedBetType === '2top' || selectedBetType === '2bottom') {
        numbersToAdd = shuffle_num_2(number)
      }
    }

    // Add all numbers to cart with multiply check
    for (const num of numbersToAdd) {
      // Check duplicate for each
      if (!checkDuplicate(num, selectedBetType, cart)) {
        try {
          // Check multiply for this number
          const checkResult = await memberLotteryCheckAPI.checkMultiply({
            huayId: period?.lotteryId || 1,
            stockType: period?.huayCode?.startsWith('g') ? 'g' : 's',
            huayOption: selectedBetType,
            poyNumber: num,
            multiply: rate.multiply,
            value: 1
          })

          // Use actual multiply and set initial amount to rate min_bet
          const currentRate = rates.find(r => r.bet_type === selectedBetType)
          addToCart({
            bet_type: selectedBetType,
            bet_type_label: config.label,
            number: num,
            amount: currentRate?.min_bet || 1, // ใส่ราคาต่ำสุดที่แทงได้
            payout_rate: checkResult.multiply, // ใช้ราคาจ่ายจริง
            huayName: period?.huayName,
            // Store special number data
            isSpecialNumber: checkResult.isSpecialNumber,
            soldAmount: checkResult.soldAmount,
            remainingAmount: checkResult.remainingAmount,
            maxSaleAmount: checkResult.maxSaleAmount,
            checkResult: checkResult.result
          })

          // Show condition message if available
          if (checkResult.codition && checkResult.result !== 1) {
            toast(`${num}: ${checkResult.codition}`, { duration: 3000, icon: 'ℹ️' })
          }
        } catch (error) {
          console.error('Check multiply error:', error)
          // Fallback to default rate if API fails
          addToCart({
            bet_type: selectedBetType,
            bet_type_label: config.label,
            number: num,
            amount: 1,
            payout_rate: rate.multiply,
            huayName: period?.huayName
          })
        }
      }
    }

    if (numbersToAdd.length > 1) {
      toast.success(`เพิ่ม ${numbersToAdd.length} เลขลงตะกร้าแล้ว`)
    } else {
      toast.success(`เพิ่ม ${number} ลงตะกร้าแล้ว`)
    }
  }

  // Handle Add Multiple Numbers (from special options)
  const handleAddNumbers = (numbers: string[]) => {
    const rate = rates.find(r => r.bet_type === selectedBetType)
    if (!rate) return

    const config = BET_TYPES[selectedBetType]
    if (!config) return

    let addedCount = 0

    numbers.forEach(number => {
      if (!checkDuplicate(number, selectedBetType, cart)) {
        addToCart({
          bet_type: selectedBetType,
          bet_type_label: config.label,
          number,
          amount: 0,
          payout_rate: rate.multiply,
          huayName: period?.huayName
        })
        addedCount++
      }
    })

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
          <button
            onClick={() => navigate('/member/lottery')}
            className="flex items-center gap-2 text-white hover:text-yellow-400 mb-3 transition-colors text-sm font-semibold bg-gray-700/50 hover:bg-gray-700 px-3 py-2 rounded-lg"
          >
            <FiArrowLeft className="text-base" />
            <span>กลับไปเลือกหวย</span>
          </button>

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
              selectedBetType={selectedBetType}
              onSelect={setSelectedBetType}
              rates={rates}
            />

            {/* Special Number Options */}
            <SpecialNumberOptions
              selectedBetType={selectedBetType}
              onAddNumbers={handleAddNumbers}
              shuffleEnabled={shuffleEnabled}
              setShuffleEnabled={setShuffleEnabled}
            />

            {/* Input Mode Section */}
            <InputModeSection
              inputMode={inputMode}
              setInputMode={setInputMode}
              selectedBetType={selectedBetType}
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
    </div>
  )
}

export default LotteryBetting
