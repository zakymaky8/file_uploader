import React, { ReactNode } from 'react'
import "../globals.css"

const AuthLayout = ({ children }: { children: ReactNode }) => {
  return (
    <html lang="en">
        <body className='min-w-screen min-h-screen'>
            { children }
        </body>
    </html>
  )
}

export default AuthLayout