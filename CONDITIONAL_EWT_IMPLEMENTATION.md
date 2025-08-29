# Conditional EWT Calculation Implementation

## 📋 Overview
Implemented conditional EWT (Expanded Withholding Tax) calculation based on the selected company in the Contract Management system.

## 🏢 EWT Rates by Company

### **FUTURENET AND TECHNOLOGY CORPORATION** 
- **EWT Rate:** 2%
- **Label:** "Less 2% EWT (Auto-calculated)"

### **All Other Companies**
- **EWT Rate:** 5% (Default)
- **Label:** "Less 5% EWT (Auto-calculated)"
- Companies:
  - DITO TELECOMMUNITY CORPORATION
  - CHINA COMMUNICATION SERVICES PHILIPPINES CORPORATION
  - BESTWORLD ENGINEERING SDN BHD

## 🔧 Implementation Details

### Frontend Changes (ContractsNew.tsx)

#### 1. **Dynamic Label**
```tsx
<label className="block text-sm font-medium text-gray-700 mb-1">
    Less {formData.companyAssigned === 'FUTURENET AND TECHNOLOGY CORPORATION' ? '2%' : '5%'} EWT (Auto-calculated)
    <span className="text-blue-600 text-xs ml-1">📊</span>
</label>
```

#### 2. **Conditional Calculation in handleInputChange**
```tsx
// Conditional EWT based on company assigned
// FUTURENET AND TECHNOLOGY CORPORATION uses 2% EWT, others use 5%
const ewtRate = updatedFormData.companyAssigned === 'FUTURENET AND TECHNOLOGY CORPORATION' ? 0.02 : 0.05;
const ewtAmount = netTotalAmount * ewtRate;
```

#### 3. **Recalculation When Company Changes**
```tsx
// Recalculate when company changes (if net total amount exists)
if (name === 'companyAssigned' && updatedFormData.amountRange) {
    const netTotalAmount = parseFloat(updatedFormData.amountRange) || 0;
    
    if (netTotalAmount > 0) {
        // Apply conditional EWT rate based on selected company
        const ewtRate = value === 'FUTURENET AND TECHNOLOGY CORPORATION' ? 0.02 : 0.05;
        const ewtAmount = netTotalAmount * ewtRate;
        // ... recalculate final amount
    }
}
```

#### 4. **Edit Mode Calculation**
Updated `handleEdit` function to use conditional EWT when editing existing contracts.

## 📊 Calculation Examples

### Example 1: FUTURENET AND TECHNOLOGY CORPORATION
- **Net Total Amount:** ₱50,000.00
- **+ 12% VAT:** ₱6,000.00
- **= Contract Amount:** ₱56,000.00
- **- 2% EWT:** ₱1,000.00 (2% of ₱50,000)
- **= Final Amount:** ₱55,000.00

### Example 2: DITO TELECOMMUNITY CORPORATION (Default)
- **Net Total Amount:** ₱50,000.00
- **+ 12% VAT:** ₱6,000.00
- **= Contract Amount:** ₱56,000.00
- **- 5% EWT:** ₱2,500.00 (5% of ₱50,000)
- **= Final Amount:** ₱53,500.00

## 🎯 User Experience

### **Dynamic Interface**
- ✅ **Label Updates:** Shows "Less 2% EWT" or "Less 5% EWT" based on selected company
- ✅ **Real-time Calculation:** EWT updates immediately when company is changed
- ✅ **Automatic Recalculation:** Final amount adjusts automatically
- ✅ **Visual Feedback:** Users can see the exact EWT percentage being applied

### **Workflow**
1. User selects company from dropdown
2. User enters net total amount
3. System automatically calculates:
   - 12% VAT (always the same)
   - Contract Amount (Net + VAT)
   - EWT (2% for FUTURENET, 5% for others)
   - Final Amount (Contract - EWT)

## 🧪 Testing

### API Test Cases
- ✅ **FUTURENET Contract:** 2% EWT calculation
- ✅ **DITO Contract:** 5% EWT calculation
- ✅ **Company Change:** Recalculation when switching companies
- ✅ **Edit Mode:** Correct EWT when editing existing contracts

### Test Scenarios
1. **Create FUTURENET contract** → Verify 2% EWT
2. **Create DITO contract** → Verify 5% EWT
3. **Change company during form entry** → Verify recalculation
4. **Edit existing contract** → Verify correct EWT preserved/recalculated

## 🚀 Deployment Status

- ✅ Frontend logic implemented
- ✅ Dynamic label rendering
- ✅ Conditional calculations working
- ✅ Edit mode compatibility
- ✅ API tests updated
- ✅ Build successful
- ✅ Ready for production

## 💡 Business Benefits

1. **Compliance:** Different EWT rates for different companies as required
2. **Accuracy:** Eliminates manual EWT calculation errors
3. **Efficiency:** Automatic calculation based on company selection
4. **Transparency:** Users can see exactly which EWT rate is being applied
5. **Flexibility:** Easy to modify EWT rates or add new companies in the future

## 🔮 Future Enhancements

**Recommendations for maintainability:**
1. **Configuration File:** Move EWT rates to a configuration object
2. **Database Storage:** Store company-specific EWT rates in database
3. **Admin Interface:** Allow admins to modify EWT rates per company
4. **Audit Trail:** Log EWT rate changes for compliance

**Example Configuration Approach:**
```tsx
const EWT_RATES = {
    'FUTURENET AND TECHNOLOGY CORPORATION': 0.02,
    'DITO TELECOMMUNITY CORPORATION': 0.05,
    'CHINA COMMUNICATION SERVICES PHILIPPINES CORPORATION': 0.05,
    'BESTWORLD ENGINEERING SDN BHD': 0.05
};
```

The conditional EWT calculation is now fully implemented and working across all contract operations! 🎉
