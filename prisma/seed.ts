// prisma/seed.ts
import { PrismaClient } from '@prisma/client';
import { addDays, setHours, setMinutes } from 'date-fns';

const prisma = new PrismaClient();

async function main() {
  const tenantId = 'demo';

  // ✅ Seed course types
  await prisma.courseType.createMany({
    data: [
      {
        title: 'Yoga',
        imageUrl: 'https://cdn.usegalileo.ai/sdxl10/a632d375-3572-4e02-a149-d3d08fc0d8a7.png',
        order: 1,
        tenantId,
      },
      {
        title: 'HIIT',
        imageUrl: 'https://cdn.usegalileo.ai/sdxl10/b1bd051d-b86f-4a85-83ef-49f5a537de64.png',
        order: 2,
        tenantId,
      },
      {
        title: 'Pilates',
        imageUrl: 'https://cdn.usegalileo.ai/sdxl10/8c3412d8-1583-4e69-b5df-6921a5f59500.png',
        order: 3,
        tenantId,
      },
      {
        title: 'Strength Training',
        imageUrl: 'https://cdn.usegalileo.ai/sdxl10/b1bd051d-b86f-4a85-83ef-49f5a537de64.png',
        order: 4,
        tenantId,
      },
    ],
    skipDuplicates: true,
  });

  const allCourseTypes = await prisma.courseType.findMany({ where: { tenantId } });

  // ✅ Seed instructors
  await prisma.instructor.createMany({
    data: [
      { id: '100000001', fullName: 'Noor', imageUrl: 'https://randomuser.me/api/portraits/women/1.jpg', tenantId },
      { id: '100000002', fullName: 'Lena', imageUrl: 'https://randomuser.me/api/portraits/women/2.jpg', tenantId },
      { id: '100000003', fullName: 'Anastasia', imageUrl: 'https://randomuser.me/api/portraits/women/3.jpg', tenantId },
    ],
    skipDuplicates: true,
  });

  const allInstructors = await prisma.instructor.findMany({ where: { tenantId } });

  const instructorMap = Object.fromEntries(allInstructors.map(i => [i.fullName, i.id]));
  const courseTypeMap = Object.fromEntries(allCourseTypes.map(c => [c.title, c.id]));

  // ✅ Seed InstructorCourse relations
  await prisma.instructorCourse.createMany({
    data: [
      { instructorId: instructorMap['Noor'], courseTypeId: courseTypeMap['Yoga'], tenantId },
      { instructorId: instructorMap['Noor'], courseTypeId: courseTypeMap['HIIT'], tenantId },
      { instructorId: instructorMap['Noor'], courseTypeId: courseTypeMap['Pilates'], tenantId },
      { instructorId: instructorMap['Noor'], courseTypeId: courseTypeMap['Strength Training'], tenantId },
      { instructorId: instructorMap['Lena'], courseTypeId: courseTypeMap['Pilates'], tenantId },
      { instructorId: instructorMap['Anastasia'], courseTypeId: courseTypeMap['Pilates'], tenantId },
      { instructorId: instructorMap['Anastasia'], courseTypeId: courseTypeMap['Strength Training'], tenantId },
    ],
    skipDuplicates: true,
  });

  // ✅ Seed Sessions
  const sessionsData = [];
  const now = new Date();
  const durations = [45, 60];

  const instructorCourses = await prisma.instructorCourse.findMany();

  for (let i = 0; i < 7; i++) {
    const date = addDays(now, i);
    for (const [index, ic] of instructorCourses.entries()) {
      const dateTime = setMinutes(setHours(date, 9 + (index % 4) * 2), 0); // 9am, 11am, etc.
      sessionsData.push({
        courseTypeId: ic.courseTypeId,
        instructorId: ic.instructorId,
        dateTime,
        duration: durations[index % durations.length],
        totalSeats: 10,
        takenSeats: 0,
        tenantId,
      });
    }
  }

  await prisma.session.createMany({ data: sessionsData });
  const allSessions = await prisma.session.findMany({ where: { tenantId } });

  console.log(`✅ Seeded ${sessionsData.length} sessions`);

  // ✅ Seed Users
  await prisma.user.createMany({
    data: [
      { phoneNumber: '0501111111', fullName: 'Alice', tenantId },
      { phoneNumber: '0502222222', fullName: 'Bob', tenantId },
      { phoneNumber: '0503333333', fullName: 'Charlie', tenantId },
    ],
    skipDuplicates: true,
  });

  const allUsers = await prisma.user.findMany({ where: { tenantId } });

  // ✅ Seed Bookings randomly
  const bookingsData = [];

  for (const session of allSessions.slice(0, 15)) { // just seed first 15 sessions
    const usersToBook = allUsers.slice(0, Math.floor(Math.random() * allUsers.length + 1));
    for (const user of usersToBook) {
      bookingsData.push({
        userId: user.id,
        sessionId: session.id,
      });

      // Optional: update takenSeats (simplified)
      await prisma.session.update({
        where: { id: session.id },
        data: {
          takenSeats: {
            increment: 1,
          },
        },
      });
    }
  }

  await prisma.booking.createMany({
    data: bookingsData,
    skipDuplicates: true,
  });

  console.log(`✅ Seeded ${bookingsData.length} bookings`);

  // ✅ Seed Memberships
  const membershipsData = [
    {
      title: 'Starter Pack',
      price: 14900, // 149.00 shekels
      enabled: true,
      tenantId,
      components: [
        { title: 'Yoga', count: 2 },
        { title: 'Pilates', count: 1 },
      ],
    },
    {
      title: 'Pro Plan',
      price: 29900,
      enabled: true,
      tenantId,
      components: [
        { title: 'Yoga', count: 4 },
        { title: 'HIIT', count: 3 },
        { title: 'Strength Training', count: 2 },
      ],
    },
  ];

  for (const membership of membershipsData) {
    const created = await prisma.membership.create({
      data: {
        title: membership.title,
        price: membership.price,
        enabled: membership.enabled,
        tenantId: membership.tenantId,
        components: {
          create: membership.components.map((comp) => ({
            courseTypeId: courseTypeMap[comp.title],
            count: comp.count,
          })),
        },
      },
    });

    console.log(`✅ Seeded membership: ${created.title}`);
  }

  // ✅ Seed Payment Options
  await prisma.paymentOption.createMany({
    data: [
      { name: 'Cash' },
      { name: 'Credit Card' },
    ],
    skipDuplicates: true,
  });

  console.log(`✅ Seeded payment options`);

}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
