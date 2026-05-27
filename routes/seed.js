const router = require('express').Router();
const Category = require('../models/Category');
const SubCategory = require('../models/SubCategory');
const Product = require('../models/Product');
const Offer = require('../models/Offer');

const img = (id) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=500&q=80`;

router.post('/', async (req, res) => {
  if (req.headers['x-seed-key'] !== process.env.SEED_KEY) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    await Promise.all([
      Category.deleteMany({}),
      SubCategory.deleteMany({}),
      Product.deleteMany({}),
      Offer.deleteMany({}),
    ]);

    const cats = await Category.insertMany([
      { name: 'Biryani',  nameAr: 'برياني',   order: 1, image: img('1631452180519-c014fe946bc7'), isActive: true },
      { name: 'Burgers',  nameAr: 'برجر',      order: 2, image: img('1568901346375-23c9450c58cd'), isActive: true },
      { name: 'Pizza',    nameAr: 'بيتزا',     order: 3, image: img('1565299624946-b28f40a0ae38'), isActive: true },
      { name: 'Pasta',    nameAr: 'مكرونة',    order: 4, image: img('1555949258-eb67b1ef0ceb'), isActive: true },
      { name: 'Desserts', nameAr: 'حلويات',    order: 5, image: img('1606313564200-e75d5e30476c'), isActive: true },
      { name: 'Drinks',   nameAr: 'مشروبات',   order: 6, image: img('1509042239860-f550ce710b93'), isActive: true },
    ]);
    const c = {};
    cats.forEach((cat) => { c[cat.name] = cat._id; });

    const subs = await SubCategory.insertMany([
      { name: 'Chicken Biryani', nameAr: 'برياني دجاج',   category: c['Biryani'],  order: 1, isActive: true },
      { name: 'Mutton Biryani',  nameAr: 'برياني لحم',    category: c['Biryani'],  order: 2, isActive: true },
      { name: 'Veg Biryani',     nameAr: 'برياني خضار',   category: c['Biryani'],  order: 3, isActive: true },
      { name: 'Classic Burgers', nameAr: 'برجر كلاسيك',   category: c['Burgers'],  order: 1, isActive: true },
      { name: 'Smash Burgers',   nameAr: 'سماش برجر',     category: c['Burgers'],  order: 2, isActive: true },
      { name: 'Margherita',      nameAr: 'مارجريتا',      category: c['Pizza'],    order: 1, isActive: true },
      { name: 'Special Pizza',   nameAr: 'بيتزا خاصة',    category: c['Pizza'],    order: 2, isActive: true },
      { name: 'Hot Drinks',      nameAr: 'مشروبات ساخنة', category: c['Drinks'],   order: 1, isActive: true },
      { name: 'Cold Drinks',     nameAr: 'مشروبات باردة', category: c['Drinks'],   order: 2, isActive: true },
    ]);
    const s = {};
    subs.forEach((sub) => { s[sub.name] = sub._id; });

    const products = [
      { name: 'Hyderabadi Biryani', nameAr: 'برياني حيدر آباد', description: 'Aromatic spices, tender meat and fragrant basmati rice. A culinary masterpiece from Hyderabad.', category: c['Biryani'], subCategory: s['Chicken Biryani'], image: img('1631452180519-c014fe946bc7'), basePrice: 7.50, sizes: [{ label: 'Small', price: 7.50 }, { label: 'Half', price: 10.00 }, { label: 'Full', price: 14.00 }], isFeatured: true, tags: ['spicy', 'rice', 'popular'], order: 1, isActive: true },
      { name: 'Veg Dum Biryani', nameAr: 'برياني خضار دم', description: 'Fresh seasonal vegetables slow-cooked with aromatic basmati rice and saffron.', category: c['Biryani'], subCategory: s['Veg Biryani'], image: img('1596797038530-2c107229654b'), basePrice: 5.50, sizes: [{ label: 'Small', price: 5.50 }, { label: 'Full', price: 9.00 }], isFeatured: true, tags: ['vegetarian', 'rice'], order: 2, isActive: true },
      { name: 'Mutton Dum Biryani', nameAr: 'برياني لحم دم', description: 'Slow-cooked tender mutton with saffron-infused basmati rice and fried onions.', category: c['Biryani'], subCategory: s['Mutton Biryani'], image: img('1589302168068-964664d93dc0'), basePrice: 9.50, discount: 10, sizes: [{ label: 'Half', price: 9.50 }, { label: 'Full', price: 16.00 }], isFeatured: true, tags: ['mutton', 'premium'], order: 3, isActive: true },
      { name: 'Classic Smash Burger', nameAr: 'سماش برجر كلاسيك', description: 'Double smash beef patty with melted cheddar, pickles and secret sauce on a brioche bun.', category: c['Burgers'], subCategory: s['Smash Burgers'], image: img('1568901346375-23c9450c58cd'), basePrice: 8.50, discount: 15, sizes: [{ label: 'Single', price: 8.50 }, { label: 'Double', price: 11.50 }], isFeatured: true, tags: ['beef', 'cheese', 'popular'], order: 1, isActive: true },
      { name: 'Crispy Chicken Burger', nameAr: 'برجر دجاج مقرمش', description: 'Crispy fried chicken breast with crunchy coleslaw and honey mustard sauce.', category: c['Burgers'], subCategory: s['Classic Burgers'], image: img('1553979459-d1e1de0e2b18'), basePrice: 7.00, tags: ['chicken', 'crispy'], order: 2, isActive: true },
      { name: 'BBQ Bacon Burger', nameAr: 'برجر باربكيو', description: 'Juicy beef patty with smoky BBQ sauce, crispy onion rings and fresh jalapeños.', category: c['Burgers'], subCategory: s['Classic Burgers'], image: img('1586190848861-99aa4a171e90'), basePrice: 9.00, discount: 20, tags: ['beef', 'bbq', 'spicy'], order: 3, isActive: true },
      { name: 'Margherita Pizza', nameAr: 'بيتزا مارجريتا', description: 'Classic Neapolitan pizza with San Marzano tomato sauce and fresh mozzarella.', category: c['Pizza'], subCategory: s['Margherita'], image: img('1565299624946-b28f40a0ae38'), basePrice: 10.00, sizes: [{ label: 'Small', price: 10.00 }, { label: 'Medium', price: 14.00 }, { label: 'Large', price: 18.00 }], isFeatured: true, tags: ['vegetarian', 'classic'], order: 1, isActive: true },
      { name: 'BBQ Chicken Pizza', nameAr: 'بيتزا دجاج باربكيو', description: 'Tender grilled chicken, red onions and smoky BBQ sauce on a crispy thin crust.', category: c['Pizza'], subCategory: s['Special Pizza'], image: img('1571407970349-bc81e7e96d47'), basePrice: 13.00, discount: 10, sizes: [{ label: 'Medium', price: 13.00 }, { label: 'Large', price: 17.00 }], tags: ['chicken', 'bbq'], order: 2, isActive: true },
      { name: 'Pepperoni Pizza', nameAr: 'بيتزا بيبروني', description: 'Loaded with premium pepperoni slices on a thick blanket of mozzarella cheese.', category: c['Pizza'], subCategory: s['Special Pizza'], image: img('1628840042765-356cda07504e'), basePrice: 12.50, isFeatured: true, tags: ['pepperoni', 'cheesy', 'popular'], order: 3, isActive: true },
      { name: 'Creamy Chicken Pasta', nameAr: 'باستا كريمة بالدجاج', description: 'Fettuccine in a rich Alfredo cream sauce with grilled chicken strips and parmesan.', category: c['Pasta'], image: img('1555949258-eb67b1ef0ceb'), basePrice: 9.50, discount: 5, isFeatured: true, tags: ['chicken', 'creamy'], order: 1, isActive: true },
      { name: 'Pasta Arrabiata', nameAr: 'باستا أرابياتا', description: 'Penne in a fiery tomato sauce with garlic, chilli flakes and fresh parsley.', category: c['Pasta'], image: img('1563379926898-05f4575a45d8'), basePrice: 8.00, tags: ['spicy', 'vegetarian'], order: 2, isActive: true },
      { name: 'Chocolate Lava Cake', nameAr: 'كيك الشوكولاتة البركاني', description: 'Warm dark chocolate cake with a molten centre, served with vanilla ice cream.', category: c['Desserts'], image: img('1606313564200-e75d5e30476c'), basePrice: 5.50, isFeatured: true, tags: ['chocolate', 'warm', 'popular'], order: 1, isActive: true },
      { name: 'Kunafa', nameAr: 'كنافة', description: 'Crispy kataifi pastry with sweet akkawi cheese, soaked in rose water syrup.', category: c['Desserts'], image: img('1617196034183-421b4040ed20'), basePrice: 4.50, discount: 10, tags: ['arabic', 'sweet'], order: 2, isActive: true },
      { name: 'Mango Lemonade', nameAr: 'ليمونادة مانجو', description: 'Fresh-squeezed lemonade blended with ripe Alphonso mango and mint.', category: c['Drinks'], subCategory: s['Cold Drinks'], image: img('1546173159-315724a31696'), basePrice: 3.50, isFeatured: true, tags: ['cold', 'fresh'], order: 1, isActive: true },
      { name: 'Cappuccino', nameAr: 'كابتشينو', description: 'Rich double espresso with velvety steamed milk and thick microfoam.', category: c['Drinks'], subCategory: s['Hot Drinks'], image: img('1509042239860-f550ce710b93'), basePrice: 3.00, sizes: [{ label: 'Regular', price: 3.00 }, { label: 'Large', price: 4.00 }], tags: ['coffee', 'hot'], order: 2, isActive: true },
      { name: 'Strawberry Milkshake', nameAr: 'ميلك شيك فراولة', description: 'Thick and creamy milkshake blended with fresh strawberries and vanilla ice cream.', category: c['Drinks'], subCategory: s['Cold Drinks'], image: img('1572490122747-3968b75cc699'), basePrice: 4.50, discount: 15, tags: ['cold', 'sweet'], order: 3, isActive: true },
    ];
    await Product.insertMany(products);

    await Offer.insertMany([
      { title: '30% Off This Weekend', titleAr: 'خصم 30% هذا الأسبوع', description: 'Limited time offer!', discountPercent: 30, bgColor: '#F5C518', image: img('1585032226651-759b792d894e'), isActive: true, order: 1 },
      { title: 'Buy 1 Get 1 Burger', titleAr: 'اشتري برجر واحصل على آخر مجاناً', description: 'Every Friday only!', discountPercent: 50, bgColor: '#E84A5F', image: img('1568901346375-23c9450c58cd'), isActive: true, order: 2 },
      { title: '20% Off All Pizzas', titleAr: 'خصم 20% على جميع البيتزا', description: 'Weekend special!', discountPercent: 20, bgColor: '#2A9D8F', image: img('1565299624946-b28f40a0ae38'), isActive: true, order: 3 },
    ]);

    res.json({ message: 'Seeded successfully', categories: cats.length, products: products.length });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
