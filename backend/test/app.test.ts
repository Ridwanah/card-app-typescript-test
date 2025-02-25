import { Entry, PrismaClient } from "@prisma/client";
import { server } from "../src/server";

const prisma = new PrismaClient();

// Dummy Entry for testing.
const testEntry: Omit<Entry, "id"> = {
  title: "Test Entry",
  description: "Testing.",
  created_at: new Date(),
  scheduled_date: new Date(),
};

describe("Test API Endpoints", () => {
  // Run before the tests.
  beforeAll(async () => {
    await prisma.$connect();
  });

  // Run before each test.
  beforeEach(async () => {
    await prisma.entry.deleteMany();
  });

  // Run after each test.
  afterEach(async () => {
    await prisma.$disconnect();
  });

  // Test that 'POST /create/' creates a new entry.
  it("Test create a new entry", async () => {
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

  // Test that 'PUT /update/:id' updates an existing entry.
  it("Test edit an existing entry", async () => {
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

  // Test that 'DELETE /delete/:id' deletes an entry.
  it("Test deleting an entry", async () => {
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

  // Test that 'GET /get/' retrieves all entries.
  it("Test get all entries", async () => {
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
});
