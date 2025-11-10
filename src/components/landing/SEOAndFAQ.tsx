import { useState } from 'react'
import { FaChevronDown } from 'react-icons/fa'

interface FAQ {
  question: string
  answer: string
}

interface SEOAndFAQProps {
  siteName?: string
  siteDescription?: string
  faqs?: FAQ[]
}

const SEOAndFAQ = ({ 
  siteName = 'SACASINO', 
  siteDescription = 'เว็บคาสิโนออนไลน์อันดับหนึ่งของประเทศไทย มาตรฐานสากล ระบบปลอดภัย ฝาก-ถอนรวดเร็ว พร้อมให้บริการตลอด 24 ชั่วโมง',
  faqs
}: SEOAndFAQProps) => {
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  // Default FAQs
  const defaultFaqs: FAQ[] = [
    {
      question: `${siteName} เป็นเว็บคาสิโนออนไลน์ที่ไหนเชื่อถือหรือไม่?`,
      answer: 'เว็บคาสิโนออนไลน์ของเรามีมาตรฐานสากล ได้รับใบอนุญาตถูกต้องตามกฎหมาย มีระบบรักษาความปลอดภัยสูง'
    },
    {
      question: `${siteName} มีเกมอะไรให้เล่นบ้าง?`,
      answer: 'มีเกมให้เลือกเล่นมากมาย ทั้งสล็อต บาคาร่า รูเล็ต ไฮโล เสือมังกร ยิงปลา และอื่นๆอีกมากมาย'
    },
    {
      question: `ระบบฝาก-ถอนของ ${siteName} ใช้เวลานานแค่ไหน?`,
      answer: 'ระบบอัตโนมัติ รวดเร็วภายใน 30 วินาที ไม่มีขั้นต่ำ'
    },
    {
      question: `${siteName} มีโปรโมชั่นอะไรบ้าง?`,
      answer: 'มีโปรโมชั่นมากมาย โบนัสต้อนรับ คืนยอดเสีย ฝากครั้งแรก และโปรพิเศษอื่นๆอีกมากมาย'
    },
    {
      question: `สามารถติดต่อทีมงาน ${siteName} ได้ช่องทางไหน?`,
      answer: 'สามารถติดต่อได้ตลอด 24 ชั่วโมง ผ่าน Line, Telegram, Facebook หรือแชทสด'
    }
  ]

  const displayFaqs = faqs && faqs.length > 0 ? faqs : defaultFaqs

  return (
    <section className="container mx-auto px-4 py-12">
      <div className="bg-gradient-to-br from-green-900/40 to-green-950/40 backdrop-blur-sm rounded-3xl border-4 border-yellow-700 p-8">
        {/* SEO Text Content */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-green-400 mb-4">
            {siteName} คาสิโนออนไลน์ เล่นง่าย จ่ายจริง การันตีความมั่นคง
          </h2>
          <p className="text-gray-300 leading-relaxed mb-4">
            {siteDescription}
          </p>
          <p className="text-gray-300 leading-relaxed">
            มีเกมให้เลือกเล่นหลากหลาย ทั้ง{' '}
            <span className="text-green-400 font-bold">บาคาร่า สล็อต รูเล็ต ไฮโล</span>{' '}
            และเกมคาสิโนสดอื่นๆอีกมากมาย จากค่ายชั้นนำระดับโลก พร้อมโปรโมชั่นมากมาย 
            โบนัสต้อนรับ คืนยอดเสีย ระบบอัตโนมัติรวดเร็วทันใจ
          </p>
        </div>

        {/* FAQ Section */}
        <div>
          <h3 className="text-2xl font-bold text-green-400 mb-6">
            FAQ คำถามที่พบบ่อยเกี่ยวกับ {siteName}
          </h3>
          <div className="space-y-4">
            {displayFaqs.map((faq, index) => (
              <div
                key={index}
                className="bg-green-900/30 backdrop-blur-sm rounded-xl border-2 border-green-700 overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full flex items-center justify-between p-4 text-left hover:bg-green-800/30 transition-colors"
                >
                  <span className="text-green-300 font-semibold pr-4">
                    {faq.question}
                  </span>
                  <FaChevronDown
                    className={`text-green-400 transition-transform flex-shrink-0 ${
                      openFaq === index ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {openFaq === index && (
                  <div className="px-4 pb-4">
                    <p className="text-gray-300">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default SEOAndFAQ
