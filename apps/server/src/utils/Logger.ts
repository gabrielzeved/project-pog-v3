import { blue, yellow, red, green } from 'picocolors';

enum LogLevel {
  INFO,
  WARNING,
  ERROR,
  SUCCESS
}

/* Exemplo de uso
    Logger.info('Esta é uma mensagem informativa.');
    Logger.warning('Cuidado! Isso é um aviso.');
    Logger.error('Algo deu errado.');
    Logger.success('Operação bem-sucedida.');
*/

export class Logger {
  private static log(message: string, level: LogLevel): void {
    let logMessage: string;

    switch (level) {
      case LogLevel.INFO:
        logMessage = blue(`[INFO] ${message}`);
        break;
      case LogLevel.WARNING:
        logMessage = yellow(`[WARNING] ${message}`);
        break;
      case LogLevel.ERROR:
        logMessage = red(`[ERROR] ${message}`);
        break;
      case LogLevel.SUCCESS:
        logMessage = green(`[SUCCESS] ${message}`);
        break;
      default:
        logMessage = `[UNKNOWN] ${message}`;
        break;
    }

    console.log(logMessage);
  }

  public static info(message: string): void {
    Logger.log(message, LogLevel.INFO);
  }

  public static warning(message: string): void {
    Logger.log(message, LogLevel.WARNING);
  }

  public static error(message: string): void {
    Logger.log(message, LogLevel.ERROR);
  }

  public static success(message: string): void {
    Logger.log(message, LogLevel.SUCCESS);
  }
}
