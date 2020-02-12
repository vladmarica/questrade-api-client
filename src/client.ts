class QuestradeClient {
  private refreshToken: string;
  private accessToken?: string;

  constructor(refreshToken: string, accessToken?: string) {
    this.refreshToken = refreshToken;
    this.accessToken = accessToken;
  }

  private async oauthRefreshAccessToken() {
    // TODO
  }

  async getAccounts(): Promise<any> {
    if (!this.accessToken) {
      await this.oauthRefreshAccessToken();
    }

    // TODO
  }

  getRefreshToken() {
    return this.refreshToken;
  }

  getAccessToken(): string | undefined {
    return this.accessToken;
  }
}

export default QuestradeClient;
