# Flow

## Error Authentication

```json
// cookies:

{
  "Authorization": "Bearer <token>",
  "refresh-token": "<token>"
}
```

### GET /me

#### TH1: `Authorization` -> `zod` -> ko có `Authorization` -> refreshToken

- 1/ Ko có `refresh-token` -> 401:

```json
{
  "data": null,
  "message": "Access token is required",
  "errors": {
    "refresh-token": "Refresh token is required",
    "Authorization": "Access token is required"
  },
  "typeError": "UnauthorizedError"
}
```

- 2/ Có `refresh-token` -> 401:

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

- 1/ `access token` hết hạn -> 401:

```json
{
  "data": null,
  "message": "Access token expired",
  "errors": null,
  "typeError": "AccessTokenExpiredError"
}
```

2/ `access token` other error -> 401:

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

#### TH1: `refresh-token` -> `zod` -> ko có `refresh-token`

```json
{
  "data": null,
  "message": "Refresh token is required",
  "errors": {
    "refresh-token": "Refresh token is required"
  },
  "typeError": "UnauthorizedError"
}
```

#### TH2: `refresh-token` -> `zod` -> có `refresh-token`

- 1/ verifyToken -> `refresh-token` hết hạn -> 401:

```json
{
  "data": null,
  "message": "Refresh token expired",
  "errors": null,
  "typeError": "RefreshTokenExpiredError"
}
```

- 2/ verifyToken -> `refresh-token` còn hạn -> db -> ko có trong db -> 401:

```json
{
  "data": null,
  "message": "Refresh token expired",
  "errors": null,
  "typeError": "RefreshTokenExpiredError"
}
```

- 3/ verifyToken -> `refresh-token` other error -> 401: like `access token`
