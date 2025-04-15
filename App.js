// Flávia Glenda Guimarães Carvalho
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import RealizarLogin from './src/screens/realizarLogin';
import PaginaPrincipal from './src/screens/paginaPrincipal';
import EditarPerfil from './src/screens/editarPerfil';
import SobreNos from './src/screens/sobreNos';
import ListarJogadores from './src/screens/listarJogadores';
import Lampada from './src/screens/lampada';
import CalcularImc from './src/screens/calcularImc';
import ListarImagens from './src/screens/listarImagens';
import UploadImagens from './src/screens/uploadImagens';
import AdicionarUsuario from './src/screens/adicionarUsuario'
const Stack = createNativeStackNavigator();

const App = () => (
  <NavigationContainer>
    <Stack.Navigator initialRouteName='PaginaPrincipal' screenOptions={{headerShown: false}}>
      <Stack.Screen name="RealizarLogin" component={RealizarLogin} />
      <Stack.Screen name="PaginaPrincipal" component={PaginaPrincipal} />
      <Stack.Screen name="EditarPerfil" component={EditarPerfil} />
      <Stack.Screen name="SobreNos" component={SobreNos} />
      <Stack.Screen name="ListarJogadores" component={ListarJogadores} />
      <Stack.Screen name="Lampada" component={Lampada} />
      <Stack.Screen name="CalcularImc" component={CalcularImc} />
      <Stack.Screen name="ListarImagens" component={ListarImagens} />
      <Stack.Screen name="UploadImagens" component={UploadImagens} />
      <Stack.Screen name="AdicionarUsuario" component={AdicionarUsuario} />
      

      
    </Stack.Navigator>
  </NavigationContainer>
);
export default App
