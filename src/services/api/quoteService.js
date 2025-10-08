import mockQuotes from "@/services/mockData/quotes.json";

let quotes = [...mockQuotes];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const quoteService = {
  async getAll() {
    await delay(300);
    return [...quotes];
  },

  async getById(id) {
    await delay(200);
    const quote = quotes.find(q => q.Id === parseInt(id));
    return quote ? { ...quote } : null;
  },

  async create(quoteData) {
    await delay(300);
    const newQuote = {
      Id: Math.max(...quotes.map(q => q.Id), 0) + 1,
      quoteNumber: `QT-${new Date().getFullYear()}-${String(quotes.length + 1).padStart(3, '0')}`,
      ...quoteData,
      createdAt: new Date().toISOString()
    };
    quotes.push(newQuote);
    return { ...newQuote };
  },

  async update(id, quoteData) {
    await delay(300);
    const index = quotes.findIndex(q => q.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Quote not found");
    }
    quotes[index] = {
      ...quotes[index],
      ...quoteData,
      Id: quotes[index].Id,
      quoteNumber: quotes[index].quoteNumber,
      createdAt: quotes[index].createdAt
    };
    return { ...quotes[index] };
  },

  async delete(id) {
    await delay(200);
    const index = quotes.findIndex(q => q.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Quote not found");
    }
    quotes.splice(index, 1);
    return true;
  }
};