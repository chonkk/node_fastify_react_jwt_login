# NOVA JWT Login

React/Vite 프론트엔드와 Express/JWT 백엔드로 구성된 로그인 예제입니다.

## 요구 사항

- Node.js 18 이상
- npm

## 설치

프로젝트 루트에서 의존성을 설치합니다.

```bash
npm install
```

## 개발 서버 실행

프론트엔드와 백엔드를 각각 실행해야 합니다.

터미널 1에서 JWT API 서버를 실행합니다.

```bash
npm run server
```

백엔드는 `http://localhost:4000`에서 실행됩니다.

터미널 2에서 React 개발 서버를 실행합니다.

```bash
npm run dev
```

프론트엔드는 `http://localhost:5173`에서 확인할 수 있습니다.

## 데모 로그인

```text
이메일: demo@nova.io
비밀번호: nova1234
```

로그인에 성공하면 백엔드가 JWT access token을 발급하고, 프론트엔드는 `/api/me`를 호출해 인증된 사용자를 확인합니다.

## 빌드

production용 정적 파일을 생성합니다.

```bash
npm run build
```

빌드 결과는 `dist/` 폴더에 생성됩니다.

빌드 결과를 로컬에서 미리 확인하려면 먼저 백엔드를 실행한 뒤 아래 명령을 실행합니다.

```bash
npm run preview
```

## 검사

Oxlint를 실행합니다.

```bash
npm run lint
```

## API 엔드포인트

| Method | Endpoint | 설명 |
| --- | --- | --- |
| `POST` | `/api/auth/login` | 이메일과 비밀번호로 JWT 발급 |
| `GET` | `/api/me` | `Authorization: Bearer <token>`으로 현재 사용자 확인 |

기본 JWT secret은 로컬 개발용 값입니다. 실제 배포 환경에서는 `JWT_SECRET` 환경 변수를 반드시 별도의 안전한 값으로 설정해야 합니다.
