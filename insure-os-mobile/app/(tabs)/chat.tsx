import React, { useRef, useState, useCallback } from 'react'
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Send, RefreshCw } from 'lucide-react-native'
import { useTheme } from '@/lib/theme'
import { useStore } from '@/lib/store'
import { streamAdvisorChat } from '@/lib/claude'
import { ChatBubble } from '@/components/ChatBubble'
import { AdvisorAvatar } from '@/components/AdvisorAvatar'
import type { ChatMessage } from '@/lib/types'

const SUGGESTED_QUESTIONS = [
  "What's my travel excess?",
  'Am I covered for dental?',
  'My flight was delayed 4hrs — what can I claim?',
  'I was denied boarding. What do I do?',
  'Show me my coverage gaps',
  'Draft a claim letter for my delayed flight',
]

function TypingIndicator({ theme }: { theme: any }) {
  return (
    <View style={[styles.typingRow, { marginHorizontal: 16 }]}>
      <View style={[styles.typingAvatarCircle, { backgroundColor: theme.primary }]}>
        <Text style={{ color: '#fff', fontSize: 10, fontWeight: '700' }}>A</Text>
      </View>
      <View style={[styles.typingBubble, { backgroundColor: theme.card, borderColor: theme.border }]}>
        <Text style={[styles.typingDots, { color: theme.muted }]}>● ● ●</Text>
      </View>
    </View>
  )
}

