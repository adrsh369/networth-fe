import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Alert } from 'react-native';
import { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { getFixedDepositSummary, getAllFixedDeposits, deleteFixedDeposit } from '../../../database/fixedDepositDB';
import AppHeader from '../../../components/AppHeader/AppHeader';

export default function FixedDepositScreen() {
    const navigation = useNavigation();
    const [summary, setSummary] = useState({ total_invested: 0, total_deposits: 0, total_current_return: 0 });
    const [deposits, setDeposits] = useState([]);

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            loadData();
        });

        return unsubscribe;
    }, [navigation]);

    const loadData = async () => {
        const summaryData = await getFixedDepositSummary();
        const depositsData = await getAllFixedDeposits();
        
        // Calculate current returns for all deposits
        let totalCurrentReturn = 0;
        const depositsWithReturns = depositsData.map(deposit => {
            const returns = calculateCurrentReturns(
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

        setSummary({ ...summaryData, total_current_return: totalCurrentReturn });
        setDeposits(depositsWithReturns);
    };

    const calculateCurrentReturns = (principal, rate, startDate, tenureYears, tenureMonths, tenureDays, depositType, frequency) => {
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

    const calculateMaturityDate = (startDate, years, months, days) => {
        const date = new Date(startDate);
        date.setFullYear(date.getFullYear() + years);
        date.setMonth(date.getMonth() + months);
        date.setDate(date.getDate() + days);
        
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day} ${getMonthName(month)} ${year}`;
    };

    const getMonthName = (month) => {
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        return months[parseInt(month) - 1];
    };

    const formatTenure = (years, months, days) => {
        const parts = [];
        if (years > 0) parts.push(`${years}y`);
        if (months > 0) parts.push(`${months}m`);
        if (days > 0) parts.push(`${days}d`);
        return parts.join(' ') || '0d';
    };

    const formatCurrency = (amount) => {
        const value = parseFloat(amount || 0);
        if (value >= 10000000) return `₹${(value / 10000000).toFixed(2)}Cr`;
        if (value >= 100000) return `₹${(value / 100000).toFixed(2)}L`;
        if (value >= 1000) return `₹${(value / 1000).toFixed(2)}K`;
        return `₹${value.toLocaleString('en-IN')}`;
    };

    const formatFullCurrency = (amount) => {
        return `₹${parseFloat(amount || 0).toLocaleString('en-IN')}`;
    };

    const handleDelete = (id) => {
        Alert.alert(
            'Delete Deposit',
            'Are you sure you want to delete this fixed deposit?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        await deleteFixedDeposit(id);
                        loadData();
                    },
                },
            ]
        );
    };

    if (deposits.length === 0) {
        return (
            <View style={styles.container}>
                <AppHeader showBack />
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Ionicons name="arrow-back" size={24} color="#0F172A" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Fixed Deposits</Text>
                    <View style={styles.placeholder} />
                </View>

                <View style={styles.emptyContainer}>
                    <View style={styles.emptyIconContainer}>
                        <Ionicons name="wallet-outline" size={80} color="#3B82F6" />
                    </View>
                    <Text style={styles.emptyTitle}>No Deposits Yet</Text>
                    <Text style={styles.emptySubtitle}>
                        Start tracking your fixed{'\n'}deposits today
                    </Text>
                    <TouchableOpacity
                        style={styles.addButton}
                        onPress={() => navigation.navigate('AddfixedDeposit', { onSuccess: loadData })}
                    >
                        <Ionicons name="add-circle" size={24} color="#fff" />
                        <Text style={styles.addButtonText}>Add Deposit</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <AppHeader showBack />
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={24} color="#0F172A" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Fixed Deposits</Text>
                <TouchableOpacity onPress={() => navigation.navigate('AddfixedDeposit', { onSuccess: loadData })}>
                    <Ionicons name="add-circle-outline" size={24} color="#3B82F6" />
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                {/* Summary Card */}
                <View style={styles.summaryCard}>
                    <View style={styles.summaryHeader}>
                        <Text style={styles.summaryLabel}>OVERALL</Text>
                        <Text style={styles.overallAmount}>{formatCurrency(summary.total_invested + summary.total_current_return)}</Text>
                    </View>

                    <View style={styles.summaryRow}>
                        <View style={styles.summaryItem}>
                            <Text style={styles.summaryItemLabel}>Invested</Text>
                            <Text style={styles.summaryItemValue}>{formatCurrency(summary.total_invested)}</Text>
                        </View>
                        <View style={styles.summaryDivider} />
                        <View style={styles.summaryItem}>
                            <Text style={styles.summaryItemLabel}>Current Return</Text>
                            <Text style={[styles.summaryItemValue, styles.returnGreen]}>
                                {formatCurrency(summary.total_current_return)}
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Deposits List */}
                <View style={styles.listContainer}>
                    <Text style={styles.listTitle}>My Deposits</Text>
                    {deposits.map((deposit) => (
                        <TouchableOpacity
                            key={deposit.id}
                            style={styles.depositCard}
                            onPress={() => navigation.navigate('AddFDInvestment', { depositId: deposit.id, onSuccess: loadData })}
                        >
                            <View style={styles.depositHeader}>
                                <View style={styles.depositTitleContainer}>
                                    <View style={styles.depositIcon}>
                                        <Ionicons name="business-outline" size={24} color="#3B82F6" />
                                    </View>
                                    <View>
                                        <Text style={styles.bankName}>{deposit.organization_name}</Text>
                                        <Text style={styles.interestRate}>Interest rate: {deposit.annual_rate.toFixed(2)}%</Text>
                                    </View>
                                </View>
                                <TouchableOpacity onPress={() => handleDelete(deposit.id)}>
                                    <Ionicons name="trash-outline" size={20} color="#EF4444" />
                                </TouchableOpacity>
                            </View>

                            <View style={styles.depositDetails}>
                                <View style={styles.detailItem}>
                                    <Text style={styles.detailLabel}>Invested</Text>
                                    <Text style={styles.detailValue}>{formatFullCurrency(deposit.investment_amount)}</Text>
                                </View>
                                <View style={styles.detailItem}>
                                    <Text style={styles.detailLabel}>Maturity</Text>
                                    <Text style={styles.detailValue}>
                                        {calculateMaturityDate(deposit.start_date, deposit.tenure_years, deposit.tenure_months, deposit.tenure_days)}
                                    </Text>
                                </View>
                                <View style={styles.detailItem}>
                                    <Text style={styles.detailLabel}>Tenure</Text>
                                    <Text style={styles.detailValue}>
                                        {formatTenure(deposit.tenure_years, deposit.tenure_months, deposit.tenure_days)}
                                    </Text>
                                </View>
                            </View>

                            <View style={styles.returnsBadge}>
                                <Text style={styles.returnsLabel}>Current Returns</Text>
                                <Text style={styles.returnsValue}>{formatFullCurrency(deposit.currentReturns)}</Text>
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8FAFC',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 15,
        backgroundColor: '#fff',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#0F172A',
    },
    placeholder: {
        width: 24,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 40,
    },
    emptyIconContainer: {
        width: 140,
        height: 140,
        borderRadius: 70,
        backgroundColor: '#EFF6FF',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
    },
    emptyTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#0F172A',
        marginBottom: 8,
    },
    emptySubtitle: {
        fontSize: 14,
        color: '#64748B',
        textAlign: 'center',
        lineHeight: 20,
        marginBottom: 32,
    },
    addButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#3B82F6',
        paddingHorizontal: 24,
        paddingVertical: 14,
        borderRadius: 12,
        gap: 8,
    },
    addButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    scrollView: {
        flex: 1,
    },
    summaryCard: {
        backgroundColor: '#0F172A',
        margin: 16,
        padding: 20,
        borderRadius: 12,
    },
    summaryHeader: {
        marginBottom: 20,
    },
    summaryLabel: {
        fontSize: 11,
        color: '#94A3B8',
        letterSpacing: 1,
        marginBottom: 8,
    },
    overallAmount: {
        fontSize: 36,
        fontWeight: 'bold',
        color: '#fff',
    },
    summaryRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    summaryItem: {
        flex: 1,
    },
    summaryDivider: {
        width: 1,
        height: 40,
        backgroundColor: '#334155',
        marginHorizontal: 16,
    },
    summaryItemLabel: {
        fontSize: 12,
        color: '#94A3B8',
        marginBottom: 4,
    },
    summaryItemValue: {
        fontSize: 18,
        fontWeight: '600',
        color: '#fff',
    },
    returnGreen: {
        color: '#10B981',
    },
    listContainer: {
        padding: 16,
    },
    listTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#0F172A',
        marginBottom: 12,
    },
    depositCard: {
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
    },
    depositHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    depositTitleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        flex: 1,
    },
    depositIcon: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#EFF6FF',
        justifyContent: 'center',
        alignItems: 'center',
    },
    bankName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#0F172A',
    },
    interestRate: {
        fontSize: 12,
        color: '#10B981',
        marginTop: 2,
    },
    depositDetails: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 12,
    },
    detailItem: {
        flex: 1,
    },
    detailLabel: {
        fontSize: 11,
        color: '#64748B',
        marginBottom: 4,
    },
    detailValue: {
        fontSize: 14,
        fontWeight: '600',
        color: '#0F172A',
    },
    returnsBadge: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: '#F1F5F9',
    },
    returnsLabel: {
        fontSize: 12,
        color: '#64748B',
    },
    returnsValue: {
        fontSize: 14,
        fontWeight: '600',
        color: '#10B981',
    },
});