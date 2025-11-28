import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { FiGift, FiCheck, FiInfo } from 'react-icons/fi'
import { promotionAPI } from '../../api/memberAPI'
import { toast } from 'react-hot-toast'

const Promotions: React.FC = () => {
  const { t } = useTranslation()

  const CATEGORIES = [
    { value: '', label: t("promotion:categories.all") },
    { value: 'DEPOSIT', label: t("navigation:menu.deposit") },
    { value: 'CASHBACK', label: t("promotion:categories.cashback") },
    { value: 'REFERRAL', label: t("navigation:menu.affiliate") },
    { value: 'SPECIAL', label: t("promotion:categories.special") },
  ]
  const [promotions, setPromotions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [category, setCategory] = useState('')
  const [selectedPromo, setSelectedPromo] = useState<any>(null)
  const [promoCode, setPromoCode] = useState('')
  const [claiming, setClaiming] = useState(false)

  useEffect(() => {
    loadPromotions()
  }, [category])

  const loadPromotions = async () => {
    setLoading(true)
    try {
      const response = await promotionAPI.getPromotions(category || undefined)
      setPromotions(response.data.data || [])
    } catch (error) {
      console.error('Load promotions error:', error)
      toast.error(t("promotion:messages.loadError"))
    } finally {
      setLoading(false)
    }
  }

  const handleViewDetails = async (id: number) => {
    try {
      const response = await promotionAPI.getPromotionById(id)
      setSelectedPromo(response.data.data || response.data)
    } catch (error) {
      console.error('Load promotion details error:', error)
      toast.error(t("promotion:messages.loadDetailsError"))
    }
  }

  const handleClaim = async () => {
    if (!selectedPromo) return

    setClaiming(true)
    try {
      await promotionAPI.claimPromotion(selectedPromo.id, promoCode || undefined)
      toast.success(t("promotion:claimSuccess"))
      setSelectedPromo(null)
      setPromoCode('')
      loadPromotions()
    } catch (error: any) {
      console.error('Claim promotion error:', error)
      toast.error(error.response?.data?.message || t("promotion:messages.claimError"))
    } finally {
      setClaiming(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-600 to-yellow-600 rounded-2xl p-6 shadow-xl">
        <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">{t("navigation:menu.promotions")}</h1>
        <p className="text-white/80">{t("promotion:subtitle")}</p>
      </div>

      {/* Category Tabs */}
      <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-4">
        <div className="flex gap-2 overflow-x-auto">
          {CATEGORIES.map(cat => (
            <button
              key={cat.value}
              onClick={() => setCategory(cat.value)}
              className={`px-6 py-3 rounded-xl font-medium whitespace-nowrap transition-all ${
                category === cat.value
                  ? 'bg-gradient-to-r from-orange-600 to-yellow-600 text-white shadow-lg'
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Promotions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
          </div>
        ) : promotions.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <p className="text-white/60">{t("promotion:messages.noPromotions")}</p>
          </div>
        ) : (
          promotions.map((promo) => (
            <div
              key={promo.id}
              className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl overflow-hidden hover:ring-2 hover:ring-orange-500 transition-all group"
            >
              {/* Image */}
              <div className="aspect-video relative overflow-hidden bg-gradient-to-br from-orange-600/20 to-yellow-600/20">
                {promo.imageUrl ? (
                  <img
                    src={promo.imageUrl}
                    alt={promo.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <FiGift className="text-orange-400" size={64} />
                  </div>
                )}
                {promo.isHot && (
                  <span className="absolute top-2 right-2 px-3 py-1 bg-red-500 text-white text-xs font-bold rounded-lg animate-pulse">
                    🔥 HOT
                  </span>
                )}
              </div>

              {/* Content */}
              <div className="p-4 space-y-3">
                <h3 className="text-white font-bold text-lg">{promo.title}</h3>
                <p className="text-white/70 text-sm line-clamp-2">{promo.description}</p>

                {/* Bonus Info */}
                {promo.bonusPercent && (
                  <div className="flex items-center gap-2 text-yellow-400">
                    <FiGift size={16} />
                    <span className="font-bold">{t("promotion:bonus.percent", { percent: promo.bonusPercent })}</span>
                    {promo.maxBonus && (
                      <span className="text-white/60 text-sm">
                        ({t("promotion:bonus.max", { amount: promo.maxBonus.toLocaleString() })})
                      </span>
                    )}
                  </div>
                )}

                {/* Buttons */}
                <div className="flex gap-2 pt-2">
                  <button
                    onClick={() => handleViewDetails(promo.id)}
                    className="flex-1 px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors flex items-center justify-center gap-2"
                  >
                    <FiInfo size={16} />
                    <span>{t("promotion:buttons.viewDetails")}</span>
                  </button>
                  <button
                    onClick={() => {
                      handleViewDetails(promo.id)
                    }}
                    className="flex-1 px-4 py-2 bg-gradient-to-r from-orange-600 to-yellow-600 text-white rounded-lg hover:from-orange-700 hover:to-yellow-700 transition-all font-medium flex items-center justify-center gap-2"
                  >
                    <FiCheck size={16} />
                    <span>{t("promotion:buttons.claimNow")}</span>
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Promotion Details Modal */}
      {selectedPromo && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4" onClick={() => setSelectedPromo(null)}>
          <div className="bg-gray-900 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-white/10" onClick={(e) => e.stopPropagation()}>
            {/* Image */}
            {selectedPromo.imageUrl && (
              <div className="aspect-video w-full">
                <img
                  src={selectedPromo.imageUrl}
                  alt={selectedPromo.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Content */}
            <div className="p-6 space-y-4">
              <h2 className="text-2xl font-bold text-white">{selectedPromo.title}</h2>

              {/* Bonus Info */}
              {selectedPromo.bonusPercent && (
                <div className="p-4 bg-gradient-to-r from-orange-600/20 to-yellow-600/20 border border-orange-500/30 rounded-xl">
                  <div className="flex items-center gap-3 text-yellow-400">
                    <FiGift size={24} />
                    <div>
                      <p className="font-bold text-xl">{t("promotion:bonus.percent", { percent: selectedPromo.bonusPercent })}</p>
                      {selectedPromo.maxBonus && (
                        <p className="text-white/70 text-sm">
                          {t("promotion:bonus.maxReceive", { amount: selectedPromo.maxBonus.toLocaleString() })}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Description */}
              <div>
                <h3 className="text-white font-bold mb-2">{t("promotion:details")}</h3>
                <p className="text-white/80 whitespace-pre-line">{selectedPromo.description}</p>
              </div>

              {/* Terms & Conditions */}
              <div>
                <h3 className="text-white font-bold mb-2">{t("promotion:terms")}</h3>
                <div className="bg-white/5 rounded-lg p-4">
                  <p className="text-white/70 text-sm whitespace-pre-line">
                    {selectedPromo.terms || t("promotion:fields.noTerms")}
                  </p>
                </div>
              </div>

              {/* Promo Code Input (if required) */}
              {selectedPromo.requiresCode && (
                <div>
                  <label className="block text-white/80 text-sm mb-2">{t("promotion:promoCode")}</label>
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder={t("promotion:enterPromoCode")}
                  />
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-2 pt-4">
                <button
                  onClick={handleClaim}
                  disabled={claiming || (selectedPromo.requiresCode && !promoCode)}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-orange-600 to-yellow-600 text-white rounded-xl hover:from-orange-700 hover:to-yellow-700 transition-all font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {claiming ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>{t("promotion:messages.claiming")}</span>
                    </>
                  ) : (
                    <>
                      <FiCheck />
                      <span>{t("promotion:claim")}</span>
                    </>
                  )}
                </button>
                <button
                  onClick={() => {
                    setSelectedPromo(null)
                    setPromoCode('')
                  }}
                  className="px-6 py-3 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-all font-medium"
                >
                  {t("promotion:buttons.close")}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Promotions
