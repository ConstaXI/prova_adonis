/*
|--------------------------------------------------------------------------
| Preloaded File
|--------------------------------------------------------------------------
|
| Any code written inside this file will be executed during the application
| boot.
|
*/

import { validator } from '@ioc:Adonis/Core/Validator'

/*
  Guarantees that an array of numbers will not have repenting elements
 */
validator.rule('noRepeating', (value: number[], _, options) => {
  if (new Set(value).size !== value.length) {
    options.errorReporter.report(
      options.pointer,
      'noRepeating',
      'noRepeating validation failed',
      options.arrayExpressionPointer
    )
  }
})
