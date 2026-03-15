import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
  ScrollView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Linking from 'expo-linking';
import { Text } from '@/components/ui';
import { useTheme } from '@/context/ThemeContext';
import { supabase } from '@/lib/supabase';

export default function AuthScreen() {
  const insets = useSafeAreaInsets();
  const { theme, isDark } = useTheme();
  
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [needsVerification, setNeedsVerification] = useState(false);

  const handleAuth = async () => {
    if (!email || !password || (!isLogin && !fullName)) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
      } else {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: Linking.createURL('/auth/confirm'),
            data: {
              full_name: fullName,
            },
          },
        });
        console.log('Signup response:', { data, error });
        if (error) throw error;
        setNeedsVerification(true);
      }
    } catch (error: any) {
      console.error('Auth error:', error);
      Alert.alert('Error', error.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <ScrollView 
        contentContainerStyle={[styles.scrollContent, { paddingTop: insets.top + 50 }]}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <View style={[styles.logoContainer, { backgroundColor: theme.colors.primary }]}>
            <Ionicons name="wallet" size={40} color="#FFFFFF" />
          </View>
          <Text variant="heading" bold align="center" style={styles.title}>
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </Text>
          <Text variant="body" color="textSecondary" align="center" style={styles.subtitle}>
            {isLogin 
              ? 'Sign in to continue managing your expenses' 
              : 'Join Penny Flow to take control of your finances'
            }
          </Text>
        </View>

        {needsVerification ? (
          <View style={styles.verificationContainer}>
            <View style={[styles.verificationIcon, { backgroundColor: theme.colors.primary + '15' }]}>
              <Ionicons name="mail-unread-outline" size={48} color={theme.colors.primary} />
            </View>
            <Text variant="subheading" bold align="center" style={styles.verificationTitle}>
              Check your email
            </Text>
            <Text variant="body" color="textSecondary" align="center" style={styles.verificationSubtitle}>
              We've sent a confirmation link to <Text variant="body" bold color="textPrimary">{email}</Text>. Please click the link to verify your account.
            </Text>
            <TouchableOpacity
              style={[styles.authButton, { backgroundColor: theme.colors.primary, width: '100%' }]}
              onPress={() => {
                setNeedsVerification(false);
                setIsLogin(true);
              }}
            >
              <Text variant="button" bold color="buttonText">Back to Login</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.resendButton}
              onPress={() => {
                handleAuth(); // Trigger signup again which Supabase handles as resend if within limits
                Alert.alert('Sent', 'A new link has been sent to your email.');
              }}
            >
              <Text variant="body" color="primary" bold>Didn't receive the email? Resend</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.form}>
            {!isLogin && (
              <View style={styles.inputContainer}>
                <Text variant="caption" color="textSecondary" bold style={styles.label}>FULL NAME</Text>
                <View style={[styles.inputWrapper, { backgroundColor: isDark ? '#1E1E1E' : '#F7F8F9' }]}>
                  <Ionicons name="person-outline" size={20} color={theme.colors.textTertiary} style={styles.inputIcon} />
                  <TextInput
                    value={fullName}
                    onChangeText={setFullName}
                    placeholder="John Doe"
                    placeholderTextColor={theme.colors.textTertiary}
                    style={[styles.input, { color: theme.colors.textPrimary }]}
                    autoCapitalize="words"
                  />
                </View>
              </View>
            )}

            <View style={styles.inputContainer}>
              <Text variant="caption" color="textSecondary" bold style={styles.label}>EMAIL ADDRESS</Text>
              <View style={[styles.inputWrapper, { backgroundColor: isDark ? '#1E1E1E' : '#F7F8F9' }]}>
                <Ionicons name="mail-outline" size={20} color={theme.colors.textTertiary} style={styles.inputIcon} />
                <TextInput
                  value={email}
                  onChangeText={setEmail}
                  placeholder="email@example.com"
                  placeholderTextColor={theme.colors.textTertiary}
                  style={[styles.input, { color: theme.colors.textPrimary }]}
                  autoCapitalize="none"
                  keyboardType="email-address"
                />
              </View>
            </View>

            <View style={styles.inputContainer}>
              <Text variant="caption" color="textSecondary" bold style={styles.label}>PASSWORD</Text>
              <View style={[styles.inputWrapper, { backgroundColor: isDark ? '#1E1E1E' : '#F7F8F9' }]}>
                <Ionicons name="lock-closed-outline" size={20} color={theme.colors.textTertiary} style={styles.inputIcon} />
                <TextInput
                  value={password}
                  onChangeText={setPassword}
                  placeholder="••••••••"
                  placeholderTextColor={theme.colors.textTertiary}
                  style={[styles.input, { color: theme.colors.textPrimary }]}
                  secureTextEntry={!showPassword}
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                  <Ionicons 
                    name={showPassword ? "eye-off-outline" : "eye-outline"} 
                    size={20} 
                    color={theme.colors.textTertiary} 
                  />
                </TouchableOpacity>
              </View>
            </View>

              <TouchableOpacity style={styles.forgotPassword}>
                <Text variant="caption" color="primary" bold>Forgot Password?</Text>
              </TouchableOpacity>

            <TouchableOpacity
              style={[styles.authButton, { backgroundColor: theme.colors.primary }]}
              onPress={handleAuth}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text variant="button" bold color="buttonText">
                  {isLogin ? 'Sign In' : 'Create Account'}
                </Text>
              )}
            </TouchableOpacity>

            <View style={styles.footer}>
              <Text variant="body" color="textSecondary">
                {isLogin ? "Don't have an account? " : "Already have an account? "}
              </Text>
              <TouchableOpacity onPress={() => setIsLogin(!isLogin)}>
                <Text variant="body" color="primary" bold>
                  {isLogin ? 'Sign Up' : 'Sign In'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    // Shadow
    ...Platform.select({
      ios: {
        shadowColor: '#00D09C',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  title: {
    marginBottom: 8,
  },
  subtitle: {
    lineHeight: 22,
    paddingHorizontal: 20,
  },
  form: {
    width: '100%',
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    marginBottom: 8,
    letterSpacing: 1,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 56,
    borderRadius: 16,
    paddingHorizontal: 16,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    height: '100%',
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 24,
  },
  authButton: {
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    // Shadow
    ...Platform.select({
      ios: {
        shadowColor: '#00D09C',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 32,
  },
  verificationContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  verificationIcon: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  verificationTitle: {
    marginBottom: 12,
  },
  verificationSubtitle: {
    lineHeight: 24,
    marginBottom: 32,
    paddingHorizontal: 10,
  },
  resendButton: {
    marginTop: 24,
    padding: 10,
  },
});
