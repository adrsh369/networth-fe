import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Alert } from 'react-native';
import { useState, useEffect, useFocusEffect, useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { getMutualFundSummary, getAllMutualFunds, deleteMutualFund } from '../../../database/mutualFundDB';

export default function MutualFundScreen() {
    const navigation = useNavigation();
    const [summary, setSummary] = useState({ total_current: 0, total_invested: 0, total_funds: 0 });
    const [investments, setInvestments] = useState([]);

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            loadData();
        });

        return unsubscribe;
    }, [navigation]);

    const loadData = async () => {
        const summaryData = await getMutualFundSummary();
        const investmentsData = await getAllMutualFunds();
        setSummary(summaryData);
        setInvestments(investmentsData);
    };

    const formatCurrency = (amount) => {
        return `₹${parseFloat(amount || 0).toLocaleString('en-IN')}`;
    };

    const calculateReturns = () => {
        const returns = summary.total_current - summary.total_invested;
        const percentage = summary.total_invested > 0
            ? ((returns / summary.total_invested) * 100).toFixed(2)
            : 0;
        return { returns, percentage };
    };

    const handleDelete = (id) => {
        Alert.alert(
            'Delete Investment',
            'Are you sure you want to delete this investment?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        await deleteMutualFund(id);
                        loadData();
                    },
                },
            ]
        );
    };

    const { returns, percentage } = calculateReturns();

    if (investments.length === 0) {
        return (
            <View style={styles.container}>
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Ionicons name="arrow-back" size={24} color="#0F172A" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Mutual Funds</Text>
                    <View style={styles.placeholder} />
                </View>

                {/* Empty State */}
                <View style={styles.emptyContainer}>
                    <View style={styles.emptyIconContainer}>
                        <Ionicons name="analytics-outline" size={80} color="#3B82F6" />
                    </View>
                    <Text style={styles.emptyTitle}>No Investments Yet</Text>
                    <Text style={styles.emptySubtitle}>
                        Start tracking your mutual fund{'\n'}investments today
                    </Text>
                    <TouchableOpacity
                        style={styles.addButton}
                        onPress={() => navigation.navigate('AddMutualFund', { onSuccess: loadData })}
                    >
                        <Ionicons name="add-circle" size={24} color="#fff" />
                        <Text style={styles.addButtonText}>Add Investment</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={24} color="#0F172A" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Mutual Funds</Text>
                <TouchableOpacity onPress={() => navigation.navigate('AddMutualFund', { onSuccess: loadData })}>
                    <Ionicons name="add-circle-outline" size={24} color="#3B82F6" />
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                {/* Summary Card */}
                <View style={styles.summaryCard}>
                    <Text style={styles.summaryLabel}>Current Value</Text>
                    <Text style={styles.summaryAmount}>{formatCurrency(summary.total_current)}</Text>

                    <View style={styles.summaryRow}>
                        <View style={styles.summaryItem}>
                            <Text style={styles.summaryItemLabel}>Invested</Text>
                            <Text style={styles.summaryItemValue}>{formatCurrency(summary.total_invested)}</Text>
                        </View>
                        <View style={styles.summaryDivider} />
                        <View style={styles.summaryItem}>
                            <Text style={styles.summaryItemLabel}>Total Funds</Text>
                            <Text style={styles.summaryItemValue}>{summary.total_funds || 0}</Text>
                        </View>
                    </View>

                    {/* Returns Card */}
                    <View style={[styles.returnsCard, returns >= 0 ? styles.returnsPositive : styles.returnsNegative]}>
                        <View style={styles.returnsRow}>
                            <View>
                                <Text style={styles.returnsLabel}>Total Returns</Text>
                                <Text style={styles.returnsAmount}>{formatCurrency(returns)}</Text>
                            </View>
                            <View style={styles.percentageBadge}>
                                <Ionicons
                                    name={returns >= 0 ? 'trending-up' : 'trending-down'}
                                    size={16}
                                    color={returns >= 0 ? '#10B981' : '#EF4444'}
                                />
                                <Text style={[styles.percentageText, returns >= 0 ? styles.positiveText : styles.negativeText]}>
                                    {percentage}%
                                </Text>
                            </View>
                        </View>
                    </View>
                </View>

                {/* Investments List */}
                <View style={styles.listContainer}>
                    <Text style={styles.listTitle}>Your Investments</Text>
                    {investments.map((investment, index) => (
                        <TouchableOpacity
                            key={investment.id}
                            style={styles.investmentCard}
                            onPress={() => navigation.navigate('AddMutualFund', { investmentId: investment.id, onSuccess: loadData })}
                        >
                            <View style={styles.investmentHeader}>
                                <View style={styles.investmentTypeContainer}>
                                    <View style={styles.investmentIcon}>
                                        <Ionicons
                                            name={investment.investment_type === 'SIP' ? 'timer-outline' : 'cash-outline'}
                                            size={24}
                                            color="#3B82F6"
                                        />
                                    </View>
                                    <View>
                                        <Text style={styles.investmentType}>{investment.investment_type}</Text>
                                        {investment.investment_type === 'SIP' && investment.frequency_type && (
                                            <Text style={styles.investmentFrequency}>{investment.frequency_type}</Text>
                                        )}
                                    </View>
                                </View>
                                <TouchableOpacity onPress={() => handleDelete(investment.id)}>
                                    <Ionicons name="trash-outline" size={20} color="#EF4444" />
                                </TouchableOpacity>
                            </View>

                            <View style={styles.investmentDetails}>
                                <View style={styles.detailItem}>
                                    <Text style={styles.detailLabel}>Current Value</Text>
                                    <Text style={styles.detailValue}>{formatCurrency(investment.current_value)}</Text>
                                </View>
                                <View style={styles.detailItem}>
                                    <Text style={styles.detailLabel}>Invested</Text>
                                    <Text style={styles.detailValue}>{formatCurrency(investment.invested_value)}</Text>
                                </View>

                                {investment.total_funds !== null && investment.total_funds !== undefined && (
                                    <View style={styles.detailItem}>
                                        <Text style={styles.detailLabel}>Total Funds</Text>
                                        <Text style={styles.detailValue}> {investment.total_funds || 0}</Text>
                                    </View>
                                )}
                            </View>

                            {investment.investment_type === 'SIP' && investment.sip_amount && (
                                <View style={styles.sipInfo}>
                                    <Text style={styles.sipLabel}>SIP Amount: {formatCurrency(investment.sip_amount)}</Text>
                                    {investment.sip_date && (
                                        <Text style={styles.sipDate}>Date: {investment.sip_date}</Text>
                                    )}
                                </View>
                            )}
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
        paddingTop: 50,
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
    summaryLabel: {
        fontSize: 13,
        color: '#fff',
        marginBottom: 8,
    },
    summaryAmount: {
        fontSize: 36,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 20,
    },
    summaryRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    summaryItem: {
        flex: 1,
    },
    summaryDivider: {
        width: 1,
        height: 40,
        backgroundColor: '#E2E8F0',
        marginHorizontal: 16,
    },
    summaryItemLabel: {
        fontSize: 12,
        color: '#fff',
        marginBottom: 4,
    },
    summaryItemValue: {
        fontSize: 18,
        fontWeight: '600',
        color: '#fff',
    },
    returnsCard: {
        padding: 12,
        borderRadius: 10,
    },
    returnsPositive: {
        backgroundColor: '#F0FDF4',
    },
    returnsNegative: {
        backgroundColor: '#FEF2F2',
    },
    returnsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    returnsLabel: {
        fontSize: 12,
        color: '#64748B',
        marginBottom: 4,
    },
    returnsAmount: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#0F172A',
    },
    percentageBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    percentageText: {
        fontSize: 16,
        fontWeight: '600',
    },
    positiveText: {
        color: '#10B981',
    },
    negativeText: {
        color: '#EF4444',
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
    investmentCard: {
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
    },
    investmentHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    investmentTypeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    investmentIcon: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#EFF6FF',
        justifyContent: 'center',
        alignItems: 'center',
    },
    investmentType: {
        fontSize: 16,
        fontWeight: '600',
        color: '#0F172A',
    },
    investmentFrequency: {
        fontSize: 12,
        color: '#64748B',
        marginTop: 2,
    },
    investmentDetails: {
        flexDirection: 'row',
        gap: 16,
        marginBottom: 12,
    },
    detailItem: {
        flex: 1,
    },
    detailLabel: {
        fontSize: 12,
        color: '#64748B',
        marginBottom: 4,
    },
    detailValue: {
        fontSize: 16,
        fontWeight: '600',
        color: '#0F172A',
    },
    sipInfo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: '#F1F5F9',
    },
    sipLabel: {
        fontSize: 12,
        color: '#64748B',
    },
    sipDate: {
        fontSize: 12,
        color: '#64748B',
    },
});