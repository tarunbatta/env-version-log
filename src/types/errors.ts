export class PackageJsonNotFoundError extends Error {
  constructor(
    message = "Could not find package.json in the project directory"
  ) {
    super(message);
    this.name = "PackageJsonNotFoundError";
  }
}

export class PackageJsonReadError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "PackageJsonReadError";
  }
}

export class PackageJsonWriteError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "PackageJsonWriteError";
  }
}
