import Database from '../factories/Database';

export class InstructorRepository {
  private prisma = Database.getInstance();

  async findAll(tenantId: string) {
    return this.prisma.instructor.findMany({
      where: { tenantId },
      include: {
        courses: {
          include: {
            courseType: true,
          },
        },
      },
      orderBy: { fullName: 'asc' },
    });
  }
}
