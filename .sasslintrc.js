
var OFF = 0,
  WARN = 1,
  ERROR = 2;

module.exports = {
  "options": {
    "formatter": "stylish"
  },
  "files": {
    "include": "app/**/*.scss"
  },
  "rules": {
    "extends-before-mixins": WARN,
    "extends-before-declarations": WARN,
    "placeholder-in-extend": OFF,
    "mixins-before-declarations": OFF,
    "one-declaration-per-line": WARN,
    "empty-line-between-blocks": WARN,
    "single-line-per-selector": WARN,
    "no-attribute-selectors": OFF,
    "no-color-hex": OFF,
    "no-color-keywords": WARN,
    "no-color-literals": OFF,
    "no-combinators": OFF,
    "no-css-comments": OFF,
    "no-debug": WARN,
    "no-disallowed-properties": OFF,
    "no-duplicate-properties": WARN,
    "no-empty-rulesets": WARN,
    "no-extends": OFF,
    "no-ids": WARN,
    "no-important": OFF,
    "no-invalid-hex": WARN,
    "no-mergeable-selectors": WARN,
    "no-misspelled-properties": WARN,
    "no-qualifying-elements": WARN,
    "no-trailing-whitespace": WARN,
    "no-trailing-zero": WARN,
    "no-transition-all": WARN,
    "no-universal-selectors": OFF,
    "no-url-domains": WARN,
    "no-url-protocols": WARN,
    "no-vendor-prefixes": WARN,
    "no-warn": WARN,
    "property-units": OFF,
    "declarations-before-nesting": WARN,
    "force-attribute-nesting": WARN,
    "force-element-nesting": ERROR,
    "force-pseudo-nesting": ERROR,
    "class-name-format": OFF,
    "function-name-format": WARN,
    "id-name-format": OFF,
    "mixin-name-format": WARN,
    "placeholder-name-format": WARN,
    "variable-name-format": WARN,
    "attribute-quotes": WARN,
    "bem-depth": OFF,
    "border-zero": WARN,
    "brace-style": WARN,
    "clean-import-paths": ERROR,
    "empty-args": WARN,
    "hex-length": [
      ERROR,
      {
        "style": "long"
      }
    ],
    "hex-notation": WARN,
    "indentation": [
      ERROR,
      {
        "size": 4
      }
    ],
    "leading-zero": [
      ERROR,
      {
        "include": true
      }
    ],
    "max-line-length": OFF,
    "max-file-line-count": OFF,
    "nesting-depth": [
      WARN,
      {
        "max-depth": 3
      }
    ],
    "property-sort-order": [
      ERROR,
      {
        "order": "concentric"
      }
    ],
    "pseudo-element": WARN,
    "quotes": OFF,
    "shorthand-values": WARN,
    "url-quotes": WARN,
    "variable-for-property": WARN,
    "zero-unit": WARN,
    "space-after-comma": WARN,
    "space-before-colon": WARN,
    "space-after-colon": WARN,
    "space-before-brace": WARN,
    "space-before-bang": WARN,
    "space-after-bang": WARN,
    "space-between-parens": WARN,
    "space-around-operator": WARN,
    "trailing-semicolon": WARN,
    "final-newline": WARN
  }
}