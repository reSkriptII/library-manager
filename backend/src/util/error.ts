export class FileError extends Error {
  public readonly code: string;
  public readonly path: string;
  public readonly accessFrom: string | undefined;
  constructor(code: string, filePath: string, accessFrom?: string) {
    super("FileSystem error");
    this.code = code;
    this.path = filePath;
    this.accessFrom = accessFrom;
  }
}
