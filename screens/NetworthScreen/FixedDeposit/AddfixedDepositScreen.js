import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Alert, Platform } from 'react-native';
import { useState, useEffect } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import { insertFixedDeposit, updateFixedDeposit, getFixedDepositById } from '../../../database/fixedDepositDB';
import AppHeader from '../../../components/AppHeader/AppHeader';

export default function AddfixedDepositScreen() {
    const navigation = useNavigation();
    const route = useRoute();
    const { depositId, onSuccess } = route.params || {};

    const [organizationName, setOrganizationName] = useState('');
    const [investmentAmount, setInvestmentAmount] = useState('');
    const [annualRate, setAnnualRate] = useState('');
    const [startDate, setStartDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [tenureYears, setTenureYears] = useState('');
    const [tenureMonths, setTenureMonths] = useState('');
    const [tenureDays, setTenureDays] = useState('');
    const [depositType, setDepositType] = useState('Cumulative');
    const [compoundingFrequency, setCompoundingFrequency] = useState('Quarterly');

    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (depositId) {
            loadDeposit();
        }
    }, [depositId]);

    const loadDeposit = async () => {
        const deposit = await getFixedDepositById(depositId);
        if (deposit) {
            setOrganizationName(deposit.organization_name);
            setInvestmentAmount(deposit.investment_amount.toString());
            setAnnualRate(deposit.annual_rate.toString());
            setStartDate(new Date(deposit.start_date));
            setTenureYears(deposit.tenure_years.toString());
            setTenureMonths(deposit.tenure_months.toString());
            setTenureDays(deposit.tenure_days.toString());
            setDepositType(deposit.deposit_type);
            setCompoundingFrequency(deposit.compounding_frequency);
        }
    };

    const getFrequencyOptions = () => {
        if (depositType === 'Cumulative') {
            return ['Quarterly', 'Monthly', 'Daily', 'Half Yearly', 'Yearly'];
        } else if (depositType === 'Payout') {
            return ['Monthly', 'Quarterly', 'Half Yearly', 'Yearly'];
        } else if (depositType === 'Tax Saving') {
            return ['At Maturity', 'Monthly', 'Quarterly', 'Half Yearly', 'Yearly'];
        }
        return ['Quarterly'];
    };

    const validateFields = () => {
        const newErrors = {};

        // Organization Name
        if (!organizationName.trim()) {
            newErrors.organizationName = 'Organization name is required';
        } else if (organizationName.trim().length < 2) {
            newErrors.organizationName = 'Name must be at least 2 characters';
        }

        // Investment Amount
        if (!investmentAmount.trim()) {
            newErrors.investmentAmount = 'Investment amount is required';
        } else {
            const amount = parseFloat(investmentAmount);
            if (isNaN(amount) || amount <= 0) {
                newErrors.investmentAmount = 'Enter a valid amount greater than 0';
            } else if (amount < 1000) {
                newErrors.investmentAmount = 'Minimum investment amount is ₹1,000';
            }
        }

        // Annual Rate
        if (!annualRate.trim()) {
            newErrors.annualRate = 'Interest rate is required';
        } else {
            const rate = parseFloat(annualRate);
            if (isNaN(rate) || rate <= 0) {
                newErrors.annualRate = 'Enter a valid interest rate';
            } else if (rate > 20) {
                newErrors.annualRate = 'Interest rate seems too high (max 20%)';
            }
        }

        // Start Date
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const selectedDate = new Date(startDate);
        selectedDate.setHours(0, 0, 0, 0);

        if (selectedDate > today) {
            newErrors.startDate = 'Start date cannot be in the future';
        }

        // Tenure Validation
        const years = parseInt(tenureYears) || 0;
        const months = parseInt(tenureMonths) || 0;
        const days = parseInt(tenureDays) || 0;

        if (years === 0 && months === 0 && days === 0) {
            newErrors.tenure = 'Tenure must be greater than 0';
        } else {
            if (years < 0 || years > 30) {
                newErrors.tenureYears = 'Years must be between 0-30';
            }
            if (months < 0 || months > 11) {
                newErrors.tenureMonths = 'Months must be between 0-11';
            }
            if (days < 0 || days > 365) {
                newErrors.tenureDays = 'Days must be between 0-365';
            }

            // Check total tenure is reasonable
            const totalDays = years * 365 + months * 30 + days;
            if (totalDays < 7) {
                newErrors.tenure = 'Minimum tenure is 7 days';
            } else if (totalDays > 10950) { // 30 years
                newErrors.tenure = 'Maximum tenure is 30 years';
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSave = async () => {
        if (!validateFields()) {
            Alert.alert('Validation Error', 'Please fix all errors before saving');
            return;
        }

        try {
            const data = {
                organizationName: organizationName.trim(),
                investmentAmount: parseFloat(investmentAmount),
                annualRate: parseFloat(annualRate),
                startDate: startDate.toISOString(),
                tenureYears: parseInt(tenureYears) || 0,
                tenureMonths: parseInt(tenureMonths) || 0,
                tenureDays: parseInt(tenureDays) || 0,
                depositType,
                compoundingFrequency,
            };

            if (depositId) {
                await updateFixedDeposit(depositId, data);
                Alert.alert('Success', 'Fixed deposit updated successfully');
            } else {
                await insertFixedDeposit(data);
                Alert.alert('Success', 'Fixed deposit added successfully');
            }

            if (onSuccess) onSuccess();
            navigation.goBack();
        } catch (error) {
            console.error('Save Error:', error);
            Alert.alert('Error', 'Failed to save fixed deposit');
        }
    };

    const formatDateDisplay = (date) => {
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    const onDateChange = (event, selectedDate) => {
        setShowDatePicker(Platform.OS === 'ios');
        if (selectedDate) {
            setStartDate(selectedDate);
        }
    };

    return (
        <View style={styles.container}>
            {/* <AppHeader showBack /> */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={24} color="#0F172A" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Add Fixed Deposit Information</Text>
                <View style={styles.placeholder} />
            </View>

            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                <View style={styles.formContainer}>
                    {/* Organization Name */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Organization Name</Text>
                        <TextInput
                            style={[styles.input, errors.organizationName && styles.inputError]}
                            value={organizationName}
                            onChangeText={(text) => {
                                setOrganizationName(text);
                                if (errors.organizationName) {
                                    setErrors({ ...errors, organizationName: null });
                                }
                            }}
                            placeholder="Enter bank or organization name"
                            placeholderTextColor="#94A3B8"
                        />
                        {errors.organizationName && (
                            <Text style={styles.errorText}>{errors.organizationName}</Text>
                        )}
                    </View>

                    {/* Investment Amount */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Investment Amount</Text>
                        <View style={[styles.inputWithIcon, errors.investmentAmount && styles.inputError]}>
                            <Text style={styles.rupeeSymbol}>₹</Text>
                            <TextInput
                                style={styles.inputWithIconText}
                                value={investmentAmount}
                                onChangeText={(text) => {
                                    setInvestmentAmount(text.replace(/[^0-9.]/g, ''));
                                    if (errors.investmentAmount) {
                                        setErrors({ ...errors, investmentAmount: null });
                                    }
                                }}
                                placeholder="Enter amount"
                                placeholderTextColor="#94A3B8"
                                keyboardType="decimal-pad"
                            />
                        </View>
                        {errors.investmentAmount && (
                            <Text style={styles.errorText}>{errors.investmentAmount}</Text>
                        )}
                    </View>

                    {/* Annual Rate */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Annual Rate of Interest</Text>
                        <View style={[styles.inputWithIcon, errors.annualRate && styles.inputError]}>
                            <TextInput
                                style={styles.inputWithIconText}
                                value={annualRate}
                                onChangeText={(text) => {
                                    setAnnualRate(text.replace(/[^0-9.]/g, ''));
                                    if (errors.annualRate) {
                                        setErrors({ ...errors, annualRate: null });
                                    }
                                }}
                                placeholder="Enter rate"
                                placeholderTextColor="#94A3B8"
                                keyboardType="decimal-pad"
                            />
                            <Text style={styles.percentSymbol}>%</Text>
                        </View>
                        {errors.annualRate && (
                            <Text style={styles.errorText}>{errors.annualRate}</Text>
                        )}
                    </View>

                    {/* Start Date */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Start Date</Text>
                        <TouchableOpacity
                            style={[styles.dateInput, errors.startDate && styles.inputError]}
                            onPress={() => setShowDatePicker(true)}
                        >
                            <Text style={styles.dateText}>{formatDateDisplay(startDate)}</Text>
                            <Ionicons name="calendar-outline" size={20} color="#64748B" />
                        </TouchableOpacity>
                        {errors.startDate && (
                            <Text style={styles.errorText}>{errors.startDate}</Text>
                        )}
                        {showDatePicker && (
                            <DateTimePicker
                                value={startDate}
                                mode="date"
                                display="default"
                                onChange={onDateChange}
                                maximumDate={new Date()}
                            />
                        )}
                    </View>

                    {/* Tenure */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Tenure</Text>
                        <View style={styles.tenureRow}>
                            <View style={styles.tenureInput}>
                                <TextInput
                                    style={[styles.tenureField, errors.tenureYears && styles.inputError]}
                                    value={tenureYears}
                                    onChangeText={(text) => {
                                        setTenureYears(text.replace(/[^0-9]/g, ''));
                                        if (errors.tenureYears || errors.tenure) {
                                            setErrors({ ...errors, tenureYears: null, tenure: null });
                                        }
                                    }}
                                    placeholder="0"
                                    placeholderTextColor="#94A3B8"
                                    keyboardType="number-pad"
                                    maxLength={2}
                                />
                                <Text style={styles.tenureLabel}>Years</Text>
                            </View>
                            <View style={styles.tenureInput}>
                                <TextInput
                                    style={[styles.tenureField, errors.tenureMonths && styles.inputError]}
                                    value={tenureMonths}
                                    onChangeText={(text) => {
                                        setTenureMonths(text.replace(/[^0-9]/g, ''));
                                        if (errors.tenureMonths || errors.tenure) {
                                            setErrors({ ...errors, tenureMonths: null, tenure: null });
                                        }
                                    }}
                                    placeholder="0"
                                    placeholderTextColor="#94A3B8"
                                    keyboardType="number-pad"
                                    maxLength={2}
                                />
                                <Text style={styles.tenureLabel}>Months</Text>
                            </View>
                            <View style={styles.tenureInput}>
                                <TextInput
                                    style={[styles.tenureField, errors.tenureDays && styles.inputError]}
                                    value={tenureDays}
                                    onChangeText={(text) => {
                                        setTenureDays(text.replace(/[^0-9]/g, ''));
                                        if (errors.tenureDays || errors.tenure) {
                                            setErrors({ ...errors, tenureDays: null, tenure: null });
                                        }
                                    }}
                                    placeholder="0"
                                    placeholderTextColor="#94A3B8"
                                    keyboardType="number-pad"
                                    maxLength={3}
                                />
                                <Text style={styles.tenureLabel}>Days</Text>
                            </View>
                        </View>
                        {(errors.tenure || errors.tenureYears || errors.tenureMonths || errors.tenureDays) && (
                            <Text style={styles.errorText}>
                                {errors.tenure || errors.tenureYears || errors.tenureMonths || errors.tenureDays}
                            </Text>
                        )}
                    </View>

                    {/* Fixed Deposit Type */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Fixed Deposit Type</Text>
                        <View style={styles.pickerContainer}>
                            <Picker
                                selectedValue={depositType}
                                onValueChange={(value) => {
                                    setDepositType(value);
                                    const options = getFrequencyOptions();
                                    if (!options.includes(compoundingFrequency)) {
                                        setCompoundingFrequency(options[0]);
                                    }
                                }}
                                style={styles.picker}
                            >
                                <Picker.Item label="Cumulative" value="Cumulative" />
                                <Picker.Item label="Payout" value="Payout" />
                                <Picker.Item label="Tax Saving" value="Tax Saving" />
                            </Picker>
                        </View>
                    </View>

                    {/* Interest Compounding Frequency */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Interest Compounding Frequency</Text>
                        <View style={styles.pickerContainer}>
                            <Picker
                                selectedValue={compoundingFrequency}
                                onValueChange={setCompoundingFrequency}
                                style={styles.picker}
                            >
                                {getFrequencyOptions().map((option) => (
                                    <Picker.Item key={option} label={option} value={option} />
                                ))}
                            </Picker>
                        </View>
                    </View>

                    {/* Save Button */}
                    <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                        <Text style={styles.saveButtonText}>
                            {depositId ? 'Update Deposit' : 'Save Deposit'}
                        </Text>
                    </TouchableOpacity>
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
    scrollView: {
        flex: 1,
    },
    formContainer: {
        padding: 16,
    },
    inputGroup: {
        marginBottom: 20,
    },
    label: {
        fontSize: 14,
        fontWeight: '500',
        color: '#0F172A',
        marginBottom: 8,
    },
    input: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#E2E8F0',
        borderRadius: 10,
        padding: 14,
        fontSize: 15,
        color: '#0F172A',
    },
    inputError: {
        borderColor: '#EF4444',
    },
    inputWithIcon: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#E2E8F0',
        borderRadius: 10,
        paddingHorizontal: 14,
    },
    rupeeSymbol: {
        fontSize: 16,
        fontWeight: '600',
        color: '#64748B',
        marginRight: 8,
    },
    percentSymbol: {
        fontSize: 16,
        fontWeight: '600',
        color: '#64748B',
        marginLeft: 8,
    },
    inputWithIconText: {
        flex: 1,
        padding: 14,
        fontSize: 15,
        color: '#0F172A',
    },
    dateInput: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#E2E8F0',
        borderRadius: 10,
        padding: 14,
    },
    dateText: {
        fontSize: 15,
        color: '#0F172A',
    },
    tenureRow: {
        flexDirection: 'row',
        gap: 10,
    },
    tenureInput: {
        flex: 1,
    },
    tenureField: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#E2E8F0',
        borderRadius: 10,
        padding: 14,
        fontSize: 15,
        color: '#0F172A',
        textAlign: 'center',
        marginBottom: 6,
    },
    tenureLabel: {
        fontSize: 12,
        color: '#64748B',
        textAlign: 'center',
    },
    pickerContainer: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#E2E8F0',
        borderRadius: 10,
        overflow: 'hidden',
    },
    picker: {
        height: 50,
    },
    errorText: {
        fontSize: 12,
        color: '#EF4444',
        marginTop: 4,
    },
    saveButton: {
        backgroundColor: '#3B82F6',
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 10,
        marginBottom: 20,
    },
    saveButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
});