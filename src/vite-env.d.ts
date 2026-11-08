/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_YVP_APP_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
