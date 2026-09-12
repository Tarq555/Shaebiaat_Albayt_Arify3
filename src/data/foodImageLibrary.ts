export interface FoodPresetImage {
  id: string;
  nameAr: string;
  nameEn: string;
  category: 'mains' | 'pots' | 'sajiya' | 'grills' | 'appetizers' | 'breads' | 'desserts' | 'drinks' | 'breakfast';
  url: string;
  tagAr: string;
}

export const FOOD_PRESET_IMAGES: FoodPresetImage[] = [
  // 1. أطباق المندي والولائم والحنيذ
  {
    id: 'mandi-lamb-1',
    nameAr: 'مندي لحم تيس بلدي فاخر',
    nameEn: 'Royal Lamb Mandi Platter',
    category: 'mains',
    tagAr: 'مندي ولائم',
    url: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'mandi-chicken-1',
    nameAr: 'مندي دجاج محمر على الحطب',
    nameEn: 'Wood-Fired Chicken Mandi',
    category: 'mains',
    tagAr: 'مندي دجاج',
    url: 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'zurbian-lamb-1',
    nameAr: 'زربيان عدني بلحم الضأن والزعفران',
    nameEn: 'Adeni Zurbian with Saffron',
    category: 'mains',
    tagAr: 'زربيان ملكي',
    url: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'kabsa-hashi-1',
    nameAr: 'كبسة حاشي برية بالرز الشعبي',
    nameEn: 'Wild Camel Kabsa Rice Platter',
    category: 'mains',
    tagAr: 'كبسة حاشي',
    url: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'haneeth-lamb-1',
    nameAr: 'حنيذ لحم بالمرخ والسلع',
    nameEn: 'Traditional Haneeth Lamb in Marakh',
    category: 'mains',
    tagAr: 'حنيذ تهامي',
    url: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=900&q=80',
  },

  // 2. الفخاريات والمقالي
  {
    id: 'fahsa-pot-1',
    nameAr: 'فحسة يمنية تفور باللحم والمرق',
    nameEn: 'Boiling Hot Beef Fahsa Pot',
    category: 'pots',
    tagAr: 'فحسة حجر',
    url: 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'saltah-sanaani-1',
    nameAr: 'سلتة صنعانية بالحلبة والخضار',
    nameEn: 'Traditional Sanaani Saltah with Holba',
    category: 'pots',
    tagAr: 'سلتة صنعانية',
    url: 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'ogda-chicken-1',
    nameAr: 'عقدة دجاج يمنية بالبهارات',
    nameEn: 'Spiced Yemeni Ogda Chicken Pot',
    category: 'pots',
    tagAr: 'عقدة دجاج',
    url: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'ogda-meat-1',
    nameAr: 'عقدة لحم بلدي مفروم في المقلى',
    nameEn: 'Minced Beef Ogda Pot',
    category: 'pots',
    tagAr: 'عقدة لحم',
    url: 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=900&q=80',
  },

  // 3. الصاج والمقلقل والكبدة
  {
    id: 'fresh-liver-1',
    nameAr: 'كبدة حاشي / غنم بلدي طازجة بالصاج',
    nameEn: 'Fresh Spiced Hashi / Lamb Liver',
    category: 'sajiya',
    tagAr: 'كبدة صاج',
    url: 'https://images.unsplash.com/photo-1529042410759-befb1204b468?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'mugalgal-meat-1',
    nameAr: 'مقلقل لحم طازج مع البصل والفلفل',
    nameEn: 'Sizzling Spiced Beef / Lamb Mugalgal',
    category: 'sajiya',
    tagAr: 'مقلقل لحم',
    url: 'https://images.unsplash.com/photo-1603360946369-dc9bb6258143?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'mugalgal-chicken-1',
    nameAr: 'مقلقل دجاج صاج بالليمون والكمون',
    nameEn: 'Pan-Seared Chicken Mugalgal',
    category: 'sajiya',
    tagAr: 'مقلقل دجاج',
    url: 'https://images.unsplash.com/photo-1603360946369-dc9bb6258143?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'madhbi-stone-1',
    nameAr: 'مظبي دجاج مشوي على الحصى البركاني',
    nameEn: 'Volcanic Stone Madhbi Chicken',
    category: 'grills',
    tagAr: 'مظبي حجر',
    url: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=900&q=80',
  },

  // 4. الفطور والقلابات
  {
    id: 'foul-qallaba-1',
    nameAr: 'فول قلابة يمني بالسمن والكمون',
    nameEn: 'Foul Qallaba with Ghee',
    category: 'breakfast',
    tagAr: 'فول قلابة',
    url: 'https://images.unsplash.com/photo-1541832676-9b763b0239ab?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'shakshouka-adeni-1',
    nameAr: 'شكشوكة عدنية بالجبن السائل',
    nameEn: 'Adeni Shakshouka with Melted Cheese',
    category: 'breakfast',
    tagAr: 'شكشوكة جبن',
    url: 'https://images.unsplash.com/photo-1590412200988-a436970781fa?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'fasolia-nashfa-1',
    nameAr: 'فاصوليا مقلية ومحمسة بالسمن',
    nameEn: 'Pan-Fried Dry Spiced Beans',
    category: 'breakfast',
    tagAr: 'فاصوليا ناشفة',
    url: 'https://images.unsplash.com/photo-1541832676-9b763b0239ab?auto=format&fit=crop&w=900&q=80',
  },

  // 5. المطبق والمقبلات والسمبوسة
  {
    id: 'mutabbaq-savory-1',
    nameAr: 'مطبق يمني مالح باللحم المفروم والبيض',
    nameEn: 'Crispy Yemeni Stuffed Mutabbaq',
    category: 'appetizers',
    tagAr: 'مطبق مقرمش',
    url: 'https://images.unsplash.com/photo-1509722747041-616f39b57569?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'sambusa-crispy-1',
    nameAr: 'سمبوسة مقرمشة باللحم والبهارات',
    nameEn: 'Golden Fried Meat Sambusa',
    category: 'appetizers',
    tagAr: 'سمبوسة ذهبية',
    url: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'shafout-herbs-1',
    nameAr: 'شفوت صنعاني باللحوح والزبادي والنعناع',
    nameEn: 'Traditional Shafout with Mint Buttermilk',
    category: 'appetizers',
    tagAr: 'شفوت صنعاني',
    url: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=900&q=80',
  },

  // 6. المخبوزات والتنور
  {
    id: 'mulawah-bread-1',
    nameAr: 'خبز ملوح يمني عملاق بالسمن البلدي',
    nameEn: 'Giant Flaky Mulawah Flatbread',
    category: 'breads',
    tagAr: 'ملوح عملاق',
    url: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'tamees-biscuit-1',
    nameAr: 'خبز تميس بسكوت بالسمسم',
    nameEn: 'Crisp Tamees Bread with Sesame',
    category: 'breads',
    tagAr: 'تميس بسكوت',
    url: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=900&q=80',
  },

  // 7. الحلويات والمعصوب والعريكة
  {
    id: 'masoub-royal-1',
    nameAr: 'معصوب ملكي بالقشطة والمكسرات والعسل',
    nameEn: 'Royal Masoub with Cream, Almonds & Honey',
    category: 'desserts',
    tagAr: 'معصوب ملكي',
    url: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'arika-royal-1',
    nameAr: 'عريكة جنوبية فاخرة بالتمر والسمن',
    nameEn: 'Royal Southern Arika with Dates & Ghee',
    category: 'desserts',
    tagAr: 'عريكة ملكية',
    url: 'https://images.unsplash.com/photo-1587314168485-3236d6710814?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'bint-al-sahn-1',
    nameAr: 'بنت الصحن الملكية بالعسل الدوعني',
    nameEn: 'Royal Bint Al-Sahn with Sidr Honey',
    category: 'desserts',
    tagAr: 'بنت الصحن',
    url: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=900&q=80',
  },

  // 8. المشروبات والشاي العدني
  {
    id: 'shai-adeni-1',
    nameAr: 'شاي عدني مخدر بالحليب والهيل والقرنفل',
    nameEn: 'Adeni Spiced Karak Milk Tea',
    category: 'drinks',
    tagAr: 'شاي عدني كرك',
    url: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'qishr-coffee-1',
    nameAr: 'قهوة قشر صنعانية بالزنجبيل والقرفة',
    nameEn: 'Sanaani Spiced Qishr Coffee',
    category: 'drinks',
    tagAr: 'قهوة قشر',
    url: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'saudi-coffee-1',
    nameAr: 'قهوة سعودية شقراء بالهيل والزعفران والتمر',
    nameEn: 'Golden Saudi Arabic Coffee with Saffron & Dates',
    category: 'drinks',
    tagAr: 'قهوة سعودية',
    url: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'mango-juice-1',
    nameAr: 'عصير مانجو فرغلي طبيعي طازج',
    nameEn: 'Fresh Mango Natural Juice',
    category: 'drinks',
    tagAr: 'عصير طازج',
    url: 'https://images.unsplash.com/photo-1621263764928-df1444c5e859?auto=format&fit=crop&w=900&q=80',
  }
];
