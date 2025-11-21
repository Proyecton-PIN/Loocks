import {
  BellIcon,
  IconProps,
  LogoutIcon,
  PersonalIcon,
  SettingsIcon,
  SuscriptionIcon,
  TranslateIcon,
} from '@/constants/icons';
import { Colors } from '@/constants/theme';
import { SecureStore } from '@/lib/logic/services/secure-store-service';
import { router } from 'expo-router';
import React from 'react';
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';

const ChevronIcon = () => (
  <View style={{ width: 20, height: 20 }}>
    <Text style={{ color: '#686868', fontSize: 16 }}>›</Text>
  </View>
);

interface MenuSectionItem {
  icon: (props: IconProps) => React.JSX.Element;
  label: string;
  badge?: string;
  hasBadge: boolean;
  onPress?(): void;
}

export default function ProfileSettingsScreen() {
  const userData = {
    profileImage: require('@/assets/images/imagen.png'),
    username: '_andreea',
    fullName: 'Andrea Rufo',
  };

  const menuSections: MenuSectionItem[][] = [
    [
      {
        icon: SuscriptionIcon,
        label: 'Suscripción',
        badge: 'PRO',
        hasBadge: true,
      },
      {
        icon: PersonalIcon,
        label: 'Datos Personales',
        hasBadge: false,
      },
    ],
    [
      {
        icon: TranslateIcon,
        label: 'Idioma',
        hasBadge: false,
      },
      {
        icon: SettingsIcon,
        label: 'Ajustes',
        hasBadge: false,
      },
      {
        icon: BellIcon,
        label: 'Notificaciones',
        hasBadge: false,
        onPress: () => {},
      },
      {
        icon: LogoutIcon,
        label: 'Cerrar sesión',
        hasBadge: false,
        onPress() {
          SecureStore.remove('token');
          router.replace('/inicio');
        },
      },
    ],
  ];

  return (
    <ScrollView
      style={{
        backgroundColor: Colors.background,
        flex: 1,
      }}
      contentContainerStyle={{
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 16,
      }}
    >
      <View
        style={{
          backgroundColor: Colors.background,
          borderRadius: 16,
          width: '100%',
          maxWidth: 400,
          shadowColor: '#000',
          shadowOpacity: 0.1,
          shadowRadius: 8,
          elevation: 5,
          overflow: 'hidden',
        }}
      >
        {/* Perfil Header */}
        <View
          style={{
            backgroundColor: Colors.background,
            paddingTop: 32,
            paddingBottom: 24,
            paddingHorizontal: 24,
            alignItems: 'center',
          }}
        >
          {/* Imagen de Perfil */}
          <View
            style={{
              borderColor: Colors.background,
              width: 96,
              height: 96,
              borderRadius: 48,
              borderWidth: 4,
              marginBottom: 16,
              overflow: 'hidden',
              shadowColor: '#000',
              shadowOpacity: 0.1,
              shadowRadius: 4,
              elevation: 3,
            }}
          >
            <Image
              source={userData.profileImage}
              style={{ width: '100%', height: '100%' }}
            />
          </View>

          {/* Username */}
          <Text
            style={{
              color: Colors.primary,
              fontSize: 20,
              fontWeight: '600',
              marginBottom: 4,
            }}
          >
            {userData.username}
          </Text>

          {/* Full Name */}
          <Text
            style={{
              color: Colors.muted,
              fontSize: 14,
            }}
          >
            {userData.fullName}
          </Text>
        </View>

        {/* Menu Items */}
        <View style={{ paddingHorizontal: 16, paddingVertical: 8 }}>
          {menuSections.map((section, sectionIndex) => (
            <View key={sectionIndex}>
              {section.map((item, itemIndex) => {
                const Icon = item.icon;
                return (
                  <View key={itemIndex} style={{ marginBottom: 8 }}>
                    <TouchableOpacity
                      style={{
                        backgroundColor: Colors.white,
                        paddingHorizontal: 16,
                        paddingVertical: 16,
                        borderRadius: 8,
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                      onPress={item.onPress}
                    >
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          flex: 1,
                          gap: 12,
                        }}
                      >
                        <Icon />
                        <Text
                          style={{ color: Colors.black, fontWeight: '500' }}
                        >
                          {item.label}
                        </Text>
                      </View>

                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          gap: 8,
                        }}
                      >
                        {item.hasBadge && (
                          <Text
                            style={{
                              color: Colors.black,
                              backgroundColor: Colors.secondary,
                              fontSize: 12,
                              fontWeight: '700',
                              paddingHorizontal: 8,
                              paddingVertical: 4,
                              borderRadius: 4,
                            }}
                          >
                            {item.badge}
                          </Text>
                        )}
                        <ChevronIcon />
                      </View>
                    </TouchableOpacity>
                  </View>
                );
              })}
              {sectionIndex < menuSections.length - 1 && (
                <View style={{ height: 12 }} />
              )}
            </View>
          ))}
        </View>

        {/* Espaciado inferior */}
        <View style={{ height: 16 }} />
      </View>
    </ScrollView>
  );
}
