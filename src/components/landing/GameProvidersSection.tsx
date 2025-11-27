import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'

interface GameProvider {
  id: string
  name: string
  image: string
  link: string
}

interface GameProvidersSectionProps {
  providers?: GameProvider[]
  onProviderClick?: (e: React.MouseEvent, link: string) => void
}

const GameProvidersSection = ({ providers, onProviderClick }: GameProvidersSectionProps) => {
  // Default providers matching sacasino.tech
  const defaultProviders: GameProvider[] = [
    { id: '1', name: 'SA Gaming', image: '/images/sacasino/providers/ezs-sa-gaming-vertical.png', link: '/games?provider=SA-GAMING' },
    { id: '2', name: 'Pragmatic Play', image: '/images/sacasino/providers/ezs-wt-ppa-live-vertical.png', link: '/games?provider=PRAGMATIC' },
    { id: '3', name: 'Evolution Gaming', image: '/images/sacasino/providers/ezs-wt-eg-vertical.png', link: '/games?provider=EVOLUTION' },
    { id: '4', name: 'Dream Gaming', image: '/images/sacasino/providers/ezs-wt-dg-v2-vertical.png', link: '/games?provider=DREAM' },
    { id: '5', name: 'WM Casino', image: '/images/sacasino/providers/ezs-wm-vertical.png', link: '/games?provider=WM' },
    { id: '6', name: 'AE Sexy', image: '/images/sacasino/providers/ezs-wt-aesexy-vertical.png', link: '/games?provider=AESEXY' },
    { id: '7', name: 'Allbet', image: '/images/sacasino/providers/ezs-wt-allbet-full-vertical.png', link: '/games?provider=ALLBET' },
    { id: '8', name: 'Asia Gaming', image: '/images/sacasino/providers/ezs-wtm-asia-gaming-vertical.png', link: '/games?provider=ASIA-GAMING' },
  ]

  const displayProviders = providers && providers.length > 0 ? providers : defaultProviders

  const handleClick = (e: React.MouseEvent, link: string) => {
    if (onProviderClick) {
      onProviderClick(e, link)
    }
  }

  return (
    <section className="container mx-auto px-4 py-12">
      {/* Section Header */}
      <div className="text-center mb-10">
        <h2 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600 mb-4 text-glow">
          ค่ายเกมส์
        </h2>
        <p className="text-gray-300 text-lg">ค่ายเกมส์ชั้นนำระดับโลก</p>
      </div>

      {/* Providers Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
        {displayProviders.map((provider, index) => (
          <motion.div
            key={provider.id}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.05 }}
          >
            <a
              href={provider.link}
              onClick={(e) => handleClick(e, provider.link)}
              className="block relative group cursor-pointer hover:scale-105 transition-all duration-300"
            >
              <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-4 border-2 border-gray-700 group-hover:border-yellow-500 shadow-lg group-hover:shadow-glow-yellow transition-all duration-300">
                {/* Provider Logo */}
                <img
                  src={provider.image}
                  alt={provider.name}
                  className="w-full h-16 object-contain group-hover:scale-110 transition-transform duration-300"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement
                    target.src = '/images/sacasino/providers/default.png'
                  }}
                />
              </div>
            </a>
          </motion.div>
        ))}
      </div>
    </section>
  )
}

export default GameProvidersSection
