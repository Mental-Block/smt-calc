declare namespace NodeJS {
  interface ProcessEnv {
    PORT: string
    JWT_SECRET: string
    JWT_REFRESH_SECRET: string
    CORS_ORIGIN: string
    DATABASE_URL: string
    SUPER_ADMIN_ID: string
  }
}