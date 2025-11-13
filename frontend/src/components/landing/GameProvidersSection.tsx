import { motion } from 'framer-motion'

const API_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:3001'

interface GameProvider {
  id: number
  product_name: string
  image_path: string
  category: string
}

interface GameProvidersSectionProps {
  providers: GameProvider[]
  onProviderClick: (e: React.MouseEvent, provider: GameProvider) => void
}

const GameProvidersSection = ({ providers, onProviderClick }: GameProvidersSectionProps) => {
  // Get provider image URL
  const getProviderImage = (provider: GameProvider) => {
    if (provider.image_path) {
      if (provider.image_path.startsWith('http')) {
        return provider.image_path
      }
      return `${API_URL}${provider.image_path}`
    }
    return `${API_URL}/uploads/providers/sa-gaming.png`
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
      {providers.length > 0 ? (
        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {providers.map((provider, index) => (
            <motion.div
              key={provider.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
            >
              <div
                onClick={(e) => onProviderClick(e, provider)}
                className="relative group cursor-pointer rounded-lg overflow-hidden bg-gray-800 p-2 hover:scale-105 transition-transform"
              >
                <img 
                  src={getProviderImage(provider)}
                  alt={provider.product_name}
                  className="w-full h-auto transition-transform group-hover:scale-110"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement
                    target.src = 'https://asset.cloudigame.co/build/admin/img/sa-gaming/ezs-sa-gaming-vertical.png'
                  }}
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all flex items-center justify-center">
                  <span className="opacity-0 group-hover:opacity-100 text-white text-xs font-bold text-center px-2">
                    {provider.product_name}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-gray-400">
          <p>ไม่พบค่ายเกมส์</p>
        </div>
      )}
    </section>
  )
}

export default GameProvidersSection
