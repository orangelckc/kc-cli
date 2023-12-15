interface CreateOptions {
  name: string
  version: string
  description: string
}

interface Branch {
  name: string
  commit: {
    sha: string
    url: string
  }
  protected: boolean
}

declare module 'download-git-repo' {
  interface Options {
    clone: boolean
    headers: Record<string, string>
  }
  function download(repo: string, dest: string, opts: Options): string
  function download(repo: string, dest: string, opts: Options, cb: (err?: Error) => void): string

  export = download
}
