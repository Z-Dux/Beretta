//import gradient from 'npm:gradient-string';
//import figlet from "figlet"
import chalk from "npm:chalk@2.0.0";
import moment from "npm:moment";

export class Logger {
  private static getTimestamp(): string {
    return moment().format("HH:mm:ss"); // Only hour:minute:second
  }
  // deno-lint-ignore no-explicit-any
  public static info(...message: string[] | object[] | any): void {
    this.log("INFO", message.join(" "), chalk.cyan);
  }
  // deno-lint-ignore no-explicit-any
  public static warn(message: string | object | any[]): void {
    this.log("WARN", message, chalk.magenta);
  }
  // deno-lint-ignore no-explicit-any
  public static error(...message: string[] | object[] | any[]): void {
    this.log("ERROR", message.join(" "), chalk.red);
  }
  // deno-lint-ignore no-explicit-any
  public static success(message: string | object | any[]): void {
    this.log("OK", message, chalk.green);
  }
  // deno-lint-ignore no-explicit-any
  public static debug(message: string | object | any[]): void {
    this.log("DEBUG", message, chalk.yellow);
  }
  private static log(
    level: string,
    // deno-lint-ignore no-explicit-any
    message: string | object | any[],
    colorFn: (text: string) => string,
  ): void {
    const timestamp = this.getTimestamp();
    let formattedMessage;

    if (typeof message === "object") {
      formattedMessage = JSON.stringify(message, null, 2);
    } else {
      formattedMessage = message;
    }
    console.log(colorFn(
      `[${level}]`.padEnd(6, ` `) + ` [${timestamp}] ${formattedMessage}`,
    ));
  }
}

export function getTimeGap(date: Date): string {
  const now = new Date();
  let diffInSeconds = Math.floor((date.getTime() - now.getTime()) / 1000);
  const diffInMs = Math.floor(now.getTime() - date.getTime());

  if (diffInSeconds < 0) {
    diffInSeconds = Math.abs(diffInSeconds);
  }

  const hours = Math.floor(diffInSeconds / 3600);
  diffInSeconds %= 3600;

  const minutes = Math.floor(diffInSeconds / 60);
  const seconds = diffInSeconds % 60;

  const result: string[] = [];

  if (hours > 0) result.push(`${hours}h`); //result.push(chalk.hex(`#3c0070`)(`${chalk.hex(`#5b00ab`)(hours)}h`));
  if (minutes > 0) result.push(`${minutes}min`); //result.push(chalk.hex(`#3c0070`)(`${chalk.hex(`#5e00ab`)(minutes)}m`));
  if (diffInMs < 1000 && seconds <= 5) result.push(`${diffInMs}ms`);
  else if (seconds > 0) result.push(`${seconds}s`); //result.push(chalk.hex(`#3c0070`)(`${chalk.hex(`#5e00ab`)(seconds)}s`));

  return result.join(" ");
}

export function chunkize<T>(array: T[], size: number): T[][] {
  const result: T[][] = [];

  for (let i = 0; i < array.length; i += size) {
    result.push(array.slice(i, i + size));
  }

  return result;
}

export function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.substring(1);
}

export function randomBin<T>(array: T[]) {
  return array[Math.round(Math.random())];
}

export function randomItem<T>(array: T[]): T | undefined {
  const randomIndex = Math.floor(Math.random() * array.length);
  return array[randomIndex];
}
