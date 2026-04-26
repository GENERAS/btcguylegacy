import { useTranslation } from 'react-i18next'

export default function LanguageSwitcher() {
  const { i18n, t } = useTranslation()
  const currentLang = i18n.language || 'en'

  const toggleLanguage = () => {
    const newLang = currentLang.startsWith('rw') ? 'en' : 'rw'
    i18n.changeLanguage(newLang)
  }

  const isKinyarwanda = currentLang.startsWith('rw')

  return (
    <button
      onClick={toggleLanguage}
      className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-300 hover:text-white transition-all duration-200 border border-slate-700"
      title={isKinyarwanda ? 'Switch to English' : 'Hindura mu Kinyarwanda'}
    >
      <span className="text-sm">{isKinyarwanda ? '🇷🇼' : '🇬🇧'}</span>
      <span className="hidden sm:inline">{isKinyarwanda ? 'RW' : 'EN'}</span>
    </button>
  )
}
