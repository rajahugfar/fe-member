interface BankIconProps {
  bankCode: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

const bankInfo: Record<string, { name: string; file: string; color: string }> = {
  KBANK: { name: 'กสิกรไทย', file: 'kbank', color: '#138f2d' },
  KBank: { name: 'กสิกรไทย', file: 'kbank', color: '#138f2d' },
  SCB: { name: 'ไทยพาณิชย์', file: 'scb', color: '#4e2e7f' },
  BBL: { name: 'กรุงเทพ', file: 'bbl', color: '#1e4598' },
  KTB: { name: 'กรุงไทย', file: 'ktb', color: '#1ba5e1' },
  BAY: { name: 'กรุงศรี', file: 'bay', color: '#fec43b' },
  TMB: { name: 'ทหารไทยธนชาต', file: 'tmb', color: '#1279be' },
  CIMB: { name: 'ซีไอเอ็มบี', file: 'cimb', color: '#7e2f36' },
  TISCO: { name: 'ทิสโก้', file: 'tisco', color: '#12549f' },
  KKP: { name: 'เกียรตินาคิน', file: 'kk', color: '#199cc5' },
  LH: { name: 'แลนด์ แอนด์ เฮ้าส์', file: 'lhb', color: '#6d6e71' },
  LHB: { name: 'แลนด์ แอนด์ เฮ้าส์', file: 'lhb', color: '#6d6e71' },
  TBANK: { name: 'ธนชาต', file: 'tbank', color: '#fc4f1f' },
  TNC: { name: 'ธนชาต', file: 'tbank', color: '#fc4f1f' },
  GSB: { name: 'ออมสิน', file: 'gsb', color: '#eb198d' },
  BAAC: { name: 'ธ.ก.ส.', file: 'baac', color: '#4b9b1d' },
  GHBANK: { name: 'อาคารสงเคราะห์', file: 'ghb', color: '#f57d23' },
  GHB: { name: 'อาคารสงเคราะห์', file: 'ghb', color: '#f57d23' },
  UOB: { name: 'ยูโอบี', file: 'uob', color: '#0b3979' },
}

const sizeClasses = {
  sm: 'w-8 h-8',
  md: 'w-10 h-10',
  lg: 'w-12 h-12',
}

export default function BankIcon({ bankCode, size = 'md', className = '' }: BankIconProps) {
  // Handle undefined or null bankCode
  if (!bankCode) {
    return (
      <div
        className={`${sizeClasses[size]} rounded-lg bg-gray-600 flex items-center justify-center text-white font-bold text-xs ${className}`}
        title="Unknown Bank"
      >
        ??
      </div>
    )
  }

  // Try to find bank info by exact match or uppercase match
  const bank = bankInfo[bankCode] || bankInfo[bankCode.toUpperCase()]

  // Determine the file name and background color to use
  let fileName = ''
  let bgColor = '#ffffff'

  if (bank) {
    fileName = bank.file
    bgColor = bank.color
  } else {
    // If not found in bankInfo, try using bankCode directly as filename
    fileName = bankCode
    bgColor = '#6b7280' // gray-500
  }

  return (
    <div
      className={`${sizeClasses[size]} rounded-lg overflow-hidden shadow-md ${className}`}
      style={{ backgroundColor: bgColor }}
      title={bank?.name || bankCode}
    >
      <img
        src={`${API_URL}/uploads/banks-logo/th/${fileName.toLowerCase()}.svg`}
        alt={bank?.name || bankCode}
        className="w-full h-full object-contain p-1"
        onError={(e) => {
          const target = e.target as HTMLImageElement
          // On error, show bank code text instead
          const parent = target.parentElement
          if (parent) {
            parent.innerHTML = `<div class="w-full h-full flex items-center justify-center text-xs font-bold text-white">${bankCode.substring(0, 3)}</div>`
          }
        }}
      />
    </div>
  )
}

// Helper component to show bank info with icon
export function BankInfo({
  bankCode,
  bankName,
  bankNumber,
  size = 'md',
}: {
  bankCode: string
  bankName: string
  bankNumber: string
  size?: 'sm' | 'md' | 'lg'
}) {
  const bank = bankInfo[bankCode] || bankInfo[bankCode.toUpperCase()] || { name: bankCode, file: '' }

  return (
    <div className="flex items-center gap-3">
      <BankIcon bankCode={bankCode} size={size} />
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium text-brown-100 truncate">{bankName}</div>
        <div className="text-xs text-brown-400 font-mono">{bankNumber}</div>
        <div className="text-xs text-brown-500">{bank.name}</div>
      </div>
    </div>
  )
}
