// backend/src/seed-categories.js
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Category = require('./models/Category');
const connectDB = require('./config/database');

dotenv.config();

const categories = [
  {
    name: 'Powder Collection',
    nameMr: 'पावडर संग्रह',
    description: 'Pure and authentic spice powders for everyday cooking',
    descriptionMr: 'दैनंदिन स्वयंपाकासाठी शुद्ध आणि प्रमाणिक मसाला पावडर',
    status: 'ACTIVE',
    displayOrder: 1,
  },
  {
    name: 'Premium Masala Collection',
    nameMr: 'प्रीमियम मसाला संग्रह',
    description: 'Luxury spice blends for gourmet cooking',
    descriptionMr: 'गौरवपूर्ण स्वयंपाकासाठी लक्झरी मसाला मिश्रण',
    status: 'ACTIVE',
    displayOrder: 2,
  },
  {
    name: 'Papad Collection',
    nameMr: 'पापड संग्रह',
    description: 'Traditional and authentic papad varieties',
    descriptionMr: 'पारंपारिक आणि प्रमाणिक पापड वाण',
    status: 'ACTIVE',
    displayOrder: 3,
  },
  {
    name: 'Wadi Collection',
    nameMr: 'वडी संग्रह',
    description: 'Premium wadi and shevadi products',
    descriptionMr: 'प्रीमियम वडी आणि शेवडी उत्पादने',
    status: 'ACTIVE',
    displayOrder: 4,
  },
  {
    name: 'Pickle Collection',
    nameMr: 'लोणचे संग्रह',
    description: 'Authentic Indian pickles with traditional recipes',
    descriptionMr: 'पारंपरिक पाककृतींसह प्रमाणिक भारतीय लोणचे',
    status: 'ACTIVE',
    displayOrder: 5,
  },
  {
    name: 'Snacks Collection',
    nameMr: 'स्नॅक्स संग्रह',
    description: 'Delicious Indian snacks and wafers',
    descriptionMr: 'चवदार भारतीय स्नॅक्स आणि वेफर्स',
    status: 'ACTIVE',
    displayOrder: 6,
  },
];

const seedCategories = async () => {
  try {
    await connectDB();

    console.log('🗑️ Removing existing categories...');
    await Category.deleteMany({});

    console.log('📦 Creating categories...');
    const created = await Category.insertMany(categories);

    console.log(`✅ Created ${created.length} categories:`);
    created.forEach(cat => {
      console.log(`   - ${cat.name} (${cat.slug})`);
    });

    console.log('\n🎯 Categories seeded successfully!');
  } catch (error) {
    console.error('❌ Seeding failed:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('👋 Database connection closed.');
  }
};

seedCategories();