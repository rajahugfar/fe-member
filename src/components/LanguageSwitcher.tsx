import React from 'react'
import { useTranslation } from 'react-i18next'
import { FiGlobe } from 'react-icons/fi'

interface LanguageSwitcherProps {
  className?: string
  variant?: 'default' | 'compact' | 'dropdown'
}

const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({
  className = '',
  variant = 'default'
}) => {
  const { i18n } = useTranslation()
  const currentLang = i18n.language

  const changeLanguage = async (lang: string) => {
    console.log('Changing language to:', lang)
    try {
      await i18n.changeLanguage(lang)
      localStorage.setItem('i18nextLng', lang)
      console.log('Language changed successfully to:', lang)
      // Force reload to apply new language
      window.location.reload()
    } catch (error) {
      console.error('Failed to change language:', error)
    }
  }

  if (variant === 'compact') {
    return (
      <div className={`flex items-center gap-1 bg-gray-800/50 rounded-lg p-1 ${className}`}>
        <button
          onClick={() => changeLanguage('th')}
          className={`px-3 py-1.5 text-sm font-bold rounded transition-all ${
            currentLang === 'th'
              ? 'bg-yellow-500 text-gray-900 shadow-lg'
              : 'text-gray-300 hover:text-white hover:bg-gray-700'
          }`}
        >
          TH
        </button>
        <button
          onClick={() => changeLanguage('en')}
          className={`px-3 py-1.5 text-sm font-bold rounded transition-all ${
            currentLang === 'en'
              ? 'bg-yellow-500 text-gray-900 shadow-lg'
              : 'text-gray-300 hover:text-white hover:bg-gray-700'
          }`}
        >
          EN
        </button>
      </div>
    )
  }

  if (variant === 'dropdown') {
    return (
      <div className={`relative ${className}`}>
        <select
          value={currentLang}
          onChange={(e) => changeLanguage(e.target.value)}
          className="bg-gray-800 text-white border border-gray-700 rounded px-3 py-2 text-sm appearance-none cursor-pointer focus:outline-none focus:border-purple-500"
        >
          <option value="th">🇹🇭 ไทย</option>
          <option value="en">🇬🇧 English</option>
        </select>
      </div>
    )
  }

  // Default variant
  return (
    <div className={`flex items-center gap-2 bg-gray-800 rounded-lg p-1 ${className}`}>
      <FiGlobe className="text-gray-400 ml-2" size={16} />
      <button
        onClick={() => changeLanguage('th')}
        className={`px-3 py-1.5 text-sm font-medium rounded transition-all ${
          currentLang === 'th'
            ? 'bg-purple-600 text-white shadow-lg'
            : 'text-gray-400 hover:text-white'
        }`}
      >
        ไทย
      </button>
      <button
        onClick={() => changeLanguage('en')}
        className={`px-3 py-1.5 text-sm font-medium rounded transition-all ${
          currentLang === 'en'
            ? 'bg-purple-600 text-white shadow-lg'
            : 'text-gray-400 hover:text-white'
        }`}
      >
        English
      </button>
    </div>
  )
}

export default LanguageSwitcher
