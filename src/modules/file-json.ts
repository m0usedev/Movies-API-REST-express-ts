import { FileError } from "@/error/file-error";
import fs from "node:fs/promises";

export class FileJson {
  constructor(public readonly path: string) {}

  async read(): Promise<object[] | null> {
    const json = await fs
      .readFile(this.path, { encoding: "utf8" })
      .then((data) => {
        return JSON.parse(data);
      })
      .catch((error) => {
        throw new FileError(`Ha habido un error al leer el JSON: ${error}`);
      });
    if (!json) return null;
    return json;
  }

  async write(json: object[]): Promise<boolean> {
    return fs
      .writeFile(this.path, JSON.stringify(json, null, 2), "utf8")
      .then(() => {
        return true;
      })
      .catch((error) => {
        throw new FileError(
          `Ha habido un problema al guardar los datos: ${error}`,
        );
      });
  }
}
