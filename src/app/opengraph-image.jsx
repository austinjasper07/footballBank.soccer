import { ImageResponse } from 'next/og'
 
export const runtime = 'edge'
 
export const alt = 'FootballBank - Global Football Talent Platform'
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'
 
export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #dc2626 0%, #991b1b 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          fontFamily: 'system-ui',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 40,
          }}
        >
          <div
            style={{
              width: 80,
              height: 80,
              borderRadius: '50%',
              background: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: 20,
            }}
          >
            ⚽
          </div>
          <div
            style={{
              fontSize: 60,
              fontWeight: 'bold',
              color: 'white',
            }}
          >
            FootballBank
          </div>
        </div>
        <div
          style={{
            fontSize: 32,
            color: 'rgba(255, 255, 255, 0.9)',
            textAlign: 'center',
            maxWidth: 800,
            lineHeight: 1.4,
          }}
        >
          Empowering Football Talent Worldwide
        </div>
        <div
          style={{
            fontSize: 24,
            color: 'rgba(255, 255, 255, 0.8)',
            textAlign: 'center',
            marginTop: 20,
          }}
        >
          Discover • Connect • Showcase
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}
