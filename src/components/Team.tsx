import { HStack, Image } from 'native-base';
import CountryFlag from "react-native-country-flag"; // pega a bandeira baseado no isoCode

import { Input } from './Input';

// times de lol

interface Props {
  code: string;
  position: 'left' | 'right';
  onChangeText: (value: string) => void;
  value?: string;
}

export function Team({ code, position, onChangeText, value }: Props) {

  let iconc;

  switch(code){
    case "FLA":
      iconc = require('../assets/teams/FLA.png');
    break;
    case "INTZ":
      iconc = require('../assets/teams/INTZ.png');
    break;
    case "LOUD":
      iconc = require('../assets/teams/LOUD.png');
    break;
    case "PAIN":
      iconc = require('../assets/teams/PAIN.png');
    break;
  }

  return (
    <HStack alignItems="center">

      {/* {position === 'left' && <CountryFlag isoCode={code} size={25} style={{ marginRight: 12 }} />} */}
      {position === 'left' && 
        <Image source={iconc} 
          alt={code} 
          borderRadius={4} 
          height={12}
          width={81}
          marginRight={4}
        />
      }

      <Input
        w={10}
        h={9}
        textAlign="center"
        fontSize="xs"
        keyboardType="numeric"
        onChangeText={onChangeText}
        value={value}
        isDisabled={value ? true : false}
      />

      {/* {position === 'right' && <CountryFlag isoCode={code} size={25} style={{ marginLeft: 12 }} />} */}
      {position === 'right' && 
        <Image 
          source={iconc} 
          alt={code}
          borderRadius={4} 
          height={12}
          width={81}
          marginLeft={4}
        />
      }
      
    </HStack>
  );
}