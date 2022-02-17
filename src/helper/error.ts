// Creation d'un type d'erreur qui peut être appellée avec un code status et un message
export class ErrorHandler extends Error {
  statusCode: number;

  constructor(statusCode: number, message: string) {
    super();
    this.statusCode = statusCode;
    this.message = message;
  }
}

// Creation d'un middleware qui est appelé dans app.ts le plus tard possible. Il dispose d'un argument err, permettant de renvoyer tous les next(err) des autres middlewares vers celui-ci. Lors du throw new ErrorHandler(code, message), si le status du code est >= 500, on peut imaginer ajouter le message à un logger.
export const handleError = async (err: any, req: any, res: any, next: any) => {
  try {
    const message = err.message;
    const statusCode = err.statusCode || 500;

    return res.status(statusCode).json({
      status: "error",
      statusCode,
      message,
    });
  } catch (err) {
    return res.status(500).json({
      status: "error",
      statusCode: 500,
      message: "The server encountered a problem, please try again",
    });
  }
};
