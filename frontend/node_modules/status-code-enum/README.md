# status-code-enum

HTTP status codes as a TypeScript enum.

[![tslint: Slick](https://img.shields.io/badge/tslint-slick-3a6b93.svg?style=flat-square)](https://github.com/typeslick/tslint-slick)
[![code style: Prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)
[![npm](https://img.shields.io/npm/v/status-code-enum.svg?style=flat-square)](https://npmjs.org/package/status-code-enum)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg?style=flat-square)](https://github.com/semantic-release/semantic-release)
[![License](https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square)](https://github.com/typeslick/status-code-enum/blob/master/LICENSE)

## Install

```sh
$ npm install status-code-enum
```

## Usage

Node.js / CommonJS:

```typescript
const { StatusCode } = require('status-code-enum')
res.statusCode = StatusCode.ClientErrorBadRequest
```

ES6 / TypeScript:

```typescript
import { StatusCode } from 'status-code-enum'
res.statusCode = StatusCode.ClientErrorBadRequest
```

#### All current standard HTTP status codes are available as follows:

#### Client Error:

- ClientErrorBadRequest = 400
- ClientErrorConflict = 409
- ClientErrorExpectationFailed = 417
- ClientErrorFailedDependency = 424
- ClientErrorForbidden = 403
- ClientErrorGone = 410
- ClientErrorImATeapot = 418
- ClientErrorLengthRequired = 411
- ClientErrorLocked = 423
- ClientErrorLoginTimeOut = 440
- ClientErrorMethodNotAllowed = 405
- ClientErrorMisdirectedRequest = 421
- ClientErrorNotAcceptable = 406
- ClientErrorNotFound = 404
- ClientErrorPayloadTooLarge = 413
- ClientErrorPaymentRequired = 402
- ClientErrorPreconditionFailed = 412
- ClientErrorPreconditionRequired = 428
- ClientErrorProxyAuthRequired = 407
- ClientErrorRangeNotSatisfiable = 416
- ClientErrorRequestHeaderFieldsTooLarge = 431
- ClientErrorRequestTimeout = 408
- ClientErrorRetryWith = 449
- ClientErrorTooManyRequests = 429
- ClientErrorUnauthorized = 401
- ClientErrorUnavailableForLegalReasons = 451
- ClientErrorUnprocessableEntity = 422
- ClientErrorUnsupportedMediaType = 415
- ClientErrorUpgradeRequired = 426
- ClientErrorURITooLong = 414

#### Info

- InfoContinue = 100
- InfoProcessing = 102
- InfoSwitchingProtocols = 101

#### Redirect

- RedirectFound = 302
- RedirectMovedPermanently = 301
- RedirectMultipleChoices = 300
- RedirectNotModified = 304
- RedirectPermanent = 308
- RedirectSeeOther = 303
- RedirectSwitchProxy = 306
- RedirectTemp = 307
- RedirectUseProxy = 305

#### Server Error

- ServerErrorBadGateway = 502
- ServerErrorBandwidthLimitExceeded = 509
- ServerErrorGatewayTimeout = 504
- ServerErrorHTTPVersionNotSupported = 505
- ServerErrorInsufficientStorage = 507
- ServerErrorInternal = 500
- ServerErrorLoopDetected = 508
- ServerErrorNetworkAuthRequired = 511
- ServerErrorNotExtended = 510
- ServerErrorNotImplemented = 501
- ServerErrorServiceUnavailable = 503
- ServerErrorVariantAlsoNegotiates = 506

#### Success

- SuccessAccepted = 202
- SuccessAlreadyReported = 208
- SuccessCreated = 201
- SuccessIMUsed = 229
- SuccessMultiStatus = 207
- SuccessNoContent = 204
- SuccessNonAuthoritativeInfo = 203
- SuccessOK = 200
- SuccessPartialContent = 206
- SuccessResetContent = 205

## Related

- [tsconfig-slick](https://github.com/typeslick/tsconfig-slick)
- [tslint-slick](https://github.com/typeslick/tslint-slick)

## News and Updates

[Follow @typeslick on Twitter](https://twitter.com/typeslick) for the latest updates and new project announcements.

## Sponsors

- [Loomble](https://loomble.com/)

## Maintainers

- [Jay Rylan](https://jayrylan.com/)

## License

[MIT](https://github.com/typeslick/status-code-enum/blob/master/LICENSE)
