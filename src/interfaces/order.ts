export interface Iorder {
  _id?: string;
  date: Date;
  productList: [
    {
      productId: string;
      price: number;
      quantity: number;
    }
  ];
  price: number;
}
