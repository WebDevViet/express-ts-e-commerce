# Flow

## Error Authentication

```json
// cookies:

{
  "Authorization": "Bearer <token>",
  "refresh_token": "<token>"
}
```

### GET /me

#### TH1: `Authorization` -> `zod` -> ko có `Authorization` -> refreshToken

- 1.1/ Ko có `refresh_token` -> 401:

```json
{
  "data": null,
  "message": "Please login to continue",
  "errors": {
    "refresh_token": "Refresh token is required",
    "Authorization": "Access token is required"
  },
  "typeError": "UnauthorizedError"
}
```

- 1.2/ Ko có `refresh_token` -> 401:

  - sau 1 khoảng tg user ko truy cập thì access và refresh token exp hết hạn, sẽ bị cookie tự động xoá đi, nên phải có cách phân biệt trường hợp này với req không hợp lệ, để trả về typeError và message phù hợp.

```json
{
  "data": null,
  "message": "Your login session has expired. Please sign in again to continue.",
  "errors": {
    "refresh_token": "Refresh token is required",
    "Authorization": "Access token is required"
  },
  "typeError": "RefreshTokenExpiredError"
}
```

- 1.3/ Có `refresh_token` -> 401:

```json
{
  "data": null,
  "message": "Access token is required",
  "errors": {
    "Authorization": "Access token is required"
  },
  "typeError": "AccessTokenExpiredError"
}
```

#### TH2: `Authorization` -> `zod` -> có `Authorization` -> verifyToken

- 2.1/ `access token` hết hạn -> 401:

```json
{
  "data": null,
  "message": "Access token expired",
  "errors": null,
  "typeError": "AccessTokenExpiredError"
}
```

- 2.2/ `access token` other error -> 401:

```json
{
  "data": null,
  "message": "Access token invalid signature",
  "errors": null,
  "typeError": "JsonWebTokenError"
}
```

```json
{
  "data": null,
  "message": "Access token not active",
  "errors": null,
  "typeError": "NotBeforeError"
}
```

```json
{
  "data": null,
  "message": "...",
  "errors": null,
  "typeError": "UnexpectedTokenError"
}
```

### POST /refresh-token

#### TH1: `refresh_token` -> `zod` -> ko có `refresh_token`

```json
{
  "data": null,
  "message": "Refresh token is required",
  "errors": {
    "refresh_token": "Refresh token is required"
  },
  "typeError": "UnauthorizedError"
}
```

#### TH2: `refresh_token` -> `zod` -> có `refresh_token`

- 2.1/ verifyToken -> `refresh_token` hết hạn -> 401:

```json
{
  "data": null,
  "message": "Refresh token expired",
  "errors": null,
  "typeError": "RefreshTokenExpiredError"
}
```

- 2.2/ verifyToken -> `refresh_token` còn hạn -> db -> ko có trong db -> 401:

```json
{
  "data": null,
  "message": "Refresh token expired",
  "errors": null,
  "typeError": "RefreshTokenExpiredError"
}
```

- 2.3/ verifyToken -> `refresh_token` other error -> 401: like `access token`
