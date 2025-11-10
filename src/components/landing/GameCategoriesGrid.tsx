import { motion } from 'framer-motion'

interface GameCategory {
  name: string
  image: string
  link: string
}

interface GameCategoriesGridProps {
  categories?: GameCategory[]
  onCategoryClick?: (e: React.MouseEvent, link: string) => void
}

const GameCategoriesGrid = ({ categories, onCategoryClick }: GameCategoriesGridProps) => {
  // Default categories matching sacasino.tech
  const defaultCategories: GameCategory[] = [
    { name: 'สล็อต', image: '/images/sacasino/categories/menu-slot.png', link: '/games?category=slots' },
    { name: 'บาคาร่า', image: '/images/sacasino/categories/menu-baccarat.png', link: '/games?category=baccarat' },
    { name: 'รูเล็ต', image: '/images/sacasino/categories/menu-roulette.png', link: '/games?category=roulette' },
    { name: 'ไฮโล', image: '/images/sacasino/categories/menu-hilo.png', link: '/games?category=hilo' },
    { name: 'เสือมังกร', image: '/images/sacasino/categories/menu-dragon-tiger.png', link: '/games?category=dragon-tiger' },
    { name: 'แบล็กแจ็ก', image: '/images/sacasino/categories/menu-blackjack.png', link: '/games?category=blackjack' },
    { name: 'หวย', image: '/images/sacasino/categories/menu-lotto.png', link: '/lottery' },
    { name: 'กีฬา', image: '/images/sacasino/categories/menu-sport.png', link: '/games?category=sports' },
  ]

  const displayCategories = categories && categories.length > 0 ? categories : defaultCategories

  const handleClick = (e: React.MouseEvent, link: string) => {
    if (onCategoryClick) {
      onCategoryClick(e, link)
    }
  }

  return (
    <section className="container mx-auto px-4 py-10">
      {/* Section Header */}
      <div className="text-center mb-10">
        <h2 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600 mb-4 text-glow">
          หมวดเกมส์
        </h2>
        <p className="text-gray-300 text-lg">เลือกเล่นเกมส์ที่คุณชื่นชอบ</p>
      </div>

      {/* Categories Grid - 2x4 layout */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {displayCategories.map((category, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
          >
            <a
              href={category.link}
              onClick={(e) => handleClick(e, category.link)}
              className="relative rounded-2xl shadow-glow-yellow hover:shadow-glow-green hover:scale-105 transition-all duration-300 group overflow-hidden block border-2 border-transparent hover:border-yellow-500/50 cursor-pointer"
            >
              <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 text-center border-2 border-gray-700 group-hover:border-yellow-500 transition-all duration-300">
                {/* Category Icon */}
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-16 h-16 mx-auto mb-4 group-hover:scale-110 transition-transform duration-300"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement
                    target.src = '/images/sacasino/default-game.png'
                  }}
                />
                
                {/* Category Name */}
                <h3 className="text-white font-bold text-lg group-hover:text-yellow-400 transition-colors">
                  {category.name}
                </h3>
              </div>
            </a>
          </motion.div>
        ))}
      </div>
    </section>
  )
}

export default GameCategoriesGrid
