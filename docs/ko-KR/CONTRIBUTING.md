# Everything Claude Code에 기여하기

기여에 관심을 가져주셔서 감사합니다! 이 저장소는 Claude Code 사용자를 위한 커뮤니티 리소스입니다.

## 목차

- [우리가 찾는 것](#우리가-찾는-것)
- [빠른 시작](#빠른-시작)
- [스킬 기여하기](#스킬-기여하기)
- [에이전트 기여하기](#에이전트-기여하기)
- [훅 기여하기](#훅-기여하기)
- [커맨드 기여하기](#커맨드-기여하기)
- [Pull Request 프로세스](#pull-request-프로세스)

---

## 우리가 찾는 것

### 에이전트
특정 작업을 잘 처리하는 새로운 에이전트:
- 언어별 리뷰어 (Python, Go, Rust)
- 프레임워크 전문가 (Django, Rails, Laravel, Spring)
- DevOps 전문가 (Kubernetes, Terraform, CI/CD)
- 도메인 전문가 (ML 파이프라인, 데이터 엔지니어링, 모바일)

### 스킬
워크플로우 정의와 도메인 지식:
- 언어 모범 사례
- 프레임워크 패턴
- 테스팅 전략
- 아키텍처 가이드

### 훅
유용한 자동화:
- 린팅/포매팅 훅
- 보안 검사
- 유효성 검증 훅
- 알림 훅

### 커맨드
유용한 워크플로우를 호출하는 슬래시 커맨드:
- 배포 커맨드
- 테스팅 커맨드
- 코드 생성 커맨드

---

## 빠른 시작

```bash
# 1. 포크 및 클론
gh repo fork affaan-m/everything-claude-code --clone
cd everything-claude-code

# 2. 브랜치 생성
git checkout -b feat/my-contribution

# 3. 기여 항목 추가 (아래 섹션 참고)

# 4. 로컬 테스트
cp -r skills/my-skill ~/.claude/skills/  # 스킬의 경우
# 그런 다음 Claude Code로 테스트

# 5. PR 제출
git add . && git commit -m "feat: add my-skill" && git push -u origin feat/my-contribution
```

---

## 스킬 기여하기

스킬은 Claude Code가 컨텍스트에 따라 로드하는 지식 모듈입니다.

### 디렉토리 구조

```
skills/
└── your-skill-name/
    └── SKILL.md
```

### SKILL.md 템플릿

```markdown
---
name: your-skill-name
description: 스킬 목록에 표시되는 간단한 설명
origin: ECC
---

# 스킬 제목

이 스킬이 다루는 내용에 대한 간단한 개요.

## 핵심 개념

주요 패턴과 가이드라인 설명.

## 코드 예제

\`\`\`typescript
// 실용적이고 테스트된 예제 포함
function example() {
  // 잘 주석 처리된 코드
}
\`\`\`

## 모범 사례

- 실행 가능한 가이드라인
- 해야 할 것과 하지 말아야 할 것
- 흔한 실수 방지

## 사용 시점

이 스킬이 적용되는 시나리오 설명.
```

### 스킬 체크리스트

- [ ] 하나의 도메인/기술에 집중
- [ ] 실용적인 코드 예제 포함
- [ ] 500줄 미만
- [ ] 명확한 섹션 헤더 사용
- [ ] Claude Code에서 테스트 완료

### 스킬 예시

| 스킬 | 용도 |
|------|------|
| `coding-standards/` | TypeScript/JavaScript 패턴 |
| `frontend-patterns/` | React와 Next.js 모범 사례 |
| `backend-patterns/` | API와 데이터베이스 패턴 |
| `security-review/` | 보안 체크리스트 |

---

## 에이전트 기여하기

에이전트는 Task 도구를 통해 호출되는 전문 어시스턴트입니다.

### 파일 위치

```
agents/your-agent-name.md
```

### 에이전트 템플릿

```markdown
---
name: your-agent-name
description: 이 에이전트가 하는 일과 Claude가 언제 호출해야 하는지. 구체적으로 작성!
tools: ["Read", "Write", "Edit", "Bash", "Grep", "Glob"]
model: sonnet
---

당신은 [역할] 전문가입니다.

## 역할

- 주요 책임
- 부차적 책임
- 하지 않는 것 (경계)

## 워크플로우

### 1단계: 이해
작업에 접근하는 방법.

### 2단계: 실행
작업을 수행하는 방법.

### 3단계: 검증
결과를 검증하는 방법.

## 출력 형식

사용자에게 반환하는 것.

## 예제

### 예제: [시나리오]
입력: [사용자가 제공하는 것]
행동: [수행하는 것]
출력: [반환하는 것]
```

### 에이전트 필드

| 필드 | 설명 | 옵션 |
|------|------|------|
| `name` | 소문자, 하이픈 연결 | `code-reviewer` |
| `description` | 호출 시점 결정에 사용 | 구체적으로 작성! |
| `tools` | 필요한 것만 포함 | `Read, Write, Edit, Bash, Grep, Glob, WebFetch, Task` |
| `model` | 복잡도 수준 | `haiku` (단순), `sonnet` (코딩), `opus` (복잡) |

---

## 훅 기여하기

훅은 Claude Code 이벤트에 의해 트리거되는 자동 동작입니다.

### 파일 위치

```
hooks/hooks.json
```

### 훅 유형

| 유형 | 트리거 시점 | 사용 사례 |
|------|-----------|----------|
| `PreToolUse` | 도구 실행 전 | 유효성 검증, 경고, 차단 |
| `PostToolUse` | 도구 실행 후 | 포매팅, 검사, 알림 |
| `SessionStart` | 세션 시작 시 | 컨텍스트 로딩 |
| `Stop` | 세션 종료 시 | 정리, 감사 |

### 훅 체크리스트

- [ ] Matcher가 구체적 (너무 광범위하지 않게)
- [ ] 명확한 오류/정보 메시지 포함
- [ ] 올바른 종료 코드 사용 (`exit 1`은 차단, `exit 0`은 허용)
- [ ] 충분한 테스트 완료
- [ ] 설명 포함

---

## 커맨드 기여하기

커맨드는 `/command-name`으로 사용자가 호출하는 액션입니다.

### 파일 위치

```
commands/your-command.md
```

### 커맨드 예시

| 커맨드 | 용도 |
|--------|------|
| `commit.md` | Git 커밋 생성 |
| `code-review.md` | 코드 변경사항 리뷰 |
| `tdd.md` | TDD 워크플로우 |
| `e2e.md` | E2E 테스팅 |

---

## Pull Request 프로세스

### 1. PR 제목 형식

```
feat(skills): add rust-patterns skill
feat(agents): add api-designer agent
feat(hooks): add auto-format hook
fix(skills): update React patterns
docs: improve contributing guide
```

### 2. PR 설명

```markdown
## 요약
무엇을 추가했고 왜 필요한지.

## 유형
- [ ] 스킬
- [ ] 에이전트
- [ ] 훅
- [ ] 커맨드

## 테스트
어떻게 테스트했는지.

## 체크리스트
- [ ] 형식 가이드라인 준수
- [ ] Claude Code에서 테스트 완료
- [ ] 민감한 정보 없음 (API 키, 경로)
- [ ] 명확한 설명 포함
```

### 3. 리뷰 프로세스

1. 메인테이너가 48시간 이내에 리뷰
2. 피드백이 있으면 수정 반영
3. 승인되면 main에 머지

---

## 가이드라인

### 해야 할 것
- 기여를 집중적이고 모듈화되게 유지
- 명확한 설명 포함
- 제출 전 테스트
- 기존 패턴 따르기
- 의존성 문서화

### 하지 말아야 할 것
- 민감한 데이터 포함 (API 키, 토큰, 경로)
- 지나치게 복잡하거나 특수한 설정 추가
- 테스트하지 않은 기여 제출
- 기존 기능과 중복되는 것 생성

---

## 파일 이름 규칙

- 소문자에 하이픈 사용: `python-reviewer.md`
- 설명적으로 작성: `workflow.md`가 아닌 `tdd-workflow.md`
- name과 파일명을 일치시키기

---

## 질문이 있으신가요?

- **이슈:** [github.com/affaan-m/everything-claude-code/issues](https://github.com/affaan-m/everything-claude-code/issues)
- **X/Twitter:** [@affaanmustafa](https://x.com/affaanmustafa)

---

기여해 주셔서 감사합니다! 함께 훌륭한 리소스를 만들어 갑시다.
