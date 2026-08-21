export type HistoryItem = {
	id: string;
	expression: string;
	result: string;
	tag?: string;
	timestamp?: number;
	productName?: string;
	quantity?: number;
	unitPrice?: number;
};
