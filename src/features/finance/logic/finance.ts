/**
 * Motor de cálculos financeiros: Parcelamento (Fórmula Price) e Juros Compostos
 */

export type InstallmentResult = {
	monthlyPayment: number;
	totalPayment: number;
	totalInterest: number;
};

export type CompoundInterestResult = {
	totalInvested: number;
	totalInterestEarned: number;
	finalBalance: number;
};

/**
 * Cálculo de parcelas fixas com juros compostos mensais (Tabela Price)
 */
export function calculateInstallments(
	principal: number,
	months: number,
	monthlyRatePercent: number,
): InstallmentResult {
	if (principal <= 0 || months <= 0) {
		return { monthlyPayment: 0, totalPayment: 0, totalInterest: 0 };
	}

	const rate = monthlyRatePercent / 100;

	// Sem juros
	if (rate === 0) {
		const pmt = principal / months;
		return {
			monthlyPayment: Math.round(pmt * 100) / 100,
			totalPayment: principal,
			totalInterest: 0,
		};
	}

	// Fórmula Price: PMT = PV * [i * (1 + i)^n] / [(1 + i)^n - 1]
	const factor = (1 + rate) ** months;
	const pmt = (principal * (rate * factor)) / (factor - 1);
	const totalPayment = pmt * months;
	const totalInterest = totalPayment - principal;

	return {
		monthlyPayment: Math.round(pmt * 100) / 100,
		totalPayment: Math.round(totalPayment * 100) / 100,
		totalInterest: Math.round(totalInterest * 100) / 100,
	};
}

/**
 * Cálculo de investimentos com juros compostos e aportes mensais recorrentes
 */
export function calculateCompoundInterest(
	initialDeposit: number,
	monthlyDeposit: number,
	ratePercent: number,
	rateType: "monthly" | "yearly",
	months: number,
): CompoundInterestResult {
	if (months <= 0) {
		return {
			totalInvested: initialDeposit,
			totalInterestEarned: 0,
			finalBalance: initialDeposit,
		};
	}

	// Taxa mensal equivalente
	const monthlyRate =
		rateType === "monthly" ? ratePercent / 100 : (1 + ratePercent / 100) ** (1 / 12) - 1;

	let balance = initialDeposit;
	let totalInvested = initialDeposit;

	for (let m = 1; m <= months; m++) {
		// Rende sobre o saldo anterior
		balance = balance * (1 + monthlyRate) + monthlyDeposit;
		totalInvested += monthlyDeposit;
	}

	const totalInterest = balance - totalInvested;

	return {
		totalInvested: Math.round(totalInvested * 100) / 100,
		totalInterestEarned: Math.round(totalInterest * 100) / 100,
		finalBalance: Math.round(balance * 100) / 100,
	};
}
