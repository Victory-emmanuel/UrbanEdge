import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const PropertyMortgageCalculator = ({ propertyPrice }) => {
  // Ensure propertyPrice is a valid number, default to 0 if not
  const validPropertyPrice = propertyPrice && !isNaN(propertyPrice) ? propertyPrice : 0;

  const [loanAmount, setLoanAmount] = useState(Math.round(validPropertyPrice * 0.8));
  const [downPayment, setDownPayment] = useState(
    Math.round(validPropertyPrice * 0.2),
  );
  const [interestRate, setInterestRate] = useState(4.5);
  const [loanTerm, setLoanTerm] = useState(30);
  const [monthlyPayment, setMonthlyPayment] = useState(0);

  // Update calculator values when propertyPrice changes (when property data loads)
  useEffect(() => {
    if (propertyPrice && !isNaN(propertyPrice) && propertyPrice > 0) {
      setLoanAmount(Math.round(propertyPrice * 0.8));
      setDownPayment(Math.round(propertyPrice * 0.2));
    }
  }, [propertyPrice]);

  // Calculate monthly payment whenever inputs change
  useEffect(() => {
    calculateMonthlyPayment();
  }, [loanAmount, interestRate, loanTerm]);

  const calculateMonthlyPayment = () => {
    // Convert annual interest rate to monthly rate and decimal form
    const monthlyRate = interestRate / 100 / 12;
    // Convert loan term from years to months
    const termMonths = loanTerm * 12;

    if (monthlyRate === 0) {
      setMonthlyPayment(loanAmount / termMonths);
    } else {
      // Calculate monthly payment using the formula: P * (r(1+r)^n) / ((1+r)^n - 1)
      const payment =
        (loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, termMonths))) /
        (Math.pow(1 + monthlyRate, termMonths) - 1);

      setMonthlyPayment(payment);
    }
  };

  const handleDownPaymentChange = (e) => {
    const value = parseFloat(e.target.value) || 0;
    setDownPayment(value);
    const validPrice = propertyPrice && !isNaN(propertyPrice) ? propertyPrice : 0;
    setLoanAmount(Math.max(0, validPrice - value));
  };

  const handleLoanAmountChange = (e) => {
    const value = parseFloat(e.target.value) || 0;
    setLoanAmount(value);
    const validPrice = propertyPrice && !isNaN(propertyPrice) ? propertyPrice : 0;
    setDownPayment(Math.max(0, validPrice - value));
  };

  const formatCurrency = (value) => {
    const formattedNumber = new Intl.NumberFormat("en-NG", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
    return `₦${formattedNumber}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white dark:bg-brown-dark rounded-lg shadow-lg p-6"
    >
      <h3 className="text-xl font-heading font-semibold text-brown-dark dark:text-beige-light mb-6">
        Mortgage Calculator
      </h3>

      <div className="space-y-6">
        {/* Property Price (Read-only) */}
        <div>
          <label className="block text-sm font-medium text-brown-dark dark:text-beige-light mb-1">
            Property Price
          </label>
          <input
            type="text"
            value={formatCurrency(validPropertyPrice)}
            className="input bg-beige-light dark:bg-brown cursor-not-allowed"
            disabled
          />
        </div>

        {/* Down Payment */}
        <div>
          <label
            htmlFor="downPayment"
            className="block text-sm font-medium text-brown-dark dark:text-beige-light mb-1"
          >
            Down Payment
          </label>
          <input
            type="number"
            id="downPayment"
            value={downPayment}
            onChange={handleDownPaymentChange}
            min="0"
            max={validPropertyPrice || 999999999}
            step="1000"
            className="input"
          />

          <div className="mt-2 flex justify-between text-xs text-brown dark:text-beige-medium">
            <span>
              {validPropertyPrice > 0 ? Math.round((downPayment / validPropertyPrice) * 100) : 0}% of property
              price
            </span>
            <span>{formatCurrency(downPayment)}</span>
          </div>
        </div>

        {/* Loan Amount */}
        <div>
          <label
            htmlFor="loanAmount"
            className="block text-sm font-medium text-brown-dark dark:text-beige-light mb-1"
          >
            Loan Amount
          </label>
          <input
            type="number"
            id="loanAmount"
            value={loanAmount}
            onChange={handleLoanAmountChange}
            min="0"
            max={validPropertyPrice || 999999999}
            step="1000"
            className="input"
          />
        </div>

        {/* Interest Rate */}
        <div>
          <label
            htmlFor="interestRate"
            className="block text-sm font-medium text-brown-dark dark:text-beige-light mb-1"
          >
            Interest Rate (%)
          </label>
          <input
            type="number"
            id="interestRate"
            value={interestRate}
            onChange={(e) => setInterestRate(parseFloat(e.target.value) || 0)}
            min="0"
            max="20"
            step="0.1"
            className="input"
          />
        </div>

        {/* Loan Term */}
        <div>
          <label
            htmlFor="loanTerm"
            className="block text-sm font-medium text-brown-dark dark:text-beige-light mb-1"
          >
            Loan Term (years)
          </label>
          <select
            id="loanTerm"
            value={loanTerm}
            onChange={(e) => setLoanTerm(parseInt(e.target.value))}
            className="input"
          >
            <option value="15">15 years</option>
            <option value="20">20 years</option>
            <option value="30">30 years</option>
          </select>
        </div>

        {/* Results */}
        <div className="bg-beige-light dark:bg-brown rounded-lg p-4 text-center">
          <p className="text-sm text-brown dark:text-beige-medium mb-1">
            Estimated Monthly Payment
          </p>
          <p className="text-2xl font-heading font-bold text-brown-dark dark:text-beige-light">
            {formatCurrency(monthlyPayment)}
          </p>
          <p className="text-xs text-brown dark:text-beige-medium mt-2">
            Principal & Interest only. Taxes and insurance not included.
          </p>
        </div>

        {/* Disclaimer */}
        <p className="text-xs text-brown dark:text-beige-medium italic">
          This calculator is for estimation purposes only. Contact a mortgage
          professional for accurate rates and terms.
        </p>
      </div>
    </motion.div>
  );
};

export default PropertyMortgageCalculator;
