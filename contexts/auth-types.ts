// auth-types.ts
export interface AuthTokenMessage {
  type: 'AUTH_TOKEN';
  token: string;
}

export interface SessionExpiredMessage {
  type: 'SESSION_EXPIRED';
}

export interface RequestAuthTokenMessage {
  type: 'REQUEST_AUTH_TOKEN';
}

export type PostMessageData = 
  | AuthTokenMessage 
  | SessionExpiredMessage 
  | RequestAuthTokenMessage;

export interface AuthContextType {
  token: string | null;
  isAuthenticated: boolean;
  logout: () => void;
}

export interface AuthProviderProps {
  children: React.ReactNode;
}

export interface ProtectedRouteProps {
  children: React.ReactNode;
}