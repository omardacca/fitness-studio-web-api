
export interface ICache {
    set(key: string, value: string, expireSeconds?: number): Promise<void>;
    get(key: string): Promise<string | null>;
    del(key: string): Promise<void>;
}
  