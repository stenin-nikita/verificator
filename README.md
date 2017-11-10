# Verificator

[![Build Status](https://travis-ci.org/stenin-nikita/verificator.svg?branch=master)](https://travis-ci.org/stenin-nikita/verificator)
[![codecov](https://codecov.io/gh/stenin-nikita/verificator/branch/master/graph/badge.svg)](https://codecov.io/gh/stenin-nikita/verificator)
[![npm version](https://img.shields.io/npm/v/verificator.svg?style=flat)](https://www.npmjs.com/package/verificator)
[![npm downloads](https://img.shields.io/npm/dm/verificator.svg?style=flat)](https://www.npmjs.com/package/verificator)
[![npm](https://img.shields.io/npm/l/verificator.svg)](https://github.com/stenin-nikita/verificator/blob/master/LICENSE)

Client and server-side validation JavaScript library

## Installation

To install Verificator with Yarn, run:

```bash
yarn add verificator
```

To install Verificator with npm, run:

```bash
npm install --save verificator
```


## Getting Started

### Using a CDN

```html
<script crossorigin src="https://unpkg.com/verificator@latest/dist/verificator.min.js"></script>
<script crossorigin src="https://unpkg.com/verificator@latest/dist/locale/en.js"></script>
<script>
var locale = VerificatorLocale.en
var validator = new Verificator.Validator(data, rules, locale)
</script>
```

### Using a CommonJS

```js
const Verificator = require('verificator')
const locale = require('verificator/lib/locale/en')

const validator = new Verificator.Validator(data, rules, locale)
```

### Using a ES or TypeScript

```typescript
import { Validator } from 'verificator/es'
import * as locale from 'verificator/es/locale/en'

const validator = new Validator(data, rules, locale)
```

## Example

```typescript
import { Validator } from 'verificator/es'
import * as locale from 'verificator/es/locale/en'

const data = {
    firstName: 'Nikita',
    lastName: 'Stenin',
    email: 'stenin.nikita@gmail.com',
}

const rules = {
    firstName: 'required|string',
    lastName: 'required|string',
    email: 'required|string|email'
}

const validator = new Validator(data, rules, locale)

validator.passes().then(isValid => {
    if (isValid) {
        console.log('succes')
    } else {
        console.log(validator.errors.all())
    }
})
```

## License

The MIT License (MIT). Please see [License File](https://github.com/stenin-nikita/verificator/blob/master/LICENSE) for more information.