export default function ChatScreen() {
  const insets = useSafeAreaInsets()
  const theme = useTheme()
  const flatListRef = useRef<FlatList>(null)
  const [inputText, setInputText] = useState('')
  const [streamingText, setStreamingText] = useState('')
  const streamingRef = useRef('')

  const {
    chatMessages,
    addChatMessage,
    clearChat,
    setAdvisorTyping,
    isAdvisorTyping,
    policies,
    userLocation,
  } = useStore((s) => ({
    chatMessages: s.chatMessages,
    addChatMessage: s.addChatMessage,
    clearChat: s.clearChat,
    setAdvisorTyping: s.setAdvisorTyping,
    isAdvisorTyping: s.isAdvisorTyping,
    policies: s.policies,
    userLocation: s.userLocation,
  }))

  const scrollToBottom = () => {
    setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100)
  }

  const sendMessage = useCallback(
    async (text: string) => {
      if (!text.trim() || isAdvisorTyping) return

      const userMsg: ChatMessage = {
        id: `msg-${Date.now()}-user`,
        role: 'user',
        content: text.trim(),
        timestamp: new Date().toISOString(),
      }
      addChatMessage(userMsg)
      setInputText('')
      setAdvisorTyping(true)
      scrollToBottom()

      // Build messages array for API
      const allMsgs = [...chatMessages, userMsg]
      const apiMessages = allMsgs.map((m) => ({
        role: m.role as 'user' | 'assistant',
        content: m.content,
      }))

      streamingRef.current = ''
      setStreamingText('')

      await streamAdvisorChat(
        apiMessages,
        policies,
        userLocation,
        (chunk) => {
          streamingRef.current += chunk
          setStreamingText(streamingRef.current)
          scrollToBottom()
        },
        () => {
          const advisorMsg: ChatMessage = {
            id: `msg-${Date.now()}-advisor`,
            role: 'assistant',
            content: streamingRef.current,
            timestamp: new Date().toISOString(),
          }
          addChatMessage(advisorMsg)
          setStreamingText('')
          streamingRef.current = ''
          setAdvisorTyping(false)
          scrollToBottom()
        }
      )
    },
    [chatMessages, isAdvisorTyping, policies, userLocation]
  )

  const renderItem = ({ item }: { item: ChatMessage }) => (
    <ChatBubble message={item} isUser={item.role === 'user'} />
  )

  const showSuggestions = chatMessages.length === 0

  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}>
      {/* Header */}
      <View
        style={[
          styles.header,
          {
            paddingTop: insets.top + 12,
            backgroundColor: theme.surface,
            borderBottomColor: theme.border,
          },
        ]}
      >
        <AdvisorAvatar size={40} active={true} typing={isAdvisorTyping} />
        <View style={styles.headerText}>
          <Text style={[styles.headerTitle, { color: theme.text }]}>
            InsureOS Advisor
          </Text>
          <Text style={[styles.headerSub, { color: theme.muted }]}>
            Powered by Claude
          </Text>
        </View>
        <TouchableOpacity
          style={[styles.clearBtn, { backgroundColor: theme.card, borderColor: theme.border }]}
          onPress={clearChat}
        >
          <RefreshCw size={16} color={theme.muted} />
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={0}
      >
        {/* Messages */}
        <FlatList
          ref={flatListRef}
          data={chatMessages}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={[styles.messagesList, { paddingBottom: 16 }]}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={scrollToBottom}
          ListHeaderComponent={
            showSuggestions ? (
              <View style={styles.suggestionsArea}>
                <Text style={[styles.suggestionsLabel, { color: theme.muted }]}>
                  Try asking...
                </Text>
                <FlatList
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  data={SUGGESTED_QUESTIONS}
                  keyExtractor={(q) => q}
                  contentContainerStyle={styles.suggestionScroll}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={[
                        styles.suggestionChip,
                        { backgroundColor: theme.card, borderColor: theme.border },
                      ]}
                      onPress={() => sendMessage(item)}
                    >
                      <Text style={[styles.suggestionText, { color: theme.text }]}>
                        {item}
                      </Text>
                    </TouchableOpacity>
                  )}
                />
              </View>
            ) : null
          }
          ListFooterComponent={
            <>
              {(isAdvisorTyping || streamingText) ? (
                streamingText ? (
                  <View style={[styles.typingRow, { marginHorizontal: 16, alignItems: 'flex-end' }]}>
                    <View style={[styles.typingAvatarCircle, { backgroundColor: theme.primary }]}>
                      <Text style={{ color: '#fff', fontSize: 10, fontWeight: '700' }}>A</Text>
                    </View>
                    <View
                      style={[
                        styles.streamBubble,
                        { backgroundColor: theme.card, borderColor: theme.border },
                      ]}
                    >
                      <Text style={[styles.streamText, { color: theme.text }]}>
                        {streamingText}
                      </Text>
                    </View>
                  </View>
                ) : (
                  <TypingIndicator theme={theme} />
                )
              ) : null}
            </>
          }
        />

        {/* Input area */}
        <View
          style={[
            styles.inputArea,
            {
              backgroundColor: theme.surface,
              borderTopColor: theme.border,
              paddingBottom: insets.bottom + 8,
            },
          ]}
        >
          <View
            style={[
              styles.inputWrapper,
              { backgroundColor: theme.card, borderColor: theme.border },
            ]}
          >
            <TextInput
              style={[styles.textInput, { color: theme.text }]}
              value={inputText}
              onChangeText={setInputText}
              placeholder="Ask about your coverage..."
              placeholderTextColor={theme.muted}
              multiline
              maxLength={1000}
              returnKeyType="send"
              onSubmitEditing={() => sendMessage(inputText)}
            />
            <TouchableOpacity
              style={[
                styles.sendBtn,
                {
                  backgroundColor: inputText.trim() ? theme.primary : theme.faint,
                },
              ]}
              onPress={() => sendMessage(inputText)}
              disabled={!inputText.trim() || isAdvisorTyping}
            >
              <Send size={16} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
  },
  headerText: { flex: 1 },
  headerTitle: {
    fontSize: 17,
    fontWeight: '700',
    fontFamily: Platform.select({ ios: 'System', android: 'Roboto' }),
  },
  headerSub: {
    fontSize: 12,
    fontFamily: Platform.select({ ios: 'System', android: 'Roboto' }),
  },
  clearBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  messagesList: {
    paddingTop: 16,
  },
  suggestionsArea: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  suggestionsLabel: {
    fontSize: 13,
    marginBottom: 10,
    fontFamily: Platform.select({ ios: 'System', android: 'Roboto' }),
  },
  suggestionScroll: {
    gap: 8,
  },
  suggestionChip: {
    borderRadius: 20,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 8,
    maxWidth: 220,
  },
  suggestionText: {
    fontSize: 14,
    fontFamily: Platform.select({ ios: 'System', android: 'Roboto' }),
  },
  typingRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
    marginVertical: 4,
  },
  typingAvatarCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  typingBubble: {
    borderRadius: 18,
    borderBottomLeftRadius: 4,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
  },
  typingDots: {
    fontSize: 16,
    letterSpacing: 4,
  },
  streamBubble: {
    flex: 1,
    borderRadius: 18,
    borderBottomLeftRadius: 4,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
  },
  streamText: {
    fontSize: 15,
    lineHeight: 22,
    fontFamily: Platform.select({ ios: 'System', android: 'Roboto' }),
  },
  inputArea: {
    borderTopWidth: 1,
    paddingTop: 10,
    paddingHorizontal: 16,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    borderRadius: 24,
    borderWidth: 1,
    paddingLeft: 16,
    paddingRight: 6,
    paddingVertical: 6,
    gap: 8,
  },
  textInput: {
    flex: 1,
    fontSize: 15,
    maxHeight: 96,
    fontFamily: Platform.select({ ios: 'System', android: 'Roboto' }),
    paddingVertical: 4,
  },
  sendBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
})
