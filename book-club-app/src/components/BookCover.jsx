export default function BookCover({ book, size = 'md', showProgress = false }) {
  const sizes = {
    xs:  { w: 48,  h: 68,  emoji: 22, fontSize: 9  },
    sm:  { w: 68,  h: 96,  emoji: 28, fontSize: 10 },
    md:  { w: 96,  h: 136, emoji: 36, fontSize: 11 },
    lg:  { w: 120, h: 170, emoji: 44, fontSize: 12 },
    xl:  { w: 160, h: 224, emoji: 56, fontSize: 13 },
  }
  const s = sizes[size]

  return (
    <div style={{ position: 'relative', flexShrink: 0 }}>
      <div
        style={{
          width: s.w,
          height: s.h,
          backgroundColor: book.coverColor,
          borderRadius: 10,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 6,
          overflow: 'hidden',
          boxShadow: '0 3px 12px rgba(0,0,0,0.18)',
          gap: 4,
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(135deg, rgba(255,255,255,0.15) 0%, transparent 60%)',
          }}
        />
        <span style={{ fontSize: s.emoji, lineHeight: 1, position: 'relative', zIndex: 1 }}>
          {book.coverEmoji}
        </span>
        {size !== 'xs' && (
          <p
            style={{
              color: 'rgba(255,255,255,0.92)',
              fontSize: s.fontSize,
              textAlign: 'center',
              fontWeight: 700,
              lineHeight: 1.25,
              position: 'relative',
              zIndex: 1,
              textShadow: '0 1px 3px rgba(0,0,0,0.25)',
              maxWidth: '90%',
              overflow: 'hidden',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
            }}
          >
            {book.title}
          </p>
        )}
      </div>
      {showProgress && book.progress > 0 && book.status === 'reading' && (
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: 3,
            background: 'rgba(255,255,255,0.3)',
            borderRadius: '0 0 10px 10px',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              height: '100%',
              width: `${book.progress}%`,
              background: 'white',
              borderRadius: '0 0 10px 10px',
            }}
          />
        </div>
      )}
    </div>
  )
}
