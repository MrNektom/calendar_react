/// <reference types="vite/client" />
declare namespace Intl {
  interface Locale extends LocaleOptions {
    weekInfo?: { firstDay: number };
  }
}
