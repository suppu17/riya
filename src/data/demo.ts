export interface GeneratedImageData {
  id: string;
  url: string;
  productName: string;
  productId: string;
  productImage?: string;
  createdAt: string;
  modelUsed: string;
  modelId: string;
}

export const demoGeneratedImages: GeneratedImageData[] = [
  {
    id: "1751052144718",
    url: "https://assetsimagesai.s3.us-east-1.amazonaws.com/Created+/output_0.png",
    productName: "Embroidered Accent Denim Jacket",
    productId: "16",
    productImage:
      "https://assetsimagesai.s3.us-east-1.amazonaws.com/v1/Embroidered_Accent_Denim_Jacket/embroidered_accent_denim_jacket_worn.png",
    createdAt: "2025-06-27T19:22:24.718Z",
    modelUsed: "Model 7",
    modelId: "7",
  },
  {
    id: "1751051936799",
    url: "https://assetsimagesai.s3.us-east-1.amazonaws.com/Created+/output_0+(2).png",
    productName: "Striped Lavalliere Dress",
    productId: "14",
    createdAt: "2025-06-27T19:18:56.799Z",
    modelUsed: "Model 7",
    modelId: "7",
  },
  {
    id: "1751051856660",
    url: "https://assetsimagesai.s3.us-east-1.amazonaws.com/Created+/output_0+(3).png",
    productName: "Color_Blocked Pleat Dress",
    productId: "12",
    createdAt: "2025-06-27T19:17:36.660Z",
    modelUsed: "Model 8",
    modelId: "8",
  },
];