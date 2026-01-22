import { useState, useEffect } from 'react'
import { X, Save, Trash2, FileText, Plus } from 'lucide-react'
import { memberLotteryAPI, SavedPoyTemplate, SavedPoyItem } from '../../api/memberLotteryAPI'
import { useTranslation } from 'react-i18next'

// Mapping bet types to Thai names
const betTypeNames: Record<string, string> = {
  teng_bon_1: 'วิ่งบน',
  teng_bon_2: '2ตัวบน',
  teng_bon_3: '3ตัวบน',
  teng_bon_4: '4ตัวบน',
  teng_lang_1: 'วิ่งล่าง',
  teng_lang_2: '2ตัวล่าง',
  teng_lang_3: '3ตัวล่าง',
  teng_lang_nha_3: '3ตัวหน้า',
  tode_3: 'โต๊ด3ตัว',
  tode_4: 'โต๊ด4ตัว',
}

interface BetItem {
  betType: string
  number: string
  amount: number
}

interface SavedTemplatesModalProps {
  isOpen: boolean
  onClose: () => void
  onLoadTemplate: (items: BetItem[]) => void
  currentBets?: BetItem[]
}

export const SavedTemplatesModal = ({
  isOpen,
  onClose,
  onLoadTemplate,
  currentBets = [],
}: SavedTemplatesModalProps) => {
  const { t } = useTranslation()
  const [templates, setTemplates] = useState<SavedPoyTemplate[]>([])
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [showSaveForm, setShowSaveForm] = useState(false)
  const [newTemplateName, setNewTemplateName] = useState('')
  const [newTemplateDesc, setNewTemplateDesc] = useState('')
  const [selectedTemplate, setSelectedTemplate] = useState<SavedPoyTemplate | null>(null)
  const [expandedTemplate, setExpandedTemplate] = useState<SavedPoyTemplate | null>(null)
  const [loadingDetails, setLoadingDetails] = useState(false)
  const [error, setError] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalTemplates, setTotalTemplates] = useState(0)

  useEffect(() => {
    if (isOpen) {
      setCurrentPage(1)
      fetchTemplates(1)
    }
  }, [isOpen])

  const fetchTemplates = async (page: number = currentPage) => {
    setLoading(true)
    setError('')
    try {
      const { templates: data, pagination } = await memberLotteryAPI.getSavedTemplatesWithItems(page, 20)
      setTemplates(data)
      setTotalPages(pagination.totalPages)
      setTotalTemplates(pagination.total)
      setCurrentPage(page)
    } catch (err) {
      setError('ไม่สามารถโหลดโพยที่บันทึกไว้ได้')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleSaveTemplate = async () => {
    if (!newTemplateName.trim()) {
      setError('กรุณาใส่ชื่อโพย')
      return
    }
    if (currentBets.length === 0) {
      setError('ไม่มีรายการเดิมพันที่จะบันทึก')
      return
    }

    setSaving(true)
    setError('')
    try {
      await memberLotteryAPI.createSavedTemplate({
        name: newTemplateName.trim(),
        description: newTemplateDesc.trim() || undefined,
        items: currentBets.map(bet => ({
          betType: bet.betType,
          number: bet.number,
          amount: bet.amount,
        })),
      })
      setNewTemplateName('')
      setNewTemplateDesc('')
      setShowSaveForm(false)
      await fetchTemplates(1) // Go to first page to see the new template
    } catch (err: any) {
      setError(err.response?.data?.message || 'ไม่สามารถบันทึกโพยได้')
      console.error(err)
    } finally {
      setSaving(false)
    }
  }

  const handleLoadTemplate = (template: SavedPoyTemplate) => {
    if (template.items && template.items.length > 0) {
      onLoadTemplate(
        template.items.map((item: SavedPoyItem) => ({
          betType: item.betType,
          number: item.number,
          amount: item.amount,
        }))
      )
      onClose()
    } else {
      setError('ไม่พบรายการเลขในโพยนี้')
    }
  }

  const handleDeleteTemplate = async (templateId: string) => {
    if (!confirm('ต้องการลบโพยนี้หรือไม่?')) return

    try {
      await memberLotteryAPI.deleteSavedTemplate(templateId)
      await fetchTemplates(currentPage)
      setSelectedTemplate(null)
      setExpandedTemplate(null)
    } catch (err) {
      setError('ไม่สามารถลบโพยได้')
      console.error(err)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-xl w-full max-w-md max-h-[80vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <div>
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <FileText className="w-5 h-5" />
              โพยที่บันทึกไว้
            </h3>
            <p className="text-xs text-gray-400 mt-1">บันทึกโพยได้ไม่จำกัดจำนวน</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {error && (
            <div className="bg-red-500/20 text-red-400 p-3 rounded-lg mb-4 text-sm">
              {error}
            </div>
          )}

          {/* Save new template */}
          {currentBets.length > 0 && (
            <div className="mb-4">
              {showSaveForm ? (
                <div className="bg-gray-700/50 rounded-lg p-3 space-y-3">
                  <input
                    type="text"
                    placeholder="ชื่อโพย"
                    value={newTemplateName}
                    onChange={(e) => setNewTemplateName(e.target.value)}
                    className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 text-sm"
                  />
                  <input
                    type="text"
                    placeholder="คำอธิบาย (ไม่บังคับ)"
                    value={newTemplateDesc}
                    onChange={(e) => setNewTemplateDesc(e.target.value)}
                    className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 text-sm"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={handleSaveTemplate}
                      disabled={saving}
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg text-sm flex items-center justify-center gap-1"
                    >
                      <Save className="w-4 h-4" />
                      {saving ? 'กำลังบันทึก...' : t("common:buttons.save") }
                    </button>
                    <button
                      onClick={() => setShowSaveForm(false)}
                      className="px-4 bg-gray-600 hover:bg-gray-500 text-white py-2 rounded-lg text-sm"
                    >
                      ยกเลิก
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setShowSaveForm(true)}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg text-sm flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  บันทึกโพยปัจจุบัน ({currentBets.length} รายการ)
                </button>
              )}
            </div>
          )}

          {/* Templates count */}
          {totalTemplates > 0 && (
            <div className="text-sm text-gray-400 mb-2">
              แสดง {(currentPage - 1) * 20 + 1}-{Math.min(currentPage * 20, totalTemplates)} จาก {totalTemplates} โพย
            </div>
          )}

          {/* Templates list */}
          {loading ? (
            <div className="text-center text-gray-400 py-8">{t("common:messages.loading")}</div>
          ) : templates.length === 0 ? (
            <div className="text-center text-gray-400 py-8">
              ยังไม่มีโพยที่บันทึกไว้
            </div>
          ) : (
            <div className="space-y-3">
              {templates.map((template) => (
                <div
                  key={template.id}
                  className="bg-gray-700/50 rounded-lg p-3"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex-1">
                      <h4 className="text-white font-medium">{template.name}</h4>
                      {template.description && (
                        <p className="text-gray-400 text-xs mt-0.5">
                          {template.description}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* แสดงรายละเอียดเลขเลย */}
                  {template.items && template.items.length > 0 && (
                    <div className="mb-3">
                      <div className="grid grid-cols-2 gap-1 max-h-28 overflow-y-auto">
                        {template.items.map((item, idx) => (
                          <div key={idx} className="bg-gray-800 rounded px-2 py-1 text-xs flex justify-between">
                            <span className="text-yellow-400 font-mono font-bold">{item.number}</span>
                            <span className="text-gray-400">
                              {betTypeNames[item.betType] || item.betType} {item.amount}฿
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* ปุ่มโหลดและลบ */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleLoadTemplate(template)}
                      className="flex-1 bg-yellow-600 hover:bg-yellow-700 text-white py-2 rounded-lg text-sm"
                    >
                      โหลดโพยนี้
                    </button>
                    <button
                      onClick={() => handleDeleteTemplate(template.id)}
                      className="px-3 bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-4 pt-4 border-t border-gray-700">
              <button
                onClick={() => fetchTemplates(currentPage - 1)}
                disabled={currentPage === 1 || loading}
                className="px-3 py-1 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:text-gray-500 text-white rounded text-sm transition-colors"
              >
                ก่อนหน้า
              </button>
              <span className="text-gray-400 text-sm px-2">
                หน้า {currentPage} / {totalPages}
              </span>
              <button
                onClick={() => fetchTemplates(currentPage + 1)}
                disabled={currentPage === totalPages || loading}
                className="px-3 py-1 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:text-gray-500 text-white rounded text-sm transition-colors"
              >
                ถัดไป
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default SavedTemplatesModal
