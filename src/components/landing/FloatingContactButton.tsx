import { FaLine } from 'react-icons/fa'

interface FloatingContactButtonProps {
  contactLine?: string
}

const FloatingContactButton = ({ contactLine }: FloatingContactButtonProps) => {
  if (!contactLine || contactLine === '#') {
    return null
  }

  return (
    <a
      href={contactLine}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-8 right-8 w-16 h-16 bg-green-500 rounded-full flex items-center justify-center shadow-glow-green hover:scale-110 transition-transform z-50 animate-bounce-slow"
      aria-label="Contact via LINE"
    >
      <FaLine className="text-3xl text-white" />
    </a>
  )
}

export default FloatingContactButton
