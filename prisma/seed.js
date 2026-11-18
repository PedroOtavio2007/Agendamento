const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const prisma = new PrismaClient();

const services = [
  { name: "Cabelo", durationMin: 45, priceCents: 4500 },
  { name: "Barba", durationMin: 30, priceCents: 3000 },
  { name: "Cabelo e Barba", durationMin: 75, priceCents: 7000 },
  { name: "Barba na Maquininha", durationMin: 20, priceCents: 2000 },
  { name: "Sobrancelha", durationMin: 15, priceCents: 1500 },
];

async function main() {
  for (const service of services) {
    const existing = await prisma.service.findFirst({ where: { name: service.name } });
    if (existing) await prisma.service.update({ where: { id: existing.id }, data: service });
    else await prisma.service.create({ data: service });
  }

  const passwordHash = await bcrypt.hash("Demo@1234", 10);
  await prisma.barber.upsert({
    where: { email: "demo@corte.com" },
    update: {
      name: "Barbeiro Demonstração",
      passwordHash,
      emailVerified: new Date(),
    },
    create: {
      name: "Barbeiro Demonstração",
      email: "demo@corte.com",
      passwordHash,
      emailVerified: new Date(),
    },
  });
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
