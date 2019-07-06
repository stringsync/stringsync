const { prisma } = require("./generated/prisma-client");

const run = async () => {
  const users = await prisma.users();
  console.log(`users: ${JSON.stringify(users)}`);
};

run()
  .then(() => process.exit(0))
  .catch(console.error);
