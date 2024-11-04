# 프로젝트 소개

이 프로젝트는 NestJS로 구현된 백엔드 서비스로
질문과 답변을 관리하는 API를 제공합니다.

사용자들은 질문을 작성하고 답변을 달 수 있으며
해시태그를 통해 질문을 분류할 수 있습니다.
또한 Kakao OAuth를 이용한 소셜 로그인 기능을 지원합니다.

## 기능

### 사용자 인증 및 인가

- Kakao OAuth 로그인 (auth.service.ts)

### 질문 관리

- 질문 생성, 조회, 수정, 삭제 기능
  `(questions.controller.ts)`

### 답변 관리

- 답변 생성, 조회, 수정, 삭제 기능 `(answers.controller.ts)`

### 해시태그 관리

- 질문에 해시태그 추가 기능

### API 응답 포맷 통일

- 성공 및 실패 응답 클래스 (`success.response.ts`, `fail.response.ts`)

## 설치 및 실행 방법

1. 저장소를 클론합니다.

   ```
   git clone <저장소 URL>
   cd <프로젝트 디렉토리>
   ```

2. 필요한 패키지를 설치합니다.

   ```
   npm install
   ```

3. 환경 변수를 설정합니다. .env 파일을 생성하고 다음 내용을 추가합니다.

   ```
   DB_HOST=<데이터베이스 호스트>
   DB_PORT=<데이터베이스 포트>
   DB_USERNAME=<데이터베이스 사용자명>
   DB_PASSWORD=<데이터베이스 비밀번호>
   DB_NAME=<데이터베이스 이름>
   KAKAO_CLIENT_ID=<카카오 클라이언트 ID>
   KAKAO_REDIRECT_URI=<카카오 리다이렉트 URI>
   ```

4. 애플리케이션을 빌드합니다.
   ```
   npm run build
   ```

애플리케이션을 실행합니다.

npm run start

## 사용된 기술 스택

- Node.js
- NestJS
- TypeScript
- TypeORM
- MySQL
- Axios

## 폴더 구조

```
src/
├── answers/
│   ├── answers.controller.ts
│   ├── answers.service.ts
│   └── ...
├── auth/
│   ├── auth.service.ts
│   ├── auth.module.ts
│   └── ...
├── common/
│   ├── api-response/
│   │   ├── success.response.ts
│   │   └── fail.response.ts
│   └── ...
├── questions/
│   ├── questions.controller.ts
│   ├── questions.service.ts
│   └── ...
├── users/
│   ├── users.controller.ts
│   ├── users.service.ts
│   └── ...
├── app.module.ts
└── main.ts
```
