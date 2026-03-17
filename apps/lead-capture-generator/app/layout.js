export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <title>The Digital Income Starter Kit - Free</title>
        <meta name="description" content="3 simple tools to start earning online—no tech skills required" />
      </head>
      <body style={{ margin: 0, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
        {children}
      </body>
    </html>
  )
}
