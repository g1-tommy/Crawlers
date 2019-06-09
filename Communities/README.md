커뮤니티 사이트 게시물 크롤러
====================

## 이 크롤러에 대하여

국내에서 접속량이 많은 주요 커뮤니티 사이트 약 12개에 대한 최신 게시물, 혹은 키워드 기반의 게시물 목록을 가져와 이를 `CSV` 파일 기반의 결과물로 변환하여 제공합니다.

### Usage

- 전체 검색 (**최신 게시물**)

  ```bash
  npm all
  ```

  (**npm** 사용시)

  ```bash
  yarn all
  ```

  (**yarn** 사용시)

- 쿼리 검색

  ```bash
  npm query [키워드]
  ```

  ```bash
  yarn query [키워드]
  ```

- 반복주기 설정 검색 (**전체 검색**)

  ```bash
  npm interv-all [minutes]
  ```

  ```bash
  yarn interv-all [minutes]
  ```

- 대상 커뮤니티 지정 검색

  ```bash
  npm sites [sites ex. CT01 CT02 CT05 ...]
  ```

  ```bash
  yarn sites [sites ex. CT01 CT02 CT05 ...]
  ```

  

> 자세한 도움말은
>
> ```bash
> yarn help
> ```
>
> 을 참고하세요.