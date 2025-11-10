import { motion } from 'framer-motion'
import { FaGamepad, FaUser, FaUserPlus, FaTimes } from 'react-icons/fa'

interface LoginRequiredModalProps {
  isOpen: boolean
  onClose: () => void
  onLogin: () => void
  onRegister: () => void
}

const LoginRequiredModal = ({
  isOpen,
  onClose,
  onLogin,
  onRegister
}: LoginRequiredModalProps) => {
  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
        onClick={onClose}
      />

      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[90%] max-w-md"
      >
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl border-2 border-yellow-500/30 shadow-glow-yellow overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 p-6 relative">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-black hover:text-gray-800 transition-colors"
              aria-label="Close modal"
            >
              <FaTimes className="text-2xl" />
            </button>
            <FaGamepad className="text-5xl text-black mx-auto mb-3" />
            <h2 className="text-2xl font-bold text-black text-center">
              เข้าสู่ระบบเพื่อเล่นเกม
            </h2>
          </div>

          {/* Body */}
          <div className="p-8 text-center">
            <p className="text-gray-300 text-lg mb-8">
              กรุณาเข้าสู่ระบบหรือสมัครสมาชิก
              <br />
              เพื่อเข้าเล่นเกมส์
            </p>

            {/* Action Buttons */}
            <div className="space-y-4">
              <button
                onClick={onLogin}
                className="w-full py-4 px-6 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-black font-bold rounded-xl transition-all duration-300 shadow-glow-yellow hover:shadow-glow-green transform hover:scale-105"
              >
                <FaUser className="inline-block mr-2" />
                เข้าสู่ระบบ
              </button>

              <button
                onClick={onRegister}
                className="w-full py-4 px-6 bg-gray-700 hover:bg-gray-600 text-white font-bold rounded-xl transition-all duration-300 border-2 border-gray-600 hover:border-gray-500 transform hover:scale-105"
              >
                <FaUserPlus className="inline-block mr-2" />
                สมัครสมาชิก
              </button>

              <button
                onClick={onClose}
                className="w-full py-3 px-6 text-gray-400 hover:text-white transition-colors"
              >
                ยกเลิก
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  )
}

export default LoginRequiredModal
