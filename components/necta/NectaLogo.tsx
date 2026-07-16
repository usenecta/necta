import React from "react"

interface NectaLogoProps {
  size?: number
  opacity?: number
}

const NectaLogo: React.FC<NectaLogoProps> = ({ size = 16, opacity = 1 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 16 16"
    fill="none"
    style={{ opacity, verticalAlign: "middle" }}
  >
    <defs>
      <linearGradient id="necta-grad" x1="0" y1="0" x2="16" y2="16">
        <stop offset="0%" stopColor="#F59E0B" />
        <stop offset="100%" stopColor="#EF4444" />
      </linearGradient>
    </defs>
    <polygon
      points="8,0 14.928,4 14.928,12 8,16 1.072,12 1.072,4"
      fill="url(#necta-grad)"
      opacity="0.9"
    />
    <polygon
      points="8,2 13.464,5 13.464,11 8,14 2.536,11 2.536,5"
      fill="transparent"
      stroke="rgba(26,26,24,0.2)"
      strokeWidth="0.5"
    />
  </svg>
)

export default NectaLogo
