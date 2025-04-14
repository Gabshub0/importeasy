import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Linking, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';

const ForgotPasswordScreen = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({
    email: '',
  });

  const validateForm = () => {
    let valid = true;
    const newErrors = { email: '' };

    if (!email) {
      newErrors.email = 'Email é obrigatório';
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email inválido';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleResetPassword = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    
    try {
      // Simulação de requisição para resetar senha
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      Alert.alert(
        'Email enviado',
        'Enviamos um link para redefinir sua senha para o email fornecido.',
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ]
      );
    } catch (error) {
      Alert.alert('Erro', 'Ocorreu um erro ao tentar enviar o email de recuperação.');
    } finally {
      setIsLoading(false);
    }
  };

  const openTerms = () => {
    Linking.openURL('https://www.example.com/terms');
  };

  const openPrivacy = () => {
    Linking.openURL('https://www.example.com/privacy');
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.backButton} 
        onPress={() => navigation.goBack()}
      >
        <MaterialIcons name="arrow-back" size={24} color="#3498db" />
      </TouchableOpacity>

      {/* Substituído por ícone do MaterialIcons */}
      <MaterialIcons 
        name="lock-reset" 
        size={100} 
        color="#3498db" 
        style={styles.icon} 
      />
      
      <Text style={styles.title}>Redefinir sua senha</Text>
      <Text style={styles.subtitle}>Digite o email associado à sua conta e enviaremos um link para redefinir sua senha</Text>
      
      <TextInput
        style={[styles.input, errors.email && styles.inputError]}
        placeholder="email@domain.com"
        placeholderTextColor="#999"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
      />
      {errors.email ? <Text style={styles.errorText}>{errors.email}</Text> : null}
      
      <TouchableOpacity 
        style={[styles.continueButton, isLoading && styles.disabledButton]} 
        onPress={handleResetPassword}
        disabled={isLoading}
      >
        {isLoading ? (
          <Text style={styles.continueButtonText}>Enviando...</Text>
        ) : (
          <Text style={styles.continueButtonText}>Enviar link</Text>
        )}
      </TouchableOpacity>
      
      <Text style={styles.footerText}>
        Ao continuar, você concorda com nossos{' '}
        <Text style={styles.linkText} onPress={openTerms}>Termos de Serviço</Text>{' '}
        e{' '}
        <Text style={styles.linkText} onPress={openPrivacy}>Política de Privacidade</Text>
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#f8f9fa',
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    padding: 10,
    zIndex: 1,
  },
  icon: {
    alignSelf: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
    color: '#2c3e50',
  },
  subtitle: {
    fontSize: 16,
    color: '#7f8c8d',
    marginBottom: 32,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  input: {
    height: 50,
    borderColor: '#dfe6e9',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    marginBottom: 8,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  inputError: {
    borderColor: '#e74c3c',
  },
  errorText: {
    color: '#e74c3c',
    marginBottom: 12,
    fontSize: 14,
  },
  continueButton: {
    height: 50,
    backgroundColor: '#3498db',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#2980b9',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 3,
  },
  disabledButton: {
    backgroundColor: '#bdc3c7',
  },
  continueButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  footerText: {
    marginTop: 24,
    textAlign: 'center',
    color: '#7f8c8d',
    fontSize: 14,
  },
  linkText: {
    color: '#3498db',
    textDecorationLine: 'underline',
    fontWeight: 'bold',
  },
});

export default ForgotPasswordScreen;
