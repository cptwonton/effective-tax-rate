def calculate_tax(total_compensation, pre_tax_deductions, itemized_deductions, filing_status, traditional_roth_ira_contributions, roth_conversions):
    # Tax brackets for 2024
    brackets_single = [(0, 11600, 0.10), (11601, 47150, 0.12), (47151, 100525, 0.22), (100526,
                                                                                       191950, 0.24), (191951, 243725, 0.32), (243726, 609350, 0.35), (609351, float('inf'), 0.37)]
    brackets_married = [(0, 23200, 0.10), (23201, 94150, 0.12), (94151, 201050, 0.22), (201051,
                                                                                        383900, 0.24), (383901, 487450, 0.32), (487451, 731200, 0.35), (731201, float('inf'), 0.37)]

    # Standard deduction for 2024
    standard_deduction_single = 14600
    standard_deduction_married = 29200

    # Apply pre-tax deductions
    taxable_income = total_compensation + extra_income - pre_tax_deductions

    # Determine standard deduction based on filing status
    if filing_status.lower() == 'single':
        standard_deduction = standard_deduction_single
        brackets = brackets_single
    elif filing_status.lower() == 'married':
        standard_deduction = standard_deduction_married
        brackets = brackets_married
    else:
        raise ValueError(
            "Invalid filing status. Please enter 'single' or 'married'.")

    # Include Roth conversions in taxable income
    taxable_income += roth_conversions

    # Compare itemized deductions with standard deduction
    if itemized_deductions > standard_deduction:
        deductible_income = taxable_income - itemized_deductions + traditional_roth_ira_contributions
    else:
        deductible_income = taxable_income - standard_deduction + traditional_roth_ira_contributions

    # Calculate tax
    tax = 0
    for bracket in brackets:
        if deductible_income <= 0:
            break
        bracket_min, bracket_max, tax_rate = bracket
        if deductible_income > bracket_max:
            tax += (bracket_max - bracket_min + 1) * tax_rate
            deductible_income -= (bracket_max - bracket_min + 1)
        else:
            tax += deductible_income * tax_rate
            break

    return tax

# Input prompts
print("Please enter the following information:")
total_compensation = float(input("Total compensation: $"))
extra_income = float(input("Extra income: $"))
pre_tax_deductions = float(input("Pre-tax deductions (e.g., 401k, parking, vision, health, dental), excluding standard deduction: $"))
roth_conversions = float(input("Roth conversions (pre-tax dollars converted to Roth IRA): $"))
mortgage_interest = float(input("Mortgage interest paid: $"))
traditional_roth_ira_contributions = float(input("Traditional or Roth IRA contributions: $"))
student_loan_interest = float(input("Student loan interest paid: $"))
hsa_contributions = float(input("HSA contributions: $"))
property_taxes = float(input("Property taxes paid: $"))
state_local_taxes = float(input("State and local income taxes paid: $"))
charitable_contributions = float(input("Charitable contributions: $"))
itemized_deductions = mortgage_interest + student_loan_interest + hsa_contributions + property_taxes + state_local_taxes + charitable_contributions
filing_status = input("Filing status (single/married): ")

# Calculate tax
tax = calculate_tax(
    total_compensation, pre_tax_deductions, itemized_deductions, filing_status, traditional_roth_ira_contributions, roth_conversions)

# Calculate effective tax rate
effective_tax_rate = (tax / total_compensation) * 100

# Output
print("\nTax Calculation Results:")
print("-------------------------------")
print("Total compensation: ${:,.2f}".format(total_compensation + extra_income))
print("Pre-tax deductions: ${:,.2f}".format(pre_tax_deductions))
print("Taxable income: ${:,.2f}".format(total_compensation + extra_income - pre_tax_deductions))
print("Total itemized deductions: ${:,.2f}".format(itemized_deductions))
print("-------------------------------")
print("You will owe ${:,.2f} in federal income tax".format(tax))
print("Your effective tax rate is {:.2f}%".format(effective_tax_rate))
