import { Link } from 'react-router-dom'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Pagination, EffectFade } from 'swiper/modules'
import { FaGamepad, FaLine, FaTelegram } from 'react-icons/fa'

import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/effect-fade'

interface Promotion {
  id: string
  image: string
  title: string
  link_url?: string
}

interface HeroSectionProps {
  promotions: Promotion[]
  socialLine?: string
  socialTelegram?: string
}

const HeroSection = ({ promotions, socialLine, socialTelegram }: HeroSectionProps) => {
  // Default promotions if none provided
  const defaultPromotions: Promotion[] = [
    { id: '1', image: '/images/sacasino/banners/6ac8f2cc45f6b89e2266496f03a8f270.jpg', title: 'โปรโมชั่น 1' },
    { id: '2', image: '/images/sacasino/banners/af6e0b7dacc35d572f58b70a18a5d926.jpg', title: 'โปรโมชั่น 2' },
    { id: '3', image: '/images/sacasino/banners/062a43b54902c26ca542b464642b4dbf.jpg', title: 'โปรโมชั่น 3' },
    { id: '4', image: '/images/sacasino/banners/ed589e77f72bb6e2edc67040e18c6de4.jpg', title: 'โปรโมชั่น 4' },
    { id: '5', image: '/images/sacasino/banners/fad31dcc94be4093b4d36e7786893ca6.jpg', title: 'โปรโมชั่น 5' },
  ]

  const displayPromotions = promotions.length > 0 ? promotions : defaultPromotions

  return (
    <section className="container mx-auto px-4 py-10">
      <div className="bg-gradient-to-br from-green-900/50 to-green-950/50 backdrop-blur-md rounded-3xl border-4 border-yellow-600/80 shadow-glow-yellow overflow-hidden hover:border-yellow-500 transition-all duration-300">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
          {/* Left Column - Promotion Carousel */}
          <div className="relative">
            <Swiper
              modules={[Autoplay, Pagination, EffectFade]}
              effect="fade"
              spaceBetween={0}
              slidesPerView={1}
              autoplay={{ delay: 4000, disableOnInteraction: false }}
              pagination={{
                clickable: true,
                bulletActiveClass: '!bg-yellow-500',
              }}
              loop
              className="rounded-2xl overflow-hidden shadow-2xl border-4 border-yellow-700"
            >
              {displayPromotions.map((promo) => (
                <SwiperSlide key={promo.id}>
                  <img
                    src={promo.image}
                    alt={promo.title}
                    className="w-full aspect-square object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      target.src = '/images/sacasino/default-promo.jpg'
                    }}
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

          {/* Right Column - Quick Links */}
          <div className="flex flex-col gap-4 justify-center">
            {/* Promotions Link */}
            <Link
              to="/member/promotions"
              className="relative hover:scale-105 transition-transform group"
            >
              <div className="bg-gradient-to-br from-purple-600 to-purple-800 rounded-2xl p-6 text-center shadow-lg border-2 border-purple-400 group-hover:shadow-glow-green">
                <FaGamepad className="text-4xl text-white mx-auto mb-3" />
                <h3 className="text-xl font-bold text-white">โปรโมชั่น</h3>
                <p className="text-purple-200 text-sm mt-2">รับโบนัสพิเศษ</p>
              </div>
            </Link>

            {/* LINE Contact */}
            <a
              href={socialLine || '#'}
              target="_blank"
              rel="noopener noreferrer"
              className="relative hover:scale-105 transition-transform group"
            >
              <div className="bg-gradient-to-br from-green-600 to-green-800 rounded-2xl p-6 text-center shadow-lg border-2 border-green-400 group-hover:shadow-glow-green">
                <FaLine className="text-4xl text-white mx-auto mb-3" />
                <h3 className="text-xl font-bold text-white">LINE</h3>
                <p className="text-green-200 text-sm mt-2">ติดต่อสอบถาม</p>
              </div>
            </a>

            {/* Telegram Contact */}
            <a
              href={socialTelegram || '#'}
              target="_blank"
              rel="noopener noreferrer"
              className="relative hover:scale-105 transition-transform group"
            >
              <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl p-6 text-center shadow-lg border-2 border-blue-400 group-hover:shadow-glow-green">
                <FaTelegram className="text-4xl text-white mx-auto mb-3" />
                <h3 className="text-xl font-bold text-white">Telegram</h3>
                <p className="text-blue-200 text-sm mt-2">ข่าวสาร</p>
              </div>
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HeroSection
