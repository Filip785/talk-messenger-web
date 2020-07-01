import { ErrorObject } from "../features/error/errorSlice";
import Bowser from 'bowser';

const browser = Bowser.getParser(window.navigator.userAgent);
const os = browser.getOS();

export default function createErrorObject(errorMessage: string, errorCode: number, errorDescription: string, errorUrl: string): ErrorObject {
  return {
    errorMessage,
    errorCode,
    errorDescription,
    errorUrl,
    browser: `${browser.getBrowserName()} ${browser.getBrowserVersion()} running on ${os.name} ${os.versionName}`
  };
}