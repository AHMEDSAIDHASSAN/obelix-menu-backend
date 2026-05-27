require('dotenv').config();
const mongoose = require('mongoose');
const Category = require('./models/Category');
const SubCategory = require('./models/SubCategory');
const Product = require('./models/Product');
const Offer = require('./models/Offer');

const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/obelix-menu';

const img = (id) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=500&q=80`;

const categories = [
  { name: 'Biryani',   nameAr: 'برياني',    order: 1, image: img('1631452180519-c014fe946bc7') },
  { name: 'Burgers',   nameAr: 'برجر',       order: 2, image: img('1568901346375-23c9450c58cd') },
  { name: 'Pizza',     nameAr: 'بيتزا',      order: 3, image: img('1565299624946-b28f40a0ae38') },
  { name: 'Pasta',     nameAr: 'مكرونة',     order: 4, image: img('1555949258-eb67b1ef0ceb') },
  { name: 'Desserts',  nameAr: 'حلويات',     order: 5, image: img('1606313564200-e75d5e30476c') },
  { name: 'Drinks',    nameAr: 'مشروبات',    order: 6, image: img('1509042239860-f550ce710b93') },
];

async function seed() {
  await mongoose.connect(MONGO_URI);
  console.log('Connected to MongoDB');

  await Promise.all([
    Category.deleteMany({}),
    SubCategory.deleteMany({}),
    Product.deleteMany({}),
    Offer.deleteMany({}),
  ]);
  console.log('Cleared old data');

  const cats = await Category.insertMany(categories);
  const c = {};
  cats.forEach((cat) => { c[cat.name] = cat._id; });
  console.log('Categories created');

  const subCategories = [
    { name: 'Chicken Biryani', nameAr: 'برياني دجاج',   category: c['Biryani'],  order: 1 },
    { name: 'Mutton Biryani',  nameAr: 'برياني لحم',    category: c['Biryani'],  order: 2 },
    { name: 'Veg Biryani',     nameAr: 'برياني خضار',   category: c['Biryani'],  order: 3 },
    { name: 'Classic Burgers', nameAr: 'برجر كلاسيك',   category: c['Burgers'],  order: 1 },
    { name: 'Smash Burgers',   nameAr: 'سماش برجر',     category: c['Burgers'],  order: 2 },
    { name: 'Margherita',      nameAr: 'مارجريتا',      category: c['Pizza'],    order: 1 },
    { name: 'Special Pizza',   nameAr: 'بيتزا خاصة',    category: c['Pizza'],    order: 2 },
    { name: 'Hot Drinks',      nameAr: 'مشروبات ساخنة', category: c['Drinks'],   order: 1 },
    { name: 'Cold Drinks',     nameAr: 'مشروبات باردة', category: c['Drinks'],   order: 2 },
  ];
  const subs = await SubCategory.insertMany(subCategories);
  const s = {};
  subs.forEach((sub) => { s[sub.name] = sub._id; });
  console.log('SubCategories created');

  const products = [
    /* ── Biryani ───────────────────────────────────────── */
    {
      name: 'Hyderabadi Biryani', nameAr: 'برياني حيدر آباد',
      description: 'A culinary masterpiece that tantalizes the senses with its aromatic spices, tender meat and fragrant basmati rice. Originating from the vibrant city of Hyderabad in India, this iconic dish has been delighting food lovers for centuries.',
      category: c['Biryani'], subCategory: s['Chicken Biryani'],
      image: img('1631452180519-c014fe946bc7'),
      basePrice: 7.50,
      sizes: [{ label: 'Small', price: 7.50 }, { label: 'Half', price: 10.00 }, { label: 'Full', price: 14.00 }],
      isFeatured: true, tags: ['spicy', 'rice', 'popular'], order: 1,
    },
    {
      name: 'Veg Dum Biryani', nameAr: 'برياني خضار دم',
      description: 'Fresh seasonal vegetables slow-cooked with aromatic basmati rice, saffron and whole spices.',
      category: c['Biryani'], subCategory: s['Veg Biryani'],
      image: img('1596797038530-2c107229654b'),
      basePrice: 5.50,
      sizes: [{ label: 'Small', price: 5.50 }, { label: 'Full', price: 9.00 }],
      isFeatured: true, tags: ['vegetarian', 'rice'], order: 2,
    },
    {
      name: 'Mutton Dum Biryani', nameAr: 'برياني لحم دم',
      description: 'Slow-cooked tender mutton with saffron-infused basmati rice and fried onions.',
      category: c['Biryani'], subCategory: s['Mutton Biryani'],
      image: img('1589302168068-964664d93dc0'),
      basePrice: 9.50, discount: 10,
      sizes: [{ label: 'Half', price: 9.50 }, { label: 'Full', price: 16.00 }],
      isFeatured: true, tags: ['mutton', 'premium', 'spicy'], order: 3,
    },
    {
      name: 'Chicken Tikka Biryani', nameAr: 'برياني تيكا دجاج',
      description: 'Grilled chicken tikka pieces layered with fragrant basmati rice and mint chutney.',
      category: c['Biryani'], subCategory: s['Chicken Biryani'],
      image: img('1567188040759-fb8a883dc6d8'),
      basePrice: 8.00,
      tags: ['chicken', 'grilled'], order: 4,
    },

    /* ── Burgers ────────────────────────────────────────── */
    {
      name: 'Classic Smash Burger', nameAr: 'سماش برجر كلاسيك',
      description: 'Double smash beef patty with melted cheddar, pickles, caramelised onions and our secret sauce on a brioche bun.',
      category: c['Burgers'], subCategory: s['Smash Burgers'],
      image: img('1568901346375-23c9450c58cd'),
      basePrice: 8.50, discount: 15,
      sizes: [{ label: 'Single', price: 8.50 }, { label: 'Double', price: 11.50 }],
      isFeatured: true, tags: ['beef', 'cheese', 'popular'], order: 1,
    },
    {
      name: 'Crispy Chicken Burger', nameAr: 'برجر دجاج مقرمش',
      description: 'Crispy fried chicken breast with crunchy coleslaw and honey mustard sauce.',
      category: c['Burgers'], subCategory: s['Classic Burgers'],
      image: img('1553979459-d1e1de0e2b18'),
      basePrice: 7.00,
      tags: ['chicken', 'crispy'], order: 2,
    },
    {
      name: 'BBQ Bacon Burger', nameAr: 'برجر باربكيو',
      description: 'Juicy beef patty with smoky BBQ sauce, crispy onion rings and fresh jalapeños.',
      category: c['Burgers'], subCategory: s['Classic Burgers'],
      image: img('1586190848861-99aa4a171e90'),
      basePrice: 9.00, discount: 20,
      tags: ['beef', 'bbq', 'spicy'], order: 3,
    },
    {
      name: 'Mushroom Swiss Burger', nameAr: 'برجر فطر وجبن سويسري',
      description: 'Beef patty topped with sautéed mushrooms, melted Swiss cheese and truffle mayo.',
      category: c['Burgers'], subCategory: s['Smash Burgers'],
      image: img('1499028344343-cd173ffc8fd6'),
      basePrice: 9.50,
      tags: ['beef', 'mushroom'], order: 4,
    },

    /* ── Pizza ──────────────────────────────────────────── */
    {
      name: 'Margherita Pizza', nameAr: 'بيتزا مارجريتا',
      description: 'Classic Neapolitan pizza with San Marzano tomato sauce, fresh mozzarella di bufala and basil leaves.',
      category: c['Pizza'], subCategory: s['Margherita'],
      image: img('1565299624946-b28f40a0ae38'),
      basePrice: 10.00,
      sizes: [{ label: 'Small', price: 10.00 }, { label: 'Medium', price: 14.00 }, { label: 'Large', price: 18.00 }],
      isFeatured: true, tags: ['vegetarian', 'classic', 'italian'], order: 1,
    },
    {
      name: 'BBQ Chicken Pizza', nameAr: 'بيتزا دجاج باربكيو',
      description: 'Tender grilled chicken, red onions, and smoky BBQ sauce on a crispy thin crust.',
      category: c['Pizza'], subCategory: s['Special Pizza'],
      image: img('1571407970349-bc81e7e96d47'),
      basePrice: 13.00, discount: 10,
      sizes: [{ label: 'Medium', price: 13.00 }, { label: 'Large', price: 17.00 }],
      tags: ['chicken', 'bbq'], order: 2,
    },
    {
      name: 'Pepperoni Pizza', nameAr: 'بيتزا بيبروني',
      description: 'Loaded with premium pepperoni slices on a thick blanket of mozzarella cheese.',
      category: c['Pizza'], subCategory: s['Special Pizza'],
      image: img('1628840042765-356cda07504e'),
      basePrice: 12.50,
      isFeatured: true, tags: ['pepperoni', 'cheesy', 'popular'], order: 3,
    },

    /* ── Pasta ──────────────────────────────────────────── */
    {
      name: 'Pasta Arrabiata', nameAr: 'باستا أرابياتا',
      description: 'Penne in a fiery tomato sauce with garlic, chilli flakes and fresh parsley.',
      category: c['Pasta'],
      image: img('1563379926898-05f4575a45d8'),
      basePrice: 8.00,
      tags: ['spicy', 'italian', 'vegetarian'], order: 1,
    },
    {
      name: 'Creamy Chicken Pasta', nameAr: 'باستا كريمة بالدجاج',
      description: 'Fettuccine in a rich Alfredo cream sauce with grilled chicken strips and parmesan.',
      category: c['Pasta'],
      image: img('1555949258-eb67b1ef0ceb'),
      basePrice: 9.50, discount: 5,
      isFeatured: true, tags: ['chicken', 'creamy'], order: 2,
    },
    {
      name: 'Pesto Pasta', nameAr: 'باستا بيستو',
      description: 'Trofie pasta tossed in fresh basil pesto with sun-dried tomatoes and toasted pine nuts.',
      category: c['Pasta'],
      image: img('1473093295043-cae9f6a95f56'),
      basePrice: 8.50,
      tags: ['vegetarian', 'pesto'], order: 3,
    },

    /* ── Desserts ───────────────────────────────────────── */
    {
      name: 'Chocolate Lava Cake', nameAr: 'كيك الشوكولاتة البركاني',
      description: 'Warm dark chocolate cake with a molten centre, served with a scoop of vanilla ice cream.',
      category: c['Desserts'],
      image: img('1606313564200-e75d5e30476c'),
      basePrice: 5.50,
      isFeatured: true, tags: ['chocolate', 'warm', 'popular'], order: 1,
    },
    {
      name: 'Kunafa', nameAr: 'كنافة',
      description: 'Traditional Middle Eastern dessert — crispy kataifi pastry with sweet akkawi cheese, soaked in rose water syrup.',
      category: c['Desserts'],
      image: img('1617196034183-421b4040ed20'),
      basePrice: 4.50, discount: 10,
      tags: ['arabic', 'sweet', 'traditional'], order: 2,
    },
    {
      name: 'New York Cheesecake', nameAr: 'تشيز كيك نيويورك',
      description: 'Dense and creamy classic cheesecake on a graham cracker crust, topped with fresh strawberry sauce.',
      category: c['Desserts'],
      image: img('1533134242788-eba9c61e6b1e'),
      basePrice: 5.00,
      tags: ['cold', 'creamy'], order: 3,
    },
    {
      name: 'Umm Ali', nameAr: 'أم علي',
      description: 'Classic Egyptian dessert — layers of puff pastry, cream, nuts and raisins baked until golden.',
      category: c['Desserts'],
      image: img('1551024709-8f23befc1b48'),
      basePrice: 4.00,
      tags: ['arabic', 'warm', 'traditional'], order: 4,
    },

    /* ── Drinks ─────────────────────────────────────────── */
    {
      name: 'Mango Lemonade', nameAr: 'ليمونادة مانجو',
      description: 'Fresh-squeezed lemonade blended with ripe Alphonso mango and a sprig of mint.',
      category: c['Drinks'], subCategory: s['Cold Drinks'],
      image: img('1546173159-315724a31696'),
      basePrice: 3.50,
      isFeatured: true, tags: ['cold', 'fresh', 'fruit'], order: 1,
    },
    {
      name: 'Cappuccino', nameAr: 'كابتشينو',
      description: 'Rich double espresso with velvety steamed milk and a thick layer of microfoam.',
      category: c['Drinks'], subCategory: s['Hot Drinks'],
      image: img('1509042239860-f550ce710b93'),
      basePrice: 3.00,
      sizes: [{ label: 'Regular', price: 3.00 }, { label: 'Large', price: 4.00 }],
      tags: ['coffee', 'hot'], order: 2,
    },
    {
      name: 'Strawberry Milkshake', nameAr: 'ميلك شيك فراولة',
      description: 'Thick and creamy milkshake blended with fresh strawberries and vanilla ice cream.',
      category: c['Drinks'], subCategory: s['Cold Drinks'],
      image: img('1572490122747-3968b75cc699'),
      basePrice: 4.50, discount: 15,
      tags: ['cold', 'sweet', 'milkshake'], order: 3,
    },
    {
      name: 'Fresh Mint Lemonade', nameAr: 'ليمون بالنعناع',
      description: 'Refreshing cold-pressed lemonade with crushed fresh mint leaves and cane sugar.',
      category: c['Drinks'], subCategory: s['Cold Drinks'],
      image: img('1556679908-592b7de9b0df'),
      basePrice: 3.00,
      tags: ['cold', 'fresh', 'mint'], order: 4,
    },
  ];

  await Product.insertMany(products);
  console.log(`${products.length} products created`);

  const offers = [
    {
      title: '30% Off on Shrimp Noodles', titleAr: 'خصم 30% على نودلز الجمبري',
      description: 'Limited time offer — this weekend only!',
      discountPercent: 30, bgColor: '#F5C518',
      image: img('1585032226651-759b792d894e'),
      isActive: true, order: 1,
    },
    {
      title: 'Buy 1 Get 1 Burger', titleAr: 'اشتري برجر واحصل على آخر مجاناً',
      description: 'Every Friday only!',
      discountPercent: 50, bgColor: '#E84A5F',
      image: img('1568901346375-23c9450c58cd'),
      isActive: true, order: 2,
    },
    {
      title: '20% Off All Pizzas', titleAr: 'خصم 20% على جميع البيتزا',
      description: 'Weekends special deal',
      discountPercent: 20, bgColor: '#2A9D8F',
      image: img('1565299624946-b28f40a0ae38'),
      isActive: true, order: 3,
    },
  ];

  await Offer.insertMany(offers);
  console.log('Offers created');

  console.log('\n✅ Done!');
  console.log(`   Categories: ${cats.length} | SubCategories: ${subs.length} | Products: ${products.length} | Offers: ${offers.length}`);

  await mongoose.disconnect();
  process.exit(0);
}

seed().catch((err) => {
  console.error('Seed error:', err.message);
  process.exit(1);
});
