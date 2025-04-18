export enum TypeError {
  // custom
  UnexpectedError = 'UnexpectedError',
  ValidationError = 'ValidationError',
  BodyError = 'BodyError',
  AccessTokenExpiredError = 'AccessTokenExpiredError',
  RefreshTokenExpiredError = 'RefreshTokenExpiredError',
  AuthenTokenExpiredError = 'AuthenTokenExpiredError',
  EmailVerificationTokenExpiredError = 'EmailVerificationTokenExpiredError',
  ForgotPasswordTokenExpiredError = 'ForgotPasswordTokenExpiredError',
  UnexpectedTokenError = 'UnexpectedTokenError',
  JsonWebTokenError = 'JsonWebTokenError',
  NotBeforeError = 'NotBeforeError',

  // http
  BadRequestError = 'BadRequestError',
  UnauthorizedError = 'UnauthorizedError',
  PaymentRequiredError = 'PaymentRequiredError',
  ForbiddenError = 'ForbiddenError',
  NotFoundError = 'NotFoundError',
  MethodNotAllowedError = 'MethodNotAllowedError',
  NotAcceptableError = 'NotAcceptableError',
  ProxyAuthenticationRequiredError = 'ProxyAuthenticationRequiredError',
  RequestTimeoutError = 'RequestTimeoutError',
  ConflictError = 'ConflictError',
  GoneError = 'GoneError',
  LengthRequiredError = 'LengthRequiredError',
  PreconditionFailedError = 'PreconditionFailedError',
  PayloadTooLargeError = 'PayloadTooLargeError',
  URITooLongError = 'URITooLongError',
  UnsupportedMediaTypeError = 'UnsupportedMediaTypeError',
  RangeNotSatisfiableError = 'RangeNotSatisfiableError',
  ExpectationFailedError = 'ExpectationFailedError',
  ImATeapotError = 'ImATeapotError',
  MisdirectedRequestError = 'MisdirectedRequestError',
  UnprocessableEntityError = 'UnprocessableEntityError',
  LockedError = 'LockedError',
  FailedDependencyError = 'FailedDependencyError',
  TooEarlyError = 'TooEarlyError',
  UpgradeRequiredError = 'UpgradeRequiredError',
  PreconditionRequiredError = 'PreconditionRequiredError',
  TooManyRequestsError = 'TooManyRequestsError',
  RequestHeaderFieldsTooLargeError = 'RequestHeaderFieldsTooLargeError',
  UnavailableForLegalReasonsError = 'UnavailableForLegalReasonsError',
  InternalServerErrorError = 'InternalServerErrorError',
  NotImplementedError = 'NotImplementedError',
  BadGatewayError = 'BadGatewayError',
  ServiceUnavailableError = 'ServiceUnavailableError',
  GatewayTimeoutError = 'GatewayTimeoutError',
  HTTPVersionNotSupportedError = 'HTTPVersionNotSupportedError',
  VariantAlsoNegotiatesError = 'VariantAlsoNegotiatesError',
  InsufficientStorageError = 'InsufficientStorageError',
  LoopDetectedError = 'LoopDetectedError',
  BandwidthLimitExceededError = 'BandwidthLimitExceededError',
  NotExtendedError = 'NotExtendedError',
  NetworkAuthenticationRequiredError = 'NetworkAuthenticationRequiredError'
}
