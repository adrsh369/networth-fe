import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function ExpensesScreen() {
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Expenses</Text>
      </View>

      {/* Coming Soon Content */}
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Ionicons name="construct-outline" size={80} color="#3B82F6" />
        </View>
        
        <Text style={styles.title}>Coming Soon</Text>
        <Text style={styles.subtitle}>
          We're working hard to bring you{'\n'}expense tracking feature
        </Text>

        {/* Feature Cards */}
        <View style={styles.featuresContainer}>
          <View style={styles.featureCard}>
            <Ionicons name="analytics-outline" size={32} color="#3B82F6" />
            <Text style={styles.featureText}>Track Expenses</Text>
          </View>
          
          <View style={styles.featureCard}>
            <Ionicons name="pie-chart-outline" size={32} color="#3B82F6" />
            <Text style={styles.featureText}>View Analytics</Text>
          </View>
          
          <View style={styles.featureCard}>
            <Ionicons name="calendar-outline" size={32} color="#3B82F6" />
            <Text style={styles.featureText}>Monthly Reports</Text>
          </View>
        </View>

        <Text style={styles.stayTuned}>Stay tuned for updates!</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 15,
    backgroundColor: '#fff',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0F172A',
    marginTop: -30,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  iconContainer: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#0F172A',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 40,
  },
  featuresContainer: {
    flexDirection: 'row',
    gap: 15,
    marginBottom: 40,
  },
  featureCard: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 110,
  },
  featureText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#0F172A',
    marginTop: 10,
    textAlign: 'center',
  },
  stayTuned: {
    fontSize: 14,
    color: '#94A3B8',
    fontStyle: 'italic',
  },
});