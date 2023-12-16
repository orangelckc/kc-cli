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
