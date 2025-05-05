const mockQuery = jest.fn();
const mockRelease = jest.fn();

import {
  getAllUsers,
  createUser,
  getUserByEmail,
  updateUserPassword,
  getUserById,
  getUserByName,
  updateUser,
  deleteUser,
  updateUserAccount,
  deleteUserAccountByAdmin,
} from "../model/usermodel";

// Mockataan tietokantayhteys
jest.mock("../database/db", () => ({
  __esModule: true,
  default: {
    getConnection: jest.fn().mockResolvedValue({
      query: mockQuery,
      release: mockRelease,
    }),
  },
}));

beforeEach(() => {
  jest.clearAllMocks();
});

describe("usermodel", () => {
  it("getAllUsers palauttaa kaikki käyttäjät", async () => {
    mockQuery.mockResolvedValue([{ Id: 1, Email: "test@example.com" }]);
    const users = await getAllUsers();
    expect(users).toEqual([{ Id: 1, Email: "test@example.com" }]);
    expect(mockRelease).toHaveBeenCalled();
  });

  it("createUser luo uuden käyttäjän", async () => {
    mockQuery.mockResolvedValue({ insertId: 2 });
    const user = {
      name: "Testi",
      email: "test2@example.com",
      password: "salasana",
      user_level: "customer",
    };
    const result = await createUser(user);
    expect(mockQuery).toHaveBeenCalledWith(
      "INSERT INTO users (Username, Email, Password, User_level) VALUES (?, ?, ?, ?)",
      [user.name, user.email, user.password, user.user_level]
    );
    expect(result).toEqual({ insertId: 2 });
    expect(mockRelease).toHaveBeenCalled();
  });

  it("getUserByEmail palauttaa käyttäjän oikealla sähköpostilla", async () => {
    mockQuery.mockResolvedValue([{ Id: 1, Email: "test@example.com" }]);
    const user = await getUserByEmail("test@example.com");
    expect(user).toEqual({ Id: 1, Email: "test@example.com" });
    expect(mockRelease).toHaveBeenCalled();
  });

  it("updateUserPassword päivittää salasanan", async () => {
    mockQuery.mockResolvedValue(undefined);
    await updateUserPassword("test@example.com", "uusiSalasana");
    expect(mockQuery).toHaveBeenCalledWith(
      "UPDATE users SET password = ? WHERE email = ?",
      ["uusiSalasana", "test@example.com"]
    );
    expect(mockRelease).toHaveBeenCalled();
  });

  it("getUserById palauttaa käyttäjän id:llä", async () => {
    mockQuery.mockResolvedValue([{ Id: 3, Email: "id@example.com" }]);
    const user = await getUserById(3);
    expect(user).toEqual({ Id: 3, Email: "id@example.com" });
    expect(mockRelease).toHaveBeenCalled();
  });

  it("getUserByName palauttaa käyttäjän nimellä", async () => {
    mockQuery.mockResolvedValue([{ Id: 4, Username: "nimi" }]);
    const user = await getUserByName("nimi");
    expect(user).toEqual({ Id: 4, Username: "nimi" });
    expect(mockRelease).toHaveBeenCalled();
  });

  it("updateUser päivittää käyttäjän tiedot", async () => {
    mockQuery.mockResolvedValue(undefined);
    await updateUser(5, { username: "uusi", email: "uusi@example.com" });
    expect(mockQuery).toHaveBeenCalledWith(
      "UPDATE users SET Username = ?, Email = ? WHERE Id = ?",
      ["uusi", "uusi@example.com", 5]
    );
    expect(mockRelease).toHaveBeenCalled();
  });

  it("deleteUser poistaa käyttäjän", async () => {
    mockQuery.mockResolvedValue(undefined);
    await deleteUser(6);
    expect(mockQuery).toHaveBeenCalledWith(
      "DELETE FROM users WHERE Id = ?",
      [6]
    );
    expect(mockRelease).toHaveBeenCalled();
  });

  it("updateUserAccount päivittää käyttäjän tiedot adminille", async () => {
    mockQuery.mockResolvedValue(undefined);
    await updateUserAccount(7, {
      username: "admin",
      email: "admin@example.com",
      user_level: "admin",
    });
    expect(mockQuery).toHaveBeenCalledWith(
      "UPDATE users SET Username = ?, Email = ?, User_level = ? WHERE Id = ?",
      ["admin", "admin@example.com", "admin", 7]
    );
    expect(mockRelease).toHaveBeenCalled();
  });

  it("deleteUserAccountByAdmin poistaa käyttäjän adminina", async () => {
    mockQuery.mockResolvedValue(undefined);
    await deleteUserAccountByAdmin(8);
    expect(mockQuery).toHaveBeenCalledWith(
      "DELETE FROM users WHERE Id = ?",
      [8]
    );
    expect(mockRelease).toHaveBeenCalled();
  });
});
