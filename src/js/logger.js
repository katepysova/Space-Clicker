const isDev = process.env.NODE_ENV === "development";

export default class Logger {
  static log(message) {
    if (isDev) {
      // eslint-disable-next-line no-console
      console.log(message);
    }
  }

  static error(message) {
    if (isDev) {
      // eslint-disable-next-line no-console
      console.error(message);
    }
  }

  static warn(message) {
    if (isDev) {
      // eslint-disable-next-line no-console
      console.warn(message);
    }
  }
}
