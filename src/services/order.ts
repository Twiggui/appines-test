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
    defaultOption: boolean,
    startDate: Date,
    endDate: Date,
    includedProducts: string[],
    minimalPrice: number,
    sort: any,
    selectField: any,
    pageNumber: number,
    numberPerPage: number
  ) => {
    try {
      // PIPELINE STAGES
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
      // Project
      const queryBuilder_project = {
        $project: selectField,
      };
      // default search (= get ALL)
      const queryBuilder_default = {
        $match: {},
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
        // Cette étape du pipeline n'interfère pas avec le calcul du nombre de résultat, inutile de la pousser dans le pipeline ci-dessous
        // queryBuilderCounting.push(queryBuilder_sort);
      }
      if (selectField) {
        queryBuilder.push(queryBuilder_project);
        // Cette étape du pipeline n'interfère pas avec le calcul du nombre de résultat, inutile de la pousser dans le pipeline ci-dessous
        // queryBuilderCounting.push(queryBuilder_project);
      }
      if (defaultOption) {
        queryBuilder.push(queryBuilder_default);
        queryBuilderCount.push(queryBuilder_default);
      }
      if (pageNumber && numberPerPage) {
        for (let i = 0; i < queryBuilder_pagination.length; i++) {
          queryBuilder.push(queryBuilder_pagination[i]);
        }
      }

      // Les étapes ci-dessous seront réalisées dans tous les cas
      queryBuilderCount.push(queryBuilder_resultCount);

      // Lancement des deux requête Mongo
      // Nota : les await sont lancés en parallèle pour réduire le temps des requêtes

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
