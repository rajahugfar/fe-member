interface FooterProps {
  siteName?: string
}

const Footer = ({ siteName = 'SACASINO' }: FooterProps) => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gray-950/80 backdrop-blur-sm border-t-4 border-yellow-700 py-8 mt-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Certifications */}
          <div>
            <h3 className="text-green-400 font-bold text-lg mb-4">การรับรอง</h3>
            <div className="flex gap-3 flex-wrap">
              <img
                src="/images/sacasino/certs/cert1.png"
                alt="Certification 1"
                className="w-12 h-12 object-contain"
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  target.style.display = 'none'
                }}
              />
              <img
                src="/images/sacasino/certs/cert2.png"
                alt="Certification 2"
                className="w-12 h-12 object-contain"
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  target.style.display = 'none'
                }}
              />
              <img
                src="/images/sacasino/certs/cert3.png"
                alt="Certification 3"
                className="w-12 h-12 object-contain"
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  target.style.display = 'none'
                }}
              />
              <img
                src="/images/sacasino/certs/cert4.png"
                alt="Certification 4"
                className="w-12 h-12 object-contain"
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  target.style.display = 'none'
                }}
              />
            </div>
          </div>

          {/* Responsible Gaming */}
          <div>
            <h3 className="text-green-400 font-bold text-lg mb-4">
              การเล่นอย่างมีความรับผิดชอบ
            </h3>
            <div className="flex gap-3 flex-wrap">
              <img
                src="/images/sacasino/gaming/gaming1.png"
                alt="Responsible Gaming 1"
                className="w-12 h-12 object-contain"
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  target.style.display = 'none'
                }}
              />
              <img
                src="/images/sacasino/gaming/gaming2.png"
                alt="Responsible Gaming 2"
                className="w-12 h-12 object-contain"
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  target.style.display = 'none'
                }}
              />
              <img
                src="/images/sacasino/gaming/gaming3.png"
                alt="Responsible Gaming 3"
                className="w-12 h-12 object-contain"
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  target.style.display = 'none'
                }}
              />
            </div>
          </div>

          {/* Payment Methods */}
          <div>
            <h3 className="text-green-400 font-bold text-lg mb-4">วิธีการชำระเงิน</h3>
            <div className="grid grid-cols-6 gap-2">
              <img
                src="/images/sacasino/payments/visa.png"
                alt="Visa"
                className="w-8 h-8 object-contain"
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  target.style.display = 'none'
                }}
              />
              <img
                src="/images/sacasino/payments/mastercard.png"
                alt="Mastercard"
                className="w-8 h-8 object-contain"
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  target.style.display = 'none'
                }}
              />
              <img
                src="/images/sacasino/payments/scb.png"
                alt="SCB"
                className="w-8 h-8 object-contain"
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  target.style.display = 'none'
                }}
              />
              <img
                src="/images/sacasino/payments/kbank.png"
                alt="KBANK"
                className="w-8 h-8 object-contain"
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  target.style.display = 'none'
                }}
              />
              <img
                src="/images/sacasino/payments/truewallet.png"
                alt="TrueWallet"
                className="w-8 h-8 object-contain"
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  target.style.display = 'none'
                }}
              />
              <img
                src="/images/sacasino/payments/promptpay.png"
                alt="PromptPay"
                className="w-8 h-8 object-contain"
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  target.style.display = 'none'
                }}
              />
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="text-center text-gray-500 text-sm pt-8 border-t border-gray-800">
          © {currentYear} {siteName}. All rights reserved.
          <p className="mt-2">เล่นการพนันอย่างมีสติ ห้ามผู้ที่มีอายุต่ำกว่า 18 ปีเข้าเล่น</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
