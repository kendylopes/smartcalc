export type Language = "pt-BR" | "en-US" | "es-ES";

export type LanguageInfo = {
	code: Language;
	name: string;
	nativeName: string;
	flag: string;
	currencySymbol: string;
	currencyCode: string;
	decimalSeparator: string;
	thousandSeparator: string;
};

export type TranslationDictionary = {
	appName: string;
	appTagline: string;

	// Menu & Top Navigation
	menuTitle: string;
	menuSubtitle: string;
	toolsAndUtilities: string;
	visualAndSettings: string;
	themesSection: string;
	languageSection: string;

	// Tools names
	comparePackages: string;
	currencyConverter: string;
	splitBill: string;
	financeSimulator: string;
	scientificMode: string;
	spendingAnalytics: string;
	fuelCalculator: string;
	discountCalculator: string;
	studioLayout: string;
	keycaps: string;
	compactMode: string;
	fullscreen: string;
	screenAlwaysOn: string;
	soundEffects: string;
	keyboardShortcuts: string;
	backupRestore: string;
	installApp: string;
	helpAndGuide: string;

	// Actions & Status
	active: string;
	inactive: string;
	auto: string;
	standard: string;
	visible: string;
	hidden: string;
	muted: string;
	on: string;
	off: string;
	close: string;
	save: string;
	cancel: string;
	confirm: string;
	clear: string;
	delete: string;

	// Calculator UI
	marketQuickAdd: string;
	marketQuickAddDesc: string;
	productName: string;
	quantity: string;
	unitPrice: string;
	history: string;
	historyEmpty: string;
	digitalReceipt: string;
	viewAnalytics: string;

	// Analytics Modal
	analyticsTitle: string;
	analyticsSubtitle: string;
	totalSpent: string;
	averageOperation: string;
	totalItems: string;
	highestExpense: string;
	spendingDistribution: string;
	topItemsRanking: string;
	noAnalyticsData: string;
	noAnalyticsDataDesc: string;
	exportSummary: string;
};
