import React, { useState } from "react";
import "./TaxCalculator.css"; // Import the CSS file

interface FormData {
  totalCompensation: number | "";
  extraIncome: number | "";
  preTaxDeductions: number | "";
  rothConversions: number | "";
  mortgageInterest: number | "";
  traditionalRothIraContributions: number | "";
  studentLoanInterest: number | "";
  hsaContributions: number | "";
  propertyTaxes: number | "";
  stateLocalTaxes: number | "";
  charitableContributions: number | "";
  filingStatus: string | "";
  tax: number | null;
  effectiveTaxRate: number | null;
}

const TaxCalculator: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    totalCompensation: "",
    extraIncome: "",
    preTaxDeductions: "",
    rothConversions: "",
    mortgageInterest: "",
    traditionalRothIraContributions: "",
    studentLoanInterest: "",
    hsaContributions: "",
    propertyTaxes: "",
    stateLocalTaxes: "",
    charitableContributions: "",
    filingStatus: "",
    tax: null,
    effectiveTaxRate: null,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: parseFloat(e.target.value) || "",
    });
  };

  const calculateTax = () => {
    const {
      totalCompensation,
      extraIncome,
      preTaxDeductions,
      rothConversions,
      mortgageInterest,
      traditionalRothIraContributions,
      studentLoanInterest,
      hsaContributions,
      propertyTaxes,
      stateLocalTaxes,
      charitableContributions,
      filingStatus,
    } = formData;

    // Tax brackets for 2024
    const bracketsSingle = [
      [0, 11600, 0.1],
      [11601, 47150, 0.12],
      [47151, 100525, 0.22],
      [100526, 191950, 0.24],
      [191951, 243725, 0.32],
      [243726, 609350, 0.35],
      [609351, Infinity, 0.37],
    ];

    const bracketsMarried = [
      [0, 23200, 0.1],
      [23201, 94150, 0.12],
      [94151, 201050, 0.22],
      [201051, 383900, 0.24],
      [383901, 487450, 0.32],
      [487451, 731200, 0.35],
      [731201, Infinity, 0.37],
    ];

    // Standard deduction for 2024
    const standardDeductionSingle = 14600;
    const standardDeductionMarried = 29200;

    const brackets =
      filingStatus === "single" ? bracketsSingle : bracketsMarried;
    const standardDeduction =
      filingStatus === "single"
        ? standardDeductionSingle
        : standardDeductionMarried;

    let taxableIncome =
      (totalCompensation as number) +
      (extraIncome as number) -
      (preTaxDeductions as number);
    let deductibleIra = 0;

    if (filingStatus === "single") {
      // Determine if traditional IRA contributions are deductible
      if (taxableIncome > 0 && taxableIncome <= 73000) {
        deductibleIra = Math.min(
          traditionalRothIraContributions as number,
          6000
        );
      } else if (taxableIncome > 73000 && taxableIncome <= 84000) {
        deductibleIra = Math.min(
          traditionalRothIraContributions as number,
          6000 - 0.2 * (taxableIncome - 73000)
        );
      }
    } else if (filingStatus === "married") {
      if (taxableIncome > 0 && taxableIncome <= 122000) {
        deductibleIra = Math.min(
          traditionalRothIraContributions as number,
          6000
        );
      } else if (taxableIncome > 122000 && taxableIncome <= 140000) {
        deductibleIra = Math.min(
          traditionalRothIraContributions as number,
          6000 - 0.2 * (taxableIncome - 122000)
        );
      }
    }

    taxableIncome += rothConversions as number;

    // Apply standard deduction
    taxableIncome -= standardDeduction;

    // Apply itemized deductions
    const itemizedDeductions =
      (mortgageInterest as number) +
      (studentLoanInterest as number) +
      (hsaContributions as number) +
      (propertyTaxes as number) +
      (stateLocalTaxes as number) +
      (charitableContributions as number);

    // Compare itemized deductions with standard deduction
    const deductibleIncome = Math.max(
      taxableIncome,
      taxableIncome - itemizedDeductions + deductibleIra
    );

    // Apply tax brackets
    let remainingIncome = deductibleIncome;
    let tax = 0;
    for (let i = 0; i < brackets.length; i++) {
      const [min, max, rate] = brackets[i];
      if (remainingIncome <= 0) break;

      if (remainingIncome > max) {
        tax += (max - min + 1) * rate;
        remainingIncome -= max - min + 1;
      } else {
        tax += remainingIncome * rate;
        remainingIncome = 0;
      }
    }

    // Calculate effective tax rate
    const effectiveTaxRate =
      (tax / ((totalCompensation as number) + (extraIncome as number))) * 100;

    return { tax, effectiveTaxRate };
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const { tax, effectiveTaxRate } = calculateTax();
    setFormData({ ...formData, tax, effectiveTaxRate });
  };

  return (
    <div className="container">
      {" "}
      {/* Apply container class */}
      <h1 className="header">Tax Calculator</h1>
      <form onSubmit={handleSubmit}>
        {/* Input fields for user data */}
        <div className="form-group">
          <label className="label">Total Compensation:</label>
          <input
            type="number"
            className="input-field"
            name="totalCompensation"
            value={formData.totalCompensation}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label className="label">Extra Income:</label>
          <input
            type="number"
            className="input-field"
            name="extraIncome"
            value={formData.extraIncome}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label className="label">Pre-tax Deductions:</label>
          <input
            type="number"
            className="input-field"
            name="preTaxDeductions"
            value={formData.preTaxDeductions}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label className="label">Roth Conversions:</label>
          <input
            type="number"
            className="input-field"
            name="rothConversions"
            value={formData.rothConversions}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label className="label">Mortgage Interest:</label>
          <input
            type="number"
            className="input-field"
            name="mortgageInterest"
            value={formData.mortgageInterest}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label className="label">
            Traditional or Roth IRA Contributions:
          </label>
          <input
            type="number"
            className="input-field"
            name="traditionalRothIraContributions"
            value={formData.traditionalRothIraContributions}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label className="label">Student Loan Interest:</label>
          <input
            type="number"
            className="input-field"
            name="studentLoanInterest"
            value={formData.studentLoanInterest}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label className="label">HSA Contributions:</label>
          <input
            type="number"
            className="input-field"
            name="hsaContributions"
            value={formData.hsaContributions}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label className="label">Property Taxes:</label>
          <input
            type="number"
            className="input-field"
            name="propertyTaxes"
            value={formData.propertyTaxes}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label className="label">State and Local Taxes:</label>
          <input
            type="number"
            className="input-field"
            name="stateLocalTaxes"
            value={formData.stateLocalTaxes}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label className="label">Charitable Contributions:</label>
          <input
            type="number"
            className="input-field"
            name="charitableContributions"
            value={formData.charitableContributions}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label className="label">Filing Status:</label>
          <select
            className="select-field"
            name="filingStatus"
            value={formData.filingStatus}
            onChange={handleChange}
          >
            <option value="single">Single</option>
            <option value="married">Married</option>
          </select>
        </div>
        <button type="submit" className="button">
          Calculate Tax
        </button>
      </form>
      {/* Display tax calculation results */}
      {formData.tax !== null && (
        <div className="result">
          <h2 className="result-header">Tax Calculation Results</h2>
          <p className="result-text">Tax: ${formData.tax.toFixed(2)}</p>
          <p className="result-text">
            Effective Tax Rate: {formData.effectiveTaxRate.toFixed(2)}%
          </p>
        </div>
      )}
    </div>
  );
};

export default TaxCalculator;
