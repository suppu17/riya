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
    url: "https://cdn.fashn.ai/91cd0da5-cc09-498b-acd8-962e0362957a/output_0.png",
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
    url: "https://cdn.fashn.ai/46f8e523-d82d-499c-a00f-bb16f936d7de/output_0.png",
    productName: "Striped Lavalliere Dress",
    productId: "14",
    createdAt: "2025-06-27T19:18:56.799Z",
    modelUsed: "Model 7",
    modelId: "7",
  },
  {
    id: "1751051856660",
    url: "https://cdn.fashn.ai/029a75f5-9a58-4d0e-aa97-582a4748e3aa/output_0.png",
    productName: "Color_Blocked Pleat Dress",
    productId: "12",
    createdAt: "2025-06-27T19:17:36.660Z",
    modelUsed: "Model 8",
    modelId: "8",
  },
  {
    id: "1751051817437",
    url: "https://cdn.fashn.ai/437276e8-0a54-4644-9151-d1da379d22b1/output_0.png",
    productName: "Signature Accent Knit Dress",
    productId: "13",
    createdAt: "2025-06-27T19:16:57.437Z",
    modelUsed: "Model 8",
    modelId: "8",
  },
];