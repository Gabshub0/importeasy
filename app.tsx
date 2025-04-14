import 'react-native-gesture-handler';
import { enableScreens } from 'react-native-screens';
import { AccessibilityInfo, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialIcons } from '@expo/vector-icons';
import { Provider as PaperProvider } from 'react-native-paper';

// Polyfill para resolver o erro de acessibilidade
if (!AccessibilityInfo.removeEventListener) {
  AccessibilityInfo.removeEventListener = () => {};
}

enableScreens();

// Importação das telas
import LoginScreen from './screens/LoginScreen';
import SignUpScreen from './screens/SignUpScreen';
import ForgotPasswordScreen from './screens/ForgotPasswordScreen';
import HomeScreen from './screens/HomeScreen';
import CartScreen from './screens/CartScreen';
import ProductScreen from './screens/ProductScreen';
import TryOnScreen from './screens/TryOnScreen';
import NotificationsScreen from './screens/NotificationsScreen';
import SupportScreen from './screens/SupportScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
const AuthStack = createStackNavigator();

// Stack de Autenticação
function AuthStackScreen({ setIsLoggedIn }: { setIsLoggedIn: (value: boolean) => void }) {
  const navigation = useNavigation();
  
  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
      <AuthStack.Screen name="Login">
        {(props) => <LoginScreen {...props} setIsLoggedIn={setIsLoggedIn} />}
      </AuthStack.Screen>
      <AuthStack.Screen name="SignUp" component={SignUpScreen} />
      <AuthStack.Screen 
        name="ForgotPassword" 
        component={ForgotPasswordScreen}
        options={{
          headerShown: true,
          headerTitle: 'Recuperar Senha',
          headerStyle: {
            backgroundColor: '#f8f9fa',
            shadowColor: 'transparent',
            elevation: 0,
          },
          headerTintColor: '#3498db',
          headerLeft: () => (
            <TouchableOpacity 
              onPress={() => navigation.goBack()}
              style={{ marginLeft: 15 }}
            >
              <MaterialIcons name="arrow-back" size={24} color="#3498db" />
            </TouchableOpacity>
          ),
        }}
      />
    </AuthStack.Navigator>
  );
}

// Stack Principal do App
function HomeStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Product" component={ProductScreen} />
    </Stack.Navigator>
  );
}

// Navegação por Tabs
function MainApp() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === 'Home') iconName = 'home';
          else if (route.name === 'Cart') iconName = 'shopping-cart';
          else if (route.name === 'TryOn') iconName = 'camera';
          else if (route.name === 'Notifications') iconName = 'notifications';
          else if (route.name === 'Support') iconName = 'support-agent';

          return <MaterialIcons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#3498db',
        tabBarInactiveTintColor: '#888',
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopWidth: 0,
          elevation: 10,
          shadowOpacity: 0.1,
          shadowRadius: 10,
        },
      })}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeStack} 
        options={{ headerShown: false, title: 'Início' }} 
      />
      <Tab.Screen 
        name="Cart" 
        component={CartScreen} 
        options={{ title: 'Carrinho' }} 
      />
      <Tab.Screen 
        name="TryOn" 
        component={TryOnScreen} 
        options={{ title: 'Experimentar' }} 
      />
      <Tab.Screen 
        name="Notifications" 
        component={NotificationsScreen} 
        options={{ title: 'Notificações' }} 
      />
      <Tab.Screen 
        name="Support" 
        component={SupportScreen} 
        options={{ title: 'Suporte' }} 
      />
    </Tab.Navigator>
  );
}

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <PaperProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {isLoggedIn ? (
            <Stack.Screen name="MainApp" component={MainApp} />
          ) : (
            <Stack.Screen name="Auth">
              {(props) => <AuthStackScreen {...props} setIsLoggedIn={setIsLoggedIn} />}
            </Stack.Screen>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}
