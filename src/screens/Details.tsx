import { useState, useEffect } from 'react';
import { Share } from 'react-native';
import { HStack, Toast, useToast, VStack } from "native-base";
import { useRoute } from '@react-navigation/native';

import { Header } from "../components/Header";
import { Loading } from '../components/Loading';
import { PoolCardPros } from '../components/PoolCard';
import { PoolHeader } from '../components/PoolHeader';
import { EmptyMyPoolList } from '../components/EmptyMyPoolList';
import { Option } from '../components/Option';
import { Guesses } from '../components/Guesses';

import { api } from '../services/api';
import { ComingSoon } from '../components/ComingSoon';

interface RouteParams {
  id: string;
}

export function Details(){

  const [optionSelected, setOptionSelected] = useState<'guesses'| 'ranking'>('guesses');
  const [isLoading, setIsLoading] = useState(true);
  const [poolDetails, setPoolDetails] = useState<PoolCardPros>({} as PoolCardPros); // {} comeca como um obj vazio
  
  const route = useRoute();
  const toast = useToast();

  const { id } = route.params as RouteParams;

  async function fetchPoolDetails(){
    try {
      setIsLoading(true);

      const response = await api.get(`/polls/${id}`);
      setPoolDetails(response.data.poll);

    } catch (error) {
      
      console.log(error);
      toast.show({
        title: "Não foi possível carregar os detalhes do bolão!",
        placement: "top",
        bgColor: "red.500"
      });

    } finally {
      setIsLoading(false);
    }
  }

  async function handleCodeShare(){
    await Share.share({
      message: poolDetails.code
    });
  }

  // toda vez q esse ID muda, ele chama essa funcao
  useEffect(() => {
    fetchPoolDetails();
  }, [id]);

  // enquanto isLoading for true, ou seja, espera fetchPoolDetails() terminar
  if(isLoading){
    return <Loading />
  }

  return(
    <VStack flex={1} bgColor="gray.900">
      <Header 
        title={poolDetails.title} 
        showBackButton 
        showShareButton
        onShare={handleCodeShare}
      />

      {
        poolDetails._count?.participants > 0 ?
        <VStack px={5} flex={1}>
          <PoolHeader data={poolDetails} />

          <HStack bgColor="gray.800" p={1} rounded="sm" mb={5}>
            <Option 
              title="Seus palpites" 
              isSelected={optionSelected === 'guesses'} 
              onPress={() => setOptionSelected('guesses')}
            />

            <Option 
              title="Ranking do grupo" 
              isSelected={optionSelected === 'ranking'}
              onPress={() => setOptionSelected('ranking')}
            />
          </HStack>

          {
            optionSelected === 'guesses' ? 
            <Guesses poolId={poolDetails.id} code={poolDetails.code} /> 
            : <ComingSoon /> 
          }

        </VStack>
        
        : <EmptyMyPoolList code={poolDetails.code} />
      }

    </VStack>
  );
}