import { createContext, ReactNode, useState, useEffect } from "react";

import * as Google from 'expo-auth-session/providers/google';
import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';

import { api } from '../services/api';

import AsyncStorage from '@react-native-async-storage/async-storage';

WebBrowser.maybeCompleteAuthSession();

interface UserProps {
  name: string;
  avatarUrl: string;
}

export interface AuthContextDataProps {
  user: UserProps;
  isUserLoading: boolean;
  signIn: () => Promise<void>;
  logout: () => Promise<void>;
  hasTokenResponse: boolean;
}

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthContext = createContext({} as AuthContextDataProps);

export function AuthContextProvider({ children }: AuthProviderProps){

  const [user, setUser] = useState<UserProps>({} as UserProps)
  const [isUserLoading, setIsUserLoading] = useState(false);

  // sera usado para saber se terminou de pegar o token
  const [hasTokenResponse, setHasTokenResponse] = useState(false); 

  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId: process.env.CLIENT_ID,
    redirectUri: AuthSession.makeRedirectUri({ useProxy: true }),
    scopes: ['profile', 'email']
  });

  // busca no celular o token de login
  const getData = async () => {
    try {

      const value = await AsyncStorage.getItem('@tokenResponse')
      if(value !== null) {
        
        // value previously stored // inserindo no cabeçalho
        api.defaults.headers.common['Authorization'] = `Bearer ${value}`;

        const userInfoResponse = await api.get('/me');
        setUser(userInfoResponse.data.user);
      }
    } catch(error) {

      // error reading value
      console.log(error);
      
      throw error;
    } finally {
      setHasTokenResponse(true);
    }
  }

  async function signIn(){
    try {
      setIsUserLoading(true);
      await promptAsync();

    } catch (error) {
      console.log(error);
      throw error;

    } finally {
      setIsUserLoading(false);
    }
  }

  async function signInWithGoogle(access_token: string){
    // console.log("TOKEN DE AUTENTICAÇÃO ===> ", access_token);

    try{
      setIsUserLoading(true);

      const tokenResponse = await api.post('/users', { access_token });

      // inserindo no cabeçalho
      api.defaults.headers.common['Authorization'] = `Bearer ${tokenResponse.data.token}`; 

      const userInfoResponse = await api.get('/me');
      setUser(userInfoResponse.data.user);

      await AsyncStorage.setItem('@tokenResponse', tokenResponse.data.token)

    }catch(error){
      console.log(error);
      throw error;
    }finally{
      setIsUserLoading(false);
    }
  }

  async function logout(){
    try { 
      api.defaults.headers.common['Authorization'] = ""; 
      AsyncStorage.removeItem('@tokenResponse')
      setUser({} as UserProps);

    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  useEffect(() => {
    if(response?.type === 'success' && response.authentication?.accessToken){
      signInWithGoogle(response.authentication.accessToken);
    }
  }, [response]);

  // sera executado somente uma vez
  useEffect(() => {
    getData();
    //console.log("OPA");
  }, []);

  return (
    <AuthContext.Provider value={{
      signIn,
      logout,
      isUserLoading,
      user,
      hasTokenResponse,
    }}>
      {children}
    </AuthContext.Provider>
  )
}