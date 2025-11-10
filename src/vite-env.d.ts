/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string
  readonly VITE_API_BASE_PATH: string
  readonly VITE_GAME_API_URL?: string
  readonly VITE_LINE_LIFF_ID?: string
  readonly VITE_CONTACT_LINE?: string
  readonly VITE_CONTACT_PHONE?: string
  // Add more env variables as needed
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
