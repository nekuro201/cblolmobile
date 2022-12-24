import { useState } from "react";
import { Heading, VStack, Text, useToast, Image, Center, Box, Spacer, Pressable } from "native-base";

// import Logo from "../assets/logo.svg";

import { api } from "../services/api";

import { useAuth } from "../hooks/userAuth";

import { Header } from "../components/Header";
import { Input } from "../components/Input";
import { Button } from "../components/Button";

//import { useAuth } from "../hooks/userAuth";

export function New(){

  const { logout } = useAuth();

  const [title, setTitle] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const toast = useToast();

  //const { getData, hasTokenResponse } = useAuth();

  async function handlePoolCreate(){
    // verifica se tem algo digitado e tira os espaços
    if(!title.trim()){
      return toast.show({
        title: 'Informe um nome para o seu bolão',
        placement: 'top',
        bgColor: 'red.500'
      });
    }

    try{
      setIsLoading(true);

      await api.post('/polls', { title: title })

      toast.show({
        title: 'Bolão criado com sucesso!',
        placement: 'top',
        bgColor: 'green.500'
      });

      setTitle('');

    }catch(error){
      console.log(error);

      toast.show({
        title: 'Não foi possivel criar o bolão',
        placement: 'top',
        bgColor: 'red.500'
      });
    }finally{
      setIsLoading(false);
    }
  }

  function handleLogout(){
    console.log("Logout");

    logout();
    // apos fazer logout ele atualiza o state do user() assim atualiza todos os components do context auth
  }

  return(
    <VStack flex={1} bgColor="gray.900">
      <Header title="Criar novo bolão" />

      <VStack mt={8} mx={5} alignItems="center" h="75%">
        {/* <Logo /> */}
        <Image source={require("../assets/logo2.png")} width={300} height={150} alt="logo"/>

        <Heading fontFamily="heading" color="white" fontSize="xl" my={8} textAlign="center">
          Crie seu próprio bolão do cblol{"\n"}e compartilhe entre amigos!
        </Heading>

        <Input 
          mb={2}
          placeholder="Qual nome do seu bolão?"
          onChangeText={setTitle}
          value={title}
        />

        <Button 
          title="CRIAR MEU BOLÃO"
          onPress={handlePoolCreate}
          isLoading={isLoading}
        />

        <Text color="gray.200" fontSize="sm" textAlign="center" px={10} mt={4}>
          Após criar seu bolão, você receberá um código único 
          que poderá usar para convidar outras pessoas.
          
        </Text>

        <Spacer />

        <Pressable onPress={handleLogout}>
          <Text textDecorationLine="underline" color="yellow.500" textDecoration="underline" mb={15}>
            Logout
          </Text>
        </Pressable>
      </VStack>
    </VStack>
  );
}