import { createServer } from "../src/services/utils/server";
import { productTestInterface } from "./interfaces/product";
const request = require("supertest");

// Gabarit d'erreur généré par le middleware de gestion des erreurs
const expectedError = {
  status: "error",
  statusCode: expect.any(Number),
  message: expect.any(String),
};

// TEST du routeur complet /product
describe(`ROUTE PRODUCT`, () => {
  let app: any;
  let res: any;
  let createdTestProductId: number;
  let createdTestProductId2: number;

  // Création d'une instance Express
  beforeAll(async () => {
    try {
      app = await createServer();
    } catch (error) {
      console.log(error);
    }
  });
  // Création d'un product test en base de données
  beforeAll(async () => {
    res = await request(app).post("/product").send({
      name: "produit de test",
      price: 10,
      category: "catégorie de test",
      description: "un produit pour faire plein de tests",
    });
    createdTestProductId = res.body._id;
  });

  describe(`GET /product/:productId`, () => {
    describe("When existing product id is sent", () => {
      beforeAll(async () => {
        res = await request(app).get(`/product/${createdTestProductId}`);
      });
      it("returns status 200", async () => {
        expect(res.status).toBe(200);
      });
      it("the returned body is a product interface object", async () => {
        productTestInterface.hasOwnProperty(res.body);
      });
    });
    describe("When product does not exist", () => {
      beforeAll(async () => {
        res = await request(app).get(`/product/620e81f18aba0fc9ec1aae04`);
      });
      it("returns status 404", async () => {
        expect(res.status).toBe(404);
      });
      it("the returned body is an error object", async () => {
        expect(res.body).toMatchObject(expectedError);
      });
    });
  });

  describe(`POST /product`, () => {
    describe("When all required field are sent", () => {
      beforeAll(async () => {
        res = await request(app).post("/product").send({
          name: "nouveau produit de test",
          price: 10,
          category: "catégorie de test",
          description: "un nouveau produit pour faire plein de tests",
        });
        createdTestProductId2 = res.body.id;
      });
      it("returns status 200", async () => {
        expect(res.status).toBe(201);
      });
      it("the returned body is a product interface object", async () => {
        productTestInterface.hasOwnProperty(res.body);
      });
    });
    describe("When a required field is missing", () => {
      beforeAll(async () => {
        res = await request(app).post("/product").send({
          name: "produit sans caractéristique",
        });
      });
      it("returns status 400", async () => {
        expect(res.status).toBe(400);
      });
      it("the returned body is an error object", async () => {
        expect(res.body).toMatchObject(expectedError);
      });
    });
    afterAll(async () => {
      await request(app).delete(`/${createdTestProductId2}`);
    });
  });

  describe(`PUT /product/:productId`, () => {
    beforeAll(async () => {
      const test = await request(app)
        .put(`/product/${createdTestProductId}`)
        .send({
          name: "produit mis à jour",
        });
      res = await request(app).get(`/product/${createdTestProductId}`);
    });
    it("returns status 200", async () => {
      expect(res.status).toBe(200);
    });
    it("the returned body name is updated", async () => {
      expect(res.body.name).toBe("produit mis à jour");
    });
  });

  afterAll(async () => {
    await request(app).delete(`/${createdTestProductId}`);
  });
});
