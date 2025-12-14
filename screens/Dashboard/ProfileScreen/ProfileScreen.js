import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Alert } from 'react-native';
import { useEffect, useState } from 'react';
import { getUser, deleteUser } from '../../../database/db';
import { useNavigation, CommonActions } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

export default function ProfileScreen() {
  const navigation = useNavigation();
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const loadUser = async () => {
      const user = await getUser();
      if (user) setUserName(user.name);
    };
    loadUser();
  }, []);

  // Get initials from name (e.g., "Adarsh Pandey" -> "AP")
  const getInitials = (name) => {
    if (!name) return 'U';
    const nameParts = name.trim().split(' ');
    if (nameParts.length === 1) return nameParts[0].charAt(0).toUpperCase();
    return (nameParts[0].charAt(0) + nameParts[nameParts.length - 1].charAt(0)).toUpperCase();
  };

  const logout = async () => {
    Alert.alert(
      'Logout',
      'Do you want to logout and create new profile?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            // Delete user from SQLite
            await deleteUser();
            // Reset root stack to CreateProfile
            navigation.dispatch(
              CommonActions.reset({
                index: 0,
                routes: [{ name: 'CreateProfile' }],
              })
            );
          },
        },
      ]
    );
  };

  const menuItems = [
    {
      title: 'Help Center',
      icon: 'help-circle-outline',
      onPress: () => console.log('Help Center'),
    },
    {
      title: 'Learn Finance',
      icon: 'school-outline',
      onPress: () => console.log('Learn Finance'),
    },
  ];

  const linkItems = [
    {
      title: 'Privacy Policy',
      icon: 'shield-checkmark-outline',
      onPress: () => console.log('Privacy Policy'),
    },
    {
      title: 'Terms and Conditions',
      icon: 'document-text-outline',
      onPress: () => console.log('Terms and Conditions'),
    },
    {
      title: 'About Us',
      icon: 'information-circle-outline',
      onPress: () => console.log('About Us'),
    },
  ];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#0F172A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Profile Section */}
        <View style={styles.profileSection}>
          <View style={styles.profileImageLarge}>
            <Text style={styles.profileTextLarge}>{getInitials(userName)}</Text>
          </View>
          <Text style={styles.userName}>{userName || 'User Name'}</Text>
        </View>

        {/* Menu Items - Two in a row */}
        <View style={styles.menuGrid}>
          {menuItems.map((item, index) => (
            <TouchableOpacity key={index} style={styles.menuCard} onPress={item.onPress}>
              <Ionicons name={item.icon} size={32} color="#3B82F6" />
              <Text style={styles.menuCardTitle}>{item.title}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Link Items - Full width */}
        <View style={styles.linkSection}>
          {linkItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.linkItem,
                index !== linkItems.length - 1 && styles.linkItemBorder,
              ]}
              onPress={item.onPress}
            >
              <View style={styles.linkItemLeft}>
                <Ionicons name={item.icon} size={24} color="#64748B" />
                <Text style={styles.linkItemTitle}>{item.title}</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#CBD5E1" />
            </TouchableOpacity>
          ))}
        </View>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={logout}>
          <Ionicons name="log-out-outline" size={24} color="#EF4444" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>

        {/* Version */}
        <Text style={styles.version}>Version 1.0</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 15,
    backgroundColor: '#fff',
    marginTop: -40,
    gap: 8,
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0F172A',
  },
  placeholder: {
    width: 34,
  },
  scrollView: {
    flex: 1,
  },
  profileSection: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  profileImageLarge: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#3B82F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  profileTextLarge: {
    color: '#fff',
    fontSize: 40,
    fontWeight: 'bold',
  },
  userName: {
    fontSize: 24,
    fontWeight: '600',
    color: '#0F172A',
  },
  menuGrid: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 15,
    marginBottom: 20,
  },
  menuCard: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 120,
  },
  menuCardTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0F172A',
    marginTop: 12,
    textAlign: 'center',
  },
  linkSection: {
    marginHorizontal: 20,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    marginBottom: 20,
  },
  linkItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  linkItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  linkItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  linkItemTitle: {
    fontSize: 16,
    color: '#0F172A',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    marginHorizontal: 20,
    backgroundColor: '#FEE2E2',
    borderRadius: 12,
    padding: 16,
    marginBottom: 30,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#EF4444',
  },
  version: {
    textAlign: 'center',
    fontSize: 14,
    color: '#94A3B8',
    marginBottom: 30,
  },
});