# mygoods (마이굿즈) - Pi Browser 기반 위치 인증 신뢰 중고거래 플랫폼

본 문서는 **Pi Browser(피 브라우저) 환경**에서 작동하며, 한국의 인기 중고거래 서비스인 **당근마켓(Karrot)**을 모티브로 한 오프라인 동네 기반 중고거래 플랫폼 **mygoods(마이굿즈)**의 아키텍처 및 구현 가이드라인을 상세히 기술합니다.

안전한 거래를 위해 **실시간 GPS 위치 인증** 및 **Pi Network SDK를 통한 사용자 로그인 & 결제(Pi 코인)**를 중심으로 구축하며, **Next.js + Supabase + Vercel** 기술 스택 기반으로 실전 인프라 디자인을 제시합니다.

---

## 1. 아키텍처 개요 (Tech Stack)

| 구분 | 선정 기술 | 비고 및 선정 기준 |
| :--- | :--- | :--- |
| **Frontend** | **Next.js 14+ (App Router)** | SEO 및 초기 진입 속도 최적화, SSR/ISR 지원 및 API Routes 활용을 통한 보안 서버 게이트웨이 구축 |
| **Styling** | **Tailwind CSS v4** | 당근마켓의 따뜻한 주황색 포인트 컬러 및 미니멀한 카드 중심 레이아웃 빠른 구현 |
| **Database** | **Supabase (PostgreSQL)** | 실시간 채팅 구현을 위한 Realtime Database, 복잡한 지리 쿼리(PostGIS)를 위한 확장성 |
| **Authentication**| **Pi Network SDK Auth** | Pi Browser 내 파이 아이디(Username, UID)를 고유 키로 활용하여 Supabase Auth와 동기화 |
| **Payment API** | **Pi Network Payments V2** | Pi SDK 및 Vercel Serverless Function(또는 Next.js API Routes)를 결합한 안전한 블록체인 결제 흐름 |
| **Hosting** | **Vercel** | Next.js 최적화 배포, 빠른 글로벌 Edge CDN 성능 및 서버리스 서버 지원 |

---

## 2. 디자인 가이드라인 (당근마켓 모티브)

### 2.1 UI/UX 기본 방향
- **주요 색상**: 당근마켓 특유의 신뢰감과 따뜻함을 주는 **당근 주황색 (`#FF7E36`)**을 대표 브랜드 컬러로 설정합니다.
- **레이아웃**: 모바일 모던 웹 환경(Pi Browser 웹뷰)에 전적으로 최적화된 **App-like Single View 인터페이스**를 준수합니다.
- **네비게이션 (Bottom Tab Bar)**:
  - 🏠 **홈**: 내 동네 반경 내 등록된 실시간 판매 상품 피드
  - 📍 **동네 인증**: 내 현재 하드웨어 GPS를 파악하고 조작 불가능한 인증 상태를 확인하는 곳
  - 💬 **채팅**: 이웃 구매자-판매자간 Supabase 실시간 소켓 기반 일대일 대화방
  - 👤 **나의 마이굿즈**: 내 프로필, 매너 온도(온정 온도), 내가 판매중/구매완료한 내역 관리

### 2.2 피 브라우저(Pi Browser) 전용 디자인 고려사항
- **더블 헤더 방지**: Pi Browser 자체의 오버레이 상단 바가 존재하므로, 앱 내 헤더는 지나치게 두껍지 않고 간결하게 가져갑니다.
- **웹뷰 샌드박스 극복**: Pi Browser 내 iframe 형태의 결제창 및 GPS 호출이 부드럽게 작동하도록 `requestFramePermissions: ["geolocation"]`을 필수로 활스팅하고 표준 기기 API를 활용합니다.

---

## 3. 핵심 기능 설계 (Core Features)

### 3.1 Pi Network 로그인 (Pi ID 연동)
Pi SDK를 활용하여 사용자의 계정을 피 네트워크 지갑 및 계정과 묶습니다. 별도의 이메일이나 비밀번호 가입이 필요 없으며 극도의 단순한 온보딩을 구현합니다.

```javascript
// Pi SDK 로딩 후 프론트엔드 연동 가상 코드
import { useEffect, useState } from 'react';

export function usePiAuth() {
  const [piUser, setPiUser] = useState(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.Pi) {
      // 1. Pi SDK 초기화
      window.Pi.init({ version: "2.0", sandbox: false });
      
      // 2. 인증 요청
      const scopes = ['username', 'payments'];
      window.Pi.authenticate(scopes, onIncompletePaymentFound)
        .then((auth) => {
          setPiUser(auth.user);
          // 3. Supabase 백엔드에 사용자 정보Upsert API 호출
          syncUserWithSupabase(auth.user);
        })
        .catch((err) => console.error("Pi Auth Failed", err));
    }
  }, []);

  function onIncompletePaymentFound(payment) {
    // 해결중 끊긴 미완료 트랜잭션이 있을 때 서버에 확인 후 복구 처리
    fetch('/api/payments/incomplete', {
      method: 'POST',
      body: JSON.stringify({ payment })
    });
  }

  return { piUser };
}
```

---

### 3.2 GPS 조작 방지 및 실시간 위치 인증 (Anti-Spoofing & Geofencing)

중고거래 특성상 타 지역에서 타인의 매물을 미인증 상태로 거래하는 사기 행위를 방지하기 위해, 강력한 GPS 조작 방지 알고리즘 및 인증 만료(Expiration) 정책을 수립합니다.

#### 🛡️ 위치 조작 및 허위 인증 원천 차단 시나리오
1. **하드웨어 데이터 정밀 체크 (Geolocation Sensor Properties)**:
   - 단순히 `latitude`, `longitude`만 받는 것이 아니라 HTML5 Geolocation API의 `accuracy`(정확도 오차 반경) 필드를 무조건 확인합니다.
   - GPS 위성 수신이 아닌 셀룰러/Wi-Fi 기반의 가공 물리 데이터는 `accuracy` 오차가 수백 미터 이상일 수 있습니다. 오차가 너무 크거나 특정 가상 머신 시뮬레이션 환경으로 판단 시 반려합니다.
2. **네트워크 IP 기반의 교차 검증 (Cross-matching)**:
   - 클라이언트에서 제출한 GPS 좌표를 활용해 백엔드 역지오코딩(Reverse Geocoding)으로 행정구역(예: 서울시 마포구 창전동)을 취득합니다.
   - 이때, 요청을 수신한 Supabase Edge Function 혹은 Next.js Server Node에서 사용자의 접속 IP의 지리적 위치(GeoIP)를 교차 매칭합니다.
   - 기기 GPS와 IP 대역의 추정 좌표가 서로 국가 단위나 주요 광역시 수준으로 과도하게 다를 경우 즉시 인증을 제어하고 경고 문구를 표시합니다.
3. **인증 만료 유효기간 설정 (24시간 주기 룰)**:
   - 사용자는 **매 24시간 또는 48시간마다 한번씩** 해당 물리 장소에 위치하여 "동네 인증" 버튼을 실시간으로 눌러야 합니다.
   - 미인증 기간이 지난 사용자는 다른 동네 상품의 피드를 읽을 수는 있으나, **"세부 채팅 문의 전송"** 및 **"새로운 상품 게시물 등록"** 권한이 자동으로 박탈(Read-Only 계정 상태로 대기)됩니다.
4. **HTML5 `isMock` 감지 기술 적용 제언**:
   - 모바일 에뮬레이터나 Fake GPS 앱은 브라우저에 가상의 Geolocation 공급자 신호를 보냅니다. 최신 브라우저 메커니즘에서 위조 방지가 설정된 좌표인지를 확인하는 비정상 가속도 신호 분석 로직을 탑재합니다.

---

### 3.3 위치 기반 근거리 조건부 목록 조회 (PostGIS & Distance Query)

Supabase PostgreSQL의 강력한 지리정보 플러그인(`postgis`) 혹은 삼각 함수(`Haversine`) 공식을 사용해 사용자의 승인된 동네 위치 기준 지정한 반경(예: 1km, 3km, 5km, 10km)에 속하는 상품만 필터링하여 노출합니다.

