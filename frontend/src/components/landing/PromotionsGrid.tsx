import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

interface Promotion {
  id: string
  image: string
  title: string
  link_url?: string
}

interface PromotionsGridProps {
  promotions: Promotion[]
}

const PromotionsGrid = ({ promotions }: PromotionsGridProps) => {
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
    <section className="container mx-auto px-4 py-8">
      {/* Section Header */}
      <div className="text-center mb-8">
        <h2 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600 mb-2 text-glow">
          กิจกรรม
        </h2>
        <p className="text-gray-300 text-lg">โปรโมชั่นและกิจกรรมพิเศษ</p>
      </div>

      {/* Promotions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {displayPromotions.map((promo, index) => (
          <motion.div
            key={promo.id || index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
          >
            <Link
              to={promo.link_url || '/member/promotions'}
              className="block relative bg-gradient-to-br from-green-900/80 to-green-950/80 backdrop-blur-sm rounded-2xl border-4 border-yellow-700 shadow-glow-yellow overflow-hidden hover:scale-105 transition-all duration-300 group"
            >
              {/* Promotion Image */}
              <img
                src={promo.image}
                alt={promo.title}
                className="w-full aspect-square object-cover group-hover:scale-110 transition-transform duration-500"
                loading="lazy"
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  target.src = '/images/sacasino/default-promo.jpg'
                }}
              />
              
              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  )
}

export default PromotionsGrid
