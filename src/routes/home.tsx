import { NavigationContainer } from '@react-navigation/native';

import { useAuth } from '../hooks/userAuth';

import { AppRoutes } from './app.routes';
import { SignIn } from '../screens/SignIn';
import { Box } from 'native-base';

export function Home(){
  const { user } = useAuth();

  return(
    <>
      {user.name ? <AppRoutes/> : <SignIn />}
    </>
  )
}