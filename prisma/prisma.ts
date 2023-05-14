// import { PrismaClient } from '@prisma/client';

// declare global {
//   namespace NodeJS {
//     interface Global {
//       prisma: PrismaClient;
//     }
//   }
// }

// let prisma: PrismaClient;

// if (typeof window === 'undefined') {
//   if (process.env.NODE_ENV === 'production') {
//     prisma = new PrismaClient();
//   } else {
//     if (!global.prisma) {
//       global.prisma = new PrismaClient();
//     }

//     prisma = global.prisma;
//   }
// }

// // if (process.env.NODE_ENV === 'production') {
// //   prisma = new PrismaClient();
// // } else {
// //   // ts-ignore
// //   if (!global.prisma) {
// //     global.prisma = new PrismaClient();
// //   }
// //   prisma = global.prisma;
// // }

// export default prisma;

// import { Prisma, PrismaClient } from '@prisma/client';

// declare global {
//   namespace NodeJS {
//     interface Global {
//       prisma: PrismaClient;
//     }
//   }
// }

// let prisma: PrismaClient;

// if (typeof window === 'undefined') {
//   if (process.env.NODE_ENV === 'production') {
//     prisma = new PrismaClient();
//   } else {
//     if (!global.prisma) {
//       global.prisma = new PrismaClient();
//     }
//     prisma = global.prisma;
//   }
// }

// // @ts-ignore
// export default prisma;

// import { PrismaClient } from '@prisma/client';

// let prisma: PrismaClient;

// if (typeof window === 'undefined') {
//   if (process.env.NODE_ENV === 'production') {
//     prisma = new PrismaClient();
//   } else {
//     if (!global.prisma) {
//       global.prisma = new PrismaClient();
//     }

//     prisma = global.prisma;
//   }
// }

// // @ts-ignore
// export default prisma;

// import { PrismaClient } from '@prisma/client';

// declare const global: Global & { prisma?: PrismaClient };

// export let prisma: PrismaClient;

// if (typeof window === 'undefined') {
//   if (process.env['NODE_ENV'] === 'production') {
//     prisma = new PrismaClient();
//   } else {
//     if (!global.prisma) {
//       global.prisma = new PrismaClient();
//     }
//     prisma = global.prisma;
//   }
// }

// import { Prisma, PrismaClient } from '@prisma/client';

// declare global {
//   namespace NodeJS {
//     interface Global {
//       prisma: PrismaClient;
//     }
//   }
// }

// let prisma: PrismaClient;

// if (typeof window === 'undefined') {
//   if (process.env.NODE_ENV === 'production') {
//     prisma = new PrismaClient();
//   } else {
//     if (!global.prisma) {
//       global.prisma = new PrismaClient();
//     }

//     prisma = global.prisma;
//   }
// }

// export default prisma;

// import { PrismaClient } from '@prisma/client';
// declare global {
//   // allow global `var` declarations
//   // eslint-disable-next-line no-var
//   var prisma: PrismaClient | undefined;
// }

// let prisma: PrismaClient;

// if (typeof window === 'undefined') {
//   if (process.env.NODE_ENV === 'production') {
//     prisma = new PrismaClient();
//   } else {
//     if (!global.prisma) {
//       global.prisma = new PrismaClient();
//     }

//     prisma = global.prisma;
//   }
// }
// //@ts-ignore
// export default prisma;