```sql
-- Supabase에서 실행될 RPC 함수 정의: 내 반경 내 상품 찾기
CREATE OR REPLACE FUNCTION get_items_within_radius (
  user_lat DOUBLE PRECISION,
  user_lng DOUBLE PRECISION,
  radius_in_km DOUBLE PRECISION
)
RETURNS TABLE (
  id UUID,
  title TEXT,
  price NUMERIC,
  image_urls TEXT[],
  status TEXT,
  town_name TEXT,
  distance DOUBLE PRECISION,
  created_at TIMESTAMPTZ
) 
LANGUAGE plpgsql AS $$
BEGIN
  RETURN QUERY
  SELECT 
    i.id,
    i.title,
    i.price,
    i.image_urls,
    i.status,
    i.town_name,
    -- Haversine 공식을 사용한 지구 중심 거리 계산 (km 단위)
    (6371 * acos(
      cos(radians(user_lat)) * cos(radians(i.latitude)) * 
      cos(radians(i.longitude) - radians(user_lng)) + 
      sin(radians(user_lat)) * sin(radians(i.latitude))
    )) AS distance,
    i.created_at
  FROM items i
  WHERE 
    i.status = 'selling' AND
    (6371 * acos(
      cos(radians(user_lat)) * cos(radians(i.latitude)) * 
      cos(radians(i.longitude) - radians(user_lng)) + 
      sin(radians(user_lat)) * sin(radians(i.latitude))
    )) <= radius_in_km
  ORDER BY distance ASC, i.created_at DESC;
END;
$$;
```

---

### 3.4 Pi 코인 안전 결제 웹 플로우 (Pi Payments integration)

**보유한 Pi 코인으로 결제가 완료된 상품에 한해 거래 확정이 일어납니다.**
Pi Network의 Payments API는 양방향 승인 구조(Server-Approval & Server-Completion)로 매우 안전한 거래 승인을 강제합니다.

#### 🔄 결제 프로세스 아키텍처 흐름

```
[클라이언트(사용자)] -------------(1) 결제 생성 요청-------------> [Pi SDK]
       |                                                         |
       |                                                         | (2) 승인요청 대기
       v                                                         v
[Next.js API 서버] <-------(3) 결제 승인 요청 (POST)---------[Pi App Server]
       | (Supabase 검증)
       v
[Pi Developer API] <-------------(4) Approve 전송--------------> [Pi App Server]
       |
       | (5) 사용자 블록체인 트랜잭션 서명 (Pi Wallet)
       v
[클라이언트(사용자)] <------------(6) txid 리턴------------------ [Pi SDK]
       |
       v
[Next.js API 서버] <------(7) 결제 완료 요청 (txid 첨부)-------- [클라이언트]
       |
       | (8) Complete 요청 전송
       v
[Pi Developer API] <-----------(9) 결제 최종 처리 완료-----------> [Pi App Server]
```

#### 🛠️ 프론트엔드 Pi 결제 코드 패턴
```javascript
function initiatePiPayment(item) {
  const paymentData = {
    amount: item.pricePi, // 예: 5.5 Pi
    memo: `mygoods: [${item.town_name}] ${item.title} 중고거래 대금`,
    metadata: { itemId: item.id }
  };

  const callbacks = {
    onReadyForServerApproval: async (paymentId) => {
      // 1단계: 백엔드 서버에 paymentId를 보냄 -> 서버에서 Pi Dev API로 Approve 호출
      await fetch('/api/payments/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentId })
      });
    },
    onReadyForServerCompletion: async (paymentId, txid) => {
      // 2단계: 유저가 서명하여 트랜잭션이 블록체인에 전송되면 txid를 얻어 서버로 전송 -> 서버에서 Complete 호출
      await fetch('/api/payments/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentId, txid })
      });
      alert("🎉 Pi Payment Completed successfully!");
    },
    onCancel: (paymentId) => {
      console.log("Payment canceled", paymentId);
    },
    onError: (error, payment) => {
      console.error("Payment error", error, payment);
    }
  };

  // Pi 브라우저 지갑 실행
  window.Pi.createPayment(paymentData, callbacks);
}
```

---

## 4. 데이터베이스 스키마 설계 (Supabase PostgreSQL)

