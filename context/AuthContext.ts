import { User } from "@/types/User";
import { createContext } from "react";
import useAuth from "@/hooks/UseAuth";

export interface InternalAuthData {
  authenticated: boolean,
  accessToken?: string
}

export type AuthData = InternalAuthData & {
  user?: User
};



export const AuthContext = createContext<{ auth: AuthData, setAuth: ((authData: AuthData) => void) }>(null as any);
