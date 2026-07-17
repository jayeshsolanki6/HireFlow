import { useEffect } from 'react'
import { Toaster } from 'sonner'

import AppRoutes from './routes/AppRoutes'
import { useAuthStore } from './features/auth/authStore'

const App = () => {
  const refresh = useAuthStore((state) => state.refresh);

  useEffect(() => {
    refresh();
  }, [])

  return (
    <div className='h-screen'>
      <AppRoutes/>
      <Toaster richColors position='top-right'/>
    </div>
  )
}

export default App;