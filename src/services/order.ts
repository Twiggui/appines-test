const ObjectId = require("mongoose").Types.ObjectId;
import { ErrorHandler } from "../helper/error";
import { Iorder } from "../interfaces/order";

export default class OrderServices {
  static createOne = async (orderModel: any, orderDatas: Iorder) => {
    try {
      const newOrder = new orderModel(orderDatas);
      const result = await newOrder.save();

      return result;
    } catch (error) {
      throw new ErrorHandler(error.statusCode, error.message);
    }
  };

  static getOne = async (orderModel: any, idOrder: string) => {
    try {
      const [result] = await orderModel.find({ _id: ObjectId(idOrder) });

      return result;
    } catch (error) {
      throw new ErrorHandler(error.statusCode, error.message);
    }
  };

  static get = async (
    orderModel: any,
    startDate: Date,
    endDate: Date,
    includedProducts: string[],
    minimalPrice: number,
    sort: any,
    pageNumber: number,
    numberPerPage: number
  ) => {
    try {
      // pipeline stages
      // Prix plus grands
      const queryBuilder_greaterThanPrice = {
        $match: {
          price: {
            $gte: minimalPrice,
          },
        },
      };
      // Dans la date donnée
      const queryBuilder_date = {
        $match: {
          $and: [{ date: { $gte: startDate } }, { date: { $lte: endDate } }],
        },
      };
      // Contenant les articles
      const queryBuilder_includeProducts = {
        $match: {
          "productList.productId": {
            $in: includedProducts,
          },
        },
      };
      // Pagination
      const queryBuilder_pagination = [
        {
          $skip: pageNumber > 0 ? (pageNumber - 1) * numberPerPage : 0,
        },
        { $limit: numberPerPage },
      ];
      // Count
      const queryBuilder_resultCount = {
        $count: "NumberOfResults",
      };
      // Sort
      const queryBuilder_sort = {
        $sort: sort,
      };

      // Initialisation des query builders. Count permettra de renvoyer le nombre de résultats trouvés sans tenir compte des paramètres de pagination
      // Une constante est dédiée à la requête renvoyant le nombre de résultats
      let queryBuilder: any[] = [];
      let queryBuilderCount: any[] = [];
      let numberOfResults: number | null = null;

      // Ajout des étapes du pipeline en fonction des paramétres demandés
      if (startDate && endDate) {
        queryBuilder.push(queryBuilder_date);
        queryBuilderCount.push(queryBuilder_date);
      }
      if (minimalPrice) {
        queryBuilder.push(queryBuilder_greaterThanPrice);
        queryBuilderCount.push(queryBuilder_greaterThanPrice);
      }
      if (includedProducts) {
        queryBuilder.push(queryBuilder_includeProducts);
        queryBuilderCount.push(queryBuilder_includeProducts);
      }
      if (sort) {
        queryBuilder.push(queryBuilder_sort);
        // comme c'est un système de tri pas besoin de rajouter cette étape dans le comptage de résultat. Ne pas décommenter la ligne ci-dessous
        // queryBuilderCounting.push(queryBuilder_sort);
      }

      queryBuilderCount.push(queryBuilder_resultCount);
      if (pageNumber && numberPerPage) {
        for (let i = 0; i < queryBuilder_pagination.length; i++) {
          queryBuilder.push(queryBuilder_pagination[i]);
        }
      }

      // Lancement des deux requête Mongo
      // Nota : les await sont lancés en parrallèle pour réduire le temps des requêtes

      const req_poiResult = orderModel.aggregate(queryBuilder);
      const req_poiResultCountReq = orderModel.aggregate(queryBuilderCount);

      const orderResult = await req_poiResult;
      const orderResultCount = await req_poiResultCountReq;

      orderResultCount.length
        ? (numberOfResults = orderResultCount[0].NumberOfResults)
        : (numberOfResults = 0);

      const result = {
        numberOfResults: numberOfResults,
        data: orderResult,
      };

      return result;
    } catch (error) {
      throw new ErrorHandler(error.statusCode, error.message);
    }
  };
}
