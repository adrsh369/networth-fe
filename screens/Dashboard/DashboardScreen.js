import { View, Text, TouchableOpacity, ScrollView, StyleSheet, StatusBar } from 'react-native';
import { useEffect, useState } from 'react';
import { getUser, deleteUser } from '../../database/db';
import { getMutualFundSummary } from '../../database/mutualFundDB';
import { useNavigation, CommonActions } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import AppHeader from '../../components/AppHeader/AppHeader';
import { getAllFixedDeposits, getFixedDepositSummary } from '../../database/fixedDepositDB';

export default function DashboardScreen() {
    const navigation = useNavigation();
    const [userName, setUserName] = useState('');
    const [showAll, setShowAll] = useState(false);
    const [mfValue, setMfValue] = useState(0);
    const [fdValue, setFdValue] = useState(0);


    // useEffect(() => {
    //     const loadUser = async () => {
    //         const user = await getUser();
    //         if (user) setUserName(user.name);

    //         const mfSummary = await getMutualFundSummary();
    //         setMfValue(mfSummary.total_current || 0);

    //         console.log('Dashboard loaded', mfSummary.total_current);

    //     };
    //     loadUser();
    // }, []);

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {

            const loadUser = async () => {
                const user = await getUser();
                if (user) setUserName(user.name);


                // ----------------Mutual Fund Start-------------

                const mfSummary = await getMutualFundSummary();
                setMfValue(mfSummary.total_current || 0);

                // ----------------Mutual Fund End-------------


                // ----------------Fixed Deposit Start-------------

                const summaryData = await getFixedDepositSummary();
                const depositsData = await getAllFixedDeposits();

                // Calculate current returns for all deposits
                let totalCurrentReturn = 0;
                const depositsWithReturns = depositsData.map(deposit => {
                    const returns = calculateFixedDepositCurrentReturns(
                        deposit.investment_amount,
                        deposit.annual_rate,
                        deposit.start_date,
                        deposit.tenure_years,
                        deposit.tenure_months,
                        deposit.tenure_days,
                        deposit.deposit_type,
                        deposit.compounding_frequency
                    );
                    totalCurrentReturn += returns;
                    return { ...deposit, currentReturns: returns };
                });

                const totalFd = (summaryData.total_invested || 0) + (totalCurrentReturn || 0);
                console.log('Total FD Value:', totalFd);
                setFdValue(totalFd);

                // ----------------Fixed Deposit End-------------

            };

            loadUser();
        });

        return unsubscribe;
    }, [navigation]);

    const calculateFixedDepositCurrentReturns = (principal, rate, startDate, tenureYears, tenureMonths, tenureDays, depositType, frequency) => {
        const start = new Date(startDate);
        const today = new Date();

        // Calculate days elapsed
        const timeDiff = today - start;
        const daysElapsed = Math.floor(timeDiff / (1000 * 60 * 60 * 24));

        if (daysElapsed <= 0) return 0;

        const rateDecimal = rate / 100;
        const yearsElapsed = daysElapsed / 365;

        let interest = 0;

        if (depositType === 'Cumulative') {
            // Compound interest calculation
            let n = 4; // Default quarterly
            if (frequency === 'Monthly') n = 12;
            else if (frequency === 'Daily') n = 365;
            else if (frequency === 'Half Yearly') n = 2;
            else if (frequency === 'Yearly') n = 1;

            const amount = principal * Math.pow(1 + rateDecimal / n, n * yearsElapsed);
            interest = amount - principal;
        } else {
            // Simple interest for Payout and Tax Saving
            interest = principal * rateDecimal * yearsElapsed;
        }

        return Math.round(interest);
    };

    // Get initials from name (e.g., "Adarsh Pandey" -> "AP")
    const getInitials = (name) => {
        if (!name) return 'U';
        const nameParts = name.trim().split(' ');
        if (nameParts.length === 1) return nameParts[0].charAt(0).toUpperCase();
        return (nameParts[0].charAt(0) + nameParts[nameParts.length - 1].charAt(0)).toUpperCase();
    };

    const allAssets = [
        { name: 'Mutual Funds', value: Number(mfValue || 0), icon: '📊' },
        { name: 'Fixed Deposits', value: Number(fdValue || 0), icon: '🏦' },
        { name: 'Recurring Deposits', value: Number(fdValue || 0), icon: '🏦' },
        { name: 'INDstocks', value: 0, icon: '₹' },
        { name: 'EPF', value: 0, icon: '👤' },
        { name: 'Other Brokers', value: 0, raw: true, icon: '💼' },
        { name: 'Gold', value: 0, icon: '🪙' },
        { name: 'PPF', value: 0, icon: '📈' },
        { name: 'Stocks', value: 0, icon: '📉' },
        { name: 'Bonds', value: 0, icon: '📜' },
    ];

    const assetRoutes = {
        'Mutual Funds': 'MutualFund',
        'Fixed Deposits': 'FixedDeposit',
        'Stocks': 'Stocks',
        'Bonds': 'Bonds',
        'PPF': 'PPF',
        'EPF': 'EPF',
    };

    const displayedAssets = showAll ? allAssets : allAssets.slice(0, 6);

    const formatValue = (amount) => {
        const value = Number(amount || 0);

        if (value >= 10000000) {
            return `₹${(value / 10000000).toFixed(2)}Cr`;
        }
        if (value >= 100000) {
            return `₹${(value / 100000).toFixed(2)}L`;
        }
        if (value >= 1000) {
            return `₹${(value / 1000).toFixed(0)}K`;
        }
        return `₹${value}`;
    };


    const networth = allAssets.reduce((sum, asset) => {
        if (asset.raw) return sum + asset.value;
        if (asset.isLakh) return sum + asset.value * 100000;
        return sum + asset.value * 1000;
    }, 0);

    const formatFullAmount = (amount) => {
        return `₹${Number(amount || 0).toLocaleString('en-IN')}`;
    };


    return (
        <View style={styles.container}>
            {/* <StatusBar barStyle="light-content" backgroundColor="#0F172A" /> */}

            {/* Header */}
            {/* <View style={styles.header}>
                <TouchableOpacity style={styles.profileButton} onPress={() => navigation.navigate('Profile')}>
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
            </View> */}

            <AppHeader />

            {/* My Assets Section */}
            <View style={styles.assetsSection}>
                <View style={styles.assetsTitleContainer}>
                    <Text style={styles.assetsTitle}>NETWORTH</Text>
                </View>

                <View style={styles.balanceRow}>
                    <Text style={styles.balanceAmount}>{formatFullAmount(mfValue)}</Text>
                    <TouchableOpacity style={styles.dropdownButton}>
                        <Ionicons name="chevron-down" size={20} color="#94A3B8" />
                    </TouchableOpacity>
                </View>
            </View>

            <View style={{ height: 20, width: '100%', borderRadius: 14, backgroundColor: '#fff', marginTop: -5 }} />


            {/* Tabs */}
            <View style={styles.tabsContainer}>
                <View style={styles.tabActive}>
                    <Text style={styles.tabTextActive}>Assets</Text>
                </View>
                <TouchableOpacity style={styles.gridButton}>
                    <Ionicons name="grid-outline" size={20} color="#fff" />
                </TouchableOpacity>
            </View>

            {/* Assets Grid */}
            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                <View style={styles.assetsGrid}>
                    {displayedAssets.map((asset, index) => (
                        <TouchableOpacity key={index} style={styles.assetCard} onPress={() => {
                            const route = assetRoutes[asset.name];
                            if (route) {
                                navigation.navigate(route);
                            }
                        }}>
                            <View style={styles.assetIconContainer}>
                                <Text style={styles.assetIcon}>{asset.icon}</Text>
                            </View>
                            <Text style={styles.assetName} numberOfLines={1} ellipsizeMode="tail">
                                {asset.name}
                            </Text>
                            <Text style={[
                                styles.assetValue,
                                Number(asset.value) === 0 && styles.assetValueAdd
                            ]}>
                                {Number(asset.value) === 0 ? '+ Add' : formatValue(asset.value)}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* View More/Less Button */}
                {allAssets.length > 6 && (
                    <View style={styles.viewMoreContainer}>
                        <TouchableOpacity onPress={() => setShowAll(!showAll)}>
                            <Text style={styles.viewMoreText}>
                                {showAll ? 'View Less' : 'View More'}
                            </Text>
                        </TouchableOpacity>
                    </View>
                )}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F1F5F9',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 10,
        paddingBottom: 15,
        backgroundColor: '#0F172A',
    },
    profileButton: {
        width: 45,
        height: 45,
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
    assetsSection: {
        backgroundColor: '#0F172A',
        paddingHorizontal: 20,
        paddingTop: 25,
        paddingBottom: 20,
    },
    assetsTitleContainer: {
        alignItems: 'center',
        marginBottom: 15,
    },
    assetsTitle: {
        color: '#94A3B8',
        fontSize: 13,
        fontWeight: '600',
        letterSpacing: 1.5,
    },
    balanceRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
    },
    balanceAmount: {
        color: '#fff',
        fontSize: 44,
        fontWeight: 'bold',
        letterSpacing: -2,
    },
    dropdownButton: {
        marginLeft: 10,
        backgroundColor: '#1E293B',
        borderRadius: 20,
        width: 36,
        height: 36,
        justifyContent: 'center',
        alignItems: 'center',
    },
    tabsContainer: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 10,
        alignItems: 'center',
        marginTop: -10,
    },
    tabActive: {
        borderBottomWidth: 3,
        borderBottomColor: '#3B82F6',
        paddingBottom: 10,
    },
    tabTextActive: {
        fontSize: 16,
        fontWeight: '600',
        color: '#0F172A',
    },
    gridButton: {
        marginLeft: 'auto',
        backgroundColor: '#1E293B',
        borderRadius: 20,
        width: 36,
        height: 36,
        justifyContent: 'center',
        alignItems: 'center',
    },
    scrollView: {
        flex: 1,
        backgroundColor: '#fff',
    },
    assetsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        padding: 15,
        justifyContent: 'space-between',
    },
    assetCard: {
        width: '30%',
        backgroundColor: '#fff',
        borderRadius: 0,
        padding: 12,
        alignItems: 'center',
        marginBottom: 10,
    },
    assetValueAdd: {
        fontSize: 13,
        fontWeight: '500',
        color: '#3B82F6',
    },
    assetIconContainer: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#EFF6FF',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
    },
    assetIcon: {
        fontSize: 24,
    },
    assetName: {
        fontSize: 11,
        color: '#64748B',
        textAlign: 'center',
        marginBottom: 6,
        numberOfLines: 1,
    },
    assetValue: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#0F172A',
    },
    viewMoreContainer: {
        alignItems: 'center',
        paddingVertical: 20,
    },
    viewMoreText: {
        color: '#3B82F6',
        fontSize: 14,
        fontWeight: '600',
    },
});