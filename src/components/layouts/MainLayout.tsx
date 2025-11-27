import { Outlet } from 'react-router-dom'
import Navbar from '@components/common/Navbar'
import Footer from '@components/common/Footer'
import { useTranslation } from 'react-i18next'

const MainLayout = () => {
  const { t } = useTranslation()
  return (
    <div className="min-h-screen flex flex-col bg-pattern">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

export default MainLayout
