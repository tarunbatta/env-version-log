interface ImportMetaEnv {
  NODE_ENV?: string;
  MODE?: string;
  APP_VERSION?: string;
  APP_NAME?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
