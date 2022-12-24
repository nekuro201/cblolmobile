import { NavigationContainer } from '@react-navigation/native';

import { useAuth } from '../hooks/userAuth';

import { Box } from 'native-base';
import { Home } from './home';
import { SignIn } from '../screens/SignIn';
import { Loading } from '../components/Loading';

export function Routes(){

  // state que indica se terminou de buscar o token de login salvo no mobile
  const { hasTokenResponse } = useAuth();

  // colocar o loading aqui
  
  return(
    <Box flex={1} bg="gray.900">
      <NavigationContainer>
        { hasTokenResponse ? <Home/> : <Loading/>}
      </NavigationContainer>
    </Box>
  )
}