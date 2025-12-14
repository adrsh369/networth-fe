import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Alert } from 'react-native';
import { useState, useEffect } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { insertMutualFund, getMutualFundById, updateMutualFund } from '../../../database/mutualFundDB';

export default function AddMutualFundScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const investmentId = route.params?.investmentId;

  const [investmentType, setInvestmentType] = useState('SIP');
  const [currentValue, setCurrentValue] = useState('');
  const [investedValue, setInvestedValue] = useState('');
  const [totalFunds, setTotalFunds] = useState('');
  const [frequencyType, setFrequencyType] = useState('Monthly');
  const [sipAmount, setSipAmount] = useState('');
  const [sipDate, setSipDate] = useState('');

  useEffect(() => {
    if (investmentId) {
      loadInvestment();
    }
  }, [investmentId]);

  const loadInvestment = async () => {
    const investment = await getMutualFundById(investmentId);
    if (investment) {
      setInvestmentType(investment.investment_type);
      setCurrentValue(investment.current_value.toString());
      setInvestedValue(investment.invested_value.toString());
      setTotalFunds(investment.total_funds?.toString() || '');
      setFrequencyType(investment.frequency_type || 'Monthly');
      setSipAmount(investment.sip_amount?.toString() || '');
      setSipDate(investment.sip_date?.toString() || '');
    }
  };

  const frequencies = ['Daily', 'Weekly', 'Monthly', 'Annually'];

  const handleSubmit = async () => {
    if (!currentValue || !investedValue) {
      Alert.alert('Error', 'Please fill all required fields');
      return;
    }

    if (investmentType === 'SIP' && (!sipAmount || !sipDate)) {
      Alert.alert('Error', 'Please fill SIP details');
      return;
    }

    const data = {
      investmentType,
      currentValue: parseFloat(currentValue),
      investedValue: parseFloat(investedValue),
      totalFunds: parseInt(totalFunds) || 0,
      frequencyType: investmentType === 'SIP' ? frequencyType : null,
      sipAmount: investmentType === 'SIP' ? parseFloat(sipAmount) : null,
      sipDate: investmentType === 'SIP' ? parseInt(sipDate) : null,
    };

    try {
      if (investmentId) {
        await updateMutualFund(investmentId, data);
        Alert.alert('Success', 'Investment updated successfully', [
          { 
            text: 'OK', 
            onPress: () => {
              navigation.goBack();
            }
          }
        ]);
      } else {
        await insertMutualFund(data);
        Alert.alert('Success', 'Investment added successfully', [
          { 
            text: 'OK', 
            onPress: () => {
              navigation.goBack();
            }
          }
        ]);
      }
    } catch (error) {
      console.log('Error saving investment:', error);
      Alert.alert('Error', `Failed to save investment: ${error.message}`);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#0F172A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {investmentId ? 'Edit Investment' : 'Add Investment'}
        </Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Investment Type Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Investment Type</Text>
          <View style={styles.radioGroup}>
            <TouchableOpacity
              style={[styles.radioButton, investmentType === 'SIP' && styles.radioButtonActive]}
              onPress={() => setInvestmentType('SIP')}
            >
              <View style={styles.radioCircle}>
                {investmentType === 'SIP' && <View style={styles.radioCircleInner} />}
              </View>
              <Text style={[styles.radioText, investmentType === 'SIP' && styles.radioTextActive]}>
                SIP
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.radioButton, investmentType === 'Lumpsum' && styles.radioButtonActive]}
              onPress={() => setInvestmentType('Lumpsum')}
            >
              <View style={styles.radioCircle}>
                {investmentType === 'Lumpsum' && <View style={styles.radioCircleInner} />}
              </View>
              <Text style={[styles.radioText, investmentType === 'Lumpsum' && styles.radioTextActive]}>
                Lumpsum
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Common Fields */}
        <View style={styles.section}>
          <Text style={styles.label}>Current Value *</Text>
          <View style={styles.inputContainer}>
            <Text style={styles.inputPrefix}>₹</Text>
            <TextInput
              style={styles.input}
              value={currentValue}
              onChangeText={setCurrentValue}
              placeholder="Enter current value"
              keyboardType="numeric"
              placeholderTextColor="#94A3B8"
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Invested Value *</Text>
          <View style={styles.inputContainer}>
            <Text style={styles.inputPrefix}>₹</Text>
            <TextInput
              style={styles.input}
              value={investedValue}
              onChangeText={setInvestedValue}
              placeholder="Enter invested value"
              keyboardType="numeric"
              placeholderTextColor="#94A3B8"
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Total Funds</Text>
          <TextInput
            style={styles.inputField}
            value={totalFunds}
            onChangeText={setTotalFunds}
            placeholder="Enter number of funds"
            keyboardType="numeric"
            placeholderTextColor="#94A3B8"
          />
        </View>

        {/* SIP Specific Fields */}
        {investmentType === 'SIP' && (
          <>
            <View style={styles.section}>
              <Text style={styles.label}>Frequency Type *</Text>
              <View style={styles.frequencyGrid}>
                {frequencies.map((freq) => (
                  <TouchableOpacity
                    key={freq}
                    style={[
                      styles.frequencyButton,
                      frequencyType === freq && styles.frequencyButtonActive,
                    ]}
                    onPress={() => setFrequencyType(freq)}
                  >
                    <Text
                      style={[
                        styles.frequencyText,
                        frequencyType === freq && styles.frequencyTextActive,
                      ]}
                    >
                      {freq}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.label}>{frequencyType} SIP Amount *</Text>
              <View style={styles.inputContainer}>
                <Text style={styles.inputPrefix}>₹</Text>
                <TextInput
                  style={styles.input}
                  value={sipAmount}
                  onChangeText={setSipAmount}
                  placeholder="Enter SIP amount"
                  keyboardType="numeric"
                  placeholderTextColor="#94A3B8"
                />
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.label}>{frequencyType} SIP Date *</Text>
              <TextInput
                style={styles.inputField}
                value={sipDate}
                onChangeText={setSipDate}
                placeholder="Enter date (1-31)"
                keyboardType="numeric"
                placeholderTextColor="#94A3B8"
              />
            </View>
          </>
        )}

        {/* Submit Button */}
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>
            {investmentId ? 'Update Investment' : 'Add Investment'}
          </Text>
        </TouchableOpacity>
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
  scrollView: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 20,
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0F172A',
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#0F172A',
    marginBottom: 8,
  },
  radioGroup: {
    flexDirection: 'row',
    gap: 12,
  },
  radioButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E2E8F0',
    gap: 10,
  },
  radioButtonActive: {
    borderColor: '#3B82F6',
    backgroundColor: '#EFF6FF',
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#CBD5E1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioCircleInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#3B82F6',
  },
  radioText: {
    fontSize: 16,
    color: '#64748B',
  },
  radioTextActive: {
    color: '#3B82F6',
    fontWeight: '600',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 16,
  },
  inputPrefix: {
    fontSize: 16,
    color: '#64748B',
    marginRight: 8,
  },
  input: {
    flex: 1,
    paddingVertical: 14,
    fontSize: 16,
    color: '#0F172A',
  },
  inputField: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#0F172A',
  },
  frequencyGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  frequencyButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  frequencyButtonActive: {
    backgroundColor: '#3B82F6',
    borderColor: '#3B82F6',
  },
  frequencyText: {
    fontSize: 14,
    color: '#64748B',
  },
  frequencyTextActive: {
    color: '#fff',
    fontWeight: '600',
  },
  submitButton: {
    backgroundColor: '#3B82F6',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 30,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});