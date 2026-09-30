const { Client } = require('pg');
const bcrypt = require('bcryptjs');
const env = require('../config/env');
const logger = require('../config/logger');
const ROLES = require('../constants/roles');

async function seed() {
  logger.info('Starting database seeding...');

  const client = new Client({
    host: env.DB.HOST,
    port: env.DB.PORT,
    user: env.DB.USER,
    password: env.DB.PASSWORD,
    database: env.DB.NAME
  });

  try {
    await client.connect();

    // 1. Seed Categories
    logger.info('Seeding categories...');
    const categories = [
      { name: 'Electronics', description: 'Gadgets, smartphones, laptops and accessories' },
      { name: 'Clothing', description: 'Men and Women fashion wear' },
      { name: 'Home & Kitchen', description: 'Household appliances, furniture and cookware' },
      { name: 'Books', description: 'Fiction, non-fiction, academic and technical books' },
      { name: 'Sports & Outdoors', description: 'Fitness gear, outdoor clothing and equipment' }
    ];

    for (const cat of categories) {
      await client.query(
        `INSERT INTO categories (name, description)
         VALUES ($1, $2)
         ON CONFLICT (name) DO NOTHING`,
        [cat.name, cat.description]
      );
    }

    // 2. Seed Users
    logger.info('Seeding default users...');
    const adminPasswordHash = await bcrypt.hash('Admin@123456', 10);
    const customerPasswordHash = await bcrypt.hash('Customer@123456', 10);

    await client.query(
      `INSERT INTO users (name, email, password_hash, role)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (email) DO NOTHING`,
      ['Admin User', 'admin@example.com', adminPasswordHash, ROLES.ADMIN]
    );

    await client.query(
      `INSERT INTO users (name, email, password_hash, role)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (email) DO NOTHING`,
      ['Demo Customer', 'customer@example.com', customerPasswordHash, ROLES.CUSTOMER]
    );

    // Get category IDs
    const catRows = (await client.query('SELECT id, name FROM categories')).rows;
    const catMap = {};
    catRows.forEach(c => { catMap[c.name] = c.id; });

    // 3. Seed Products
    logger.info('Seeding products...');
    const products = [
      {
        name: 'Wireless Noise-Cancelling Headphones',
        description: 'Premium over-ear Bluetooth headphones with active noise cancellation and 30-hour battery life.',
        price: 199.99,
        stock_quantity: 50,
        category_id: catMap['Electronics'],
        image_url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80'
      },
      {
        name: 'Mechanical Gaming Keyboard',
        description: 'RGB backlit mechanical keyboard with hot-swappable tactile switches.',
        price: 89.99,
        stock_quantity: 40,
        category_id: catMap['Electronics'],
        image_url: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&auto=format&fit=crop&q=80'
      },
      {
        name: '4K Ultra HD Action Camera',
        description: 'Waterproof 4K sports action camera with dual color screens and image stabilization.',
        price: 149.50,
        stock_quantity: 25,
        category_id: catMap['Electronics'],
        image_url: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=600&auto=format&fit=crop&q=80'
      },
      {
        name: 'Organic Cotton Crewneck T-Shirt',
        description: 'Ultra-soft 100% organic cotton t-shirt with modern slim fit styling.',
        price: 24.99,
        stock_quantity: 120,
        category_id: catMap['Clothing'],
        image_url: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=600&auto=format&fit=crop&q=80'
      },
      {
        name: 'Slim-Fit Stretch Denim Jeans',
        description: 'Classic durable denim with 2% elastane for comfortable everyday movement.',
        price: 49.99,
        stock_quantity: 80,
        category_id: catMap['Clothing'],
        image_url: 'https://images.unsplash.com/photo-1542272604-780c96856592?w=600&auto=format&fit=crop&q=80'
      },
      {
        name: 'Stainless Steel Pour-Over Coffee Maker',
        description: 'Thermal insulated stainless steel French press & pour-over coffee brewer.',
        price: 34.99,
        stock_quantity: 60,
        category_id: catMap['Home & Kitchen'],
        image_url: 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=600&auto=format&fit=crop&q=80'
      },
      {
        name: 'Clean Code: A Handbook of Agile Software Craftsmanship',
        description: 'Essential software engineering guide for building maintainable, robust code.',
        price: 38.50,
        stock_quantity: 100,
        category_id: catMap['Books'],
        image_url: 'https://images.unsplash.com/photo-1532012164546-f432f2e3edd4?w=600&auto=format&fit=crop&q=80'
      },
      {
        name: 'Stainless Steel Insulated Water Bottle (32oz)',
        description: 'Double-wall vacuum insulated sports water bottle keeping drinks cold for 24 hours.',
        price: 18.99,
        stock_quantity: 90,
        category_id: catMap['Sports & Outdoors'],
        image_url: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=600&auto=format&fit=crop&q=80'
      }
    ];

    for (const p of products) {
      await client.query(
        `INSERT INTO products (name, description, price, stock_quantity, category_id, image_url, is_active)
         VALUES ($1, $2, $3, $4, $5, $6, true)
         ON CONFLICT DO NOTHING`,
        [p.name, p.description, p.price, p.stock_quantity, p.category_id, p.image_url]
      );
    }

    logger.info('Database seeded successfully!');
  } catch (error) {
    logger.error('Error seeding database: %s', error.message);
    throw error;
  } finally {
    await client.end();
  }
}

if (require.main === module) {
  seed()
    .then(() => {
      logger.info('Seed finished.');
      process.exit(0);
    })
    .catch((err) => {
      logger.error('Seed script failed: %s', err.message);
      process.exit(1);
    });
}

module.exports = seed;
