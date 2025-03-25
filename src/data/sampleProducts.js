// Sample product data for the MOONCHILD clothing application
// This would typically come from your database/backend

const sampleProducts = [
    {
      id: 'p1',
      name: 'Luna Oversized Tee',
      description: 'An oversized t-shirt with crescent moon print. Made from 100% organic cotton for ultimate comfort.',
      price: 39.99,
      category: 'tops',
      subcategory: 'tshirts',
      images: [
        '/images/products/luna-tee-1.jpg',
        '/images/products/luna-tee-2.jpg',
        '/images/products/luna-tee-3.jpg',
      ],
      availableSizes: ['XS', 'S', 'M', 'L', 'XL'],
      availableColors: ['Black', 'White', 'Gray'],
      material: 'Organic Cotton',
      details: [
        'Relaxed, oversized fit',
        'Crew neckline',
        'Drop shoulders',
        'Moon phase print',
        'Sustainably made'
      ],
      isNew: true,
      isFeatured: true,
      brand: 'MOONCHILD',
      style: 'casual',
      createdAt: '2023-01-15T12:00:00Z'
    },
    {
      id: 'p2',
      name: 'Astral High-Waisted Jeans',
      description: 'High-waisted jeans with star embroidery details. Offers the perfect balance of style and comfort.',
      price: 89.99,
      category: 'bottoms',
      subcategory: 'jeans',
      images: [
        '/images/products/astral-jeans-1.jpg',
        '/images/products/astral-jeans-2.jpg',
      ],
      availableSizes: ['XS', 'S', 'M', 'L', 'XL'],
      availableColors: ['Indigo', 'Black'],
      material: 'Cotton, Elastane',
      details: [
        'High-waisted design',
        'Straight leg cut',
        'Star embroidery on back pockets',
        'Five-pocket styling',
        'Button and zip closure'
      ],
      isNew: true,
      isFeatured: false,
      brand: 'MOONCHILD',
      style: 'casual',
      createdAt: '2023-01-20T12:00:00Z'
    },
    {
      id: 'p3',
      name: 'Celestial Slip Dress',
      description: 'A satin slip dress with celestial print. Perfect for evening events or dressed down with a tee underneath.',
      price: 79.99,
      category: 'dresses',
      subcategory: 'slip dresses',
      images: [
        '/images/products/celestial-dress-1.jpg',
        '/images/products/celestial-dress-2.jpg',
        '/images/products/celestial-dress-3.jpg',
      ],
      availableSizes: ['XS', 'S', 'M', 'L'],
      availableColors: ['Navy', 'Burgundy'],
      material: 'Satin',
      details: [
        'Mid-length',
        'V-neckline',
        'Adjustable straps',
        'Star and moon print',
        'Side slit'
      ],
      isNew: false,
      isFeatured: true,
      discountPercentage: 15,
      brand: 'MOONCHILD',
      style: 'elegant',
      createdAt: '2022-11-05T12:00:00Z'
    },
    {
      id: 'p4',
      name: 'Moonstone Crop Cardigan',
      description: 'A cropped cardigan with pearl button details resembling moonstones. Perfect layering piece for all seasons.',
      price: 59.99,
      category: 'tops',
      subcategory: 'cardigans',
      images: [
        '/images/products/moonstone-cardigan-1.jpg',
        '/images/products/moonstone-cardigan-2.jpg',
      ],
      availableSizes: ['S', 'M', 'L'],
      availableColors: ['Cream', 'Black', 'Lilac'],
      material: 'Cotton Blend',
      details: [
        'Cropped length',
        'V-neckline',
        'Pearl-like button closure',
        'Ribbed cuffs and hem',
        'Soft, stretchy fabric'
      ],
      isNew: false,
      isFeatured: true,
      brand: 'MOONCHILD',
      style: 'casual',
      createdAt: '2022-12-10T12:00:00Z'
    },
    {
      id: 'p5',
      name: 'Eclipse Wide-Leg Pants',
      description: 'Flowy wide-leg pants with a high waist and side pockets. Features a subtle eclipse embroidery at the waistband.',
      price: 69.99,
      category: 'bottoms',
      subcategory: 'pants',
      images: [
        '/images/products/eclipse-pants-1.jpg',
        '/images/products/eclipse-pants-2.jpg',
      ],
      availableSizes: ['XS', 'S', 'M', 'L', 'XL'],
      availableColors: ['Black', 'Olive', 'Navy'],
      material: 'Viscose Blend',
      details: [
        'High-waisted design',
        'Wide-leg silhouette',
        'Side pockets',
        'Eclipse embroidery detail',
        'Flowy fabric'
      ],
      isNew: false,
      isFeatured: false,
      brand: 'MOONCHILD',
      style: 'bohemian',
      createdAt: '2022-10-15T12:00:00Z'
    },
    {
      id: 'p6',
      name: 'Stardust Beaded Necklace',
      description: 'A delicate beaded necklace with star charms. Adjustable length and hypoallergenic materials.',
      price: 29.99,
      category: 'accessories',
      subcategory: 'jewelry',
      images: [
        '/images/products/stardust-necklace-1.jpg',
        '/images/products/stardust-necklace-2.jpg',
      ],
      availableColors: ['Silver', 'Gold'],
      material: 'Stainless Steel, Glass Beads',
      details: [
        'Adjustable length: 16-19 inches',
        'Star pendant charms',
        'Lobster clasp closure',
        'Hypoallergenic materials',
        'Handcrafted with care'
      ],
      isNew: true,
      isFeatured: true,
      brand: 'MOONCHILD',
      style: 'bohemian',
      createdAt: '2023-01-25T12:00:00Z'
    },
    {
      id: 'p7',
      name: 'Cosmic Oversized Blazer',
      description: 'An oversized blazer with subtle cosmic pattern lining. Versatile enough for work or evening events.',
      price: 119.99,
      category: 'outerwear',
      subcategory: 'blazers',
      images: [
        '/images/products/cosmic-blazer-1.jpg',
        '/images/products/cosmic-blazer-2.jpg',
        '/images/products/cosmic-blazer-3.jpg',
      ],
      availableSizes: ['XS', 'S', 'M', 'L', 'XL'],
      availableColors: ['Black', 'Charcoal'],
      material: 'Polyester Blend',
      details: [
        'Oversized fit',
        'Single-button closure',
        'Notched lapels',
        'Front flap pockets',
        'Cosmic pattern lining',
        'Back vent'
      ],
      isNew: false,
      isFeatured: true,
      brand: 'MOONCHILD',
      style: 'business',
      createdAt: '2022-09-20T12:00:00Z'
    },
    {
      id: 'p8',
      name: 'Moonlight Satin Skirt',
      description: 'A midi satin skirt with subtle shimmer effect reminiscent of moonlight on water. Features a comfortable elastic waistband.',
      price: 65.99,
      category: 'bottoms',
      subcategory: 'skirts',
      images: [
        '/images/products/moonlight-skirt-1.jpg',
        '/images/products/moonlight-skirt-2.jpg',
      ],
      availableSizes: ['XS', 'S', 'M', 'L'],
    availableColors: ['Silver', 'Champagne', 'Black'],
    material: 'Satin',
    details: [
      'Midi length',
      'A-line silhouette',
      'Elastic waistband',
      'Subtle shimmer effect',
      'Flowy fabric'
    ],
    isNew: true,
    isFeatured: false,
    brand: 'MOONCHILD',
    style: 'elegant',
    createdAt: '2023-01-08T12:00:00Z'
  },
  {
    id: 'p9',
    name: 'Northern Lights Scarf',
    description: 'A soft, flowing scarf with a watercolor print inspired by the Northern Lights. Perfect for adding a touch of color to any outfit.',
    price: 34.99,
    category: 'accessories',
    subcategory: 'scarves',
    images: [
      '/images/products/northern-lights-scarf-1.jpg',
      '/images/products/northern-lights-scarf-2.jpg',
    ],
    availableColors: ['Aurora', 'Twilight'],
    material: 'Modal',
    details: [
      'Dimensions: 70" x 25"',
      'Watercolor aurora print',
      'Lightweight and soft',
      'Ethically sourced materials',
      'Fringe edges'
    ],
    isNew: false,
    isFeatured: false,
    discountPercentage: 20,
    brand: 'MOONCHILD',
    style: 'bohemian',
    createdAt: '2022-08-18T12:00:00Z'
  },
  {
    id: 'p10',
    name: 'Crescent Moon Hoodie',
    description: 'A comfortable oversized hoodie with crescent moon embroidery. Made from soft, sustainable fabric.',
    price: 69.99,
    category: 'tops',
    subcategory: 'hoodies',
    images: [
      '/images/products/crescent-hoodie-1.jpg',
      '/images/products/crescent-hoodie-2.jpg',
    ],
    availableSizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    availableColors: ['Black', 'Gray', 'Sage'],
    material: 'Organic Cotton, Recycled Polyester',
    details: [
      'Oversized, relaxed fit',
      'Drawstring hood',
      'Kangaroo pocket',
      'Crescent moon embroidery',
      'Ribbed cuffs and hem',
      'Made from sustainable materials'
    ],
    isNew: false,
    isFeatured: true,
    discountPercentage: 10,
    brand: 'MOONCHILD',
    style: 'casual',
    createdAt: '2022-11-25T12:00:00Z'
  }
];

export default sampleProducts;