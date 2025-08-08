export type Tender = {
  id: string;
  number: string;
  object: string;
  unit: string;
  value: string;
  openingDate: string;
  status: string;
};

export type Quotation = {
  id: string;
  totalValue: string;
  date: string;
  status: string;
};

export type PurchasedItem = {
  description: string;
  quantity: number;
  totalValue: string;
  unit: string;
};

export type RecentData = {
  latestTenders: Tender[];
  latestQuotations: Quotation[];
  mostPurchasedItems: PurchasedItem[];
};