### 4.1 `profiles` (사용자 프로필 테이블)
```sql
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  pi_username TEXT UNIQUE NOT NULL,
  pi_uid TEXT UNIQUE NOT NULL,
  avatar_url TEXT,
  manner_temperature NUMERIC DEFAULT 36.5,
  verified_latitude DOUBLE PRECISION,
  verified_longitude DOUBLE PRECISION,
  last_verified_at TIMESTAMPTZ,
  registered_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 4.2 `items` (판매 물품 테이블)
```sql
CREATE TABLE public.items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  seller_id UUID REFERENCES public.profiles(id) NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  price_pi NUMERIC NOT NULL, -- 파이 단위 물품 가치
  price_krw NUMERIC, -- 참고용 원화 가치 (선택)
  image_urls TEXT[] DEFAULT '{}',
  latitude DOUBLE PRECISION NOT NULL, -- 상품 게시 당시 조작방지 인증된 판매자 경도
  longitude DOUBLE PRECISION NOT NULL, -- 위도
  town_name TEXT NOT NULL, -- 한글 동네 명칭 (예: '망원동')
  status TEXT DEFAULT 'selling' CHECK (status IN ('selling', 'reserved', 'sold')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 4.3 `chats` (실시간 1:1 대화 테이블)
```sql
CREATE TABLE public.chat_rooms (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  item_id UUID REFERENCES public.items(id) ON DELETE CASCADE NOT NULL,
  buyer_id UUID REFERENCES public.profiles(id) NOT NULL,
  seller_id UUID REFERENCES public.profiles(id) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(item_id, buyer_id) -- 한 상품에 대해 구매자는 하나의 채팅방만 개설 가능
);

CREATE TABLE public.chat_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  room_id UUID REFERENCES public.chat_rooms(id) ON DELETE CASCADE NOT NULL,
  sender_id UUID REFERENCES public.profiles(id) NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 5. Vercel 배포 및 환경 설정 (Security Variables)

서버 단에서 사용될 Pi Network 개발자 어플리케이션 비밀 키와 Supabase 관리자 권한 키는 절대 브라우저에 누출되지 않도록 Vercel 대시보드 내 **Environment Variables**에 격리하여 설정합니다.

### 🔑 필수 환경 변수 구성 목록 (.env.production)
```env
# Supabase 연결 설정 (Client용 주소 및 API Key)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_public_key

# Supabase Admin 키 (블록체인 검증용 백엔드 DB 컨트롤에 노출 금지)
SUPABASE_SERVICE_ROLE_KEY=your_secure_service_role_key

# Pi Network SDK 개발자 API 자격 증명 (결제 승인용)
PI_API_KEY=your_pi_developer_portal_api_key
PI_NETWORK_SANDBOX=true # 서비스 초기 작동/테스트를 위해 샌드박스 망 적용 여부
```

---

## 6. 성공적인 배포를 위한 로드맵 (Vercel 배포)

1. **Supabase 프로젝트 생성 및 스키마 적용**: Supabase SQL Editor를 통해 위 테이블 구조 및 쿼리 도구를 빌드합니다.
2. **Next.js 프로젝트 초기화**: `npx create-next-app@latest mygoods` 명령을 사용하여 템플릿을 잡고 Tailwind로 스타일 시트를 추가합니다.
3. **Pi Developer Portal에 도메인 등록**: 피 브라우저 내에서 테스트하기 위해서 Pi Developer Portal (mine.pi 에 접속하여 Developer 앱 선택)에서 Vercel 환경에서 발행받은 개발용 URL(예: `https://mygoods.vercel.app`)을 앱 도메인으로 매칭합니다.
4. **IFrame 및 Geolocation 권한 추가 검토**: Pi Sandbox 내부에서 Geolocation 프롬프트를 원활히 지원하는 마이크로 브라우저 정책을 확인하고 예외 처리를 지속 테스트합니다.

위 설계 내용을 토대로 AI 코딩 에이전트와 다음 단계의 코드를 작성하면 안정적이고 당근마켓급 직관성을 보유한 Pi 생태계 대표 로컬 마켓인 **mygoods**를 구축할 수 있습니다!
