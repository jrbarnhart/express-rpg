# Express Backend For Pet Based RPG

This project is a simple REST API that allows users to create and interact with virtual pets, or at least the data that represents them.

Created using Express.js, Prisma, Postgres, and TypeScript.

## Description

This application allows for the creation and management of user accounts and their associated pets. Only users with admin access can create the records that Pets rely on, such as Species and Colors.

All users can create pets, interact with them, and get basic info on other pets and users. Users can also battle against NPCs (NYI).

Express middleware is used to verify authentication and to mediate game actions, such as only allowing for the creation of pets or starting of battles under specific conditions.

This API is intended to be used with a frontend application (coming soon).
