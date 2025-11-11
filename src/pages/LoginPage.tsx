import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useMemberStore } from '../store/memberStore'
import { authAPI } from '../api/authAPI'
import { toast } from 'react-hot-toast'

const LoginPage = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { login, isLoading } = useMemberStore()
  const [showPassword, setShowPassword] = useState(false)
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login')

  // Set active tab based on route
  useEffect(() => {
    if (location.pathname === '/register') {
      setActiveTab('register')
    } else {
      setActiveTab('login')
    }
  }, [location.pathname])
  const [loginData, setLoginData] = useState({
    phone: '',
    password: '',
    remember: false
  })
  const [registerData, setRegisterData] = useState({
    phone: '',
    password: '',
    confirmPassword: '',
    fullname: '',
    bankCode: '',
    bankNumber: '',
    line: '',
    referralCode: ''
  })
  const [error, setError] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!loginData.phone || !loginData.password) {
      setError('กรุณากรอกข้อมูลให้ครบถ้วน')
      return
    }

    try {
      await login({
        phone: loginData.phone,
        password: loginData.password,
      })

      if (loginData.remember) {
        localStorage.setItem('rememberMe', 'true')
        localStorage.setItem('savedPhone', loginData.phone)
      } else {
        localStorage.removeItem('rememberMe')
        localStorage.removeItem('savedPhone')
      }

      // Wait for Zustand persist to save, then navigate
      setTimeout(() => {
        navigate('/member')
      }, 100)
    } catch (err) {
      setError('เข้าสู่ระบบไม่สำเร็จ กรุณาตรวจสอบเบอร์โทรและรหัสผ่าน')
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    // Validate password match
    if (registerData.password !== registerData.confirmPassword) {
      setError('รหัสผ่านไม่ตรงกัน')
      return
    }

    // Validate phone number
    if (!/^0[0-9]{9}$/.test(registerData.phone)) {
      setError('เบอร์โทรศัพท์ไม่ถูกต้อง (ต้องเป็น 10 หลัก)')
      return
    }

    // Validate password length
    if (registerData.password.length < 6) {
      setError('รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร')
      return
    }

    // Validate bank number
    if (!/^[0-9]{10,12}$/.test(registerData.bankNumber)) {
      setError('เลขบัญชีไม่ถูกต้อง (ต้องเป็น 10-12 หลัก)')
      return
    }

    try {
      // Call register API
      const response = await authAPI.register({
        phone: registerData.phone,
        password: registerData.password,
        fullname: registerData.fullname,
        bankCode: registerData.bankCode,
        bankNumber: registerData.bankNumber,
        line: registerData.line || undefined,
        ref: registerData.referralCode || undefined,
      })

      // Show success message
      toast.success('สมัครสมาชิกสำเร็จ! กำลังเข้าสู่ระบบ...')

      // Auto login after successful registration
      const { user, accessToken, refreshToken } = response
      
      // Save to store
      useMemberStore.getState().setAuth(user, accessToken, refreshToken)

      // Navigate to member page
      setTimeout(() => {
        navigate('/member')
      }, 500)

    } catch (err: any) {
      console.error('Register error:', err)
      const errorMessage = err.response?.data?.message || 'สมัครสมาชิกไม่สำเร็จ กรุณาลองใหม่อีกครั้ง'
      setError(errorMessage)
      toast.error(errorMessage)
    }
  }

  return (
    <div className="min-h-screen bg-[#0f1419] flex items-center justify-center p-4">
      {/* Background Overlay */}
      <div 
        className="fixed inset-0 bg-black/80"
        onClick={() => navigate('/')}
      />

      {/* Modal Card */}
      <div className="relative z-10 w-full max-w-md animate-fadeIn">
        {/* Modal Content */}
        <div className="bg-[#1a1f26] rounded-2xl shadow-2xl border border-gray-800 overflow-hidden">
          {/* Close Button */}
          <button
            onClick={() => navigate('/')}
            className="absolute top-4 right-4 z-50 text-gray-400 hover:text-white transition"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Tab Buttons */}
          <div className="flex border-b border-gray-700">
            <button
              onClick={() => { setActiveTab('register'); setError('') }}
              className={`flex-1 py-4 px-6 font-bold text-sm transition relative ${
                activeTab === 'register'
                  ? 'text-white bg-gradient-to-b from-[#fbbf24] to-[#f59e0b]'
                  : 'text-gray-400 hover:text-white bg-[#0f1419]'
              }`}
            >
              สมัครสมาชิก
              {activeTab === 'register' && (
                <span className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded">NEW</span>
              )}
            </button>
            <button
              onClick={() => { setActiveTab('login'); setError('') }}
              className={`flex-1 py-4 px-6 font-bold text-sm transition ${
                activeTab === 'login'
                  ? 'text-white bg-gradient-to-b from-[#10b981] to-[#059669]'
                  : 'text-gray-400 hover:text-white bg-[#0f1419]'
              }`}
            >
              เข้าสู่ระบบ
            </button>
          </div>

          {/* Form Container */}
          <div className="p-8">
          {/* Login Form */}
          {activeTab === 'login' && (
            <form onSubmit={handleLogin} className="space-y-5">
              {error && (
                <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-3 text-red-500 text-sm text-center">
                  {error}
                </div>
              )}

              <div>
                <input
                  type="tel"
                  value={loginData.phone}
                  onChange={(e) => setLoginData({ ...loginData, phone: e.target.value })}
                  className="w-full px-4 py-3 bg-[#0f1419] border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-yellow-500 transition"
                  placeholder="เบอร์โทรศัพท์"
                  maxLength={10}
                  required
                />
              </div>

              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={loginData.password}
                  onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                  className="w-full px-4 py-3 bg-[#0f1419] border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-yellow-500 transition"
                  placeholder="รหัสผ่าน"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-300"
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-gradient-to-b from-[#10b981] to-[#059669] text-white font-bold rounded-lg hover:opacity-90 transition disabled:opacity-50"
              >
                {isLoading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ'}
              </button>

              <div className="text-center">
                <button
                  type="button"
                  className="text-sm text-yellow-500 hover:text-yellow-400 transition"
                >
                  ลืมรหัสผ่าน?
                </button>
              </div>
            </form>
          )}

          {/* Register Form */}
          {activeTab === 'register' && (
            <form onSubmit={handleRegister} className="space-y-3">
              {error && (
                <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-3 text-red-500 text-sm text-center">
                  {error}
                </div>
              )}

              <div>
                <input
                  type="tel"
                  value={registerData.phone}
                  onChange={(e) => setRegisterData({ ...registerData, phone: e.target.value })}
                  className="w-full px-4 py-2.5 bg-[#0f1419] border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-yellow-500 transition text-sm"
                  placeholder="เบอร์โทรศัพท์ (10 หลัก)"
                  pattern="0[0-9]{9}"
                  required
                />
              </div>

              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={registerData.password}
                  onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                  className="w-full px-4 py-2.5 bg-[#0f1419] border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-yellow-500 transition text-sm"
                  placeholder="รหัสผ่าน (อย่างน้อย 6 ตัว)"
                  minLength={6}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-300"
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>

              <div>
                <input
                  type="password"
                  value={registerData.confirmPassword}
                  onChange={(e) => setRegisterData({ ...registerData, confirmPassword: e.target.value })}
                  className="w-full px-4 py-2.5 bg-[#0f1419] border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-yellow-500 transition text-sm"
                  placeholder="ยืนยันรหัสผ่าน"
                  required
                />
              </div>

              <div>
                <input
                  type="text"
                  value={registerData.fullname}
                  onChange={(e) => setRegisterData({ ...registerData, fullname: e.target.value })}
                  className="w-full px-4 py-2.5 bg-[#0f1419] border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-yellow-500 transition text-sm"
                  placeholder="ชื่อ-นามสกุล"
                  minLength={3}
                  required
                />
              </div>

              <div>
                <select
                  value={registerData.bankCode}
                  onChange={(e) => setRegisterData({ ...registerData, bankCode: e.target.value })}
                  className="w-full px-4 py-2.5 bg-[#0f1419] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-yellow-500 transition text-sm"
                  required
                >
                  <option value="">เลือกธนาคาร</option>
                  <option value="KBANK">กสิกรไทย (KBANK)</option>
                  <option value="SCB">ไทยพาณิชย์ (SCB)</option>
                  <option value="BBL">กรุงเทพ (BBL)</option>
                  <option value="KTB">กรุงไทย (KTB)</option>
                  <option value="TMB">ทหารไทยธนชาต (TTB)</option>
                  <option value="BAY">กรุงศรีอยุธยา (BAY)</option>
                  <option value="GSB">ออมสิน (GSB)</option>
                  <option value="BAAC">ธ.ก.ส. (BAAC)</option>
                  <option value="TRUEWALLET">TrueMoney Wallet</option>
                </select>
              </div>

              <div>
                <input
                  type="text"
                  value={registerData.bankNumber}
                  onChange={(e) => setRegisterData({ ...registerData, bankNumber: e.target.value })}
                  className="w-full px-4 py-2.5 bg-[#0f1419] border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-yellow-500 transition text-sm"
                  placeholder="เลขบัญชี (10-12 หลัก)"
                  pattern="[0-9]{10,12}"
                  required
                />
              </div>

              <div>
                <input
                  type="text"
                  value={registerData.line}
                  onChange={(e) => setRegisterData({ ...registerData, line: e.target.value })}
                  className="w-full px-4 py-2.5 bg-[#0f1419] border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-yellow-500 transition text-sm"
                  placeholder="LINE ID (ไม่บังคับ)"
                />
              </div>

              <div>
                <input
                  type="text"
                  value={registerData.referralCode}
                  onChange={(e) => setRegisterData({ ...registerData, referralCode: e.target.value })}
                  className="w-full px-4 py-2.5 bg-[#0f1419] border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-yellow-500 transition text-sm"
                  placeholder="รหัสแนะนำ (ถ้ามี)"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-gradient-to-b from-[#fbbf24] to-[#f59e0b] text-white font-bold rounded-lg hover:opacity-90 transition disabled:opacity-50 mt-2"
              >
                {isLoading ? 'กำลังสมัครสมาชิก...' : 'สมัครสมาชิก'}
              </button>
            </form>
          )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
