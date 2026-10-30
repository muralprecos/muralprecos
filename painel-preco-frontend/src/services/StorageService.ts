import { isClientNextjs } from "@/utils/validateUtils";

/**
 * Interface que define os dados que podemos salvar no localStorage
 * e seus respectivos tipos. Ao adicionar novas chaves no localStorage,
 * elas devem ser declaradas aqui.
 */
export interface StorageMap {
  carts: any; // Type defined in cart-slice, avoiding circular dependency here if possible, or using any for generic wrapper
  cotacaoLabelCache: any;
  tableColumnsPreference: any;
  userSessionCache: { name: string; org: string };
}

type StorageKey = keyof StorageMap;

class StorageService {
  private inMemoryCache: Map<StorageKey, any> = new Map();

  /**
   * Obtém um item do localStorage.
   * Se já estiver em memória, retorna do cache.
   * Em caso de erro (ex: parsing), retorna o fallback fornecido.
   */
  public getItem<K extends StorageKey, T = StorageMap[K]>(
    key: K,
    fallback: T
  ): T {
    if (!isClientNextjs()) return fallback;

    if (this.inMemoryCache.has(key)) {
      return this.inMemoryCache.get(key) as T;
    }

    try {
      const item = localStorage.getItem(key);
      if (item) {
        // Se decidirmos ofuscar no futuro, o base64 decode / decrypt entra aqui
        const parsed = JSON.parse(item) as T;
        this.inMemoryCache.set(key, parsed);
        return parsed;
      }
      return fallback;
    } catch (err) {
      console.warn(`[StorageService] Erro ao carregar ${key} do localStorage`, err);
      return fallback;
    }
  }

  /**
   * Salva um item no localStorage e atualiza o cache em memória.
   */
  public setItem<K extends StorageKey, T = StorageMap[K]>(key: K, value: T): void {
    if (!isClientNextjs()) return;

    this.inMemoryCache.set(key, value);

    try {
      // Se decidirmos ofuscar no futuro, o base64 encode / encrypt entra aqui
      const serialized = JSON.stringify(value);
      localStorage.setItem(key, serialized);
    } catch (err) {
      console.error(`[StorageService] Erro ao salvar ${key} no localStorage. (Possível Quota Exceeded)`, err);
    }
  }

  /**
   * Remove um item do localStorage e do cache em memória.
   */
  public removeItem(key: StorageKey): void {
    if (!isClientNextjs()) return;

    this.inMemoryCache.delete(key);
    try {
      localStorage.removeItem(key);
    } catch (err) {
      console.error(`[StorageService] Erro ao remover ${key} do localStorage`, err);
    }
  }

  /**
   * Limpa todo o localStorage gerido pela aplicação.
   */
  public clearAll(): void {
    if (!isClientNextjs()) return;
    this.inMemoryCache.clear();
    try {
      localStorage.clear();
    } catch (err) {
      console.error(`[StorageService] Erro ao limpar o localStorage`, err);
    }
  }
}

export const storageService = new StorageService();
