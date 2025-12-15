create FDScreen and ADDFDInvestment Screen, same layout as Mutual Fund. Also FOr FD Make proper Validation for each field. Also Calculate proper like IF I have invest 1 lakhs rupees in 01 March 2025 and today is 15 Dec 2025 with 7 % return Annually then Current Return will be ₹5,542. Save all data in SQL. Create new FIle For FD for db

FDScreen:

Layout Str:

OVERALL
1.06L

Invested        Current Return
1.0L            5.56K

My Deposit:

Icon Bank Name
     Interest rate: 7.00%

 Invested                  Maturity          Tenure
 rupee Symbol 100,000      01 Mar 2026       1y


ADDFDInvestment :

title Add Fixed Deposit Informa..

Organization Name (label)

Investment Amount (label): (make Validation proper)
Annual Rate of Interest (label):  in %
Start Date(label):  (should be Calender) and Format after selection is DD/MM/YYYY in Input

Tenure (label):
in Tenure then three input in one row: Year Months Days

Fixed Deposit Type (label):  Dropdown:
Cumulative, Payout and tax Saving

based on Fixed Deposit Type, Interest Compounding Frequency (label) Dropdown:
Cumulation: Quarterlt, Monthly, Daily, half Year, Yearly
Payout: monthly, Quarter, Half Year, Yearly
tax Saving: At maturity, monthly, Quarter, Half Year, Yearly