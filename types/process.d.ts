declare var process: {
  env: {
    PLASMO_PUBLIC_GITHUB_TOKEN?: string
    [key: string]: string | undefined
  }
}

declare namespace NodeJS {
  interface ProcessEnv {
    PLASMO_PUBLIC_GITHUB_TOKEN?: string
  }
}
