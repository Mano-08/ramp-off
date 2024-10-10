import prismadb from "@/lib/db";
async function getLeaderboard() {
    const users = await prismadb.user.findMany({
        where: {
          isSeller: false
        },
        orderBy: {
          createdAt: 'desc', // You can adjust this to order by other fields
        },
        select: {
          id: true,
          eoa: true,
          email: true,
        }
      });
  
    return users;
  }