interface GameCategoriesGridProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

const GameCategoriesGrid = ({ activeTab, onTabChange }: GameCategoriesGridProps) => {
  // Categories matching /member/index
  const categories = [
    { id: 'all', name: 'ทั้งหมด', icon: '/images/sacasino/categories/menu-icon-category-baccarat.png', iconHover: '/images/sacasino/categories/menu-icon-category-baccarat-hover.png' },
    { id: 'Slot', name: 'สล็อต', icon: '/images/sacasino/categories/menu-icon-category-slot.png', iconHover: '/images/sacasino/categories/menu-icon-category-slot-hover.png' },
    { id: 'Live Casino', name: 'คาสิโนสด', icon: '/images/sacasino/categories/menu-icon-category-baccarat.png', iconHover: '/images/sacasino/categories/menu-icon-category-baccarat-hover.png' },
    { id: 'Game Card', name: 'เกมไพ่', icon: '/images/sacasino/categories/menu-icon-category-blackjack.png', iconHover: '/images/sacasino/categories/menu-icon-category-blackjack-hover.png' },
    { id: 'Sport', name: 'กีฬา', icon: '/images/sacasino/categories/menu-icon-category-blackjack.png', iconHover: '/images/sacasino/categories/menu-icon-category-blackjack-hover.png' },
    { id: 'Poker', name: 'โป๊กเกอร์', icon: '/images/sacasino/categories/menu-icon-category-blackjack.png', iconHover: '/images/sacasino/categories/menu-icon-category-blackjack-hover.png' },
  ]

  return (
    <section className="container mx-auto px-4 py-10">
      {/* Section Header */}
      <div className="text-center mb-10">
        <h2 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600 mb-4 text-glow">
          หมวดเกมส์
        </h2>
        <p className="text-gray-300 text-lg">เลือกเล่นเกมส์ที่คุณชื่นชอบ</p>
      </div>

      {/* Category Tabs */}
      <div className="bg-[#1a1f2e] border-y border-gray-800 rounded-2xl p-4 mb-8">
        <div className="flex gap-2 overflow-x-auto scrollbar-hide">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onTabChange(cat.id)}
              className={`flex flex-col items-center min-w-[80px] px-3 py-2 rounded-lg transition-all group
                ${activeTab === cat.id ? 'bg-gradient-to-b from-[#d4af37] to-[#8B6914]' : 'hover:bg-gray-800'}`}
            >
              <img 
                src={activeTab === cat.id ? cat.iconHover : cat.icon}
                alt={cat.name}
                className="w-12 h-12 mb-1"
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  target.src = '/images/sacasino/default-game.png'
                }}
              />
              <span className={`text-xs font-medium ${activeTab === cat.id ? 'text-white' : 'text-gray-400'}`}>
                {cat.name}
              </span>
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}

export default GameCategoriesGrid
