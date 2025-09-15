// Declarações de tipos globais para React e outras dependências

declare module 'react' {
  export interface ReactNode {}
  export function createContext<T>(defaultValue: T): React.Context<T>;
  export function useContext<T>(context: React.Context<T>): T;
  export function useEffect(effect: () => void | (() => void), deps?: any[]): void;
  export function useState<T>(initialState: T): [T, (newState: T) => void];
  export namespace React {
    interface Context<T> {
      Provider: (props: { value: T; children: ReactNode }) => JSX.Element;
    }
  }
}

declare module 'react/jsx-runtime' {
  export const jsx: any;
  export const jsxs: any;
}

declare global {
  namespace JSX {
    interface Element {}
    interface IntrinsicElements {
      [elemName: string]: any;
    }
  }
}

export {};