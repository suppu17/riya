export type Product = {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  rating: number;
  inStock: boolean;
  description?: string;
  designer?: string;
  articleNumber?: string;
  images?: string[];
  tryown?: boolean;
  categoryFlag?: boolean;
  keyWords?: string[];
  moreInfo?: string;
};
export const sampleProducts: Product[] = [
  {
    id: "16",
    name: "Embroidered Accent Denim Jacket",
    price: 4650,
    image:
      "https://assetsimagesai.s3.us-east-1.amazonaws.com/v1/Embroidered_Accent_Denim_Jacket/embroidered_accent_denim_jacket_worn.png",
    category: "Clothing",
    rating: 4.5,
    inStock: true,
    description: "Premium denim jacket with intricate embroidered accents",
    designer: "Louis Vuitton",
    articleNumber: "1AFTB2",
    images: [
      "https://assetsimagesai.s3.us-east-1.amazonaws.com/v1/Embroidered_Accent_Denim_Jacket/embroidered_accent_denim_jacket_front.png",
      "https://assetsimagesai.s3.us-east-1.amazonaws.com/v1/Embroidered_Accent_Denim_Jacket/embroidered_accent_denim_jacket_worn.png",
      "https://assetsimagesai.s3.us-east-1.amazonaws.com/v1/Embroidered_Accent_Denim_Jacket/embroidered_accent_denim_jacket_ambiance.png",
    ],
    keyWords: ["Denim", "pink", "Pinkandblack", "Jacket", "LV", "Cute", "trendy", "chic"], 
    moreInfo: "This casual jacket is uplifted with elegant seasonal detailing for spirited everyday styling. Cut in a chic cropped shape from washed denim in a playful colorway, the shoulders are accented with intricately embroidered floral patches. Signed on the back with a Monogram Flower tab and a Louis Vuitton patch."
  },
  {
    id: "32",
    name: "Alma BB",
    price: 1900,
    image:
      "https://assetsimagesai.s3.us-east-1.amazonaws.com/v1/Alma_BB/alma_bb_front.png",
    category: "Bags",
    rating: 4.7,
    inStock: true,
    description: "Iconic structured handbag with timeless appeal",
    designer: "Louis Vuitton",
    articleNumber: "M46990",
    images: [
      "https://assetsimagesai.s3.us-east-1.amazonaws.com/v1/Alma_BB/alma_bb_front.png",
      "https://assetsimagesai.s3.us-east-1.amazonaws.com/v1/Alma_BB/alma_bb_side.png",
      "https://assetsimagesai.s3.us-east-1.amazonaws.com/v1/Alma_BB/alma_bb_interior.png",
      "https://assetsimagesai.s3.us-east-1.amazonaws.com/v1/Alma_BB/alma_bb_interior2.png",
      "https://assetsimagesai.s3.us-east-1.amazonaws.com/v1/Alma_BB/alma_bb_cropped_worn.png",
    ],
    keyWords: ["Iconic Handbag", "Louis Vuitton", "Small", "Cute", "Handy", "Original"],
    moreInfo: "An iconic structured small handbag with original monogram color and a Louis Vuitton logo",
  },
  {
    id: "33",
    name: "OnTheGo PM",
    price: 4000,
    image:
      "https://assetsimagesai.s3.us-east-1.amazonaws.com/v1/OnTheGo_PM/onthego_pm_front.png",
    category: "Bags",
    rating: 4.8,
    inStock: true,
    description: "Premium tote bag with sophisticated design and ample space",
    designer: "Louis Vuitton",
    articleNumber: "M14633",
    images: [
      "https://assetsimagesai.s3.us-east-1.amazonaws.com/v1/OnTheGo_PM/onthego_pm_front.png",
      "https://assetsimagesai.s3.us-east-1.amazonaws.com/v1/OnTheGo_PM/onthego_pm_side.png",
      "https://assetsimagesai.s3.us-east-1.amazonaws.com/v1/OnTheGo_PM/onthego_pm_interior.png",
      "https://assetsimagesai.s3.us-east-1.amazonaws.com/v1/OnTheGo_PM/onthego_pm_back.png",
      "https://assetsimagesai.s3.us-east-1.amazonaws.com/v1/OnTheGo_PM/onthego_pm_closeup.png",
    ],
    keyWords: ["Premium Tote Bag", "Blue", "Monogram", "Denim","Louis Vuitton", "Officewear", "Sophisticated Design"],
    moreInfo: "A blue denim tote bag with a monogrammed Louis Vuitton logo and a sophisticated design with ample space."
  },
  {
    id: "34",
    name: "Hide Away MM",
    price: 3400,
    image:
      "https://assetsimagesai.s3.us-east-1.amazonaws.com/v1/Hide_Away_MM/hide_away_mm_front.png",
    category: "Bags",
    rating: 4.6,
    inStock: true,
    description: "Versatile handbag with modern design and practical functionality",
    designer: "Louis Vuitton",
    articleNumber: "M14473",
    images: [
      "https://assetsimagesai.s3.us-east-1.amazonaws.com/v1/Hide_Away_MM/hide_away_mm_front.png",
      "https://assetsimagesai.s3.us-east-1.amazonaws.com/v1/Hide_Away_MM/hide_away_mm_side.png",
      "https://assetsimagesai.s3.us-east-1.amazonaws.com/v1/Hide_Away_MM/hide_away_mm_interior.png",
      "https://assetsimagesai.s3.us-east-1.amazonaws.com/v1/Hide_Away_MM/hide_away_mm_back.png",
      "https://assetsimagesai.s3.us-east-1.amazonaws.com/v1/Hide_Away_MM/hide_away_mm_worn.png",
    ],
    keyWords: ["Brown", "Monogram", "Canvas", "Louis Vuitton", "Hide Away", "Workwear", "Weekendwear"],
    moreInfo: "Meet the Hide Away, a refined work-to-weekend model that combines sleek lines with Louis Vuitton heritage codes. Crafted from Monogram coated canvas, it is elevated with signature details including a gold-toned padlock and Toron handle, which recall archival styles from the 1930s. Use the hidden compartment inside to keep valuables secure."
  },
  {
    id: "35",
    name: "Capucines BB",
    price: 7350,
    image:
      "https://assetsimagesai.s3.us-east-1.amazonaws.com/v1/Capucines_BB/capucines_bb_front.png",
    category: "Bags",
    rating: 4.9,
    inStock: true,
    description: "Luxurious handbag with exceptional craftsmanship and elegant design",
    designer: "Louis Vuitton",
    articleNumber: "M12937",
    images: [
      "https://assetsimagesai.s3.us-east-1.amazonaws.com/v1/Capucines_BB/capucines_bb_front.png",
      "https://assetsimagesai.s3.us-east-1.amazonaws.com/v1/Capucines_BB/capucines_bb_closeup.png",
      "https://assetsimagesai.s3.us-east-1.amazonaws.com/v1/Capucines_BB/capucines_bb_side.png",
      "https://assetsimagesai.s3.us-east-1.amazonaws.com/v1/Capucines_BB/capucines_bb_interior.png",
      "https://assetsimagesai.s3.us-east-1.amazonaws.com/v1/Capucines_BB/capucines_bb_back.png",
      "https://assetsimagesai.s3.us-east-1.amazonaws.com/v1/Capucines_BB/capucines_bb_other.png",
    ],
    keyWords: ["Iconic, Rust Red, Gold-toned"],
    moreInfo: "The iconic Capucines BB is reimagined for the season as part of the Chain On You collection. This edition is made from Taurillon leather, accented with a jewel-inspired, bi-galvanized chain that features delicate Monogram Flower details. Designed to be styled with the flap inside or out, this versatile model is sized to fit everyday essentials and includes several interior pockets. The rounded signature LV initials lend a sophisticated finish."
  },
  {
    id: "36",
    name: "Capucines MM Souple",
    price: 7750,
    image:
      "https://assetsimagesai.s3.us-east-1.amazonaws.com/v1/Capucines_MM_Souple/capucines_mm_souple_front.png",
    category: "Bags",
    rating: 4.8,
    inStock: true,
    description: "Soft and supple version of the iconic Capucines handbag",
    designer: "Louis Vuitton",
    articleNumber: "M12927",
    images: [
      "https://assetsimagesai.s3.us-east-1.amazonaws.com/v1/Capucines_MM_Souple/capucines_mm_souple_front.png",
      "https://assetsimagesai.s3.us-east-1.amazonaws.com/v1/Capucines_MM_Souple/capucines_mm_souple_closeup.png",
      "https://assetsimagesai.s3.us-east-1.amazonaws.com/v1/Capucines_MM_Souple/capucines_mm_souple_side.png",
      "https://assetsimagesai.s3.us-east-1.amazonaws.com/v1/Capucines_MM_Souple/capucines_mm_souple_interior.png",
      "https://assetsimagesai.s3.us-east-1.amazonaws.com/v1/Capucines_MM_Souple/capucines_mm_souple_back.png",
    ],
  },
  {
    id: "37",
    name: "Neverfull MM",
    price: 2990,
    image:
      "https://assetsimagesai.s3.us-east-1.amazonaws.com/v1/Neverfull_MM/neverfull_mm_front.png",
    category: "Bags",
    rating: 4.7,
    inStock: true,
    description: "Classic tote bag with timeless design and practical size",
    designer: "Louis Vuitton",
    articleNumber: "M14285",
    images: [
      "https://assetsimagesai.s3.us-east-1.amazonaws.com/v1/Neverfull_MM/neverfull_mm_front.png",
      "https://assetsimagesai.s3.us-east-1.amazonaws.com/v1/Neverfull_MM/neverfull_mm_side.png",
      "https://assetsimagesai.s3.us-east-1.amazonaws.com/v1/Neverfull_MM/neverfull_mm_interior.png",
      "https://assetsimagesai.s3.us-east-1.amazonaws.com/v1/Neverfull_MM/neverfull_mm_detail.png",
      "https://assetsimagesai.s3.us-east-1.amazonaws.com/v1/Neverfull_MM/neverfull_mm_back.png",
    ],
  },
  {
    id: "38",
    name: "OnTheGo GM",
    price: 3750,
    image:
      "https://assetsimagesai.s3.us-east-1.amazonaws.com/v1/OnTheGo_GM/onthego_gm_front.png",
    category: "Bags",
    rating: 4.8,
    inStock: true,
    description: "Large tote bag perfect for travel and everyday essentials",
    designer: "Louis Vuitton",
    articleNumber: "M45945",
    images: [
      "https://assetsimagesai.s3.us-east-1.amazonaws.com/v1/OnTheGo_GM/onthego_gm_front.png",
      "https://assetsimagesai.s3.us-east-1.amazonaws.com/v1/OnTheGo_GM/onthego_gm_side.png",
      "https://assetsimagesai.s3.us-east-1.amazonaws.com/v1/OnTheGo_GM/onthego_gm_interior.png",
      "https://assetsimagesai.s3.us-east-1.amazonaws.com/v1/OnTheGo_GM/onthego_gm_interior2.png",
      "https://assetsimagesai.s3.us-east-1.amazonaws.com/v1/OnTheGo_GM/onthego_gm_worn.png",
    ],
  },
  {
    id: "39",
    name: "Coussin Backpack PM",
    price: 4500,
    image:
      "https://assetsimagesai.s3.us-east-1.amazonaws.com/v1/Coussin_Backpack_PM/coussin_backpack_pm_front.png",
    category: "Bags",
    rating: 4.7,
    inStock: true,
    description: "Stylish backpack with quilted design and modern functionality",
    designer: "Louis Vuitton",
    articleNumber: "M13358",
    images: [
      "https://assetsimagesai.s3.us-east-1.amazonaws.com/v1/Coussin_Backpack_PM/coussin_backpack_pm_front.png",
      "https://assetsimagesai.s3.us-east-1.amazonaws.com/v1/Coussin_Backpack_PM/coussin_backpack_pm_closeup.png",
      "https://assetsimagesai.s3.us-east-1.amazonaws.com/v1/Coussin_Backpack_PM/coussin_backpack_pm_side.png",
      "https://assetsimagesai.s3.us-east-1.amazonaws.com/v1/Coussin_Backpack_PM/coussin_backpack_pm_interior.png",
      "https://assetsimagesai.s3.us-east-1.amazonaws.com/v1/Coussin_Backpack_PM/coussin_backpack_pm_back.png",
      "https://assetsimagesai.s3.us-east-1.amazonaws.com/v1/Coussin_Backpack_PM/coussin_backpack_pm_worn.png",
    ],
  },
  {
    id: "41",
    name: "Coussin PM",
    price: 4600,
    image:
      "https://assetsimagesai.s3.us-east-1.amazonaws.com/v1/Coussin_PM/coussin_pm_front.png",
    category: "Bags",
    rating: 4.7,
    inStock: true,
    description: "Quilted handbag with contemporary design and luxurious feel",
    designer: "Louis Vuitton",
    articleNumber: "M13313",
    images: [
      "https://assetsimagesai.s3.us-east-1.amazonaws.com/v1/Coussin_PM/coussin_pm_front.png",
      "https://assetsimagesai.s3.us-east-1.amazonaws.com/v1/Coussin_PM/coussin_pm_closeup.png",
      "https://assetsimagesai.s3.us-east-1.amazonaws.com/v1/Coussin_PM/coussin_pm_side.png",
      "https://assetsimagesai.s3.us-east-1.amazonaws.com/v1/Coussin_PM/coussin_pm_interior.png",
      "https://assetsimagesai.s3.us-east-1.amazonaws.com/v1/Coussin_PM/coussin_pm_cropped_worn.png",
      "https://assetsimagesai.s3.us-east-1.amazonaws.com/v1/Coussin_PM/coussin_pm_worn.png",
    ],
  },
  {
    id: "42",
    name: "Christopher MM",
    price: 5100,
    image:
      "https://assetsimagesai.s3.us-east-1.amazonaws.com/v1/Christopher_MM/christopher_mm_front.png",
    category: "Bags",
    rating: 4.8,
    inStock: true,
    description:
      "Sophisticated backpack with premium materials and elegant design",
    designer: "Louis Vuitton",
    articleNumber: "M13863",
    images: [
      "https://assetsimagesai.s3.us-east-1.amazonaws.com/v1/Christopher_MM/christopher_mm_front.png",
      "https://assetsimagesai.s3.us-east-1.amazonaws.com/v1/Christopher_MM/christopher_mm_interior.png",
      "https://assetsimagesai.s3.us-east-1.amazonaws.com/v1/Christopher_MM/christopher_mm_back.png",
      "https://assetsimagesai.s3.us-east-1.amazonaws.com/v1/Christopher_MM/christopher_mm_cropped_worn.png",
      "https://assetsimagesai.s3.us-east-1.amazonaws.com/v1/Christopher_MM/christopher_mm_worn.png",
    ],
  },
  {
    id: "43",
    name: "Trio Messenger",
    price: 2900,
    image:
      "https://assetsimagesai.s3.us-east-1.amazonaws.com/v1/Trio_Messenger/trio_messenger_front.png",
    category: "Bags",
    rating: 4.6,
    inStock: true,
    description:
      "Versatile messenger bag with multiple compartments and modern style",
    designer: "Louis Vuitton",
    articleNumber: "M14069",
    images: [
      "https://assetsimagesai.s3.us-east-1.amazonaws.com/v1/Trio_Messenger/trio_messenger_front.png",
      "https://assetsimagesai.s3.us-east-1.amazonaws.com/v1/Trio_Messenger/trio_messenger_side.png",
      "https://assetsimagesai.s3.us-east-1.amazonaws.com/v1/Trio_Messenger/trio_messenger_interior.png",
      "https://assetsimagesai.s3.us-east-1.amazonaws.com/v1/Trio_Messenger/trio_messenger_back.png",
      "https://assetsimagesai.s3.us-east-1.amazonaws.com/v1/Trio_Messenger/trio_messenger_other.png",
      "https://assetsimagesai.s3.us-east-1.amazonaws.com/v1/Trio_Messenger/trio_messenger_other2.png",
    ],
  },
  {
    id: "44",
    name: "Avenue Slingbag PM",
    price: 2000,
    image:
      "https://assetsimagesai.s3.us-east-1.amazonaws.com/v1/Avenue_Slingbag_PM/avenue_slingbag_pm_front.png",
    category: "Bags",
    rating: 4.5,
    inStock: true,
    description:
      "Compact slingbag perfect for hands-free convenience and style",
    designer: "Louis Vuitton",
    articleNumber: "M25891",
    images: [
      "https://assetsimagesai.s3.us-east-1.amazonaws.com/v1/Avenue_Slingbag_PM/avenue_slingbag_pm_front.png",
      "https://assetsimagesai.s3.us-east-1.amazonaws.com/v1/Avenue_Slingbag_PM/avenue_slingbag_pm_side.png",
      "https://assetsimagesai.s3.us-east-1.amazonaws.com/v1/Avenue_Slingbag_PM/avenue_slingbag_pm_interior.png",
      "https://assetsimagesai.s3.us-east-1.amazonaws.com/v1/Avenue_Slingbag_PM/avenue_slingbag_pm_back.png",
    ],
  },
  {
    id: "8",
    name: "Louis Vuitton Monogram Denim Dress",
    price: 3250,
    image:
      "https://assetsimagesai.s3.us-east-1.amazonaws.com/model_pics/Louis_Vuitton_Dresses_6.png",
    category: "Clothing",
    rating: 4.8,
    inStock: true,
    description:
      "Elegant floral jacquard A-line dress with sophisticated silhouette",
    designer: "Louis Vuitton",
    articleNumber: "1AGPKU",
    images: [
      "https://assetsimagesai.s3.us-east-1.amazonaws.com/model_pics/Louis_Vuitton_Dresses_7.png",
      "https://assetsimagesai.s3.us-east-1.amazonaws.com/model_pics/Louis_Vuitton_Dresses_5.png",
      "https://assetsimagesai.s3.us-east-1.amazonaws.com/model_pics/Louis_Vuitton_Dresses_8.png",
      "https://assetsimagesai.s3.us-east-1.amazonaws.com/model_pics/Louis_Vuitton_Dresses_6.png",
    ],
    tryown: true,
    categoryFlag: true,
    keyWords: ["Denim", "A-line Dress", "Louis Vuitton", "Dresses", "Clothing", "Elegant"],
    moreInfo: "This fitted dress is a chic staple in casual washed denim finished with yellow topstitching and an allover Monogram motif. The top half is detailed with flattering princess seams and a rebellious raw-edge neckline, while a cinched waistline adds definition to the silhouette and an exposed golden zipper completes the look with a modern, sporty feel."
  },
  {
    id: "9",
    name: "Louis Vuitton LV Isola Flat Mule",
    price: 795,
    image:
      "https://assetsimagesai.s3.us-east-1.amazonaws.com/v1/LV_Isola_Flat_Mule/lv_isola_flat_mule_front.png",
    category: "Shoes",
    rating: 4.6,
    inStock: true,
    description: "Stylish flat mule with signature LV design elements",
    designer: "Louis Vuitton",
    articleNumber: "1AGYP8",
    images: [
      "https://assetsimagesai.s3.us-east-1.amazonaws.com/v1/LV_Isola_Flat_Mule/lv_isola_flat_mule_front.png",
      "https://assetsimagesai.s3.us-east-1.amazonaws.com/v1/LV_Isola_Flat_Mule/lv_isola_flat_mule_side.png",
      "https://assetsimagesai.s3.us-east-1.amazonaws.com/v1/LV_Isola_Flat_Mule/lv_isola_flat_mule_interior.png",
    ],
  },
  {
    id: "11",
    name: "Carabiner Strap Dress",
    price: 4750,
    image:
      "https://assetsimagesai.s3.us-east-1.amazonaws.com/v1/Carabiner_Strap_Dress/carabiner_strap_dress_cropped.png",
    category: "Clothing",
    rating: 4.8,
    inStock: true,
    description: "Elegant carabiner strap dress with modern design elements",
    designer: "Louis Vuitton",
    articleNumber: "1AI900",
    images: [
      "https://assetsimagesai.s3.us-east-1.amazonaws.com/v1/Carabiner_Strap_Dress/carabiner_strap_dress_front.png", 
      "https://assetsimagesai.s3.us-east-1.amazonaws.com/v1/Carabiner_Strap_Dress/carabiner_strap_dress_side.png",
      "https://assetsimagesai.s3.us-east-1.amazonaws.com/v1/Carabiner_Strap_Dress/carabiner_strap_dress_back.png",
      "https://assetsimagesai.s3.us-east-1.amazonaws.com/v1/Carabiner_Strap_Dress/carabiner_strap_dress_cropped.png",
      "https://assetsimagesai.s3.us-east-1.amazonaws.com/v1/Carabiner_Strap_Dress/carabiner_strap_dress_cropped_worn.png",
      "https://assetsimagesai.s3.us-east-1.amazonaws.com/v1/Carabiner_Strap_Dress/carabiner_strap_dress_ambiance.png",
    ],
    tryown: true,
    categoryFlag: true,
  },
  {
    id: "12",
    name: "Color_Blocked Pleat Dress",
    price: 2600,
    image:
      "https://assetsimagesai.s3.us-east-1.amazonaws.com/model_pics/test.png",
    category: "Clothing",
    rating: 4.7,
    inStock: true,
    description: "Stylish color_blocked pleat dress with contemporary design",
    designer: "Louis Vuitton",
    articleNumber: "1AHGTK",
    images: [
      "https://assetsimagesai.s3.us-east-1.amazonaws.com/model_pics/test.png",
      "https://assetsimagesai.s3.us-east-1.amazonaws.com/model_pics/color_blocked_pleat_dress_cropped.png",
      "https://assetsimagesai.s3.us-east-1.amazonaws.com/model_pics/color_blocked_pleat_dress_cropped_worn.png",
      "https://assetsimagesai.s3.us-east-1.amazonaws.com/model_pics/color_blocked_pleat_dress_ambiance.png",
      "https://assetsimagesai.s3.us-east-1.amazonaws.com/model_pics/color_blocked_pleat_dress_ambiance.png"
    ],
    tryown: true,
    categoryFlag: true,
  },
  {
    id: "13",
    name: "Signature Accent Knit Dress",
    price: 4300,
    image:
      "https://assetsimagesai.s3.us-east-1.amazonaws.com/model_pics/main_png.png",
    category: "Clothing",
    rating: 4.8,
    tryown: true,
    categoryFlag: true,
    inStock: true,
    description: "Luxurious signature accent knit dress with refined details",
    designer: "Louis Vuitton",
    articleNumber: "1AI965",
    
    images: [
      "https://assetsimagesai.s3.us-east-1.amazonaws.com/v1/Signature_Accent_Knit_Dress/signature_accent_knit_dress_side.png",
      "https://assetsimagesai.s3.us-east-1.amazonaws.com/v1/Signature_Accent_Knit_Dress/signature_accent_knit_dress_cropped.png",
      "https://assetsimagesai.s3.us-east-1.amazonaws.com/model_pics/main_png.png",
      "https://assetsimagesai.s3.us-east-1.amazonaws.com/v1/Signature_Accent_Knit_Dress/signature_accent_knit_dress_worn.png",
      "https://assetsimagesai.s3.us-east-1.amazonaws.com/v1/Signature_Accent_Knit_Dress/signature_accent_knit_dress_ambiance.png",
    ],
    keyWords: ["Knit Dress", "Navy", "Made in Italy", "Sleeveless", "Louis Vuitton", "Stylish", "Vintage"],
    moreInfo: "This versatile mid-length dress has an elegant, modern air in a fitted shape spun from a soft cotton-blend knit in a ribbed finish. Tone-on-tone silk godet inserts add spirited volume around the hemline, while the bust is highlighted with metallic Monogram Flower embellishments for an understated signature accent."
  },
  {
    id: "14",
    name: "Striped Lavalliere Dress",
    price: 4750,

    image:
      "https://assetsimagesai.s3.us-east-1.amazonaws.com/v1/Striped_Lavalliere_Dress/striped_lavalliere_dress_cropped.png",
    category: "Clothing",
    rating: 4.6,
    inStock: true,
    description: "Elegant striped lavalliere dress with sophisticated styling",
    designer: "Louis Vuitton",
    articleNumber: "1AHH09",
    images: [
      "https://assetsimagesai.s3.us-east-1.amazonaws.com/v1/Striped_Lavalliere_Dress/striped_lavalliere_dress_front.png",
      "https://assetsimagesai.s3.us-east-1.amazonaws.com/v1/Striped_Lavalliere_Dress/striped_lavalliere_dress_worn.png",
      "https://assetsimagesai.s3.us-east-1.amazonaws.com/v1/Striped_Lavalliere_Dress/striped_lavalliere_dress_ambiance.png",
      "https://assetsimagesai.s3.us-east-1.amazonaws.com/v1/Striped_Lavalliere_Dress/striped_lavalliere_dress_cropped.png",
    ],
    keyWords: ["Red Color", "Louis Vuitton", "silk", "Christmas", "Elegant", "Longdress", "fulllength","Sleeveless"],
    moreInfo: "This dress exudes elegance in silk satin in a lustrous tone-on-tone striped finish. The top half discreetly emphasizes the geometric look with pleating and a cross-over front, while the skirt falls to the ankles with fluid lines. Metallic Monogram accents add a subtle signature to the lavallière neckline and the back is fastened with an exposed zipper." 
  },
  
  {
    id: "17",
    name: "Long Monogram Parka",
    price: 4750,
    image:
      "https://assetsimagesai.s3.us-east-1.amazonaws.com/v1/Long_Monogram_Parka/long_monogram_parka_front.png",
    category: "Clothing",
    rating: 4.8,
    inStock: true,
    description: "Luxurious long parka featuring iconic monogram pattern",
    designer: "Louis Vuitton",
    articleNumber: "1AGO30",
    images: [
      "https://assetsimagesai.s3.us-east-1.amazonaws.com/v1/Long_Monogram_Parka/long_monogram_parka_front.png",
      "https://assetsimagesai.s3.us-east-1.amazonaws.com/v1/Long_Monogram_Parka/long_monogram_parka_cropped.png",
      "https://assetsimagesai.s3.us-east-1.amazonaws.com/v1/Long_Monogram_Parka/long_monogram_parka_cropped_worn.png",
      "https://assetsimagesai.s3.us-east-1.amazonaws.com/v1/Long_Monogram_Parka/long_monogram_parka_ambiance.png",
    ],
    keyWords: ["Beige", "Monogram"], 
    moreInfo: "TThis classic parka is uplifted in a fresh seasonal colorway signed all over with a subtle Monogram motif that catches the light. The long silhouette is detailed with a fishtail hem and defined at the waist with an internal drawstring, while a high collar, a hood and secure flap pockets underscore the sporty spirit of the shape."
  },
  {
    id: "18",
    name: "Tambour Street Diver, quartz, 39.5mm, steel",
    price: 5965,
    image:
      "https://assetsimagesai.s3.us-east-1.amazonaws.com/v1/Tambour_Street_Diver/tambour_street_diver_front.png",
   category: "Watches",
    rating: 4.7,
    inStock: true,
    description:
      "Professional diving watch with quartz movement and steel construction",
    designer: "Louis Vuitton",
    articleNumber: "QA124A",
    images: [
      "https://assetsimagesai.s3.us-east-1.amazonaws.com/v1/Tambour_Street_Diver/tambour_street_diver_front.png",
      "https://assetsimagesai.s3.us-east-1.amazonaws.com/v1/Tambour_Street_Diver/tambour_street_diver_other5.png",
      "https://assetsimagesai.s3.us-east-1.amazonaws.com/v1/Tambour_Street_Diver/tambour_street_diver_closeup.png",
      "https://assetsimagesai.s3.us-east-1.amazonaws.com/v1/Tambour_Street_Diver/tambour_street_diver_side.png",
      "https://assetsimagesai.s3.us-east-1.amazonaws.com/v1/Tambour_Street_Diver/tambour_street_diver_interior.png",
      "https://assetsimagesai.s3.us-east-1.amazonaws.com/v1/Tambour_Street_Diver/tambour_street_diver_back.png",
      "https://assetsimagesai.s3.us-east-1.amazonaws.com/v1/Tambour_Street_Diver/tambour_street_diver_other.png",
      "https://assetsimagesai.s3.us-east-1.amazonaws.com/v1/Tambour_Street_Diver/tambour_street_diver_back.png"
      
    ],
    keyWords: ["steel", "white", "navy", "sporty"],
    moreInfo: "This Pacific White model brings a feminine touch to the versatile Tambour Street Diver range. Casual and sporty, it combines traditional dive watch functions with the colorful, creative and unconventional style unique to Louis Vuitton. Its bright colors, contrasting finished, wateristant and luminescent indexes will add a modern twist to any outfit."
  },
  {
    id: "20",
    name: "Tambour Taiko Spin Time Air, Automatic",
    price: 85500,
    image:
      "https://assetsimagesai.s3.us-east-1.amazonaws.com/v1/Tambour_Taiko_Spin_Time/tambour_taiko_spin_time_front.png",
   category: "Watches",
    rating: 4.9,
    inStock: true,
    description:
      "Limited Edition masterpiece with flying tourbillon and innovative spin time display",
    designer: "Louis Vuitton",
    articleNumber: "W9WG11",
    images: [
      "https://assetsimagesai.s3.us-east-1.amazonaws.com/v1/Tambour_Taiko_Spin_Time/tambour_taiko_spin_time_front.png",
      "https://assetsimagesai.s3.us-east-1.amazonaws.com/v1/Tambour_Taiko_Spin_Time/tambour_taiko_spin_time_closeup.png",
      "https://assetsimagesai.s3.us-east-1.amazonaws.com/v1/Tambour_Taiko_Spin_Time/tambour_taiko_spin_time_side.png",
      "https://assetsimagesai.s3.us-east-1.amazonaws.com/v1/Tambour_Taiko_Spin_Time/tambour_taiko_spin_time_interior.png",
      "https://assetsimagesai.s3.us-east-1.amazonaws.com/v1/Tambour_Taiko_Spin_Time/tambour_taiko_spin_time_detail.png",
      "https://assetsimagesai.s3.us-east-1.amazonaws.com/v1/Tambour_Taiko_Spin_Time/tambour_taiko_spin_time_cropped.png",
    ],
    keyWords: ["18-carat", "white gold", "spin time", "dolphin", "limited edition"],
    moreInfo: "The limited edition Tambour Taiko Spin Time Air watch, the iconic and first patented movement of the house, with a Spin Time Air movement. Powered by the fully redesigned Caliber LFT ST13.01, which is housed in the Tambour Taiko case in 18-carat white gold, this piece is distinguished by a unique dolphin grey color interpreted with a sunray dial."
  },
  {
    id: "21",
    name: "Tambour Taiko Galactique, Manual, 46.7mm, Titanium and White Gold",
    price: 74500,
    image:
      "https://assetsimagesai.s3.us-east-1.amazonaws.com/v1/Tambour_Taiko_Galactique/tambour_taiko_galactique_front.png",
   category: "Watches",
    rating: 4.8,
    inStock: true,
    description:
      "Exceptional manual timepiece with galactic-inspired design in titanium and white gold",
    designer: "Louis Vuitton", 
    articleNumber: "W9TI12",
    images: [
      "https://assetsimagesai.s3.us-east-1.amazonaws.com/v1/Tambour_Taiko_Galactique/tambour_taiko_galactique_front.png",
      "https://assetsimagesai.s3.us-east-1.amazonaws.com/v1/Tambour_Taiko_Galactique/tambour_taiko_galactique_closeup.png",
      "https://assetsimagesai.s3.us-east-1.amazonaws.com/v1/Tambour_Taiko_Galactique/tambour_taiko_galactique_side.png",
      "https://assetsimagesai.s3.us-east-1.amazonaws.com/v1/Tambour_Taiko_Galactique/tambour_taiko_galactique_back.png",
      "https://assetsimagesai.s3.us-east-1.amazonaws.com/v1/Tambour_Taiko_Galactique/tambour_taiko_galactique_cropped.png",
    ],
    keyWords: ["titanium", "white gold", "galactic", "astronaut", "blue", "engraving", "limited edition"],  
    moreInfo: "The Tambour Taiko Galactique embarks on a bold space odyssey, where exploration meets innovation. This timepiece opens a new chapter in the journey of Louis Vuitton automata, housed in an all-new titanium and white gold case with a distinctly futuristic design and a crown positioned at 12 o’clock. Powered by the LFT AU14.02 calibre — combining a cathedral gong minute repeater with an automata — the watch comes to life through seven animations. Exceptional engraving work brings striking depth and realism to the astronautscene, while a fusion of enameling techniques creates a beautiful interplay of colors and textures."
  },
  {
    id: "22",
    name: "Tambour Bushido Automata, Manual, 46.8 mm, Pink Gold",
    price: 75000,
    image:
      "https://assetsimagesai.s3.us-east-1.amazonaws.com/v1/Tambour_Bushido_Automata/tambour_bushido_automata_front.png",
   category: "Watches",
    rating: 4.9,
    inStock: true,
    description:
      "Extraordinary manual watch with automata complications and Bushido-inspired design in pink gold",
    designer: "Louis Vuitton",
    articleNumber: "W1PG31",
    images: [
      "https://assetsimagesai.s3.us-east-1.amazonaws.com/v1/Tambour_Bushido_Automata/tambour_bushido_automata_front.png",
      "https://assetsimagesai.s3.us-east-1.amazonaws.com/v1/Tambour_Bushido_Automata/tambour_bushido_automata_side.png",
      "https://assetsimagesai.s3.us-east-1.amazonaws.com/v1/Tambour_Bushido_Automata/tambour_bushido_automata_interior.png",
      "https://assetsimagesai.s3.us-east-1.amazonaws.com/v1/Tambour_Bushido_Automata/tambour_bushido_automata_back.png",
      "https://assetsimagesai.s3.us-east-1.amazonaws.com/v1/Tambour_Bushido_Automata/tambour_bushido_automata_other2.png",
      "https://assetsimagesai.s3.us-east-1.amazonaws.com/v1/Tambour_Bushido_Automata/tambour_bushido_automata_cropped.png",
    ],
  keyWords: [" pink gold", "pirate", "samurai", "award-winning"], 
  moreInfo: "Taking its name from the code of conduct of the Japanese Samurai, the Tambour Bashido Automata is an homage to strength, discipline and artistic expression. The dial, which is embellished with a striking Samurai mask, features five different animations. These are powered by the award-winning LV 525 caliber and it reveals the time on demand. The intricacy of enamelling and engraving pushes the boundaries of the Métiers d'Art to celebrate Japanese culture, all around the case."
},
    {
    id: "23",
    name: "LV BUTTERSOFT Sneaker",
    price: 1400,
    image:
      "https://assetsimagesai.s3.us-east-1.amazonaws.com/v1/LV_BUTTERSOFT_Sneaker/lv_buttersoft_sneaker_back.png",
    category: "Shoes",
    rating: 4.8,
    inStock: true,
    description:
      "Premium sneaker with buttersoft leather construction and contemporary design",
    designer: "Louis Vuitton",
    articleNumber: "1AIKVD",
    images: [
      "https://assetsimagesai.s3.us-east-1.amazonaws.com/v1/LV_BUTTERSOFT_Sneaker/lv_buttersoft_sneaker_back.png",
      "https://assetsimagesai.s3.us-east-1.amazonaws.com/v1/LV_BUTTERSOFT_Sneaker/lv_buttersoft_sneaker_front.png",
      "https://assetsimagesai.s3.us-east-1.amazonaws.com/v1/LV_BUTTERSOFT_Sneaker/lv_buttersoft_sneaker_interior.png",
      "https://assetsimagesai.s3.us-east-1.amazonaws.com/v1/LV_BUTTERSOFT_Sneaker/lv_buttersoft_sneaker_back.png",
      "https://assetsimagesai.s3.us-east-1.amazonaws.com/v1/LV_BUTTERSOFT_Sneaker/lv_buttersoft_sneaker_side.png",
    ],
  },
  {
    id: "24",
    name: "LV Resort Sneaker",
    price: 925,
    image:
      "https://assetsimagesai.s3.us-east-1.amazonaws.com/v1/LV_Resort_Sneaker/lv_resort_sneaker_front.png",
    category: "Shoes",
    rating: 4.6,
    inStock: true,
    description:
      "Casual resort-style sneaker perfect for leisure and vacation wear",
    designer: "Louis Vuitton",
    articleNumber: "1AHQOZ",
    images: [
      "https://assetsimagesai.s3.us-east-1.amazonaws.com/v1/LV_Resort_Sneaker/lv_resort_sneaker_front.png",
      "https://assetsimagesai.s3.us-east-1.amazonaws.com/v1/LV_Resort_Sneaker/lv_resort_sneaker_side.png",
      "https://assetsimagesai.s3.us-east-1.amazonaws.com/v1/LV_Resort_Sneaker/lv_resort_sneaker_interior.png",
      "https://assetsimagesai.s3.us-east-1.amazonaws.com/v1/LV_Resort_Sneaker/lv_resort_sneaker_back.png",
      "https://assetsimagesai.s3.us-east-1.amazonaws.com/v1/LV_Resort_Sneaker/lv_resort_sneaker_other.png",
    ],
  },
  {
    id: "25",
    name: "Major Loafer",
    price: 1140,
    image:
      "https://assetsimagesai.s3.us-east-1.amazonaws.com/v1/Major_Loafer/major_loafer_front.png",
    category: "Shoes",
    rating: 4.7,
    inStock: true,
    description:
      "Sophisticated loafer with classic design and premium leather construction",
    designer: "Louis Vuitton",
    articleNumber: "1AHPZL",
    images: [
      "https://assetsimagesai.s3.us-east-1.amazonaws.com/v1/Major_Loafer/major_loafer_front.png",
      "https://assetsimagesai.s3.us-east-1.amazonaws.com/v1/Major_Loafer/major_loafer_side.png",
      "https://assetsimagesai.s3.us-east-1.amazonaws.com/v1/Major_Loafer/major_loafer_interior.png",
      "https://assetsimagesai.s3.us-east-1.amazonaws.com/v1/Major_Loafer/major_loafer_back.png",
      "https://assetsimagesai.s3.us-east-1.amazonaws.com/v1/Major_Loafer/major_loafer_other.png",
    ],
  },
  {
    id: "26",
    name: "LV BUTTERSOFT Sneaker (White)",
    price: 1150,
    image:
      "https://assetsimagesai.s3.us-east-1.amazonaws.com/v1/LV_BUTTERSOFT_Sneaker_White/lv_buttersoft_sneaker_white_back.png",
    category: "Shoes",
    rating: 4.8,
    inStock: true,
    description:
      "Premium white buttersoft sneaker with exceptional comfort and style",
    designer: "Louis Vuitton",
    articleNumber: "1AIKE2",
    images: [
      "https://assetsimagesai.s3.us-east-1.amazonaws.com/v1/LV_BUTTERSOFT_Sneaker_White/lv_buttersoft_sneaker_white_back.png",
      "https://assetsimagesai.s3.us-east-1.amazonaws.com/v1/LV_BUTTERSOFT_Sneaker_White/lv_buttersoft_sneaker_white_interior.png",
      "https://assetsimagesai.s3.us-east-1.amazonaws.com/v1/LV_BUTTERSOFT_Sneaker_White/lv_buttersoft_sneaker_white_front.png",
    ],
  },
  {
    id: "27",
    name: "LV Skate Sneaker",
    price: 1520,
    image:
      "https://assetsimagesai.s3.us-east-1.amazonaws.com/v1/LV_Skate_Sneaker/lv_skate_sneaker_front.png",
    category: "Shoes",
    rating: 4.9,
    inStock: true,
    description:
      "Urban skate-inspired sneaker with modern design and superior durability",
    designer: "Louis Vuitton",
    articleNumber: "1ACVJA",
    images: [
      "https://assetsimagesai.s3.us-east-1.amazonaws.com/v1/LV_Skate_Sneaker/lv_skate_sneaker_front.png",
      "https://assetsimagesai.s3.us-east-1.amazonaws.com/v1/LV_Skate_Sneaker/lv_skate_sneaker_side.png",
      "https://assetsimagesai.s3.us-east-1.amazonaws.com/v1/LV_Skate_Sneaker/lv_skate_sneaker_back.png",
    ],
  },
  {
    id: "28",
    name: "LV x TM LV Trainer Sneaker",
    price: 1660,
    image:
      "https://assetsimagesai.s3.us-east-1.amazonaws.com/v1/LV_x_TM_LV_Trainer/lv_x_tm_lv_trainer_sneaker_back.png",
    category: "Shoes",
    rating: 4.8,
    inStock: true,
    description:
      "Exclusive collaboration trainer sneaker with innovative design and premium materials",
    designer: "Louis Vuitton",
    articleNumber: "1AHEKZ",
    images: [
      "https://assetsimagesai.s3.us-east-1.amazonaws.com/v1/LV_x_TM_LV_Trainer/lv_x_tm_lv_trainer_sneaker_back.png",
      "https://assetsimagesai.s3.us-east-1.amazonaws.com/v1/LV_x_TM_LV_Trainer/lv_x_tm_lv_trainer_sneaker_front.png",
      "https://assetsimagesai.s3.us-east-1.amazonaws.com/v1/LV_x_TM_LV_Trainer/lv_x_tm_lv_trainer_sneaker_side.png",
      "https://assetsimagesai.s3.us-east-1.amazonaws.com/v1/LV_x_TM_LV_Trainer/lv_x_tm_lv_trainer_sneaker_other.png",
      "https://assetsimagesai.s3.us-east-1.amazonaws.com/v1/LV_x_TM_LV_Trainer/lv_x_tm_lv_trainer_sneaker_front.png",
      "https://assetsimagesai.s3.us-east-1.amazonaws.com/v1/LV_x_TM_LV_Trainer/lv_x_tm_lv_trainer_sneaker_side.png",
      "https://assetsimagesai.s3.us-east-1.amazonaws.com/v1/LV_x_TM_LV_Trainer/lv_x_tm_lv_trainer_sneaker_interior.png",
    ],
  },
  {
    id: "29",
    name: "Run Away Sneaker",
    price: 1080,
    image:
      "https://assetsimagesai.s3.us-east-1.amazonaws.com/v1/Run_Away_Sneaker/run_away_sneaker_front.png",
    category: "Shoes",
    rating: 4.7,
    inStock: true,
    description:
      "Athletic-inspired sneaker with contemporary design and exceptional comfort",
    designer: "Louis Vuitton",
    articleNumber: "1ADG5C",
    images: [
      "https://assetsimagesai.s3.us-east-1.amazonaws.com/v1/Run_Away_Sneaker/run_away_sneaker_front.png",
      "https://assetsimagesai.s3.us-east-1.amazonaws.com/v1/Run_Away_Sneaker/run_away_sneaker_side.png",
      "https://assetsimagesai.s3.us-east-1.amazonaws.com/v1/Run_Away_Sneaker/run_away_sneaker_interior.png",
      "https://assetsimagesai.s3.us-east-1.amazonaws.com/v1/Run_Away_Sneaker/run_away_sneaker_back.png",
      "https://assetsimagesai.s3.us-east-1.amazonaws.com/v1/Run_Away_Sneaker/run_away_sneaker_cropped_worn.png",
      "https://assetsimagesai.s3.us-east-1.amazonaws.com/v1/Run_Away_Sneaker/run_away_sneaker_worn.png",
    ],
  },
];
