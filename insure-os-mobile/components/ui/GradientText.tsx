import React from 'react'
import { Text, TextStyle } from 'react-native'
import Svg, { Defs, LinearGradient, Stop, Text as SvgText } from 'react-native-svg'

interface GradientTextProps {
  text: string
  colors?: [string, string]
  style?: TextStyle
  fontSize?: number
  fontWeight?: string
}

export function GradientText({
  text,
  colors = ['#4F6EF7', '#10B981'],
  style,
  fontSize = 24,
  fontWeight = 'bold',
}: GradientTextProps) {
  // Approximate text width based on character count and font size
  const approxWidth = text.length * fontSize * 0.6
  const height = fontSize * 1.4

  return (
    <Svg width={approxWidth} height={height}>
      <Defs>
        <LinearGradient id="textGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <Stop offset="0%" stopColor={colors[0]} />
          <Stop offset="100%" stopColor={colors[1]} />
        </LinearGradient>
      </Defs>
      <SvgText
        fill="url(#textGrad)"
        fontSize={fontSize}
        fontWeight={fontWeight}
        x={0}
        y={fontSize}
      >
        {text}
      </SvgText>
    </Svg>
  )
}
