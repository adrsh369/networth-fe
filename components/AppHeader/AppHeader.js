import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, StatusBar } from 'react-native'
import { useEffect, useState } from 'react'
import { Ionicons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import { getUser } from '../../database/db'

export default function AppHeader() {
    const navigation = useNavigation()
    const [userName, setUserName] = useState('')

    useEffect(() => {
        const loadUser = async () => {
            const user = await getUser()
            if (user?.name) setUserName(user.name)
        }

        console.log('Loading user in AppHeader')
        loadUser()
    }, [])

    const getInitials = (name) => {
        if (!name) return 'U'
        const parts = name.trim().split(' ')
        if (parts.length === 1) return parts[0][0].toUpperCase()
        return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
    }

    return (
        <SafeAreaView style={styles.safe}>
            <StatusBar barStyle="light-content" backgroundColor="#0F172A" />
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
                    <View style={styles.profileImage}>
                        <Text style={styles.profileText}>{getInitials(userName)}</Text>
                    </View>
                </TouchableOpacity>

                <View style={styles.headerRight}>
                    <TouchableOpacity style={styles.iconButton}>
                        <Ionicons name="notifications-outline" size={24} color="#fff" />
                        <View style={styles.badge}>
                            <Text style={styles.badgeText}>4</Text>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.iconButton}>
                        <Ionicons name="search-outline" size={24} color="#fff" />
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    safe: {
        backgroundColor: '#0F172A',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 12,
        backgroundColor: '#0F172A',
    },
    profileImage: {
        width: 45,
        height: 45,
        borderRadius: 22.5,
        backgroundColor: '#64748B',
        justifyContent: 'center',
        alignItems: 'center',
    },
    profileText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    headerRight: {
        flexDirection: 'row',
        gap: 15,
    },
    iconButton: {
        position: 'relative',
        padding: 5,
    },
    badge: {
        position: 'absolute',
        top: 0,
        right: 0,
        backgroundColor: '#EF4444',
        borderRadius: 10,
        width: 18,
        height: 18,
        justifyContent: 'center',
        alignItems: 'center',
    },
    badgeText: {
        color: '#fff',
        fontSize: 11,
        fontWeight: 'bold',
    },
})
