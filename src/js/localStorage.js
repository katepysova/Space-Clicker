import Logger from "./logger.js";

export default class LocalStorage {
  static setItem(key, item) {
    try {
      const stringifiedItem = JSON.stringify(item);
      localStorage.setItem(key, stringifiedItem);
      Logger.log(`Added {${key}:"${item}"} to localStorage.`);
    } catch (error) {
      Logger.error(error);
    }
  }

  static getItem(key) {
    try {
      const retrievedItem = localStorage.getItem(key);
      const item = JSON.parse(retrievedItem);
      return item;
    } catch (error) {
      Logger.error(error);
      return null;
    }
  }

  static removeItem(key) {
    try {
      localStorage.removeItem(key);
      Logger.log(`Removed item with key = ${key} from localStorage.`);
    } catch (error) {
      Logger.error(error);
    }
  }

  static clear() {
    localStorage.clear();
    Logger.log("Local storage was cleared.");
  }
}
