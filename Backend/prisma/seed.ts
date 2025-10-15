// backend/prisma/seed.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Clear existing data
  await prisma.like.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.post.deleteMany();
  await prisma.user.deleteMany();

  // Create users
  const user1 = await prisma.user.create({
    data: {
      email: 'john@hiddenbites.com',
      name: 'John Doe',
      avatar: 'https://i.pravatar.cc/150?img=1',
      bio: 'Food lover & restaurant explorer 🍕',
    },
  });

  const user2 = await prisma.user.create({
    data: {
      email: 'jane@hiddenbites.com',
      name: 'Jane Smith',
      avatar: 'https://i.pravatar.cc/150?img=2',
      bio: 'Culinary adventurer ✨',
    },
  });

  const user3 = await prisma.user.create({
    data: {
      email: 'mike@hiddenbites.com',
      name: 'Mike Wilson',
      avatar: 'https://i.pravatar.cc/150?img=3',
      bio: 'Street food enthusiast 🌮',
    },
  });

  console.log('✓ Created 3 users');

  // Create posts
  const post1 = await prisma.post.create({
    data: {
      title: 'Nasi Goreng Pak Budi - Hidden Gem!',
      description:
        'Terbaik banget! Nasi gorengnya punya cita rasa khas yang gak bakal kalian temuin di tempat lain. Bumbu-bumbu tradisional yang dikombinasikan dengan sempurna. Highly recommended! 🔥',
      location: 'Jl. Sudirman No. 45, Surabaya',
      imageUrl: 'https://images.unsplash.com/photo-1585238341710-4dd0e06651aa?w=400&h=300&fit=crop',
      userId: user1.id,
    },
  });

  const post2 = await prisma.post.create({
    data: {
      title: 'Soto Ayam Malang di Warung Kecil',
      description:
        'Warung kecil di pinggir jalan, tapi soto ayamnya mantap! Kuah yang gurih, ayamnya empuk, dan harganya super terjangkau. Sarapan terbaik untuk memulai hari.',
      location: 'Jl. Ahmad Yani, Malang',
      imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop',
      userId: user2.id,
    },
  });

  const post3 = await prisma.post.create({
    data: {
      title: 'Bakso Urat Premium - Gak Kecewa!',
      description:
        'Bakso dengan urat yang super empuk, kuah kaldu yang komplit dengan tulang dan daging. Topping melimpah dan fresh. Ini adalah bakso terbaik yang pernah aku makan!',
      location: 'Jl. Basuki Rahmat, Jakarta',
      imageUrl: 'https://images.unsplash.com/photo-1626082927389-6cd097cfd330?w=400&h=300&fit=crop',
      userId: user3.id,
    },
  });

  const post4 = await prisma.post.create({
    data: {
      title: 'Lumpia Goreng - Gurih dan Renyah',
      description:
        'Lumpia goreng dengan isi yang berlimpah, digulung dengan tangan, dan digoreng sampai sempurna. Krusnya maksimal, isiannya enak. Bisa pesan dalam jumlah banyak!',
      location: 'Jl. Merdeka, Bandung',
      imageUrl: 'https://images.unsplash.com/photo-1603894542802-f36b51700152?w=400&h=300&fit=crop',
      userId: user1.id,
    },
  });

  const post5 = await prisma.post.create({
    data: {
      title: 'Gado-Gado Sederhana Tapi Lezat',
      description:
        'Gado-gado tradisional dengan bumbu kacang yang homemade. Sayuran fresh, tahu goreng crispy, dan telur rebus yang pas. Ini hidden gem yang paling sering aku kunjungi!',
      location: 'Jl. Diponegoro, Yogyakarta',
      imageUrl: 'https://images.unsplash.com/photo-1609501676725-7186f017a4b6?w=400&h=300&fit=crop',
      userId: user2.id,
    },
  });

  console.log('✓ Created 5 posts');

  // Create comments
  await prisma.comment.create({
    data: {
      text: 'Wah kelihatannya enak banget! Kapan-kapan mau cobain 🤤',
      userId: user2.id,
      postId: post1.id,
    },
  });

  await prisma.comment.create({
    data: {
      text: 'Sudah pernah coba, tapi emang bakunya agak kecil sih',
      userId: user3.id,
      postId: post1.id,
    },
  });

  await prisma.comment.create({
    data: {
      text: 'Ini benar-benar hidden gem! Thx udah share 👍',
      userId: user1.id,
      postId: post2.id,
    },
  });

  await prisma.comment.create({
    data: {
      text: 'Harga berapa? Mau booking gimana caranya?',
      userId: user3.id,
      postId: post3.id,
    },
  });

  console.log('✓ Created 4 comments');

  // Create likes
  await prisma.like.create({
    data: {
      userId: user2.id,
      postId: post1.id,
    },
  });

  await prisma.like.create({
    data: {
      userId: user3.id,
      postId: post1.id,
    },
  });

  await prisma.like.create({
    data: {
      userId: user1.id,
      postId: post2.id,
    },
  });

  await prisma.like.create({
    data: {
      userId: user2.id,
      postId: post2.id,
    },
  });

  await prisma.like.create({
    data: {
      userId: user3.id,
      postId: post2.id,
    },
  });

  await prisma.like.create({
    data: {
      userId: user1.id,
      postId: post3.id,
    },
  });

  await prisma.like.create({
    data: {
      userId: user2.id,
      postId: post3.id,
    },
  });

  await prisma.like.create({
    data: {
      userId: user1.id,
      postId: post4.id,
    },
  });

  await prisma.like.create({
    data: {
      userId: user3.id,
      postId: post5.id,
    },
  });

  console.log('✓ Created 9 likes');

  console.log('✅ Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });