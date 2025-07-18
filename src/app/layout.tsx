import type { Metadata } from 'next'
import '../styles/globals.css' 
import { Providers } from './providers'

export const metadata: Metadata = {
  title: 'Multiswap',
  description: 'Swap multiple tokens within one transaction',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
<html lang="en">
  {/* <head>
    <link rel="icon" href="%PUBLIC_URL%/favicon.ico" />
    <meta name="theme-color" content="#000000" />
    <link rel="apple-touch-icon" href="%PUBLIC_URL%/logo192.png" />

    <link rel="manifest" href="%PUBLIC_URL%/manifest.json" />

    <title>Multiswap</title>
  </head> */}
  <body>
    {/* <div id="root">{children}</div> */}
      <Providers>
          {children}
        </Providers>

  </body>
</html>
    
  )
}