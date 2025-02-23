import { Entry, PrismaClient } from "@prisma/client";
import { server } from "../src/server";

const prisma = new PrismaClient();

beforeAll(async () => {
  await prisma.$executeRaw`CREATE TABLE IF NOT EXISTS "Entry" (
        id TEXT PRIMARY KEY,
        title TEXT,
        description TEXT,
        created_at DATETIME,
        scheduled_date DATETIME
      );`;
  await prisma.$connect();
});
beforeEach(async () => {
  await prisma.entry.deleteMany();
});

afterEach(async () => {
  await prisma.$disconnect();
});
const testEntry: Omit<Entry, "id"> = {
  title: "Test Entry",
  description: "Testing.",
  created_at: new Date(),
  scheduled_date: new Date(),
};

test("Test create a new entry", async () => {
  const response = await server.inject({
    method: "POST",
    url: "/create/",
    payload: testEntry,
  });
  expect(response.statusCode).toBe(200);

  const body = JSON.parse(response.body);
  expect(body.title).toBe(testEntry.title);
  expect(body.description).toBe(testEntry.description);
  expect(new Date(body.created_at)).toEqual(new Date(testEntry.created_at));
  expect(new Date(body.scheduled_date)).toEqual(new Date(testEntry.scheduled_date));
});

test("Test edit an existing entry", async () => {
  const newEntry = await server.inject({
    method: "POST",
    url: "/create/",
    payload: testEntry,
  });
  const createdEntry = JSON.parse(newEntry.body);
  const response = await server.inject({
    method: "PUT",
    url: `/update/${createdEntry.id}`,
    payload: { ...testEntry, title: "Updated Title" },
  });

  expect(response.statusCode).toBe(200);
  const getResponse = await server.inject({
    method: "GET",
    url: `/get/${createdEntry.id}`,
  });

  expect(getResponse.statusCode).toBe(200);
  const body = JSON.parse(getResponse.body);
  expect(body.title).toBe("Updated Title");
});

test("Test deleting an entry", async () => {
  const newEntry = await server.inject({
    method: "POST",
    url: "/create/",
    payload: testEntry,
  });
  const createdEntry = JSON.parse(newEntry.body);
  const response = await server.inject({
    method: "DELETE",
    url: `/delete/${createdEntry.id}`,
  });
  expect(response.statusCode).toBe(200);

  const getResponse = await server.inject({
    method: "GET",
    url: `/get/${createdEntry.id}`,
  });
  expect(getResponse.statusCode).toBe(500);
});

test("Test get all entries", async () => {
  await server.inject({
    method: "POST",
    url: "/create/",
    payload: testEntry,
  });
  await server.inject({
    method: "POST",
    url: "/create/",
    payload: testEntry,
  });
  const response = await server.inject({
    method: "GET",
    url: "/get/",
  });
  expect(response.statusCode).toBe(200);
  const entries = JSON.parse(response.body);
  expect(entries.length).toBe(2);
});
