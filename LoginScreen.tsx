import React, { useState, useCallback } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as Google from 'expo-auth-session/providers/google';
import * as AppleAuthentication from 'expo-apple-authentication';
import { Ionicons } from '@expo/vector-icons';

const LoginScreen = ({ setIsLoggedIn }: { setIsLoggedIn: (value: boolean) => void }) => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const [request, response, promptAsync] = Google.useAuthRequest({
    expoClientId: 'SEU_CLIENT_ID_GOOGLE',
    iosClientId: 'SEU_CLIENT_ID_IOS',
    androidClientId: 'SEU_CLIENT_ID_ANDROID',
  });

  const handleSocialLogin = useCallback(async (token: string | undefined, provider: string) => {
    if (!token) return;
    
    setLoading(true);
    try {
      console.log(`Login com ${provider}`, token);
      setIsLoggedIn(true);
    } catch (error) {
      Alert.alert('Erro', `Falha no login com ${provider}`);
    } finally {
      setLoading(false);
    }
  }, [setIsLoggedIn]);

  React.useEffect(() => {
    if (response?.type === 'success') {
      const { authentication } = response;
      handleSocialLogin(authentication?.accessToken, 'google');
    }
  }, [response, handleSocialLogin]);

  const handleLogin = () => {
    setLoading(true);
    setTimeout(() => {
      setIsLoggedIn(true);
      setLoading(false);
    }, 1500);
  };

  const handleAppleLogin = async () => {
    try {
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });
      
      if (credential.identityToken) {
        await handleSocialLogin(credential.identityToken, 'apple');
      }
    } catch (error) {
      if (error.code === 'ERR_CANCELED') return;
      Alert.alert('Erro', 'Falha no login com Apple');
    }
  };

  return (
    <View style={styles.container}>
      {/* Logo adicionada aqui no topo */}
      <Image 
        source={require('../assets/logo.png')} // Altere para o caminho da sua logo
        style={styles.logo}
        resizeMode="contain"
      />
      
      <Text style={styles.title}>Faça login</Text>
      <Text style={styles.subtitle}>Insira seu e-mail e senha</Text>
      
      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>E-mail</Text>
        <TextInput
          style={styles.input}
          placeholder="seu@email.com"
          placeholderTextColor="#999"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>
      
      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Senha</Text>
        <TextInput
          style={styles.input}
          placeholder="Sua senha"
          placeholderTextColor="#999"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
      </View>
      
      <TouchableOpacity 
        style={[styles.button, loading && styles.disabledButton]} 
        onPress={handleLogin}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? 'Carregando...' : 'Entrar'}
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.signUpLink} 
        onPress={() => navigation.navigate('SignUp')}
      >
        <Text style={styles.signUpText}>Não tem uma conta? <Text style={styles.signUpLinkText}>Cadastre-se</Text></Text>
      </TouchableOpacity>
      
      <View style={styles.separator}>
        <View style={styles.separatorLine} />
        <Text style={styles.separatorText}>ou</Text>
        <View style={styles.separatorLine} />
      </View>
      
      <TouchableOpacity 
        style={[styles.socialButton, styles.googleButton]}
        onPress={() => promptAsync()}
        disabled={!request}
      >
        <Image 
          source={{ uri: 'https://cdn-icons-png.flaticon.com/512/2991/2991148.png' }}
          style={styles.socialIcon}
        />
        <Text style={styles.socialButtonText}>Continue com o Google</Text>
      </TouchableOpacity>
      
      {Platform.OS === 'ios' && (
        <TouchableOpacity 
          style={[styles.socialButton, styles.appleButton]}
          onPress={handleAppleLogin}
        >
          <Ionicons name="logo-apple" size={24} color="#000" />
          <Text style={styles.socialButtonText}>Continue com a Apple</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  logo: {
    width: 150,
    height: 150,
    alignSelf: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
    color: '#000',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 32,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    marginBottom: 8,
    color: '#333',
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  button: {
    height: 50,
    backgroundColor: '#6200ee',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  signUpLink: {
    marginTop: 16,
    marginBottom: 24,
  },
  signUpText: {
    textAlign: 'center',
    color: '#666',
  },
  signUpLinkText: {
    color: '#6200ee',
    fontWeight: 'bold',
  },
  separator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  separatorLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#ddd',
  },
  separatorText: {
    marginHorizontal: 10,
    color: '#666',
  },
  socialButton: {
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    flexDirection: 'row',
    borderWidth: 1,
  },
  googleButton: {
    borderColor: '#ddd',
    backgroundColor: '#fff',
  },
  appleButton: {
    borderColor: '#000',
    backgroundColor: '#fff',
  },
  socialIcon: {
    width: 24,
    height: 24,
    marginRight: 10,
  },
  socialButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default LoginScreen;
