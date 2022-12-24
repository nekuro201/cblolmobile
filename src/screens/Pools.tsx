import { VStack, Icon, useToast, FlatList } from "native-base";
import { Octicons } from "@expo/vector-icons";
import { useNavigation, useFocusEffect } from '@react-navigation/native';

import { Button } from "../components/Button";
import { Header } from "../components/Header";
import { api } from "../services/api";
import { Loading } from "../components/Loading";
import { PoolCard, PoolCardPros } from "../components/PoolCard"; // exportando tbm a tipagem do poolCard

import { useState, useCallback } from 'react'; 
import { EmptyPoolList } from "../components/EmptyPoolList";

export function Pools(){
  const [ isLoading, setIsLoading ] = useState(true);
  const [ pools, setPools ] = useState<PoolCardPros[]>([]);

  const { navigate } = useNavigation();
  const toast = useToast();

  async function fetchPools(){
    try {

      setIsLoading(true);
      const response = await api.get('/polls');
      setPools(response.data.polls);

    } catch (error) {

      console.log(error);
      toast.show({
        title: "Não foi possível carregar os bolões",
        placement: "top",
        bgColor: "red.500"
      });
    }finally{
      setIsLoading(false);
    }
  }

  // executa sempre q essa pag tiver foco
  useFocusEffect(useCallback(() => {
    fetchPools();
  }, []));

  return(
    <VStack flex={1} bgColor="gray.900">
      <Header title="Meus bolões" />

      <VStack mt={6} mx={5} borderBottomWidth={1} borderBottomColor="purple.600" pb={4} mb={4}>
        <Button 
          title="BUSCAR BOLÃO POR CÓDIGO" 
          leftIcon={<Icon as={Octicons} name="search" color="black" size="md" />}
          onPress={() => navigate('find')}
        />
      </VStack>

      {
        isLoading ? <Loading /> :
          <FlatList
            data={pools}
            keyExtractor={item => item.id}
            // use () para quebrar em mais linhas 
            renderItem={({ item }) => (
              <PoolCard 
                data={item} 
                onPress={() => navigate('details', { id: item.id })}
              />
            )}
            px={5}
            showsVerticalScrollIndicator={false}
            _contentContainerStyle={{ pb: "24" }}
            ListEmptyComponent={() => <EmptyPoolList />}
          />
      }

      {/* <Loading /> */}
    </VStack>
  )
}