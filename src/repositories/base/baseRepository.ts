/* eslint-disable @typescript-eslint/no-unused-vars */
import type { IRead } from "../interfaces/IRead";
import type { IWrite } from "../interfaces/IWrite";
import type { dbType } from "../../db";

abstract class BaseRepository<T> implements IWrite<T>, IRead<T> {
  public readonly db: dbType;

  constructor(db: dbType) {
    this.db = db;
  }

  create(item: T): Promise<boolean> {
    throw new Error("Method not implemented.");
  }
  update(id: string, item: T): Promise<boolean> {
    throw new Error("Method not implemented.");
  }
  delete(id: string): Promise<boolean> {
    throw new Error("Method not implemented.");
  }
  find(): Promise<T[]> {
    throw new Error("Method not implemented.");
  }
  findOne(id: string): Promise<T> {
    throw new Error("Method not implemented.");
  }
}

export default BaseRepository;
