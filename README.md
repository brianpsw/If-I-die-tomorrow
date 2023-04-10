## 🚗 Service API Validator - 삼성전자 VD사업부 연계 PJT

## :video_game: 프로젝트 진행 기간

2023.02.20(월) ~ 2023.04.07(금)  
SSAFY 8기 2학기 삼성전자 VD사업부 연계 프로젝트 - Service API Validator

## 🚩 Service API Validator - 배경

_현업 Pain Point -연결해야하는 서비스는 많은데 API의 변경 감지가 힘들다_

- HTTP Status Code 200 아닐 때
- Field 추가 / 삭제
- Field Type 변경

안정적인 서비스를 위해 위와 같은 변경 사항을 빠르게 감지할 수 있어야한다.

## 🚩 Service API Validator - 개요

'SAPIV'는 'Service API Validator'의 이니셜을 따서 프로젝트 명으로 선정하였습니다.
제품 개발 과정 및 실제 서비스 과정에서 다양한 서비스들과 연결을 합니다.
SAPIV은 여러 서비스 서버와 상호작용하는데 사용하는 API의 목록을 관리합니다.
주기적으로 API 응답을 확인하며, 변경점이 발생하였을 때 사용자에게 알림을 주는 방식으로 모니터링을 수행합니다.

## 🚩 주요 기능

1. JSON Data의 자료형 추출

   - DFS를 통해 자료형을 재귀적으로 추출

2. 전체/즐겨찾는 API에 대한 Response의 Pass/Fail Trend 시각화

   - 일/주/월 단위의 모니터링 결과를 Chart.js를 활용하여 시각화

3. 개별 API에 대한 상세정보 보기

   - 모니터링 하고 있는 API Request 정보와 Raw JSON Data Response 및 Response의 Schema 확인 가능

4. 서로 다른 두 시점의 API 응답 내용 비교 (diff)

   - 두 Raw JSON Response 비교 시 달라진 부분을 스크롤 바 옆에 색깔로 표시

---

## 🚩 주요 기술

---

1. Language

   - JavaScript
   - TypeScript

2. Framework

   - React
   - Next.JS
   - Nest.JS
   - Express

3. DB

   - Firebase
   - MySQL

4. OS

   - Windows
   - Linux

5. Server

   - AWS EC2
   - Nginx

6. CI/CD

   - Jenkins
   - Docker
   - GitHub Action

7. Test

   - Sonarqube

8. etc

   - Postman

<!-- ![image](docs/img/mainTech.png) -->

## 🙆 협업 툴

---

- GitLab
- Notion
- JIRA
- MatterMost
- Discord

## 🙆 협업 환경

---

- Gitlab
  - 코드 버전 관리
  - Jira와 연동하여 일정 관리
  - 커밋 컨벤션 준수
- JIRA
  - 매주 일정에 따른 업무를 할당하여 Sprint 진행
  - JIRA 컨벤션 준수
- 회의
  - 아침마다 스크럼 회의 진행
  - 주별로 전 파트 코드리뷰 진행
  - 그라운드 룰 준수
- Notion
  - 각종 문서 아카이빙과 회의록 보관
  - 기능명세서, 이해관계자, 유즈케이스 시나리오 등 문서 보관
  - 코딩 컨벤션 정리
  - 프로젝트 일정 정리
  - 그라운드 룰 명시

## 🙆  팀원 역할 분배

---

### Web

- 정의권
- 박상우

### API Validator

- 양희진
- 김성환

### Infra (CI/CD)

- 송주영
- 오주영

## 🚩 프로젝트 산출물

---

- [기능명세서](https://www.notion.so/c720cf3b3e4d4aa9ac6d08a0dac4dbe4)
- [ERD](https://www.erdcloud.com/d/eRkqNKaiMHcAnt6Ag)
- [Wireframe](https://www.figma.com/file/eLncLTLdhtUfGhbtIYm5Yc/SSAFY_S002_Service-API-Validator_Wire-Frame?node-id=24-35317)

## 🚩: 프로젝트 결과물

---

- [SAPIV](https://sapiv.site/)
