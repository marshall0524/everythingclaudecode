import React, { useEffect, useRef } from 'react'
import { View, Text, StyleSheet, Animated } from 'react-native'
import { useTheme } from '@/lib/theme'
import type { ChatMessage } from '@/lib/types'

interface ChatBubbleProps {
  message: ChatMessage
  isUser: boolean
}

function formatTime(ts: string) {
  try {
    return new Date(ts).toLocaleTimeString('en-AU', {
      hour: '2-digit',
      minute: '2-digit',
    })
  } catch {
    return ''
  }
}

export function ChatBubble({ message, isUser }: ChatBubbleProps) {
  const theme = useTheme()
  const opacity = useRef(new Animated.Value(0)).current
  const translateY = useRef(new Animated.Value(10)).current

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start()
  }, [])

  return (
    <Animated.View
      style={[
        styles.wrapper,
        isUser ? styles.wrapperUser : styles.wrapperAdvisor,
        { opacity, transform: [{ translateY }] },
      ]}
    >
      {!isUser && (
        <View
          style={[
            styles.avatarCircle,
            { backgroundColor: theme.primary },
          ]}
        >
          <Text style={styles.avatarText}>A</Text>
        </View>
      )}

      <View style={styles.bubbleColumn}>
        <View
          style={[
            styles.bubble,
            isUser
              ? [styles.bubbleUser, { backgroundColor: theme.primary }]
              : [styles.bubbleAdvisor, { backgroundColor: theme.card, borderColor: theme.border }],
          ]}
        >
          <Text
            style={[
              styles.text,
              { color: isUser ? '#FFFFFF' : theme.text },
            ]}
          >
            {message.content}
          </Text>
        </View>
        <Text
          style={[
            styles.timestamp,
            { color: theme.muted },
            isUser ? styles.timestampRight : styles.timestampLeft,
          ]}
        >
          {formatTime(message.timestamp)}
        </Text>
      </View>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    marginVertical: 4,
    marginHorizontal: 16,
    alignItems: 'flex-end',
    gap: 8,
  },
  wrapperUser: {
    justifyContent: 'flex-end',
  },
  wrapperAdvisor: {
    justifyContent: 'flex-start',
  },
  avatarCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  bubbleColumn: {
    maxWidth: '75%',
  },
  bubble: {
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  bubbleUser: {
    borderBottomRightRadius: 4,
  },
  bubbleAdvisor: {
    borderBottomLeftRadius: 4,
    borderWidth: 1,
  },
  text: {
    fontSize: 15,
    lineHeight: 22,
  },
  timestamp: {
    fontSize: 11,
    marginTop: 3,
  },
  timestampRight: {
    textAlign: 'right',
  },
  timestampLeft: {
    textAlign: 'left',
  },
})
