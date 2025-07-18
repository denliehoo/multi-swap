'use client'
 
import NavBar from '@src/components/layout/NavBar'
import dynamic from 'next/dynamic'
 
const App = dynamic(() => import('../../pages/AppPage'), { ssr: false })
 
export function ClientOnly() {
  return (
  <>
  <NavBar />
  <App /></>
  )
}