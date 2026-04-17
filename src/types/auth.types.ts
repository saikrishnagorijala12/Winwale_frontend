
export interface UserClaims {
  email: string;
  sub: string;
  email_verified: boolean;
  'cognito:groups'?: string[];
  identities?: Array<{
    providerName: string;
  }>;
}

export type AuthStatus = 'loading' | 'authenticated' | 'unauthenticated';
